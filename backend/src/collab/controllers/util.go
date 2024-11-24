package controllers

import (
	"log/slog"
	"net/http"

	"github.com/olahol/melody"
)

var Mel = melody.New()

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
