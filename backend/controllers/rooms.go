package controllers

import (
	"code-cansu-dev-collab/internal"
	"encoding/json"
	"net/http"
)

func SubscribeRoom(w http.ResponseWriter, r *http.Request) {
	Mel.HandleRequest(w, r)
}

type CreateRoomResponse struct {
	BackendID string `json:"backendId"`
	Token     string `json:"proxyToken"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	spawnResult, err := internal.SpawnBackend()
	if err != nil {
		http.Error(w, "Failed to create room", http.StatusInternalServerError)
		return
	}
	var response CreateRoomResponse
	response.Token = spawnResult.Token
	response.BackendID = spawnResult.BackendID
	json.NewEncoder(w).Encode(response)
}

func RoomStatus(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
	return
}
