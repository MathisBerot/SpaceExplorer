import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { PlanetRing } from './PlanetRing'

export function Planet({ planet }) {
  const globeRef = useRef()
  const { size } = useThree()
  const isMobile = size.width <= 768
  const textures = useTexture(
    planet.bumpMap ? [planet.texture, planet.bumpMap] : [planet.texture],
  )
  const texture = textures[0]
  const bumpMap = textures[1] ?? null

  useFrame((_, delta) => {
    if (!globeRef.current) return
    if (planet.isStar) {
      globeRef.current.rotation.y = 0.2 + (performance.now() / 1000) * 0.12
      return
    }

    // Globe spins around its local polar axis
    globeRef.current.rotation.y += delta * (planet.id === 'venus' ? 0.08 : 0.12)
  })

  return (
    <group
      position={planet.position}
      scale={isMobile ? 0.42 : 1}
    >
      {/* Planetary axial tilt orientation */}
      <group rotation={planet.axialTilt ?? [0.08, 0.2, 0]}>
        {/* Globe rotating on its polar axis */}
        <mesh ref={globeRef}>
          <sphereGeometry args={[planet.radius, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            bumpMap={bumpMap}
            bumpScale={bumpMap ? 0.08 : 0}
            roughness={planet.isStar ? 0.85 : planet.id === 'venus' ? 0.96 : 0.72}
            metalness={0}
            emissive={planet.isStar ? '#ff8a24' : '#000000'}
            emissiveIntensity={planet.isStar ? 0.18 : 0}
          />
        </mesh>

        {/* Photorealistic equatorial ring system */}
        {planet.ring && (
          <PlanetRing
            planetId={planet.id}
            planetRadius={planet.radius}
            ringConfig={planet.ring}
            worldPosition={planet.position}
            scale={isMobile ? 0.42 : 1}
          />
        )}
      </group>
    </group>
  )
}

