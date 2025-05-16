import { cn } from "@/lib/utils"
import Image from "next/image"
import { useBrand } from "@/contexts/brand-context"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "light"
  iconOnly?: boolean
}

export function Logo({ className, size = "md", variant = "default", iconOnly = false }: LogoProps) {
  const { logoUrl, faviconUrl } = useBrand()

  // Size mappings for the logo
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
    xl: "h-16",
  }

  // Width calculations for aspect ratio
  const widthClasses = {
    sm: iconOnly ? "w-6" : "w-auto",
    md: iconOnly ? "w-8" : "w-auto",
    lg: iconOnly ? "w-10" : "w-auto",
    xl: iconOnly ? "w-16" : "w-auto",
  }

  // Fallback logo if no custom logo is uploaded
  const renderFallbackLogo = () => {
    return (
      <div className={cn("flex items-center gap-xs", className)}>
        <div className={cn("relative", sizeClasses[size], widthClasses[size])}>
          <div
            className={cn(
              "absolute inset-0 rounded-md bg-gradient-to-br",
              variant === "default"
                ? "from-[var(--brand-primary)] to-[var(--brand-primary-hover,var(--brand-primary))]"
                : "from-background to-muted",
            )}
          />
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center font-bold",
              variant === "default" ? "text-[var(--brand-primary-foreground)]" : "text-foreground",
            )}
          >
            D
          </div>
        </div>
        {!iconOnly && (
          <span
            className={cn(
              "font-bold tracking-tight",
              {
                "text-sm": size === "sm",
                "text-base": size === "md",
                "text-lg": size === "lg",
                "text-xl": size === "xl",
              },
              variant === "default" ? "text-foreground" : "text-background",
            )}
          >
            DASH
          </span>
        )}
      </div>
    )
  }

  // If no custom logo is uploaded, use the fallback
  if (!logoUrl && !faviconUrl) {
    return renderFallbackLogo()
  }

  // Use the uploaded logo or favicon
  const imageUrl = iconOnly ? faviconUrl || logoUrl : logoUrl

  if (!imageUrl) {
    return renderFallbackLogo()
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn(sizeClasses[size], widthClasses[size], "relative")}>
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="DASH Logo"
          className="h-full w-auto object-contain"
          width={iconOnly ? 40 : 120}
          height={iconOnly ? 40 : 40}
          priority
        />
      </div>
      {!iconOnly && !logoUrl && (
        <span
          className={cn(
            "ml-xs font-bold tracking-tight",
            {
              "text-sm": size === "sm",
              "text-base": size === "md",
              "text-lg": size === "lg",
              "text-xl": size === "xl",
            },
            variant === "default" ? "text-foreground" : "text-background",
          )}
        >
          DASH
        </span>
      )}
    </div>
  )
}
