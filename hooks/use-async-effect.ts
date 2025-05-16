"use client"

import type React from "react"

import { useEffect } from "react"

/**
 * A hook that works like useEffect but supports async functions.
 * It also handles cleanup properly when the component unmounts.
 *
 * @param effect The async effect function to run
 * @param deps The dependency array
 */
export function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps: React.DependencyList = []) {
  useEffect(() => {
    let isMounted = true
    let cleanup: void | (() => void)

    // Run the async effect
    const runEffect = async () => {
      try {
        cleanup = await effect()
      } catch (error) {
        console.error("Error in useAsyncEffect:", error)
      }
    }

    runEffect()

    // Cleanup function
    return () => {
      isMounted = false
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
