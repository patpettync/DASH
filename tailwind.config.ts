import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem", // 16px
        sm: "1.5rem", // 24px
        md: "2rem", // 32px
        lg: "4rem", // 64px
        xl: "6rem", // 96px
        "2xl": "100px", // 100px
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      spacing: {
        xxs: "4px",
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
      height: {
        xs: "32px",
        sm: "40px",
        md: "48px",
        lg: "56px",
        xl: "64px",
      },
      minHeight: {
        xs: "32px",
        sm: "40px",
        md: "48px",
        lg: "56px",
        xl: "80px",
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "20px",
        xl: "24px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities, theme }) => {
      // Extract token-based spacing values from the theme
      const spacingScale = theme("spacing")

      // Generate utility classes for each token and utility type
      const tokenUtilities = {}

      // Define the utility types we want to generate
      const utilityTypes = ["p", "px", "py", "m", "mx", "my", "gap"]

      // For each token in the spacing scale
      Object.entries(spacingScale).forEach(([token, value]) => {
        // Skip numeric tokens
        if (!isNaN(Number(token))) return

        // For each utility type
        utilityTypes.forEach((type) => {
          // Generate the class name
          const className = `.${type}-${token}`

          // Generate the CSS property based on utility type
          let cssProps = {}

          switch (type) {
            case "p":
              cssProps = { padding: value }
              break
            case "px":
              cssProps = { "padding-left": value, "padding-right": value }
              break
            case "py":
              cssProps = { "padding-top": value, "padding-bottom": value }
              break
            case "m":
              cssProps = { margin: value }
              break
            case "mx":
              cssProps = { "margin-left": value, "margin-right": value }
              break
            case "my":
              cssProps = { "margin-top": value, "margin-bottom": value }
              break
            case "gap":
              cssProps = { gap: value }
              break
          }

          // Add to utilities
          tokenUtilities[className] = cssProps
        })
      })

      // Add container utility classes
      const containerUtilities = {
        ".container-desktop": {
          "max-width": "1280px",
          "padding-left": "100px",
          "padding-right": "100px",
          "margin-left": "auto",
          "margin-right": "auto",
        },
        ".container-tablet": {
          "max-width": "768px",
          "padding-left": "64px",
          "padding-right": "64px",
          "margin-left": "auto",
          "margin-right": "auto",
        },
        ".container-mobile": {
          "max-width": "480px",
          "padding-left": "24px",
          "padding-right": "24px",
          "margin-left": "auto",
          "margin-right": "auto",
        },
        // Add container-layout utility
        ".container-layout": {
          "max-width": "1280px",
          "margin-left": "auto",
          "margin-right": "auto",
          "padding-left": spacingScale.sm,
          "padding-right": spacingScale.sm,
        },
        // Responsive variants for container-layout
        "@media (min-width: 640px)": {
          ".container-layout": {
            "padding-left": spacingScale.md,
            "padding-right": spacingScale.md,
          },
        },
        "@media (min-width: 1024px)": {
          ".container-layout": {
            "padding-left": spacingScale.lg,
            "padding-right": spacingScale.lg,
          },
        },
        "@media (min-width: 1280px)": {
          ".container-layout": {
            "padding-left": spacingScale.xl,
            "padding-right": spacingScale.xl,
          },
        },
        // Add responsive variants for other container classes
        "@media (max-width: 1279px)": {
          ".container-desktop": {
            "padding-left": "64px",
            "padding-right": "64px",
          },
        },
        "@media (max-width: 767px)": {
          ".container-desktop, .container-tablet": {
            "padding-left": "24px",
            "padding-right": "24px",
          },
        },
      }

      // Add all utilities
      addUtilities(
        { ...tokenUtilities, ...containerUtilities },
        {
          variants: ["responsive"], // Support responsive variants
        },
      )
    }),
  ],
}

export default config
