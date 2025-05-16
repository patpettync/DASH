// Design tokens for the application
// These tokens are used to maintain consistency across the UI

export const tokens = {
  // Spacing tokens
  spacing: {
    xs: "8px",
    sm: "16px",
    md: "24px",
    lg: "32px",
    xl: "40px",
    "2xl": "48px",
    "3xl": "56px",
    "4xl": "64px",
    "5xl": "80px",
    "6xl": "96px",
    "7xl": "100px",
  },

  // Layout tokens
  layout: {
    maxWidth: "1280px",
    padding: {
      sm: "16px", // Small screens
      md: "24px", // Medium screens
      lg: "32px", // Large screens
      xl: "40px", // Extra large screens
    },
    containerLayout: {
      maxWidth: "1280px",
      padding: {
        default: "16px", // Small screens (spacing.sm)
        sm: "24px", // Medium screens (spacing.md)
        lg: "32px", // Large screens (spacing.lg)
        xl: "40px", // Extra large screens (spacing.xl)
      },
    },
  },

  // Container tokens
  container: {
    desktop: {
      maxWidth: "1280px",
      padding: "100px",
    },
    tablet: {
      maxWidth: "768px",
      padding: "64px",
    },
    mobile: {
      maxWidth: "480px",
      padding: "24px",
    },
  },

  // Height tokens
  height: {
    xs: "32px",
    sm: "40px",
    md: "48px",
    lg: "56px",
    xl: "64px",
  },

  // Min-height tokens
  minHeight: {
    xs: "32px",
    sm: "40px",
    md: "48px",
    lg: "56px",
    xl: "80px",
  },

  // Font size tokens
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "20px",
    xl: "24px",
  },

  // Border radius tokens
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
  },

  // Grid system tokens
  grid: {
    gap: {
      default: "32px", // Use gap-lg for primary grid gaps
      large: "40px", // Use gap-xl for larger grid gaps
    },
    verticalSpacing: "32px", // Use mb-lg or space-y-lg for vertical rhythm
  },
}

// Status colors
export const statusColors = {
  pending: {
    bg: "#fff7ed",
    text: "#a16207",
    border: "#fcd34d",
  },
  success: {
    bg: "#f0fdf4",
    text: "#16a34a",
    border: "#a7f3d0",
  },
  error: {
    bg: "#fee2e2",
    text: "#dc2626",
    border: "#fca5a5",
  },
  warning: {
    bg: "#fffbeb",
    text: "#d97706",
    border: "#fde68a",
  },
  info: {
    bg: "#eff6ff",
    text: "#2563eb",
    border: "#bae6fd",
  },
  upcoming: {
    bg: "#f8fafc",
    text: "#4b5563",
    border: "#d1d5db",
  },
}

// Export individual token categories for easier imports
export const spacing = tokens.spacing
export const layout = tokens.layout
export const container = tokens.container
export const height = tokens.height
export const minHeight = tokens.minHeight
export const fontSize = tokens.fontSize
export const borderRadius = tokens.borderRadius
export const grid = tokens.grid
