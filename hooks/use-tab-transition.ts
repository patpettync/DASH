"use client"

import { useState, useEffect } from "react"

export function useTabTransition(activeTabId: string | null) {
  const [previousActive, setPreviousActive] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (activeTabId && previousActive && activeTabId !== previousActive) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 300) // Match this with your CSS transition duration

      return () => clearTimeout(timer)
    }

    if (activeTabId && !previousActive) {
      setPreviousActive(activeTabId)
    }
  }, [activeTabId, previousActive])

  useEffect(() => {
    if (activeTabId && activeTabId !== previousActive) {
      setPreviousActive(activeTabId)
    }
  }, [activeTabId, previousActive])

  return { previousActive, isTransitioning }
}
