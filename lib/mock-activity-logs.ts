import type { ActivityLog } from "@/types/user-management"

// Generate a random IP address
function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255,
  )}.${Math.floor(Math.random() * 255)}`
}

// Generate a random date within the last 30 days
function generateRandomDate(daysBack = 30) {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack))
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))
  return date.toISOString()
}

// Generate mock activity logs for a set of users
export function generateMockActivityLogs(users: any[], count = 100): ActivityLog[] {
  const actions = [
    "login",
    "login_failed",
    "logout",
    "password_reset",
    "profile_update",
    "role_change",
    "status_change",
    "user_created",
    "user_deleted",
    "settings_change",
    "data_export",
    "api_access",
  ] as const

  const logs: ActivityLog[] = []

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]

    let details = ""
    let metadata: Record<string, any> | undefined = undefined

    // Generate appropriate details based on action
    switch (action) {
      case "login":
        details = "User logged in successfully"
        metadata = { browser: "Chrome", os: "Windows 10" }
        break
      case "login_failed":
        details = "Failed login attempt"
        metadata = { reason: "Invalid password", attempts: Math.floor(Math.random() * 5) + 1 }
        break
      case "logout":
        details = "User logged out"
        metadata = { sessionDuration: `${Math.floor(Math.random() * 120) + 1} minutes` }
        break
      case "password_reset":
        details = "Password reset requested"
        metadata = { method: "email", completed: Math.random() > 0.3 }
        break
      case "profile_update":
        details = "User profile updated"
        metadata = {
          fields: ["name", "email", "department"].slice(0, Math.floor(Math.random() * 3) + 1),
        }
        break
      case "role_change":
        const roles = ["User", "Manager", "Administrator"]
        const oldRole = roles[Math.floor(Math.random() * roles.length)]
        let newRole = oldRole
        while (newRole === oldRole) {
          newRole = roles[Math.floor(Math.random() * roles.length)]
        }
        details = `Role changed from ${oldRole} to ${newRole}`
        metadata = { oldRole, newRole, changedBy: users[Math.floor(Math.random() * users.length)].id }
        break
      case "status_change":
        const newStatus = Math.random() > 0.5 ? "Active" : "Inactive"
        details = `User status changed to ${newStatus}`
        metadata = { newStatus, previousStatus: newStatus === "Active" ? "Inactive" : "Active" }
        break
      case "user_created":
        details = "New user account created"
        metadata = { inviteSent: Math.random() > 0.2, createdBy: users[Math.floor(Math.random() * users.length)].id }
        break
      case "user_deleted":
        details = "User account deleted"
        metadata = { deletedBy: users[Math.floor(Math.random() * users.length)].id }
        break
      case "settings_change":
        details = "User settings updated"
        metadata = {
          settings: ["notifications", "theme", "language", "timezone"].slice(0, Math.floor(Math.random() * 4) + 1),
        }
        break
      case "data_export":
        details = "User data exported"
        metadata = { format: Math.random() > 0.5 ? "CSV" : "PDF", size: `${Math.floor(Math.random() * 5) + 1}MB` }
        break
      case "api_access":
        details = "API access token generated"
        metadata = { expires: `${Math.floor(Math.random() * 30) + 1} days` }
        break
    }

    logs.push({
      id: i + 1,
      userId: user.id,
      userName: user.name,
      action,
      details,
      ipAddress: generateRandomIP(),
      timestamp: generateRandomDate(),
      metadata,
    })
  }

  // Sort logs by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Function to filter activity logs based on criteria
export function filterActivityLogs(logs: ActivityLog[], filters: any): ActivityLog[] {
  return logs.filter((log) => {
    // Filter by user ID
    if (filters.userId !== undefined && log.userId !== filters.userId) {
      return false
    }

    // Filter by action type
    if (filters.action && log.action !== filters.action) {
      return false
    }

    // Filter by date range
    if (filters.dateFrom) {
      const logDate = new Date(log.timestamp)
      const fromDate = new Date(filters.dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      if (logDate < fromDate) {
        return false
      }
    }

    if (filters.dateTo) {
      const logDate = new Date(log.timestamp)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      if (logDate > toDate) {
        return false
      }
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        log.userName.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.ipAddress.includes(query)
      )
    }

    return true
  })
}
