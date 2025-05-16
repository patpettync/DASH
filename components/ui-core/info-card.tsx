"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface InfoCardProps {
  title: string
  description?: string
  status?: {
    type: "pending" | "success" | "error" | "warning" | "info" | "upcoming"
    label: string
  }
  primaryInfo?: string
  secondaryInfo?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function InfoCard({
  title,
  description,
  status,
  primaryInfo,
  secondaryInfo,
  actionLabel,
  actionHref,
  className,
}: InfoCardProps) {
  // Get theme-aware status colors
  const getStatusStyles = (type: string) => {
    switch (type) {
      case "info":
        return {
          backgroundColor: "var(--brand-primary-10, rgba(var(--brand-primary-rgb), 0.1))",
          color: "var(--brand-primary)",
          border: `1px solid var(--brand-primary-20, rgba(var(--brand-primary-rgb), 0.2))`,
        }
      case "success":
        return {
          backgroundColor: "var(--success-10, rgba(var(--success-rgb), 0.1))",
          color: "var(--success)",
          border: `1px solid var(--success-20, rgba(var(--success-rgb), 0.2))`,
        }
      case "warning":
        return {
          backgroundColor: "var(--warning-10, rgba(var(--warning-rgb), 0.1))",
          color: "var(--warning)",
          border: `1px solid var(--warning-20, rgba(var(--warning-rgb), 0.2))`,
        }
      case "error":
        return {
          backgroundColor: "var(--destructive-10, rgba(var(--destructive-rgb), 0.1))",
          color: "var(--destructive)",
          border: `1px solid var(--destructive-20, rgba(var(--destructive-rgb), 0.2))`,
        }
      case "pending":
      case "upcoming":
      default:
        return {
          backgroundColor: "var(--muted-10, rgba(var(--muted-rgb), 0.1))",
          color: "var(--muted-foreground)",
          border: `1px solid var(--muted-20, rgba(var(--muted-rgb), 0.2))`,
        }
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-xs">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {status && (
            <div className="ml-sm">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={getStatusStyles(status.type)}
              >
                {status.label}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {primaryInfo && <div className="text-2xl font-bold mb-xxs">{primaryInfo}</div>}
        {secondaryInfo && <div className="text-sm text-muted-foreground">{secondaryInfo}</div>}
        {actionLabel && actionHref && (
          <div className="mt-sm">
            <Button variant="outline" size="sm" asChild className="text-[var(--brand-primary)]">
              <a href={actionHref}>
                {actionLabel}
                <ChevronRight className="ml-xxs h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
