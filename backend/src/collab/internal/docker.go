package internal

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/containerd/cgroups/v2/cgroup2"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
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
	ExitCode int             `json:"exitCode"`
	Stdout   string          `json:"stdout"`
	Stderr   string          `json:"stderr"`
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

	hostConfig := &container.HostConfig{
		Resources: container.Resources{
			Memory:     512 * 1024 * 1024, // 512MB limit
			MemorySwap: -1,                // Disable swap
			CPUPeriod:  100000,
			CPUQuota:   100000, // Limit to 1 CPU
		},
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

	memoryMetrics := make(chan *MemoryMetrics)
	go func() {
		defer close(memoryMetrics)
		ticker := time.NewTicker(100 * time.Millisecond)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				if metrics, err := getCgroupMetrics(resp.ID); err == nil {
					memoryMetrics <- metrics
				}
			}
		}
	}()

	// Track peak memory usage
	var peakMemoryMetrics *MemoryMetrics
	go func() {
		for metrics := range memoryMetrics {
			if peakMemoryMetrics == nil || metrics.CurrentUsageBytes > peakMemoryMetrics.CurrentUsageBytes {
				peakMemoryMetrics = metrics
			}
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
		result.ExitCode = int(status.StatusCode)
		result.Duration = time.Since(startTime)
		result.Stdout = stdoutBuf.String()
		result.Stderr = stderrBuf.String()

		metrics = parseMetrics(result.Stderr)
		result.Metrics = metrics

		if err := <-outputDone; err != nil {
			result.Error = fmt.Errorf("error reading output: %v", err)
		}
	}

	if peakMemoryMetrics != nil {
		result.Metrics.Memory = *peakMemoryMetrics
	}

	return &result, nil
}

func parseMetrics(timeOutput string) ResourceMetrics {
	metrics := ResourceMetrics{}

	// Parse /usr/bin/time output
	lines := strings.Split(timeOutput, "\n")
	for _, line := range lines {
		switch {
		case strings.Contains(line, "Maximum resident set size"):
			fmt.Sscanf(line, "%d", &metrics.MaxRSSKb)
		case strings.Contains(line, "User time"):
			fmt.Sscanf(line, "%f", &metrics.UserTime)
		case strings.Contains(line, "System time"):
			fmt.Sscanf(line, "%f", &metrics.SystemTime)
		case strings.Contains(line, "Voluntary context switches"):
			fmt.Sscanf(line, "%d", &metrics.VoluntaryCtxt)
		case strings.Contains(line, "Involuntary context switches"):
			fmt.Sscanf(line, "%d", &metrics.InvoluntaryCtxt)
		}
	}

	return metrics
}

func getCgroupMetrics(containerID string) (*MemoryMetrics, error) {
	cgroupPath := filepath.Join("/sys/fs/cgroup/system.slice", fmt.Sprintf("docker-%s.scope", containerID))
	// Load cgroup manager
	manager, err := cgroup2.LoadSystemd("system.slice", fmt.Sprintf("docker-%s.scope", containerID))
	if err != nil {
		return nil, fmt.Errorf("failed to load cgroup manager: %v", err)
	}

	metrics, err := manager.Stat()
	if err != nil {
		return nil, fmt.Errorf("failed to get cgroup stats: %v", err)
	}

	// Get memory pressure
	pressurePath := filepath.Join(cgroupPath, "memory.pressure")
	pressureLevel := IOPressureUnknown
	if pressure, err := os.ReadFile(pressurePath); err == nil {
		// Parse pressure level from the PSI metrics
		pressureLevel = parsePressureLevel(string(pressure))
	}

	memMetrics := &MemoryMetrics{
		CurrentUsageBytes: metrics.Memory.Usage,
		MaxUsageBytes:     metrics.Memory.UsageLimit,
		SwapBytes:         metrics.Memory.SwapUsage,
		KernelStackBytes:  metrics.Memory.KernelStack,
		PageFaults:        metrics.Memory.Pgfault,
		MajorPageFaults:   metrics.Memory.Pgmajfault,
		LimitBytes:        metrics.Memory.UsageLimit,
		SoftLimitBytes:    metrics.Memory.UsageLimit,
		PressureLevel:     pressureLevel,
	}

	return memMetrics, nil
}

func parsePressureLevel(pressure string) IOPressureEnum {
	// Parse PSI (Pressure Stall Information) metrics
	// Format: some avg10=0.00 avg60=0.00 avg300=0.00 total=0
	if strings.Contains(pressure, "avg60=0.00") {
		return IOPressureNone
	} else if strings.Contains(pressure, "avg60=") {
		avg60 := 0.0
		fmt.Sscanf(pressure, "some avg10=%f", &avg60)
		if avg60 < 30 {
			return IOPressureLow
		} else if avg60 < 70 {
			return IOPressureMedium
		}
		return IOPressureCritical
	}
	return IOPressureUnknown
}
