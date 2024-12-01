package internal

import (
	"log"
	"time"

	libredis "github.com/redis/go-redis/v9"

	limiter "github.com/ulule/limiter/v3"
	limiterhttp "github.com/ulule/limiter/v3/drivers/middleware/stdlib"
	limiterredis "github.com/ulule/limiter/v3/drivers/store/redis"
)

type RateLimitTypes int

var CodeExecuteLimit = limiter.Rate{
	Period: 60 * time.Second,
	Limit:  5,
}
var RoomCreateLimit = limiter.Rate{
	Period: 60 * time.Second,
	Limit:  1,
}
var RedisInstance *libredis.Client

func Limiter(rate limiter.Rate, prefix string) *limiterhttp.Middleware {
	store, err := limiterredis.NewStoreWithOptions(RedisInstance, limiter.StoreOptions{
		Prefix: prefix,
	})
	if err != nil {
		log.Fatal(err)
	}
	return limiterhttp.NewMiddleware(limiter.New(store, rate, limiter.WithTrustForwardHeader(true), limiter.WithClientIPHeader("CF-Connecting-IP")))
}
