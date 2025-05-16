// Color tokens for the application
// These tokens are used to maintain consistency across the UI

// Base colors
export const baseColors = {
  // Gray scale (primary neutral palette)
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712",
  },

  // Brand colors - these will be overridden by useBrand() context
  brand: {
    primary: "var(--brand-primary)",
    secondary: "var(--brand-secondary)",
    primaryAlpha: {
      10: "var(--brand-primary-10)",
      20: "var(--brand-primary-20)",
      50: "var(--brand-primary-50)",
    },
    secondaryAlpha: {
      10: "var(--brand-secondary-10)",
      20: "var(--brand-secondary-20)",
      50: "var(--brand-secondary-50)",
    },
  },
}

// Semantic color tokens
export const colorTokens = {
  // UI colors
  background: {
    default: {
      light: baseColors.gray[50],
      dark: baseColors.gray[900],
    },
    surface: {
      light: baseColors.gray[100],
      dark: baseColors.gray[800],
    },
    subtle: {
      light: baseColors.gray[200],
      dark: baseColors.gray[700],
    },
  },

  text: {
    primary: {
      light: baseColors.gray[900],
      dark: baseColors.gray[50],
    },
    secondary: {
      light: baseColors.gray[700],
      dark: baseColors.gray[300],
    },
    muted: {
      light: baseColors.gray[500],
      dark: baseColors.gray[400],
    },
    subtle: {
      light: baseColors.gray[400],
      dark: baseColors.gray[500],
    },
    heading: {
      light: baseColors.gray[800],
      dark: baseColors.gray[100],
    },
  },

  border: {
    default: {
      light: baseColors.gray[200],
      dark: baseColors.gray[700],
    },
    subtle: {
      light: baseColors.gray[100],
      dark: baseColors.gray[800],
    },
    strong: {
      light: baseColors.gray[300],
      dark: baseColors.gray[600],
    },
  },

  // Status colors
  status: {
    success: {
      bg: {
        light: "#f0fdf4", // green-50
        dark: "rgba(34, 197, 94, 0.1)", // dark mode green with alpha
      },
      text: {
        light: "#16a34a", // green-600
        dark: "#86efac", // green-300
      },
      border: {
        light: "#a7f3d0", // green-200
        dark: "rgba(22, 101, 52, 0.5)", // dark mode green border
      },
    },
    error: {
      bg: {
        light: "#fee2e2", // red-50
        dark: "rgba(220, 38, 38, 0.1)", // dark mode red with alpha
      },
      text: {
        light: "#dc2626", // red-600
        dark: "#fca5a5", // red-300
      },
      border: {
        light: "#fca5a5", // red-200
        dark: "rgba(185, 28, 28, 0.5)", // dark mode red border
      },
    },
    warning: {
      bg: {
        light: "#fffbeb", // amber-50
        dark: "rgba(217, 119, 6, 0.1)", // dark mode amber with alpha
      },
      text: {
        light: "#d97706", // amber-600
        dark: "#fde68a", // amber-200
      },
      border: {
        light: "#fde68a", // amber-200
        dark: "rgba(180, 83, 9, 0.5)", // dark mode amber border
      },
    },
    info: {
      bg: {
        light: "#eff6ff", // blue-50
        dark: "rgba(37, 99, 235, 0.1)", // dark mode blue with alpha
      },
      text: {
        light: "#2563eb", // blue-600
        dark: "#bae6fd", // blue-200
      },
      border: {
        light: "#bae6fd", // blue-200
        dark: "rgba(30, 64, 175, 0.5)", // dark mode blue border
      },
    },
    pending: {
      bg: {
        light: "#fff7ed", // orange-50
        dark: "rgba(234, 88, 12, 0.1)", // dark mode orange with alpha
      },
      text: {
        light: "#a16207", // yellow-700
        dark: "#fcd34d", // yellow-300
      },
      border: {
        light: "#fcd34d", // yellow-300
        dark: "rgba(161, 98, 7, 0.5)", // dark mode yellow border
      },
    },
    upcoming: {
      bg: {
        light: "#f8fafc", // slate-50
        dark: "rgba(71, 85, 105, 0.1)", // dark mode slate with alpha
      },
      text: {
        light: "#4b5563", // gray-600
        dark: "#d1d5db", // gray-300
      },
      border: {
        light: "#d1d5db", // gray-300
        dark: "rgba(71, 85, 105, 0.5)", // dark mode slate border
      },
    },
  },
}

// Default fallback colors
const DEFAULT_LIGHT_COLOR = baseColors.gray[900]
const DEFAULT_DARK_COLOR = baseColors.gray[50]

// Helper function to safely get theme-aware color with fallbacks
export function getThemeColor(token: { light?: string; dark?: string } | undefined, isDark: boolean): string {
  // If token is undefined, return default fallback
  if (!token) {
    return isDark ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR
  }

  // Get the appropriate theme color with fallback
  const themeColor = isDark ? token.dark || DEFAULT_DARK_COLOR : token.light || DEFAULT_LIGHT_COLOR

  return themeColor
}

// Helper function to safely access nested color tokens
export function getColorToken(path: string, isDark: boolean): string {
  // Split the path into segments
  const segments = path.split(".")

  // Start with the colorTokens object
  let current: any = colorTokens

  // Traverse the path
  for (const segment of segments) {
    if (current && typeof current === "object" && segment in current) {
      current = current[segment]
    } else {
      // Path doesn't exist, return default
      return isDark ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR
    }
  }

  // Check if we have a valid token with light/dark values
  if (current && typeof current === "object" && ("light" in current || "dark" in current)) {
    return isDark ? current.dark || DEFAULT_DARK_COLOR : current.light || DEFAULT_LIGHT_COLOR
  }

  // Not a valid token, return default
  return isDark ? DEFAULT_DARK_COLOR : DEFAULT_LIGHT_COLOR
}
