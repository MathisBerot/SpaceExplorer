import { useEffect, useRef } from 'react'
import { ScrollHint } from './ScrollHint'

export function Navigation({
  currentIndex,
  maxIndex,
  onStep,
  canReturnToIntro = false,
  canReturnToSystem = false,
}) {
  const locked = useRef(false)

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()
      if (locked.current) return

      const direction = event.deltaY > 0 ? 1 : -1
      const atLowerBound = direction < 0 && currentIndex <= 0
      const atUpperBound = direction > 0 && currentIndex >= maxIndex

      if (
        (atUpperBound && !canReturnToSystem) ||
        (atLowerBound && !canReturnToIntro)
      ) {
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
  }, [canReturnToIntro, canReturnToSystem, currentIndex, maxIndex, onStep])

  return <ScrollHint />
}
