"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useTheme } from "./theme-context"

interface BrandColors {
  primary: string
  secondary: string
  accent: string
  success: string
  warning: string
  error: string
  info: string
}

interface BrandContextType {
  colors: BrandColors
  logoUrl?: string
  faviconUrl?: string
  updateColors: (colors: Partial<BrandColors>) => void
  updateLogo: (url: string) => void
  updateFavicon: (url: string) => void
  resetColors: () => void
}

// Default brand colors
const defaultColors: BrandColors = {
  primary: "#6837F1", // indigo-600
  secondary: "#3A86FF", // blue-500
  accent: "#8b5cf6", // violet-500
  success: "#10b981", // emerald-500
  warning: "#f59e0b", // amber-500
  error: "#ef4444", // red-500
  info: "#3b82f6", // blue-500
}

// Local storage keys
const STORAGE_KEY_COLORS = "dash-brand-colors"
const STORAGE_KEY_LOGO = "dash-brand-logo"
const STORAGE_KEY_FAVICON = "dash-brand-favicon"

// Helper function to apply colors to CSS variables
const applyColorsToCssVariables = (colors: BrandColors) => {
  // Apply primary color and its variants
  document.documentElement.style.setProperty("--brand-primary", colors.primary)
  document.documentElement.style.setProperty("--brand-primary-foreground", "#ffffff") // White text on brand colors
  document.documentElement.style.setProperty("--brand-primary-10", `${colors.primary}1a`) // 10% opacity
  document.documentElement.style.setProperty("--brand-primary-20", `${colors.primary}33`) // 20% opacity
  document.documentElement.style.setProperty("--brand-primary-50", `${colors.primary}80`) // 50% opacity

  // Apply secondary color and its variants
  document.documentElement.style.setProperty("--brand-secondary", colors.secondary)
  document.documentElement.style.setProperty("--brand-secondary-foreground", "#ffffff") // White text on brand colors
  document.documentElement.style.setProperty("--brand-secondary-10", `${colors.secondary}1a`) // 10% opacity
  document.documentElement.style.setProperty("--brand-secondary-20", `${colors.secondary}33`) // 20% opacity
  document.documentElement.style.setProperty("--brand-secondary-50", `${colors.secondary}80`) // 50% opacity

  // Apply other colors if needed
  document.documentElement.style.setProperty("--brand-accent", colors.accent)
  document.documentElement.style.setProperty("--brand-success", colors.success)
  document.documentElement.style.setProperty("--brand-warning", colors.warning)
  document.documentElement.style.setProperty("--brand-error", colors.error)
  document.documentElement.style.setProperty("--brand-info", colors.info)
}

// Helper function to get stored colors from localStorage
const getStoredColors = (): Partial<BrandColors> | null => {
  if (typeof window === "undefined") return null

  try {
    const storedColors = localStorage.getItem(STORAGE_KEY_COLORS)
    return storedColors ? JSON.parse(storedColors) : null
  } catch (error) {
    console.error("Error reading brand colors from localStorage:", error)
    return null
  }
}

// Helper function to store colors in localStorage
const storeColors = (colors: BrandColors) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY_COLORS, JSON.stringify(colors))
  } catch (error) {
    console.error("Error storing brand colors in localStorage:", error)
  }
}

// Helper functions for logo and favicon
const getStoredLogo = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY_LOGO)
}

const getStoredFavicon = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY_FAVICON)
}

const storeLogo = (url: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_LOGO, url)
}

const storeFavicon = (url: string) => {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY_FAVICON, url)
}

const BrandContext = createContext<BrandContextType | undefined>(undefined)

export function BrandProvider({ children }: { children: ReactNode }) {
  const { isDark } = useTheme()
  const [colors, setColorsState] = useState<BrandColors>(defaultColors)
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined)
  const [faviconUrl, setFaviconUrl] = useState<string | undefined>(undefined)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage and apply theme
  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return

    // Get stored values
    const storedColors = getStoredColors()
    const storedLogo = getStoredLogo()
    const storedFavicon = getStoredFavicon()

    // Merge stored colors with defaults
    const mergedColors = storedColors ? { ...defaultColors, ...storedColors } : defaultColors

    // Update state
    setColorsState(mergedColors)
    if (storedLogo) setLogoUrl(storedLogo)
    if (storedFavicon) setFaviconUrl(storedFavicon)

    // Apply colors to CSS variables
    applyColorsToCssVariables(mergedColors)

    // Mark as initialized
    setIsInitialized(true)
  }, [])

  // Apply CSS variables whenever colors change
  useEffect(() => {
    if (!isInitialized) return
    applyColorsToCssVariables(colors)
  }, [colors, isInitialized])

  // Function to update colors
  const updateColors = (newColors: Partial<BrandColors>) => {
    setColorsState((prevColors) => {
      const updatedColors = { ...prevColors, ...newColors }

      // Store in localStorage
      storeColors(updatedColors)

      // Apply to CSS variables
      applyColorsToCssVariables(updatedColors)

      return updatedColors
    })
  }

  // Function to reset colors to defaults
  const resetColors = () => {
    // Clear stored colors
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_COLORS)
    }

    // Update state
    setColorsState(defaultColors)

    // Apply to CSS variables
    applyColorsToCssVariables(defaultColors)
  }

  // Function to update logo
  const updateLogo = (url: string) => {
    setLogoUrl(url)
    storeLogo(url)
  }

  // Function to update favicon
  const updateFavicon = (url: string) => {
    setFaviconUrl(url)
    storeFavicon(url)
  }

  return (
    <BrandContext.Provider
      value={{
        colors,
        logoUrl,
        faviconUrl,
        updateColors,
        updateLogo,
        updateFavicon,
        resetColors,
      }}
    >
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (context === undefined) {
    throw new Error("useBrand must be used within a BrandProvider")
  }
  return context
}
