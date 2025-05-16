"use client"

import type React from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface QuickTipProps {
  title?: string
  children: React.ReactNode
  className?: string
  variant?: "info" | "warning" | "success"
}

export function QuickTip({ title, children, className, variant = "info" }: QuickTipProps) {
  const { isDark } = useTheme()

  const variantStyles = {
    info: isDark
      ? "bg-muted border-border text-foreground"
      : "bg-[var(--brand-primary-10,rgba(var(--brand-primary-rgb),0.1))] border-[var(--brand-primary-20,rgba(var(--brand-primary-rgb),0.2))] text-[var(--brand-primary)]",
    warning: "bg-warning/10 border-warning/20 text-warning dark:bg-warning/20 dark:border-warning/30",
    success: "bg-success/10 border-success/20 text-success dark:bg-success/20 dark:border-success/30",
  }

  const iconStyles = {
    info: isDark ? "text-muted-foreground" : "text-[var(--brand-primary)]",
    warning: "text-warning",
    success: "text-success",
  }

  return (
    <div className={cn("p-sm border rounded-md flex items-start gap-xs", variantStyles[variant], className)}>
      <Info className={cn("h-xs w-xs mt-xxs", iconStyles[variant])} />
      <div>
        {title && <p className="text-sm font-medium mb-xs">{title}</p>}
        <div className="text-xs">{children}</div>
      </div>
    </div>
  )
}
