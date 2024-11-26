package internal

import (
	"bytes"
	"code-cansu-dev-collab/db"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

var HF_MODEL_URL string
var HF_TOKEN string

type InferenceRequestParameters struct {
	// Activate logits sampling.
	DoSample bool `json:"do_sample"`
	// The number of highest probability vocabulary tokens to keep for top-k-filtering.
	TopK int8 `json:"top_k"`
	// Top-p value for nucleus sampling.
	TopP float32 `json:"top_p"`
	// The value used to module the logits distribution.
	Temperature float32 `json:"temperature"`
	// Whether to prepend the prompt to the generated text
	ReturnFullText bool `json:"return_full_text"`
}
type InferenceRequest struct {
	// prompt
	Inputs     string `json:"inputs"`
	Parameters InferenceRequestParameters
}

type InferenceData struct {
	GeneratedText string `json:"generated_text"`
}

type InferenceResponse []InferenceData

func ReactToSubmission(submission db.Submission) (*string, error) {
	sc, err := base64.StdEncoding.DecodeString(submission.SourceCode.String)
	if err != nil {
		return nil, err
	}
	stdout, err := base64.StdEncoding.DecodeString(submission.Stdout.String)
	if err != nil {
		return nil, err
	}
	prompt := fmt.Sprintf(`You are an enthusiastic fan of programming,professional cheerleader, and a cute anime girl. Following context is a source code and the output in order, react to the source code in a cute way.
		Keep it very short, limit yourself to maximum 2 sentences and limit the sentences to very short, this reaction is intended to show in a dialogue box. 
		Try to be as creative as possible, don't be afraid to be funny or silly (except misinformation or offensive content),
		you are free to say whatever you want, just do not repeat yourself. Do not use emojis. Do not make assumptions like "this must be a complex program, this must be X" only react to what you see. Do not be too ordinary, such
		as "Yeah! I see the code is running, good job!" or artifical sounding reactions "Oh my gosh", be more creative, be yourself, you are a cute anime girl. Do not comment on the thinking process, such as "i am busy encoding the source code", just react to the source code and the run.

		Return the answer in plain text after the Answer: part, so your response will look like Answer: "your reaction"

		Context: %s %s
		Answer:
		`, sc, stdout)
	var request InferenceRequest
	request.Inputs = prompt
	request.Parameters.TopK = 50
	request.Parameters.TopP = 0.95
	request.Parameters.Temperature = 0.8
	request.Parameters.ReturnFullText = false

	body, err := json.Marshal(request)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest(http.MethodPost, HF_MODEL_URL, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", HF_TOKEN))
	req.Header.Add("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var respJson InferenceResponse
	err = json.Unmarshal(respBytes, &respJson)
	if err != nil {
		return nil, err
	}
	// delete anything before Answer:
	response := strings.Split(respJson[0].GeneratedText, "Answer:\n")[1]
	response = strings.Trim(response, "\t")
	response = strings.Split(response, "\n")[0]
	response = strings.TrimSpace(response)
	return &response, err
}
