import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/ui-core/toast"
import { ModalProvider } from "@/components/ui-core/modal"
import { BrandProvider } from "@/contexts/brand-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { LoadingProvider } from "@/contexts/loading-context"
import { TabTransitionProvider } from "@/contexts/tab-transition-context"
import { ThemeScript } from "./theme-script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DASH Platform",
  description: "A modular web platform for enterprise applications",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} bg-background min-h-screen`}>
        <ThemeProvider>
          <BrandProvider>
            <LoadingProvider>
              <TabTransitionProvider>
                <ToastProvider>
                  <ModalProvider>{children}</ModalProvider>
                </ToastProvider>
              </TabTransitionProvider>
            </LoadingProvider>
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
