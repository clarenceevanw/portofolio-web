'use client'

import { useState, useEffect, RefObject } from 'react'

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  options: IntersectionObserverInit = { threshold: 0.3 }
) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const target = ref.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.disconnect() // Fire once
      }
    }, options)

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [ref, options.root, options.rootMargin, options.threshold])

  return isVisible
}
