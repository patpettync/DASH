"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Types
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  preventOutsideClick?: boolean
}

/**
 * LightweightModal - A performance-optimized modal component that uses React Portal
 * and implements efficient resource management and event handling.
 */
export function LightweightModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  preventOutsideClick = false,
}: ModalProps) {
  // State for controlling animation
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Refs
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Portal container ref
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  // Create portal container on mount
  useEffect(() => {
    // Create portal container only on client-side
    if (typeof window !== "undefined") {
      let container = document.getElementById("modal-portal-container")
      if (!container) {
        container = document.createElement("div")
        container.id = "modal-portal-container"
        document.body.appendChild(container)
      }
      setPortalContainer(container)
    }

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen && !isVisible) {
      // Store the active element when the modal opens
      previousFocusRef.current = document.activeElement as HTMLElement

      // Show modal with animation
      setIsVisible(true)

      // Use requestAnimationFrame for smoother animation
      animationFrameRef.current = requestAnimationFrame(() => {
        setIsAnimating(true)
      })

      // Prevent body scrolling
      document.body.style.overflow = "hidden"
    } else if (!isOpen && isVisible) {
      // Start closing animation
      setIsAnimating(false)

      // Wait for animation to complete before hiding
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false)

        // Restore body scrolling
        document.body.style.overflow = ""

        // Return focus to the element that had focus before the modal opened
        if (previousFocusRef.current) {
          try {
            previousFocusRef.current.focus()
          } catch (e) {
            console.warn("Failed to return focus:", e)
          }
          previousFocusRef.current = null
        }
      }, 200) // Match animation duration
    }
  }, [isOpen, isVisible])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        e.preventDefault()
        onClose()
      }
    }

    if (isVisible) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isVisible, onClose])

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (!preventOutsideClick && e.target === e.currentTarget && modalRef.current) {
        e.preventDefault()
        onClose()
      }
    },
    [onClose, preventOutsideClick],
  )

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  // Don't render anything if not visible
  if (!isVisible || !portalContainer) return null

  // Create portal content
  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        isAnimating ? "opacity-100" : "opacity-0",
        "transition-opacity duration-200 ease-out",
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-xl w-full overflow-hidden",
          sizeClasses[size],
          isAnimating ? "scale-100" : "scale-95",
          "transition-transform duration-200 ease-out",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onClose()
            }}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t bg-slate-50">{footer}</div>}
      </div>
    </div>
  )

  // Render using portal
  return createPortal(modalContent, portalContainer)
}

// Confirmation modal component
interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "default"
}

export function LightweightConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  // Handle confirm with async/await
  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Prevent multiple clicks
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // Use Promise to handle confirmation
      await Promise.resolve(onConfirm())
    } finally {
      // Ensure we always close the modal
      onClose()

      // Reset processing state after a delay
      setTimeout(() => {
        setIsProcessing(false)
      }, 300)
    }
  }

  const buttonVariant = {
    danger: "destructive",
    warning: "default",
    default: "default",
  }[variant] as "default" | "destructive"

  return (
    <LightweightModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button variant={buttonVariant} onClick={handleConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">{description}</p>
    </LightweightModal>
  )
}
