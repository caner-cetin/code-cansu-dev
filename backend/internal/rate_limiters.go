package internal

import (
	"log"
	"time"

	libredis "github.com/redis/go-redis/v9"

	limiter "github.com/ulule/limiter/v3"
	limiterhttp "github.com/ulule/limiter/v3/drivers/middleware/stdlib"
	limiterredis "github.com/ulule/limiter/v3/drivers/store/redis"
)

var REDIS_URL string
var REDIS_PASSWORD string
type RateLimitTypes int
var CodeExecuteLimit = limiter.Rate{
	Period: 60 * time.Second,
	Limit:  5,
}

func Limiter(rate limiter.Rate, prefix string) *limiterhttp.Middleware {

	// Create a redis client.
	option, err := libredis.ParseURL(REDIS_URL)
	if err != nil {
		log.Fatal(err)
	}
	option.Password = REDIS_PASSWORD
	client := libredis.NewClient(option)

	// Create a store with the redis client.
	store, err := limiterredis.NewStoreWithOptions(client, limiter.StoreOptions{
		Prefix:   prefix,
	})
	if err != nil {
		log.Fatal(err)
	}
	return limiterhttp.NewMiddleware(limiter.New(store, rate, limiter.WithTrustForwardHeader(true), limiter.WithClientIPHeader("CF-Connecting-IP")))
}
