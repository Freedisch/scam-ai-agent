package services

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/twilio/twilio-go/twiml"
	"scamcall.com/call/utils"
)

type RegisterCallRequest struct {
	AgentID string `json:"agent_id"`
	AudioEncoding string `json:"audio_encoding"`
	AudioWebsocketProtocol string `json:"audio_websocket_protocol"`
	SampleRate int `json:"sample_rate"`

}

type RegisterCallResponse struct {
	AgenID string `json:"agent_id"`
	AudioEncoding string `json:"audio_encoding"`
	AudioWebsocketProtocol string `json:"audio_websocket_protocol"`
	CallID string `json:"call_id"`
	SampleRate int `json:"sample_rate"`
	StartTimestamp int `json:"start_times"`
}

func Twiliowebhookhandler(c *gin.Context) {
	agent_id := c.Param("agent_id")

	callinfo, err := RegisterRetellCall(agent_id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, "cannot handle call atm")
	}
	log.Println(callinfo)

	twilioresponse := &twiml.VoiceStream{
		Url: "wss://api.retellai.com/audio-websocket/" + callinfo.CallID,
	}
	log.Println(twilioresponse)

	twiliostart := &twiml.VoiceConnect{
		InnerElements: []twiml.Element{twilioresponse},
	}

	twimlResult, err := twiml.Voice([]twiml.Element{twiliostart})
	if err != nil {
		c.JSON(http.StatusInternalServerError, "failed conection with twilio connect")
		return
	}
	log.Println(twimlResult)

	c.Header("Content-Type", "text/xml")
	c.String(http.StatusOK, twimlResult)
}

func RegisterRetellCall(agent_id string) (RegisterCallResponse, error) {
	request := RegisterCallRequest{
		AgentID: agent_id,
		AudioEncoding: "mulaw",
		SampleRate: 8000,
		AudioWebsocketProtocol: "twilio",
	}

	request_bytes, err := json.Marshal(request)
	if err != nil {
		return RegisterCallResponse{}, err
	}

	payload := bytes.NewBuffer(request_bytes)
	request_url := "https://api.retellai.com/register-call"
	method := "POST"

	var bearer = "Bearer " + utils.GetRetellAISecretKey()
	client := &http.Client{}
	req, err := http.NewRequest(method, request_url, payload)
	if err != nil {
		return RegisterCallResponse{}, err
	}
	log.Println(req)

	req.Header.Add("Authorization", bearer)
	req.Header.Add("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return RegisterCallResponse{}, err
	}
	log.Println("Response %v", res)

	defer res.Body.Close()
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return RegisterCallResponse{}, err
	}

	log.Println("body %v", body)
	var response RegisterCallResponse
	json.Unmarshal(body, &response)
	return response, nil
}