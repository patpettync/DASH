"use client"

import { Button } from "@/components/ui/button"
import { useBrand } from "@/contexts/brand-context"
import { useToast } from "@/components/ui-core/toast"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

export function ResetBrandButton() {
  const { resetColors } = useBrand()
  const { addToast } = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleReset = () => {
    resetColors()
    setConfirmOpen(false)
    addToast({
      title: "Brand colors reset",
      description: "Your brand colors have been reset to the default values.",
      variant: "success",
    })
  }

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setConfirmOpen(true)}>
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset to Defaults</span>
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Brand Colors</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md">
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                This will reset all brand colors to their default values. This action cannot be undone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReset}>Reset Colors</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
