// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0

package db

import (
	"github.com/jackc/pgx/v5/pgtype"
)

type CodeAiReaction struct {
	ID        int32
	Code      pgtype.Text
	Reaction  pgtype.Text
	CreatedAt pgtype.Timestamptz
	UpdatedAt pgtype.Timestamptz
	DeletedAt pgtype.Timestamptz
}

type Submission struct {
	ID                       int32
	SourceCode               pgtype.Text
	LanguageID               pgtype.Int4
	Stdin                    pgtype.Text
	Stdout                   pgtype.Text
	StatusID                 pgtype.Int4
	Memory                   pgtype.Int4
	MemoryHistory            interface{}
	MemoryMin                pgtype.Int4
	MemoryMax                pgtype.Int4
	KernelStackBytes         pgtype.Int4
	PageFaults               pgtype.Int4
	MajorPageFaults          pgtype.Int4
	IoReadBytes              pgtype.Int4
	IoWriteBytes             pgtype.Int4
	IoReadCount              pgtype.Int4
	IoWriteCount             pgtype.Int4
	Oom                      pgtype.Int4
	OomKill                  pgtype.Int4
	VoluntaryContextSwitch   pgtype.Int4
	InvoluntaryContextSwitch pgtype.Int4
	Token                    pgtype.Text
	MaxFileSize              pgtype.Int4
	ExitCode                 pgtype.Int4
	TimingReal               pgtype.Float4
	CompilerOptions          pgtype.Text
	CommandLineArguments     pgtype.Text
	AdditionalFiles          []byte
	CreatedAt                pgtype.Timestamp
	UpdatedAt                pgtype.Timestamp
	Stderr                   pgtype.Text
	CpuHistory               []byte
	CpuAverage               pgtype.Float4
	CpuMax                   pgtype.Float4
	TimingUser               pgtype.Float4
	TimingSys                pgtype.Float4
}

type SubmissionAiReaction struct {
	ID         int32
	Reaction   string
	CreatedAt  pgtype.Timestamptz
	UpdatedAt  pgtype.Timestamptz
	DeletedAt  pgtype.Timestamptz
	Judgetoken string
}
