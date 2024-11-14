import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import Header from '@/components/Header'
import CustomToast from '@/components/CustomToast'
import OutputModal from '@/components/OutputModal'
import { LanguageId, RenderFirst } from '@/services/settings'
import { isMobile } from '@/hooks/useMobile'
import { useAppContext } from '@/contexts/AppContext'

const AceEditor = dynamic(() => import('@/components/AceEditor'), { ssr: false })
const MarkdownView = dynamic(() => import('@/components/Markdown'), { ssr: false })

export const metadata: Metadata = {
  title: "Caner's Wonderland",
  description: 'i am naked',
}

export default function CodeEditorPage() {
  const ctx = useAppContext()
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(isMobile())
    window.addEventListener('resize', () => {
      setMobile(isMobile())
    })
  }, [])
  return (
    <>
      {mobile ? (
        <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex items-center justify-center">
          <h1 className="text-2xl text-center">
            Not usable on mobile/tablets. Sorry.
          </h1>
        </div>
      ) : (
        <>
          <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
          <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col">
            <CustomToast />
            <Header />
            <PanelGroup direction="horizontal" className="flex-1">
              <Panel defaultSize={70} minSize={30}>
                <Suspense fallback={<div>Loading editor...</div>}>
                  {
                    ctx.renderFirst === RenderFirst.WelcomeMarkdown ||
                      (ctx.renderFirst === RenderFirst.Unset && ctx.languageId === LanguageId.Markdown)
                      ? (<MarkdownView />) : (<AceEditor />)}
                  <AceEditor />
                </Suspense>
              </Panel>
              <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />
              <Panel defaultSize={30} minSize={20}>
                <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
                  <OutputModal displayingSharedCode={false} />
                </div>
              </Panel>
            </PanelGroup>
          </div>
        </>
      )}
    </>
  )
}