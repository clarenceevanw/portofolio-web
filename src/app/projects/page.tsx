'use client'

import React, { useState, useEffect } from 'react'
import { usePageNavigation } from '@/hooks/usePageNavigation'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const { navigate } = usePageNavigation()
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FULLSTACK' | 'MOBILE' | 'BACKEND' | 'FRONTEND'>('ALL')
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>(projects)

  // Stagger animation on mount
  useEffect(() => {
    let ctx: any;
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      
      ctx = gsap.context(() => {
        // Use fromTo to avoid StrictMode issues capturing partial opacity
        gsap.fromTo('.gs-reveal', 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.5 // Wait a bit for page transition overlay to clear
          }
        )
      })
    }
    initGSAP()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  const handleFilterChange = async (filter: 'ALL' | 'FULLSTACK' | 'MOBILE' | 'BACKEND' | 'FRONTEND') => {
    if (filter === activeFilter) return
    
    const gsap = (await import('gsap')).default
    
    // Fade out current cards
    gsap.to('.project-card-wrapper', {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        setActiveFilter(filter)
        const filtered = filter === 'ALL' ? projects : projects.filter(p => p.category === filter)
        setDisplayedProjects(filtered)
        
        // Wait for DOM to update then fade in
        setTimeout(() => {
          gsap.fromTo('.project-card-wrapper', 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 }
          )
        }, 50)
      }
    })
  }

  const filters: Array<'ALL' | 'FULLSTACK' | 'MOBILE' | 'BACKEND' | 'FRONTEND'> = ['ALL', 'FULLSTACK', 'MOBILE', 'BACKEND', 'FRONTEND']

  return (
    <div className="flex-grow pt-[160px] pb-32 px-4 md:px-16 max-w-[1440px] mx-auto w-full z-20 relative">
      <header className="mb-16 border-b border-border-mid pb-8 relative">
        <div className="font-mono text-[14px] text-teal mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-teal inline-block"></span> - PROJECTS.tsx
        </div>
        <h1 className="font-display text-[48px] md:text-[96px] leading-[1.0] text-white uppercase m-0 p-0">
          {'ALL PROJECTS'.split('').map((char, i) => (
            <span key={i} className="gs-reveal inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-teal"></div>
      </header>

      <section className="mb-12">
        <div className="flex flex-wrap gap-4 border border-border-mid p-4 bg-[#111]">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-4 py-2 font-mono text-[11px] uppercase transition-colors ${
                activeFilter === filter
                  ? 'border border-teal text-teal bg-[rgba(0,229,204,0.1)] shadow-[0_0_10px_rgba(0,229,204,0.2)]'
                  : 'border border-border-mid text-muted hover:border-teal hover:text-teal'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-mid border border-border-mid">
        {displayedProjects.map((project, idx) => {
          // Feature the first project if 'ALL' is selected
          const isFeatured = activeFilter === 'ALL' && idx === 0
          return (
            <div key={project.id} className={`project-card-wrapper ${isFeatured ? 'md:col-span-2' : ''}`}>
              <ProjectCard 
                project={project} 
                featured={isFeatured} 
                fullWidth={true}
                onClick={() => navigate(`/projects/${project.slug}`)} 
              />
            </div>
          )
        })}
        
        {/* Placeholder to fill empty grid space */}
        {((activeFilter === 'ALL' && displayedProjects.length % 2 === 0) || 
          (activeFilter !== 'ALL' && displayedProjects.length % 2 !== 0)) && (
          <div className="project-card-wrapper bg-[#111] border border-[#2a2a2a] flex flex-col justify-center items-center min-h-[480px]">
            <span className="material-symbols-outlined text-[#333] text-[48px] mb-6">engineering</span>
            <span className="font-mono text-dim text-[12px] uppercase tracking-[2px]">CLASSIFIED_PROJECT</span>
            <span className="font-display text-muted text-[24px] uppercase mt-2">COMING SOON</span>
          </div>
        )}
      </section>
    </div>
  )
}
