"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface ThemeAwareBackgroundProps {
  children: ReactNode
  className?: string
  withPattern?: boolean
}

export function ThemeAwareBackground({ children, className, withPattern = false }: ThemeAwareBackgroundProps) {
  const { isDark } = useTheme()

  return (
    <div
      className={cn(
        "transition-colors duration-300",
        withPattern && (isDark ? "bg-pattern dark" : "bg-pattern"),
        // Changed from blue-tinted background to proper gray scale
        !withPattern && (isDark ? "bg-gray-900" : "bg-gray-50"),
        className,
      )}
    >
      {children}
    </div>
  )
}
