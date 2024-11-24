import signallerApi from "@/services/rtc/api";
import { Ace } from "ace-builds";
import { useRTCStore } from "@/stores/RTCStore";
import { useEditorRef } from "@/stores/EditorStore";
import ReactAce from "react-ace/lib/ace";

enum MessageTypes {
    EDITOR_CHANGE_DELTA = "editor_change_delta",
}

interface WSMessage {
    type: MessageTypes;
    payload: string | Ace.Delta;
}

export default class RTCClient {
    public ws: WebSocket | null = null;
    public editorRef: React.MutableRefObject<ReactAce | null> | null = null;
    private connectionRetryCount: number = 0;
    private maxRetries: number = 3;
    private wsReconnectTimeout: number | null = null;

    constructor(createRoom: boolean = false) {
        if (createRoom === true) {
            this.createRoom().then(() => {this.initializeWebSocket();}).catch(console.error);
        } else {
          this.initializeWebSocket()
        }
    }

    private initializeWebSocket() {
        const state = useRTCStore.getState()
        const backendUri = import.meta.env.VITE_RTC_PLANE_PROXY_URI
        const socketPort = import.meta.env.VITE_RTC_PLANE_PROXY_PORT ? `:${import.meta.env.VITE_RTC_PLANE_PROXY_PORT}` : '';
        
        const wsUrl = `ws://${backendUri}${socketPort}/${state.proxyToken}/rooms/subscribe`;
        console.log('Connecting to WebSocket:', wsUrl);

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupWebSocketHandlers();
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.scheduleWebSocketReconnect();
        }
    }

    private setupWebSocketHandlers() {
        if (!this.ws) return;

        this.ws.addEventListener("open", () => {
            this.connectionRetryCount = 0;
        });

        this.ws.addEventListener("message", (ev) => {
            try {
                const message: WSMessage = JSON.parse(ev.data) as WSMessage;
                switch (message.type) {
                  case MessageTypes.EDITOR_CHANGE_DELTA:
                    this.handleEditorDeltaChange(message.payload as Ace.Delta);
                    break;
                  default:
                    break;
                }
            } catch (error) {
            }
        });

        this.ws.addEventListener("close", (event) => {
            console.log("WebSocket connection closed:", event.code, event.reason);
            this.scheduleWebSocketReconnect();
        });

        this.ws.addEventListener("error", (error) => {
            console.error("WebSocket error:", error);
        });
    }

    private scheduleWebSocketReconnect() {
        if (this.wsReconnectTimeout) return;
        
        if (this.connectionRetryCount < this.maxRetries) {
            this.connectionRetryCount++;
            const delay = Math.min(1000 * Math.pow(2, this.connectionRetryCount), 10000);
            
            console.log(`Scheduling WebSocket reconnection in ${delay}ms (attempt ${this.connectionRetryCount})`);
            
            this.wsReconnectTimeout = window.setTimeout(() => {
                this.wsReconnectTimeout = null;
                this.initializeWebSocket();
            }, delay);
        } else {
            console.error('Max WebSocket reconnection attempts reached');
        }
    }

    async createRoom() {
      const state = useRTCStore.getState()
      const setBackendId = state.setBackendId
      const setProxyToken = state.setProxyToken
        try {
            await signallerApi.post<{
                backendId: string;
                proxyToken: string;
            }>(`/rooms/create`).then((state) => {
                setBackendId(state.data.backendId);
                setProxyToken(state.data.proxyToken);
            });
        } catch (error) {
            console.error('Failed to initialize room:', error);
            throw error;
        }
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        if (this.wsReconnectTimeout) {
            clearTimeout(this.wsReconnectTimeout);
            this.wsReconnectTimeout = null;
        }
    }

    // anything related to editors
    public setupEditorBroadcasts() {
      if (!this.editorRef?.current) return;
      const editor = this.editorRef.current.editor;
      editor.on('change', (delta) => {
        this.ws?.send(JSON.stringify({
          type: MessageTypes.EDITOR_CHANGE_DELTA,
          payload: delta,
        }));
      })
    }

    private handleEditorDeltaChange(delta: Ace.Delta) {
        if (!this.editorRef?.current) return;
        this.editorRef.current.editor.getSession().getDocument().applyDelta(delta);
    }
}