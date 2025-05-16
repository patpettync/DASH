"use client"

import type React from "react"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface ConfirmationPopoverProps {
  children: React.ReactNode
  title: string
  description: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "default"
  className?: string
}

export function ConfirmationPopover({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  className,
}: ConfirmationPopoverProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  const variantStyles = {
    danger: {
      icon: "text-red-500",
      title: "text-red-700",
      button: "destructive",
    },
    warning: {
      icon: "text-amber-500",
      title: "text-amber-700",
      button: "default",
    },
    default: {
      icon: "text-blue-500",
      title: "text-slate-900",
      button: "default",
    },
  }

  const styles = variantStyles[variant]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cn("w-80", className)}>
        <div className="flex gap-sm">
          <AlertCircle className={cn("h-5 w-5", styles.icon)} />
          <div className="space-y-xs flex-1">
            <h4 className={cn("font-medium leading-none", styles.title)}>{title}</h4>
            <p className="text-sm text-slate-500">{description}</p>
            <div className="flex justify-end gap-xs pt-xs">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                {cancelText}
              </Button>
              <Button variant={styles.button as any} size="sm" onClick={handleConfirm}>
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
