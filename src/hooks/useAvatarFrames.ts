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
    const priorityQueue = Array.from(new Set([1, 180, ...priorityFrames]))
      .filter((frame) => frame >= 1 && frame <= AVATAR_FRAME_COUNT)
    const lazyQueue = allFrames.filter((frame) => !priorityQueue.includes(frame))

    const markLoaded = (frame: number) => {
      if (isCancelled || loaded.has(frame)) return
      loaded.add(frame)
      setLoadedCount(loaded.size)
    }

    const loadFrame = (frame: number) => {
      const image = new Image()
      image.onload = () => markLoaded(frame)
      image.onerror = () => markLoaded(frame)
      image.src = getAvatarFrameSrc(frame)
    }

    priorityQueue.forEach(loadFrame)

    const requestIdle =
      window.requestIdleCallback ??
      ((callback: IdleRequestCallback) =>
        window.setTimeout(
          () =>
            callback({
              didTimeout: false,
              timeRemaining: () => 16,
            } as IdleDeadline),
          80
        ))

    const cancelIdle =
      window.cancelIdleCallback ?? ((id: number) => window.clearTimeout(id))

    let idleId: number | undefined

    const loadNextBatch = () => {
      if (isCancelled) return

      lazyQueue.splice(0, 8).forEach(loadFrame)

      if (lazyQueue.length > 0) {
        idleId = requestIdle(loadNextBatch)
      }
    }

    idleId = requestIdle(loadNextBatch)

    return () => {
      isCancelled = true
      if (idleId !== undefined) cancelIdle(idleId)
    }
  }, [enabled, priorityFrames])

  const getFrameSrc = useCallback(
    (frameNumber: number) => frameSources[Math.min(Math.max(Math.round(frameNumber), 1), AVATAR_FRAME_COUNT) - 1],
    [frameSources]
  )

  return { frameSources, getFrameSrc, loadedCount }
}
