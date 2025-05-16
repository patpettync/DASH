"use client"

import { useTheme } from "@/contexts/theme-context"
import { cn } from "@/lib/utils"

export function BackgroundTest() {
  const { isDark } = useTheme()

  return (
    <div className="space-y-lg">
      <div className="border border-dashed border-gray-400 p-md rounded-md">
        <h2 className={cn("text-xl font-bold mb-sm", isDark ? "text-gray-200" : "text-gray-900")}>
          Background Test Component
        </h2>
        <p className={cn("mb-md", isDark ? "text-gray-300" : "text-gray-700")}>
          This component is used to verify that the background color extends to the full width of the screen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          <div className="bg-white dark:bg-gray-800 p-md rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-xs">Card 1</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is a test card to verify the layout and background.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-md rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-xs">Card 2</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is a test card to verify the layout and background.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-md rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-xs">Card 3</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This is a test card to verify the layout and background.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
