FROM golang:1.22 AS build
WORKDIR /go/src/app
COPY . .
RUN go mod download
RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y \
  ca-certificates \
  cgroup-tools \
  time \
  procps \
  systemd \
  && rm -rf /var/lib/apt/lists/*
COPY --from=build /go/bin/app /
CMD ["/app"]