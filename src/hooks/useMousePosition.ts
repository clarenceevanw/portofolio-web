'use client'

import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let animationFrameId: number
    let latestEvent: MouseEvent | null = null

    const updateMousePosition = () => {
      if (latestEvent) {
        setMousePosition({ x: latestEvent.clientX, y: latestEvent.clientY })
        latestEvent = null
      }
      animationFrameId = requestAnimationFrame(updateMousePosition)
    }

    const onMouseMove = (ev: MouseEvent) => {
      latestEvent = ev
    }
    
    window.addEventListener('mousemove', onMouseMove)
    animationFrameId = requestAnimationFrame(updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return mousePosition
}
