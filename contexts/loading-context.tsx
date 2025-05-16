"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { PageLoadingIndicator } from "@/components/ui-core/page-loading-indicator"

interface LoadingContextType {
  startLoading: (key?: string) => void
  stopLoading: (key?: string) => void
  isLoading: (key?: string) => boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    global: true, // Start with global loading active
  })
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Handle initial page load with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingStates((prev) => ({ ...prev, global: false }))
      setInitialLoadComplete(true)
    }, 1500) // Adjust timing as needed

    // Cleanup timer on unmount
    return () => clearTimeout(timer)
  }, []) // Empty dependency array means this runs once after mount

  // Memoize these functions to prevent unnecessary re-renders
  const startLoading = useCallback((key = "global") => {
    setLoadingStates((prev) => ({ ...prev, [key]: true }))
  }, [])

  const stopLoading = useCallback((key = "global") => {
    setLoadingStates((prev) => ({ ...prev, [key]: false }))
  }, [])

  const isLoading = useCallback(
    (key = "global") => {
      return !!loadingStates[key]
    },
    [loadingStates],
  )

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading }}>
      {loadingStates.global && <PageLoadingIndicator />}
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return context
}
