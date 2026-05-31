'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function usePageNavigation() {
  const router = useRouter()

  const navigate = useCallback((href: string) => {
    // Small delay so transition starts before route change
    setTimeout(() => {
      router.push(href)
    }, 50)
  }, [router])

  return { navigate }
}
