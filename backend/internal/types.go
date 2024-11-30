package internal

type ResourceMetrics struct {
	Timing          Timing         `json:"timing"`
	Memory          *MemoryMetrics `json:"memory,omitempty"`
	IO              IOMetrics      `json:"io"`
	CPU             *CPUMetrics    `json:"cpu,omitempty"`
	VoluntaryCtxt   uint64         `json:"voluntaryCtxt"`
	InvoluntaryCtxt uint64         `json:"involuntaryCtxt"`
}

// All times are in microsecond [µs]
type Timing struct {
	Real float64
	User float64
	Sys  float64
}

type CPUHistory struct {
	Timestamp float64 `json:"timestamp"`
	Usage     float64 `json:"usage"`
}
type CPUMetrics struct {
	History []CPUHistory `json:"history"`
	Average float64      `json:"average"`
	Max     float64      `json:"max"`
}

type MemoryMetrics struct {
	// Memory Usage (bytes)
	Min    uint64  `json:"min"`
	Max    uint64  `json:"max"`
	Latest uint64  `json:"latest"`
	All    []int32 `json:"all"`

	// Detailed Memory Breakdown
	KernelStackBytes uint64 `json:"kernelStackBytes"` // Kernel Stack Size
	PageFaults       uint64 `json:"pageFaults"`       // Major + Minor Page Faults
	MajorPageFaults  uint64 `json:"majorPageFaults"`  // Major Page Faults

	OOMKill uint64 `json:"oomKill"`
	OOM     uint64 `json:"oom"`
}

type IOMetrics struct {
	// IO Statistics
	ReadBytes  uint64 `json:"readBytes"`  // Total bytes read from disk
	WriteBytes uint64 `json:"writeBytes"` // Total bytes written to disk
	ReadCount  uint64 `json:"readCount"`  // Number of read operations
	WriteCount uint64 `json:"writeCount"` // Number of write operations
}
