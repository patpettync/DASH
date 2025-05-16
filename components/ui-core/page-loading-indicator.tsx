"use client"

import { useEffect, useState } from "react"
import { LoadingAnimation } from "./loading-animation"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface PageLoadingIndicatorProps {
  minDisplayTime?: number
  onLoadComplete?: () => void
  className?: string
}

export function PageLoadingIndicator({ minDisplayTime = 1000, onLoadComplete, className }: PageLoadingIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      if (onLoadComplete) {
        onLoadComplete()
      }
    }, minDisplayTime)

    return () => clearTimeout(timer)
  }, [minDisplayTime, onLoadComplete])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-colors duration-300",
        theme === "dark" ? "dark" : "light",
        className,
      )}
    >
      <LoadingAnimation size="xl" />
    </div>
  )
}
