"use client"

import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

type StatusType = "pending" | "success" | "error" | "warning" | "info" | "upcoming"

interface StatusBadgeProps {
  status: StatusType
  label: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const { isDark } = useTheme()

  // Use semantic tokens and brand colors for status badges
  const getStatusClasses = (status: StatusType) => {
    switch (status) {
      case "info":
        return {
          bg: `var(--brand-primary-10, rgba(var(--brand-primary-rgb), 0.1))`,
          text: `var(--brand-primary)`,
          border: `var(--brand-primary-20, rgba(var(--brand-primary-rgb), 0.2))`,
        }
      case "success":
        return {
          bg: `var(--success-10, rgba(var(--success-rgb), 0.1))`,
          text: `var(--success)`,
          border: `var(--success-20, rgba(var(--success-rgb), 0.2))`,
        }
      case "warning":
        return {
          bg: `var(--warning-10, rgba(var(--warning-rgb), 0.1))`,
          text: `var(--warning)`,
          border: `var(--warning-20, rgba(var(--warning-rgb), 0.2))`,
        }
      case "error":
        return {
          bg: `var(--destructive-10, rgba(var(--destructive-rgb), 0.1))`,
          text: `var(--destructive)`,
          border: `var(--destructive-20, rgba(var(--destructive-rgb), 0.2))`,
        }
      case "pending":
      case "upcoming":
      default:
        return {
          bg: `var(--muted-10, rgba(var(--muted-rgb), 0.1))`,
          text: `var(--muted-foreground)`,
          border: `var(--muted-20, rgba(var(--muted-rgb), 0.2))`,
        }
    }
  }

  const statusStyles = getStatusClasses(status)

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}
      style={{
        backgroundColor: statusStyles.bg,
        color: statusStyles.text,
        borderColor: statusStyles.border,
      }}
    >
      {label}
    </span>
  )
}
