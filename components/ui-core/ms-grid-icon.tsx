import { cn } from "@/lib/utils"

interface MSGridIconProps {
  className?: string
}

export function MSGridIcon({ className }: MSGridIconProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-0.5", className)}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="w-1 h-1 bg-current opacity-80" />
      ))}
    </div>
  )
}
