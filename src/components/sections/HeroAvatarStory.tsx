'use client'

import { useLayoutEffect, useRef, useSyncExternalStore } from 'react'
import { usePageNavigation } from '@/hooks/usePageNavigation'
import { HeroCharacterCanvas, HeroCharacterHandle } from '@/components/three/HeroCharacterCanvas'

type StoryCheckpoint = {
  id: string
  label: string
  direction: string
  start: number
  end: number
  headline: string[]
  text: string
}

const ROLE_BADGES = ['Software Engineer', 'CS Student', 'Lab Assistant']
const SKILL_BADGES = ['LARAVEL', 'JAVA', 'PHP', 'PYTHON', 'REACT', 'NEXT.JS', 'TYPESCRIPT']
const MOBILE_ABOUT_PARAGRAPHS = [
  "HELLO_WORLD.exe - I'm a Software Engineer and 4th-semester Computer Science student at Petra Christian University, based in Surabaya, Indonesia. I build scalable web applications, real-time platforms, and full-stack systems using Laravel and Next.js.",
  'My experience spans backend architecture, authentication systems, WebSocket communication, database design, and deployment pipelines. Currently serving as both a Laboratory Assistant and Teaching Assistant, I enjoy building software, solving complex problems, and helping others understand how technology works beneath the surface.',
]

const MOBILE_PROFILE_PHOTO = '/assets/avatar/profile-remove.png'
const HERO_CHROME_FADE_START = 0.05
const HERO_CHROME_FADE_END = 0.12
const HERO_SCROLL_SCREENS = 4.8

export const AVATAR_STORY_CHECKPOINTS: StoryCheckpoint[] = [
  {
    id: 'right',
    label: 'HELLO_WORLD.exe',
    direction: 'right',
    start: 0.30,
    end: 0.42,
    headline: ['SOFTWARE', 'ENGINEER'],
    text: "I'm a Software Engineer and 4th-semester Computer Science student at Petra Christian University, based in Surabaya, Indonesia.",
  },
  {
    id: 'up-right',
    label: 'FULL_STACK.systems',
    direction: 'right-up',
    start: 0.42,
    end: 0.54,
    headline: ['NEXT.JS', 'LARAVEL', 'REAL-TIME'],
    text: 'I build scalable web applications, real-time platforms, and full-stack systems using Laravel and Next.js.',
  },
  {
    id: 'left',
    label: 'BACKEND_ARCHITECTURE.log',
    direction: 'left',
    start: 0.54,
    end: 0.66,
    headline: ['SYSTEMS', 'BENEATH', 'THE UI'],
    text: 'My experience spans backend architecture, authentication systems, WebSocket communication, database design, and deployment pipelines.',
  },
  {
    id: 'down-left',
    label: 'TEACHING_ASSISTANT.md',
    direction: 'left-down',
    start: 0.66,
    end: 0.78,
    headline: ['BUILD.', 'EXPLAIN.', 'ENABLE.'],
    text: 'Currently serving as both a Laboratory Assistant and Teaching Assistant, I enjoy solving complex problems and helping others understand how technology works beneath the surface.',
  },
  {
    id: 'center-return',
    label: 'READY_TO_BUILD',
    direction: 'center',
    start: 0.90,
    end: 1,
    headline: ['READY', 'TO BUILD'],
    text: 'The stack is practical, the systems thinking is intentional, and the next build is already waiting.',
  },
]

const subscribeToMedia = (query: string, callback: () => void) => {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToMedia(query, callback),
    () => window.matchMedia(query).matches,
    () => false
  )
}

type OrbitStateName =
  | 'rightOuterFront'
  | 'rightNearFront'
  | 'rightFront'
  | 'previousLeft'
  | 'foregroundExit'
  | 'gone'

type OrbitState = {
  x: number
  y: number
  z: number
  rotationX: number
  rotationY: number
  scale: number
  opacity: number
  parallax: number
}

// Every checkpoint enters from the front-right, wraps behind the character,
// reappears at the mirrored front-left position, then exits toward the viewer.
// At integer steps, the active checkpoint sits on the right while the previous
// checkpoint keeps the same visual strength on the left.
const ORBIT_STATES: Record<OrbitStateName, OrbitState> = {
  rightOuterFront: { x: 0, y: 8, z: 320, rotationX: 5, rotationY: -28, scale: 1.18, opacity: 0, parallax: 0.64 },
  rightNearFront: { x: 8, y: 3, z: 220, rotationX: 2, rotationY: -16, scale: 1.08, opacity: 0.2, parallax: 0.6 },
  rightFront: { x: 28, y: -2, z: 100, rotationX: 0, rotationY: -5, scale: 1, opacity: 1, parallax: 0.55 },
  previousLeft: { x: -24, y: -2, z: 100, rotationX: 0, rotationY: 5, scale: 0.96, opacity: 1, parallax: 0.55 },
  foregroundExit: { x: -37, y: 5, z: 230, rotationX: 4, rotationY: 16, scale: 1.1, opacity: 0.4, parallax: 0.52 },
  gone: { x: -49, y: 11, z: 300, rotationX: 5, rotationY: 22, scale: 1.16, opacity: 0, parallax: 0.58 },
}

function outgoingOrbitState(progress: number): OrbitState {
  const t = clamp01(progress)
  const angle = Math.PI * t
  const depth = Math.sin(angle)
  const side = Math.cos(angle)
  const horizontalRadius = mix(28, 24, t)

  return {
    x: horizontalRadius * side,
    y: mix(-2, -2, t) + depth * 8,
    z: 100 - depth * 460,
    rotationX: -depth * 4,
    rotationY: mix(-5, 5, t),
    scale: mix(1, 0.96, t) - depth * 0.22,
    opacity: Math.pow(Math.abs(side), 1.35),
    parallax: 0.55 - depth * 0.43,
  }
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
const smoothstep = (value: number) => {
  const t = clamp01(value)
  return t * t * (3 - 2 * t)
}
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress

function interpolateState(from: OrbitState, to: OrbitState, progress: number): OrbitState {
  const t = smoothstep(progress)
  return {
    x: mix(from.x, to.x, t),
    y: mix(from.y, to.y, t),
    z: mix(from.z, to.z, t),
    rotationX: mix(from.rotationX, to.rotationX, t),
    rotationY: mix(from.rotationY, to.rotationY, t),
    scale: mix(from.scale, to.scale, t),
    opacity: mix(from.opacity, to.opacity, t),
    parallax: mix(from.parallax, to.parallax, t),
  }
}

function stateForDistance(distance: number) {
  if (distance >= 1) return ORBIT_STATES.rightOuterFront
  if (distance > 0.5) {
    return interpolateState(ORBIT_STATES.rightNearFront, ORBIT_STATES.rightOuterFront, (distance - 0.5) * 2)
  }
  if (distance > 0) {
    return interpolateState(ORBIT_STATES.rightFront, ORBIT_STATES.rightNearFront, distance * 2)
  }
  if (distance > -1) {
    return outgoingOrbitState(-distance)
  }
  if (distance > -1.2) {
    return interpolateState(ORBIT_STATES.previousLeft, ORBIT_STATES.foregroundExit, (-distance - 1) * 5)
  }
  if (distance > -1.5) {
    return interpolateState(ORBIT_STATES.foregroundExit, ORBIT_STATES.gone, (-distance - 1.2) / 0.3)
  }
  return ORBIT_STATES.gone
}

export function orbitPose(index: number, step: number, reveal: number, disperse: number) {
  const distance = index - step
  const state = stateForDistance(distance)
  // Incoming copy stays invisible until it is near its final right-side position.
  // Previous copy keeps its full composition until the foreground exit begins.
  const readabilityWindow = distance < 0 ? 0.16 : 0.24
  const readable = 1 - smoothstep((Math.abs(distance) - 0.04) / readabilityWindow)
  const activeBody = smoothstep((readable - 0.5) / 0.5)
  const previousBody = 1 - smoothstep((-distance - 1) / 0.24)
  const bodyReadable = distance < 0 ? previousBody : activeBody
  // The incoming panel starts on the foreground layer and settles onto the side
  // layer near its active position. The outgoing panel does the inverse on the left.
  const incomingForeground = smoothstep((distance - 0.1) / 0.2)
  const outgoingForeground = smoothstep((-distance - 0.86) / 0.11)
  const foreground = Math.max(incomingForeground, outgoingForeground)
  const incomingFade = distance > 0
    ? 1 - smoothstep((distance - 0.02) / 0.38)
    : 1
  const visibility = reveal * (1 - disperse)
  const direction = Math.sign(state.x) || 1

  return {
    x: `${state.x + direction * disperse * 9}vw`,
    y: `${state.y - disperse * 5}vh`,
    z: state.z - disperse * 420,
    rotationX: state.rotationX,
    rotationY: state.rotationY + direction * disperse * 3,
    scale: state.scale * (1 - disperse * 0.12),
    opacity: state.opacity * incomingFade * visibility,
    label: 1,
    headline: 1,
    body: bodyReadable,
    parallax: state.parallax,
    readable,
    foreground,
  }
}

export function HeroAvatarStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const characterRef = useRef<HeroCharacterHandle>(null)
  const perspectiveRef = useRef<HTMLDivElement>(null)
  const frontPerspectiveRef = useRef<HTMLDivElement>(null)
  const headlineRefs = useRef<(HTMLElement | null)[]>([])
  const foregroundHeadlineRefs = useRef<(HTMLElement | null)[]>([])
  const headlineParallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const foregroundParallaxRefs = useRef<(HTMLDivElement | null)[]>([])
  const heroTitleRef = useRef<HTMLElement>(null)
  const introLeftRef = useRef<HTMLDivElement>(null)
  const introRightRef = useRef<HTMLDivElement>(null)
  const skillsRowRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<HTMLAnchorElement>(null)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { navigate } = usePageNavigation()

  useLayoutEffect(() => {
    if (prefersReducedMotion || !isDesktop) {
      characterRef.current?.setProgress(prefersReducedMotion ? 1 : 0)
      return
    }

    let ctx: { revert: () => void } | undefined
    let cancelled = false
    let pointerResetTimer: ReturnType<typeof setTimeout> | undefined
    let removePointerListeners: (() => void) | undefined
    const videoElement = videoRef.current
    const headlineElements = headlineRefs.current.slice()
    const foregroundHeadlineElements = foregroundHeadlineRefs.current.slice()

    const initGSAP = async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const section = sectionRef.current
        const video = videoRef.current
        const panels = headlineElements.filter((panel): panel is HTMLElement => Boolean(panel))
        const foregroundPanels = foregroundHeadlineElements.filter((panel): panel is HTMLElement => Boolean(panel))

        if (!section) return

        gsap.set('.avatar-story-fade', { opacity: 0, y: 20 })
        gsap.to('.avatar-story-fade', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
        })

        const orbit = { step: -1, reveal: 0, disperse: 0, progress: 0 }
        const contents = panels.map((panel) => ({
          label: panel.querySelector<HTMLElement>('[data-orbit-label]'),
          headline: panel.querySelector<HTMLElement>('h2'),
          body: panel.querySelector<HTMLElement>('p'),
        }))
        const foregroundContents = foregroundPanels.map((panel) => ({
          label: panel.querySelector<HTMLElement>('[data-orbit-label]'),
          headline: panel.querySelector<HTMLElement>('h2'),
          body: panel.querySelector<HTMLElement>('p'),
        }))
        const parallaxMultipliers: number[] = panels.map(() => 0.12)
        // Register initial styles with the context so media changes restore them.
        gsap.set([...panels, ...foregroundPanels], { opacity: 0, transformOrigin: '50% 50%' })
        ;[...contents, ...foregroundContents].forEach((content) => {
          gsap.set([content.label, content.headline, content.body].filter(Boolean), { opacity: 1 })
        })
        const orbitSetters = panels.map((panel, index) => ({
            panel,
            foregroundPanel: foregroundPanels[index],
            orbitIndex: index,
            opacity: gsap.quickSetter(panel, 'opacity'),
            foregroundOpacity: foregroundPanels[index]
              ? gsap.quickSetter(foregroundPanels[index], 'opacity')
              : null,
            label: contents[index].label ? gsap.quickSetter(contents[index].label, 'opacity') : null,
            headline: contents[index].headline ? gsap.quickSetter(contents[index].headline, 'opacity') : null,
            body: contents[index].body ? gsap.quickSetter(contents[index].body, 'opacity') : null,
            foregroundLabel: foregroundContents[index]?.label
              ? gsap.quickSetter(foregroundContents[index].label, 'opacity')
              : null,
            foregroundHeadline: foregroundContents[index]?.headline
              ? gsap.quickSetter(foregroundContents[index].headline, 'opacity')
              : null,
            foregroundBody: foregroundContents[index]?.body
              ? gsap.quickSetter(foregroundContents[index].body, 'opacity')
              : null,
          }))
        const renderOrbit = () => {
          orbitSetters.forEach((setter) => {
            const panel = setter.panel
            const index = setter.orbitIndex
            const { label, headline, body, parallax, readable, foreground, ...pose } = orbitPose(index, orbit.step, orbit.reveal, orbit.disperse)
            // Directly own the complete orbit transform. Mixing GSAP xPercent with
            // quickSetter('transform') causes GSAP's transform cache to drop X/Y offsets.
            const transform = `translate(-50%, -50%) translate3d(${pose.x}, ${pose.y}, ${pose.z}px) rotateX(${pose.rotationX}deg) rotateY(${pose.rotationY}deg) scale(${pose.scale})`
            panel.style.transform = transform
            if (setter.foregroundPanel) setter.foregroundPanel.style.transform = transform
            setter.opacity(pose.opacity * (1 - foreground))
            setter.foregroundOpacity?.(pose.opacity * foreground)
            setter.label?.(label)
            setter.headline?.(headline)
            setter.body?.(body)
            setter.foregroundLabel?.(label)
            setter.foregroundHeadline?.(headline)
            setter.foregroundBody?.(body)
            parallaxMultipliers[index] = parallax
            const isActive = readable > 0.9 && pose.opacity > 0.9
            const ariaHidden = String(!isActive)
            if (panel.getAttribute('aria-hidden') !== ariaHidden) panel.setAttribute('aria-hidden', ariaHidden)

          })
          characterRef.current?.setProgress(orbit.progress)
        }
        renderOrbit()
        gsap.set([skillsRowRef.current, resumeRef.current].filter(Boolean), { autoAlpha: 0, y: 18 })

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: renderOrbit,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${window.innerHeight * HERO_SCROLL_SCREENS}`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            refreshPriority: 20,
            invalidateOnRefresh: true,
          },
        })

        // A one-unit master timeline keeps every DOM checkpoint on the same scroll clock.
        tl.to(orbit, { progress: 1, duration: 1 }, 0)
        tl.to(
          [heroTitleRef.current, introLeftRef.current, introRightRef.current],
          { opacity: 0, y: -18, duration: HERO_CHROME_FADE_END - HERO_CHROME_FADE_START },
          HERO_CHROME_FADE_START
        )

        // Dolly finishes at .28. The first panel then follows the same right-to-front
        // lifecycle as every later checkpoint instead of fading directly in place.
        tl.to(orbit, { reveal: 1, duration: 0.02, ease: 'power2.out' }, 0.29)
        tl.to(orbit, { step: 0, duration: 0.075, ease: 'power2.inOut' }, 0.30)
        AVATAR_STORY_CHECKPOINTS.slice(1, 4).forEach((checkpoint, index) => {
          tl.to(orbit, { step: index + 1, duration: 0.065, ease: 'power2.inOut' }, checkpoint.start)
        })
        // READY_TO_BUILD is the fifth checkpoint and follows the exact same
        // center-front -> active-right orbit while TEACHING moves to previous-left.
        tl.to(orbit, { step: 4, duration: 0.06, ease: 'power2.inOut' }, 0.86)
        tl.to(skillsRowRef.current, { autoAlpha: 1, y: 0, duration: 0.045, ease: 'power2.out' }, 0.945)
        tl.to(resumeRef.current, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, 0.97)

        const parallaxLayers = [
          ...headlineParallaxRefs.current.map((layer, index) => ({ layer, index })),
          ...foregroundParallaxRefs.current.map((layer, index) => ({ layer, index })),
        ]
        const headlineQuickSetters = parallaxLayers.map(({ layer, index }) => {
          if (!layer) return null
          return {
            index,
            x: gsap.quickTo(layer, 'x', { duration: 0.75, ease: 'power3.out' }),
            y: gsap.quickTo(layer, 'y', { duration: 0.75, ease: 'power3.out' }),
          }
        })
        const rotateX = perspectiveRef.current
          ? gsap.quickTo(perspectiveRef.current, 'rotationX', { duration: 0.9, ease: 'power3.out' })
          : null
        const rotateY = perspectiveRef.current
          ? gsap.quickTo(perspectiveRef.current, 'rotationY', { duration: 0.9, ease: 'power3.out' })
          : null
        const frontRotateX = frontPerspectiveRef.current
          ? gsap.quickTo(frontPerspectiveRef.current, 'rotationX', { duration: 0.9, ease: 'power3.out' })
          : null
        const frontRotateY = frontPerspectiveRef.current
          ? gsap.quickTo(frontPerspectiveRef.current, 'rotationY', { duration: 0.9, ease: 'power3.out' })
          : null

        const settlePointer = () => {
          headlineQuickSetters.forEach((setter) => {
            setter?.x(0)
            setter?.y(0)
          })
          rotateX?.(0)
          rotateY?.(0)
          frontRotateX?.(0)
          frontRotateY?.(0)
        }

        const handlePointerMove = (event: PointerEvent) => {
          const x = (event.clientX / window.innerWidth) * 2 - 1
          const y = (event.clientY / window.innerHeight) * 2 - 1
          headlineQuickSetters.forEach((setter) => {
            if (!setter) return
            const multiplier = parallaxMultipliers[setter.index]
            setter.x(-x * 16 * multiplier)
            setter.y(-y * 9 * multiplier)
          })
          rotateX?.(-y * 0.7)
          rotateY?.(x * 1.4)
          frontRotateX?.(-y * 0.7)
          frontRotateY?.(x * 1.4)
          if (pointerResetTimer) clearTimeout(pointerResetTimer)
          pointerResetTimer = setTimeout(settlePointer, 700)
        }

        window.addEventListener('pointermove', handlePointerMove, { passive: true })
        window.addEventListener('blur', settlePointer)
        document.documentElement.addEventListener('mouseleave', settlePointer)
        removePointerListeners = () => {
          window.removeEventListener('pointermove', handlePointerMove)
          window.removeEventListener('blur', settlePointer)
          document.documentElement.removeEventListener('mouseleave', settlePointer)
          if (pointerResetTimer) clearTimeout(pointerResetTimer)
        }

        const attachVideoScrub = () => {
          if (video?.duration) tl.to(video, { currentTime: video.duration, duration: 1 }, 0)
        }
        if (video?.readyState && video.readyState >= 1) attachVideoScrub()
        else if (video) video.onloadedmetadata = attachVideoScrub

        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }, sectionRef)
    }

    initGSAP()

    return () => {
      cancelled = true
      removePointerListeners?.()
      if (videoElement) videoElement.onloadedmetadata = null
      ctx?.revert()
      headlineElements.forEach((panel) => {
        panel?.removeAttribute('aria-hidden')
        panel?.style.removeProperty('pointer-events')
        panel?.style.removeProperty('transform')
        panel?.style.removeProperty('opacity')
        panel?.querySelectorAll<HTMLElement>('[data-orbit-label], h2, p').forEach((element) => {
          element.style.removeProperty('opacity')
        })
      })
      foregroundHeadlineElements.forEach((panel) => {
        panel?.removeAttribute('aria-hidden')
        panel?.style.removeProperty('transform')
        panel?.style.removeProperty('opacity')
        panel?.querySelectorAll<HTMLElement>('[data-orbit-label], h2, p').forEach((element) => {
          element.style.removeProperty('opacity')
        })
      })
    }
  }, [isDesktop, prefersReducedMotion])

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
      {/* 1. Giant Background Typography (z-10: Behind 3D model to establish intentional overlap) */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 mx-auto hidden w-full max-w-[1440px] justify-center px-4 md:flex md:px-10 lg:px-16 select-none">
        <header
          ref={heroTitleRef}
          className="avatar-story-fade flex w-full justify-center"
        >
          <h1 className="text-center font-display text-[clamp(62px,14vw,176px)] uppercase leading-none text-white select-none">
            Clarence Evan
          </h1>
        </header>
      </div>

      {/* 2. Back/side orbit layer. */}
      <div
        ref={perspectiveRef}
        className="story-perspective pointer-events-none absolute inset-0 z-[15] hidden overflow-hidden md:block"
        aria-label="Editorial checkpoint story"
      >
        {AVATAR_STORY_CHECKPOINTS.map((checkpoint, index) => (
          <article
            key={checkpoint.id}
            ref={(node) => {
              headlineRefs.current[index] = node
            }}
            className="story-checkpoint absolute left-1/2 top-1/2 w-[min(29vw,420px)] font-mono"
          >
            <div
              ref={(node) => {
                headlineParallaxRefs.current[index] = node
              }}
              className="story-checkpoint-parallax"
            >
              <div
                data-orbit-label
                className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-teal"
              >
                <span className="h-px w-12 bg-teal" aria-hidden="true" />
                <span>{checkpoint.label}</span>
                <span className="ml-auto text-white/30">
                  0{index + 1}
                </span>
              </div>
              <h2 className="mb-4 font-display text-[clamp(30px,4vw,64px)] uppercase leading-[0.88] tracking-[-0.025em] text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.75)]">
                {checkpoint.headline.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h2>
              <p className="max-w-[400px] border-l border-white/20 pl-4 text-[12px] leading-[1.8] text-white/75 [text-shadow:0_2px_24px_rgba(0,0,0,0.95)]">
                {checkpoint.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* 3. Character occludes the large typography naturally through layer order. */}
      {isDesktop && (
        <HeroCharacterCanvas
          ref={characterRef}
          className="z-20 hidden md:block"
        />
      )}

      {/* 3b. A dedicated front layer receives only the outgoing foreground pass. */}
      <div
        ref={frontPerspectiveRef}
        className="story-perspective pointer-events-none absolute inset-0 z-[25] hidden overflow-hidden md:block"
        aria-hidden="true"
      >
        {AVATAR_STORY_CHECKPOINTS.map((checkpoint, index) => (
          <article
            key={`foreground-${checkpoint.id}`}
            ref={(node) => {
              foregroundHeadlineRefs.current[index] = node
            }}
            className="story-checkpoint absolute left-1/2 top-1/2 w-[min(29vw,420px)] font-mono"
          >
            <div
              ref={(node) => {
                foregroundParallaxRefs.current[index] = node
              }}
              className="story-checkpoint-parallax"
            >
              <div data-orbit-label className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-teal">
                <span className="h-px w-12 bg-teal" aria-hidden="true" />
                <span>{checkpoint.label}</span>
                <span className="ml-auto text-white/30">0{index + 1}</span>
              </div>
              <h2 className="mb-4 font-display text-[clamp(30px,4vw,64px)] uppercase leading-[0.88] tracking-[-0.025em] text-white [text-shadow:0_6px_30px_rgba(0,0,0,0.75)]">
                {checkpoint.headline.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </h2>
              <p className="max-w-[400px] border-l border-white/20 pl-4 text-[12px] leading-[1.8] text-white/75 [text-shadow:0_2px_24px_rgba(0,0,0,0.95)]">
                {checkpoint.text}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Dormant video element preserved temporarily until 3D experience is validated */}
      <video
        ref={videoRef}
        src="/assets/moving_scrub.mp4"
        muted
        playsInline
        preload="none"
        className="pointer-events-none absolute inset-0 z-0 hidden select-none"
      />
      <div className="pointer-events-none absolute inset-0 z-5 hidden bg-[radial-gradient(circle_at_50%_42%,transparent_18%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.88)_100%)] md:block" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-5 hidden h-56 bg-gradient-to-b from-black via-black/60 to-transparent md:block" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-25 hidden h-64 bg-gradient-to-t from-black via-black/70 to-transparent md:block" />

      {/* 4. Foreground UI and stable supporting copy. */}
      <div className="pointer-events-none relative z-30 mx-auto hidden h-full w-full max-w-[1440px] grid-rows-[auto_1fr_auto] pb-8 md:grid">
        {/* Invisible header spacer to keep exact 3-row grid layout alignment */}
        <div className="pointer-events-none invisible flex justify-center select-none" aria-hidden="true">
          <h1 className="text-center font-display text-[clamp(62px,14vw,176px)] uppercase leading-none">
            Clarence Evan
          </h1>
        </div>

        <div className="relative z-20 grid min-h-0 flex-1 place-items-center">
          <div className="relative grid h-full w-full place-items-center" />
        </div>

        <div className="avatar-story-fade pointer-events-auto relative z-30 grid gap-5 md:grid-cols-[minmax(240px,360px)_1fr_minmax(250px,360px)] md:items-end">
          <div
            ref={introLeftRef}
            className="order-2 md:order-1"
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
            className="order-3 flex flex-col items-start gap-4 md:order-2 md:items-center"
          >
            <div ref={skillsRowRef} className="flex flex-wrap gap-3 md:justify-center">
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
              ref={resumeRef}
              href="/assets/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="border border-white px-7 py-3 font-mono text-[12px] uppercase text-white transition-all duration-200 hover:bg-white hover:text-black"
            >
              DOWNLOAD RESUME
            </a>
          </div>

          <div
            ref={introRightRef}
            className="order-1 flex flex-col items-start gap-5 md:order-3 md:items-end"
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
