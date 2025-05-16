"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface QuickReferenceGuideProps {
  title?: string
  description?: string
  className?: string
}

export function QuickReferenceGuide({
  title = "Quick Reference Guide",
  description = "Find your way around DASH",
  className,
}: QuickReferenceGuideProps) {
  const { isDark } = useTheme()

  return (
    <Card className={className}>
      <CardHeader className="pb-sm">
        <div className="flex items-center gap-xs">
          <Info className={cn("h-5 w-5", isDark ? "text-gray-400" : "text-blue-500")} />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-sm">
        <div>
          <h3 className="text-sm font-medium mb-xs">Module Organization</h3>
          <p className="text-xs text-muted-foreground">
            DASH is organized into modules that provide specific functionality. Core modules include Forms and
            Analytics, while administrative functions are consolidated in the System Settings module.
          </p>
          <div className="mt-xs p-xs bg-amber-50 border border-amber-200 rounded-md">
            <p className="text-xs text-amber-800">
              <strong>Recent Update:</strong> User Management and Security features are now part of the System Settings
              module.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-xs">Finding Administrative Features</h3>
          <p className="text-xs text-muted-foreground">
            To access user management, role configuration, or security settings, navigate to the System Settings module
            and use the sidebar navigation to select the desired section.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-xs">Need More Help?</h3>
          <p className="text-xs text-muted-foreground">
            For detailed documentation and guides, visit the{" "}
            <Link href="/help" className={cn("hover:underline", isDark ? "text-gray-300" : "text-blue-600")}>
              Help Center
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
