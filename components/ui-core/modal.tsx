"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
  showCloseButton?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOutsideClick = true,
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Store the active element when the modal opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Focus trap - focus the modal when it opens
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )
          if (focusableElements.length > 0) {
            ;(focusableElements[0] as HTMLElement).focus()
          } else {
            modalRef.current.focus()
          }
        }
      }, 10)
    } else {
      setIsVisible(false)
      // Return focus to the element that had focus before the modal opened
      setTimeout(() => {
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }, 300) // After animation completes
    }
  }, [isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape" && isOpen) {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [closeOnEsc, onClose, isOpen])

  // Handle click outside
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget && isOpen) {
      e.preventDefault()
      e.stopPropagation()
      onClose()
    }
  }

  // If not open, don't render anything
  if (!isOpen) return null

  // Size classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
        isVisible ? "opacity-100" : "opacity-0",
        "transition-opacity duration-300",
      )}
      onClick={handleOutsideClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg shadow-xl w-full overflow-hidden",
          sizeClasses[size],
          isVisible ? "scale-100" : "scale-95",
          "transition-transform duration-300",
          className,
        )}
        tabIndex={-1} // Make the modal focusable but not in the tab order
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold">
              {title}
            </h2>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {showCloseButton && (
            <Button variant="ghost" size="icon" onClick={onClose} className="h-xs w-xs">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t bg-slate-50">{footer}</div>}
      </div>
    </div>
  )
}

// Modal context and hook for easier usage
import { createContext, useContext } from "react"

type ModalContextType = {
  openModal: (props: Omit<ModalProps, "isOpen" | "onClose">) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalProps, setModalProps] = useState<Omit<ModalProps, "isOpen" | "onClose"> | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const isMounted = useRef(true)

  // Track component mount state
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const openModal = (props: Omit<ModalProps, "isOpen" | "onClose">) => {
    if (!isMounted.current) return
    setModalProps(props)
    setIsOpen(true)
  }

  const closeModal = () => {
    if (!isMounted.current) return
    setIsOpen(false)
    // Clear props after animation completes
    setTimeout(() => {
      if (isMounted.current) {
        setModalProps(null)
      }
    }, 300)
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalProps && <Modal isOpen={isOpen} onClose={closeModal} {...modalProps} />}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
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

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmationModalProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Focus the confirm button when the modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus()
        }
      }, 10)
    }
  }, [isOpen])

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onConfirm()
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }

  const buttonVariant = {
    danger: "destructive",
    warning: "default",
    default: "default",
  }[variant] as "default" | "destructive"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button variant={buttonVariant} onClick={handleConfirm} ref={confirmButtonRef}>
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-600">{description}</p>
    </Modal>
  )
}
