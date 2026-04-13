package service

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

type VIPService struct {
	db *pgx.Conn
}

func NewVIPService(db *pgx.Conn) *VIPService {
	return &VIPService{db: db}
}

func (s *VIPService) CheckAndGrantVIP(ctx context.Context, userID string) error {
	// 1. Check if user has tasks and if all are completed
	var totalTasks, completedTasks int
	err := s.db.QueryRow(ctx, 
		"SELECT count(*), count(*) FILTER (WHERE is_completed = true) FROM todos WHERE user_id = $1", 
		userID).Scan(&totalTasks, &completedTasks)
	
	if err != nil {
		return fmt.Errorf("error querying tasks: %w", err)
	}

	// Logic: If user has at least one task and all are completed
	if totalTasks > 0 && totalTasks == completedTasks {
		// 2. Update profile to is_vip = true
		_, err = s.db.Exec(ctx, "UPDATE profiles SET is_vip = true WHERE id = $1", userID)
		if err != nil {
			return fmt.Errorf("error updating vip status: %w", err)
		}
		
		log.Printf("[VIP] User %s promoted to VIP. E-mail enviado.\n", userID)
	}

	return nil
}
