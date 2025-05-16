"use client"

import type React from "react"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, Film, ImageIcon, Mail, Star, X, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock notification data
const initialNotifications = [
  {
    id: 1,
    category: "MOVIES",
    title: "Book Now!",
    description: "Book tickets for your favorite show today",
    date: "24 Jul",
    read: false,
    icon: "film",
  },
  {
    id: 2,
    category: "MENU",
    title: "Photography Mail",
    description: "Hey, please find all the images for review",
    date: "24 Jul",
    read: false,
    icon: "mail",
  },
  {
    id: 3,
    category: "SHAZANIA",
    title: "Lasagna Dinner",
    description: "Come over for dinner! You guys are invited",
    date: "24 Jul",
    read: true,
    icon: "calendar",
  },
  {
    id: 4,
    category: "REINS",
    title: "No Subject!",
    description: "No netflix, no chill",
    date: "24 Jul",
    read: true,
    icon: "star",
  },
  {
    id: 5,
    category: "PROCTECTIFY",
    title: "Security Alert",
    description: "Your account password was changed",
    date: "24 Jul",
    read: true,
    icon: "bell",
  },
  {
    id: 6,
    category: "MOVIES",
    title: "New Release",
    description: "Check out the latest movies in theaters",
    date: "23 Jul",
    read: true,
    icon: "film",
  },
  {
    id: 7,
    category: "MENU",
    title: "Design Updates",
    description: "The new design assets are ready for review",
    date: "22 Jul",
    read: true,
    icon: "image",
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter((n) => !n.read).length
  const readCount = notifications.filter((n) => n.read).length

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : activeTab === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.read)

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      film: <Film className="h-5 w-5" />,
      mail: <Mail className="h-5 w-5" />,
      calendar: <Calendar className="h-5 w-5" />,
      star: <Star className="h-5 w-5" />,
      bell: <Bell className="h-5 w-5" />,
      image: <ImageIcon className="h-5 w-5" />,
    }
    return iconMap[iconName] || <Bell className="h-5 w-5" />
  }

  // Get background color based on category
  const getCategoryColor = (category: string): string => {
    const colorMap: Record<string, string> = {
      MOVIES: "bg-blue-500",
      MENU: "bg-amber-500",
      SHAZANIA: "bg-green-500",
      REINS: "bg-red-500",
      PROCTECTIFY: "bg-purple-500",
    }
    return colorMap[category] || "bg-slate-500"
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbLink href="/dashboard/notifications" className="font-medium">
                Notifications
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Manage your notifications and alerts.</p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Your Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead} className="h-8">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark all as read
                  </Button>
                )}
              </div>
              <CardDescription>
                You have {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">
                    All
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                      {notifications.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">
                      {unreadCount}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="read">
                    Read
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{readCount}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="m-0">
                  <NotificationsList
                    notifications={filteredNotifications}
                    markAsRead={markAsRead}
                    deleteNotification={deleteNotification}
                    getIconComponent={getIconComponent}
                    getCategoryColor={getCategoryColor}
                  />
                </TabsContent>
                <TabsContent value="unread" className="m-0">
                  <NotificationsList
                    notifications={filteredNotifications}
                    markAsRead={markAsRead}
                    deleteNotification={deleteNotification}
                    getIconComponent={getIconComponent}
                    getCategoryColor={getCategoryColor}
                  />
                </TabsContent>
                <TabsContent value="read" className="m-0">
                  <NotificationsList
                    notifications={filteredNotifications}
                    markAsRead={markAsRead}
                    deleteNotification={deleteNotification}
                    getIconComponent={getIconComponent}
                    getCategoryColor={getCategoryColor}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

interface NotificationsListProps {
  notifications: any[]
  markAsRead: (id: number) => void
  deleteNotification: (id: number) => void
  getIconComponent: (iconName: string) => React.ReactNode
  getCategoryColor: (category: string) => string
}

function NotificationsList({
  notifications,
  markAsRead,
  deleteNotification,
  getIconComponent,
  getCategoryColor,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-medium">No notifications</h3>
        <p className="mt-1 text-sm text-slate-500">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="divide-y border rounded-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn("p-4 hover:bg-slate-50 transition-colors relative", !notification.read && "bg-blue-50")}
        >
          <div className="flex gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-white",
                getCategoryColor(notification.category),
              )}
            >
              {getIconComponent(notification.icon)}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-slate-500">{notification.category}</p>
                <p className="text-xs text-slate-400 absolute right-12 top-4">{notification.date}</p>
              </div>
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{notification.description}</p>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium mt-1"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteNotification(notification.id)}
              className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
