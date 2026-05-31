'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Sync GSAP ticker with Lenis for perfectly smooth ScrollTrigger animations
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Prevent GSAP from messing with the scroll delta

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
