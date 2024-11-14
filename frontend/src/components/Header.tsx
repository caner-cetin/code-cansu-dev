'use client'

import { useAppContext } from '@/contexts/AppContext'
import { LANGUAGE_CONFIG } from '@/config/languages'
import { LanguageId, RenderFirst } from '@/services/settings'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import SettingsPopover from './settings/SettingsModal'
import { Submissions } from '@/hooks/useSubmissions'
import StdinModal from './StdinModal'
import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectGroup, SelectLabel } from '@radix-ui/react-select'

export default function Header() {
  const ctx = useAppContext()
  const { languageId, languages, setLanguageId: setLanguageID, displayingSharedCode, renderFirst } = ctx
  const [displayStdin, setDisplayStdin] = useState(false)

  return (
    <header className="w-full bg-[#211e20] border-b border-[#555568] p-2">
      <div className="flex justify-between items-center">
        <div className="text-[#a0a08b]">
          PIP-OS v7.1.0.8 -{" "}
          {((languageId === LanguageId.Markdown) || (renderFirst === RenderFirst.WelcomeMarkdown))
            ? "README"
            : LANGUAGE_CONFIG[languageId]?.runnerName}{" "}
          {displayingSharedCode ? "- READ ONLY" : ""}
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
              >
                Clear Local Submissions
              </Button>
              {languages && (
                <Select onValueChange={(id) => setLanguageID(Number.parseInt(id))}>
                  <SelectTrigger className=" hover:bg-[#504945] transition-colors duration-20">
                    <SelectValue placeholder="Languages" />
                  </SelectTrigger>
                  <SelectContent className="border-[#555568] scrollable-dropdown">
                    <SelectGroup>
                      {languages
                        .slice()
                        .sort((lang, nextLang) =>
                          lang.name.localeCompare(nextLang.name, undefined, {
                            sensitivity: "base",
                          })
                        )
                        .map((lang) => (
                          <SelectItem
                            key={lang.id}
                            value={lang.id.toString()}
                            className="text-[#e9efec] hover:bg-[#504945] hover:text-red-200"
                          >
                            {lang.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
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