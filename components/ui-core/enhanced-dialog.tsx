"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

// Create a context to track dialog state
type DialogContextValue = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  triggerRef: React.RefObject<HTMLButtonElement>
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

function useDialogContext() {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a DialogProvider")
  }
  return context
}

// Enhanced Dialog Root component with context provider
const EnhancedDialog = ({ children, open, onOpenChange, defaultOpen }: DialogPrimitive.DialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen || false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalOpen(open)
      }
      onOpenChange?.(open)
    },
    [isControlled, onOpenChange],
  )

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange, triggerRef }}>
      <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} defaultOpen={defaultOpen}>
        {children}
      </DialogPrimitive.Root>
    </DialogContext.Provider>
  )
}
EnhancedDialog.displayName = "EnhancedDialog"

// Enhanced Dialog Trigger with ref forwarding
const EnhancedDialogTrigger = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
>(({ children, ...props }, forwardedRef) => {
  const { triggerRef } = useDialogContext()

  // Merge the forwarded ref with our internal ref
  const ref = React.useMemo(() => {
    if (forwardedRef) {
      return (node: HTMLButtonElement | null) => {
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
        triggerRef.current = node
      }
    }
    return triggerRef
  }, [forwardedRef, triggerRef])

  return (
    <DialogPrimitive.Trigger ref={ref} {...props}>
      {children}
    </DialogPrimitive.Trigger>
  )
})
EnhancedDialogTrigger.displayName = "EnhancedDialogTrigger"

// Enhanced Dialog Content with focus management
const EnhancedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    onCloseComplete?: () => void
  }
>(({ className, children, onCloseComplete, ...props }, ref) => {
  const { isOpen, triggerRef } = useDialogContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [isClosing, setIsClosing] = React.useState(false)
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null)

  // Store the previously focused element when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement
    }
  }, [isOpen])

  // Handle animation states
  React.useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(true)

      // Wait for animation to complete
      const timer = setTimeout(() => {
        setIsClosing(false)
        onCloseComplete?.()

        // Return focus to trigger element after closing
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus()
        } else if (triggerRef.current) {
          triggerRef.current.focus()
        }
      }, 300) // Match animation duration

      return () => clearTimeout(timer)
    }
  }, [isOpen, isClosing, onCloseComplete, triggerRef])

  // Focus management
  React.useEffect(() => {
    if (isOpen && contentRef.current) {
      // Find the first focusable element
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length > 0) {
        // Focus the first element with a small delay to ensure the dialog is visible
        setTimeout(() => {
          ;(focusableElements[0] as HTMLElement).focus()
        }, 50)
      } else {
        // If no focusable elements, focus the dialog itself
        contentRef.current.focus()
      }
    }
  }, [isOpen])

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          isClosing ? "animate-out fade-out-0" : "",
        )}
      />
      <DialogPrimitive.Content
        ref={(node) => {
          // Handle both the forwarded ref and our internal ref
          if (typeof ref === "function") {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          contentRef.current = node
        }}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          isClosing ? "animate-out fade-out-0 zoom-out-95 slide-out-to-left-1/2 slide-out-to-top-[48%]" : "",
          className,
        )}
        tabIndex={-1} // Make the dialog focusable
        aria-modal="true"
        role="dialog"
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})
EnhancedDialogContent.displayName = "EnhancedDialogContent"

// Re-export other components
const EnhancedDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
EnhancedDialogHeader.displayName = "EnhancedDialogHeader"

const EnhancedDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
EnhancedDialogFooter.displayName = "EnhancedDialogFooter"

const EnhancedDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
EnhancedDialogTitle.displayName = "EnhancedDialogTitle"

const EnhancedDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
EnhancedDialogDescription.displayName = "EnhancedDialogDescription"

// Export all components
export {
  EnhancedDialog as Dialog,
  EnhancedDialogTrigger as DialogTrigger,
  EnhancedDialogContent as DialogContent,
  EnhancedDialogHeader as DialogHeader,
  EnhancedDialogFooter as DialogFooter,
  EnhancedDialogTitle as DialogTitle,
  EnhancedDialogDescription as DialogDescription,
}
