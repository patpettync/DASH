import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface ResponsiveGridProps {
  children: ReactNode
  className?: string
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
  gap?: "sm" | "md" | "lg"
}

export function ResponsiveGrid({
  children,
  className,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = "md",
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }

  return (
    <div
      className={cn(
        "grid w-full",
        gapClasses[gap],
        `grid-cols-${columns.sm || 1}`,
        `md:grid-cols-${columns.md || 2}`,
        `lg:grid-cols-${columns.lg || 3}`,
        className,
      )}
    >
      {children}
    </div>
  )
}
