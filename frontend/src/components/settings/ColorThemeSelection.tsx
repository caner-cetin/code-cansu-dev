import React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Themes } from "@/services/settings"

export interface ColorThemeSelection {
  colorTheme: string
  setColorTheme: (theme: Themes) => void
}

export const ColorThemeSelection: React.FC<ColorThemeSelection> = ({ colorTheme, setColorTheme }) => {
  return (
    <>
      <Label htmlFor="color-theme">Color Theme</Label>
      <Select value={colorTheme} onValueChange={(theme) => setColorTheme(theme as Themes)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a color theme" />
        </SelectTrigger>
        <SelectContent className="bg-white ">
          {Object.values(Themes).map((theme) => (
            <SelectItem
              key={theme}
              value={theme}
              className="bg-white"
            >
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}