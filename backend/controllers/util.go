package controllers

import (
	"code-cansu-dev-collab/db"
	"log/slog"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/olahol/melody"
)

var Mel = melody.New()
var DB *pgxpool.Pool
var Queries *db.Queries

func SetupWSHandlers() {
	Mel.Upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	Mel.HandleMessage(func(s *melody.Session, b []byte) {
		slog.Info("received message", "msg", string(b), "session", s.Request.RemoteAddr)
		Mel.BroadcastOthers(b, s)
	})
}

type MessageType string

type Message struct {
	Type    MessageType `json:"type"`
	Payload interface{} `json:"payload"`
}
