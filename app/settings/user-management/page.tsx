"use client"

import type React from "react"
import { useState, useCallback, useEffect, useRef, useReducer } from "react"
import { ModuleLayout } from "@/components/layouts/module-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  MoreHorizontal,
  UserPlus,
  Search,
  Edit,
  Trash,
  UserCheck,
  UserX,
  KeyRound,
  Clock,
  AlertTriangle,
  Users,
} from "lucide-react"
import { useToast } from "@/components/ui-core/toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConfirmationModal } from "@/components/ui-core/modal"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LightweightModal } from "@/components/ui-core/lightweight-modal"
import { useDebouncedCallback } from "@/hooks/use-debounced-callback"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionBar } from "@/components/ui-core/bulk-action-bar"
import { ActivityLogFilters } from "@/components/ui-core/activity-log-filters"
import { generateMockActivityLogs, filterActivityLogs } from "@/lib/mock-activity-logs"
import type {
  User,
  ActivityLog,
  ActivityLogFilters as ActivityLogFiltersType,
  ModalState,
  BulkActionType,
} from "@/types/user-management"
import { settingsTabs } from "@/lib/settings-tabs"
import { useLoading } from "@/contexts/loading-context"
import { ActivityLogItem } from "@/components/ui-core/activity-log-item"

// Initial form state
const initialNewUserState = {
  name: "",
  email: "",
  role: "User",
  department: "",
}

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    department: "IT",
    status: "Active" as const,
    lastLogin: "2023-06-15 08:30:22",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Manager",
    department: "Marketing",
    status: "Active" as const,
    lastLogin: "2023-06-14 16:45:10",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "User",
    department: "Sales",
    status: "Active" as const,
    lastLogin: "2023-06-13 11:20:45",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Manager",
    department: "Finance",
    status: "Inactive" as const,
    lastLogin: "2023-05-28 09:15:33",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "User",
    department: "Operations",
    status: "Active" as const,
    lastLogin: "2023-06-15 10:05:17",
  },
]

// Initial modal state
const initialModalState: ModalState = {
  addUser: false,
  editUser: false,
  resetPassword: false,
  deleteConfirm: false,
  deactivateConfirm: false,
  bulkActionConfirm: false,
  selectedUser: null,
  bulkAction: null,
}

// Action types for reducer
type ModalAction =
  | { type: "OPEN_ADD_USER" }
  | { type: "OPEN_EDIT_USER"; payload: User }
  | { type: "OPEN_RESET_PASSWORD"; payload: User }
  | { type: "OPEN_DELETE_CONFIRM"; payload: User }
  | { type: "OPEN_DEACTIVATE_CONFIRM"; payload: User }
  | { type: "OPEN_BULK_ACTION_CONFIRM"; payload: BulkActionType }
  | { type: "CLOSE_ALL" }

// Modal reducer
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_ADD_USER":
      return { ...initialModalState, addUser: true }
    case "OPEN_EDIT_USER":
      return { ...initialModalState, editUser: true, selectedUser: action.payload }
    case "OPEN_RESET_PASSWORD":
      return { ...initialModalState, resetPassword: true, selectedUser: action.payload }
    case "OPEN_DELETE_CONFIRM":
      return { ...initialModalState, deleteConfirm: true, selectedUser: action.payload }
    case "OPEN_DEACTIVATE_CONFIRM":
      return { ...initialModalState, deactivateConfirm: true, selectedUser: action.payload }
    case "OPEN_BULK_ACTION_CONFIRM":
      return { ...initialModalState, bulkActionConfirm: true, bulkAction: action.payload }
    case "CLOSE_ALL":
      return initialModalState
    default:
      return state
  }
}

export default function UserManagementPage() {
  const { addToast } = useToast()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all")
  const [contentTab, setContentTab] = useState<"users" | "activity">("users")
  const { startLoading, stopLoading } = useLoading()

  // Form states
  const [newUser, setNewUser] = useState(initialNewUserState)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [resetPasswordEmail, setResetPasswordEmail] = useState("")

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)

  // Bulk selection state
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [logFilters, setLogFilters] = useState<ActivityLogFiltersType>({})
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(true)

  // Use reducer for modal state management
  const [modalState, dispatch] = useReducer(modalReducer, initialModalState)

  // Refs for tracking component state
  const isMounted = useRef(true)
  const isInitialMount = useRef(true)

  // Component lifecycle management
  useEffect(() => {
    isMounted.current = true

    // Generate mock activity logs
    const logs = generateMockActivityLogs(users, 200)
    setActivityLogs(logs)
    setFilteredLogs(logs)
    setIsLoadingLogs(false)

    return () => {
      isMounted.current = false
    }
  }, [])

  // Fixed loading effect - only runs on mount
  useEffect(() => {
    // Only run this effect once on mount
    if (isInitialMount.current) {
      startLoading("userManagement")

      const timer = setTimeout(() => {
        stopLoading("userManagement")
      }, 800)

      return () => {
        clearTimeout(timer)
      }
    }
  }, []) // Empty dependency array - only runs on mount

  // Set isInitialMount to false after the first render
  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Separate cleanup effect for unmounting
  useEffect(() => {
    return () => {
      stopLoading("userManagement")
    }
  }, [stopLoading])

  // Filter activity logs when filters change
  const filteredLogsRef = useRef(activityLogs)
  useEffect(() => {
    filteredLogsRef.current = filterActivityLogs(activityLogs, logFilters)
    setFilteredLogs(filteredLogsRef.current)
  }, [activityLogs, logFilters])

  // Set up edit user form when selected user changes
  useEffect(() => {
    if (modalState.editUser && modalState.selectedUser) {
      // Create a deep copy to avoid reference issues
      setEditUser(JSON.parse(JSON.stringify(modalState.selectedUser)))
    } else if (!modalState.editUser) {
      setEditUser(null)
    }
  }, [modalState.editUser, modalState.selectedUser])

  // Set up reset password email when selected user changes
  useEffect(() => {
    if (modalState.resetPassword && modalState.selectedUser) {
      setResetPasswordEmail(modalState.selectedUser.email)
    } else if (!modalState.resetPassword) {
      setResetPasswordEmail("")
    }
  }, [modalState.resetPassword, modalState.selectedUser])

  // Reset new user form when add user modal closes
  useEffect(() => {
    if (!modalState.addUser) {
      // Use requestAnimationFrame to defer state update
      requestAnimationFrame(() => {
        if (isMounted.current) {
          setNewUser(initialNewUserState)
        }
      })
    }
  }, [modalState.addUser])

  const filteredUsers = users.filter(
    (user) =>
      (activeTab === "all" ||
        (activeTab === "active" && user.status === "Active") ||
        (activeTab === "inactive" && user.status === "Inactive")) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll && selectedUserIds.size !== filteredUsers.length) {
      const ids = new Set(filteredUsers.map((user) => user.id))
      setSelectedUserIds(ids)
    } else if (!selectAll && selectedUserIds.size === filteredUsers.length && filteredUsers.length > 0) {
      // If all users are selected but selectAll is false, update selectAll
      setSelectAll(true)
    }
  }, [selectAll, filteredUsers])

  // Close all modals
  const closeAllModals = useCallback(() => {
    dispatch({ type: "CLOSE_ALL" })
  }, [])

  // Debounced search handler
  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearchQuery(value)
  }, 300)

  // Handle user selection for bulk actions
  const toggleUserSelection = useCallback(
    (userId: number) => {
      setSelectedUserIds((prev) => {
        const newSelection = new Set(prev)
        if (newSelection.has(userId)) {
          newSelection.delete(userId)
        } else {
          newSelection.add(userId)
        }
        return newSelection
      })

      // Update selectAll state if needed, but only if necessary
      if (selectAll && selectedUserIds.size === filteredUsers.length - 1) {
        setSelectAll(false)
      }
    },
    [selectAll, filteredUsers.length],
  )

  // Handle select all checkbox
  const toggleSelectAll = useCallback(() => {
    setSelectAll(!selectAll)
    if (!selectAll) {
      const ids = new Set(filteredUsers.map((user) => user.id))
      setSelectedUserIds(ids)
    } else {
      setSelectedUserIds(new Set())
    }
  }, [selectAll, filteredUsers])

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedUserIds(new Set())
    setSelectAll(false)
  }, [])

  // Handle bulk action
  const handleBulkAction = useCallback((action: BulkActionType) => {
    dispatch({ type: "OPEN_BULK_ACTION_CONFIRM", payload: action })
  }, [])

  // Execute bulk action
  const executeBulkAction = useCallback(async () => {
    if (!modalState.bulkAction || selectedUserIds.size === 0) return
    setIsProcessing(true)

    try {
      const action = modalState.bulkAction
      const selectedIds = Array.from(selectedUserIds)

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Apply the action to all selected users
      switch (action) {
        case "activate":
          setUsers((prev) => prev.map((user) => (selectedIds.includes(user.id) ? { ...user, status: "Active" } : user)))
          break
        case "deactivate":
          setUsers((prev) =>
            prev.map((user) => (selectedIds.includes(user.id) ? { ...user, status: "Inactive" } : user)),
          )
          break
        case "delete":
          setUsers((prev) => prev.filter((user) => !selectedIds.includes(user.id)))
          break
      }

      // Add activity logs for each affected user
      const now = new Date().toISOString()
      const newLogs: ActivityLog[] = []

      for (const userId of selectedIds) {
        const user = users.find((u) => u.id === userId)
        if (!user) continue

        let actionType: any
        let details: string

        switch (action) {
          case "activate":
            actionType = "status_change"
            details = "User status changed to Active (bulk action)"
            break
          case "deactivate":
            actionType = "status_change"
            details = "User status changed to Inactive (bulk action)"
            break
          case "delete":
            actionType = "user_deleted"
            details = "User account deleted (bulk action)"
            break
        }

        newLogs.push({
          id: activityLogs.length + newLogs.length + 1,
          userId: user.id,
          userName: user.name,
          action: actionType,
          details,
          ipAddress: "127.0.0.1", // Admin's IP
          timestamp: now,
          metadata: {
            bulkAction: true,
            affectedUsers: selectedIds.length,
          },
        })
      }

      // Add the new logs
      setActivityLogs((prev) => [...newLogs, ...prev])

      // Show success toast
      const actionText = action === "activate" ? "activated" : action === "deactivate" ? "deactivated" : "deleted"
      addToast({
        title: "Bulk Action Completed",
        description: `${selectedIds.length} users have been ${actionText}.`,
        variant: "success",
      })

      // Clear selection and close modal
      clearSelection()
      closeAllModals()
    } catch (error) {
      console.error("Error executing bulk action:", error)
      addToast({
        title: "Error",
        description: "An error occurred while performing the bulk action. Please try again.",
        variant: "error",
      })
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }, [modalState.bulkAction, selectedUserIds, users, activityLogs.length, addToast, clearSelection, closeAllModals])

  // Form submission handlers with async/await
  const handleAddUser = useCallback(async () => {
    if (isProcessing) return
    setIsProcessing(true)

    try {
      // Validate form
      if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
        addToast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "error",
        })
        return
      }

      // Add new user (simulating async operation)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1
          const now = new Date().toISOString().replace("T", " ").substring(0, 19)

          const newUserObj = {
            id,
            ...newUser,
            status: "Active" as const,
            lastLogin: now,
          }

          setUsers((prevUsers) => [...prevUsers, newUserObj])

          // Add activity log
          const newLog: ActivityLog = {
            id: activityLogs.length + 1,
            userId: id,
            userName: newUser.name,
            action: "user_created",
            details: "New user account created",
            ipAddress: "127.0.0.1", // Admin's IP
            timestamp: new Date().toISOString(),
            metadata: {
              role: newUser.role,
              department: newUser.department,
            },
          }

          setActivityLogs((prev) => [newLog, ...prev])

          resolve()
        }, 500) // Simulate network delay
      })

      // Close dialog
      closeAllModals()

      // Show success toast
      addToast({
        title: "User Added",
        description: `${newUser.name} has been added successfully.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      addToast({
        title: "Error",
        description: "An error occurred while adding the user. Please try again.",
        variant: "error",
      })
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }, [addToast, closeAllModals, isProcessing, newUser, users, activityLogs.length])

  const handleEditUser = useCallback(async () => {
    if (isProcessing || !editUser) return
    setIsProcessing(true)

    try {
      // Validate form
      if (!editUser.name || !editUser.email || !editUser.role || !editUser.department) {
        addToast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "error",
        })
        return
      }

      // Find the original user to compare changes
      const originalUser = users.find((u) => u.id === editUser.id)

      // Update user (simulating async operation)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setUsers((prevUsers) => prevUsers.map((user) => (user.id === editUser.id ? { ...editUser } : user)))

          // Add activity log for the edit
          if (originalUser) {
            // Determine what fields were changed
            const changedFields: string[] = []
            if (originalUser.name !== editUser.name) changedFields.push("name")
            if (originalUser.email !== editUser.email) changedFields.push("email")
            if (originalUser.role !== editUser.role) changedFields.push("role")
            if (originalUser.department !== editUser.department) changedFields.push("department")
            if (originalUser.status !== editUser.status) changedFields.push("status")

            // Create appropriate log entry
            if (changedFields.length > 0) {
              let action: any = "profile_update"
              let details = "User profile updated"

              // Special case for role change
              if (changedFields.includes("role") && changedFields.length === 1) {
                action = "role_change"
                details = `Role changed from ${originalUser.role} to ${editUser.role}`
              }

              // Special case for status change
              if (changedFields.includes("status") && changedFields.length === 1) {
                action = "status_change"
                details = `User status changed to ${editUser.status}`
              }

              const newLog: ActivityLog = {
                id: activityLogs.length + 1,
                userId: editUser.id,
                userName: editUser.name,
                action,
                details,
                ipAddress: "127.0.0.1", // Admin's IP
                timestamp: new Date().toISOString(),
                metadata: {
                  changedFields,
                  previousValues: changedFields.reduce(
                    (acc, field) => {
                      acc[field] = (originalUser as any)[field]
                      return acc
                    },
                    {} as Record<string, any>,
                  ),
                  newValues: changedFields.reduce(
                    (acc, field) => {
                      acc[field] = (editUser as any)[field]
                      return acc
                    },
                    {} as Record<string, any>,
                  ),
                },
              }

              setActivityLogs((prev) => [newLog, ...prev])
            }
          }

          resolve()
        }, 500) // Simulate network delay
      })

      // Close dialog
      closeAllModals()

      // Show success toast
      addToast({
        title: "User Updated",
        description: `${editUser.name}'s information has been updated successfully.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating user:", error)
      addToast({
        title: "Error",
        description: "An error occurred while updating the user. Please try again.",
        variant: "error",
      })
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }, [addToast, closeAllModals, editUser, isProcessing, users, activityLogs.length])

  const handleResetPassword = useCallback(async () => {
    if (isProcessing || !modalState.selectedUser) return
    setIsProcessing(true)

    try {
      // Simulate password reset (async operation)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // Add activity log for password reset
          const newLog: ActivityLog = {
            id: activityLogs.length + 1,
            userId: modalState.selectedUser!.id,
            userName: modalState.selectedUser!.name,
            action: "password_reset",
            details: "Password reset requested",
            ipAddress: "127.0.0.1", // Admin's IP
            timestamp: new Date().toISOString(),
            metadata: {
              method: "email",
              requestedBy: "administrator",
              completed: false,
            },
          }

          setActivityLogs((prev) => [newLog, ...prev])

          resolve()
        }, 500) // Simulate network delay
      })

      // Close dialog
      closeAllModals()

      // Show success toast
      addToast({
        title: "Password Reset Initiated",
        description: `A password reset link has been sent to ${modalState.selectedUser.email}.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error resetting password:", error)
      addToast({
        title: "Error",
        description: "An error occurred while resetting the password. Please try again.",
        variant: "error",
      })
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }, [addToast, closeAllModals, isProcessing, modalState.selectedUser, activityLogs.length])

  const handleStatusChange = useCallback(
    async (userId: number, newStatus: "Active" | "Inactive") => {
      try {
        const user = users.find((u) => u.id === userId)
        if (!user) return

        // Update user status (simulating async operation)
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            setUsers((prevUsers) =>
              prevUsers.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)),
            )

            // Add activity log for status change
            const newLog: ActivityLog = {
              id: activityLogs.length + 1,
              userId,
              userName: user.name,
              action: "status_change",
              details: `User status changed to ${newStatus}`,
              ipAddress: "127.0.0.1", // Admin's IP
              timestamp: new Date().toISOString(),
              metadata: {
                previousStatus: user.status,
                newStatus,
              },
            }

            setActivityLogs((prev) => [newLog, ...prev])

            resolve()
          }, 300) // Simulate network delay
        })

        addToast({
          title: `User ${newStatus}`,
          description: `User status has been updated to ${newStatus}.`,
          variant: "success",
        })
      } catch (error) {
        console.error("Error changing user status:", error)
        addToast({
          title: "Error",
          description: "An error occurred while updating the user status. Please try again.",
          variant: "error",
        })
      }
    },
    [addToast, users, activityLogs.length],
  )

  const handleDeleteUser = useCallback(async () => {
    if (isProcessing || !modalState.selectedUser) return
    setIsProcessing(true)

    try {
      // Delete user (simulating async operation)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // Add activity log before deleting the user
          const newLog: ActivityLog = {
            id: activityLogs.length + 1,
            userId: modalState.selectedUser!.id,
            userName: modalState.selectedUser!.name,
            action: "user_deleted",
            details: "User account deleted",
            ipAddress: "127.0.0.1", // Admin's IP
            timestamp: new Date().toISOString(),
            metadata: {
              role: modalState.selectedUser!.role,
              department: modalState.selectedUser!.department,
            },
          }

          setActivityLogs((prev) => [newLog, ...prev])

          // Now delete the user
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== modalState.selectedUser?.id))
          resolve()
        }, 500) // Simulate network delay
      })

      // Close confirmation
      closeAllModals()

      addToast({
        title: "User Deleted",
        description: `${modalState.selectedUser.name} has been deleted successfully.`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      addToast({
        title: "Error",
        description: "An error occurred while deleting the user. Please try again.",
        variant: "error",
      })
    } finally {
      if (isMounted.current) {
        setIsProcessing(false)
      }
    }
  }, [addToast, closeAllModals, isProcessing, modalState.selectedUser, activityLogs.length])

  const handleConfirmDeactivate = useCallback(async () => {
    if (!modalState.selectedUser) return

    try {
      await handleStatusChange(modalState.selectedUser.id, "Inactive")
      closeAllModals()
    } catch (error) {
      console.error("Error deactivating user:", error)
    }
  }, [closeAllModals, handleStatusChange, modalState.selectedUser])

  // Form input change handlers
  const handleNewUserChange = useCallback((field: keyof typeof initialNewUserState, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleEditUserChange = useCallback(
    (field: keyof User, value: string) => {
      if (!editUser) return
      setEditUser((prev) => (prev ? { ...prev, [field]: value } : null))
    },
    [editUser],
  )

  // Event delegation for dropdown menu items
  const handleDropdownAction = useCallback(
    (action: string, user: User, event: React.MouseEvent) => {
      // Prevent default behavior and stop propagation
      event.preventDefault()
      event.stopPropagation()

      // Handle different actions
      switch (action) {
        case "edit":
          dispatch({ type: "OPEN_EDIT_USER", payload: user })
          break
        case "resetPassword":
          dispatch({ type: "OPEN_RESET_PASSWORD", payload: user })
          break
        case "deactivate":
          dispatch({ type: "OPEN_DEACTIVATE_CONFIRM", payload: user })
          break
        case "activate":
          handleStatusChange(user.id, "Active")
          break
        case "delete":
          dispatch({ type: "OPEN_DELETE_CONFIRM", payload: user })
          break
        default:
          break
      }
    },
    [handleStatusChange],
  )

  // Get bulk action confirmation text
  const getBulkActionConfirmationText = useCallback(() => {
    if (!modalState.bulkAction) return ""

    const count = selectedUserIds.size

    switch (modalState.bulkAction) {
      case "activate":
        return `Are you sure you want to activate ${count} user${count !== 1 ? "s" : ""}?`
      case "deactivate":
        return `Are you sure you want to deactivate ${count} user${count !== 1 ? "s" : ""}? They will no longer be able to access the system.`
      case "delete":
        return `Are you sure you want to delete ${count} user${count !== 1 ? "s" : ""}? This action cannot be undone.`
      default:
        return ""
    }
  }, [modalState.bulkAction, selectedUserIds.size])

  // Get bulk action button text
  const getBulkActionButtonText = useCallback(() => {
    if (!modalState.bulkAction) return ""

    switch (modalState.bulkAction) {
      case "activate":
        return "Activate Users"
      case "deactivate":
        return "Deactivate Users"
      case "delete":
        return "Delete Users"
      default:
        return ""
    }
  }, [modalState.bulkAction])

  return (
    <ModuleLayout moduleName="System Settings" tabs={settingsTabs} basePath="/settings">
      <div className="space-y-6">
        <Tabs
          value={contentTab}
          onValueChange={(value) => setContentTab(value as "users" | "activity")}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="users" className="flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 pt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Users</CardTitle>
                  <Button onClick={() => dispatch({ type: "OPEN_ADD_USER" })} disabled={isProcessing}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
                <CardDescription>Manage user accounts and their access to the system.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>

                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "all" | "active" | "inactive")}
                    className="w-full"
                  >
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="all">All Users</TabsTrigger>
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="inactive">Inactive</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="border rounded-md dark:border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Select all users"
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className={selectedUserIds.has(user.id) ? "bg-gray-50 dark:bg-gray-900" : ""}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedUserIds.has(user.id)}
                              onCheckedChange={() => toggleUserSelection(user.id)}
                              aria-label={`Select ${user.name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Badge
                              variant={user.status === "Active" ? "outline" : "secondary"}
                              className={
                                user.status === "Active"
                                  ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                                  : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                              }
                            >
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => handleDropdownAction("edit", user, e)}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => handleDropdownAction("resetPassword", user, e)}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                {user.status === "Active" ? (
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={(e) => handleDropdownAction("deactivate", user, e)}
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={(e) => handleDropdownAction("activate", user, e)}
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 dark:text-red-400"
                                  onClick={(e) => handleDropdownAction("delete", user, e)}
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No users found matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6 pt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Logs</CardTitle>
                </div>
                <CardDescription>Track user actions and system events.</CardDescription>
              </CardHeader>
              <CardContent>
                <ActivityLogFilters
                  users={users}
                  onFilterChange={useCallback((filters: ActivityLogFiltersType) => {
                    setLogFilters(filters)
                  }, [])}
                  className="mb-4"
                />

                {isLoadingLogs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading activity logs...</p>
                    </div>
                  </div>
                ) : filteredLogs.length > 0 ? (
                  <div className="space-y-1 max-h-[600px] overflow-y-auto pr-2">
                    {filteredLogs.map((log) => (
                      <ActivityLogItem key={log.id} log={log} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium dark:text-gray-300">No activity logs found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your filters or check back later.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add User Modal */}
      <LightweightModal
        isOpen={modalState.addUser}
        onClose={closeAllModals}
        title="Add New User"
        description="Create a new user account. The user will receive an email with instructions to set their password."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeAllModals} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isProcessing}>
              {isProcessing ? "Adding..." : "Add User"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={newUser.name} onChange={(e) => handleNewUserChange("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => handleNewUserChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={newUser.role} onValueChange={(value) => handleNewUserChange("role", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="User">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={newUser.department}
              onChange={(e) => handleNewUserChange("department", e.target.value)}
            />
          </div>
        </div>
      </LightweightModal>

      {/* Edit User Modal */}
      <LightweightModal
        isOpen={modalState.editUser}
        onClose={closeAllModals}
        title="Edit User"
        description="Update user information and settings."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeAllModals} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        }
      >
        {editUser && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) => handleEditUserChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => handleEditUserChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editUser.role} onValueChange={(value) => handleEditUserChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Department</Label>
              <Input
                id="edit-department"
                value={editUser.department}
                onChange={(e) => handleEditUserChange("department", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editUser.status}
                onValueChange={(value) => handleEditUserChange("status", value as "Active" | "Inactive")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </LightweightModal>

      {/* Reset Password Modal */}
      <LightweightModal
        isOpen={modalState.resetPassword}
        onClose={closeAllModals}
        title="Reset User Password"
        description="Send a password reset link to the user's email address."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeAllModals} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={isProcessing}>
              {isProcessing ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email Address</Label>
            <Input id="reset-email" type="email" value={resetPasswordEmail} disabled />
          </div>
          <p className="text-sm text-muted-foreground">
            A password reset link will be sent to this email address. The link will expire after 24 hours.
          </p>
        </div>
      </LightweightModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.deleteConfirm}
        onClose={closeAllModals}
        title="Delete User"
        description={`Are you sure you want to delete ${modalState.selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleDeleteUser}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Deactivate Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.deactivateConfirm}
        onClose={closeAllModals}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${modalState.selectedUser?.name}? They will no longer be able to access the system.`}
        onConfirm={handleConfirmDeactivate}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="warning"
      />

      {/* Bulk Action Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalState.bulkActionConfirm}
        onClose={closeAllModals}
        title={`Confirm Bulk Action`}
        description={getBulkActionConfirmationText()}
        onConfirm={executeBulkAction}
        confirmText={getBulkActionButtonText()}
        cancelText="Cancel"
        variant={modalState.bulkAction === "delete" ? "danger" : "warning"}
      />

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedUserIds.size}
        onAction={handleBulkAction}
        onClearSelection={clearSelection}
        className="border-t dark:border-gray-800"
      />
    </ModuleLayout>
  )
}
