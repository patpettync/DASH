"use client"
import { usePathname, useRouter } from "next/navigation"
import { NotificationsDropdown } from "@/components/ui-core/notifications-dropdown"
import { UserProfileDropdown } from "@/components/ui-core/user-profile-dropdown"
import { HeaderIcon } from "@/components/ui-core/header-icon"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { LayoutGrid } from "lucide-react"

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  isAdmin: true,
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark } = useTheme()

  // Determine current module name based on path
  const getCurrentModuleName = () => {
    // Root path shows "DASH"
    if (pathname === "/" || pathname === "/dashboard") {
      return "DASH"
    }

    // Extract module name from path
    const pathSegments = pathname.split("/").filter(Boolean)
    if (pathSegments.length > 0) {
      // Special handling for settings subpages
      if (pathSegments[0] === "settings") {
        if (pathSegments.length > 1) {
          // Convert kebab-case to Title Case (e.g., "user-management" -> "User Management")
          const subpage = pathSegments[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
          return subpage
        }
        return "Settings"
      }

      // Convert first path segment to title case (e.g., "forms" -> "Forms")
      const moduleName = pathSegments[0]
      return moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
    }

    return "DASH"
  }

  return (
    <header
      className={cn(
        "flex items-center h-md px-sm border-b",
        isDark ? "bg-background border-muted" : "bg-background border-muted",
      )}
    >
      {/* Left: Grid Icon and Title */}
      <div className="flex items-center">
        <HeaderIcon
          onClick={() => router.push("/dashboard")}
          aria-label="Navigate to dashboard"
          data-testid="grid-button"
        >
          <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        </HeaderIcon>
        <h1 className="ml-sm text-lg font-semibold text-foreground">{getCurrentModuleName()}</h1>
      </div>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right: User Actions */}
      <div className="flex items-center h-md">
        <NotificationsDropdown />
        <UserProfileDropdown user={mockUser} />
      </div>
    </header>
  )
}
