import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, Text, useTexture } from '@react-three/drei'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { GalaxyBackground } from './GalaxyBackground'
import { StarField } from './StarField'
import { Meteors } from './Meteors'
import { planets, sun } from '../data/planets'

const orbitAngles = [0.4, 2.8, 1.25, 4.65, 5.9, 2.15, 3.55, 5.15]
const earthOrbitSpeed = 0.006

function IntroCamera({ phase, startingFromBody }) {
  const { camera, size } = useThree()
  const isMobile = size.width <= 768
  const target = useRef(new THREE.Vector3())
  const hasInitialized = useRef(false)

  const views = useMemo(
    () => [
      {
        position: new THREE.Vector3(0, 3, 34),
        target: new THREE.Vector3(0, -2, 0),
      },
      {
        position: isMobile
          ? new THREE.Vector3(0, 14, 11)
          : new THREE.Vector3(0, 13, 11),
        target: new THREE.Vector3(0, -2, 0),
      },
      {
        position: isMobile
          ? new THREE.Vector3(3.8, 0.15, 36.2)
          : new THREE.Vector3(3.8, 0.4, 36.2),
        target: isMobile
          ? new THREE.Vector3(3.8, -0.45, 30)
          : new THREE.Vector3(3.8, 0, 30),
      },
    ],
    [isMobile],
  )

  useFrame((_, delta) => {
    if (startingFromBody && !hasInitialized.current) {
      const startingPosition =
        startingFromBody === 'neptune'
          ? [3.8, 0.4, -203.8]
          : [3.8, 0.4, 36.2]
      const startingTarget =
        startingFromBody === 'neptune' ? [3.8, 0, -210] : [3.8, 0, 30]
      camera.position.set(...startingPosition)
      target.current.set(...startingTarget)
      hasInitialized.current = true
    }

    const view = views[phase]
    camera.position.lerp(view.position, 1 - Math.exp(-3.8 * delta))
    camera.lookAt(target.current.lerp(view.target, 1 - Math.exp(-3.8 * delta)))
  })

  return null
}

function IntroSun() {
  const texture = useTexture(sun.texture)
  const sunRef = useRef()
  const { size } = useThree()
  const isMobile = size.width <= 768

  useFrame(() => {
    if (!sunRef.current) return
    sunRef.current.rotation.y = 0.2 + (performance.now() / 1000) * 0.12
  })

  return (
    <mesh
      ref={sunRef}
      position={[0, 0, 0]}
      rotation={[0.08, 0.2, 0]}
      scale={isMobile ? 0.42 : 1}
    >
      <sphereGeometry args={[sun.radius, 64, 64]} />
      <meshStandardMaterial
        map={texture}
        emissive="#ff8a24"
        emissiveIntensity={0.18}
        roughness={0.85}
      />
    </mesh>
  )
}

function IntroSceneFallback({ startingFromBody }) {
  const { size } = useThree()
  const isMobile = size.width <= 768
  const position = startingFromBody === 'neptune' ? [3.8, 0, -210] : [3.8, 0, 30]

  return (
    <mesh
      position={startingFromBody ? position : [0, -2, 0]}
      scale={isMobile ? 0.42 : 1}
    >
      <sphereGeometry args={[sun.radius, 64, 64]} />
      <meshStandardMaterial
        color="#f08a28"
        emissive="#ff8a24"
        emissiveIntensity={0.35}
        roughness={0.85}
      />
    </mesh>
  )
}

function IntroPlanet({ planet, index, visible }) {
  const texture = useTexture(planet.texture)
  const planetRef = useRef()
  const angle = orbitAngles[index]
  const distance = 2.5 + index * 0.55
  const currentAngle = useRef(angle)

  useFrame((_, delta) => {
    currentAngle.current +=
      delta * (earthOrbitSpeed / planet.orbitalPeriod)
    planetRef.current.position.x = Math.cos(currentAngle.current) * distance
    planetRef.current.position.z = Math.sin(currentAngle.current) * distance
    planetRef.current.rotation.y += delta * (0.08 + index * 0.012)
  })

  return (
    <mesh
      ref={planetRef}
      position={[
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance,
      ]}
    >
      <sphereGeometry args={[0.34, 32, 32]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.86}
        transparent
        opacity={visible ? 1 : 0}
      />
    </mesh>
  )
}

function OrbitRing({ radius, visible }) {
  const points = useMemo(
    () =>
      Array.from({ length: 129 }, (_, index) => {
        const angle = (index / 128) * Math.PI * 2
        return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
      }),
    [radius],
  )

  return (
    <Line
      points={points}
      color="#ffffff"
      lineWidth={0.8}
      transparent
      opacity={visible ? 0.42 : 0}
      depthWrite={false}
    />
  )
}

function OrbitLabel({ planet, radius, index, visible }) {
  const labelRef = useRef()
  const { camera, size } = useThree()
  const isMobile = size.width <= 768
  const angle = orbitAngles[index]
  const position = [
    Math.cos(angle) * radius,
    0.015,
    Math.sin(angle) * radius,
  ]

  useFrame(() => {
    labelRef.current.quaternion.copy(camera.quaternion)
  })

  return (
    <Text
      ref={labelRef}
      position={position}
      color="#ffffff"
      fontSize={isMobile ? 0.24 : 0.18}
      anchorX="center"
      anchorY="middle"
      fillOpacity={visible ? 0.72 : 0}
      outlineColor="#020309"
      outlineWidth={0.018}
      depthTest={false}
      renderOrder={2}
    >
      {planet.name}
    </Text>
  )
}

function IntroSystem({ phase, startingFromBody }) {
  const systemRef = useRef()
  const { size } = useThree()
  const isMobile = size.width <= 768

  const targetPosition = useMemo(
    () => new THREE.Vector3(3.8, 0, 30),
    [],
  )
  const startPosition = useMemo(() => new THREE.Vector3(0, -2, 0), [])
  const initialPosition =
    startingFromBody === 'neptune' ? [3.8, 0, -210] : [0, -2, 0]

  const targetScale = useMemo(() => {
    if (phase === 1) {
      return isMobile ? 0.58 : 0.8
    }
    return 1
  }, [phase, isMobile])

  useFrame((_, delta) => {
    const destination = phase === 2 ? targetPosition : startPosition
    systemRef.current.position.lerp(destination, 1 - Math.exp(-3.2 * delta))

    const currentScale = systemRef.current.scale.x
    const newScale = THREE.MathUtils.damp(
      currentScale,
      targetScale,
      4.0,
      delta,
    )
    systemRef.current.scale.set(newScale, newScale, newScale)
  })

  return (
    <group
      ref={systemRef}
      position={startingFromBody ? initialPosition : [0, -2, 0]}
      scale={targetScale}
    >
      <IntroSun />
      {planets.map((planet, index) => (
        <OrbitRing
          key={`orbit-${planet.id}`}
          radius={2.5 + index * 0.55}
          visible={phase !== 2}
        />
      ))}
      {planets.map((planet, index) => (
        <OrbitLabel
          key={`label-${planet.id}`}
          planet={planet}
          index={index}
          radius={2.5 + index * 0.55}
          visible={phase !== 2}
        />
      ))}
      {planets.map((planet, index) => (
        <IntroPlanet
          key={planet.id}
          planet={planet}
          index={index}
          visible={phase !== 2}
        />
      ))}
    </group>
  )
}

export function IntroScene({
  phase,
  startingFromBody = null,
  className = '',
}) {
  return (
    <div
      className={`scene-container ${className}`}
      aria-label="Introduction à Space Explorer"
    >
      <Canvas
        camera={{
          position:
            startingFromBody === 'neptune'
              ? [3.8, 0.4, -203.8]
              : startingFromBody
                ? [3.8, 0.4, 36.2]
                : [0, 3, 34],
          fov: 42,
          near: 0.1,
          far: 200,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#020309']} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[4, 5, 6]}
          intensity={2.4}
          color="#fff8ed"
        />
        <pointLight position={[4, 5, 6]} intensity={3} color="#fff0c7" />
        <StarField />
        <Suspense fallback={null}>
          <GalaxyBackground />
        </Suspense>
        <Meteors />
        <Suspense fallback={<IntroSceneFallback startingFromBody={startingFromBody} />}>
          <IntroSystem phase={phase} startingFromBody={startingFromBody} />
        </Suspense>
        <IntroCamera phase={phase} startingFromBody={startingFromBody} />
      </Canvas>
    </div>
  )
}
