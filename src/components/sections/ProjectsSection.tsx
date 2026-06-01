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

        // Function to calculate exact scroll distance needed
        const getTrackWidth = () => track.scrollWidth - window.innerWidth;

        // Apply height dynamically so CSS sticky has room to scroll
        const applyHeight = () => {
          section.style.height = `${getTrackWidth() + window.innerHeight}px`;
        };
        applyHeight(); // Set initially

        const tween = gsap.to(track, {
          x: () => -getTrackWidth(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getTrackWidth()}`, 
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: applyHeight // Update height if window resizes
          },
        });

        // Animate title stagger
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

        ScrollTrigger.refresh();
      }, sectionRef);
    };

    initGSAP();

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-transparent z-10">
      {/* CSS Sticky pins the container naturally without GSAP DOM manipulation conflicts */}
      <div className="sticky top-0 w-full h-screen flex flex-col justify-center overflow-hidden pointer-events-none">
        
        {/* Header container in normal flow so cards naturally render below it, avoiding any overlap */}
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

        <div ref={trackRef} className="projects-track flex flex-row gap-[32px] pl-[10vw] pr-0 w-fit relative z-10 pointer-events-auto items-center">
          {projects.slice(0, 5).map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/projects/${project.slug}`)} 
            />
          ))}
          
          <div className="w-[100vw] h-[70vh] border-l border-border flex flex-col justify-center items-center shrink-0">
            <div className="font-mono text-[11px] text-teal uppercase mb-4 tracking-[1px]">SEE ALL</div>
            <h2 className="font-display text-[clamp(60px,8vw,120px)] text-white uppercase leading-none m-0">PROJECTS</h2>
            <div className="text-[80px] text-teal my-8">→</div>
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
