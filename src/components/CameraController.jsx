import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const cameraOffset = new THREE.Vector3(0, 0.4, 6.2)

export function CameraController({ progress, planets }) {
  const { camera } = useThree()
  const smoothedProgress = useRef(progress)
  const position = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())

  const paths = useMemo(
    () =>
      planets.slice(0, -1).map((planet, index) => {
        const nextPlanet = planets[index + 1]
        const start = new THREE.Vector3(...planet.position).add(cameraOffset)
        const end = new THREE.Vector3(...nextPlanet.position).add(cameraOffset)
        const midpoint = start.clone().lerp(end, 0.5)

        midpoint.z += 18
        midpoint.y += 5.5
        midpoint.x += index % 2 === 0 ? 2.5 : -2.5

        return {
          curve: new THREE.QuadraticBezierCurve3(start, midpoint, end),
          startTarget: new THREE.Vector3(...planet.position),
          endTarget: new THREE.Vector3(...nextPlanet.position),
        }
      }),
    [planets],
  )

  useFrame((_, delta) => {
    smoothedProgress.current = THREE.MathUtils.damp(
      smoothedProgress.current,
      progress,
      4.5,
      delta,
    )

    const value = smoothedProgress.current
    const segmentIndex = Math.min(Math.floor(value), paths.length - 1)
    const segmentProgress = Math.min(1, Math.max(0, value - segmentIndex))
    const path = paths[segmentIndex]

    if (!path) {
      const lastPlanet = planets[planets.length - 1]
      position.current.set(...lastPlanet.position).add(cameraOffset)
      target.current.set(...lastPlanet.position)
    } else {
      const easedProgress = THREE.MathUtils.smoothstep(segmentProgress, 0, 1)
      position.current.copy(path.curve.getPoint(easedProgress))
      target.current.lerpVectors(
        path.startTarget,
        path.endTarget,
        easedProgress,
      )
    }

    camera.position.lerp(position.current, 1 - Math.exp(-5 * delta))
    camera.lookAt(target.current)
  })

  return null
}
