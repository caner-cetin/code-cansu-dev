import RTCClient from "@/services/rtc/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RTCState {

  rtcEnabled: boolean;
  setRtcEnabled: (enabled: boolean) => void;

  rtcClient: RTCClient | undefined;
  setRtcClient: (client: RTCClient | undefined) => void;

  roomId: string | undefined;
  setRoomId: (roomId: string | undefined) => void;

}

export const useRTCStore = create<RTCState>()(
  persist(
    (set) => ({
      rtcEnabled: false,
      setRtcEnabled: (enabled) => set({ rtcEnabled: enabled }),

      rtcClient: undefined,
      setRtcClient: (client) => set({ rtcClient: client }),

      roomId: undefined,
      setRoomId: (roomId) => set({ roomId }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        rtcEnabled: state.rtcEnabled,
        roomId: state.roomId,
      }),
    },
  ),
);
