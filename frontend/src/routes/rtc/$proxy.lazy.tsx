import * as React from 'react'
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { useRTCStore } from '@/stores/RTCStore'
import { useShallow } from 'zustand/react/shallow'
import RTCClient from '@/services/rtc'

export const Route = createLazyFileRoute('/rtc/$proxy')({
  component: RouteComponent,
})

function RouteComponent() {
  const { proxy } = Route.useParams()
  const ctx = useRTCStore(useShallow((state) => ({
    setProxyToken: state.setProxyToken,
    setRtcEnabled: state.setRtcEnabled,
    rtcClient: state.rtcClient,
    setRtcClient: state.setRtcClient,
  })))
  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
      <Input placeholder='nickname' className='w-96' />
      <Link
        to="/"
        onClick={() => {
          ctx.setProxyToken(proxy);
          ctx.setRtcClient(new RTCClient(false));
          ctx.setRtcEnabled(true);
        }}
        className='ml-4'>Enter</Link>
    </div>
  )
}
