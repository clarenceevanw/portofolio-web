'use client'

import { useLayoutEffect, useRef } from 'react'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { usePageNavigation } from '@/hooks/usePageNavigation'

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { navigate } = usePageNavigation()

  useLayoutEffect(() => {
    let ctx: any;

    const initGSAP = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        // Animate title stagger (applies to both mobile and desktop)
        gsap.to('.projects-heading span', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            once: true
          }
        });

        // Use matchMedia to only apply GSAP horizontal scroll on desktop (>= 768px)
        const mm = gsap.matchMedia();
        
        mm.add("(min-width: 768px)", () => {
          // Function to calculate exact scroll distance needed
          const getTrackWidth = () => track.scrollWidth - window.innerWidth;

          // Apply height dynamically so CSS sticky has room to scroll
          const applyHeight = () => {
            section.style.height = `${getTrackWidth() + window.innerHeight}px`;
          };
          applyHeight(); // Set initially

          gsap.to(track, {
            x: () => -getTrackWidth(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${getTrackWidth()}`, 
              scrub: true, // using true instead of 1 is less laggy on lower-end devices
              invalidateOnRefresh: true,
              onRefresh: applyHeight
            },
          });
          
          return () => {
            // Cleanup height when reverting (e.g., resizing to mobile)
            section.style.height = 'auto';
          }
        });

        ScrollTrigger.refresh();
      }, sectionRef);
    };

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent z-10 md:h-auto">
      {/* CSS Sticky pins the container on desktop, static on mobile */}
      <div className="md:sticky md:top-0 w-full md:h-screen flex flex-col justify-center overflow-hidden pointer-events-none pt-24 pb-16 md:py-0">
        
        {/* Header container in normal flow */}
        <div className="w-full px-4 md:px-16 mb-8 z-20 relative">
          <div className="inline-block overflow-hidden">
            <div className="font-mono text-teal text-[11px] uppercase tracking-[1px] mb-2">—  PROJECTS.tsx</div>
            <h2 className="projects-heading font-display text-[clamp(48px,6vw,80px)] uppercase m-0 leading-none text-white mb-2 overflow-hidden">
              {'PROJECTS'.split('').map((char, i) => (
                <span key={i} className="inline-block translate-y-[80px] opacity-0">{char}</span>
              ))}
            </h2>
            <div className="w-full h-[2px] bg-teal"></div>
          </div>
        </div>

        {/* Track uses native scroll on mobile, GSAP translate on desktop */}
        <div ref={trackRef} className="projects-track flex flex-row gap-[16px] md:gap-[32px] pl-[5vw] md:pl-[10vw] pr-[5vw] md:pr-0 w-full md:w-fit relative z-10 pointer-events-auto items-center overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none hide-scrollbar">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="snap-center shrink-0">
              <ProjectCard 
                project={project} 
                onClick={() => navigate(`/projects/${project.slug}`)} 
              />
            </div>
          ))}
          
          <div className="w-[85vw] md:w-[100vw] h-[480px] md:h-[70vh] border-l border-border flex flex-col justify-center items-center shrink-0 snap-center bg-[#0a0a0a] md:bg-transparent">
            <div className="font-mono text-[11px] text-teal uppercase mb-4 tracking-[1px]">SEE ALL</div>
            <h2 className="font-display text-[clamp(48px,8vw,120px)] text-white uppercase leading-none m-0">PROJECTS</h2>
            <div className="text-[60px] md:text-[80px] text-teal my-8">→</div>
            <button 
              onClick={() => navigate('/projects')}
              className="font-mono text-[13px] text-white border border-white px-8 py-[14px] hover:bg-white hover:text-black transition-colors rounded-none"
            >
              VIEW FULL ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
