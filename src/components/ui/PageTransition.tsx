'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const BOOT_LINES = [
  '> INITIALIZING_SYSTEM...',
  '> LOADING_PAGE.EXE',
  '> RENDERING_COMPONENTS...',
  '> ACCESS_GRANTED.',
]

export default function PageTransition() {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const containerRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const slicesRef = useRef<HTMLDivElement>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [bootLines, setBootLines] = useState<string[]>([])

  useEffect(() => {
    if (pathname === prevPathname.current) return
    prevPathname.current = pathname
    runTransition()
  }, [pathname])

  const runTransition = async () => {
    const gsap = (await import('gsap')).default
    setIsTransitioning(true)
    setBootLines([])

    const container = containerRef.current
    const slices = slicesRef.current
    const terminal = terminalRef.current
    if (!container || !slices || !terminal) return

    // Show overlay
    container.style.display = 'flex'
    container.style.opacity = '1'

    // --- PHASE 1: GLITCH SLICE EXIT (400ms) ---
    // Create 8 horizontal slices
    slices.innerHTML = ''
    const SLICE_COUNT = 8
    const sliceHeight = window.innerHeight / SLICE_COUNT

    for (let i = 0; i < SLICE_COUNT; i++) {
      const slice = document.createElement('div')
      slice.style.cssText = `
        position: absolute;
        left: 0;
        width: 100%;
        height: ${sliceHeight + 1}px;
        top: ${i * sliceHeight}px;
        background: #000;
        transform: translateX(0);
        will-change: transform;
      `
      // Add teal glitch accent on random slices
      if (i % 3 === 0) {
        slice.style.boxShadow = 'inset 0 0 0 1px rgba(0,229,204,0.3)'
      }
      slices.appendChild(slice)
    }

    const sliceEls = slices.querySelectorAll('div')

    // Animate slices in staggered — odd left, even right
    await new Promise<void>(resolve => {
      gsap.fromTo(sliceEls,
        { x: (i) => i % 2 === 0 ? '-100%' : '100%', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.04,
          stagger: {
            each: 0.04,
            from: 'random'
          },
          ease: 'none',
          onComplete: resolve
        }
      )
    })

    // Brief glitch hold — randomly shift some slices
    await new Promise<void>(resolve => {
      gsap.to(sliceEls, {
        x: (i) => {
          const offsets = [0, 0, 8, 0, -6, 0, 4, 0]
          return offsets[i % offsets.length]
        },
        duration: 0.08,
        ease: 'none',
        stagger: 0.01,
        yoyo: true,
        repeat: 2,
        onComplete: resolve
      })
    })

    // Snap all slices to x:0 (full black screen)
    gsap.set(sliceEls, { x: 0 })

    // --- PHASE 2: TERMINAL BOOT ENTER (600ms) ---
    // Show terminal, hide slices (keep black bg)
    terminal.style.opacity = '1'

    // Type each boot line sequentially
    for (let i = 0; i < BOOT_LINES.length; i++) {
      await typeBootLine(BOOT_LINES[i], i)
      await sleep(80)
    }

    await sleep(200)

    // --- PHASE 3: REVEAL NEW PAGE ---
    // Fade out entire overlay
    await new Promise<void>(resolve => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: resolve
      })
    })

    container.style.display = 'none'
    setIsTransitioning(false)
    setBootLines([])
  }

  const typeBootLine = (line: string, index: number): Promise<void> => {
    return new Promise(resolve => {
      let i = 0
      const interval = setInterval(() => {
        setBootLines(prev => {
          const updated = [...prev]
          updated[index] = line.slice(0, i + 1)
          return updated
        })
        i++
        if (i >= line.length) {
          clearInterval(interval)
          resolve()
        }
      }, 18) // 18ms per character — fast terminal feel
    })
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  return (
    <div
      ref={containerRef}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '0 10vw',
      }}
    >
      {/* Glitch slices layer */}
      <div
        ref={slicesRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Terminal boot text layer */}
      <div
        ref={terminalRef}
        style={{
          position: 'relative',
          zIndex: 2,
          opacity: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          lineHeight: '2',
          letterSpacing: '0.05em',
        }}
      >
        {bootLines.map((line, i) => (
          <div 
            key={i} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: i === BOOT_LINES.length - 1 && line === BOOT_LINES[3] ? '#ffffff' : '#00e5cc'
            }}
          >
            <span>{line}</span>
            {/* Blinking cursor only on last active line */}
            {i === bootLines.length - 1 && (
              <span className="cursor-blink" style={{ color: i === BOOT_LINES.length - 1 && line === BOOT_LINES[3] ? '#ffffff' : '#00e5cc' }}>█</span>
            )}
          </div>
        ))}

        {/* Teal accent line at bottom of terminal */}
        <div className="cursor-blink" style={{
          marginTop: '24px',
          width: '120px',
          height: '2px',
          background: 'var(--teal)',
          boxShadow: '0 0 8px var(--teal)',
        }} />
      </div>

      {/* Scanline overlay on top of everything for extra brutalist texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        pointerEvents: 'none',
        zIndex: 3,
        opacity: 0.4,
      }} />
    </div>
  )
}
