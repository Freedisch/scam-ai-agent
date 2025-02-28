package main

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"scamcall.com/call/services"
	"scamcall.com/call/utils"
)

func main() {
	_ = godotenv.Load()

	// if err != nil {
	// 	log.Fatal("Cannot retrieve call %s", err)
	// }
	// Initialize Firebase
	utils.InitializeFirebase()
	defer utils.CloseFirestoreConnection()
	

	app := gin.Default()
	app.GET("/", services.HealthCheck)
	app.GET("/healthcheck", services.HealthCheck)
	app.Any("/llm-websocket/:call_id", services.Retellwhandler)
	app.POST("/twilio-webhook/:agent_id", services.Twiliowebhookhandler)
	app.Run(":8081")
}