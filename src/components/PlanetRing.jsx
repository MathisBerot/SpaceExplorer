import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

/**
 * Generates an ultra-detailed, photorealistic 1D concentric ring texture
 * mapped across a 2048-pixel radial resolution.
 */
function createRingTexture(planetId) {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 32
  const ctx = canvas.getContext('2d')
  const imgData = ctx.createImageData(2048, 32)
  const data = imgData.data

  const profile = new Float32Array(2048 * 4)

  for (let x = 0; x < 2048; x++) {
    const u = x / 2047 // 0 = inner edge, 1 = outer edge
    let r = 0
    let g = 0
    let b = 0
    let a = 0

    if (planetId === 'saturn') {
      // Physically accurate Saturn Ring Structure:
      // Inner edge ~1.22 R (D-ring border) to outer edge ~2.38 R (F-ring)
      if (u < 0.02) {
        // D Ring inner transition
        const f = u / 0.02
        r = 135
        g = 125
        b = 110
        a = f * 0.16
      } else if (u < 0.258) {
        // C Ring (Crepe Ring): translucent dusty amber-gray with fine density ripples
        const t = (u - 0.02) / (0.258 - 0.02)
        const wave = 0.88 + 0.12 * Math.sin(u * 220)
        const colombo = Math.exp(-Math.pow((u - 0.09) / 0.007, 2))
        const maxwell = Math.exp(-Math.pow((u - 0.198) / 0.008, 2))
        r = 152 + t * 24
        g = 140 + t * 22
        b = 122 + t * 18
        a = (0.28 + t * 0.24) * wave * (1 - 0.82 * colombo) * (1 - 0.85 * maxwell)
      } else if (u < 0.629) {
        // B Ring: The grandest, densest, brightest golden-cream ring system
        const t = (u - 0.258) / (0.629 - 0.258)
        // Multiscale harmonic ripples mimicking the thousands of fine ringlets
        const ripple =
          0.91 +
          0.05 * Math.sin(u * 340) +
          0.03 * Math.sin(u * 720) +
          0.015 * Math.sin(u * 1450) +
          0.01 * Math.sin(u * 3200)
        r = 222 + Math.sin(t * Math.PI) * 30
        g = 202 + Math.sin(t * Math.PI) * 34
        b = 168 + Math.sin(t * Math.PI) * 36
        a = (0.94 + 0.05 * Math.sin(t * Math.PI)) * Math.min(1.0, ripple)
      } else if (u < 0.694) {
        // Cassini Division: Famous prominent dark division (~4,800 km wide)
        const t = (u - 0.629) / (0.694 - 0.629)
        r = 30
        g = 26
        b = 23
        a = 0.035 + 0.02 * Math.sin(t * Math.PI)
      } else if (u < 0.905) {
        // A Ring: Silvery champagne/tan with fine striations, Encke gap, and Keeler gap
        const t = (u - 0.694) / (0.905 - 0.694)
        const ripple =
          0.93 +
          0.04 * Math.sin(u * 280) +
          0.02 * Math.sin(u * 650)
        const encke = Math.exp(-Math.pow((u - 0.853) / 0.007, 2))
        const keeler = Math.exp(-Math.pow((u - 0.896) / 0.004, 2))
        r = 202 - t * 24
        g = 188 - t * 24
        b = 166 - t * 20
        a = (0.83 - t * 0.12) * ripple * (1 - 0.94 * encke) * (1 - 0.92 * keeler)
      } else if (u < 0.945) {
        // Gap between A Ring and F Ring
        r = 25
        g = 23
        b = 20
        a = 0.0
      } else if (u < 0.985) {
        // F Ring: Delicate narrow golden strand held by shepherd moons
        const fRing = Math.exp(-Math.pow((u - 0.965) / 0.008, 2))
        r = 198
        g = 182
        b = 158
        a = fRing * 0.44
      } else {
        r = 0
        g = 0
        b = 0
        a = 0.0
      }
    } else {
      // Physically accurate Uranus Ring System:
      // Dark slate, charcoal, and faint icy cyan-silver narrow rings separated by wide voids
      a += 0.015
      const ring = (center, width, peakAlpha) =>
        peakAlpha * Math.exp(-Math.pow((u - center) / width, 2))

      // Inner faint ringlets (6, 5, 4)
      a += ring(0.15, 0.009, 0.35)
      a += ring(0.19, 0.009, 0.38)
      a += ring(0.23, 0.009, 0.36)

      // Alpha and Beta rings
      a += ring(0.38, 0.012, 0.45)
      a += ring(0.45, 0.012, 0.48)

      // Eta, Gamma, Delta rings
      a += ring(0.58, 0.010, 0.42)
      a += ring(0.63, 0.011, 0.55)
      a += ring(0.69, 0.012, 0.60)

      // Lambda ring (faint dust band)
      a += ring(0.78, 0.018, 0.26)

      // Epsilon (ε) ring: The brilliant, dense, iconic main ring of Uranus
      a += ring(0.855, 0.025, 0.92)

      // Outer faint Nu/Mu dust ringlet
      a += ring(0.94, 0.020, 0.25)

      a = Math.min(1.0, Math.max(0.0, a))

      // Subtle icy cyan-slate coloration
      const isEpsilon = Math.exp(-Math.pow((u - 0.855) / 0.03, 2))
      r = 95 + isEpsilon * 55
      g = 118 + isEpsilon * 65
      b = 135 + isEpsilon * 70
    }

    profile[x * 4 + 0] = r
    profile[x * 4 + 1] = g
    profile[x * 4 + 2] = b
    profile[x * 4 + 3] = a
  }

  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 2048; x++) {
      const idx = (y * 2048 + x) * 4
      const pIdx = x * 4
      data[idx + 0] = profile[pIdx + 0]
      data[idx + 1] = profile[pIdx + 1]
      data[idx + 2] = profile[pIdx + 2]
      data[idx + 3] = Math.round(profile[pIdx + 3] * 255)
    }
  }

  ctx.putImageData(imgData, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  return texture
}

/**
 * Creates RingGeometry with UV coordinates mapped radially:
 * uv.x goes linearly from 0.0 (inner radius) to 1.0 (outer radius).
 */
function createRadialRingGeometry(
  innerRadius,
  outerRadius,
  thetaSegments = 160,
  phiSegments = 64,
) {
  const geometry = new THREE.RingGeometry(
    innerRadius,
    outerRadius,
    thetaSegments,
    phiSegments,
  )
  const pos = geometry.attributes.position
  const uv = geometry.attributes.uv
  const span = outerRadius - innerRadius

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const r = Math.sqrt(x * x + y * y)
    const u = Math.min(1, Math.max(0, (r - innerRadius) / span))
    uv.setXY(i, u, 0.5)
  }
  uv.needsUpdate = true
  return geometry
}

const ringVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`

const ringFragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec3 uSunPosition;
  uniform vec3 uPlanetCenter;
  uniform float uPlanetRadius;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;

  void main() {
    // Sample concentric radial texture (vUv.x represents [innerRadius, outerRadius])
    vec4 texColor = texture2D(uTexture, vec2(vUv.x, 0.5));
    if (texColor.a < 0.005) discard;

    // Vector from planet center to this ring fragment in world space
    vec3 relPos = vWorldPosition - uPlanetCenter;

    // Sunlight direction in world coordinates
    vec3 L = normalize(uSunPosition);

    // Ray from fragment towards the light source: relPos + t * L
    // If t > 0, the fragment is on the night side of the planet
    float t = -dot(relPos, L);
    float shadow = 1.0;
    if (t > 0.0) {
      vec3 closestPoint = relPos + t * L;
      float dist = length(closestPoint);
      // Soft penumbra at shadow boundary
      shadow = smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.02, dist);
    }

    // Double-sided physical scattering: particles forward-scatter and back-scatter
    vec3 N = normalize(vWorldNormal);
    float cosTheta = abs(dot(N, L));
    float lighting = 0.55 + 0.45 * cosTheta;

    // Ambient illumination from the surrounding cosmos so shadowed rings remain subtly visible
    float ambient = 0.09;
    float lightFactor = ambient + (1.0 - ambient) * (lighting * shadow);

    vec3 finalRgb = texColor.rgb * lightFactor;
    float finalAlpha = texColor.a * uOpacity;

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`

export function PlanetRing({
  planetId,
  planetRadius,
  ringConfig,
  worldPosition,
  scale = 1,
}) {
  const meshRef = useRef()
  const materialRef = useRef()

  const innerRadius = ringConfig?.innerRadius ?? planetRadius * 1.25
  const outerRadius = ringConfig?.outerRadius ?? planetRadius * 2.35
  const rotationSpeed = ringConfig?.rotationSpeed ?? 0.015

  const ringTexture = useMemo(() => createRingTexture(planetId), [planetId])
  const ringGeometry = useMemo(
    () => createRadialRingGeometry(innerRadius, outerRadius),
    [innerRadius, outerRadius],
  )

  useEffect(() => {
    return () => {
      ringTexture.dispose()
      ringGeometry.dispose()
    }
  }, [ringTexture, ringGeometry])

  const initialUniforms = useMemo(
    () => ({
      uTexture: { value: ringTexture },
      uSunPosition: { value: new THREE.Vector3(4, 5, 6).normalize() },
      uPlanetCenter: { value: new THREE.Vector3(...worldPosition) },
      uPlanetRadius: { value: planetRadius * scale },
      uOpacity: { value: 1.0 },
    }),
    [ringTexture, worldPosition, planetRadius, scale],
  )

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Subtle axial ring spin (axisymmetric, no wobble)
      meshRef.current.rotation.z += delta * rotationSpeed
    }

    if (materialRef.current?.uniforms) {
      materialRef.current.uniforms.uPlanetRadius.value = planetRadius * scale
      materialRef.current.uniforms.uPlanetCenter.value.set(...worldPosition)
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={ringGeometry}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={1}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={ringVertexShader}
        fragmentShader={ringFragmentShader}
        uniforms={initialUniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        depthTest
      />
    </mesh>
  )
}
