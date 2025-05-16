"use client"

import { useBrand } from "@/contexts/brand-context"
import { useTheme } from "@/contexts/theme-context"

// This hook provides easy access to brand colors with theme awareness
export function useBrandColors() {
  const { colors } = useBrand()
  const { isDark } = useTheme()

  // Return an object with all the brand colors
  return {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    // Add alpha variants
    primaryAlpha: {
      10: `${colors.primary}1a`, // 10% opacity
      20: `${colors.primary}33`, // 20% opacity
      50: `${colors.primary}80`, // 50% opacity
    },
    secondaryAlpha: {
      10: `${colors.secondary}1a`, // 10% opacity
      20: `${colors.secondary}33`, // 20% opacity
      50: `${colors.secondary}80`, // 50% opacity
    },
    // Add theme-aware text colors
    text: {
      onPrimary: "#ffffff", // White text on primary color
      onSecondary: "#ffffff", // White text on secondary color
      primary: isDark ? "#ffffff" : "#000000", // Theme-aware text
      secondary: isDark ? "#d1d5db" : "#4b5563", // Theme-aware secondary text
    },
    // Add CSS variable references for direct style usage
    cssVar: {
      primary: "var(--brand-primary)",
      secondary: "var(--brand-secondary)",
      primaryAlpha10: "var(--brand-primary-10)",
      primaryAlpha20: "var(--brand-primary-20)",
      primaryAlpha50: "var(--brand-primary-50)",
      secondaryAlpha10: "var(--brand-secondary-10)",
      secondaryAlpha20: "var(--brand-secondary-20)",
      secondaryAlpha50: "var(--brand-secondary-50)",
    },
  }
}
