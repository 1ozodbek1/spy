"use client"

import { useEffect, useRef, useState } from "react"

export function useCountdown(seconds: number, onEnd: () => void) {
  const [left, setLeft] = useState(seconds)
  const cb = useRef(onEnd)

  useEffect(() => {
    cb.current = onEnd
  })

  useEffect(() => {
    const end = Date.now() + seconds * 1000
    let done = false
    setLeft(seconds)
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining === 0 && !done) {
        done = true
        clearInterval(id)
        cb.current()
      }
    }, 250)
    return () => clearInterval(id)
  }, [seconds])

  return left
}
