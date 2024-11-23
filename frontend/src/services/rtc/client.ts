import { v4 as uuidv4 } from "uuid";
import { type DataConnection, Peer } from "peerjs";
import signallerApi from "@/services/rtc/api";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";
import { Ace } from "ace-builds";

enum MessageTypes {
    PEER_JOINED = "peer_joined",
    PEER_LEFT = "peer_left",
    PEER_LIST = "peer_list",
}

interface WSMessage {
    type: MessageTypes;
    payload: string;
}
interface DataChannelMessage {
    Delta?: Ace.Delta;
}

export default class RTCClient {
    public roomId: string;
    public clientId: string;
    public peers: Map<string, DataConnection>;
    private onDataChannel: ((data: DataChannelMessage) => void) | undefined;
    private peer: Peer;
    public ws: WebSocket | null = null;
    private connectionRetryCount: number = 0;
    private maxRetries: number = 3;
    private peerConnectionTimeout: number = 5000;
    private wsReconnectTimeout: number | null = null;

    constructor(roomId?: string, createRoom: boolean = false) {
        this.peers = new Map();
        this.clientId = uuidv4();
        this.peer = this.createPeer();
        if (roomId !== undefined) this.roomId = roomId; else this.roomId = uuidv4();
        if (createRoom === true) {
            this.CreateRoom().catch(console.error);
        }
        
        this.initializeWebSocket();
    }

    private createPeer(): Peer {
        const peer = new Peer(this.clientId);
        this.setupPeerEventHandlers(peer);
        return peer;
    }

    private initializeWebSocket() {
        const backendUri = import.meta.env.VITE_RTC_SIGNALLER_BACKEND_URI
        const socketPort = import.meta.env.VITE_RTC_SIGNALLER_BACKEND_PORT || '';
        
        const wsUrl = `ws://${backendUri}:${socketPort}/rooms/${this.roomId}/${this.clientId}/subscribe`;
        console.log('Connecting to WebSocket:', wsUrl);

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupWebSocketHandlers();
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            this.scheduleWebSocketReconnect();
        }
    }

    private setupPeerEventHandlers(peer: Peer) {
        peer.on('connection', (conn) => {
            this.handlePeerConnection(conn);
        });

        peer.on('error', (error) => {
            console.error('Peer error:', error);
            this.handlePeerError(error);
        });

        peer.on('disconnected', () => {
            console.log('Peer disconnected. Attempting to reconnect...');
            this.handlePeerDisconnect(this.clientId);
        });
    }

    private handlePeerConnection(conn: DataConnection) {
        conn.on('open', () => {
            console.debug(`Connection opened with peer ${conn.peer}`);
            this.peers.set(conn.peer, conn);
        });

        conn.on('data', (data) => {
            if (this.onDataChannel) {
              this.onDataChannel(data as DataChannelMessage);
            }
        });

        conn.on('close', () => {
            console.debug(`Connection closed with peer ${conn.peer}`);
            this.peers.delete(conn.peer);
        });

        conn.on('error', (error) => {
            console.error(`Connection error with peer ${conn.peer}:`, error);
            this.peers.delete(conn.peer);
        });
    }

    private setupWebSocketHandlers() {
        if (!this.ws) return;

        this.ws.addEventListener("open", () => {
            console.debug('WebSocket connection established for: ', this.clientId);
            this.connectionRetryCount = 0;
        });

        this.ws.addEventListener("message", (ev) => {
            try {
                const message: WSMessage = JSON.parse(ev.data);
                console.debug('Received WebSocket message:', message);
                
                switch (message.type) {
                    case MessageTypes.PEER_JOINED:
                        this.handleNewPeer(message.payload);
                        break;
                    case MessageTypes.PEER_LEFT:
                        this.handlePeerDisconnect(message.payload as string);
                        break;
                    case MessageTypes.PEER_LIST:
                        this.handleUpdatedPeerList(message.payload);
                        break;
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
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

    async CreateRoom() {
        try {
            await signallerApi.post(`/rooms/${this.roomId}/create`);
            console.log('Room initialized successfully');
        } catch (error) {
            console.error('Failed to initialize room:', error);
            throw error;
        }
    }

    broadcast(data: DataChannelMessage) {
        let sentTo = 0;
        const totalPeers = this.peers.size;

        if (totalPeers === 0) {
            console.warn("No peers to broadcast to");
            return;
        }

        console.debug(`Broadcasting data to ${totalPeers} peers from host ${this.clientId}`);
        console.debug('Data:', data);

        for (const [peerId, peer] of this.peers) {
            if (!peer.dataChannel || peer.dataChannel.readyState !== "open") {
                console.debug(`Skipping peer ${peerId} - channel not ready`);
                continue;
            }

            try {
                console.debug(`Peer ${sentTo+1}/${totalPeers}: ${this.clientId}`);
                peer.send(data);
                sentTo++;
            } catch (error) {
                console.error(`Error sending to peer ${peerId}:`, error);
                this.peers.delete(peerId);
            }
        }

        console.info(`Broadcast complete. Sent to ${sentTo}/${totalPeers} peers`);
    }

    public setOnDataChannel(callback: (data: DataChannelMessage) => void) {
        this.onDataChannel = callback;
    }

    public disconnect() {
        this.peers.forEach(peer => peer.close());
        this.peers.clear();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        if (this.wsReconnectTimeout) {
            clearTimeout(this.wsReconnectTimeout);
            this.wsReconnectTimeout = null;
        }
        
        this.peer.destroy();
    }

		private handleNewPeer(peerId: string) {
			try {
				      const id = peerId
							if (id === this.clientId || this.peers.has(id)) {
									return;
							}

							console.debug(`Initiating connection to new peer: ${id}`);
							const conn = this.peer.connect(id);

							// Set up connection timeout
							const timeoutId = setTimeout(() => {
									if (!this.peers.has(id)) {
											console.warn(`Connection timeout for peer ${id}`);
											conn.close();
									}
							}, this.peerConnectionTimeout);

							conn.on('open', () => {
									clearTimeout(timeoutId);
									console.debug(`Connection established with peer ${id}`);
									this.handlePeerConnection(conn);
							});

							conn.on('error', (error) => {
									clearTimeout(timeoutId);
									console.error(`Error connecting to peer ${id}:`, error);
									this.peers.delete(id);
							});
			} catch (error) {
					console.error('Error in handleNewPeer:', error);
			}
	}

	private handlePeerDisconnect(peerId: string) {
			try {
					console.debug(`Handling peer disconnect: ${peerId}`);
					const conn = this.peers.get(peerId);
					
					if (conn) {
							// Close the connection gracefully
							conn.close();
							this.peers.delete(peerId);
							console.debug(`Peer ${peerId} removed from peers map`);

							// Notify any listeners about the disconnection
							if (this.onPeerDisconnect) {
									this.onPeerDisconnect(peerId);
							}
					}
			} catch (error) {
					console.error(`Error handling peer disconnect for ${peerId}:`, error);
			}
	}

	private handleUpdatedPeerList(peerList: string[]) {
			try {
					console.debug('Handling updated peer list:', peerList);
					const currentPeers = Array.from(this.peers.keys());
					
					// Find peers to remove (peers we have that aren't in the new list)
					const peersToRemove = currentPeers.filter(peerId => 
							!peerList.includes(peerId) && peerId !== this.clientId
					);

					// Find peers to add (peers in the new list that we don't have)
					const peersToAdd = peerList.filter(peerId => 
							!this.peers.has(peerId) && peerId !== this.clientId
					);

					// Remove old peers
					for (const peerId of peersToRemove) {
							console.debug(`Removing peer ${peerId} as it's no longer in the list`);
							this.handlePeerDisconnect(peerId);
					}

					// Add new peers
					for (const peerId of peersToAdd) {
							console.debug(`Adding new peer ${peerId} from updated list`);
							this.handleNewPeer(peerId);
					}

					console.debug(`Peer list update complete. Connected to ${this.peers.size} peers`);
			} catch (error) {
					console.error('Error handling updated peer list:', error);
			}
	}

	private handlePeerError(error: Error) {
			try {
					console.error('Peer error:', error);

					if (this.connectionRetryCount < this.maxRetries) {
							this.connectionRetryCount++;
							const delay = Math.min(1000 * Math.pow(2, this.connectionRetryCount), 10000);
							
							console.log(`Attempting peer reconnection in ${delay}ms (attempt ${this.connectionRetryCount})`);
							
							setTimeout(() => {
									this.reconnectPeer();
							}, delay);
					} else {
							console.error('Max peer reconnection attempts reached');
							if (this.onFatalError) {
									this.onFatalError(new Error('Max peer reconnection attempts reached'));
							}
					}
			} catch (error) {
					console.error('Error in handlePeerError:', error);
			}
	}

	private async reconnectPeer() {
			try {
					console.log('Attempting to reconnect peer...');
					
					// Clean up existing peer
					this.peer.destroy();
					
					// Create new peer instance
					this.peer = this.createPeer();
					
					// Reinitialize WebSocket connection
					await this.initializeWebSocket();
					
					console.log('Peer reconnection successful');
					this.connectionRetryCount = 0;
			} catch (error) {
					console.error('Error reconnecting peer:', error);
					this.handlePeerError(error as Error);
			}
	}

	private onPeerDisconnect?: (peerId: string) => void;
	private onFatalError?: (error: Error) => void;

	public setOnPeerDisconnect(callback: (peerId: string) => void) {
			this.onPeerDisconnect = callback;
	}

	public setOnFatalError(callback: (error: Error) => void) {
			this.onFatalError = callback;
	}

	public onPeerConnected(callback: (peerId: string) => void) {
			this.peer.on('connection', (conn) => {
					callback(conn.peer);
			});
	}

	public onPeerDisconnected(callback: (peerId: string) => void) {
			this.setOnPeerDisconnect(callback);
	}

	// Method to get current peer count
	public getPeerCount(): number {
			return this.peers.size;
	}

	// Method to check if connected to a specific peer
	public isConnectedToPeer(peerId: string): boolean {
			return this.peers.has(peerId);
	}

	// Method to get all connected peer IDs
	public getConnectedPeers(): string[] {
			return Array.from(this.peers.keys());
	}
}