"use client"

import { useState, useEffect, useRef } from "react"

type AnimationOptions = {
  threshold?: number
  rootMargin?: string
  once?: boolean
  delay?: number
}

export function useScrollAnimation(options: AnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px", once = true, delay = 0 } = options

  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => {
              setIsVisible(true)
            }, delay)
          } else {
            setIsVisible(true)
          }

          if (once && currentRef) {
            observer.unobserve(currentRef)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, rootMargin, once, delay])

  return { ref, isVisible }
}
