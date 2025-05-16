"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui-core/toast"
import { ConfirmationModal } from "@/components/ui-core/modal"
import { KeyRound, LogOut } from "lucide-react"

interface SecurityActionsCardProps {
  user: {
    authType: string
  }
  className?: string
}

export function SecurityActionsCard({ user, className }: SecurityActionsCardProps) {
  const { toast } = useToast()
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isLogoutAllModalOpen, setIsLogoutAllModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isLocalUser = user.authType === "local"

  const handleChangePassword = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsChangePasswordModalOpen(false)
      toast.addToast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
        variant: "success",
      })
    }, 1000)
  }

  const handleLogoutAllSessions = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsLogoutAllModalOpen(false)
      toast.addToast({
        title: "All sessions terminated",
        description: "You have been logged out from all devices except this one.",
        variant: "success",
      })
    }, 1000)
  }

  return (
    <>
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLocalUser && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsChangePasswordModalOpen(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setIsLogoutAllModalOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out All Other Sessions
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Confirmation Modal */}
      <ConfirmationModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        title="Change Password"
        description="We'll send you an email with instructions to change your password. Continue?"
        onConfirm={handleChangePassword}
        confirmText={isLoading ? "Sending..." : "Send Reset Email"}
        cancelText="Cancel"
        variant="default"
      />

      {/* Logout All Sessions Confirmation Modal */}
      <ConfirmationModal
        isOpen={isLogoutAllModalOpen}
        onClose={() => setIsLogoutAllModalOpen(false)}
        title="Log Out All Sessions"
        description="This will terminate all active sessions except the current one. You will be logged out from all other devices. Continue?"
        onConfirm={handleLogoutAllSessions}
        confirmText={isLoading ? "Processing..." : "Log Out All Sessions"}
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}
