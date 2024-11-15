"use client";
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import Header from '@/components/Header'
import CustomToast from '@/components/CustomToast'
import OutputModal from '@/components/OutputModal'
import { LanguageId, RenderFirst } from '@/services/settings'
import { isMobile } from '@/hooks/useMobile'
import { useAppContext } from '@/contexts/AppContext'
import WaifuWidget from '@/components/WaifuWidget';
import { getLanguages } from '@/actions/judge/calls';
import { AceEditor } from '@/components/AceEditor';
const MarkdownView = dynamic(() => import('@/components/Markdown'), { ssr: false })

export default function CodeEditorPage() {
  const ctx = useAppContext()
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(isMobile())
    window.addEventListener('resize', () => {
      setMobile(isMobile())
    })
  }, [])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <no need to rerun on ctx change>
  useEffect(() => {
    const fetchLanguages = async () => {
      await getLanguages(ctx);
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
                {ctx.live2DModelEnabled && <WaifuWidget cdnPath='https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/' />}
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
          </div>
        </>
      )}
    </>
  )
}