"use client"

import { useBrand } from "@/contexts/brand-context"
import { useTheme } from "@/contexts/theme-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function BrandColorTest() {
  const { colors, updateColors, resetColors } = useBrand()
  const { isDark } = useTheme()
  const [showCssVars, setShowCssVars] = useState(false)

  // Function to get CSS variable value
  const getCssVar = (varName: string) => {
    if (typeof window === "undefined") return "N/A"
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  }

  // Test changing colors
  const testColorChange = () => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    updateColors({ primary: randomColor })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-brand-primary">Brand Color Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Current Brand Colors</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.primary }}></div>
                <span>Primary: {colors.primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.secondary }}></div>
                <span>Secondary: {colors.secondary}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Theme</h3>
            <p>Current theme: {isDark ? "Dark" : "Light"}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Test Elements</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button className="bg-brand-primary hover:bg-brand-primary/90">Primary Button</Button>
              <Button className="bg-brand-secondary hover:bg-brand-secondary/90">Secondary Button</Button>
              <Button variant="outline" className="border-brand-primary text-brand-primary">
                Outline Button
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="p-4 bg-brand-primary-10 rounded-md">Primary 10% opacity</div>
              <div className="p-4 bg-brand-primary-20 rounded-md">Primary 20% opacity</div>
              <div className="p-4 bg-brand-secondary-10 rounded-md">Secondary 10% opacity</div>
            </div>

            <div className="h-2 w-full bg-brand-primary rounded-full"></div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Actions</h3>
          <div className="flex gap-2">
            <Button onClick={testColorChange}>Test Random Color</Button>
            <Button variant="outline" onClick={resetColors}>
              Reset to Defaults
            </Button>
            <Button variant="outline" onClick={() => setShowCssVars(!showCssVars)}>
              {showCssVars ? "Hide CSS Variables" : "Show CSS Variables"}
            </Button>
          </div>
        </div>

        {showCssVars && (
          <div>
            <h3 className="font-medium mb-2">CSS Variables</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
              <pre className="text-xs">
                {`--brand-primary: ${getCssVar("--brand-primary")}\n`}
                {`--brand-primary-10: ${getCssVar("--brand-primary-10")}\n`}
                {`--brand-primary-20: ${getCssVar("--brand-primary-20")}\n`}
                {`--brand-primary-50: ${getCssVar("--brand-primary-50")}\n`}
                {`--brand-secondary: ${getCssVar("--brand-secondary")}\n`}
                {`--brand-secondary-10: ${getCssVar("--brand-secondary-10")}\n`}
                {`--brand-secondary-20: ${getCssVar("--brand-secondary-20")}\n`}
                {`--brand-secondary-50: ${getCssVar("--brand-secondary-50")}\n`}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
