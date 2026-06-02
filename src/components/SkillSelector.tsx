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
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white focus:ring-blue-500/50 rounded-xl glass">
        <SelectValue placeholder="Select a skill" />
      </SelectTrigger>
      <SelectContent className="bg-background/95 backdrop-blur-xl border-white/10 text-white">
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
