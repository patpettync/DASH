import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OrganizationalInfoCardProps {
  user: {
    department: string
    position: string
    role: string
    authType: string
  }
  className?: string
}

export function OrganizationalInfoCard({ user, className }: OrganizationalInfoCardProps) {
  const isOffice365User = user.authType === "office365"

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>Organizational Information</CardTitle>
        <CardDescription>
          Your role and position within the organization.
          {isOffice365User && (
            <span className="block mt-xs text-xs">This information is synchronized with your Office 365 account.</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-sm">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Department</label>
            {isOffice365User && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Managed by Office 365</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div
            className={cn(
              "flex h-sm w-full rounded-md border border-input px-3 py-xs text-sm",
              "bg-muted text-muted-foreground",
            )}
          >
            {user.department}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Position</label>
            {isOffice365User && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Managed by Office 365</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div
            className={cn(
              "flex h-sm w-full rounded-md border border-input px-3 py-xs text-sm",
              "bg-muted text-muted-foreground",
            )}
          >
            {user.position}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Role</label>
            {isOffice365User && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <LockIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Managed by Office 365</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div
            className={cn(
              "flex h-sm w-full rounded-md border border-input px-3 py-xs text-sm",
              "bg-muted text-muted-foreground",
            )}
          >
            {user.role}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
