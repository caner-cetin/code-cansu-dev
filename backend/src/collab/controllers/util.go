package controllers

import (
	"context"
	"encoding/json"
	"log"
	"log/slog"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
)

type MessageType string

const (
	PeerJoined MessageType = "peer_joined"
	PeerLeft   MessageType = "peer_left"
	PeerList   MessageType = "peer_list"
)

type Message struct {
	Type    MessageType `json:"type"`
	Payload interface{} `json:"payload"`
}

// Client represents a connected peer
type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	ID       string
	roomID   string
	lastPing time.Time
	mu       sync.Mutex
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	// Registered rooms
	rooms map[string]*Room
	// Register requests from clients
	register chan *Client
	// Unregister requests from clients
	unregister chan *Client
	mu         sync.RWMutex
}

type Room struct {
	ID string
	// Registered clients in this room
	clients map[string]*Client
	// Maintains order of joined peers
	peerList []string
	// Broadcast messages to all clients in the room
	broadcast chan []byte
	mu        sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		rooms:      make(map[string]*Room),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func NewRoom(id string) *Room {
	return &Room{
		ID:        id,
		clients:   make(map[string]*Client),
		peerList:  make([]string, 0),
		broadcast: make(chan []byte),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			room, exists := h.rooms[client.roomID]
			if !exists {
				room = NewRoom(client.roomID)
				h.rooms[client.roomID] = room
				go room.run()
			}
			h.mu.Unlock()

			room.mu.Lock()
			room.clients[client.ID] = client
			room.peerList = append(room.peerList, client.ID)
			room.mu.Unlock()

			// Notify other clients about the new peer
			msg := Message{
				Type:    PeerJoined,
				Payload: client.ID,
			}
			msgBytes, _ := json.Marshal(msg)
			room.broadcast <- msgBytes

			// Send current peer list to the new client
			peerListMsg := Message{
				Type:    PeerList,
				Payload: room.peerList,
			}
			peerListBytes, _ := json.Marshal(peerListMsg)
			client.send <- peerListBytes

		case client := <-h.unregister:
			h.mu.RLock()
			room, exists := h.rooms[client.roomID]
			h.mu.RUnlock()

			if exists {
				room.mu.Lock()
				if _, ok := room.clients[client.ID]; ok {
					delete(room.clients, client.ID)
					close(client.send)

					// Remove from peer list
					for i, id := range room.peerList {
						if id == client.ID {
							room.peerList = append(room.peerList[:i], room.peerList[i+1:]...)
							break
						}
					}

					// Notify other clients about the peer leaving
					msg := Message{
						Type:    PeerLeft,
						Payload: client.ID,
					}
					msgBytes, _ := json.Marshal(msg)
					room.broadcast <- msgBytes
				}
				room.mu.Unlock()

				// If room is empty, remove it
				if len(room.clients) == 0 {
					h.mu.Lock()
					delete(h.rooms, client.roomID)
					h.mu.Unlock()
				}
			}
		}
	}
}

func (r *Room) run() {
	for {
		select {
		case message := <-r.broadcast:
			r.mu.RLock()
			for _, client := range r.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(r.clients, client.ID)
				}
			}
			r.mu.RUnlock()
		}
	}
}

func (c *Client) readPump() {

	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.mu.Lock()
		c.lastPing = time.Now()
		c.mu.Unlock()
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, _, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			slog.Log(context.Background(), slog.LevelDebug, "sending message",
				"room", c.roomID,
				"client", c.ID,
				"message", string(message),
			)
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				slog.Log(context.Background(), slog.LevelWarn, "write pump shutdown",
					"room", c.roomID,
					"client", c.ID,
				)
				return
			}
		}
	}
}
