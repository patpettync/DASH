"use client"

import { forwardRef } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Spinner } from "@/components/ui-core/spinner"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, isLoading, loadingText, className, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(isLoading && "cursor-not-allowed", className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-xs" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"
