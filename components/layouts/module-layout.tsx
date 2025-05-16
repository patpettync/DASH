"use client"

import type { ReactNode } from "react"
import { Header } from "@/components/layouts/header"
import { type TabItem, ModuleTabs } from "./module-tabs"
import { NotificationsModalProvider } from "@/components/ui-core/notifications-modal"
import { PageTransition } from "@/components/ui-core/page-transition"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface ModuleLayoutProps {
  children: ReactNode
  moduleName: string
  tabs?: TabItem[]
  basePath?: string
  activeTab?: string
}

export function ModuleLayout({ children, moduleName, tabs = [], basePath = "", activeTab = "" }: ModuleLayoutProps) {
  const { isDark } = useTheme()

  return (
    <NotificationsModalProvider>
      <div className="flex flex-col h-screen">
        <Header />

        {tabs.length > 0 && <ModuleTabs tabs={tabs} basePath={basePath} />}

        <main className={cn("flex-1 overflow-y-auto p-6", isDark ? "bg-[#121212]" : "bg-slate-50")}>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </NotificationsModalProvider>
  )
}
