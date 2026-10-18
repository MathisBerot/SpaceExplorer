import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const cameraOffset = new THREE.Vector3(0, 0.4, 6.2)

export function CameraController({ progress, planets }) {
  const { camera, size } = useThree()
  const isMobile = size.width <= 768
  const smoothedProgress = useRef(progress)
  const position = useRef(new THREE.Vector3())
  const target = useRef(new THREE.Vector3())

  const activeCameraOffset = useMemo(
    () => (isMobile ? new THREE.Vector3(0, 0.15, 6.2) : cameraOffset),
    [isMobile],
  )
  const targetYOffset = isMobile ? -0.45 : 0

  const paths = useMemo(
    () =>
      planets.slice(0, -1).map((planet, index) => {
        const nextPlanet = planets[index + 1]
        const start = new THREE.Vector3(...planet.position).add(activeCameraOffset)
        const end = new THREE.Vector3(...nextPlanet.position).add(activeCameraOffset)
        const midpoint = start.clone().lerp(end, 0.5)

        midpoint.z += 18
        midpoint.y += 5.5
        midpoint.x += index % 2 === 0 ? 2.5 : -2.5

        return {
          curve: new THREE.QuadraticBezierCurve3(start, midpoint, end),
          startTarget: new THREE.Vector3(
            planet.position[0],
            planet.position[1] + targetYOffset,
            planet.position[2],
          ),
          endTarget: new THREE.Vector3(
            nextPlanet.position[0],
            nextPlanet.position[1] + targetYOffset,
            nextPlanet.position[2],
          ),
        }
      }),
    [planets, activeCameraOffset, targetYOffset],
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
      position.current.set(...lastPlanet.position).add(activeCameraOffset)
      target.current.set(
        lastPlanet.position[0],
        lastPlanet.position[1] + targetYOffset,
        lastPlanet.position[2],
      )
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
