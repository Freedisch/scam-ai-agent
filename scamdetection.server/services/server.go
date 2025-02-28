package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"

	"github.com/gorilla/websocket"
	"github.com/sashabaranov/go-openai"
	"scamcall.com/call/utils"
)

func HandleWebsocketMessages(msg Request, conn *websocket.Conn,  session *CallSession) {
	client := openai.NewClient(utils.GetOpenAISecretKey())
	//docRef := utils.FirestoreClient.Collection("calls").Doc(strconv.Itoa(session.InitialResponseID))

	if msg.InteractionType == "update_only" {
		log.Println("update interaction, do nothing ")
		return
	}
	fmt.Println("founnfnfnf %v", msg.InteractionType)

	prompt := GenerateAIRequest(msg)
	req := openai.ChatCompletionRequest{
		Model: openai.GPT3Dot5Turbo,
		Messages: prompt,
		Stream: true,
		MaxTokens: 200,
		Temperature: 1.0,
	}
	stream, err := client.CreateChatCompletionStream(context.Background(), req)
	if err != nil {
		log.Println(err)
		conn.Close()
	}
	defer stream.Close()
	var i int
	for {
		response, err := stream.Recv()
		if err != nil {
			var s string
			if (errors.Is(err, io.EOF) && i == 0) || (!errors.Is(err, io.EOF)){
				s = "[ERROR] NO RESPONSE, PLEASE RETRY"
			}

			// if errors.Is(err, io.EOF) && i != 0{
			// 	s = "\n\n###### [END] ######"
			// }
			airesponse := Response{
				ResponseID: msg.ResponseID,
				Content: s,
				ContentComplete: false,
				EndCall: false,
			}

			out, err := json.Marshal(airesponse)
			if err != nil {
				log.Println(err)
				conn.Close()
			}

			err = conn.WriteMessage(websocket.TextMessage, out)
			if err != nil {
				log.Println(err)
				conn.Close()
			}
			break
		}
		if len(response.Choices) > 0 {
			s := response.Choices[0].Delta.Content
			airesponse := Response{
				ResponseID: msg.ResponseID,
				Content: s,
				ContentComplete: false,
				EndCall: false,
			}
			log.Println(airesponse)

			out, _ := json.Marshal(airesponse)
			err = conn.WriteMessage(websocket.TextMessage, out)
			if err != nil {
				log.Println(err)
				conn.Close()
			}
		}
		i = i + 1
	}
	

}

func GenerateAIRequest(msg Request) []openai.ChatCompletionMessage {
	var airequest  []openai.ChatCompletionMessage

	systemprompt := openai.ChatCompletionMessage{
		Role: "system",
		Content: "You are an AI scam detection assistant. Your role is to interact with callers to determine if they are potential scammers. Ask direct and probing questions to assess the legitimacy of the call. Focus on identifying inconsistencies, evasive answers, or common scam patterns. For example, ask for details about their identity, the purpose of the call, and any requests for money or personal information. Be polite but firm, and flag suspicious behavior for further review.",
	}

	airequest = append(airequest, systemprompt)
	for _, response := range msg.Transcript {
		var p_response openai.ChatCompletionMessage
		if response.Role == "agent"{
			p_response.Role = "assistant"
		} else {
			p_response.Role = "user"
		}
		p_response.Content = response.Content
		airequest = append(airequest, p_response)
	}
	return airequest
}