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
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

var Docker *client.Client

func GetContainerId(name string) (*string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	opts := container.ListOptions{
		Filters: filters.NewArgs(filters.Arg("name", name)),
	}
	containers, err := Docker.ContainerList(ctx, opts)
	if err != nil {
		slog.Error("Failed to list containers", "error", err)
		return nil, err
	}
	return &containers[0].ID, nil
}

// ContainerResourceConfig holds the resource limits for a container
type ContainerResourceConfig struct {
	CPUQuota  int64 // CPU quota in microseconds per CPU period
	CPUPeriod int64 // CPU period in microseconds
	Memory    int64 // Memory limit in bytes
}

// UpdateContainerResources updates CPU and memory limits of a running container
func UpdateContainerResources(containerID string, config ContainerResourceConfig) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	updateConfig := container.UpdateConfig{
		Resources: container.Resources{
			CPUQuota:  config.CPUQuota,
			CPUPeriod: config.CPUPeriod,
			Memory:    config.Memory,
		},
	}

	// Update container resources
	response, err := Docker.ContainerUpdate(ctx, containerID, updateConfig)
	if err != nil {
		slog.Error("Failed to update container resources", "error", err)
		return err
	}

	// Check for warnings
	if len(response.Warnings) > 0 {
		slog.Warn("container update returned warnings", "warnings", response.Warnings)
	}

	return nil
}

type ExecutionResult struct {
	ExitCode int64           `json:"exitCode"`
	Stdout   string          `json:"stdout"`
	Stderr   string          `json:"-"`
	Duration time.Duration   `json:"duration"`
	Error    error           `json:"error"`
	Metrics  ResourceMetrics `json:"metrics"`
}

func ExecuteInContainer(ctx context.Context, imageName string, cmd []string, stdin *[]byte) (*ExecutionResult, error) {
	// Create container config
	wrappedCmd := fmt.Sprintf(`
        /usr/bin/time -v sh -c '
            {
                # Start process monitoring in background
                while true; do
                    ps -o pid,ppid,rss,vsz,pcpu,comm -C sh >> /tmp/process_stats.log 2>/dev/null
                    sleep 0.1
                done
            } &
            MONITOR_PID=$!

            # Execute the actual commands
            { %s; }
            EXIT_CODE=$?

            # Kill the monitoring process
            kill $MONITOR_PID

            # Collect additional metrics
            cat /proc/self/status > /tmp/proc_status.log
            cat /proc/self/io > /tmp/proc_io.log

            exit $EXIT_CODE
        '
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
	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:       512 * 1024 * 1024, // 512MB limit
			MemorySwap:   -1,
			CPUPeriod:    100000,
			CgroupParent: "sandbox.slice",
		},
		NetworkMode: network.NetworkNone,
	}

	// Create container
	startTime := time.Now()
	resp, err := Docker.ContainerCreate(ctx, config, hostConfig, nil, nil, "")
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

	// Start container
	if err := Docker.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return nil, fmt.Errorf("failed to start container: %v", err)
	}

	stats := make(chan container.StatsResponseReader)
	go func() {
		defer close(stats)
		for {
			stat, err := Docker.ContainerStats(ctx, resp.ID, false)
			if err != nil {
				return
			}
			stats <- stat
			time.Sleep(100 * time.Millisecond)
		}
	}()

	var mem *MemoryMetrics
	var maxMem uint64
	var lowMem uint64
	var allMem []int32
	var iom = IOMetrics{}
	go func() {
		tick := time.NewTicker(50 * time.Millisecond)
		for range tick.C {
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
			tick.Reset(50 * time.Millisecond)
		}
	}()

	// Create buffers for stdout and stderr
	stdoutBuf := new(bytes.Buffer)
	stderrBuf := new(bytes.Buffer)

	go func() {
		defer attachResp.CloseWrite()
		if stdin != nil {
			io.Copy(attachResp.Conn, strings.NewReader(string(*stdin)))
		}
	}()

	// Copy container output to buffers
	outputDone := make(chan error)
	go func() {
		_, err := stdcopy.StdCopy(stdoutBuf, stderrBuf, attachResp.Reader)
		outputDone <- err
	}()

	// Wait for container to finish
	statusCh, errCh := Docker.ContainerWait(ctx, resp.ID, container.WaitConditionNotRunning)
	var result ExecutionResult
	var metrics ResourceMetrics
	select {
	case err := <-errCh:
		result.Error = fmt.Errorf("error waiting for container: %v", err)
	case status := <-statusCh:
		if status.Error != nil {
			slog.Error("error in docker container: %s", "error", status.Error.Message)
			return nil, fmt.Errorf(status.Error.Message)
		}
		result.ExitCode = status.StatusCode
		result.Duration = time.Since(startTime)
		result.Stdout = stdoutBuf.String()
		result.Stderr = stderrBuf.String()
		metrics = parseMetrics(result.Stderr)
		result.Metrics = metrics
		if mem != nil {
			result.Metrics.Memory = mem
			result.Metrics.Memory.Max = maxMem
			result.Metrics.Memory.Min = lowMem
			result.Metrics.Memory.All = allMem
		}
		result.Metrics.IO = iom

		if err := <-outputDone; err != nil {
			result.Error = fmt.Errorf("error reading output: %v", err)
		}
	}

	return &result, nil
}

func parseMetrics(timeOutput string) ResourceMetrics {
	var err error
	metrics := ResourceMetrics{}

	// Parse /usr/bin/time output
	lines := strings.Split(timeOutput, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		switch {
		case strings.Contains(line, "(wall clock)"):
			tmp, err := parseDuration(strings.TrimSpace(strings.Split(line, "Elapsed (wall clock) time (h:mm:ss or m:ss):")[1]))
			if err != nil {
				slog.Warn("wall clock parsing failed", "error", err)
				metrics.Wall = 0
			}
			metrics.Wall = tmp.Seconds()
		case strings.Contains(line, "System time"):
			metrics.CPUTime, err = strconv.ParseFloat(strings.TrimSpace(strings.Split(line, "System time (seconds):")[1]), 64)
			if err != nil {
				slog.Warn("converting system time to float failed", "error", err)
				metrics.CPUTime = 0
			}
		case strings.Contains(line, "Voluntary context switches"):
			metrics.VoluntaryCtxt, err = strconv.ParseUint(strings.TrimSpace(strings.Split(line, "Voluntary context switches:")[1]), 10, 64)
			if err != nil {
				slog.Warn("converting voluntary ctxt to uint failed", "error", err)
				metrics.VoluntaryCtxt = 0
			}
		case strings.Contains(line, "Involuntary context switches"):
			metrics.InvoluntaryCtxt, err = strconv.ParseUint(strings.TrimSpace(strings.Split(line, "Involuntary context switches:")[1]), 10, 64)
			if err != nil {
				slog.Warn("converting involuntary ctxt to uint failed", "error", err)
				metrics.InvoluntaryCtxt = 0
			}
		}
	}

	return metrics
}
func getCgroupMetrics(containerID string) (*MemoryMetrics, []*stats.IOEntry, error) {

	// Try loading with cgroup2 manager
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
