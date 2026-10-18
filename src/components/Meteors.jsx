import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function createTrailTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  // Horizontal gradient: left (0) is tail, right (512) is head
  const hGrad = ctx.createLinearGradient(0, 0, 512, 0)
  hGrad.addColorStop(0, 'rgba(160, 210, 255, 0)')
  hGrad.addColorStop(0.25, 'rgba(180, 225, 255, 0.12)')
  hGrad.addColorStop(0.6, 'rgba(215, 240, 255, 0.38)')
  hGrad.addColorStop(0.88, 'rgba(245, 250, 255, 0.85)')
  hGrad.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = hGrad
  ctx.fillRect(0, 0, 512, 64)

  // Vertical gradient: smooth Gaussian-like fade to edges
  const vGrad = ctx.createLinearGradient(0, 0, 0, 64)
  vGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  vGrad.addColorStop(0.2, 'rgba(0, 0, 0, 0.4)')
  vGrad.addColorStop(0.5, 'rgba(0, 0, 0, 1)')
  vGrad.addColorStop(0.8, 'rgba(0, 0, 0, 0.4)')
  vGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = vGrad
  ctx.fillRect(0, 0, 512, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

function createHeadGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')

  const radGrad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  radGrad.addColorStop(0.2, 'rgba(235, 245, 255, 0.85)')
  radGrad.addColorStop(0.5, 'rgba(170, 220, 255, 0.35)')
  radGrad.addColorStop(1, 'rgba(140, 200, 255, 0)')

  ctx.fillStyle = radGrad
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

export function Meteors() {
  const { camera } = useThree()
  const groupRef = useRef()
  const meteorMeshRef = useRef()
  const crossMeshRef = useRef()
  const headGlowRef = useRef()
  const headCoreRef = useRef()

  const trailTexture = useMemo(() => createTrailTexture(), [])
  const headGlowTexture = useMemo(() => createHeadGlowTexture(), [])

  const trailLength = 9
  const trailWidth = 0.4

  const trailGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(trailLength, trailWidth)
    geom.translate(-trailLength / 2, 0, 0)
    return geom
  }, [trailLength, trailWidth])

  const crossGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(trailLength, trailWidth)
    geom.translate(-trailLength / 2, 0, 0)
    geom.rotateX(Math.PI / 2)
    return geom
  }, [trailLength, trailWidth])

  const trailMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: trailTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
      }),
    [trailTexture],
  )

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: headGlowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
      }),
    [headGlowTexture],
  )

  useEffect(() => {
    return () => {
      trailTexture.dispose()
      headGlowTexture.dispose()
      trailGeometry.dispose()
      crossGeometry.dispose()
      trailMaterial.dispose()
      glowMaterial.dispose()
    }
  }, [
    trailTexture,
    headGlowTexture,
    trailGeometry,
    crossGeometry,
    trailMaterial,
    glowMaterial,
  ])

  // Delays between 5 and 20 seconds, initialized in frame loop to preserve purity
  const timeUntilNext = useRef(null)
  const activeMeteor = useRef(null)

  const spawnMeteor = () => {
    const isLeftToRight = Math.random() > 0.5
    const startX = isLeftToRight ? -65 : 65
    const endX = isLeftToRight ? 65 : -65
    const startY = -6 + Math.random() * 18
    const slope = (Math.random() - 0.48) * 0.22
    const endY = startY + (endX - startX) * slope
    const duration = 0.70 + Math.random() * 0.3 // Quick crossing
    const angle = Math.atan2(endY - startY, endX - startX)

    return {
      startX,
      endX,
      startY,
      endY,
      duration,
      angle,
      elapsed: 0,
    }
  }

  useFrame((_, delta) => {
    if (!groupRef.current) return

    // Position and orient the group to remain in camera view space
    groupRef.current.position.copy(camera.position)
    groupRef.current.quaternion.copy(camera.quaternion)

    const safeDelta = Math.min(delta, 0.1)

    if (timeUntilNext.current === null) {
      timeUntilNext.current = 2
    }

    if (!activeMeteor.current) {
      timeUntilNext.current -= safeDelta
      if (timeUntilNext.current <= 0) {
        activeMeteor.current = spawnMeteor()
      }
    }

    const meteor = activeMeteor.current
    const isVisible = Boolean(meteor)

    if (meteorMeshRef.current) meteorMeshRef.current.visible = isVisible
    if (crossMeshRef.current) crossMeshRef.current.visible = isVisible
    if (headGlowRef.current) headGlowRef.current.visible = isVisible
    if (headCoreRef.current) headCoreRef.current.visible = isVisible

    if (!meteor) return

    meteor.elapsed += safeDelta
    const progress = meteor.elapsed / meteor.duration

    if (progress >= 1) {
      activeMeteor.current = null
      timeUntilNext.current = Math.random() * 10 + 5
      return
    }

    const currentX = meteor.startX + progress * (meteor.endX - meteor.startX)
    const currentY = meteor.startY + progress * (meteor.endY - meteor.startY)
    const z = -55

    if (meteorMeshRef.current) {
      meteorMeshRef.current.position.set(currentX, currentY, z)
      meteorMeshRef.current.rotation.z = meteor.angle
    }
    if (crossMeshRef.current) {
      crossMeshRef.current.position.set(currentX, currentY, z)
      crossMeshRef.current.rotation.z = meteor.angle
    }
    if (headGlowRef.current) {
      headGlowRef.current.position.set(currentX, currentY, z)
    }
    if (headCoreRef.current) {
      headCoreRef.current.position.set(currentX, currentY, z)
    }
  })

  return (
    <group ref={groupRef} renderOrder={0}>
      <mesh
        ref={meteorMeshRef}
        geometry={trailGeometry}
        material={trailMaterial}
        visible={false}
      />
      <mesh
        ref={crossMeshRef}
        geometry={crossGeometry}
        material={trailMaterial}
        visible={false}
      />
      <mesh ref={headGlowRef} material={glowMaterial} visible={false}>
        <planeGeometry args={[0.9, 0.9]} />
      </mesh>
      <mesh ref={headCoreRef} visible={false}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

