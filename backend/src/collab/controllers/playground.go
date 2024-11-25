package controllers

import (
	"code-cansu-dev-collab/internal"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"time"
)

func GetLanguages(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(internal.Languages)
}

type ExecuteCodeRequest struct {
	Language int8    `json:"language"`
	Code     string  `json:"code"`
	Stdin    *string `json:"stdin"`
}

func ExecuteCode(w http.ResponseWriter, r *http.Request) {
	var request ExecuteCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Failed to decode JSON", http.StatusBadRequest)
		return
	}
	var lang = internal.Languages[request.Language]
	to, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	commands := []string{}
	commands = append(commands, fmt.Sprintf("touch %s", lang.SourceFile))
	commands = append(commands, fmt.Sprintf("echo %s | base64 -d > %s", request.Code, lang.SourceFile))
	if lang.CompileCmd != "" {
		commands = append(commands, lang.CompileCmd)
	}
	commands = append(commands, lang.RunCmd)

	stdin, err := base64.StdEncoding.DecodeString(*request.Stdin)
	if err != nil {
		http.Error(w, "Failed to decode base64", http.StatusBadRequest)
		return
	}
	result, err := internal.ExecuteInContainer(to, "code-cansu-dev-runner", commands, &stdin)
	if err != nil {
		slog.Error("code execution failed", "error", err)
		http.Error(w, "code execution failed", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(result)
}
