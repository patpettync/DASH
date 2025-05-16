"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { LightweightModal } from "@/components/ui-core/lightweight-modal"
import { PermissionsViewer } from "@/components/ui-core/permissions-viewer"

interface PermissionCategory {
  id: string
  name: string
  actions: string[]
}

interface Role {
  id: number
  name: string
  description: string
  userCount: number
  isSystem: boolean
  permissions: {
    [key: string]: string[]
  }
  parentId?: number | null
}

interface ViewPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  role: Role | null
  permissionCategories: PermissionCategory[]
}

/**
 * An optimized modal component for viewing role permissions
 * Uses LightweightModal for better performance and cleanup
 */
export function ViewPermissionsModal({ isOpen, onClose, role, permissionCategories }: ViewPermissionsModalProps) {
  // Track loading state for async operations
  const [isLoading, setIsLoading] = useState(false)

  // Handle close with proper async cleanup
  const handleClose = useCallback(async () => {
    // Prevent multiple close attempts
    if (isLoading) return

    setIsLoading(true)

    try {
      // Simulate any async cleanup needed
      await new Promise((resolve) => setTimeout(resolve, 0))
      onClose()
    } finally {
      setIsLoading(false)
    }
  }, [onClose, isLoading])

  // If no role is selected, don't render the modal content
  if (!role) return null

  return (
    <LightweightModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${role.name} Permissions`}
      description="View the permissions assigned to this role."
      size="lg"
      footer={
        <div className="flex justify-end">
          <Button onClick={handleClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      }
    >
      <PermissionsViewer permissions={role.permissions} permissionCategories={permissionCategories} />
    </LightweightModal>
  )
}
