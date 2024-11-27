package internal

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"strconv"
	"strings"
	"time"

	"github.com/containerd/cgroups/v2/cgroup2"
	"github.com/containerd/cgroups/v2/cgroup2/stats"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

var Docker *client.Client
var ContainerHostConfig = &container.HostConfig{
	Resources: container.Resources{
		Memory:       512 * 1024 * 1024,
		MemorySwap:   64 * 1024 * 1024,
		CPUPeriod:    100000,  // microseconds
		CPUQuota:     1000000, // 10 seconds (100000 * 10)
		CgroupParent: "sandbox.slice",
	},
	NetworkMode: network.NetworkNone,
	// Additional security options
	SecurityOpt: []string{
		"no-new-privileges",
		"seccomp=unconfined",
	},
	// Readonly root filesystem
	ReadonlyRootfs: true,
}
var DefaultExecutionTimeLimit = time.Second * 20 // wall time

type ExecutionResult struct {
	ExitCode int64           `json:"exitCode"`
	Stdout   string          `json:"stdout"`
	Stderr   string          `json:"-"`
	Metrics  ResourceMetrics `json:"metrics"`
}

func ExecuteInContainer(ctx context.Context, imageName string, cmd []string, stdin *[]byte) (*ExecutionResult, error) {
	// Create container config
	wrappedCmd := fmt.Sprintf(`
	{
			# Create files for metrics
			touch /tmp/metrics.log
			touch /tmp/real.stderr
			
			# Start process monitoring in background
			{
					while true; do
							ps -o pid,ppid,rss,vsz,pcpu,comm -C sh >> /tmp/process_stats.log 2>/dev/null
							sleep 0.1
					done
			} &
			MONITOR_PID=$!

			# Redirect original stderr to our metrics file
			exec 3>&2              # Save original stderr
			exec 2>/tmp/metrics.log
			
			START_TIME=$(date +%s.%N)
			
			# Execute the actual command with stderr going to real.stderr
			{ %s; } 2>/tmp/real.stderr
			EXIT_CODE=$?
			
			END_TIME=$(date +%s.%N)
			WALL_TIME=$(echo "$END_TIME - $START_TIME" | bc)
			
			# Kill the monitoring process
			kill $MONITOR_PID

			# Collect metrics
			{
					echo "Command exit code: $EXIT_CODE"
					echo "Wall clock time: $WALL_TIME"
					echo "=== Process Status ==="
					cat /proc/self/status
					echo "=== I/O Statistics ==="
					cat /proc/self/io
					echo "=== Process Statistics ==="
					cat /tmp/process_stats.log
			} >&2  # Send to our metrics log
			
			# Restore original stderr
			exec 2>&3
			
			# Output the real stderr content
			cat /tmp/real.stderr >&2
			
			exit $EXIT_CODE
	}
`, strings.Join(cmd, " && "))

	config := &container.Config{
		Image:        imageName,
		Cmd:          []string{"/bin/sh", "-c", wrappedCmd},
		AttachStdin:  true,
		AttachStdout: true,
		AttachStderr: true,
		Tty:          false,
		OpenStdin:    true,
		StdinOnce:    true,
	}
	res := cgroup2.Resources{}
	_, err := cgroup2.NewSystemd("/", "sandbox.slice", -1, &res)
	if err != nil {
		return nil, err
	}

	resp, err := Docker.ContainerCreate(ctx, config, ContainerHostConfig, nil, nil, "")
	if err != nil {
		return nil, fmt.Errorf("failed to create container: %v", err)
	}
	defer func() {
		// Cleanup: remove container after execution
		removeOptions := container.RemoveOptions{
			Force: true,
		}
		_ = Docker.ContainerRemove(ctx, resp.ID, removeOptions)
	}()

	// Attach to container
	attachResp, err := Docker.ContainerAttach(ctx, resp.ID, container.AttachOptions{
		Stdin:  true,
		Stdout: true,
		Stderr: true,
		Stream: true,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to attach to container: %v", err)
	}
	defer attachResp.Close()

	go func() {
		defer attachResp.CloseWrite()
		if stdin != nil {
			io.Copy(attachResp.Conn, strings.NewReader(string(*stdin)))
		}
	}()

	// Start container
	if err := Docker.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return nil, fmt.Errorf("failed to start container: %v", err)
	}

	var mem *MemoryMetrics
	var maxMem uint64
	var lowMem uint64
	var allMem []int32
	var iom = IOMetrics{}
	var timeoutSignal = make(chan bool)
	go func() {
		tick := time.NewTicker(50 * time.Millisecond)
		for {
			select {
			case <-tick.C:
				memtmp, iotmp, _ := getCgroupMetrics(resp.ID)
				if memtmp != nil {
					maxMem = max(memtmp.Latest, maxMem)
					if lowMem == 0 {
						lowMem = memtmp.Latest
					} else {
						lowMem = min(memtmp.Latest, lowMem)
					}
					allMem = append(allMem, int32(memtmp.Latest))
					mem = memtmp
				}
				if len(iotmp) > 0 {
					var lat = iotmp[len(iotmp)-1]
					iom.ReadBytes = lat.Rbytes
					iom.WriteBytes = lat.Wbytes
					iom.ReadCount = lat.Rios
					iom.WriteCount = lat.Wios
				}
			case <-timeoutSignal:
				return
			}
		}
	}()
	// Create buffers for stdout and stderr
	stdoutBuf := new(bytes.Buffer)
	stderrBuf := new(bytes.Buffer)
	// Copy container output to buffers
	outputDone := make(chan error)
	go func() {
		_, err := stdcopy.StdCopy(stdoutBuf, stderrBuf, attachResp.Reader)
		outputDone <- err
	}()

	// Wait for container to finish
	statusCh, errCh := Docker.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	var result ExecutionResult
	select {
	case err := <-errCh:
		slog.Error("error waiting for container startup: %v", "error", err)
		return nil, err
	case status := <-statusCh:
		if status.Error != nil {
			slog.Error("error in docker container: %s", "error", status.Error.Message)
			return nil, fmt.Errorf(status.Error.Message)
		}
		if err := <-outputDone; err != nil {
			slog.Error("error reading submission output", "error", status.Error.Message)
			return nil, fmt.Errorf("error reading output: %v", err)
		}

		stdoutStr := stdoutBuf.String()
		stderrStr := stderrBuf.String()

		metrics := parseMetrics(stderrStr)
		if mem != nil {
			metrics.Memory = mem
			metrics.Memory.Max = maxMem
			metrics.Memory.Min = lowMem
			metrics.Memory.All = allMem
		}
		metrics.IO = iom

		realStderr := ""
		if parts := strings.Split(stderrStr, "=== Real STDERR ==="); len(parts) > 1 {
			realStderr = parts[1]
		}

		result.ExitCode = status.StatusCode
		result.Stdout = stdoutStr
		result.Stderr = realStderr
		result.Metrics = metrics

	case <-time.After(DefaultExecutionTimeLimit):
		timeoutSignal <- true
		return nil, ExecutionTimeoutError{}
	}

	return &result, nil
}

func parseMetrics(timeOutput string) ResourceMetrics {
	metrics := ResourceMetrics{}

	lines := strings.Split(timeOutput, "\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)

		switch {
		case strings.Contains(line, "Wall clock time:"):
			timeStr := strings.TrimPrefix(line, "Wall clock time:")
			metrics.Wall, _ = strconv.ParseFloat(strings.TrimSpace(timeStr), 64)

		case strings.Contains(line, "VmPeak:"):
			// Memory metrics parsing
			valueStr := strings.Fields(line)[1]
			value, _ := strconv.ParseUint(valueStr, 10, 64)
			if metrics.Memory == nil {
				metrics.Memory = &MemoryMetrics{}
			}
			metrics.Memory.Max = value * 1024 // Convert from KB to bytes

		case strings.Contains(line, "voluntary_ctxt_switches:"):
			valueStr := strings.Fields(line)[1]
			metrics.VoluntaryCtxt, _ = strconv.ParseUint(valueStr, 10, 64)

		case strings.Contains(line, "nonvoluntary_ctxt_switches:"):
			valueStr := strings.Fields(line)[1]
			metrics.InvoluntaryCtxt, _ = strconv.ParseUint(valueStr, 10, 64)
		}
	}
	return metrics
}
func getCgroupMetrics(containerID string) (*MemoryMetrics, []*stats.IOEntry, error) {

	manager, err := cgroup2.LoadSystemd("sandbox.slice", fmt.Sprintf("docker-%s.scope", containerID))
	if err != nil {
		slog.Error("failed to load systemd cgroup", "error", err)
		return &MemoryMetrics{}, nil, err
	}

	metrics, err := manager.Stat()
	if err != nil {
		return &MemoryMetrics{}, nil, err
	}

	memMetrics := &MemoryMetrics{
		Latest:           metrics.Memory.Usage,
		KernelStackBytes: metrics.Memory.KernelStack,
		PageFaults:       metrics.Memory.Pgfault,
		MajorPageFaults:  metrics.Memory.Pgmajfault,
		OOM:              metrics.MemoryEvents.Oom,
		OOMKill:          metrics.MemoryEvents.OomKill,
	}

	return memMetrics, metrics.Io.Usage, nil
}
