/**
 * Utility functions for color handling in the application
 */

/**
 * Converts a color to grayscale using the luminance method
 * @param hexColor - Hex color code (e.g., "#3a86ff")
 * @returns Grayscale hex color
 */
export function convertToGrayscale(hexColor: string): string {
  // Remove the hash if it exists
  const hex = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor

  // Parse the hex color
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)

  // Calculate luminance (perceived brightness)
  // Using the formula: 0.299*R + 0.587*G + 0.114*B
  const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b)

  // Convert back to hex
  const grayHex = luminance.toString(16).padStart(2, "0")

  // Return the grayscale color
  return `#${grayHex}${grayHex}${grayHex}`
}

/**
 * Determines if the current theme is dark mode
 * @returns Boolean indicating if dark mode is active
 */
export function isDarkMode(): boolean {
  if (typeof window === "undefined") return false
  return document.documentElement.classList.contains("dark")
}

/**
 * Gets the appropriate color based on the current theme
 * @param lightColor - Color to use in light mode
 * @param darkColor - Color to use in dark mode (defaults to grayscale version of lightColor)
 * @returns The appropriate color for the current theme
 */
export function getThemeAwareColor(lightColor: string, darkColor?: string): string {
  if (isDarkMode()) {
    return darkColor || convertToGrayscale(lightColor)
  }
  return lightColor
}
