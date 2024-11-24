import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useShallow } from "zustand/react/shallow"
import { useRTCStore } from "@/stores/RTCStore"
import ShareButton from "@/components/ShareButton"
import { Circle, EyeSlash, ShareNetwork } from "@phosphor-icons/react"
import { v4 as uuidv4 } from "uuid"
import RTCClient from "@/services/rtc/client"
import { useEditorRef } from "@/stores/EditorStore"
import { Ace } from "ace-builds"

export function LiveShare() {
  const ctx = useRTCStore(
    useShallow((state) => ({
      rtcClient: state.rtcClient,
      setRtcClient: state.setRtcClient,
      rtcEnabled: state.rtcEnabled,
      setRtcEnabled: state.setRtcEnabled,
      proxyToken: state.proxyToken,
    }))
  )
  const editorRef = useEditorRef()
  useEffect(() => {
    if (ctx.rtcEnabled && ctx.rtcClient === undefined) {
      const client = new RTCClient(true)
      if (editorRef.current) {
        client.editorRef = editorRef
        client.setupEditorBroadcasts();
      }
      ctx.setRtcClient(client)
    } else if (!ctx.rtcEnabled) {
      ctx.setRtcClient(undefined)
    }
  }, [ctx.rtcEnabled])

  useEffect(() => {
    if (ctx.rtcEnabled) {
      if (!ctx.rtcClient) return;
      ctx.rtcClient.editorRef = editorRef;
      ctx.rtcClient.setupEditorBroadcasts();
    }
  }, [editorRef])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="mx-4 flex items-center">
          <ShareNetwork className="h-4 w-4" />
          <span className="sr-only">Live share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4 bg-[#1e1e1e] border-[#555568] text-[#a0a08b]">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Live Share</h4>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={ctx.rtcEnabled}
            onCheckedChange={(checked) => ctx.setRtcEnabled(checked as boolean)}
          />
          <Label>Enable Real Time Collaboration</Label>
        </div>

        {ctx.rtcEnabled ? (
          <div className="space-y-4">
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <Circle className="h-4 w-4" weight={((ctx.rtcClient !== undefined) && (ctx.rtcClient?.ws !== null) && (ctx.rtcClient?.ws.readyState === ctx.rtcClient?.ws?.OPEN)) ? 'fill' : 'regular'} />
                <Label>Host</Label>
              </div>

              <div className="flex space-x-2">
                {/* {ctx.rtcClient?.peers && Array.from(ctx.rtcClient.peers.keys()).map((seat, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <Circle
                      className="h-4 w-4"
                      weight={ctx.rtcClient?.peers.get(seat)?.dataChannel.readyState === "open" ? 'fill' : 'regular'}
                    />
                  </div>
                ))} */}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <ShareButton uri={`${import.meta.env.VITE_FRONTEND_URI}/rtc/${ctx.proxyToken}`} />
              <Label>Invite Link</Label>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <EyeSlash className="h-4 w-4" />
            <Label>RTC Disabled</Label>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}