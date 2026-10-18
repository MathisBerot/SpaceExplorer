import { useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { BackSide } from 'three'

const galaxyTexture =
  'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/galaxy_starfield.png'

export function GalaxyBackground() {
  const backgroundRef = useRef()
  const { camera } = useThree()
  const texture = useTexture(galaxyTexture)

  useFrame(() => {
    backgroundRef.current.position.copy(camera.position)
    backgroundRef.current.rotation.y = (performance.now() / 1000) * 0.003
  })

  return (
    <mesh ref={backgroundRef} scale={[-1, 1, 1]} renderOrder={-1}>
      <sphereGeometry args={[90, 64, 64]} />
      <meshBasicMaterial map={texture} side={BackSide} depthWrite={false} />
    </mesh>
  )
}
