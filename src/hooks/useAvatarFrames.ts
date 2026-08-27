'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

export const AVATAR_FRAME_COUNT = 180
export const AVATAR_SEQUENCE_BASE_PATH =
  '/assets/sequence/ezgif-1f2df31b09d40afe-png-split'

export function getAvatarFrameSrc(frameNumber: number) {
  const safeFrame = Math.min(Math.max(Math.round(frameNumber), 1), AVATAR_FRAME_COUNT)
  return `${AVATAR_SEQUENCE_BASE_PATH}/ezgif-frame-${String(safeFrame).padStart(3, '0')}.png`
}

type UseAvatarFramesOptions = {
  enabled?: boolean
  priorityFrames?: number[]
}

export function useAvatarFrames({ enabled = true, priorityFrames = [] }: UseAvatarFramesOptions = {}) {
  const frameSources = useMemo(
    () => Array.from({ length: AVATAR_FRAME_COUNT }, (_, index) => getAvatarFrameSrc(index + 1)),
    []
  )
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return

    let isCancelled = false
    const loaded = new Set<number>()
    const allFrames = Array.from({ length: AVATAR_FRAME_COUNT }, (_, index) => index + 1)
    
    // Priority frames get loaded immediately
    const priorityQueue = Array.from(new Set([1, 180, ...priorityFrames]))
      .filter((frame) => frame >= 1 && frame <= AVATAR_FRAME_COUNT)
    
    // Lazy frames get loaded sequentially in background
    const lazyQueue = allFrames.filter((frame) => !priorityQueue.includes(frame))

    const markLoaded = (frame: number) => {
      if (isCancelled || loaded.has(frame)) return
      loaded.add(frame)
      setLoadedCount(loaded.size)
    }

    // Helper to load a single frame wrapped in a Promise
    const loadFrame = (frame: number) => {
      return new Promise<void>((resolve) => {
        const image = new Image()
        image.onload = () => {
          markLoaded(frame)
          resolve()
        }
        image.onerror = () => {
          markLoaded(frame)
          resolve() // resolve anyway to keep queue moving
        }
        image.src = getAvatarFrameSrc(frame)
      })
    }

    // Fire off priority frames immediately (no waiting)
    priorityQueue.forEach((frame) => {
      loadFrame(frame)
    })

    // Sequentially load the rest in small batches to prevent 
    // network burst that causes ERR_CERT_DATABASE_CHANGED
    const processLazyQueue = async () => {
      const concurrency = 4 // Load 4 frames at a time
      
      while (lazyQueue.length > 0 && !isCancelled) {
        const batch = lazyQueue.splice(0, concurrency)
        await Promise.all(batch.map(loadFrame))
        
        // Small delay to let the browser process other idle tasks/networking
        if (!isCancelled) {
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }
    }

    // Start lazy loading asynchronously
    processLazyQueue()

    return () => {
      isCancelled = true
    }
  }, [enabled, priorityFrames])

  const getFrameSrc = useCallback(
    (frameNumber: number) => frameSources[Math.min(Math.max(Math.round(frameNumber), 1), AVATAR_FRAME_COUNT) - 1],
    [frameSources]
  )

  return { frameSources, getFrameSrc, loadedCount }
}
