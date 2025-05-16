"use client"

import type React from "react"

import type { ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

type AnimationType = "fade-in" | "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "zoom-out" | "none"

interface AnimatedElementProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  once?: boolean
}

export function AnimatedElement({
  children,
  animation = "fade-in",
  delay = 0,
  duration = 500,
  className,
  threshold = 0.1,
  once = true,
}: AnimatedElementProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    once,
    delay,
  })

  const getAnimationClasses = () => {
    if (animation === "none") return ""

    const baseClasses = "transition-all"
    const durationClass = `duration-${duration}`

    const initialClasses = {
      "fade-in": "opacity-0",
      "fade-up": "opacity-0 translate-y-8",
      "fade-down": "opacity-0 -translate-y-8",
      "fade-left": "opacity-0 translate-x-8",
      "fade-right": "opacity-0 -translate-x-8",
      "zoom-in": "opacity-0 scale-95",
      "zoom-out": "opacity-0 scale-105",
    }

    return `${baseClasses} ${durationClass} ${initialClasses[animation] || ""}`
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(getAnimationClasses(), isVisible && "opacity-100 translate-x-0 translate-y-0 scale-100", className)}
    >
      {children}
    </div>
  )
}
