import type React from "react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui-core/logo"

interface AuthLayoutProps {
  className?: string
  children: React.ReactNode
}

export function AuthLayout({ className, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border py-4">
        <div className="container flex justify-center">
          <Logo size="md" />
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className={cn("w-full max-w-md", className)}>{children}</div>
      </main>
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <div className="container">&copy; {new Date().getFullYear()} DASH Platform. All rights reserved.</div>
      </footer>
    </div>
  )
}
