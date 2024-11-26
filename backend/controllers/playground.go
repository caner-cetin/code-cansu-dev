package controllers

import (
	"code-cansu-dev-collab/db"
	"code-cansu-dev-collab/internal"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
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
	var lang = internal.Languages[request.Language]
	commands := []string{}
	commands = append(commands, fmt.Sprintf("touch %s", lang.SourceFile))
	commands = append(commands, fmt.Sprintf("echo %s | base64 -d > %s", request.Code, lang.SourceFile))
	if lang.CompileCmd != "" {
		var cmpcmd = lang.CompileCmd
		if request.CompilerOptions != nil {
			cmpcmd = fmt.Sprintf(lang.CompileCmd, request.CompilerOptions)
		}
		commands = append(commands, cmpcmd)
	}
	var runcmd = lang.RunCmd
	if request.CommandLineArguments != nil {
		runcmd = fmt.Sprintf("%s %s", lang.RunCmd, *request.CommandLineArguments)
	}
	commands = append(commands, runcmd)

	stdin, err := base64.StdEncoding.DecodeString(*request.Stdin)
	if err != nil {
		http.Error(w, "Failed to decode base64", http.StatusBadRequest)
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
	err = Queries.CreateSubmission(to, submission)
	if err != nil {
		slog.Error("submission insert to db failed", "error", err)
		http.Error(w, "oops", http.StatusInternalServerError) // todo: ?
		return
	}
	go func() {
		to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		result, err := internal.ExecuteInContainer(to, "code-cansu-dev-runner", commands, &stdin)
		if err != nil {
			var sid = int32(Failed)
			if (errors.Is(err, internal.ExecutionTimeoutError{})) {
				sid = int32(TimeLimitExceeded)
			}
			// todo: handle error (im tired)
			Queries.UpdateSubmissionStatus(to, db.UpdateSubmissionStatusParams{
				StatusID: pgtype.Int4{Int32: sid, Valid: true},
				Token:    pgtype.Text{String: subId.String(), Valid: true},
			})
			return
		}
		var encStdout = base64.StdEncoding.EncodeToString([]byte(result.Stdout))
		var updatedSubmission = db.UpdateSubmissionWithResultParams{
			Stdout:                   pgtype.Text{String: encStdout, Valid: true},
			StatusID:                 pgtype.Int4{Int32: int32(Executed), Valid: true},
			Time:                     pgtype.Float4{Float32: float32(result.Metrics.CPUTime), Valid: true},
			Memory:                   pgtype.Int4{Int32: int32(result.Metrics.Memory.Latest), Valid: true},
			MemoryHistory:            result.Metrics.Memory.All,
			MemoryMin:                pgtype.Int4{Int32: int32(result.Metrics.Memory.Min), Valid: true},
			MemoryMax:                pgtype.Int4{Int32: int32(result.Metrics.Memory.Max), Valid: true},
			KernelStackBytes:         pgtype.Int4{Int32: int32(result.Metrics.Memory.KernelStackBytes), Valid: true},
			PageFaults:               pgtype.Int4{Int32: int32(result.Metrics.Memory.PageFaults), Valid: true},
			MajorPageFaults:          pgtype.Int4{Int32: int32(result.Metrics.Memory.PageFaults), Valid: true},
			IoReadBytes:              pgtype.Int4{Int32: int32(result.Metrics.IO.ReadBytes), Valid: true},
			IoWriteBytes:             pgtype.Int4{Int32: int32(result.Metrics.IO.WriteBytes), Valid: true},
			IoReadCount:              pgtype.Int4{Int32: int32(result.Metrics.IO.ReadCount), Valid: true},
			IoWriteCount:             pgtype.Int4{Int32: int32(result.Metrics.IO.WriteCount), Valid: true},
			Oom:                      pgtype.Int4{Int32: int32(result.Metrics.Memory.OOM), Valid: true},
			OomKill:                  pgtype.Int4{Int32: int32(result.Metrics.Memory.OOMKill), Valid: true},
			VoluntaryContextSwitch:   pgtype.Int4{Int32: int32(result.Metrics.VoluntaryCtxt), Valid: true},
			InvoluntaryContextSwitch: pgtype.Int4{Int32: int32(result.Metrics.InvoluntaryCtxt), Valid: true},
			ExitCode:                 pgtype.Int4{Int32: int32(result.ExitCode), Valid: true},
			WallTime:                 pgtype.Float4{Float32: float32(result.Metrics.Wall), Valid: true},
			UpdatedAt:                pgtype.Timestamp{Time: time.Now(), Valid: true},
			Token:                    pgtype.Text{String: subId.String(), Valid: true},
		}
		if request.Stdin != nil {
			updatedSubmission.Stdin = pgtype.Text{String: *request.Stdin, Valid: true}
		}
		err = Queries.UpdateSubmissionWithResult(to, updatedSubmission)
		if err != nil {
			slog.Error("submission update failed", "error", err)
			http.Error(w, "submission update failed", http.StatusInternalServerError)
			return
		}
	}()
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
