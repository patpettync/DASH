"use client"

import * as React from "react"
import { Dialog as ShadcnDialog } from "@/components/ui/dialog"
import type { DialogProps } from "@radix-ui/react-dialog"

interface DialogWrapperProps extends DialogProps {
  children: React.ReactNode
  onCloseComplete?: () => void
}

/**
 * DialogWrapper component that enhances the shadcn Dialog with proper cleanup
 * and focus management to prevent unresponsiveness after closure.
 */
export function DialogWrapper({ children, open, onOpenChange, onCloseComplete, ...props }: DialogWrapperProps) {
  const [isClosing, setIsClosing] = React.useState(false)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const isMounted = React.useRef(true)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Track component mount state
  React.useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      // Clear any pending timeouts on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Store the active element when the dialog opens
  React.useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [open])

  // Handle dialog close with proper cleanup
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!newOpen && !isClosing && open) {
        // Start closing sequence
        setIsClosing(true)

        // Wait for animation to complete before final cleanup
        timeoutRef.current = setTimeout(() => {
          if (isMounted.current) {
            setIsClosing(false)

            // Return focus to the element that had focus before the dialog opened
            if (previousFocusRef.current) {
              try {
                previousFocusRef.current.focus({ preventScroll: false })
              } catch (e) {
                console.warn("Failed to return focus:", e)
              }
              previousFocusRef.current = null
            }

            // Call the onCloseComplete callback
            onCloseComplete?.()

            // Finally call the original onOpenChange
            onOpenChange?.(false)
          }
        }, 100) // Short delay to ensure animation starts

        return false // Prevent immediate close
      }

      // For opening or if already in closing state, pass through
      onOpenChange?.(newOpen)
      return true
    },
    [isClosing, onCloseComplete, onOpenChange, open],
  )

  return (
    <ShadcnDialog open={open && !isClosing} onOpenChange={handleOpenChange} {...props}>
      {children}
    </ShadcnDialog>
  )
}
