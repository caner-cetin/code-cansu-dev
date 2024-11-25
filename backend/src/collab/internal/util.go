package internal

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func parseDuration(input string) (time.Duration, error) {
	// Split the string into minutes and the seconds portion
	parts := strings.Split(input, ":")
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid format, expected MM:SS.ss")
	}

	// Parse minutes
	minutes, err := strconv.Atoi(parts[0])
	if err != nil {
		return 0, fmt.Errorf("invalid minutes: %w", err)
	}

	// Split seconds and fractional seconds
	secondsParts := strings.Split(parts[1], ".")
	if len(secondsParts) != 2 {
		return 0, fmt.Errorf("invalid seconds format, expected SS.ss")
	}

	// Parse seconds
	seconds, err := strconv.Atoi(secondsParts[0])
	if err != nil {
		return 0, fmt.Errorf("invalid seconds: %w", err)
	}

	// Parse fractional seconds
	fractional, err := strconv.Atoi(secondsParts[1])
	if err != nil {
		return 0, fmt.Errorf("invalid fractional seconds: %w", err)
	}

	// Combine into a single duration
	duration := time.Duration(minutes)*time.Minute +
		time.Duration(seconds)*time.Second +
		time.Duration(fractional)*time.Millisecond/10

	return duration, nil
}
