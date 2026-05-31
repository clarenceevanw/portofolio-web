'use client'

import { useState, useEffect } from 'react'

export function useTypewriter(
  text: string | string[], 
  speed: number = 100, 
  delay: number = 0,
  loop: boolean = false,
  deleteSpeed: number = 50,
  pauseTime: number = 2000
) {
  const [displayText, setDisplayText] = useState('')
  const [isDone, setIsDone] = useState(false)
  
  // Convert text to string to use as dependency to prevent infinite loops if array is passed inline
  const textDep = JSON.stringify(text)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let isCancelled = false

    const words = Array.isArray(text) ? text : [text]
    
    if (words.length === 0 || words[0] === '') {
       setDisplayText('')
       setIsDone(false)
       return
    }

    let wordIndex = 0
    let charIndex = 0
    let isDeleting = false

    const type = () => {
      if (isCancelled) return

      const currentWord = words[wordIndex]
      
      if (isDeleting) {
        setDisplayText(currentWord.substring(0, charIndex - 1))
        charIndex--
      } else {
        setDisplayText(currentWord.substring(0, charIndex + 1))
        charIndex++
      }

      let typeSpeed = isDeleting ? deleteSpeed : speed

      if (!isDeleting && charIndex === currentWord.length) {
        // Finished typing the word
        if (!loop && wordIndex === words.length - 1) {
          setIsDone(true)
          return // Stop completely
        }
        typeSpeed = pauseTime // Pause before deleting
        isDeleting = true
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        wordIndex = (wordIndex + 1) % words.length
        typeSpeed = 500 // Pause before typing next word
      }

      timeout = setTimeout(type, typeSpeed)
    }

    timeout = setTimeout(type, delay)

    return () => {
      isCancelled = true
      clearTimeout(timeout)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDep, speed, delay, loop, deleteSpeed, pauseTime])

  return { displayText, isDone }
}
