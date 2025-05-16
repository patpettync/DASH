import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Calendar, Mail } from "lucide-react"

interface UserProfileHeaderProps {
  user: {
    name: string
    email: string
    authType: string
    lastLogin: string
  }
  className?: string
}

export function UserProfileHeader({ user, className }: UserProfileHeaderProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-md">
        <div className="flex flex-col items-start gap-sm">
          <div className="w-full space-y-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-xs">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge
                variant={user.authType === "office365" ? "secondary" : "outline"}
                className="self-start sm:self-auto"
              >
                {user.authType === "office365" ? "Office 365 Account" : "Local Account"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-sm text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Last login: {new Date(user.lastLogin).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
