"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

interface PermissionCategory {
  id: string
  name: string
  actions: string[]
}

interface PermissionsViewerProps {
  permissions: {
    [key: string]: string[]
  }
  permissionCategories: PermissionCategory[]
}

export function PermissionsViewer({ permissions, permissionCategories }: PermissionsViewerProps) {
  const { isDark } = useTheme()

  // Memoize the permission data to prevent unnecessary re-renders
  const permissionData = useMemo(() => {
    return permissionCategories.map((category) => {
      const grantedActions = permissions[category.id] || []
      return {
        ...category,
        grantedActions,
      }
    })
  }, [permissions, permissionCategories])

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission Category</TableHead>
            <TableHead>Granted Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissionData.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {category.grantedActions.length > 0 ? (
                    category.grantedActions.map((action: string) => (
                      <Badge
                        key={action}
                        variant="outline"
                        className={cn(
                          "capitalize",
                          isDark
                            ? "bg-gray-800 text-gray-300 border-gray-700"
                            : "bg-green-50 text-green-700 border-green-200",
                        )}
                      >
                        {action}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No permissions</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
