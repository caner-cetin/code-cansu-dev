import { Ace } from "ace-builds";
import { useRTCStore } from "@/stores/RTCStore";
import ReactAce from "react-ace/lib/ace";
import {v4 as uuidv4} from 'uuid';
import { LanguageId } from "@/services/settings";
import { useAppStore } from "@/stores/AppStore";
import toast from "react-hot-toast";
import { StoredSubmission } from "@/hooks/useSubmissions";
import api from "./api";
export enum MessageTypes {
    EDITOR_CHANGE_DELTA = "editor_change_delta",
    PEER_CONNECT = "peer_connect",
    PEER_DISCONNECT = "peer_disconnect",
    CURRENT_LANGUAGE_ID = "current_language_id",
    CURRENT_HOST_METADATA = "current_host_metadata",
    CONNECTED_PEERS = "connected_peers",
    EDITOR_CONTENT = "editor_content",
    NEW_SUBMISSION = "new_submission",
}


export interface LanguageIdPayload {
    id: LanguageId;
    issuedBy: string;
}
interface WSMessage {
    type: MessageTypes;
    payload: string | Ace.Delta | PeerMetadata | LanguageIdPayload | Array<PeerMetadata> | StoredSubmission;
}

export interface PeerMetadata {
    id: string
    nickname: string;
}

export default class RTCClient {
    public ws: WebSocket | null = null;
    public editorRef: React.MutableRefObject<ReactAce | null> | null = null;
    public metadata: PeerMetadata;

    private connectionRetryCount: number = 0;
    private maxRetries: number = 3;
    private wsReconnectTimeout: number | null = null;
    private notifiedPeers: boolean = false;
    private isProcessingRemoteChange: boolean = false;

    constructor(createRoom: boolean = false) {
        if (createRoom === true) {
            this.createRoom().then(() => {this.initializeWebSocket();}).catch(console.error);
        } else {
          this.initializeWebSocket()
        }
        this.metadata = {
            id: uuidv4(),
            nickname: useRTCStore.getState().nickname ?? "anon",
        }
    }
    private initializeWebSocket() {
        const state = useRTCStore.getState()
        
        const wsUrl = `ws://${import.meta.env.VITE_DRONE_URI}/${state.proxyToken}/rooms/subscribe`;
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
            if (!this.notifiedPeers) {
                this.ws?.send(JSON.stringify({
                    type: MessageTypes.PEER_CONNECT,
                    payload: this.metadata,
                }));
                this.notifiedPeers = true;
            }
            this.connectionRetryCount = 0;
        });

        this.ws.addEventListener("message", (ev) => {
            const rtcCtx = useRTCStore.getState();
            try {
                const message: WSMessage = JSON.parse(ev.data) as WSMessage;
                switch (message.type) {
                  case MessageTypes.EDITOR_CHANGE_DELTA:
                    this.handleEditorDeltaChange(message.payload as Ace.Delta);
                    break;
                case MessageTypes.PEER_CONNECT:
                    this.handlePeerConnect(message.payload as PeerMetadata);
                    break;
                case MessageTypes.PEER_DISCONNECT:
                    rtcCtx.setPeers(rtcCtx.peers?.filter((peer) => peer.id !== (message.payload as PeerMetadata).id));
                    break;
                case MessageTypes.CURRENT_LANGUAGE_ID:
                    this.handleLanguageIdChangeMessage((message.payload as LanguageIdPayload));
                    break;
                case MessageTypes.EDITOR_CONTENT:
                    this.handleEditorContentMessage(message.payload as string);
                    break;
                case MessageTypes.CURRENT_HOST_METADATA:
                    this.handleCurrentHostMetadataMessage(message.payload as PeerMetadata);
                    break;
                case MessageTypes.CONNECTED_PEERS:
                    rtcCtx.setPeers(message.payload as Array<PeerMetadata>);
                    break;
                case MessageTypes.NEW_SUBMISSION:
                    this.handleNewSubmissionMessage(message.payload as StoredSubmission);
                    break;
                default:
                    break;
                }
            } catch (error) {
            }
        });

        this.ws.addEventListener("close", () => {
            this.ws?.send(JSON.stringify({
                type: MessageTypes.PEER_DISCONNECT,
                payload: this.metadata,
            }));
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
            await api.post<{
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

    async isRoomValid() {
        // todo: implement this
    }
    public setupEditorBroadcasts() {
        if (!this.editorRef?.current) return;
        
        const editor = this.editorRef.current.editor;
        editor.on('change', (delta) => {
            if (!this.isProcessingRemoteChange) {
                this.ws?.send(JSON.stringify({
                    type: MessageTypes.EDITOR_CHANGE_DELTA,
                    payload: delta,
                }));
            }
        });
    }

    private handleEditorDeltaChange(delta: Ace.Delta) {
        if (!this.editorRef?.current) return;
        this.isProcessingRemoteChange = true;
        this.editorRef.current.editor.getSession().getDocument().applyDelta(delta);
        this.isProcessingRemoteChange = false;
    }

    private handleEditorContentMessage(content: string) {
        if (!this.editorRef?.current) return;
        this.isProcessingRemoteChange = true;
        this.editorRef.current.editor.setValue(atob(content));
        this.isProcessingRemoteChange = false;
    }


    private handlePeerConnect(metadata: PeerMetadata) {
        const syncToast = toast.loading(`New client ${metadata.nickname} is connected, syncing editors... `);
        setTimeout(() => {
            toast.dismiss(syncToast);
        }, 3000);   
        const ctx = useRTCStore.getState();
        const appCtx = useAppStore.getState();

        
        // Only host should send initial state
        if (ctx.host) {
            this.ws?.send(JSON.stringify({
                type: MessageTypes.CURRENT_LANGUAGE_ID,
                payload: {
                    id: appCtx.languageId,
                    issuedBy: this.metadata.id,
                }
            }));
            this.ws?.send(JSON.stringify({
                type: MessageTypes.EDITOR_CONTENT,
                payload: btoa(this.editorRef?.current?.editor?.getValue() ?? ""),
            }));
            this.ws?.send(JSON.stringify({ 
                type: MessageTypes.CURRENT_HOST_METADATA,
                payload: this.metadata,
            }));
            if (ctx.peers) {
                this.ws?.send(JSON.stringify({
                    type: MessageTypes.CONNECTED_PEERS,
                    payload: [...ctx.peers, metadata],
                }));
            }
        }
        ctx.setPeers([...(ctx.peers ?? []), metadata]);

    }

    private handleLanguageIdChangeMessage(payload: LanguageIdPayload) {
        const appCtx = useAppStore.getState();
        if (appCtx.languageId !== payload.id && payload.issuedBy !== this.metadata.id) appCtx.setLanguageId(payload.id);
    }

    private handleCurrentHostMetadataMessage(payload: PeerMetadata) {
        const rtcCtx = useRTCStore.getState();
        rtcCtx.setCurrentHostId(this.metadata.id);
        rtcCtx.setHost(this.metadata.id === payload.id);
    }

    private handleNewSubmissionMessage(submission: StoredSubmission) {
        const appCtx = useAppStore.getState();
        const loadingToast = toast.loading("host is executing code...");
        // for some reason, toast is not automatically dismissed here
        setTimeout(() => {
            toast.dismiss(loadingToast)
        }, 3000)
        if (!appCtx.submissions) {
			appCtx.setSubmissions([]);
		}
		// eslint please shut up
		if (appCtx.submissions) {
			appCtx.setSubmissions(
				[submission, ...appCtx.submissions].sort((a, b) => b.localId - a.localId),
			);
		}
    }
}