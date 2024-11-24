import RTCClient, { PeerMetadata } from "@/services/rtc/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RTCState {

  rtcEnabled: boolean;
  setRtcEnabled: (enabled: boolean) => void;

  rtcClient: RTCClient | undefined;
  setRtcClient: (client: RTCClient | undefined) => void;

  proxyToken: string | undefined;
  setProxyToken: (roomId: string | undefined) => void;

  backendId: string | undefined;
  setBackendId: (backendId: string | undefined) => void;

  peers: Array<PeerMetadata> | undefined;
  setPeers: (peers: Array<PeerMetadata> | undefined) => void;

  nickname: string | undefined;
  setNickname: (nickname: string | undefined) => void;

  host: boolean | undefined;
  setHost: (host: boolean | undefined) => void;

  currentHostId: string | undefined;
  setCurrentHostId: (hostId: string | undefined) => void;
}

export const useRTCStore = create<RTCState>()(
  persist(
    (set) => ({
      rtcEnabled: false,
      setRtcEnabled: (enabled) => set({ rtcEnabled: enabled }),

      rtcClient: undefined,
      setRtcClient: (client) => set({ rtcClient: client }),

      proxyToken: undefined,
      setProxyToken: (token) => set({ proxyToken: token }),

      backendId: undefined,
      setBackendId: (backendId) => set({ backendId: backendId }),

      peers: undefined,
      setPeers: (peers) => set({ peers: peers }),

      nickname: undefined,
      setNickname: (nickname) => set({ nickname: nickname }),

      host: undefined,
      setHost: (host) => set({ host: host }),

      currentHostId: undefined,
      setCurrentHostId: (hostId) => set({ currentHostId: hostId }),
    }),
    {
      name: "rtc-storage",
      partialize: (state) => ({
        rtcEnabled: state.rtcEnabled,
        proxyToken: state.proxyToken,
        backendId: state.backendId,
        host: state.host,
        currentHostId: state.currentHostId,
      }),
    },
  ),
);
