'use client'

import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useAppContext, type AppContextType } from '@/contexts/AppContext'
import type { LanguageConfig } from '@/config/types'

export interface LanguageSelectionPopoverProps {
  // header is also using the language config
  // so if i import the language config here again, it will create circular dependency
  languageCfg: Record<number, LanguageConfig>
}
export const LanguageSelectionPopover: React.FC<LanguageSelectionPopoverProps> = ({ languageCfg }: LanguageSelectionPopoverProps) => {
  const ctx = useAppContext();
  const { languageId, setLanguageId, languages } = ctx;
  if (!languages) return;
  const selectedLanguage = languages.find(lang => lang.id === languageId)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          className="w-82 justify-between bg-[#1e1e1e] border-[#555568] text-[#a0a08b] hover:bg-[#504945] hover:text-[#e9efec]"
        >
          {selectedLanguage ? (
            <span className="flex items-center">
              {(languageCfg[selectedLanguage.id] && languageCfg[selectedLanguage.id].iconClass) && (
                <i className={`${languageCfg[selectedLanguage.id].iconClass}  w-5 shrink-0`} />
              )}
              <span className="ml-2">{selectedLanguage.name}</span>
            </span>
          ) : (
            "Select language..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-[#1e1e1e] border-[#555568] max-h-[320px] overflow-y-auto">
        <div className="grid">
          {languages
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((language) => (
              <Button
                key={language.id}
                onClick={() => setLanguageId(language.id)}
                variant="ghost"
                className={cn(
                  "h-8 w-full justify-start px-2 text-[#a0a08b] hover:bg-[#504945] hover:text-[#e9efec] flex items-center",
                  languageId === language.id && "bg-[#504945] text-[#e9efec]"
                )}
              >
                {(languageCfg[language.id] && languageCfg[language.id].iconClass) && (
                  <i className={`${languageCfg[language.id].iconClass}  w-5 shrink-0`} />
                )}
                <span className="ml-2">{language.name}</span>
                {languageId === language.id && (
                  <Check className="h-3 w-3 shrink-0 opacity-100" />
                )}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}