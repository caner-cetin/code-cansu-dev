import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRTCStore } from "@/stores/RTCStore"
import ShareButton from "@/components/ShareButton"
import { Circle, EyeSlash, Info, ShareNetwork, User } from "@phosphor-icons/react"
import RTCClient from "@/services/rtc"
import { useEditorRef } from "@/stores/EditorStore"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function LiveShare() {
  const ctx = useRTCStore()
  const editorRef = useEditorRef()
  useEffect(() => {
    if (ctx.rtcEnabled && ctx.rtcClient === undefined) {
      const client = new RTCClient(true)
      ctx.setHost(true)
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
          <Label className="cursor-help">Enable Real Time Collaboration </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <Label className="font-extralight bg-stone-400 p-2">Enabling creates new room.</Label>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>


        {ctx.rtcEnabled ? (
          <div>
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <Circle className="h-4 w-4" weight={((ctx.rtcClient !== undefined) && (ctx.rtcClient?.ws !== null) && (ctx.rtcClient?.ws.readyState === ctx.rtcClient?.ws?.OPEN)) ? 'fill' : 'regular'} />
                <Label>You {ctx.host ? <span className="font-extralight italic">(Host)</span> : ''}</Label>
              </div>

              <div className="flex items-center space-x-2">
                {ctx.peers && ctx.peers.map((peer, _) => (
                  <>
                    <User
                      className="h-4 w-4"
                      weight="fill"
                    />
                    <Label>{peer.nickname} {(peer.id === ctx.currentHostId) ? <span className="font-extralight italic">(Host)</span> : ''}</Label>
                  </>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
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