import React from 'react'
import { ColorThemeSelection } from './ColorThemeSelection'
import { RenderFirstSelection } from './RenderFirstSelection'
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon } from 'lucide-react'
import { useAppStore } from '@/stores/AppStore'
import { useShallow } from 'zustand/react/shallow'
export const SettingsPopover: React.FC = () => {
  const [colorTheme, setColorTheme] = useAppStore(useShallow((state) => [state.colorTheme, state.setColorTheme]))
  const [renderFirst, setRenderFirst] = useAppStore(useShallow((state) => [state.renderFirst, state.setRenderFirst]))
  const [live2DModelEnabled, setLive2DModelEnabled] = useAppStore(useShallow((state) => [state.live2DModelEnabled, state.setLive2DModelEnabled]))
  const displayingSharedCode = useAppStore((state) => state.displayingSharedCode)
  return (
    <Popover>
      <PopoverTrigger className="btn btn-primary" asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="bg-[#1e1e1e] border border-[#555568] text-[#a0a08b] p-4 w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <ColorThemeSelection colorTheme={colorTheme} setColorTheme={setColorTheme} />
            </div>
            {!displayingSharedCode &&
              <div className="grid grid-cols-3 items-center gap-4">
                <RenderFirstSelection renderFirst={renderFirst} setRenderFirst={setRenderFirst} />
              </div>
            }
            {!displayingSharedCode &&
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>
                  Live2D Model
                </Label>
                <Checkbox checked={live2DModelEnabled} onCheckedChange={(sf) => setLive2DModelEnabled(sf as boolean)} />
              </div>
            }
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}