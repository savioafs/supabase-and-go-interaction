package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/savioafs/supabase-todo-vip-backend/internal/service"
)

type WebhookPayload struct {
	Type  string `json:"type"`
	Table string `json:"table"`
	Record struct {
		UserID string `json:"user_id"`
	} `json:"record"`
	OldRecord struct {
		UserID string `json:"user_id"`
	} `json:"old_record"`
}

type WebhookHandler struct {
	vipService    *service.VIPService
	webhookSecret string
}

func NewWebhookHandler(vipService *service.VIPService, webhookSecret string) *WebhookHandler {
	return &WebhookHandler{
		vipService:    vipService,
		webhookSecret: webhookSecret,
	}
}

func (h *WebhookHandler) SecretMiddleware(c *gin.Context) {
	secret := c.GetHeader("X-Webhook-Secret")
	if secret == "" || secret != h.webhookSecret {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid secret"})
		return
	}
	c.Next()
}

func (h *WebhookHandler) CheckVIP(c *gin.Context) {
	var payload WebhookPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	userID := payload.Record.UserID
	if userID == "" {
		userID = payload.OldRecord.UserID
	}

	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id not found in payload"})
		return
	}

	log.Printf("received webhook for user: %s", userID)

	if err := h.vipService.CheckAndGrantVIP(c.Request.Context(), userID); err != nil {
		log.Printf("error checking VIP: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check vip status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "processed"})
}
