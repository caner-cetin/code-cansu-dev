package internal

type ResourceMetrics struct {
	// CPU Statistics
	CPUTime       float64 `json:"cpuTime"`       // Total CPU time in seconds
	CPUPercentage float64 `json:"cpuPercentage"` // CPU usage percentage

	// Memory Statistics
	MaxRSSKb        uint64 `json:"maxRSSKb"`        // Maximum resident set size in KB
	CurrentRSSKb    uint64 `json:"currentRSSKb"`    // Current resident set size in KB
	VirtualMemoryKb uint64 `json:"virtualMemoryKb"` // Virtual memory size in KB

	// IO Statistics
	ReadBytes  uint64 `json:"readBytes"`  // Total bytes read from disk
	WriteBytes uint64 `json:"writeBytes"` // Total bytes written to disk
	ReadCount  uint64 `json:"readCount"`  // Number of read operations
	WriteCount uint64 `json:"writeCount"` // Number of write operations

	// Time Statistics
	UserTime   float64 `json:"userTime"`   // Time spent in user mode
	SystemTime float64 `json:"systemTime"` // Time spent in kernel mode
	RealTime   float64 `json:"realTime"`   // Wall clock time

	// Process Statistics
	ThreadCount    int32 `json:"threadCount"`    // Number of threads
	ChildProcesses int   `json:"childProcesses"` // Number of child processes

	// Context Switches
	VoluntaryCtxt   uint64 `json:"voluntaryCtxt"`   // Voluntary context switches
	InvoluntaryCtxt uint64 `json:"involuntaryCtxt"` // Involuntary context switches

	Memory MemoryMetrics `json:"memory"`

	BlockIODelay uint64         `json:"blockIODelay"` // Time process blocked on I/O
	IOPressure   IOPressureEnum `json:"ioPressure"`   // none, low, medium, critical
}

type IOPressureEnum string

const (
	IOPressureUnknown  IOPressureEnum = "unknown"
	IOPressureNone     IOPressureEnum = "none"
	IOPressureLow      IOPressureEnum = "low"
	IOPressureMedium   IOPressureEnum = "medium"
	IOPressureCritical IOPressureEnum = "critical"
)

type MemoryMetrics struct {
	// Current Memory Usage
	CurrentUsageBytes uint64 `json:"currentUsageBytes"` // Current memory usage
	MaxUsageBytes     uint64 `json:"maxUsageBytes"`     // Peak memory usage

	// Detailed Memory Breakdown
	SwapBytes        uint64 `json:"swapBytes"`        // Swap Usage
	KernelStackBytes uint64 `json:"kernelStackBytes"` // Kernel Stack Size
	PageFaults       uint64 `json:"pageFaults"`       // Major + Minor Page Faults
	MajorPageFaults  uint64 `json:"majorPageFaults"`  // Major Page Faults

	// Memory Limits
	LimitBytes     uint64 `json:"limitBytes"`     // Memory Limit
	SoftLimitBytes uint64 `json:"softLimitBytes"` // Soft Memory Limit

	// Memory Pressure
	PressureLevel IOPressureEnum `json:"pressureLevel"`
}
