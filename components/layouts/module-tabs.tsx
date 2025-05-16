"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TabItem {
  label: string
  href: string
  exact?: boolean
}

interface ModuleTabsProps {
  tabs: TabItem[]
  basePath: string
}

export function ModuleTabs({ tabs, basePath }: ModuleTabsProps) {
  const pathname = usePathname()
  const [previousActive, setPreviousActive] = useState<string | null>(null)
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const isActive = (tab: TabItem) => {
    if (tab.exact) {
      return pathname === tab.href
    }

    // For nested routes, check if this is the most specific match
    // Find all tabs that match the current path
    const matchingTabs = tabs.filter((t) => pathname === t.href || (!t.exact && pathname.startsWith(t.href + "/")))

    // If there are multiple matches, find the most specific one (longest href)
    if (matchingTabs.length > 1) {
      const mostSpecificTab = matchingTabs.reduce((prev, current) =>
        prev.href.length > current.href.length ? prev : current,
      )
      return tab.href === mostSpecificTab.href
    }

    // Otherwise, check if the pathname starts with this tab's href
    return pathname === tab.href || (!tab.exact && pathname.startsWith(tab.href + "/"))
  }

  // Find the active tab
  const activeTab = tabs.find((tab) => isActive(tab))

  // Update previous active tab for transition effects
  useEffect(() => {
    if (activeTab) {
      if (isInitialRender) {
        setIsInitialRender(false)
      } else {
        setPreviousActive(activeTab.href)
      }
    }
  }, [activeTab, isInitialRender])

  // Check for overflow and update scroll indicators
  const checkForOverflow = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 1) // -1 for rounding errors
    }
  }

  // Add resize and scroll event listeners
  useEffect(() => {
    const tabsContainer = tabsContainerRef.current
    if (tabsContainer) {
      checkForOverflow()
      tabsContainer.addEventListener("scroll", checkForOverflow)
      window.addEventListener("resize", checkForOverflow)

      return () => {
        tabsContainer.removeEventListener("scroll", checkForOverflow)
        window.removeEventListener("resize", checkForOverflow)
      }
    }
  }, [])

  // Scroll to active tab on initial render and when active tab changes
  useEffect(() => {
    if (tabsContainerRef.current && activeTab) {
      const tabsContainer = tabsContainerRef.current
      const activeTabElement = tabsContainer.querySelector(`[data-href="${activeTab.href}"]`) as HTMLElement

      if (activeTabElement) {
        const containerRect = tabsContainer.getBoundingClientRect()
        const tabRect = activeTabElement.getBoundingClientRect()

        // Check if the active tab is not fully visible
        if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
          const scrollLeft = activeTabElement.offsetLeft - (containerRect.width - tabRect.width) / 2
          tabsContainer.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          })
        }
      }
    }
  }, [activeTab])

  // Handle scroll button clicks
  const handleScrollLeft = () => {
    if (tabsContainerRef.current) {
      const scrollAmount = tabsContainerRef.current.clientWidth * 0.75
      tabsContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleScrollRight = () => {
    if (tabsContainerRef.current) {
      const scrollAmount = tabsContainerRef.current.clientWidth * 0.75
      tabsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="w-full border-b border-border bg-background">
      <div className="container mx-auto px-4 relative">
        {/* Left scroll indicator */}
        {showLeftScroll && (
          <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
            <div className="absolute left-0 w-8 h-full bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm bg-muted hover:bg-accent"
              onClick={handleScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Right scroll indicator */}
        {showRightScroll && (
          <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
            <div className="absolute right-0 w-8 h-full bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full shadow-sm bg-muted hover:bg-accent"
              onClick={handleScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tabs container with horizontal scrolling */}
        <div
          ref={tabsContainerRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tabs.map((tab) => {
            const active = isActive(tab)
            return (
              <Link
                key={tab.href}
                href={tab.href}
                data-href={tab.href}
                className={cn(
                  "relative py-sm px-md font-medium text-sm tracking-wider uppercase transition-all duration-300 ease-in-out whitespace-nowrap",
                  active ? "text-[var(--brand-primary)]" : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => {
                  if (activeTab) {
                    setPreviousActive(activeTab.href)
                  }
                }}
              >
                {tab.label}
                {active && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-xxs bg-[var(--brand-primary)]"
                    layoutId="activeIndicator"
                    initial={isInitialRender ? false : { width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
