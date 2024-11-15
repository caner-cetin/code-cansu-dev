'use client'

import { useAppContext } from '@/contexts/AppContext'
import { LanguageId, RenderFirst } from '@/services/settings'
import { Button } from '@/components/ui/button'
import { SettingsPopover } from './settings/SettingsModal'
import { Submissions } from '@/hooks/useSubmissions'
import StdinModal from './StdinModal'
import { useState } from 'react'
import { LanguageSelectionPopover } from './LanguageSelectionPopover'
import { LANGUAGE_CONFIG } from '@/config/languages'

export default function Header() {
  const ctx = useAppContext()
  const { languageId, languages, setLanguageId: setLanguageID, displayingSharedCode, renderFirst } = ctx
  const [displayStdin, setDisplayStdin] = useState(false)

  return (
    <header className="w-full bg-[#211e20] border-b border-[#555568] p-2">
      <div className="flex justify-between items-center">
        <div className="text-[#a0a08b]">
          PIP-OS v7.1.0.8
          {((languageId === LanguageId.Markdown) && (renderFirst === RenderFirst.WelcomeMarkdown)) && " - README"}
          {displayingSharedCode ? ` - ${LANGUAGE_CONFIG[languageId]?.runnerName} - READ ONLY` : ""}
        </div>
        <div className="flex items-center space-x-2">
          {!displayingSharedCode && (
            <div>
              <Button
                variant="link"
                style={{ color: "#e9efec" }}
                className="hover:bg-[#504945] transition-colors duration-200"
                onClick={() => Submissions.handleSubmitCode(false, ctx)}
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
                onClick={() => Submissions.clearStoredSubmissions(ctx)}
              >
                Clear Local Submissions
              </Button>
              <LanguageSelectionPopover languageCfg={LANGUAGE_CONFIG} />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <SettingsPopover />
          <time className="text-[#a0a08b]" dateTime={new Date().toLocaleTimeString()} suppressHydrationWarning />
        </div>
      </div>
    </header>
  )
}