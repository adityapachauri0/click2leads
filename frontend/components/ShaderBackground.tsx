'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ShaderMaterial } from 'three'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  varying vec2 vUv;

  vec3 colorA = vec3(0.055, 0.647, 0.914); // Electric Blue
  vec3 colorB = vec3(0.659, 0.333, 0.969); // Neon Purple
  vec3 colorC = vec3(0.039, 0.039, 0.039); // Deep Black

  float noise(vec2 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0);
  }

  void main() {
    vec2 st = vUv;
    vec2 mouse = uMouse * 0.5 + 0.5;
    
    float distanceFromMouse = distance(st, mouse);
    float influence = smoothstep(0.5, 0.0, distanceFromMouse);
    
    vec2 distortedSt = st + vec2(
      sin(uTime * 0.5 + st.y * 5.0) * 0.02,
      cos(uTime * 0.3 + st.x * 5.0) * 0.02
    ) * (1.0 + influence * 0.5);
    
    float noiseValue = noise(distortedSt * 10.0 + uTime * 0.2);
    float flow = sin(distortedSt.x * 3.0 + distortedSt.y * 3.0 + uTime * 0.5) * 0.5 + 0.5;
    flow = mix(flow, noiseValue * 0.5 + 0.5, 0.3);
    
    vec3 color1 = mix(colorA, colorB, flow);
    vec3 color2 = mix(color1, colorC, 1.0 - influence * 0.7);
    
    float gradient = pow(st.y, 2.0) * 0.5;
    vec3 finalColor = mix(color2, colorC, gradient);
    
    finalColor += influence * 0.1;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

function ShaderPlane() {
  const meshRef = useRef<THREE.Mesh>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { viewport, mouse } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    }),
    [viewport]
  )

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as ShaderMaterial
      material.uniforms.uTime.value = state.clock.elapsedTime
      material.uniforms.uMouse.value.x = mouse.x
      material.uniforms.uMouse.value.y = mouse.y
      material.uniforms.uResolution.value.x = viewport.width
      material.uniforms.uResolution.value.y = viewport.height
    }
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <ShaderPlane />
      </Canvas>
    </div>
  )
}