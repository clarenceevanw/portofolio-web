'use client'

import { useEffect, useState } from 'react'
import type { TechBadge as TechBadgeType } from '@/types'
import { useMousePosition } from '@/hooks/useMousePosition'

export function TechBadge({ badge }: { badge: TechBadgeType }) {
  const [svgContent, setSvgContent] = useState<string>('')
  const { x, y } = useMousePosition()
  
  useEffect(() => {
    async function loadIcon() {
      try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${badge.iconSlug}.svg`)
        if (response.ok) {
          let content = await response.text()
          content = content.replace('<svg ', `<svg fill="${badge.brandColor}" `)
          setSvgContent(content)
        }
      } catch (e) {
        console.error('Error loading icon:', badge.iconSlug)
      }
    }
    loadIcon()
  }, [badge.iconSlug, badge.brandColor])

  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Parallax Logic
  let xOffset = 0
  let yOffset = 0
  
  if (isMounted && (x !== 0 || y !== 0) && typeof window !== 'undefined') {
    const isMobile = window.innerWidth < 768
    if (!isMobile) {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      
      const mouseDx = x - centerX
      const mouseDy = y - centerY

      xOffset = mouseDx * badge.depth
      yOffset = mouseDy * badge.depth

      // Clamp movement significantly increased for more range
      xOffset = Math.max(-120, Math.min(120, xOffset))
      yOffset = Math.max(-120, Math.min(120, yOffset))
    }
  }

  return (
    <div
      className="parallax-element pointer-events-auto group absolute flex flex-col items-center justify-center gap-2 w-[80px] h-[80px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-[10px] z-10 hidden md:flex"
      style={{
        top: badge.position.top,
        left: badge.position.left,
        transform: `translate(${xOffset}px, ${yOffset}px)`,
        transition: 'transform 0.15s ease-out, border-color 0.3s ease'
      }}
    >
      <div
        className="w-[22px] h-[22px] icon-container"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <span className="font-mono text-[11px] text-[#aaaaaa] uppercase group-hover:text-white transition-colors">
        {badge.name}
      </span>
    </div>
  )
}
