"use client"

import { useState, useEffect } from "react"

export function ClickTestUtility() {
  const [clickInfo, setClickInfo] = useState<{ x: number; y: number; target: string } | null>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const targetInfo =
        target.tagName +
        (target.id ? `#${target.id}` : "") +
        (target.className ? `.${target.className.toString().replace(/\s+/g, ".")}` : "")

      setClickInfo({
        x: e.clientX,
        y: e.clientY,
        target: targetInfo,
      })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [isActive])

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md z-50"
      >
        Start Click Test
      </button>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-4 left-4 bg-white p-4 rounded-md shadow-md max-w-md pointer-events-auto">
        <h3 className="font-bold mb-2">Click Test Mode</h3>
        {clickInfo && (
          <div className="text-sm">
            <p>
              <strong>Position:</strong> X: {clickInfo.x}, Y: {clickInfo.y}
            </p>
            <p>
              <strong>Target:</strong> {clickInfo.target}
            </p>
          </div>
        )}
        <button onClick={() => setIsActive(false)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
          Stop Test
        </button>
      </div>
      {clickInfo && (
        <div
          className="absolute w-6 h-6 bg-red-500 rounded-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: clickInfo.x, top: clickInfo.y }}
        />
      )}
    </div>
  )
}
