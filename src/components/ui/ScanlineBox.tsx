'use client'

import { useRef, useEffect } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

export function ScanlineBox({ children, className = '', id }: { children: (isVisible: boolean) => React.ReactNode, className?: string, id?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.4 })
  const borderRectRef = useRef<SVGRectElement>(null)
  
  useEffect(() => {
    if (!isVisible) return

    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      
      const tl = gsap.timeline()
      const box = ref.current
      if (!box) return

      tl.to(box, { opacity: 1, duration: 0.2, ease: 'power1.out' }, 0)
      
      const scanline = box.querySelector('.scanline')
      if (scanline) {
        tl.fromTo(scanline, 
          { top: '0%', opacity: 0.6 },
          { top: '100%', duration: 0.3, ease: 'none' }, 0.2
        )
        tl.to(scanline, { opacity: 0, duration: 0.1 }, 0.5)
      }

      tl.call(() => {
        if (borderRectRef.current) {
          borderRectRef.current.classList.add('animate-draw')
        }
      }, [], 0.5)

      tl.to(box.querySelector('.about-box'), {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        keyframes: [
          { opacity: 0.3, duration: 0.05 },
          { opacity: 1, duration: 0.05 },
          { opacity: 0.3, duration: 0.05 },
          { opacity: 1, duration: 0.05 }
        ],
        ease: 'none'
      }, 1.1)
    }
    
    initGSAP()
  }, [isVisible])

  return (
    <section id={id} ref={ref} className={`about-section relative flex items-center justify-center min-h-screen w-full px-4 md:px-16 opacity-0 ${className}`}>
      <div className="about-box max-w-[900px] w-full p-12 relative bg-transparent border-0 rounded-none">
        <div className="scanline"></div>
        <svg className="about-border-svg absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <rect ref={borderRectRef} className="about-border-rect fill-none stroke-teal stroke-2" style={{ strokeDasharray: 4000, strokeDashoffset: 4000 }} height="100%" width="100%"></rect>
        </svg>
        <div className="relative z-10 overflow-hidden">
          {children(isVisible)}
        </div>
      </div>
    </section>
  )
}
