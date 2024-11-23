package controllers

import (
	"context"
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var MainHub = NewHub()

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func SubscribeRoom(w http.ResponseWriter, r *http.Request) {
	roomID := chi.URLParam(r, "roomId")
	clientID := chi.URLParam(r, "clientId")

	// Validate UUIDs
	if _, err := uuid.Parse(roomID); err != nil {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}
	if _, err := uuid.Parse(clientID); err != nil {
		http.Error(w, "Invalid client ID", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Failed to upgrade connection", http.StatusInternalServerError)
		return
	}

	client := &Client{
		hub:    MainHub,
		conn:   conn,
		send:   make(chan []byte, 256),
		ID:     clientID,
		roomID: roomID,
	}

	client.hub.register <- client
	slog.Log(context.Background(), slog.LevelDebug,
		"starting write and read pump",
		"room", roomID,
		"client", clientID,
	)
	// Start goroutines for reading and writing
	go client.writePump()
	go client.readPump()
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	roomID := chi.URLParam(r, "roomId")

	// Validate UUID
	if _, err := uuid.Parse(roomID); err != nil {
		http.Error(w, "Invalid room ID", http.StatusBadRequest)
		return
	}

	MainHub.mu.Lock()
	if _, exists := MainHub.rooms[roomID]; exists {
		MainHub.mu.Unlock()
		http.Error(w, "Room already exists", http.StatusConflict)
		return
	}

	MainHub.rooms[roomID] = NewRoom(roomID)
	MainHub.mu.Unlock()

	w.WriteHeader(http.StatusNoContent)
}

func GetRoomPeers(w http.ResponseWriter, r *http.Request) {
	roomID := chi.URLParam(r, "roomId")

	MainHub.mu.RLock()
	room, exists := MainHub.rooms[roomID]
	MainHub.mu.RUnlock()

	if !exists {
		http.Error(w, "Room not found", http.StatusNotFound)
		return
	}

	room.mu.RLock()
	peerList := make([]string, len(room.peerList))
	copy(peerList, room.peerList)
	room.mu.RUnlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(peerList)
}
