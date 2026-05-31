'use client'

import { techBadges } from '@/data/techStack'
import { TechBadge } from '@/components/ui/TechBadge'
import { useTypewriter } from '@/hooks/useTypewriter'
import { usePageNavigation } from '@/hooks/usePageNavigation'

export function HeroSection() {
  const { navigate } = usePageNavigation()
  const { displayText, isDone } = useTypewriter(
    ['CLARENCE EVAN WIJAYA', 'A FULLSTACK DEVELOPER', 'A CREATIVE CODER'], 
    100, 
    500,
    true
  )

  return (
    <section className="relative flex items-center justify-center min-h-screen w-full px-4 md:px-16 max-w-[1440px] mx-auto overflow-hidden bg-transparent">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 hidden md:block">
        {techBadges.map((badge, idx) => (
          <TechBadge key={idx} badge={badge} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl p-8 md:p-16">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="font-mono text-[11px] text-teal uppercase tracking-widest inline-flex items-center justify-center gap-4">
            <span className="w-12 h-[1px] bg-teal block"></span>
            — FULLSTACK DEVELOPER
          </div>

          <h1 className="font-display text-[80px] uppercase m-0 leading-none text-center">
            <span className="text-white">HI, I'M </span>
            <span className="cursor-default text-teal">{displayText}</span>
            <span className="cursor-blink text-white">|</span>
          </h1>

          <p className="font-mono text-[13px] text-muted leading-[1.8] max-w-2xl mx-auto mt-2">
            Building scalable systems, real-time platforms, and digital products that solve real-world problems.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="px-3 py-1.5 border border-border-mid bg-[#111] text-[10px] font-mono text-teal uppercase tracking-[1px] hover:border-teal hover:bg-[rgba(0,229,204,0.1)] transition-colors cursor-default">
              [ Software Engineer ]
            </span>
            <span className="px-3 py-1.5 border border-border-mid bg-[#111] text-[10px] font-mono text-teal uppercase tracking-[1px] hover:border-teal hover:bg-[rgba(0,229,204,0.1)] transition-colors cursor-default">
              [ CS Student ]
            </span>
            <span className="px-3 py-1.5 border border-border-mid bg-[#111] text-[10px] font-mono text-teal uppercase tracking-[1px] hover:border-teal hover:bg-[rgba(0,229,204,0.1)] transition-colors cursor-default">
              [ Lab Assistant ]
            </span>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => navigate('/projects')}
              className="group relative px-8 py-[14px] bg-transparent border border-white font-mono text-[13px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black flex items-center justify-center gap-3 rounded-none cursor-pointer"
            >
              SEE MY WORK →
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`absolute bottom-[32px] left-1/2 z-10 text-center transition-opacity duration-1000 font-mono text-[11px] text-teal bounce ${isDone ? 'opacity-100' : 'opacity-0'}`} 
        style={{ transform: 'translateX(-50%)' }}
      >
        SCROLL TO EXPLORE ↓
      </div>
    </section>
  )
}
