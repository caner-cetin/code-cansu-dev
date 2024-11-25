package main

import (
	"code-cansu-dev-collab/controllers"
	"code-cansu-dev-collab/db"
	"code-cansu-dev-collab/internal"
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"time"

	"github.com/docker/docker/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	LogLevel = NewEnv("LOG_LEVEL", slog.LevelInfo).Get()
	Port     = NewEnv("PORT", "6767").Get()
	DBUrl    = NewEnv("DATABASE_URL", "").Get()
)

func init() {
	controllers.SetupWSHandlers()
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal(err)
	}
	internal.Docker = cli
}

func main() {
	if DBUrl == "" {
		log.Fatal("Database connection URL is not set")
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	conn, err := pgxpool.New(ctx, DBUrl)
	if err != nil {
		log.Fatal(err)
	}
	controllers.DB = conn
	queries := db.New(conn)
	controllers.Queries = queries
	cancel()
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
	r.Route("/judge", func(r chi.Router) {
		r.Get("/languages", controllers.GetLanguages)
		r.Post("/execute", controllers.ExecuteCode)
		r.Get("/{token}", controllers.GetSubmission)
	})
	chi.Walk(r, func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		fmt.Printf("[%s]: '%s' \n", method, route)
		return nil
	})
	log.Printf("Starting server on :%s", Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", Port), r))
}
