"\"use client"

import { useTheme } from "@/contexts/theme-context"
import { colorTokens, getThemeColor as getColor, baseColors } from "@/lib/color-tokens"

// Hook to get theme-aware colors
export function useThemeColors() {
  const { isDark } = useTheme()

  return {
    // Background colors
    background: {
      default: getColor(colorTokens.background.default, isDark),
      surface: getColor(colorTokens.background.surface, isDark),
      subtle: getColor(colorTokens.background.subtle, isDark),
    },

    // Text colors
    text: {
      primary: getColor(colorTokens.text.primary, isDark),
      secondary: getColor(colorTokens.text.secondary, isDark),
      muted: getColor(colorTokens.text.muted, isDark),
      subtle: getColor(colorTokens.text.subtle, isDark),
      heading: getColor(colorTokens.text.heading, isDark),
    },

    // Border colors
    border: {
      default: getColor(colorTokens.border.default, isDark),
      subtle: getColor(colorTokens.border.subtle, isDark),
      strong: getColor(colorTokens.border.strong, isDark),
    },

    // Status colors
    status: {
      success: {
        bg: getColor(colorTokens.status.success.bg, isDark),
        text: getColor(colorTokens.status.success.text, isDark),
        border: getColor(colorTokens.status.success.border, isDark),
      },
      error: {
        bg: getColor(colorTokens.status.error.bg, isDark),
        text: getColor(colorTokens.status.error.text, isDark),
        border: getColor(colorTokens.status.error.border, isDark),
      },
      warning: {
        bg: getColor(colorTokens.status.warning.bg, isDark),
        text: getColor(colorTokens.status.warning.text, isDark),
        border: getColor(colorTokens.status.warning.border, isDark),
      },
      info: {
        bg: getColor(colorTokens.status.info.bg, isDark),
        text: getColor(colorTokens.status.info.text, isDark),
        border: getColor(colorTokens.status.info.border, isDark),
      },
      pending: {
        bg: getColor(colorTokens.status.pending.bg, isDark),
        text: getColor(colorTokens.status.pending.text, isDark),
        border: getColor(colorTokens.status.pending.border, isDark),
      },
      upcoming: {
        bg: getColor(colorTokens.status.upcoming.bg, isDark),
        text: getColor(colorTokens.status.upcoming.text, isDark),
        border: getColor(colorTokens.status.upcoming.border, isDark),
      },
    },

    // Helper function to get Tailwind classes based on theme
    getThemeClass: (lightClass: string, darkClass: string) => (isDark ? darkClass : lightClass),
  }
}

// Helper function to get theme-aware color
export function getThemeColor(
  token: { light?: string; dark?: string } | undefined,
  isDark: boolean,
  opacity?: number,
): string {
  if (!token) {
    return isDark ? baseColors.gray[50] : baseColors.gray[900]
  }

  const themeColor = isDark ? token.dark || baseColors.gray[50] : token.light || baseColors.gray[900]

  if (opacity !== undefined) {
    // Convert hex color to RGBA
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : null
    }

    const rgb = hexToRgb(themeColor)
    if (rgb) {
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
    }
  }

  return themeColor
}
