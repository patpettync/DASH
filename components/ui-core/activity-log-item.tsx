"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ActivityLog } from "@/types/user-management"

interface ActivityLogItemProps {
  log: ActivityLog
}

export function ActivityLogItem({ log }: ActivityLogItemProps) {
  const [expanded, setExpanded] = useState(false)

  // Format the timestamp as relative time
  const relativeTime = formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })

  // Determine badge variant based on action type
  const getBadgeVariant = (action: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (action) {
      case "login_failed":
      case "user_deleted":
        return "destructive"
      case "user_created":
      case "role_change":
        return "default"
      case "password_reset":
      case "profile_update":
      case "status_change":
        return "secondary"
      case "login":
      case "logout":
      case "settings_change":
      case "data_export":
      case "api_access":
      default:
        return "outline"
    }
  }

  // Format action for display
  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="border-b border-input py-xs transition-colors hover:bg-accent/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-xs">
          <Badge variant={getBadgeVariant(log.action)} className="capitalize">
            {formatAction(log.action)}
          </Badge>
          <span className="font-medium text-foreground">{log.userName}</span>
          <span className="text-sm text-muted-foreground">{log.details}</span>
        </div>
        <div className="flex items-center space-x-sm">
          <span className="text-xs text-muted-foreground">{relativeTime}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-xs w-xs"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse details" : "Expand details"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-xs rounded-md bg-accent/50 p-sm text-sm">
          <div className="grid grid-cols-2 gap-xs">
            <div>
              <p className="text-muted-foreground">User ID</p>
              <p className="text-foreground">{log.userId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">IP Address</p>
              <p className="text-foreground">{log.ipAddress}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Timestamp</p>
              <p className="text-foreground">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            {log.metadata && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Additional Details</p>
                <pre
                  className={cn(
                    "mt-xs overflow-x-auto rounded-md bg-muted p-xs text-xs text-muted-foreground font-mono",
                    expanded ? "block" : "hidden",
                  )}
                >
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
