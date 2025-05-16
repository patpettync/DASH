"use client"

import React from "react"

import { useEffect, useState } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Toast variant styles
const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white border-slate-200",
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-amber-50 border-amber-200 text-amber-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface ToastProps extends VariantProps<typeof toastVariants> {
  id: string
  title: string
  description?: string
  action?: React.ReactNode
  onClose: (id: string) => void
  duration?: number
  className?: string
}

export function Toast({ id, title, description, action, onClose, duration = 5000, variant, className }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(id), 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const IconComponent = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
    default: Info,
  }[variant || "default"]

  return (
    <div
      className={cn(
        toastVariants({ variant }),
        "transition-all duration-300 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {IconComponent && <IconComponent className="h-5 w-5 flex-shrink-0" />}
        <div className="grid gap-1">
          <div className="text-sm font-medium">{title}</div>
          {description && <div className="text-sm opacity-90">{description}</div>}
        </div>
      </div>
      {action}
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(() => onClose(id), 300)
        }}
        className="absolute right-2 top-2 rounded-md p-1 text-slate-500 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

// Toast container component
// The ToastContainer component is crucial for the toast notification system.
// It positions all toast notifications at the top-right of the screen.
// If you remove this component, toast notifications won't have a place to render.

// You can modify its position or styling if needed, but removing it entirely would break the toast functionality.
// For example, you could change it to appear at the bottom-right instead:
// className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full"

// If you want to keep the current behavior, leave it as is:
export function ToastContainer({ children }: { children: React.ReactNode }) {
  const hasChildren = React.Children.count(children) > 0

  return (
    <div
      className={cn(
        "sticky top-16 right-0 z-40 flex flex-col gap-2 p-4 max-w-md w-full ml-auto",
        "pointer-events-none", // Prevents the container from blocking interactions when empty
        "transition-opacity duration-300",
        hasChildren ? "opacity-100" : "opacity-0",
      )}
      aria-live="polite"
      role="region"
      aria-label="Notifications"
    >
      {children}
    </div>
  )
}

// Toast provider and hook
import { createContext, useContext } from "react"

type ToastType = {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "warning" | "info"
  duration?: number
  action?: React.ReactNode
}

type ToastContextType = {
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            description={toast.description}
            variant={toast.variant}
            duration={toast.duration}
            action={toast.action}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
