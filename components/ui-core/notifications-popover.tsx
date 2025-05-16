"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

// Mock notification data
const notifications = [
  {
    id: 1,
    title: "New Form Submission",
    message: "A new form has been submitted for your review",
    time: "10 minutes ago",
    read: false,
    module: "Forms",
  },
  {
    id: 2,
    title: "Analytics Report Ready",
    message: "Your weekly analytics report is now available",
    time: "1 hour ago",
    read: true,
    module: "Analytics",
  },
  {
    id: 3,
    title: "System Update",
    message: "System will be updated tonight at 2 AM",
    time: "3 hours ago",
    read: false,
    module: "System",
  },
]

export function NotificationsPopover() {
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-80 p-0 backdrop-blur-md",
          // Changed from blue-tinted background to proper gray scale
          isDark ? "bg-gray-900/90 border-gray-800" : "bg-white/90 border-gray-200",
        )}
        align="end"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full border-b border-gray-200 dark:border-gray-800 rounded-none bg-transparent">
            <TabsTrigger
              value="all"
              className={cn(
                "flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                activeTab === "all" ? "border-b-2 border-primary" : "",
              )}
            >
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className={cn(
                "flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                activeTab === "unread" ? "border-b-2 border-primary" : "",
              )}
            >
              Unread ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn("p-4 relative", !notification.read && "border-l-2 border-primary")}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-gray-500"
                        aria-label="Dismiss notification"
                      >
                        <span className="sr-only">Dismiss</span>
                        &times;
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">{notification.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </TabsContent>

          <TabsContent value="unread" className="max-h-[300px] overflow-y-auto">
            {unreadCount > 0 ? (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <div key={notification.id} className="p-4 relative border-l-2 border-primary">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-500"
                          aria-label="Dismiss notification"
                        >
                          <span className="sr-only">Dismiss</span>
                          &times;
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">{notification.time}</span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No unread notifications</div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-2 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" className="w-full text-sm" size="sm">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
