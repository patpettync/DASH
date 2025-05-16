"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface EnhancedModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnClickOutside?: boolean
  showCloseButton?: boolean
  className?: string
}

export function EnhancedModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
  showCloseButton = true,
  className,
}: EnhancedModalProps) {
  const { isDark } = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible && !isOpen) return null

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[95vw] max-h-[95vh]",
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0",
        isVisible ? "visible" : "invisible",
      )}
      onClick={closeOnClickOutside ? onClose : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full rounded-lg shadow-lg transition-all duration-300 overflow-hidden",
          sizeClasses[size],
          isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95",
          // Changed from blue-tinted background to proper gray scale
          isDark ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold">{title}</h2>
          {showCloseButton && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(80vh-8rem)]">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t p-4 dark:border-gray-800">{footer}</div>}
      </div>
    </div>
  )
}
