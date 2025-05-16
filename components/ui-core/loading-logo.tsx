"use client"

import { useEffect, useState } from "react"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"

type LoadingLogoSize = "sm" | "md" | "lg" | "xl"

interface LoadingLogoProps {
  size?: LoadingLogoSize
  className?: string
  onAnimationComplete?: () => void
}

const sizeClasses: Record<LoadingLogoSize, string> = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}

export function LoadingLogo({ size = "md", className, onAnimationComplete }: LoadingLogoProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  // Handle animation completion
  useEffect(() => {
    if (!isAnimating && onAnimationComplete) {
      onAnimationComplete()
    }
  }, [isAnimating, onAnimationComplete])

  // Set up animation timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 3000) // Animation duration

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Pulse effect */}
        <div className={cn("absolute inset-0 rounded-md", "animate-pulse-slow", "bg-primary/20 dark:bg-primary/10")} />

        {/* Ping effect */}
        <div className={cn("absolute inset-0 rounded-md", "animate-ping-slow", "bg-primary/10 dark:bg-primary/5")} />

        {/* Logo */}
        <div className="relative z-10">
          <Logo size={size} iconOnly />
        </div>
      </div>
      <span
        className={cn("ml-3 font-bold tracking-tight animate-pulse", {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-lg": size === "lg",
          "text-2xl": size === "xl",
        })}
      >
        DASH
      </span>
    </div>
  )
}
