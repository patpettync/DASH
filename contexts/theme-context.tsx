"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  isDark: boolean
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isDark = theme === "dark"

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      setThemeState(storedTheme)
    }
  }, [])

  // Update document class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement

    // Set transitioning state
    setIsTransitioning(true)

    // Remove the old theme class and add the new one
    root.classList.remove("light", "dark")
    root.classList.add(theme)

    // Store the theme preference in localStorage
    localStorage.setItem("theme", theme)

    // Clear transitioning state after transition completes
    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Match this with the CSS transition duration

    return () => clearTimeout(transitionTimeout)
  }, [theme])

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  // Set theme with a controlled function
  const setTheme = (newTheme: Theme) => {
    if (newTheme !== theme) {
      setThemeState(newTheme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isDark, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Add a new function to get theme-aware colors
export function getThemeColors(isDark: boolean) {
  return {
    primary: isDark ? "#9ca3af" : "#3b82f6", // Gray-400 in dark mode, blue-500 in light mode
    secondary: isDark ? "#6b7280" : "#6366f1", // Gray-500 in dark mode, indigo-500 in light mode
    accent: isDark ? "#d1d5db" : "#8b5cf6", // Gray-300 in dark mode, violet-500 in light mode
    background: isDark ? "#1f2937" : "#ffffff", // Gray-800 in dark mode, white in light mode
    text: isDark ? "#f9fafb" : "#111827", // Gray-50 in dark mode, gray-900 in light mode
    border: isDark ? "#374151" : "#e5e7eb", // Gray-700 in dark mode, gray-200 in light mode
  }
}
