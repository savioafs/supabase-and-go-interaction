package config

import (
	"fmt"
	"os"
)

type Config struct {
	DatabaseURL   string
	WebhookSecret string
	Port          string
}

func Load() (*Config, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		return nil, fmt.Errorf("WEBHOOK_SECRET is required")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return &Config{
		DatabaseURL:   dbURL,
		WebhookSecret: webhookSecret,
		Port:          port,
	}, nil
}
