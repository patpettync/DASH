"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Settings, HelpCircle, LogOut, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface UserProfileDropdownProps {
  user: {
    name: string
    email: string
    isAdmin: boolean
  }
}

export function UserProfileDropdown({ user }: UserProfileDropdownProps) {
  const router = useRouter()
  const { isDark, toggleTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // Get user initials for avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const closeDropdown = () => setIsOpen(false)

  const handleNavigation = (path: string) => {
    router.push(path)
    closeDropdown()
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={cn(
          "flex items-center px-2 py-1 rounded-full transition-colors",
          isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        <div
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
            isDark ? "bg-gray-700" : "bg-gray-200",
          )}
        >
          {initials}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={closeDropdown} aria-hidden="true" />
          <div
            className={cn(
              "absolute right-0 mt-1 w-56 rounded-md shadow-lg z-20 overflow-hidden",
              isDark ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200",
            )}
          >
            <div className="p-2">
              <div className={cn("px-3 py-2 rounded-md", isDark ? "bg-gray-800/50" : "bg-gray-50")}>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="border-t py-1 px-2">
              <button
                onClick={() => handleNavigation("/dashboard/profile")}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => handleNavigation("/settings")}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => handleNavigation("/help")}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </button>
            </div>

            <div className="border-t py-1 px-2">
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                {isDark ? (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  // In a real app, this would call your logout function
                  console.log("Logging out...")
                  closeDropdown()
                }}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-md",
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
