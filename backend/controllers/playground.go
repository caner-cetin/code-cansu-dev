package controllers

import (
	"code-cansu-dev-collab/db"
	"code-cansu-dev-collab/internal"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log/slog"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func GetLanguages(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(internal.Languages)
}

type ExecuteCodeRequest struct {
	Language             int32   `json:"language"`
	Code                 string  `json:"code"`
	Stdin                *string `json:"stdin"`
	CompilerOptions      *string `json:"compilerOptions"`
	CommandLineArguments *string `json:"commandLineArguments"`
}

type ExecuteCodeResponse struct {
	Id string `json:"id"`
}

type SubmissionStatus int

const (
	Processing SubmissionStatus = iota
	Executed
	Failed
	TimeLimitExceeded
)

func ExecuteCode(w http.ResponseWriter, r *http.Request) {
	var request ExecuteCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	var subId = uuid.New()
	to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var submission = db.CreateSubmissionParams{
		SourceCode: pgtype.Text{String: request.Code, Valid: true},
		LanguageID: pgtype.Int4{Int32: request.Language, Valid: true},
		StatusID:   pgtype.Int4{Int32: int32(Processing), Valid: true},
		Token:      pgtype.Text{String: subId.String(), Valid: true},
		CreatedAt:  pgtype.Timestamp{Time: time.Now(), Valid: true},
		UpdatedAt:  pgtype.Timestamp{Time: time.Now(), Valid: true},
	}
	err := Queries.CreateSubmission(to, submission)
	if err != nil {
		slog.Error("submission insert to db failed", "error", err)
		http.Error(w, "oops", http.StatusInternalServerError) // todo: ?
		return
	}
	go func(lid int32) {
		to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		stdin, err := base64.StdEncoding.DecodeString(*request.Stdin)
		if err != nil {
			slog.Error("decoding stdin code failed", "error", err)
			return
		}
		result, err := internal.ExecuteInContainer(to, request.Code, &stdin, lid)
		if err != nil {
			var sid = int32(Failed)
			if (errors.Is(err, internal.ExecutionTimeoutError{})) {
				sid = int32(TimeLimitExceeded)
			}
			slog.Error("error during execution", "error", err)

			err = Queries.UpdateSubmissionStatus(to, db.UpdateSubmissionStatusParams{
				StatusID: pgtype.Int4{Int32: sid, Valid: true},
				Token:    pgtype.Text{String: subId.String(), Valid: true},
			})
			if err != nil {
				slog.Error("error while updating submission", "error", err)
			}
			return
		}
		var encStdout = base64.StdEncoding.EncodeToString([]byte(result.Stdout))
		var updatedSubmission = db.UpdateSubmissionWithResultParams{
			Stdout:    pgtype.Text{String: encStdout, Valid: true},
			Stderr:    pgtype.Text{String: result.Stderr, Valid: true},
			StatusID:  pgtype.Int4{Int32: int32(Executed), Valid: true},
			ExitCode:  pgtype.Int4{Int32: int32(result.ExitCode), Valid: true},
			Wall:      pgtype.Float4{Float32: float32(result.Metrics.Wall), Valid: true},
			UpdatedAt: pgtype.Timestamp{Time: time.Now(), Valid: true},
			Token:     pgtype.Text{String: subId.String(), Valid: true},
		}
		if result.Metrics.Memory != nil {
			updatedSubmission.Memory = pgtype.Int4{Int32: int32(result.Metrics.Memory.Latest), Valid: true}
			updatedSubmission.MemoryMin = pgtype.Int4{Int32: int32(result.Metrics.Memory.Min), Valid: true}
			updatedSubmission.MemoryMax = pgtype.Int4{Int32: int32(result.Metrics.Memory.Max), Valid: true}
			updatedSubmission.MemoryHistory = result.Metrics.Memory.All
			updatedSubmission.KernelStackBytes = pgtype.Int4{Int32: int32(result.Metrics.Memory.KernelStackBytes), Valid: true}
			updatedSubmission.PageFaults = pgtype.Int4{Int32: int32(result.Metrics.Memory.PageFaults), Valid: true}
			updatedSubmission.MajorPageFaults = pgtype.Int4{Int32: int32(result.Metrics.Memory.PageFaults), Valid: true}
			updatedSubmission.IoReadBytes = pgtype.Int4{Int32: int32(result.Metrics.IO.ReadBytes), Valid: true}
			updatedSubmission.IoWriteBytes = pgtype.Int4{Int32: int32(result.Metrics.IO.WriteBytes), Valid: true}
			updatedSubmission.IoReadCount = pgtype.Int4{Int32: int32(result.Metrics.IO.ReadCount), Valid: true}
			updatedSubmission.IoWriteCount = pgtype.Int4{Int32: int32(result.Metrics.IO.WriteCount), Valid: true}
			updatedSubmission.Oom = pgtype.Int4{Int32: int32(result.Metrics.Memory.OOM), Valid: true}
			updatedSubmission.OomKill = pgtype.Int4{Int32: int32(result.Metrics.Memory.OOMKill), Valid: true}
			updatedSubmission.VoluntaryContextSwitch = pgtype.Int4{Int32: int32(result.Metrics.VoluntaryCtxt), Valid: true}
			updatedSubmission.InvoluntaryContextSwitch = pgtype.Int4{Int32: int32(result.Metrics.InvoluntaryCtxt), Valid: true}
		}
		if result.Metrics.CPU != nil {
			chst, err := json.Marshal(result.Metrics.CPU.History)
			if err != nil {
				slog.Error("error marshalling cpu history", "error", err)
				return
			}
			updatedSubmission.CpuHistory = chst
			updatedSubmission.CpuAverage = pgtype.Float4{Float32: float32(result.Metrics.CPU.Average), Valid: true}
			updatedSubmission.CpuMax = pgtype.Float4{Float32: float32(result.Metrics.CPU.Max), Valid: true}
		}
		if request.Stdin != nil {
			updatedSubmission.Stdin = pgtype.Text{String: *request.Stdin, Valid: true}
		}
		err = Queries.UpdateSubmissionWithResult(to, updatedSubmission)
		if err != nil {
			slog.Error("submission update failed", "error", err)
			return
		}
	}(request.Language)
	json.NewEncoder(w).Encode(ExecuteCodeResponse{Id: subId.String()})
}

func GetSubmission(w http.ResponseWriter, r *http.Request) {
	var token = chi.URLParam(r, "token")
	if token == "" {
		http.Error(w, "submission token is required", http.StatusBadRequest)
		return
	}
	to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	sub, err := Queries.GetSubmission(to, pgtype.Text{String: token, Valid: true})
	if err != nil {
		slog.Error("error querying submission", "error", err)
		http.Error(w, "error querying submission", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(sub)
}

func ReactSubmission(w http.ResponseWriter, r *http.Request) {
	var token = chi.URLParam(r, "token")
	if token == "" {
		http.Error(w, "submission token is required", http.StatusBadRequest)
		return
	}
	to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	react, err := Queries.QuerySubmissionAiReaction(to, token)
	found := true
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		slog.Error("error querying ai reaction", "error", err)
		http.Error(w, "error querying ai reaction", http.StatusInternalServerError)
		return
	} else if err != nil && errors.Is(err, pgx.ErrNoRows) {
		found = false
	}
	if found {
		json.NewEncoder(w).Encode(react.Reaction)
		return
	}
	sub, err := Queries.GetSubmission(to, pgtype.Text{String: token, Valid: true})
	if err != nil {
		slog.Error("error querying submission", "error", err)
		http.Error(w, "error querying submission", http.StatusInternalServerError)
		return
	}
	resp, err := internal.ReactToSubmission(sub)
	if err != nil {
		slog.Error("error reacting to code", "error", err)
		http.Error(w, "error reacting to code", http.StatusInternalServerError)
		return
	}
	go func() {
		to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		err := Queries.InsertSubmissionAiReaction(to, db.InsertSubmissionAiReactionParams{
			Reaction:   *resp,
			Judgetoken: token,
		})
		if err != nil {
			slog.Error("error inserting ai reaction", "error", err)
		}

	}()
	json.NewEncoder(w).Encode(*resp)
}
