"use client"

import { useState } from "react"
import { useTheme } from "@/contexts/theme-context"
import { ColorTokenExample } from "@/components/ui-core/color-token-example"

export default function ColorSystemPage() {
  const { isDark, toggleTheme } = useTheme()
  const [showTokenNames, setShowTokenNames] = useState(true)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Color System</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Documentation and examples of the DASH color token system
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p>
          The DASH color system is built on a token-based approach that supports both light and dark modes. All colors
          are defined in a centralized location and accessed through utilities that handle theme switching
          automatically.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <ColorTokenExample />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Best Practices</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Always use the token system instead of hardcoded colors</li>
          <li>
            Prefer the <code>useThemeColors()</code> hook for component-level access
          </li>
          <li>
            Use <code>getThemeColor()</code> for direct token references
          </li>
          <li>
            For Tailwind classes, use the <code>getThemeClass()</code> helper
          </li>
          <li>Status colors should always come from the token system</li>
        </ul>
      </div>
    </div>
  )
}
