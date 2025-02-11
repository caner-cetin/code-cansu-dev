import React from 'react'
import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { LanguageConfig } from '@/config/types'
import { useAppStore } from '@/stores/AppStore'
import { useShallow } from 'zustand/react/shallow'
import { useRTCStore } from '@/stores/RTCStore'
import { getLanguages } from '@/services/playground/calls';

export interface LanguageSelectionPopoverProps {
  // header is also using the language config
  // so if i import the language config here again, it will create circular dependency
  languageCfg: Record<number, LanguageConfig>
}
export const LanguageSelectionPopover: React.FC<LanguageSelectionPopoverProps> = ({ languageCfg }: LanguageSelectionPopoverProps) => {
  const ctx = useAppStore(useShallow((state) => ({
    languageId: state.languageId,
    setLanguageId: state.setLanguageId,
    languages: state.languages,
    setLanguages: state.setLanguages
  })));

  const { rtcEnabled, host } = useRTCStore(useShallow((state) => ({
    rtcEnabled: state.rtcEnabled,
    host: state.host,
  })))
  useEffect(() => {
    const fetchLanguages = async () => {
      const languages = await getLanguages();
      if (languages) {
        ctx.setLanguages(languages);
      }
    };
    fetchLanguages();
  }, [ctx.setLanguages]);

  if (!ctx.languages || Object.keys(ctx.languages).length === 0) {
    return null;
  }

  const selectedLanguage = ctx.languages[ctx.languageId];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={rtcEnabled && !host}
          variant="outline"
          role="combobox"
          className="w-82 justify-between bg-[#1e1e1e] border-[#555568] text-[#a0a08b] hover:bg-[#504945] hover:text-[#e9efec]"
        >
          {selectedLanguage ? (
            <span className="flex items-center">
              {languageCfg[selectedLanguage.id]?.iconClass && (
                <i className={`${languageCfg[selectedLanguage.id].iconClass} w-5 shrink-0`} />
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
          {Object.entries(ctx.languages)
            .sort(([, a], [, b]) => a.name.localeCompare(b.name))
            .map(([id, language]) => (
              <Button
                key={id}
                onClick={() => ctx.setLanguageId(Number(id))}
                variant="ghost"
                className={cn(
                  "h-8 w-full justify-start px-2 text-[#a0a08b] hover:bg-[#504945] hover:text-[#e9efec] flex items-center",
                  ctx.languageId === Number(id) && "bg-[#504945] text-[#e9efec]"
                )}
              >
                {languageCfg[language.id]?.iconClass && (
                  <i className={`${languageCfg[language.id].iconClass} w-5 shrink-0`} />
                )}
                <span className="ml-2">{language.name}</span>
                {ctx.languageId === Number(id) && (
                  <Check className="h-3 w-3 shrink-0 opacity-100" />
                )}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}