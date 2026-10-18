import { useEffect, useState } from 'react'
import { SpaceScene } from './components/SpaceScene'
import { IntroScene } from './components/IntroScene'
import { IntroContent } from './components/IntroContent'
import { IntroNavigation } from './components/IntroNavigation'
import { Navigation } from './components/Navigation'
import { PlanetInfo } from './components/PlanetInfo'
import { PlanetBreadcrumbs } from './components/PlanetBreadcrumbs'
import { ScrollHint } from './components/ScrollHint'
import { celestialBodies, sun } from './data/planets'
import './index.css'

function App() {
  const [introPhase, setIntroPhase] = useState(0)
  const [isReturningTransition, setIsReturningTransition] = useState(false)
  const [returningFrom, setReturningFrom] = useState(null)
  const initialBodyIndex = celestialBodies.findIndex((body) => body.id === 'earth')
  const [targetProgress, setTargetProgress] = useState(initialBodyIndex)
  const currentBodyIndex = Math.round(targetProgress)
  const currentBody = celestialBodies[currentBodyIndex]
  const transitionDuration = 1800
  const isIntro = introPhase < 3

  useEffect(() => {
    if (introPhase === 2) {
      const transitionTimer = window.setTimeout(() => {
        setTargetProgress(0)
        setIntroPhase(3)
      }, transitionDuration)

      return () => window.clearTimeout(transitionTimer)
    }

    if (isReturningTransition) {
      const transitionTimer = window.setTimeout(() => {
        setIsReturningTransition(false)
        setReturningFrom(null)
      }, transitionDuration)

      return () => window.clearTimeout(transitionTimer)
    }

    return undefined
  }, [introPhase, isReturningTransition])

  const handleIntroStep = (direction) => {
    setIntroPhase((currentPhase) => {
      if (direction < 0 && currentPhase === 1) return 0
      if (direction > 0 && currentPhase === 0) return 1
      if (direction > 0 && currentPhase === 1) {
        setTargetProgress(0)
        return 2
      }
      return currentPhase
    })
  }

  const handleStep = (direction) => {
    setTargetProgress((currentIndex) =>
      Math.min(
        celestialBodies.length - 1,
        Math.max(0, Math.round(currentIndex) + direction),
      ),
    )
  }

  const handleNavigationStep = (direction) => {
    if (direction < 0 && currentBodyIndex === 0) {
      setTargetProgress(0)
      setIsReturningTransition(true)
      setReturningFrom('sun')
      setIntroPhase(1)
      return
    }

    if (
      direction > 0 &&
      currentBodyIndex === celestialBodies.length - 1
    ) {
      setTargetProgress(celestialBodies.length - 1)
      setIsReturningTransition(true)
      setReturningFrom('neptune')
      setIntroPhase(1)
      return
    }

    handleStep(direction)
  }

  const handleBodySelect = (bodyId) => {
    const bodyIndex = celestialBodies.findIndex((body) => body.id === bodyId)

    if (bodyIndex < 0) return

    setTargetProgress(bodyIndex)

    if (isIntro) {
      setIsReturningTransition(false)
      setIntroPhase(3)
    }
  }

  const handleSystemSelect = () => {
    setTargetProgress(0)
    setIsReturningTransition(false)
    setReturningFrom(null)
    setIntroPhase(1)
  }

  const breadcrumbs = introPhase > 0 && (
    <PlanetBreadcrumbs
      planets={celestialBodies}
      activePlanetId={isIntro ? undefined : currentBody.id}
      isSystemActive={isIntro && introPhase === 1}
      onSelect={handleBodySelect}
      onSystemSelect={handleSystemSelect}
    />
  )

  return (
    <main className="space-explorer">
      <SpaceScene
        progress={targetProgress}
        className={isIntro ? 'scene-preload' : ''}
      />
      <IntroScene
        phase={introPhase}
        startingFromBody={returningFrom}
        className={!isIntro ? 'scene-preload' : ''}
      />
      {isIntro ? (
        <>
          {introPhase === 2 && <PlanetInfo planet={sun} />}
          {introPhase === 2 && <ScrollHint />}
          {introPhase < 2 && <IntroContent phase={introPhase} />}
          {introPhase < 2 && (
            <IntroNavigation
              phase={introPhase}
              onStep={handleIntroStep}
              disabled={isReturningTransition}
            />
          )}
          {breadcrumbs}
        </>
      ) : (
        <>
          <PlanetInfo planet={currentBody} />
          <Navigation
            currentIndex={currentBodyIndex}
            maxIndex={celestialBodies.length - 1}
            onStep={handleNavigationStep}
            canReturnToIntro={currentBody.id === 'sun'}
            canReturnToSystem={currentBody.id === 'neptune'}
          />
          {breadcrumbs}
        </>
      )}
    </main>
  )
}

export default App
