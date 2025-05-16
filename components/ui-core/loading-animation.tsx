"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { useBrand } from "@/contexts/brand-context"
import { useTheme } from "@/contexts/theme-context"

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  duration?: number
  onAnimationComplete?: () => void
}

export function LoadingAnimation({
  size = "md",
  className,
  duration = 3000,
  onAnimationComplete,
}: LoadingAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const { logoUrl, faviconUrl } = useBrand()
  const { isDark } = useTheme()
  const svgRef = useRef<SVGSVGElement>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [logoSize, setLogoSize] = useState({ width: 0, height: 0 })
  const [logoAspectRatio, setLogoAspectRatio] = useState(1)

  // Increased size mappings
  const sizeMap = {
    sm: 40, // Increased from 24
    md: 64, // Increased from 40
    lg: 96, // Increased from 64
    xl: 128, // Increased from 96
  }

  const actualSize = sizeMap[size]

  // Get the appropriate gradient color based on theme
  const gradientColor = isDark ? "#a3a3a3" : "var(--brand-primary)"

  // Load logo dimensions when available
  useEffect(() => {
    if (logoUrl || faviconUrl) {
      const imageUrl = faviconUrl || logoUrl
      if (!imageUrl) return

      // Create a new image element to load the image and get its dimensions
      const img = new Image()

      // Set up the onload handler before setting the src
      img.onload = () => {
        // Only update state if the component is still mounted
        setLogoSize({ width: img.width, height: img.height })
        setLogoAspectRatio(img.width / Math.max(img.height, 1)) // Prevent division by zero
        setLogoLoaded(true)
      }

      // Set error handler to prevent unhandled errors
      img.onerror = () => {
        console.error("Failed to load logo image")
        // Set default values to prevent further errors
        setLogoSize({ width: actualSize, height: actualSize })
        setLogoAspectRatio(1)
        setLogoLoaded(true) // Still mark as loaded to prevent infinite loading state
      }

      // Set the src after setting up handlers
      img.src = imageUrl
    }
  }, [logoUrl, faviconUrl, actualSize])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onAnimationComplete])

  // If we have a custom logo, apply the left-to-right fade animation directly to it
  if ((logoUrl || faviconUrl) && logoLoaded) {
    const imageUrl = faviconUrl || logoUrl || ""

    // Calculate logo size to maintain aspect ratio
    let logoWidth = actualSize
    let logoHeight = actualSize / logoAspectRatio

    if (logoHeight > actualSize) {
      logoHeight = actualSize
      logoWidth = actualSize * logoAspectRatio
    }

    // Center the logo
    const logoX = (actualSize - logoWidth) / 2
    const logoY = (actualSize - logoHeight) / 2

    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className="relative" style={{ width: actualSize, height: actualSize }}>
          <svg
            ref={svgRef}
            width={actualSize}
            height={actualSize}
            viewBox={`0 0 ${actualSize} ${actualSize}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              {/* Define the linear gradient for the left-to-right fade effect */}
              <linearGradient id={`fade-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradientColor} stopOpacity="0" />
                <stop offset="50%" stopColor={gradientColor} stopOpacity="1" />
                <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
              </linearGradient>

              {/* Define the mask for the fade effect */}
              <mask id={`fade-mask-${size}`}>
                <rect
                  x="0"
                  y="0"
                  width={actualSize}
                  height={actualSize}
                  fill={`url(#fade-gradient-${size})`}
                  className="animate-left-to-right"
                />
              </mask>
            </defs>

            {/* Base logo (faded) */}
            <image
              href={imageUrl}
              x={logoX}
              y={logoY}
              width={logoWidth}
              height={logoHeight}
              preserveAspectRatio="xMidYMid meet"
              opacity="0.3"
              className="transition-opacity duration-300"
            />

            {/* Animated logo with mask */}
            <image
              href={imageUrl}
              x={logoX}
              y={logoY}
              width={logoWidth}
              height={logoHeight}
              preserveAspectRatio="xMidYMid meet"
              mask={`url(#fade-mask-${size})`}
              className="transition-all duration-300"
            />
          </svg>
        </div>
      </div>
    )
  }

  // Default SVG animation if no custom logo or logo hasn't loaded yet
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: actualSize, height: actualSize }}>
        <svg
          ref={svgRef}
          width={actualSize}
          height={actualSize}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Define the linear gradient for the left-to-right fade effect */}
            <linearGradient id={`default-fade-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColor} stopOpacity="0" />
              <stop offset="50%" stopColor={gradientColor} stopOpacity="1" />
              <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
            </linearGradient>

            {/* Define the mask for the fade effect */}
            <mask id={`default-fade-mask-${size}`}>
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                fill={`url(#default-fade-gradient-${size})`}
                className="animate-left-to-right"
              />
            </mask>
          </defs>

          {/* Base letter (faded) */}
          <text
            x="50"
            y="50"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="60"
            fontWeight="bold"
            fill={gradientColor}
            opacity="0.3"
            className="transition-all duration-300"
          >
            D
          </text>

          {/* Animated letter with mask */}
          <text
            x="50"
            y="50"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="60"
            fontWeight="bold"
            fill={gradientColor}
            mask={`url(#default-fade-mask-${size})`}
            className="transition-all duration-300"
          >
            D
          </text>
        </svg>
      </div>
    </div>
  )
}
