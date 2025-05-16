"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { UserProfileHeader } from "@/components/blocks/user-profile-header"
import { PersonalInfoCard } from "@/components/blocks/personal-info-card"
import { OrganizationalInfoCard } from "@/components/blocks/organizational-info-card"
import { SecurityActionsCard } from "@/components/blocks/security-actions-card"
import { ProfileSkeleton } from "@/components/ui-core/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  id: "user-123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  department: "Engineering",
  position: "Senior Developer",
  role: "Developer",
  authType: "office365", // or "local"
  createdAt: "2022-01-15T00:00:00Z",
  lastLogin: "2023-05-10T14:30:00Z",
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(mockUser)

  // Simulate loading state
  useState(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  // Define breadcrumbs for the profile page
  const breadcrumbs = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Profile", href: "/dashboard/profile", active: true },
  ]

  // Update user data handler
  const handleUpdateUser = (updatedData: Partial<typeof user>) => {
    setUser({ ...user, ...updatedData })
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
              <BreadcrumbLink href="/dashboard/profile" className="font-medium">
                Profile
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">Manage your account information and settings.</p>
          </div>

          {isLoading ? (
            <ProfileSkeleton />
          ) : (
            <div className="space-y-6">
              <UserProfileHeader user={user} />

              <div className="grid gap-6 md:grid-cols-2">
                <PersonalInfoCard user={user} onUpdateUser={handleUpdateUser} />
                <div className="space-y-6">
                  <OrganizationalInfoCard user={user} />
                  <SecurityActionsCard user={user} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
