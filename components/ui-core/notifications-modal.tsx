"use client"

import type React from "react"

import { useState, createContext, useContext } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Bell, X, FileText, BarChart2, FileQuestion, Settings, Database, Layers, GitBranch } from "lucide-react"

// Mock notification data with module sources
const mockNotifications = {
  all: [
    {
      id: 1,
      module: "Forms",
      title: "New Form Submission",
      description: "A new response was submitted to Customer Feedback",
      date: "24 Jul",
      read: false,
    },
    {
      id: 2,
      module: "Analytics",
      title: "Weekly Report Ready",
      description: "Your weekly analytics report is now available",
      date: "24 Jul",
      read: false,
    },
    {
      id: 3,
      module: "PIR",
      title: "Request Update",
      description: "Public information request #2023-45 was updated",
      date: "24 Jul",
      read: true,
    },
    {
      id: 8,
      module: "Forms",
      title: "Form Published",
      description: "Your draft form has been published successfully",
      date: "23 Jul",
      read: true,
    },
    {
      id: 9,
      module: "Analytics",
      title: "Dashboard Shared",
      description: "John Smith shared a dashboard with you",
      date: "22 Jul",
      read: true,
    },
  ],
  approvals: [
    {
      id: 4,
      module: "Workflows",
      title: "Expense Approval",
      description: "Your expense report needs approval",
      date: "23 Jul",
      read: false,
    },
    {
      id: 5,
      module: "Projects",
      title: "Leave Request",
      description: "John Doe requested time off",
      date: "22 Jul",
      read: true,
    },
    {
      id: 10,
      module: "Workflows",
      title: "Travel Request",
      description: "Your travel request is pending approval",
      date: "21 Jul",
      read: true,
    },
  ],
}

// Create context for the notifications modal
type NotificationsModalContextType = {
  isOpen: boolean
  openNotificationsModal: () => void
  closeNotificationsModal: () => void
}

const NotificationsModalContext = createContext<NotificationsModalContextType>({
  isOpen: false,
  openNotificationsModal: () => {},
  closeNotificationsModal: () => {},
})

export const useNotificationsModal = () => useContext(NotificationsModalContext)

export function NotificationsModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openNotificationsModal = () => setIsOpen(true)
  const closeNotificationsModal = () => setIsOpen(false)

  return (
    <NotificationsModalContext.Provider value={{ isOpen, openNotificationsModal, closeNotificationsModal }}>
      {children}
      <NotificationsModal />
    </NotificationsModalContext.Provider>
  )
}

function NotificationsModal() {
  const { isOpen, closeNotificationsModal } = useNotificationsModal()
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAllAsRead = (tab: string) => {
    setNotifications((prev) => ({
      ...prev,
      [tab]: prev[tab as keyof typeof prev].map((n) => ({ ...n, read: true })),
    }))
  }

  const dismissNotification = (tab: string, id: number) => {
    setNotifications((prev) => ({
      ...prev,
      [tab]: prev[tab as keyof typeof prev].filter((n) => n.id !== id),
    }))
  }

  // Get module-specific icon
  const getModuleIcon = (module: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Forms: <FileText className="h-5 w-5" />,
      Analytics: <BarChart2 className="h-5 w-5" />,
      PIR: <FileQuestion className="h-5 w-5" />,
      "System Settings": <Settings className="h-5 w-5" />,
      Integrations: <Database className="h-5 w-5" />,
      Projects: <Layers className="h-5 w-5" />,
      Workflows: <GitBranch className="h-5 w-5" />,
    }
    return iconMap[module] || <Bell className="h-5 w-5" />
  }

  // Get module-specific color
  const getModuleColor = (module: string): string => {
    const colorMap: Record<string, string> = {
      Forms: "bg-[var(--brand-primary)]",
      Analytics: "bg-amber-500 dark:bg-amber-600",
      PIR: "bg-green-500 dark:bg-green-600",
      "System Settings": "bg-purple-500 dark:bg-purple-600",
      Integrations: "bg-indigo-500 dark:bg-indigo-600",
      Projects: "bg-teal-500 dark:bg-teal-600",
      Workflows: "bg-rose-500 dark:bg-rose-600",
    }
    return colorMap[module] || "bg-muted"
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeNotificationsModal}>
      <DialogContent className="sm:max-w-[600px] p-0 backdrop-blur-sm bg-background/90">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>All Notifications</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between px-6 py-2">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="approvals">Approvals</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" onClick={() => markAllAsRead(activeTab)} className="text-xs h-7">
              Mark all as read
            </Button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
            <TabsContent value="all" className="m-0">
              <NotificationsList
                notifications={notifications.all}
                tab="all"
                dismissNotification={dismissNotification}
                getModuleIcon={getModuleIcon}
                getModuleColor={getModuleColor}
              />
            </TabsContent>
            <TabsContent value="approvals" className="m-0">
              <NotificationsList
                notifications={notifications.approvals}
                tab="approvals"
                dismissNotification={dismissNotification}
                getModuleIcon={getModuleIcon}
                getModuleColor={getModuleColor}
              />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

interface NotificationsListProps {
  notifications: any[]
  tab: string
  dismissNotification: (tab: string, id: number) => void
  getModuleIcon: (module: string) => React.ReactNode
  getModuleColor: (module: string) => string
}

function NotificationsList({
  notifications,
  tab,
  dismissNotification,
  getModuleIcon,
  getModuleColor,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">No notifications</h3>
        <p className="mt-1 text-sm text-muted-foreground">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "p-3 rounded-lg border hover:bg-accent/70 transition-colors relative",
            !notification.read &&
              "bg-[var(--brand-primary-10,rgba(var(--brand-primary-rgb),0.1))] border-[var(--brand-primary-20,rgba(var(--brand-primary-rgb),0.2))]",
            notification.read && "border-transparent dark:border-muted",
          )}
        >
          <div className="flex gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-white",
                getModuleColor(notification.module),
              )}
            >
              {getModuleIcon(notification.module)}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-muted-foreground">{notification.module}</p>
                <p className="text-xs text-muted-foreground absolute right-10 top-4">{notification.date}</p>
              </div>
              <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
            </div>
          </div>
          <button
            onClick={() => dismissNotification(tab, notification.id)}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      ))}
    </div>
  )
}
