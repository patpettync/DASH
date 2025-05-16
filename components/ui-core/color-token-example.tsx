"use client"

import { useTheme } from "@/contexts/theme-context"
import { colorTokens, getThemeColor } from "@/lib/color-tokens"
import { useThemeColors } from "@/lib/theme-color-utils"

export function ColorTokenExample() {
  const { isDark } = useTheme()
  const themeColors = useThemeColors()

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Using Color Tokens</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example 1: Direct usage with getThemeColor */}
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: getThemeColor(colorTokens.background.surface, isDark),
              color: getThemeColor(colorTokens.text.primary, isDark),
              borderWidth: "1px",
              borderColor: getThemeColor(colorTokens.border.default, isDark),
            }}
          >
            <h3 className="font-medium mb-2">Direct Token Usage</h3>
            <p style={{ color: getThemeColor(colorTokens.text.secondary, isDark) }}>
              Using getThemeColor with direct token references
            </p>
          </div>

          {/* Example 2: Using the useThemeColors hook */}
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: themeColors.background.surface,
              color: themeColors.text.primary,
              borderWidth: "1px",
              borderColor: themeColors.border.default,
            }}
          >
            <h3 className="font-medium mb-2">useThemeColors Hook</h3>
            <p style={{ color: themeColors.text.secondary }}>Using the useThemeColors hook for cleaner access</p>
          </div>

          {/* Example 3: Using path-based access */}
          <div
            className="p-4 rounded-md"
            style={{
              backgroundColor: themeColors.getColor("background.subtle"),
              color: themeColors.getColor("text.primary"),
              borderWidth: "1px",
              borderColor: themeColors.getColor("border.strong"),
            }}
          >
            <h3 className="font-medium mb-2">Path-based Access</h3>
            <p style={{ color: themeColors.getColor("text.muted") }}>Using string paths to access color tokens</p>
          </div>

          {/* Example 4: Status colors */}
          <div className="p-4 rounded-md space-y-2">
            <h3 className="font-medium mb-2">Status Colors</h3>
            <div className="flex flex-wrap gap-2">
              {(["success", "error", "warning", "info", "pending"] as const).map((status) => (
                <span
                  key={status}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: themeColors.status[status].bg,
                    color: themeColors.status[status].text,
                    borderWidth: "1px",
                    borderColor: themeColors.status[status].border,
                  }}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tailwind Class Alternatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example 5: Using Tailwind classes with themeClass */}
          <div className={`p-4 rounded-md ${themeColors.getThemeClass("bg-gray-100", "bg-gray-800")}`}>
            <h3 className={`font-medium mb-2 ${themeColors.getThemeClass("text-gray-900", "text-white")}`}>
              Tailwind with themeClass
            </h3>
            <p className={themeColors.getThemeClass("text-gray-600", "text-gray-300")}>
              Using themeClass helper for Tailwind classes
            </p>
          </div>

          {/* Example 6: Using cn utility with isDark */}
          <div className={`p-4 rounded-md ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <h3 className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Tailwind with isDark</h3>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>Using isDark directly for Tailwind classes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
