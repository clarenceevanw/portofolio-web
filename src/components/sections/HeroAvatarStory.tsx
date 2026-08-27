'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AVATAR_FRAME_COUNT, getAvatarFrameSrc, useAvatarFrames } from '@/hooks/useAvatarFrames'
import { usePageNavigation } from '@/hooks/usePageNavigation'

type StoryPlacement = 'right' | 'topRight' | 'topLeft' | 'left' | 'bottomLeft' | 'bottomRight'

type StoryCheckpoint = {
  id: string
  label: string
  direction: string
  start: number
  end: number
  frame: number
  placement: StoryPlacement
  text: string
}

const ROLE_BADGES = ['Software Engineer', 'CS Student', 'Lab Assistant']
const SKILL_BADGES = ['LARAVEL', 'JAVA', 'PHP', 'PYTHON', 'REACT', 'NEXT.JS', 'TYPESCRIPT']
const MOBILE_ABOUT_PARAGRAPHS = [
  "HELLO_WORLD.exe - I'm a Software Engineer and 4th-semester Computer Science student at Petra Christian University, based in Surabaya, Indonesia. I build scalable web applications, real-time platforms, and full-stack systems using Laravel and Next.js.",
  'My experience spans backend architecture, authentication systems, WebSocket communication, database design, and deployment pipelines. Currently serving as both a Laboratory Assistant and Teaching Assistant, I enjoy building software, solving complex problems, and helping others understand how technology works beneath the surface.',
]

const AVATAR_PRIORITY_FRAMES = [1, 24, 44, 70, 95, 123, 150, 180]
const MOBILE_PROFILE_PHOTO = '/assets/avatar/profile-remove.png'
const HERO_CHROME_FADE_START = 0.05
const HERO_CHROME_FADE_END = 0.12

export const AVATAR_STORY_CHECKPOINTS: StoryCheckpoint[] = [
  {
    id: 'right',
    label: 'HELLO_WORLD.exe',
    direction: 'right',
    start: 0.1,
    end: 0.24,
    frame: 30,
    placement: 'right',
    text: "I'm a Software Engineer and 4th-semester Computer Science student at Petra Christian University, based in Surabaya, Indonesia.",
  },
  {
    id: 'up-right',
    label: 'FULL_STACK.systems',
    direction: 'right-up',
    start: 0.25,
    end: 0.42,
    frame: 58,
    placement: 'topRight',
    text: 'I build scalable web applications, real-time platforms, and full-stack systems using Laravel and Next.js.',
  },
  {
    id: 'left',
    label: 'BACKEND_ARCHITECTURE.log',
    direction: 'left',
    start: 0.43,
    end: 0.6,
    frame: 95,
    placement: 'topLeft',
    text: 'My experience spans backend architecture, authentication systems, WebSocket communication, database design, and deployment pipelines.',
  },
  {
    id: 'down-left',
    label: 'TEACHING_ASSISTANT.md',
    direction: 'left-down',
    start: 0.61,
    end: 0.78,
    frame: 123,
    placement: 'bottomLeft',
    text: 'Currently serving as both a Laboratory Assistant and Teaching Assistant, I enjoy solving complex problems and helping others understand how technology works beneath the surface.',
  },
  {
    id: 'center-return',
    label: 'READY_TO_BUILD',
    direction: 'center',
    start: 0.79,
    end: 1,
    frame: 180,
    placement: 'bottomRight',
    text: 'The stack is practical, the systems thinking is intentional, and the next build is already waiting.',
  },
]

const STORY_PANEL_POSITION: Record<StoryPlacement, string> = {
  right: 'right-[4vw] top-[42%]',
  topRight: 'right-[4vw] top-[17%]',
  topLeft: 'left-[4vw] top-[16%]',
  left: 'left-[4vw] top-[42%]',
  bottomLeft: 'left-[4vw] bottom-[15%]',
  bottomRight: 'right-[4vw] bottom-[15%]',
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(media.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    setIsDesktop(media.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return isDesktop
}

function getActiveCheckpoint(progress: number) {
  return (
    AVATAR_STORY_CHECKPOINTS.find(
      (checkpoint) => progress >= checkpoint.start && progress <= checkpoint.end
    ) ?? null
  )
}

function getHeroChromeOpacity(progress: number) {
  if (progress <= HERO_CHROME_FADE_START) return 1
  if (progress >= HERO_CHROME_FADE_END) return 0

  const fadeProgress =
    (progress - HERO_CHROME_FADE_START) / (HERO_CHROME_FADE_END - HERO_CHROME_FADE_START)
  return 1 - fadeProgress
}

export function HeroAvatarStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const avatarRef = useRef<HTMLImageElement>(null)
  const [currentFrame, setCurrentFrame] = useState(1)
  const [activeCheckpointId, setActiveCheckpointId] = useState<string | null>(null)
  const [storyProgress, setStoryProgress] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDesktop = useIsDesktop()
  const { navigate } = usePageNavigation()
  const { getFrameSrc } = useAvatarFrames({
    enabled: isDesktop && !prefersReducedMotion,
    priorityFrames: AVATAR_PRIORITY_FRAMES,
  })

  useLayoutEffect(() => {
    if (prefersReducedMotion) return

    let ctx: { revert: () => void } | undefined

    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const section = sectionRef.current
        const avatar = avatarRef.current

        if (!section || !avatar) return

        gsap.set('.avatar-story-fade', { opacity: 0, y: 20 })
        gsap.to('.avatar-story-fade', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        })

        const media = gsap.matchMedia()

        media.add('(min-width: 768px)', () => {
          const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextFrame = Math.min(
                AVATAR_FRAME_COUNT,
                Math.max(1, Math.floor(self.progress * (AVATAR_FRAME_COUNT - 1)) + 1)
              )
              const nextCheckpoint = getActiveCheckpoint(self.progress)

              setCurrentFrame((frame) => (frame === nextFrame ? frame : nextFrame))
              setActiveCheckpointId((id) => (id === nextCheckpoint?.id ? id : nextCheckpoint?.id ?? null))
              setStoryProgress(self.progress)
            },
          })

          return () => {
            trigger.kill()
            setCurrentFrame(1)
            setActiveCheckpointId(null)
            setStoryProgress(0)
          }
        })

        ScrollTrigger.refresh()

        return () => {
          media.revert()
        }
      }, sectionRef)
    }

    initGSAP()

    return () => {
      ctx?.revert()
    }
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentFrame(1)
      setActiveCheckpointId(null)
      setStoryProgress(1)
    }
  }, [prefersReducedMotion])

  const avatarSrc = prefersReducedMotion ? getAvatarFrameSrc(1) : getFrameSrc(currentFrame)
  const showFinalDock = prefersReducedMotion || storyProgress > 0.78
  const heroChromeOpacity = prefersReducedMotion ? 1 : getHeroChromeOpacity(storyProgress)
  const heroChromePointerEvents = heroChromeOpacity > 0.35 ? 'auto' : 'none'

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative z-20 w-full text-white ${
        prefersReducedMotion
          ? 'min-h-screen overflow-visible px-4 py-24 md:px-10 lg:px-16'
          : 'min-h-screen overflow-visible px-4 py-24 md:h-[100svh] md:min-h-[720px] md:overflow-hidden md:px-10 md:pb-0 md:pt-24 lg:px-16'
      }`}
    >
      {/* The sequence is full-bleed now so the avatar reads like a laptop-sized scene, not a small floating portrait. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={avatarRef}
        src={avatarSrc}
        alt="Clarence Evan cartoon avatar"
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full select-none object-cover object-center opacity-95 md:block"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 z-10 hidden bg-[radial-gradient(circle_at_50%_42%,transparent_18%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.88)_100%)] md:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-56 bg-gradient-to-b from-black via-black/60 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-64 bg-gradient-to-t from-black via-black/70 to-transparent md:block" />

      <div className="relative z-20 mx-auto hidden h-full w-full max-w-[1440px] grid-rows-[auto_1fr_auto] pb-8 md:grid">
        <header
          className="avatar-story-fade relative z-30 flex justify-center transition-[opacity,transform] duration-500 ease-out"
          style={{
            opacity: heroChromeOpacity,
            transform: `translate3d(0, ${-22 * (1 - heroChromeOpacity)}px, 0)`,
          }}
        >
          <h1 className="text-center font-display text-[clamp(62px,14vw,176px)] uppercase leading-none text-white">
            Clarence Evan
          </h1>
        </header>

        <div className="relative z-20 grid min-h-0 flex-1 place-items-center">
          <div className="relative grid h-full w-full place-items-center">
            <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
              {AVATAR_STORY_CHECKPOINTS.map((checkpoint) => {
                const isActive = prefersReducedMotion || activeCheckpointId === checkpoint.id
                return (
                  <article
                    key={checkpoint.id}
                    className={`absolute w-[min(31vw,430px)] font-mono transition-all duration-500 ease-out ${STORY_PANEL_POSITION[checkpoint.placement]} ${
                      isActive ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                    }`}
                  >
                    <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[1px] text-teal">
                      <span className="h-px w-12 bg-teal" aria-hidden="true" />
                      {checkpoint.label}
                    </div>
                    <p className="text-[14px] leading-[1.85] text-white/85 [text-shadow:0_2px_24px_rgba(0,0,0,0.95)]">
                      {checkpoint.text}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>

        <div className="avatar-story-fade relative z-30 grid gap-5 md:grid-cols-[minmax(240px,360px)_1fr_minmax(250px,360px)] md:items-end">
          <div
            className="order-2 transition-[opacity,transform] duration-500 ease-out md:order-1"
            style={{
              opacity: heroChromeOpacity,
              pointerEvents: heroChromePointerEvents,
              transform: `translate3d(${-18 * (1 - heroChromeOpacity)}px, ${14 * (1 - heroChromeOpacity)}px, 0)`,
            }}
          >
            <div className="mb-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest text-teal">
              <span className="block h-px w-12 bg-teal" />
              SOFTWARE ENGINEER
            </div>
            <p className="max-w-[360px] font-mono text-[13px] leading-[1.8] text-muted">
              Building scalable systems, real-time platforms, and digital products that solve real-world problems.
            </p>
          </div>

          <div
            className={`order-3 flex flex-col items-start gap-4 transition-all duration-700 md:order-2 md:items-center ${
              showFinalDock ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <div className="flex flex-wrap gap-3 md:justify-center">
              {SKILL_BADGES.map((skill) => (
                <span
                  key={skill}
                  className="border border-border-mid px-3 py-1 font-mono text-[10px] uppercase tracking-[1px] text-muted transition-colors hover:border-teal hover:text-white"
                >
                  [{skill}]
                </span>
              ))}
            </div>
            {/* Resume and skills live in this late-story dock so the old About actions conclude the pinned bio arc. */}
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="border border-white px-7 py-3 font-mono text-[12px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black"
            >
              DOWNLOAD RESUME
            </a>
          </div>

          <div
            className="order-1 flex flex-col items-start gap-5 transition-[opacity,transform] duration-500 ease-out md:order-3 md:items-end"
            style={{
              opacity: heroChromeOpacity,
              pointerEvents: heroChromePointerEvents,
              transform: `translate3d(${18 * (1 - heroChromeOpacity)}px, ${14 * (1 - heroChromeOpacity)}px, 0)`,
            }}
          >
            <div className="flex flex-wrap gap-3 md:justify-end">
              {ROLE_BADGES.map((label) => (
                <span
                  key={label}
                  className="border border-border-mid bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[1px] text-teal transition-colors hover:border-teal hover:bg-[rgba(0,229,204,0.1)]"
                >
                  [ {label} ]
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="group flex items-center justify-center gap-3 border border-white bg-transparent px-8 py-[14px] font-mono text-[13px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black"
              type="button"
            >
              SEE MY WORK <span aria-hidden="true">-&gt;</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-[520px] flex-col justify-start gap-5 md:hidden">
        <header className="avatar-story-fade">
          <h1 className="text-center font-display text-[clamp(52px,17vw,78px)] uppercase leading-none text-white">
            Clarence Evan
          </h1>
        </header>

        <div className="avatar-story-fade relative mx-auto mt-8 mb-4 h-56 w-56">
          {/* Solid background circle */}
          <div className="absolute inset-0 rounded-full bg-teal" />
          
          {/* Lower half - masked by circle */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOBILE_PROFILE_PHOTO}
              alt="Clarence Evan profile photo"
              className="absolute bottom-0 left-1/2 w-[125%] max-w-none -translate-x-1/2 select-none object-cover object-bottom"
              draggable={false}
            />
          </div>

          {/* Upper half - pops out */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ clipPath: 'inset(-50% -50% 50% -50%)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={MOBILE_PROFILE_PHOTO}
              alt="Clarence Evan profile photo"
              className="absolute bottom-0 left-1/2 w-[125%] max-w-none -translate-x-1/2 select-none object-cover object-bottom"
              draggable={false}
            />
          </div>
        </div>

        <div className="avatar-story-fade grid gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {ROLE_BADGES.map((label) => (
              <span
                key={label}
                className="bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[1px] text-teal"
              >
                [ {label} ]
              </span>
            ))}
          </div>

          <div className="px-4 py-4 text-center">
            <p className="font-mono text-[12px] leading-[1.7] text-muted">
              Building scalable systems, real-time platforms, and digital products that solve real-world problems.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects')}
            className="mx-auto flex items-center justify-center gap-3 border border-white bg-white px-7 py-3 font-mono text-[12px] uppercase text-black transition-colors duration-200 hover:bg-transparent hover:text-white"
            type="button"
          >
            SEE MY WORK <span aria-hidden="true">-&gt;</span>
          </button>
        </div>

        <div className="avatar-story-fade mt-12 grid gap-5 px-4 py-5 font-mono">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[1px] text-teal">
            <span className="h-px w-10 bg-teal" aria-hidden="true" />
            ABOUT.tsx
          </div>
          <div className="grid gap-4">
            {MOBILE_ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph} className="text-[12px] leading-[1.85] text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="avatar-story-fade grid gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {SKILL_BADGES.map((skill) => (
              <span
                key={skill}
                className="border border-border-mid px-2.5 py-1 font-mono text-[10px] uppercase tracking-[1px] text-muted"
              >
                [{skill}]
              </span>
            ))}
          </div>
          <a
            href="/assets/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="mx-auto border border-white px-6 py-2.5 font-mono text-[11px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black"
          >
            DOWNLOAD RESUME
          </a>
        </div>
      </div>
    </section>
  )
}
