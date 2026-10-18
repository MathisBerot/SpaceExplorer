import { Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export function StarField() {
  const starsRef = useRef()
  const { camera } = useThree()

  useFrame(() => {
    starsRef.current.position.copy(camera.position)
    starsRef.current.rotation.y = (performance.now() / 1000) * 0.006
  })

  return (
    <group ref={starsRef}>
      <Stars
        radius={100}
        depth={55}
        count={4500}
        factor={3.2}
        saturation={0}
        fade
        speed={0}
      />
    </group>
  )
}
