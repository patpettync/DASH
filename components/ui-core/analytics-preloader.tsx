"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsPreloader() {
  const pathname = usePathname()
  const [hasPreloaded, setHasPreloaded] = useState(false)

  useEffect(() => {
    // If we're on the forms page, preload the analytics page
    if (pathname === "/forms" && !hasPreloaded) {
      // Preload the analytics page
      const preloadAnalytics = async () => {
        try {
          // This creates a hidden prefetch of the analytics page
          await fetch("/forms/analytics", { priority: "low" })
          setHasPreloaded(true)
        } catch (error) {
          console.error("Failed to preload analytics page:", error)
        }
      }

      // Delay preloading until after the current page has loaded
      const timer = setTimeout(() => {
        preloadAnalytics()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [pathname, hasPreloaded])

  // This component doesn't render anything
  return null
}
