import React from 'react'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  featured?: boolean // included to prevent prop errors on /projects page
  fullWidth?: boolean
  onClick?: () => void
}

export function ProjectCard({ project, fullWidth = false, onClick }: ProjectCardProps) {
  return (
    <div 
      className={`project-card group relative ${fullWidth ? 'w-full' : 'w-[30vw] min-w-[380px]'} h-[480px] bg-[#111] border border-[#2a2a2a] flex flex-col shrink-0 cursor-pointer overflow-hidden transition-all duration-300 hover:border-teal hover:shadow-[0_0_20px_rgba(0,229,204,0.2)] rounded-none`}
      onClick={onClick}
    >
      {/* Hover Shimmer Effect */}
      <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] transition-[left] duration-500 z-10 pointer-events-none group-hover:left-[200%]"></div>
      
      {/* Thumbnail Container */}
      <div className="h-[60%] w-full bg-[#1a1a1a] relative overflow-hidden">
        <div className="absolute inset-0 diagonal-pattern z-0 opacity-50"></div>
        <div 
          className="w-full h-full bg-transparent transition-transform duration-500 group-hover:scale-[1.08] bg-cover bg-center z-10 relative"
          style={{ backgroundImage: `url(${project.images?.[0] || project.thumbnail})` }}
        ></div>
      </div>
      
      {/* Details */}
      <div className="h-[40%] w-full p-6 flex flex-col relative z-20 bg-[#111]">
        <span className="absolute top-6 right-6 font-display text-6xl opacity-20 text-white leading-none m-0 p-0 pointer-events-none">
          {project.number}
        </span>
        
        <div className="pr-16 mb-auto relative z-10">
          <h3 className="font-display text-[22px] uppercase text-white mb-2">
            {project.title}
          </h3>
          <p className="font-mono text-[12px] text-[#777] line-clamp-2 uppercase">
            {project.techStack.join(' / ')}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {project.techStack.map(tech => (
            <span key={tech} className="px-2 py-1 border border-[#333] text-[10px] font-mono text-[#777] uppercase">
              [{tech}]
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
