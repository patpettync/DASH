"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedColorTransitionProps {
  color: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export function AnimatedColorTransition({ color, className = "", style = {}, children }: AnimatedColorTransitionProps) {
  const [displayColor, setDisplayColor] = useState(color)

  // Use a delayed state update to create a smooth transition
  useEffect(() => {
    // Small delay to ensure CSS transitions work properly
    const timer = setTimeout(() => {
      setDisplayColor(color)
    }, 50)

    return () => clearTimeout(timer)
  }, [color])

  return (
    <div
      className={cn("transition-colors duration-300", className)}
      style={{
        ...style,
        backgroundColor: displayColor,
      }}
    >
      {children}
    </div>
  )
}

export function AnimatedBorderColor({ color, className = "", style = {}, children }: AnimatedColorTransitionProps) {
  const [displayColor, setDisplayColor] = useState(color)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayColor(color)
    }, 50)

    return () => clearTimeout(timer)
  }, [color])

  return (
    <div
      className={cn("transition-colors duration-300", className)}
      style={{
        ...style,
        borderColor: displayColor,
      }}
    >
      {children}
    </div>
  )
}

export function AnimatedTextColor({ color, className = "", style = {}, children }: AnimatedColorTransitionProps) {
  const [displayColor, setDisplayColor] = useState(color)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayColor(color)
    }, 50)

    return () => clearTimeout(timer)
  }, [color])

  return (
    <div
      className={cn("transition-colors duration-300", className)}
      style={{
        ...style,
        color: displayColor,
      }}
    >
      {children}
    </div>
  )
}
