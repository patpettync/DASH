"use client"

import type { ReactNode } from "react"
import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NotificationsDropdown } from "@/components/ui-core/notifications-dropdown"
import { UserProfileDropdown } from "@/components/ui-core/user-profile-dropdown"
import { NotificationsModalProvider } from "@/components/ui-core/notifications-modal"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface DashboardLayoutProps {
  children: ReactNode
  breadcrumbs?: { title: string; href: string; active?: boolean }[]
}

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  isAdmin: true,
}

export function DashboardLayout({ children, breadcrumbs = [] }: DashboardLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { isDark } = useTheme()

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <NotificationsModalProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <header
          className={cn(
            "flex items-center h-md border-b shadow-sm transition-colors duration-300",
            isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          <div className="container-layout flex items-center w-full">
            {/* Breadcrumb Navigation */}
            <div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className={cn(
                        "font-medium",
                        isDark ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-gray-900",
                      )}
                    >
                      DASH
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((crumb, index) => (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbSeparator className={isDark ? "text-gray-500" : ""} />
                      {crumb.active ? (
                        <span className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>
                          {crumb.title}
                        </span>
                      ) : (
                        <BreadcrumbLink href={crumb.href} className={isDark ? "text-gray-300 hover:text-white" : ""}>
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* User Actions - Moved to top right */}
            <div className="ml-auto flex items-center space-x-xs">
              <NotificationsDropdown />
              <UserProfileDropdown user={mockUser} />
            </div>
          </div>
        </header>

        {/* Page Content - Background moved to wrapper, content container only controls layout */}
        <div className={cn("flex-1 w-full", isDark ? "bg-gray-900" : "bg-gray-50")}>
          <main className={cn("container-layout py-md overflow-y-auto", isDark ? "text-gray-100" : "text-gray-900")}>
            {children}
          </main>
        </div>
      </div>
    </NotificationsModalProvider>
  )
}
