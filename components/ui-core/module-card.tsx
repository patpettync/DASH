"use client"

import type React from "react"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Module {
  id: string
  name: string
  description: string
  icon: LucideIcon
  href: string
  category: string
  adminOnly?: boolean
  comingSoon?: boolean
}

interface ModuleCardProps {
  module: Module
  isFavorite: boolean
  onToggleFavorite?: (moduleId: string, isFavorite: boolean) => void
}

export function ModuleCard({ module, isFavorite, onToggleFavorite }: ModuleCardProps) {
  const { isDark } = useTheme()
  const Icon = module.icon
  const [isHovering, setIsHovering] = useState(false)

  // Handle star click with explicit event stopping and null check
  const handleStarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the click from navigating or bubbling up
    e.preventDefault()
    e.stopPropagation()

    // Only call onToggleFavorite if it exists
    if (onToggleFavorite) {
      onToggleFavorite(module.id, !isFavorite)
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 group border h-full",
        "bg-card hover:bg-accent border-muted",
        module.comingSoon && "opacity-80",
      )}
    >
      {/* Star icon in the top-right corner - only show if onToggleFavorite exists */}
      {!module.comingSoon && onToggleFavorite && (
        <button
          type="button"
          onClick={handleStarClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="absolute top-sm right-sm z-10 p-xs focus:outline-none"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          data-testid={`favorite-button-${module.id}`}
        >
          <Star
            size={20}
            className={cn(
              "transition-all duration-300",
              isFavorite || isHovering ? "scale-110" : "scale-100",
              isFavorite ? "fill-current" : "fill-transparent",
            )}
            style={{
              color: isFavorite ? "var(--brand-primary)" : "var(--muted-foreground)",
              strokeWidth: isFavorite ? 1 : 2,
            }}
          />
        </button>
      )}

      {/* Admin badge */}
      {module.adminOnly && (
        <div className="absolute top-sm left-sm z-10">
          <span className="px-xs py-1 text-xs font-medium rounded-md bg-[var(--brand-secondary-10,rgba(var(--brand-secondary-rgb),0.1))] text-[var(--brand-secondary)]">
            Admin Only
          </span>
        </div>
      )}

      {/* Coming soon badge */}
      {module.comingSoon && (
        <div className="absolute top-sm left-sm z-10">
          <span className="px-xs py-1 text-xs font-medium rounded-md bg-warning/10 text-warning">Coming Soon</span>
        </div>
      )}

      <Link href={module.comingSoon ? "#" : module.href} className="block h-full">
        <CardContent className="p-md flex flex-col items-center text-center h-full">
          {/* Icon without circular background */}
          <Icon className="h-10 w-10 mb-sm text-muted-foreground" />

          <h3 className="text-lg font-semibold mb-xs text-foreground">{module.name}</h3>

          <p className="text-sm text-muted-foreground">{module.description}</p>
        </CardContent>
      </Link>
    </Card>
  )
}
