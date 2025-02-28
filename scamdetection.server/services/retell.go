package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/twilio/twilio-go/twiml"
	"scamcall.com/call/utils"
)

type RegisterCallRequest struct {
	AgentID                    string                 `json:"agent_id"`
	FromNumber                 string                 `json:"from_number,omitempty"`
	ToNumber                   string                 `json:"to_number,omitempty"`
	Direction                  string                 `json:"direction,omitempty"`
	Metadata                   map[string]interface{} `json:"metadata,omitempty"`
	RetellLlmDynamicVariables  map[string]string      `json:"retell_llm_dynamic_variables,omitempty"`
}

type RegisterCallResponse struct {
	CallType                   string                 `json:"call_type"`
	FromNumber                 string                 `json:"from_number"`
	ToNumber                   string                 `json:"to_number"`
	Direction                  string                 `json:"direction"`
	CallID                     string                 `json:"call_id"`
	AgentID                    string                 `json:"agent_id"`
	CallStatus                 string                 `json:"call_status"`
	Metadata                   map[string]interface{} `json:"metadata"`
	RetellLlmDynamicVariables  map[string]string      `json:"retell_llm_dynamic_variables"`
	OptOutSensitiveDataStorage bool                   `json:"opt_out_sensitive_data_storage"`
	StartTimestamp             int64                  `json:"start_timestamp,omitempty"`
	EndTimestamp               int64                  `json:"end_timestamp,omitempty"`
	Transcript                 string                 `json:"transcript,omitempty"`
	RecordingURL               string                 `json:"recording_url,omitempty"`
	PublicLogURL               string                 `json:"public_log_url,omitempty"`
	DisconnectionReason        string                 `json:"disconnection_reason,omitempty"`
}

func Twiliowebhookhandler(c *gin.Context) {
	agentID := c.Param("agent_id")

	fromNumber := c.Query("from_number")
	toNumber := c.Query("to_number")

	callInfo, err := RegisterRetellCall(agentID, fromNumber, toNumber)
	if err != nil {
		log.Printf("Failed to register call: %v\n", err)
		c.JSON(http.StatusInternalServerError, "cannot handle call atm")
		return
	}
	log.Printf("Call info: %+v\n", callInfo)

	twilioResponse := &twiml.VoiceStream{
		Url: "wss://api.retellai.com/audio-websocket/" + callInfo.CallID,
	}
	log.Printf("Twilio response: %+v\n", twilioResponse)

	twilioStart := &twiml.VoiceConnect{
		InnerElements: []twiml.Element{twilioResponse},
	}

	twimlResult, err := twiml.Voice([]twiml.Element{twilioStart})
	if err != nil {
		log.Printf("Failed to generate TwiML: %v\n", err)
		c.JSON(http.StatusInternalServerError, "failed connection with Twilio connect")
		return
	}
	log.Printf("TwiML result: %s\n", twimlResult)

	c.Header("Content-Type", "text/xml")
	c.String(http.StatusOK, twimlResult)
}

func RegisterRetellCall(agentID, fromNumber, toNumber string) (RegisterCallResponse, error) {
	request := RegisterCallRequest{
		AgentID:    agentID,
		FromNumber: fromNumber,
		ToNumber:   toNumber,
		Direction:  "inbound", // or "outbound" depending on your use case
	}

	requestBytes, err := json.Marshal(request)
	if err != nil {
		return RegisterCallResponse{}, fmt.Errorf("failed to marshal request: %v", err)
	}

	payload := bytes.NewBuffer(requestBytes)
	requestURL := "https://api.retellai.com/v2/register-phone-call"
	method := "POST"

	bearer := "Bearer " + utils.GetRetellAISecretKey()
	client := &http.Client{}
	req, err := http.NewRequest(method, requestURL, payload)
	if err != nil {
		return RegisterCallResponse{}, fmt.Errorf("failed to create request: %v", err)
	}
	log.Printf("Request: %+v\n", req)

	req.Header.Add("Authorization", bearer)
	req.Header.Add("Content-Type", "application/json")
	res, err := client.Do(req)
	if err != nil {
		return RegisterCallResponse{}, fmt.Errorf("failed to send request: %v", err)
	}
	defer res.Body.Close()

	log.Printf("Response status: %s\n", res.Status)
	body, err := io.ReadAll(res.Body)
	if err != nil {
		return RegisterCallResponse{}, fmt.Errorf("failed to read response body: %v", err)
	}
	log.Printf("Response body: %s\n", body)

	if res.StatusCode != http.StatusCreated { // Expecting 201 for success
		return RegisterCallResponse{}, fmt.Errorf("API request failed with status %d: %s", res.StatusCode, body)
	}

	var response RegisterCallResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return RegisterCallResponse{}, fmt.Errorf("failed to unmarshal response: %v", err)
	}

	return response, nil
}