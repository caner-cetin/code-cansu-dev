package internal

import "fmt"

type ExecutionTimeoutError struct{}

func (e ExecutionTimeoutError) Error() string {
	return fmt.Sprintf("time limit (%.2f seconds) exceeded", DefaultExecutionTimeLimit.Seconds())
}
