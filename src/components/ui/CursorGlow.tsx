'use client'

import { useMousePosition } from '@/hooks/useMousePosition'

export function CursorGlow() {
  const { x, y } = useMousePosition()

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(
          600px circle at ${x}px ${y}px,
          rgba(0, 229, 204, 0.07),
          rgba(0, 229, 204, 0.02) 40%,
          transparent 70%
        )`
      }}
    />
  )
}
