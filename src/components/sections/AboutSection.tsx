'use client'

import { ScanlineBox } from '@/components/ui/ScanlineBox'
import { SkillTag } from '@/components/ui/SkillTag'
import { ProfileCard } from '@/components/ui/ProfileCard'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useEffect, useState } from 'react'

export function AboutSection() {
  return (
    <ScanlineBox id="about">
      {(isVisible: boolean) => <AboutContent isVisible={isVisible} />}
    </ScanlineBox>
  )
}

function AboutContent({ isVisible }: { isVisible: boolean }) {
  const [startTyping, setStartTyping] = useState(false)
  const { displayText } = useTypewriter(startTyping ? '— ABOUT.tsx' : '', 50, 0)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setStartTyping(true)
      }, 1300)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      
      const tl = gsap.timeline({ delay: 1.7 })
      tl.fromTo('.about-title span', 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
      tl.to('#about-intro-text', { opacity: 1, duration: 0.6 }, '-=0.2')
      tl.to('.resume-btn', { 
        opacity: 1, scale: 1, duration: 0.5, 
        ease: 'back.out(1.7)', startAt: { scale: 0.5 } 
      }, '-=0.2')
      tl.to('.skill-tag', { 
        opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, 
        ease: 'power2.out', startAt: { scale: 0.8 } 
      }, '-=0.3')
      tl.to('.profile-card', {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', startAt: { x: 30 }
      }, '-=0.6')
    }
    initGSAP()
  }, [isVisible])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <div className="font-mono text-[11px] text-teal mb-6 h-5 uppercase tracking-widest">
          {displayText}
        </div>
        
        <h2 className="about-title font-display text-[clamp(48px,6vw,80px)] uppercase m-0 leading-none text-white mb-6 overflow-hidden">
          {'ABOUT ME'.split('').map((char, i) => (
            <span key={i} className="inline-block opacity-0 translate-y-[80px]">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
        
        <div className={`about-divider mb-8 h-[2px] bg-teal origin-left transition-transform duration-[400ms] ease-out delay-[1300ms] ${isVisible ? 'scale-x-100' : 'scale-x-0'}`}></div>
        
        <p
          id="about-intro-text"
          className="font-mono text-[13px] text-muted opacity-0 leading-[1.8] mb-8"
        >
          HELLO_WORLD.exe — I'm a Software Engineer and 4th-semester Computer Science student at Petra Christian University, based in Surabaya, Indonesia. I build scalable web applications, real-time platforms, and full-stack systems using Laravel and Next.js. My experience spans backend architecture, authentication systems, WebSocket communication, database design, and deployment pipelines. <br/><br/>Currently serving as both a Laboratory Assistant and Teaching Assistant, I enjoy building software, solving complex problems, and helping others understand how technology works beneath the surface.
        </p>
        
        <div className="flex mb-10">
          <a 
            href="/assets/resume.pdf" 
            target="_blank" 
            className="resume-btn opacity-0 group relative px-8 py-3 border border-white font-mono text-[13px] uppercase text-white transition-all duration-300 hover:bg-white hover:text-black flex items-center justify-center gap-3 rounded-none"
          >
            DOWNLOAD RESUME
          </a>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {['LARAVEL', 'JAVA', 'PHP', 'PYTHON', 'REACT', 'NEXT.JS', 'TYPESCRIPT'].map((skill, idx) => (
            <SkillTag key={idx} label={skill} />
          ))}
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <ProfileCard avatarUrl='assets/avatar/profile.jpg' />
      </div>
    </div>
  )
}
