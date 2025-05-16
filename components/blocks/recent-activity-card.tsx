import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/ui-core/status-badge"

interface RecentActivityCardProps {
  className?: string
}

export function RecentActivityCard({ className }: RecentActivityCardProps) {
  const activities = [
    { id: 1, title: "Logged in", time: "Just now", status: "success" as const },
    { id: 2, title: "Updated profile", time: "Yesterday", status: "info" as const },
    { id: 3, title: "Completed task", time: "2 days ago", status: "success" as const },
  ]

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm text-slate-600">{activity.id}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <StatusBadge status={activity.status} label={activity.status} className="ml-2" />
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
