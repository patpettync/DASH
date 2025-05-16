"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LightweightModal } from "@/components/ui-core/lightweight-modal"

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

interface RoleCloneModalProps {
  isOpen: boolean
  onClose: () => void
  role: Role | null
  existingRoleNames: string[]
  onClone: (newRole: Omit<Role, "id" | "userCount" | "isSystem">) => void
}

export function RoleCloneModal({ isOpen, onClose, role, existingRoleNames, onClone }: RoleCloneModalProps) {
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Reset form when modal opens with a new role
  const resetForm = useCallback(() => {
    if (role) {
      setNewRoleName(`${role.name} (Copy)`)
      setNewRoleDescription(role.description)
      setError(null)
    }
  }, [role])

  // Reset form when modal opens
  useState(() => {
    if (isOpen && role) {
      resetForm()
    }
  })

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!role) return

    // Validate form
    if (!newRoleName.trim()) {
      setError("Role name is required")
      return
    }

    // Check for duplicate names
    if (existingRoleNames.includes(newRoleName.trim())) {
      setError("A role with this name already exists")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create the cloned role
      const clonedRole = {
        name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: { ...role.permissions },
        parentId: role.parentId,
      }

      // Call the clone handler
      await Promise.resolve(onClone(clonedRole))
      onClose()
    } catch (err) {
      setError("An error occurred while cloning the role")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }, [role, newRoleName, newRoleDescription, existingRoleNames, onClone, onClose])

  // Handle modal close
  const handleClose = useCallback(() => {
    if (isProcessing) return
    onClose()
  }, [isProcessing, onClose])

  if (!role) return null

  return (
    <LightweightModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Clone Role"
      description={`Create a new role based on ${role.name}`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Cloning..." : "Clone Role"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role-name">Role Name</Label>
          <Input
            id="role-name"
            value={newRoleName}
            onChange={(e) => {
              setNewRoleName(e.target.value)
              setError(null)
            }}
            placeholder="Enter role name"
            disabled={isProcessing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-description">Description</Label>
          <Input
            id="role-description"
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            placeholder="Enter role description"
            disabled={isProcessing}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          <p>
            This will create a new role with identical permissions to <strong>{role.name}</strong>.
          </p>
        </div>
      </div>
    </LightweightModal>
  )
}
