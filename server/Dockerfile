FROM golang:1.23-alpine AS builder

WORKDIR /app

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o server ./cmd/api


FROM alpine:3.19

RUN apk add --no-cache ca-certificates

WORKDIR /app
COPY --from=builder /app/server .

EXPOSE 8080
ENTRYPOINT ["./server"]
