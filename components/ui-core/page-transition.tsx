"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
  className?: string
  skipTransitionPaths?: string[]
}

export function PageTransition({ children, className, skipTransitionPaths = [] }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const prevPathnameRef = useRef(pathname)
  const isAnimatingRef = useRef(false)

  // Check if we should skip the transition for this path
  const shouldSkipTransition = skipTransitionPaths.some((path) => pathname.includes(path))

  useEffect(() => {
    // Only trigger animation when pathname changes and we're not already animating
    if (prevPathnameRef.current !== pathname && !isAnimatingRef.current && !shouldSkipTransition) {
      isAnimatingRef.current = true

      // Start exit animation
      setIsVisible(false)

      const timeout = setTimeout(() => {
        // Update the previous pathname ref
        prevPathnameRef.current = pathname

        // Start entrance animation
        setIsVisible(true)

        // Reset animation flag after animation completes
        setTimeout(() => {
          isAnimatingRef.current = false
        }, 300)
      }, 300) // Match this with the CSS transition duration

      return () => clearTimeout(timeout)
    } else if (shouldSkipTransition) {
      // If we're skipping the transition, just update the ref
      prevPathnameRef.current = pathname
    }
  }, [pathname, shouldSkipTransition])

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      )}
    >
      {children}
    </div>
  )
}
