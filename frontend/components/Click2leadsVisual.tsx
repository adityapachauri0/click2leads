'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus, Float } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        {/* Central sphere representing the click */}
        <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#0EA5E9"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Orbiting elements representing leads */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2
          const radius = 2.5
          return (
            <Box
              key={i}
              args={[0.3, 0.3, 0.3]}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * 0.5,
                Math.sin(angle) * radius,
              ]}
            >
              <meshStandardMaterial
                color="#A855F7"
                emissive="#A855F7"
                emissiveIntensity={0.3}
              />
            </Box>
          )
        })}
        
        {/* Connection rings */}
        <Torus args={[2, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={0.3}
            opacity={0.6}
            transparent
          />
        </Torus>
        
        <Torus args={[2.5, 0.05, 16, 100]} rotation={[Math.PI / 3, 0, 0]}>
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#F59E0B"
            emissiveIntensity={0.3}
            opacity={0.4}
            transparent
          />
        </Torus>
      </Float>
    </group>
  )
}

export default function Click2leadsVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#A855F7" />
          <pointLight position={[10, -10, 5]} intensity={0.5} color="#0EA5E9" />
          <AnimatedMesh />
        </Canvas>
      </div>
      
      {/* Animated cursor clicking effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 2L3 12.5H11V22L21.5 11.5H13.5V2Z"
            fill="url(#gradient)"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
      
      {/* Particle effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-electric-blue rounded-full"
            initial={{
              x: '50%',
              y: '50%',
              opacity: 0,
            }}
            animate={{
              x: `${50 + (Math.random() - 0.5) * 100}%`,
              y: `${50 + (Math.random() - 0.5) * 100}%`,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}