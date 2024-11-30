package internal

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
	"log/slog"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/containerd/cgroups/v2/cgroup2"
	"github.com/containerd/cgroups/v2/cgroup2/stats"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
)

var Docker *client.Client
var ContainerHostConfig = &container.HostConfig{
	Resources: container.Resources{
		Memory:       368 * 1024 * 1024,
		MemorySwap:   369 * 1024 * 1024,
		CPUPeriod:    100000,  // microseconds
		CPUQuota:     1000000, // 10 seconds (100000 * 10)
		CgroupParent: "sandbox.slice",
	},
	NetworkMode: network.NetworkNone,
	CapDrop:     []string{"all"},
	CapAdd: []string{
		"SETUID",
		"SETGID",
		"DAC_OVERRIDE",
	},
}
var ContainerConfig = &container.Config{
	Image:        "code-cansu-dev-runner",
	AttachStdin:  true,
	AttachStdout: true,
	AttachStderr: true,
	Tty:          false,
	OpenStdin:    true,
	StdinOnce:    true,
}
var DefaultExecutionTimeLimit = time.Second * 20 // wall time

type ExecutionResult struct {
	ExitCode int64           `json:"exitCode"`
	Stdout   string          `json:"stdout"`
	Stderr   string          `json:"stderr"`
	Metrics  ResourceMetrics `json:"metrics"`
}

func ExecuteInContainer(ctx context.Context, code string, stdin *[]byte, languageId int32) (*ExecutionResult, error) {
	var hostCfg = *ContainerHostConfig
	tmp, err := os.MkdirTemp(os.TempDir(), fmt.Sprintf("metrics-%d-*", languageId))
	if err != nil {
		return nil, fmt.Errorf("failed to create temporary directory: %w", err)
	}
	defer os.RemoveAll(tmp)
	if err := os.Chmod(tmp, 0777); err != nil {
		return nil, fmt.Errorf("failed to chmod temp directory: %w", err)
	}
	files := []string{"cpu_stats.log", "timing_stats.log", "stderr.log", "debug.log"}
	for _, file := range files {
		filepath := fmt.Sprintf("%s/%s", tmp, file)
		var f *os.File
		if f, err = os.Create(filepath); err != nil {
			return nil, fmt.Errorf("failed to create metric file %s: %w", file, err)
		}
		hostCfg.Mounts = append(hostCfg.Mounts, mount.Mount{
			Type:   mount.TypeBind,
			Source: f.Name(),
			Target: fmt.Sprintf("/tmp/%s", file),
		})
	}
	wrappedCmd, err := BuildWrappedCommand(code, languageId, nil, nil) // todo
	if err != nil {
		return nil, err
	}
	res := cgroup2.Resources{}
	_, err = cgroup2.NewSystemd("/", "sandbox.slice", -1, &res)
	if err != nil {
		return nil, err
	}

	var cfg = ContainerConfig
	cfg.Cmd = []string{"/bin/bash", "-c", wrappedCmd}

	resp, err := Docker.ContainerCreate(ctx, cfg, &hostCfg, nil, nil, "")
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
		result.Stderr = stdoutBuf.String()
		return &result, err
	case status := <-statusCh:
		if status.Error != nil {
			slog.Error("error in docker container: %s", "error", status.Error.Message)
			return nil, fmt.Errorf(status.Error.Message)
		}
		if err := <-outputDone; err != nil {
			slog.Error("error reading submission output", "error", status.Error.Message)
			return nil, fmt.Errorf("error reading output: %v", err)
		}

		metrics := parseMetrics(tmp)
		if mem != nil {
			metrics.Memory = mem
			metrics.Memory.Max = maxMem
			metrics.Memory.Min = lowMem
			metrics.Memory.All = allMem
		}
		metrics.IO = iom

		result.ExitCode = status.StatusCode
		result.Stdout = stdoutBuf.String()
		result.Stderr = stderrBuf.String()
		result.Metrics = metrics

	case <-time.After(DefaultExecutionTimeLimit):
		timeoutSignal <- true
		return nil, ExecutionTimeoutError{}
	}

	return &result, nil
}

func parseMetrics(tmpDir string) ResourceMetrics {
	var metrics ResourceMetrics

	var cpuHistory []CPUHistory
	var totalUsage, maxUsage float64
	cpu_statsFile, err := os.Open(fmt.Sprintf("%s/cpu_stats.log", tmpDir))
	if err != nil {
		slog.Warn("cannot open cpu stats", "error", err)
		return metrics
	}
	cpuStatScan := bufio.NewScanner(cpu_statsFile)
	for cpuStatScan.Scan() {
		cpuStat := strings.Split(cpuStatScan.Text(), " ")
		time, err := strconv.ParseFloat(strings.TrimSpace(cpuStat[0]), 64)
		if err != nil {
			slog.Warn("cannot convert cpu timestamp to float64", "error", err, "timestampString", cpuStat[0])
			return metrics
		}
		cpu, err := strconv.ParseFloat(cpuStat[1], 64)
		cpuHistory = append(cpuHistory, CPUHistory{
			Timestamp: time,
			Usage:     cpu,
		})
		totalUsage += cpu
		maxUsage = max(cpu, maxUsage)
	}
	if cpuStatScan.Err() != nil {
		slog.Warn("cannot scan cpu stats log file", "error", cpuStatScan.Err())
		return metrics
	}
	if len(cpuHistory) > 0 {
		metrics.CPU = &CPUMetrics{
			History: cpuHistory,
			Average: totalUsage / float64(len(cpuHistory)),
			Max:     maxUsage,
		}
	}

	timingStatsFile, err := os.Open(fmt.Sprintf("%s/timing_stats.log", tmpDir))
	if err != nil {
		slog.Warn("cannot open timing stats", "error", err)
	}
	timingStats, err := io.ReadAll(timingStatsFile)
	if err != nil {
		slog.Warn("cannot read timing stats", "error", err)
	}
	fmt.Println(string(timingStats))
	timingStatsSplit := strings.Split(string(timingStats), " ")
	for i, spl := range timingStatsSplit {
		if spl != "" {
			tm, err := strconv.ParseFloat(spl, 64)
			if err != nil {
				slog.Warn("time output parsing failed", "error", err)
			}
			switch i {
			case 0:
				metrics.Timing.Real = tm
			case 1:
				metrics.Timing.User = tm
			case 2:
				metrics.Timing.Sys = tm
			}
		}
	}

	debugLogFile, err := os.Open(fmt.Sprintf("%s/debug.log", tmpDir))
	if err != nil {
		slog.Warn("cannot open debug log file", "error", err)
	}
	if debugLogFile != nil {
		debugLogBytes, err := io.ReadAll(debugLogFile)
		if err != nil {
			slog.Warn("cannot read debug log file", "error", err)
		}
		slog.Debug("debug: ", "string", debugLogBytes)
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
