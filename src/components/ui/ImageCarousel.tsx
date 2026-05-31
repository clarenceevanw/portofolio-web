'use client'

import React, { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ImageCarouselProps {
  images: string[]
  projectTitle: string
}

export function ImageCarousel({ images, projectTitle }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleNext = () => {
    if (!trackRef.current) return
    const scrollAmount = window.innerWidth * 0.6
    trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  const handlePrev = () => {
    if (!trackRef.current) return
    const scrollAmount = window.innerWidth * 0.6
    trackRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }

  const handleOpenPreview = (img: string) => {
    setPreviewImage(img)
    setTimeout(() => setShowModal(true), 10)
  }

  const handleClosePreview = () => {
    setShowModal(false)
    setTimeout(() => setPreviewImage(null), 300)
  }

  return (
    <>
      <div className="relative w-full border border-border-mid bg-[#0A0A0A]">
        {/* Track */}
        <div 
          ref={trackRef}
          className="h-[60vh] min-h-[400px] flex items-center gap-[1px] overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images.map((img, idx) => (
            <div 
              key={idx}
              className="flex-none scroll-snap-align-start h-full min-w-[85vw] md:min-w-[70vw] border-r border-border-mid relative bg-[#131313] flex items-center justify-center overflow-hidden cursor-pointer group"
              style={{ scrollSnapAlign: 'start' }}
              onClick={() => handleOpenPreview(img)}
            >
              {/* Background pattern if no image */}
              <div className="absolute inset-0 diagonal-pattern opacity-50 z-0"></div>
              
              <img 
                src={img} 
                alt={`${projectTitle} screenshot ${idx + 1}`}
                className="absolute inset-0 w-full h-full object-cover z-0 select-none transition-transform duration-500 group-hover:scale-[1.02]"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-5xl">fullscreen</span>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none z-30">
          <button 
            onClick={handlePrev}
            className="w-[48px] h-[48px] bg-black border border-[#333] flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button 
            onClick={handleNext}
            className="w-[48px] h-[48px] bg-black border border-[#333] flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black hover:border-white transition-colors"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewImage && typeof document !== 'undefined' && createPortal(
        <div 
          className={`fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-12 backdrop-blur-sm cursor-zoom-out transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleClosePreview}
        >
          <button 
            className="absolute top-8 right-8 text-white hover:text-teal transition-colors"
            onClick={(e) => { e.stopPropagation(); handleClosePreview(); }}
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <img 
            src={previewImage} 
            alt="Fullscreen preview" 
            className={`max-w-full max-h-full object-contain border border-border-mid shadow-2xl transition-all duration-300 ${showModal ? 'scale-100' : 'scale-95'}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </>
  )
}
