"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { Badge } from "@/components/ui/badge"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    title: "Form Submission",
    message: "New form submission received for Public Records Request",
    time: "10 minutes ago",
    read: false,
    module: "forms",
  },
  {
    id: "2",
    title: "Approval Required",
    message: "Your approval is needed for a new workflow request",
    time: "1 hour ago",
    read: false,
    module: "workflows",
  },
  {
    id: "3",
    title: "System Update",
    message: "DASH will be updated to version 2.1.0 tonight at 2 AM",
    time: "3 hours ago",
    read: true,
    module: "system",
  },
]

export function NotificationsDropdown() {
  const { isDark } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const viewAllNotifications = () => {
    console.log("View all notifications")
    closeDropdown()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full transition-colors relative",
          "hover:bg-accent",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-5 w-5 text-foreground" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center px-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeDropdown} aria-hidden="true" />
          <div className="absolute right-0 mt-xs w-80 rounded-md shadow-lg z-20 overflow-hidden bg-background border border-border">
            <div className="p-sm border-b border-border">
              <h3 className="font-medium text-foreground">Notifications</h3>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={cn("p-sm relative", !notification.read && "bg-accent/50")}>
                      <div className="pr-6">
                        <h4 className="font-medium text-sm text-foreground">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-xs">{notification.message}</p>
                        <p className="text-xs text-muted-foreground/70 mt-xs">{notification.time}</p>
                      </div>
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="absolute top-sm right-sm p-xxs rounded-md hover:bg-accent text-muted-foreground"
                        aria-label="Dismiss notification"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-sm text-center text-muted-foreground">
                  <p>No notifications</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-xs border-t border-border">
                <button
                  onClick={viewAllNotifications}
                  className="w-full py-xs px-sm text-sm text-center rounded-md hover:bg-accent text-[var(--brand-primary)]"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
