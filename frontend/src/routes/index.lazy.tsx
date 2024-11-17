import React from 'react'
import { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import Header from '@/components/Header'
import CustomToast from '@/components/CustomToast'
import OutputModal from '@/components/OutputModal'
import { LanguageId, RenderFirst } from '@/services/settings'
import { isMobile } from '@/hooks/useMobile'
import WaifuWidget from '@/components/WaifuWidget';
import { getLanguages } from '@/services/judge/calls';
import { AceEditor } from '@/components/AceEditor';
import MarkdownView from '@/components/Markdown'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useAppStore } from '@/stores/AppStore'
import { useShallow } from 'zustand/react/shallow'


export const Route = createLazyFileRoute('/')({
  component: CodeEditorPage,
})

function CodeEditorPage() {
  const [mobile, setMobile] = useState(false)
  const ctx = useAppStore(useShallow((state) => ({
    live2DModelEnabled: state.live2DModelEnabled,
    languageId: state.languageId,
    renderFirst: state.renderFirst,
  })))
  useEffect(() => {
    setMobile(isMobile())
    window.addEventListener('resize', () => {
      setMobile(isMobile())
    })
  }, [])
  useEffect(() => {
    const fetchLanguages = async () => {
      await getLanguages();
    }
    fetchLanguages()
  }, []);
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
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
          />
          <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono flex flex-col max-h-screen overflow-y-auto">
            <CustomToast />
            <Header />
            <PanelGroup direction="horizontal" className="flex-1">
              <Panel defaultSize={70} minSize={30}>
                {((ctx.renderFirst === RenderFirst.WelcomeMarkdown && ctx.languageId === LanguageId.Markdown) ||
                  (ctx.renderFirst === RenderFirst.Unset &&
                    ctx.languageId === LanguageId.Markdown)) ? (
                  <MarkdownView />
                ) : (

                  <AceEditor />
                )}
              </Panel>
              <PanelResizeHandle className="w-2 bg-[#3c3836] hover:bg-[#504945] cursor-col-resize" />

              <Panel defaultSize={30} minSize={20}>
                <div className="h-full bg-[#2c2a2a] p-4 overflow-y-auto">
                  <OutputModal displayingSharedCode={false} />
                </div>
              </Panel>
            </PanelGroup>
            {ctx.live2DModelEnabled && <WaifuWidget />}
          </div>
        </>
      )}
    </>
  )
}