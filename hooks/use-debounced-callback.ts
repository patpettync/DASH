"use client"

import { useCallback, useRef } from "react"

/**
 * A hook that returns a debounced version of the callback function.
 * The debounced function will delay invoking the callback until after
 * the specified wait time has elapsed since the last time it was invoked.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, wait)
    },
    [callback, wait],
  )
}
