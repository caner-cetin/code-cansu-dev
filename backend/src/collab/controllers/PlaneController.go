package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"github.com/google/uuid"
)

// https://plane.dev/plane-api#connect-api
type ControlConnectRequest struct {
	//  Optional object describing the key to connect to.
	//  If not provided, one will be generated randomly (forcing a new backend to start).
	Key struct {
		// The name of the key. Keys with the same name in the same namespace are considered the same key,
		// meaning that only one backend will run for them at a time.
		Name string `json:"name"`
		// The namespace of the key. Keys with the same name in different namespaces are considered different keys.
		Namespace string `json:"namespace"`
		//  If provided, only a backend with the same tag as requested will be returned,
		// 	but if there is a backend with the same name and namespace but a different tag, an error will be returned instead.
		Tag string `json:"tag,omitempty"`
	} `json:"key,omitempty"`

	// Optional configuration that is used to start a new backend if necessary.
	Spawn struct {
		Executable struct {
			// The Docker image to use to run the backend.
			Image string `json:"image"`
			// Optional string specifying the Docker pull policy to use when pulling the image.
			// Valid values are Always, IfNotPresent, and Never. If not provided, IfNotPresent is used.
			PullPolicy PullPolicyEnum `json:"pull_policy,omitempty"`
			// Optional object containing credentials to use to connect to the Docker registry.
			// Currently, only username/password credentials are supported, by providing an object with the fields username and password.
			Credentials string `json:"credentials,omitempty"`
		} `json:"executable"`
		// An optional numeric field which, if provided, creates a deadline (in seconds from now)
		// that the backend will be terminated regardless of whether it has inbound connections.
		LifetimeLimitSeconds int `json:"lifetime_limit_seconds,omitempty"`
		// An optional numeric field which, if provided, creates a limit for how long (in seconds) a backend can
		// have no inbound connections to it before it is terminated. If not provided, there is no limit.
		MaxIdleSeconds int `json:"max_idle_seconds,omitempty"`
	} `json:"spawn_config,omitempty"`

	// Optional string to associate with the user on whose behalf this request is being made.
	User string `json:"user,omitempty"`

	// Optional key-value map of unforgeable data (such as claims) that you would like to pass to the backend about this user.
	//
	// 	"auth": {
	//		"any arbitrary JSON object": "can go here",
	//		"Plane does not read it": "it is just passed through to your backend",
	//		"even lists and numbers": ["like", 3.14, "are", "fine"]
	// 	}
	Auth map[string]interface{} `json:"auth,omitempty"`
}

type ControlConnectResponse struct {
	// use this to query status of the backend from plane controller, e.g "plane-controller:8080/pub/b/backendid/status"
	BackendID string `json:"backend_id"`
	Spawned   bool   `json:"spawned"`
	Status    string `json:"status"`
	// backend token, stick this to the end of plane proxy url (with no other path, plane-proxy:9090/token/ will be your proxy)
	Token string `json:"token"`
	// all requests to this url will be proxied to the backend
	URL string `json:"url"`
	// subdomain of the backend, if it has one
	Subdomain *string `json:"subdomain"`
	// secret token, useful for god knows what
	SecretToken string `json:"secret_token"`
	// status url, dont use this directly, use the backend id to query status.
	// this url always starts withn 0.0.0.0, use the docker network instead, like plane-controller:8080/pub/b/backendid/status
	StatusURL string `json:"status_url"`
	// drone id, useful for god knows what
	Drone string `json:"drone"`
}

type PullPolicyEnum string

const (
	PullPolicyAlways       PullPolicyEnum = "Always"
	PullPolicyIfNotPresent PullPolicyEnum = "IfNotPresent"
	PullPolicyNever        PullPolicyEnum = "Never"
)

func SpawnBackend() (*ControlConnectResponse, error) {
	rid, err := uuid.NewRandom()
	if err != nil {
		slog.Error("Failed to generate UUID", "error", err)
		return nil, err
	}
	var request ControlConnectRequest
	request.Key.Name = fmt.Sprintf("room-%s", rid)
	request.Key.Namespace = "code-cansu-dev-rtc"
	request.Spawn.MaxIdleSeconds = 60
	request.Spawn.Executable.Image = "code-cansu-dev-backend"
	body, err := json.Marshal(request)
	if err != nil {
		slog.Error("Failed to marshal JSON", "error", err)
		return nil, err
	}
	reader := bytes.NewReader(body)
	resp, err := http.DefaultClient.Post("http://localhost:8787/ctrl/connect", "application/json", reader)
	if err != nil {
		slog.Error("Failed to connect to Plane controller", "error", err)
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		err = fmt.Errorf("failed to create room, status: %d", resp.StatusCode)
		if resp.StatusCode == http.StatusNotFound {
			slog.Error("Plane controller not found", "error", err)
			return nil, err
		}
		failedResponse, err := io.ReadAll(resp.Body)
		if err != nil {
			slog.Error("Failed to read response body", "error", err)
			return nil, err
		}
		slog.Error("Failed to spawn backend", "status", resp.StatusCode, "response", string(failedResponse))
		return nil, err
	}
	defer resp.Body.Close()
	var response ControlConnectResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		slog.Error("Failed to decode JSON", "error", err)
		return nil, err
	}
	return &response, err
}
