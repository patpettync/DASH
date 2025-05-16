"use client"

import { Trash, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { BulkActionType } from "@/types/user-management"

interface BulkActionBarProps {
  selectedCount: number
  onAction: (action: BulkActionType) => void
  onClearSelection: () => void
  className?: string
}

export function BulkActionBar({ selectedCount, onAction, onClearSelection, className }: BulkActionBarProps) {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-white p-4 shadow-md transition-transform md:left-auto",
        selectedCount > 0 ? "translate-y-0" : "translate-y-full",
        className,
      )}
    >
      <div className="flex items-center">
        <span className="mr-2 font-medium">
          {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
        </span>
        <Button variant="outline" size="sm" onClick={onClearSelection}>
          Clear selection
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="gap-1" onClick={() => onAction("activate")}>
          <UserCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Activate</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1" onClick={() => onAction("deactivate")}>
          <UserX className="h-4 w-4" />
          <span className="hidden sm:inline">Deactivate</span>
        </Button>
        <Button variant="destructive" size="sm" className="gap-1" onClick={() => onAction("delete")}>
          <Trash className="h-4 w-4" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
    </div>
  )
}
