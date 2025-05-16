// User type definition
export interface User {
  id: number
  name: string
  email: string
  role: string
  department: string
  status: "Active" | "Inactive"
  lastLogin: string
}

// Activity Log type definition
export interface ActivityLog {
  id: number
  userId: number
  userName: string
  action: ActivityAction
  details: string
  ipAddress: string
  timestamp: string
  metadata?: Record<string, any>
}

// Activity action types
export type ActivityAction =
  | "login"
  | "login_failed"
  | "logout"
  | "password_reset"
  | "profile_update"
  | "role_change"
  | "status_change"
  | "user_created"
  | "user_deleted"
  | "settings_change"
  | "data_export"
  | "api_access"

// Filter options for activity logs
export interface ActivityLogFilters {
  userId?: number
  action?: ActivityAction
  dateFrom?: string
  dateTo?: string
  searchQuery?: string
}

// Modal state type
export interface ModalState {
  addUser: boolean
  editUser: boolean
  resetPassword: boolean
  deleteConfirm: boolean
  deactivateConfirm: boolean
  bulkActionConfirm: boolean
  selectedUser: User | null
  bulkAction: BulkActionType | null
}

// Bulk action types
export type BulkActionType = "activate" | "deactivate" | "delete"
