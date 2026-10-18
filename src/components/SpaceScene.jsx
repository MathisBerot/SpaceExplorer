import { Canvas, useThree } from '@react-three/fiber'
import { Suspense } from 'react'
import { CameraController } from './CameraController'
import { GalaxyBackground } from './GalaxyBackground'
import { Planet } from './Planet'
import { StarField } from './StarField'
import { Meteors } from './Meteors'
import { celestialBodies } from '../data/planets'

function SceneFallback({ body }) {
  const { size } = useThree()
  const isMobile = size.width <= 768

  return (
    <mesh position={body.position} scale={isMobile ? 0.42 : 1}>
      <sphereGeometry args={[body.radius, 48, 48]} />
      <meshStandardMaterial
        color={body.isStar ? '#f08a28' : '#8f99ad'}
        emissive={body.isStar ? '#d85b16' : '#000000'}
        emissiveIntensity={body.isStar ? 0.35 : 0}
        roughness={0.85}
      />
    </mesh>
  )
}

export function SpaceScene({ progress, className = '' }) {
  const activeBody = celestialBodies[Math.round(progress)] ?? celestialBodies[0]

  return (
    <div
      className={`scene-container ${className}`}
      aria-label="Scène 3D du système solaire"
    >
      <Canvas
        camera={{ position: [3.8, 0.4, 36.2], fov: 42, near: 0.1, far: 200 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#020309']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[4, 5, 6]} intensity={2.4} color="#fff8ed" />
        <pointLight position={[4, 5, 6]} intensity={3} color="#fff0c7" />
        <Suspense fallback={<SceneFallback body={activeBody} />}>
          <GalaxyBackground />
          <StarField />
          <Meteors />
          {celestialBodies.map((planet) => (
            <Planet key={planet.id} planet={planet} />
          ))}
        </Suspense>
        <CameraController progress={progress} planets={celestialBodies} />
      </Canvas>
    </div>
  )
}
