import { useEffect, useRef } from 'react'
import { ScrollHint } from './ScrollHint'

export function IntroNavigation({ phase, onStep, disabled = false }) {
  const locked = useRef(false)

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      if (disabled || locked.current) return

      const direction = event.deltaY > 0 ? 1 : -1
      if (direction < 0 && phase === 0) {
        return
      }

      locked.current = true
      onStep(direction)
      window.setTimeout(() => {
        locked.current = false
      }, 650)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [disabled, onStep, phase])

  return <ScrollHint />
}
