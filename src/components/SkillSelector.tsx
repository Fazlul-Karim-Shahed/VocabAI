import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store";

export function SkillSelector({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const { skills } = useAppStore();

  return (
    <Select value={value} onValueChange={(val) => { if (val) onChange(val); }}>
      <SelectTrigger className="w-auto border-0 bg-transparent h-auto text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:ring-0 shadow-none p-0 pr-1 flex gap-1 items-center data-[state=open]:text-blue-700 dark:data-[state=open]:text-blue-300 transition-colors">
        <SelectValue placeholder="Select a skill" />
      </SelectTrigger>
      <SelectContent className="bg-white/95 dark:bg-background/95 backdrop-blur-xl border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
        {skills.map((skill) => (
          <SelectItem key={skill.id} value={skill.id} className="focus:bg-white/10 focus:text-white cursor-pointer rounded-lg mx-1 my-1">
            <div className="flex flex-col items-start gap-1">
              <span className="font-medium">{skill.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
