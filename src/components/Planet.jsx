import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export function Planet({ planet }) {
  const planetRef = useRef()
  const { size } = useThree()
  const isMobile = size.width <= 768
  const textures = useTexture(
    planet.bumpMap ? [planet.texture, planet.bumpMap] : [planet.texture],
  )
  const texture = textures[0]
  const bumpMap = textures[1] ?? null

  useFrame((_, delta) => {
    if (!planetRef.current) return
    if (planet.isStar) {
      planetRef.current.rotation.y = 0.2 + (performance.now() / 1000) * 0.12
      return
    }

    planetRef.current.rotation.y += delta * (planet.id === 'venus' ? 0.08 : 0.12)
  })

  return (
    <mesh
      ref={planetRef}
      position={planet.position}
      rotation={[0.08, 0.2, 0]}
      scale={isMobile ? 0.42 : 1}
    >
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
      {planet.ring && (
        <mesh rotation={[Math.PI / 2.5, 0.18, 0]}>
          <ringGeometry args={[planet.radius * 1.35, planet.radius * 2, 64]} />
          <meshStandardMaterial
            color="#b8a58c"
            transparent
            opacity={0.58}
            side={2}
            roughness={1}
          />
        </mesh>
      )}
    </mesh>
  )
}

