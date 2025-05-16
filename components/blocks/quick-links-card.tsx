import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

interface QuickLinksCardProps {
  className?: string
}

export function QuickLinksCard({ className }: QuickLinksCardProps) {
  const links = [
    {
      title: "Modules",
      description: "Access all application modules",
      href: "/dashboard/modules",
    },
    {
      title: "Settings",
      description: "Configure your preferences",
      href: "/dashboard/settings",
    },
    {
      title: "Profile",
      description: "Update your information",
      href: "/dashboard/profile",
    },
  ]

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <CardTitle>Quick Links</CardTitle>
        <CardDescription>Frequently used pages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="flex items-center justify-between p-3 rounded-md hover:bg-slate-100 transition-colors"
            >
              <div>
                <div className="font-medium">{link.title}</div>
                <div className="text-xs text-muted-foreground">{link.description}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
