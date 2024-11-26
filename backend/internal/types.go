package internal

type ResourceMetrics struct {
	// CPU Statistics
	CPUTime float64 `json:"cpuTime"` // Total CPU time in seconds
	IO IOMetrics `json:"io"`
	// Time Statistics
	Wall float64 `json:"wall"` // Time spent in user mode (seconds)
	// Context Switches
	VoluntaryCtxt   uint64 `json:"voluntaryCtxt"`   // Voluntary context switches
	InvoluntaryCtxt uint64 `json:"involuntaryCtxt"` // Involuntary context switches

	Memory *MemoryMetrics `json:"memory"`
}

type MemoryMetrics struct {
	// Memory Usage (bytes)
	Min    uint64   `json:"min"`
	Max    uint64   `json:"max"`
	Latest uint64   `json:"latest"`
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
