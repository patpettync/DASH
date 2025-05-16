"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FormsTabContentProps {
  children: ReactNode
  activeTab: string
  previousTab?: string | null
}

export function FormsTabContent({ children, activeTab, previousTab }: FormsTabContentProps) {
  // Determine the direction of the animation based on tab names
  const getDirection = () => {
    if (!previousTab || previousTab === activeTab) return 0

    // For the forms page with "active" and "archived" tabs
    if (activeTab === "active" && previousTab === "archived") return -1
    if (activeTab === "archived" && previousTab === "active") return 1

    return 0
  }

  const direction = getDirection()

  return (
    <div className="relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{
            opacity: 0,
            x: direction * 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            },
          }}
          exit={{
            opacity: 0,
            x: direction * -20,
            transition: {
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            },
          }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
