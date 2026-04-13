package main

import (
	"context"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/savioafs/supabase-todo-vip-backend/internal/config"
	"github.com/savioafs/supabase-todo-vip-backend/internal/handler"
	"github.com/savioafs/supabase-todo-vip-backend/internal/service"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	conn, err := pgx.Connect(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}
	defer conn.Close(context.Background())

	vipService := service.NewVIPService(conn)
	webhookHandler := handler.NewWebhookHandler(vipService, cfg.WebhookSecret)

	r := gin.Default()
	r.POST("/webhooks/check-vip", webhookHandler.SecretMiddleware, webhookHandler.CheckVIP)

	log.Fatal(r.Run(":" + cfg.Port))
}
