"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [isPopoutOpen, setIsPopoutOpen] = React.useState(false)
  const popoutRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Close popout when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsPopoutOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative flex items-center w-full">
      <input
        type={type || "search"}
        className={cn(
          "flex h-sm w-full rounded-md border border-input bg-background px-3 py-xs text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
          className,
        )}
        ref={ref}
        {...props}
      />
      <button
        ref={buttonRef}
        type="button"
        className="absolute right-0 h-sm w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setIsPopoutOpen((prev) => !prev)}
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-search"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {isPopoutOpen && (
        <div
          ref={popoutRef}
          className="absolute top-full right-0 mt-xs w-64 bg-background border border-input rounded-md shadow-md z-50 p-sm animate-in fade-in slide-in-from-top-5"
        >
          <div className="font-medium mb-xs">Quick Search</div>
          <div className="text-sm text-muted-foreground mb-sm">Search for users, settings, or help articles</div>
          <div className="space-y-xs">
            <div className="text-xs font-medium text-muted-foreground mb-xs">RECENT SEARCHES</div>
            <div className="cursor-pointer hover:bg-muted p-xs rounded-md text-sm">User management</div>
            <div className="cursor-pointer hover:bg-muted p-xs rounded-md text-sm">Dashboard settings</div>
            <div className="cursor-pointer hover:bg-muted p-xs rounded-md text-sm">Form responses</div>
          </div>
        </div>
      )}
    </div>
  )
})
Input.displayName = "Input"

export { Input }
