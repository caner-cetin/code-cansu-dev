import React from 'react'

import { LanguageId } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { SettingsPopover } from './settings/SettingsModal'
import { Submissions } from '@/hooks/useSubmissions'
import StdinModal from './StdinModal'
import { useState } from 'react'
import { LanguageSelectionPopover } from './LanguageSelectionPopover'
import { LANGUAGE_CONFIG } from '@/config/languages'
import { useAppStore } from '@/stores/AppStore'
import { useShallow } from 'zustand/react/shallow'
import { useEditorRef } from '@/stores/EditorStore'
import { BookOpenText, ShareNetwork } from '@phosphor-icons/react'
import { LiveShare } from '@/components/LiveShare'

export default function Header() {
  const ctx = useAppStore(useShallow((state) => ({
    languageId: state.languageId,
    languages: state.languages,
    setLanguageId: state.setLanguageId,
    displayingSharedCode: state.displayingSharedCode,
    setSubmissions: state.setSubmissions,
    setSubmissionCounter: state.setSubmissionCounter
  })))
  const [displayStdin, setDisplayStdin] = useState(false)
  const code = useEditorRef();

  return (
    <header className="w-full bg-[#211e20] border-b border-[#555568] p-2">
      <div className="flex justify-between items-center">
        <div className="text-[#a0a08b]">
          PIP-OS v7.1.0.8
          {(ctx.languageId === LanguageId.Markdown) && " - README"}
          {ctx.displayingSharedCode ? ` - ${LANGUAGE_CONFIG[ctx.languageId]?.runnerName} - READ ONLY` : ""}
        </div>
        <div className="flex items-center space-x-2">
          {!ctx.displayingSharedCode && (
            <div>
              <Button
                variant="link"
                style={{ color: "#e9efec" }}
                className="hover:bg-[#504945] transition-colors duration-200"
                onClick={() => Submissions.handleSubmitCode(undefined, code.current?.editor)}
              >
                Execute
              </Button>
              <Button
                variant="link"
                style={{ color: "#e9efec" }}
                className="hover:bg-[#504945] transition-colors duration-200"
                onClick={() => setDisplayStdin(!displayStdin)}
              >
                <StdinModal display={displayStdin} setDisplay={setDisplayStdin} />
                Execute with Stdin
              </Button>
              <Button
                variant="link"
                style={{ color: "#e9efec" }}
                className="hover:bg-[#cc241d] transition-colors duration-200"
                onClick={() => Submissions.clearStoredSubmissions()}
              >
                Clear Local Submissions
              </Button>
              <LanguageSelectionPopover languageCfg={LANGUAGE_CONFIG} />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <Button variant="outline" size="icon" className='mr-4' onClick={() => ctx.setLanguageId(LanguageId.Markdown)}>
            <BookOpenText className="h-4 w-4" alt='go to readme' />
            <span className="sr-only">go to readme</span>
          </Button>
          <SettingsPopover />
          {!ctx.displayingSharedCode && <LiveShare />}
          <time className="text-[#a0a08b]" dateTime={new Date().toLocaleTimeString()} suppressHydrationWarning />
        </div>
      </div>
    </header>
  )
}