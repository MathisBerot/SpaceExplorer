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
    let touchStartX = 0
    let touchStartY = 0

    const triggerStep = (direction) => {
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

    const handleWheel = (event) => {
      event.preventDefault()
      if (locked.current) return

      const direction = event.deltaY > 0 ? 1 : -1
      triggerStep(direction)
    }

    const handleTouchStart = (event) => {
      if (event.touches.length === 1) {
        touchStartX = event.touches[0].clientX
        touchStartY = event.touches[0].clientY
      }
    }

    const handleTouchEnd = (event) => {
      if (locked.current || event.changedTouches.length === 0) return
      const touchEndX = event.changedTouches[0].clientX
      const touchEndY = event.changedTouches[0].clientY

      const diffX = touchStartX - touchEndX
      const diffY = touchStartY - touchEndY

      const isHorizontal = Math.abs(diffX) > Math.abs(diffY)
      const diff = isHorizontal ? diffX : diffY

      const minSwipeDistance = 35
      if (Math.abs(diff) >= minSwipeDistance) {
        const direction = diff > 0 ? 1 : -1
        triggerStep(direction)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [canReturnToIntro, canReturnToSystem, currentIndex, maxIndex, onStep])

  return <ScrollHint />
}
