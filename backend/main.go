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
	"os"
	"time"

	"github.com/docker/docker/client"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/grafana/loki-client-go/loki"
	"github.com/jackc/pgx/v5/pgxpool"
	libredis "github.com/redis/go-redis/v9"
	slogchi "github.com/samber/slog-chi"
	slogloki "github.com/samber/slog-loki/v3"
	slogmulti "github.com/samber/slog-multi"
)

var (
	LogLevel            = NewEnv("LOG_LEVEL", slog.LevelInfo).Get()
	Port                = NewEnv("PORT", "6767").Get()
	DBUrl               = NewEnv("DATABASE_URL", "").Get()
	HuggingFaceModelUrl = NewEnv("HF_MODEL_URL", "").Get()
	HuggingFaceToken    = NewEnv("HF_TOKEN", "").Get()
	RedisUrl            = NewEnv("REDIS_URL", "").Get()
	RedisPassword       = NewEnv("REDIS_PASSWORD", "").Get()
	LokiUrl             = NewEnv("LOKI_URL", "").Get()
)

func init() {
	if DBUrl == "" {
		log.Fatal("Database connection URL is not set")
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()
	pool, err := pgxpool.New(ctx, DBUrl)
	if err != nil {
		log.Fatal(err)
	}
	controllers.DB = pool
	//
	//
	if RedisUrl == "" {
		log.Fatal("Redis connection URL is not set")
	}
	if RedisPassword == "" {
		log.Fatal("Redis password is not set")
	}
	option, err := libredis.ParseURL(RedisUrl)
	if err != nil {
		log.Fatal(err)
	}
	option.Password = RedisPassword
	internal.RedisInstance = libredis.NewClient(option)
	//
	//
	if (LokiUrl) == "" {
		log.Fatal("Loki URL is not set")
	}
	//
	//
	controllers.SetupWSHandlers()
	//
	//
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatal(err)
	}
	internal.Docker = cli
	//
	//
	controllers.Queries = db.New(pool)
	internal.HF_MODEL_URL = HuggingFaceModelUrl
	internal.HF_TOKEN = HuggingFaceToken
}

func main() {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{
			"https://code.cansu.dev",
			"http://localhost:5173",
			"http://localhost:5174",
			"http://localhost:4173",
			"http://localhost:4174",
			"https://haul.code-cansu-dev.pages.dev",
			"http://localhost:3000",
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Upgrade", "Sec-WebSocket-Key", "Sec-WebSocket-Version", "Sec-WebSocket-Extensions"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))
	// todo: change this to env
	config, err := loki.NewDefaultConfig(LokiUrl)
	if err != nil {
		log.Fatal(err)
	}
	config.TenantID = "code-cansu-dev"
	config.ExternalLabels.Set("service_name=code-cansu-dev-backend")
	client, err := loki.New(config)
	if err != nil {
		log.Fatal(err)
	}

	logger := slog.New(slogmulti.Fanout(
		slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}),
		slogloki.Option{Level: slog.LevelDebug, Client: client}.NewLokiHandler(),
	))
	slog.SetDefault(logger)
	r.Use(slogchi.New(logger))
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "https://www.youtube.com/watch?v=eAaGYwBR38I", http.StatusSeeOther)
	})
	r.Route("/rooms", func(r chi.Router) {
		r.Post("/create", internal.Limiter(internal.RoomCreateLimit, "room_create_limit").Handler(http.HandlerFunc(controllers.CreateRoom)).ServeHTTP)
		r.Get("/subscribe", controllers.SubscribeRoom)
		r.Get("/status", controllers.GetRoomStatus)
	})
	r.Route("/judge", func(r chi.Router) {
		r.Get("/languages", controllers.GetLanguages)
		r.Post("/execute", internal.Limiter(internal.CodeExecuteLimit, "code_execution_limit").Handler(http.HandlerFunc(controllers.ExecuteCode)).ServeHTTP)
		r.Route("/{token}", func(r chi.Router) {
			r.Get("/", controllers.GetSubmission)
			r.Get("/react", controllers.ReactSubmission)
		})
	})
	chi.Walk(r, func(method string, route string, handler http.Handler, middlewares ...func(http.Handler) http.Handler) error {
		fmt.Printf("[%s]: '%s' \n", method, route)
		return nil
	})
	log.Printf("Starting server on :%s", Port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", Port), r))
}
