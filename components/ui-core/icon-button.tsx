"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 p-0 hover:bg-accent hover:text-accent-foreground",
        "overflow-visible",
        className,
      )}
      {...props}
    >
      {/* Wrap children in a relative container to ensure proper positioning */}
      <span className="relative z-10 flex items-center justify-center w-full h-full transition-transform">
        {children}
      </span>
    </button>
  )
}
