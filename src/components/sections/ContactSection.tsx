'use client'

import { ScanlineBox } from '@/components/ui/ScanlineBox'
import { SocialIcon } from '@/components/ui/SocialIcon'
import { socials } from '@/data/socials'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useEffect, useState } from 'react'

export function ContactSection() {
  return (
    <ScanlineBox id="contact" className="z-10 relative">
      {(isVisible: boolean) => <ContactContent isVisible={isVisible} />}
    </ScanlineBox>
  )
}

function ContactContent({ isVisible }: { isVisible: boolean }) {
  const [startTyping, setStartTyping] = useState(false)
  const { displayText } = useTypewriter(startTyping ? '— CONTACT.tsx' : '', 50, 0)

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
      tl.fromTo('.contact-title span', 
        { y: 80, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
      tl.to('.contact-fade', { opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.2')
      tl.to('.contact-social', { 
        opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, 
        ease: 'back.out(1.7)', startAt: { scale: 0.5 } 
      }, '-=0.2')
    }
    initGSAP()
  }, [isVisible])

  return (
    <div className="flex flex-col items-center text-center">
      <div className="font-mono text-[11px] text-teal mb-6 h-5 uppercase tracking-widest">
        {displayText}
      </div>
      
      <h2 className="contact-title font-display text-[clamp(48px,6vw,80px)] uppercase m-0 leading-none text-white mb-8 overflow-hidden flex flex-wrap justify-center">
        {"LET'S CONNECT".split('').map((char, i) => (
          <span key={i} className="inline-block opacity-0 translate-y-[80px]">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>
      
      <p className="contact-fade font-mono text-[13px] text-muted opacity-0 leading-[1.8] mb-12 max-w-md mx-auto">
        Always open for collaboration on challenging projects. If you have an idea that needs precise execution, drop a line.
      </p>

      <a href="mailto:clarenceevan0907@gmail.com" className="contact-fade opacity-0 group relative px-8 py-[14px] bg-transparent border border-white font-mono text-[13px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black flex items-center justify-center gap-3 rounded-none mb-12">
        SEND TRANSMISSION
      </a>
      
      <div className="flex gap-4">
        {socials.map((link, idx) => (
          <div key={idx} className="contact-social opacity-0">
             <SocialIcon link={link} />
          </div>
        ))}
      </div>
    </div>
  )
}
