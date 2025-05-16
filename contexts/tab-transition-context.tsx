"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

type TabTransitionContextType = {
  previousPath: string | null
  currentPath: string
  isTransitioning: boolean
  startTransition: () => void
  endTransition: () => void
}

const TabTransitionContext = createContext<TabTransitionContextType | undefined>(undefined)

export function TabTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState<string>(pathname)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (pathname !== currentPath) {
      setPreviousPath(currentPath)
      setCurrentPath(pathname)
      setIsTransitioning(true)
    }
  }, [pathname, currentPath])

  const startTransition = () => {
    setIsTransitioning(true)
  }

  const endTransition = () => {
    setIsTransitioning(false)
  }

  return (
    <TabTransitionContext.Provider
      value={{
        previousPath,
        currentPath,
        isTransitioning,
        startTransition,
        endTransition,
      }}
    >
      {children}
    </TabTransitionContext.Provider>
  )
}

export function useTabTransitionContext() {
  const context = useContext(TabTransitionContext)

  // Return a default context if not provided
  if (context === undefined) {
    return {
      previousPath: null,
      currentPath: "",
      isTransitioning: false,
      startTransition: () => {},
      endTransition: () => {},
    }
  }

  return context
}
