'use client'

import { useState } from 'react'
import { usePageNavigation } from '@/hooks/usePageNavigation'

export function Navbar() {
  const { navigate } = usePageNavigation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNav = (href: string) => {
    setIsMenuOpen(false)
    navigate(href)
  }

  return (
    <>
      {/* Desktop & Mobile Top Bar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-8 bg-surface/80 border border-border-mid backdrop-blur-md rounded-full px-6 py-3 w-[fit-content] whitespace-nowrap">
        <a href="/" onClick={(e) => { e.preventDefault(); handleNav('/') }} className="font-display text-teal tracking-tighter" style={{ fontSize: '24px', lineHeight: 1 }}>
          CLARENCEEVANW
        </a>
        
        <div className="hidden md:block w-[1px] h-[20px] bg-border-mid"></div>
        
        <ul className="hidden md:flex items-center gap-6 font-mono text-[12px] tracking-[1px] uppercase m-0 p-0">
          <li className="text-muted hover:text-teal transition-colors duration-200 cursor-pointer">
            <a href="/#about" onClick={(e) => { e.preventDefault(); handleNav('/#about') }}>ABOUT</a>
          </li>
          <li className="text-muted hover:text-teal transition-colors duration-200 cursor-pointer">
            <a href="/projects" onClick={(e) => { e.preventDefault(); handleNav('/projects') }}>PROJECTS</a>
          </li>
          <li className="text-muted hover:text-teal transition-colors duration-200 cursor-pointer">
            <a href="/#contact" onClick={(e) => { e.preventDefault(); handleNav('/#contact') }}>CONTACT</a>
          </li>
        </ul>
        
        <button 
          className="md:hidden text-teal flex items-center"
          onClick={() => setIsMenuOpen(true)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 w-screen h-screen bg-[#0a0a0a] z-[70] flex flex-col justify-center items-center transition-transform duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          className="absolute top-8 right-8 text-white hover:text-teal transition-colors"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>

        <ul className="flex flex-col items-center gap-10 font-display text-5xl uppercase">
          <li>
            <a 
              href="/#about" 
              onClick={(e) => { e.preventDefault(); handleNav('/#about') }}
              className="text-white hover:text-teal transition-colors"
            >
              ABOUT
            </a>
          </li>
          <li>
            <a 
              href="/projects" 
              onClick={(e) => { e.preventDefault(); handleNav('/projects') }}
              className="text-white hover:text-teal transition-colors"
            >
              PROJECTS
            </a>
          </li>
          <li>
            <a 
              href="/#contact" 
              onClick={(e) => { e.preventDefault(); handleNav('/#contact') }}
              className="text-white hover:text-teal transition-colors"
            >
              CONTACT
            </a>
          </li>
        </ul>
        
        {/* Decorative elements for mobile menu */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[11px] text-teal tracking-[2px]">
          SYS_MENU_ACTIVE
        </div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border-mid -z-10 opacity-30"></div>
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-border-mid -z-10 opacity-30"></div>
      </div>
    </>
  )
}
