package main

import (
	"code-cansu-dev-collab/controllers"
	"code-cansu-dev-collab/env"
	"fmt"
	"log"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

var (
	LogLevel = env.New("LOG_LEVEL", slog.LevelInfo).Get()
	Port     = env.New("PORT", "6767").Get()
)

func init() {
	controllers.SetupWSHandlers()
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"https://code.cansu.dev",
			"http://localhost:5173",
			"http://localhost:4173",
			"https://haul.code-cansu-dev.pages.dev",
			"http://localhost:3000",
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Upgrade", "Sec-WebSocket-Key", "Sec-WebSocket-Version", "Sec-WebSocket-Extensions"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "https://www.youtube.com/watch?v=eAaGYwBR38I", http.StatusSeeOther)
	})
	r.Route("/rooms", func(r chi.Router) {
		r.Post("/create", controllers.CreateRoom)
		r.Get("/subscribe", controllers.SubscribeRoom)
	})
	chi.Walk(r, func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		fmt.Printf("[%s]: '%s' \n", method, route)
		return nil
	})
	log.Printf("Starting server on :%s", Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", Port), r))
}
