import React, { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useQuery } from '@tanstack/react-query'
import CustomToast from '@/components/CustomToast'
import Header from '@/components/Header'
import OutputModal from '@/components/OutputModal'
import { getSubmission } from '@/services/playground/calls'
import { isMobile } from '@/hooks/useMobile'
import { AceEditor } from '@/components/AceEditor'
import { createFileRoute } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'
import { useShallow } from 'zustand/react/shallow'
import { useEditorRef } from '@/stores/EditorStore'

export const Route = createFileRoute('/share/$token/')({
  component: SharedCodePage,
})

function SharedCodePage() {
  const { token } = Route.useParams()
  const [mobile, setMobile] = useState(false)
  const code = useEditorRef()
  const ctx = useAppStore(useShallow((state) => ({
    displayingSharedCode: state.displayingSharedCode,
    setDisplayingSharedCode: state.setDisplayingSharedCode,
  })))
  useEffect(() => {
    setMobile(isMobile())
  }, [])
  if (mobile) {
    return (
      <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
        <h1 className="text-2xl text-center">
          Not usable on mobile/tablets. Sorry.
        </h1>
      </div>
    )
  }
  const query = useQuery({
    queryKey: ['submission', token],
    queryFn: () => getSubmission(token),
    refetchInterval: false,
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!token,
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <setters wont change>
  useEffect(() => {
    ctx.setDisplayingSharedCode(true)
    const sc = query.data?.SourceCode
    code.current?.editor.session.setValue(sc ? atob(sc) : '// no source code found')
  }, [query.data])

  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
      <CustomToast />
      <Header />
      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={70} minSize={30}>
          <div className="h-full bg-[#1e1e1e] overflow-hidden">
            <AceEditor displayingSharedCode={true} />
          </div>
        </Panel>
        <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
            <OutputModal displayingSharedCode={true} query={query} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
