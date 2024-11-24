import RTCClient from "@/services/rtc/client";
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
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        rtcEnabled: state.rtcEnabled,
        proxyToken: state.proxyToken,
        backendId: state.backendId,
      }),
    },
  ),
);
