"use client"

import { type ReactNode, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface EnhancedTooltipProps {
  children: ReactNode
  content: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
  contentClassName?: string
  delayDuration?: number
  animated?: boolean
}

export function EnhancedTooltip({
  children,
  content,
  side = "top",
  align = "center",
  className,
  contentClassName,
  delayDuration = 300,
  animated = true,
}: EnhancedTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration} open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild className={className}>
          <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(animated && "animate-fade-in data-[state=closed]:animate-fade-out", contentClassName)}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
