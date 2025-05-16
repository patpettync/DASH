"use client"

import type { ReactNode } from "react"
import { Header } from "@/components/layouts/header"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const { isDark } = useTheme()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className={cn("flex-1 w-full", isDark ? "bg-gray-900" : "bg-gray-50")}>
        <main className={cn("container-layout py-md", className)}>{children}</main>
      </div>
    </div>
  )
}
