"use client"

import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TabContentProps {
  children: ReactNode
  id: string
}

export function TabContent({ children, id }: TabContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1], // Custom ease curve for smoother motion
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
