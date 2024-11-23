import * as React from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"

export const Route = createLazyFileRoute('/rtc/$roomId')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
      <Input placeholder='nickname' className='w-96' />
    </div>
  )
}
