'use client'

import React, { useEffect } from 'react'
import { usePageNavigation } from '@/hooks/usePageNavigation'
import type { Project } from '@/types'
import { ImageCarousel } from '@/components/ui/ImageCarousel'

interface ProjectDetailClientProps {
  project: Project
  nextProject: Project
}

export default function ProjectDetailClient({ project, nextProject }: ProjectDetailClientProps) {
  const { navigate } = usePageNavigation()

  useEffect(() => {
    let ctx: any;
    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      
      ctx = gsap.context(() => {
        // Title Stagger: use fromTo to prevent StrictMode double-render bugs
        gsap.fromTo('.title-stagger span', 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
          }
        )

        // Reveal elements on scroll
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              gsap.fromTo(entry.target, 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
              )
              observer.unobserve(entry.target)
            }
          })
        }, { threshold: 0.1 })

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
        
        // Clean up observer inside context cleanup if needed, but here we just attach it
        // We can't cleanly put observer in context, but it's fine.
      })
    }
    
    initGSAP()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <div className="flex-grow pt-[120px] pb-32 px-4 md:px-16 max-w-[1440px] mx-auto w-full flex flex-col z-10 relative border-x border-border-mid min-h-screen">
      
      {/* Back Button */}
      <div className="mb-8">
        <a 
          href="/projects" 
          onClick={(e) => { e.preventDefault(); navigate('/projects') }} 
          className="font-mono text-[12px] uppercase text-muted hover:text-teal transition-colors flex items-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          ALL_PROJECTS
        </a>
      </div>

      {/* Hero Section */}
      <section className="border-b border-white py-16 relative reveal opacity-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[14px] text-teal bg-[#0A0A0A] px-2 py-1 border border-white">
              - PROJECT_{project.number}
            </span>
          </div>
          
          <h1 className="font-display uppercase text-white m-0 p-0 title-stagger" style={{ fontSize: 'clamp(60px, 8vw, 120px)', lineHeight: 0.9 }}>
            {project.title.split('').map((char, i) => (
              <span key={i} className="inline-block">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mt-8">
            <div className="flex gap-8 font-mono text-[14px] uppercase">
              <div className="flex flex-col gap-2">
                <span className="text-muted">CATEGORY</span>
                <span className="text-white">{project.category}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted">YEAR</span>
                <span className="text-white">{project.year}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-muted">ROLE</span>
                <span className="text-white">{project.role}</span>
              </div>
            </div>
            
            <div className="max-w-[600px] font-body text-[18px] text-muted leading-relaxed">
              {project.description}
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 border-b border-white reveal opacity-0">
        <ImageCarousel images={project.images} projectTitle={project.title} />
      </section>

      {/* Details Two-Column */}
      <section className="py-16 reveal opacity-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
          
          {/* Left: About */}
          <div className="md:col-span-7 md:pr-8 md:border-r border-white flex flex-col gap-6">
            <h2 className="font-mono text-[14px] uppercase text-teal">— ABOUT_THIS_PROJECT</h2>
            <div className="font-mono text-[13px] text-muted flex flex-col gap-4 max-w-[500px] leading-[1.6]">
              {/* Assuming longDescription might have line breaks, split into paragraphs */}
              {project.longDescription.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          
          {/* Right: Info Panel */}
          <div className="md:col-span-5 md:pl-8 flex flex-col gap-8">
            <div className="bg-[#0A0A0A] border border-white p-6 flex flex-col gap-6">
              
              <div className="flex justify-between items-center border-b border-white pb-4 font-mono text-[14px] uppercase">
                <span className="text-muted">YEAR</span>
                <span className="text-white">{project.year}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white pb-4 font-mono text-[14px] uppercase">
                <span className="text-muted">ROLE</span>
                <span className="text-white">{project.role}</span>
              </div>
              
              <div className="flex flex-col gap-4 pt-2">
                <span className="font-mono text-[14px] uppercase text-muted">STACK</span>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-black border border-white font-mono text-[12px] uppercase text-white">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="py-4 border border-white bg-transparent text-white transition-all duration-200 hover:bg-white hover:text-black flex flex-col items-center justify-center gap-2 font-mono text-[14px] uppercase"
              >
                <span className="material-symbols-outlined text-[24px]">code</span>
                <span>VIEW GITHUB</span>
              </a>
              
              {project.liveUrl && project.liveUrl !== '#' && (
                <a 
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-4 border border-teal bg-teal text-black transition-all duration-200 hover:bg-white hover:border-white hover:text-black flex flex-col items-center justify-center gap-2 font-mono text-[14px] uppercase"
                >
                  <span className="material-symbols-outlined text-[24px]">open_in_new</span>
                  <span>LIVE SITE</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Next Project Teaser */}
      <button 
        onClick={() => navigate(`/projects/${nextProject.slug}`)}
        className="block w-full text-left py-16 mt-16 border-t border-border-mid hover:border-teal transition-colors group reveal opacity-0 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[rgba(0,229,204,0.05)] opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[14px] uppercase text-muted group-hover:text-teal transition-colors">NEXT PROJECT_</span>
            <div className="flex items-center gap-4">
              <h3 className="font-display uppercase text-white m-0 text-[48px]">{nextProject.title}</h3>
              <span className="material-symbols-outlined text-teal text-[48px] transform group-hover:translate-x-4 transition-transform">arrow_forward</span>
            </div>
          </div>
          
          <div className="w-[200px] h-[120px] bg-[#111] border border-white group-hover:border-teal transition-colors overflow-hidden relative">
            <img 
              src={nextProject.images?.[0] || nextProject.thumbnail}
              alt={nextProject.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      </button>

    </div>
  )
}
