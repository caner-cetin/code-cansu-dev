"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RenderFirst } from '@/services/settings'

export interface RenderFirstDropdownProps {
  renderFirst: RenderFirst
  setRenderFirst: (renderFirst: RenderFirst) => void
}

export const RenderFirstSelection: React.FC<RenderFirstDropdownProps> = ({
  renderFirst,
  setRenderFirst
}) => {
  const renderFirstOptions = [
    RenderFirst.WelcomeMarkdown,
    RenderFirst.CodeEditor,
    RenderFirst.Unset,
  ];

  const getEnumKeyName = (value: RenderFirst) =>
    RenderFirst[value] as keyof typeof RenderFirst;

  return (
    <>
      <Label htmlFor="initial-view">Initial View</Label>
      <Select
        value={renderFirst.toString()}
        onValueChange={(value) => setRenderFirst(Number(value) as RenderFirst)}
      >
        <SelectTrigger id="initial-view" className="w-[180px]">
          <SelectValue placeholder="Select initial view" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {renderFirstOptions.map((option) => (
            <SelectItem
              key={option}
              value={option.toString()}
              className="cursor-pointer bg-white"
            >
              {getEnumKeyName(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}