"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export function UserWelcomePanel() {
  const { isDark } = useTheme()
  const [greeting, setGreeting] = useState("Welcome")
  const [currentTime, setCurrentTime] = useState("")
  const [currentDate, setCurrentDate] = useState("")

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "John Doe",
    department: "Parks & Recreation",
    role: "Department Manager",
  }

  useEffect(() => {
    // Set greeting based on time of day
    const updateTimeAndGreeting = () => {
      const now = new Date()
      const hour = now.getHours()

      if (hour < 12) setGreeting("Good morning")
      else if (hour < 18) setGreeting("Good afternoon")
      else setGreeting("Good evening")

      // Format current time
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      )

      // Format current date
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: "long",
          month: "long",
          day: "numeric",
        }),
      )
    }

    updateTimeAndGreeting()
    const interval = setInterval(updateTimeAndGreeting, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      className={cn(
        "mb-lg overflow-hidden border",
        isDark ? "bg-card border-muted" : "bg-card/80 backdrop-blur-md border-muted",
      )}
    >
      <CardContent className="p-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
          <div>
            <h1 className="text-xl font-bold mb-xs">
              {greeting}, {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.department} • {user.role}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-medium text-foreground">{currentTime}</div>
            <p className="text-sm text-muted-foreground">{currentDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
