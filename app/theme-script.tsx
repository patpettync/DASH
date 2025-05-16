"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    // This runs on the client after hydration
    const theme = localStorage.getItem("theme") || "light"
    document.documentElement.classList.add(theme)
  }, [])

  // This script runs immediately on page load, before React hydration
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'light';
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(theme);
            } catch (e) {
              console.error('Failed to set theme from localStorage', e);
            }
          })();
        `,
      }}
    />
  )
}
