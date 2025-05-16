import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface User {
  name: string
  email: string
  department: string
  position: string
}

interface UserProfileCardProps {
  user: User
  className?: string
}

export function UserProfileCard({ user, className }: UserProfileCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium">Department:</div>
              <div className="text-sm">{user.department}</div>
            </div>

            <div>
              <div className="text-sm font-medium">Position:</div>
              <div className="text-sm">{user.position}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
