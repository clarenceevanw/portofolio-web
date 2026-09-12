'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export interface HeroCharacterHandle {
  setProgress: (progress: number) => void
}

interface HeroCharacterCanvasProps {
  className?: string
  onLoaded?: () => void
}

// Smooth cubic easing helper
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// Helper to interpolate between two values given a progress range
function rangeMap(
  val: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
  ease = true
): number {
  if (val <= inMin) return outMin
  if (val >= inMax) return outMax
  const t = (val - inMin) / (inMax - inMin)
  const factor = ease ? easeInOutCubic(t) : t
  return outMin + (outMax - outMin) * factor
}

export const HeroCharacterCanvas = forwardRef<
  HeroCharacterHandle,
  HeroCharacterCanvasProps
>(function HeroCharacterCanvas({ className = '', onLoaded }, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)

  // Internal state refs to avoid React re-renders during 60fps animations
  const progressRef = useRef(0)
  const targetPointerX = useRef(0)
  const targetPointerY = useRef(0)
  const targetPointerRotY = useRef(0)
  const targetPointerRotX = useRef(0)
  const currentPointerX = useRef(0)
  const currentPointerY = useRef(0)
  const currentPointerRotY = useRef(0)
  const currentPointerRotX = useRef(0)
  const lastPointerMoveRef = useRef(0)

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.35, 0))
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const scrollGroupRef = useRef<THREE.Group | null>(null)
  const interactionGroupRef = useRef<THREE.Group | null>(null)
  const scrollCameraRigRef = useRef<THREE.Group | null>(null)
  const pointerCameraRigRef = useRef<THREE.Group | null>(null)
  const rimLightLeftRef = useRef<THREE.DirectionalLight | null>(null)
  const rimLightRightRef = useRef<THREE.DirectionalLight | null>(null)
  const rimLightTopRef = useRef<THREE.DirectionalLight | null>(null)
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null)
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null)
  const prefersReducedMotionRef = useRef(false)

  // Expose imperative handle so parent (GSAP ScrollTrigger) can scrub progress without React re-renders
  useImperativeHandle(
    ref,
    () => ({
      setProgress: (p: number) => {
        progressRef.current = Math.max(0, Math.min(1, p))
      },
    }),
    []
  )

  useEffect(() => {
    // Check reduced motion preference
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotionRef.current = media.matches
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches
    }
    media.addEventListener('change', handleMotionChange)

    const container = containerRef.current
    if (!container) return

    let isDisposed = false
    let animId: number

    // 1. Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // 2. Camera setup: Field of View 32° gives a cinematic portrait perspective
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
    // Starting Hero composition: camera framed at 3/4 body (z = 2.45, y = 0.35)
    camera.position.set(0, 0.35, 2.45)
    cameraRef.current = camera
    const cameraTarget = new THREE.Vector3(0, 0.35, 0)
    cameraTargetRef.current = cameraTarget

    // 3. Renderer setup: optimized DPR [1, 1.5], ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 4. Lighting Setup: Carefully matched to reference images
    // - Warm, stable face lighting
    // - Deep matte black hoodie
    // - Dual cyan rim lights with continuous smooth crossfading throughout scroll
    // - Pure black environment

    // A. Ambient Light: restrained warm base so dark hoodie stays deep without losing soft geometry folds
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.45)
    scene.add(ambientLight)

    // B. Soft Key Light: stable front-right key light for warm, flattering facial tones
    const keyLight = new THREE.DirectionalLight(0xfff3e6, 2.8)
    keyLight.position.set(1.4, 2.0, 2.4)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    keyLight.shadow.bias = -0.0005
    scene.add(keyLight)
    keyLightRef.current = keyLight

    // C. Fill Light: stable cool tone from front-left
    const fillLight = new THREE.DirectionalLight(0x506575, 0.65)
    fillLight.position.set(-2.0, 0.8, 1.6)
    scene.add(fillLight)
    fillLightRef.current = fillLight

    // D. Dual Cyan Rim Light Setup for Continuous Crossfade:
    // 1) Left Cyan Rim Light (prominent when character looks right or is on left)
    const rimLightLeft = new THREE.DirectionalLight(0x00e5cc, 4.5)
    rimLightLeft.position.set(-1.45, 1.8, -1.25)
    scene.add(rimLightLeft)
    rimLightLeftRef.current = rimLightLeft

    // 2) Right Cyan Rim Light (prominent when character looks left or is on right)
    const rimLightRight = new THREE.DirectionalLight(0x00e5cc, 1.2)
    rimLightRight.position.set(1.45, 1.8, -1.25)
    scene.add(rimLightRight)
    rimLightRightRef.current = rimLightRight

    // 3) Top Rim Light: subtle hair sheen from top-back
    const rimLightTop = new THREE.DirectionalLight(0x00d8c0, 1.5)
    rimLightTop.position.set(0.0, 2.3, -1.3)
    scene.add(rimLightTop)
    rimLightTopRef.current = rimLightTop

    // 5. Transform Separation Hierarchy:
    // ScrollGroup -> InteractionGroup -> Model
    // ScrollCameraRig -> PointerCameraRig -> Camera
    const scrollGroup = new THREE.Group()
    const interactionGroup = new THREE.Group()
    scrollGroup.add(interactionGroup)
    scene.add(scrollGroup)

    const scrollCameraRig = new THREE.Group()
    const pointerCameraRig = new THREE.Group()
    pointerCameraRig.add(camera)
    scrollCameraRig.add(pointerCameraRig)
    scene.add(scrollCameraRig)

    scrollGroupRef.current = scrollGroup
    interactionGroupRef.current = interactionGroup
    scrollCameraRigRef.current = scrollCameraRig
    pointerCameraRigRef.current = pointerCameraRig

    // 6. Load GLTF Model
    const loader = new GLTFLoader()
    loader.load(
      '/assets/model.glb',
      (gltf) => {
        if (isDisposed) return

        const model = gltf.scene

        // Compute Bounding Box to center the model accurately at (0, 0, 0)
        const bbox = new THREE.Box3().setFromObject(model)
        const center = bbox.getCenter(new THREE.Vector3())

        // Center model geometry inside interaction group
        model.position.x = -center.x
        model.position.y = -center.y
        model.position.z = -center.z

        // Enable shadows on meshes
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        interactionGroup.add(model)
        setIsReady(true)
        onLoaded?.()
      },
      undefined,
      (err) => {
        console.error('Failed to load 3D character model:', err)
      }
    )

    // 7. Mouse / Pointer Interaction for desktop
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotionRef.current) return
      // Normalized coordinates: -1 to +1
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1

      // Subtle camera-rig drift; scroll remains responsible for composition.
      targetPointerX.current = -nx * 0.12
      targetPointerY.current = ny * 0.065
      targetPointerRotY.current = -nx * 0.022
      targetPointerRotX.current = -ny * 0.012
      lastPointerMoveRef.current = performance.now()
    }

    const handleMouseLeave = () => {
      targetPointerX.current = 0
      targetPointerY.current = 0
      targetPointerRotY.current = 0
      targetPointerRotX.current = 0
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // 9. Render Loop: handles progress-based transforms, pointer damping, and idle motion
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const p = progressRef.current
      const isReduced = prefersReducedMotionRef.current

      // Scroll owns the portrait framing; pointer offsets remain on a child rig.
      // Finish the push before the first orbit panel appears at progress .30.
      const push = rangeMap(p, 0.12, 0.28, 0, 1)
      const resolve = rangeMap(p, 0.80, 0.90, 0, 1)
      camera.position.z = 2.45 - push * 1.10 + resolve * 0.08
      camera.position.y = 0.35 + push * 0.29 - resolve * 0.025
      cameraTarget.set(0, camera.position.y, 0)
      camera.lookAt(cameraTarget)
      scrollGroup.position.x = 0
      scrollCameraRig.position.x = 0
      scrollGroup.rotation.y = push * 0.025

      // Stable cyan rim with a small continuous change through the portrait push.
      if (rimLightLeftRef.current && rimLightRightRef.current) {
        rimLightLeftRef.current.intensity = 4.5 - push * 0.25
        rimLightRightRef.current.intensity = 1.2 + push * 0.25
        const rimY = 1.8 + push * 0.15
        rimLightLeftRef.current.position.y = rimY
        rimLightRightRef.current.position.y = rimY
      }

      // --- B. POINTER CAMERA DRIFT & MODEL IDLE MOTION ---
      // Let the view settle toward center shortly after pointer activity stops.
      if (!isReduced && performance.now() - lastPointerMoveRef.current > 700) {
        targetPointerX.current *= 0.94
        targetPointerY.current *= 0.94
        targetPointerRotY.current *= 0.94
        targetPointerRotX.current *= 0.94
      }
      if (isReduced) {
        targetPointerX.current = 0
        targetPointerY.current = 0
        targetPointerRotY.current = 0
        targetPointerRotX.current = 0
      }

      const lerpFactor = 0.045
      currentPointerX.current +=
        (targetPointerX.current - currentPointerX.current) * lerpFactor
      currentPointerY.current +=
        (targetPointerY.current - currentPointerY.current) * lerpFactor
      currentPointerRotY.current +=
        (targetPointerRotY.current - currentPointerRotY.current) * lerpFactor
      currentPointerRotX.current +=
        (targetPointerRotX.current - currentPointerRotX.current) * lerpFactor

      // Subtle idle breathing motion (disabled if prefers-reduced-motion)
      const time = performance.now() / 1000
      const idleY = isReduced ? 0 : Math.sin(time * 1.4) * 0.007
      const idleRotY = isReduced ? 0 : Math.cos(time * 0.7) * 0.004

      interactionGroup.position.y = idleY
      interactionGroup.rotation.y = idleRotY

      pointerCameraRig.position.x = currentPointerX.current
      pointerCameraRig.position.y = currentPointerY.current
      pointerCameraRig.rotation.y = currentPointerRotY.current
      pointerCameraRig.rotation.x = currentPointerRotX.current

      // Render
      renderer.render(scene, camera)
    }

    animate()

    // 10. Cleanup
    return () => {
      isDisposed = true
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      media.removeEventListener('change', handleMotionChange)
      resizeObserver.disconnect()

      // Dispose 3D scene & resources
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh
          mesh.geometry?.dispose()
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose())
          } else {
            mesh.material?.dispose()
          }
        }
      })

      renderer.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [onLoaded])

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 select-none transition-opacity duration-700 ${
        isReady ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden="true"
    />
  )
})
