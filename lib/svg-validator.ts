/**
 * Validates if a file is an SVG
 * @param file The file to validate
 * @returns A promise that resolves to a validation result
 */
export async function validateSvg(file: File): Promise<{ valid: boolean; message?: string }> {
  // Check file type
  if (!file.type.includes("svg")) {
    return { valid: false, message: "File is not an SVG. Please upload an SVG file." }
  }

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { valid: false, message: "File is too large. Maximum size is 2MB." }
  }

  try {
    // Read file content
    const text = await file.text()

    // Basic SVG validation - check for SVG tag
    if (!text.includes("<svg") || !text.includes("</svg>")) {
      return { valid: false, message: "Invalid SVG file. Missing SVG tags." }
    }

    // Check for potentially malicious content
    if (text.includes("<script") || text.includes("javascript:")) {
      return { valid: false, message: "SVG contains potentially unsafe script content." }
    }

    return { valid: true }
  } catch (error) {
    console.error("Error validating SVG:", error)
    return { valid: false, message: "Error validating SVG file. Please try again." }
  }
}

/**
 * Converts an SVG file to a data URL
 * @param file The SVG file to convert
 * @returns A promise that resolves to the data URL
 */
export async function svgToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
