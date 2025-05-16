"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface HeaderIconProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  "aria-label"?: string
  "data-testid"?: string
}

export function HeaderIcon({ children, onClick, className, ...props }: HeaderIconProps) {
  const { isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full transition-colors",
        isDark ? "hover:bg-gray-800 focus:bg-gray-800" : "hover:bg-gray-100 focus:bg-gray-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
