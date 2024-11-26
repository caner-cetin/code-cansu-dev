package main

import (
	"log/slog"
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

type EnvVar[T any] struct {
	key      string
	fallback T
}

// Get returns the environment variable value or fallback
func (e EnvVar[T]) Get() T {
	val, exists := os.LookupEnv(e.key)
	if !exists {
		return e.fallback
	}

	var result any
	switch any(e.fallback).(type) {
	case string:
		result = val
	case int:
		i, _ := strconv.Atoi(val)
		result = i
	case bool:
		b, _ := strconv.ParseBool(val)
		result = b
	case float64:
		f, _ := strconv.ParseFloat(val, 64)
		result = f
	case slog.Level:
		l := new(slog.Level)
		_ = l.UnmarshalText([]byte(val))
		result = *l
	default:
		return e.fallback
	}

	return result.(T)
}

// NewEnv creates a new environment variable with a default value
func NewEnv[T any](key string, fallback T) EnvVar[T] {
	return EnvVar[T]{
		key:      key,
		fallback: fallback,
	}
}
