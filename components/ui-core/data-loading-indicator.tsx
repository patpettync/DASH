"use client"

import { cn } from "@/lib/utils"
import { LoadingAnimation } from "./loading-animation"
import { useTheme } from "@/contexts/theme-context"

interface DataLoadingIndicatorProps {
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
  fullHeight?: boolean
}

export function DataLoadingIndicator({ size = "md", text, className, fullHeight = false }: DataLoadingIndicatorProps) {
  const { isDark } = useTheme()

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 transition-colors duration-300",
        fullHeight && "h-full min-h-[200px]",
        className,
      )}
    >
      <LoadingAnimation size={size} />
      {text && (
        <p
          className={cn(
            "mt-2 text-sm transition-colors duration-300",
            isDark ? "text-gray-400" : "text-muted-foreground",
          )}
        >
          {text}
        </p>
      )}
    </div>
  )
}
