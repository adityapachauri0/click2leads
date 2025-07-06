'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Trail, Float, Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// 3D Click Button Component
function ClickButton({ onClick }: { onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      }
    }
  })

  const handleClick = () => {
    setClicked(true)
    onClick()
    setTimeout(() => setClicked(false), 300)
  }

  return (
    <Float speed={2} rotationIntensity={0.5}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[2, 2, 2]} />
        <MeshDistortMaterial
          color={clicked ? '#10B981' : hovered ? '#A855F7' : '#0EA5E9'}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <Text
        position={[0, 0, 1.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        CLICK
      </Text>
    </Float>
  )
}

// Lead Particle
function LeadParticle({ position, delay }: { position: [number, number, number], delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useFrame((state) => {
    if (meshRef.current && active) {
      meshRef.current.position.y += 0.05
      meshRef.current.position.x += Math.sin(state.clock.elapsedTime + delay) * 0.01
      meshRef.current.rotation.x += 0.02
      meshRef.current.rotation.y += 0.02

      if (meshRef.current.position.y > 5) {
        meshRef.current.position.y = -5
      }
    }
  })

  if (!active) return null

  return (
    <Trail
      width={1}
      length={10}
      color={new THREE.Color('#0EA5E9')}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#0EA5E9"
          emissive="#0EA5E9"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Trail>
  )
}

// 3D Scene
function Scene() {
  const [particles, setParticles] = useState<Array<{ id: number; position: [number, number, number]; delay: number }>>([])
  const [showExplosion, setShowExplosion] = useState(false)

  const generateLeads = () => {
    const newParticles: Array<{ id: number; position: [number, number, number]; delay: number }> = []
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: Date.now() + i,
        position: [
          (Math.random() - 0.5) * 8,
          -5,
          (Math.random() - 0.5) * 8
        ] as [number, number, number],
        delay: i * 50
      })
    }
    setParticles(prev => [...prev.slice(-100), ...newParticles])
    setShowExplosion(true)
    setTimeout(() => setShowExplosion(false), 500)
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A855F7" />
      
      {/* Click Button */}
      <ClickButton onClick={generateLeads} />
      
      {/* Lead Particles */}
      {particles.map((particle) => (
        <LeadParticle
          key={particle.id}
          position={particle.position}
          delay={particle.delay}
        />
      ))}
      
      {/* Explosion Effect */}
      {showExplosion && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#10B981"
            emissive="#10B981"
            emissiveIntensity={2}
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
      
      {/* Orbit Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      
      {/* Grid Floor */}
      <gridHelper args={[20, 20]} position={[0, -5, 0]} />
    </>
  )
}

export default function VisualSection3D() {
  const [clickCount, setClickCount] = useState(0)
  const countSpring = useSpring(0, { stiffness: 100, damping: 30 })
  
  useEffect(() => {
    countSpring.set(clickCount * 50)
  }, [clickCount, countSpring])

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-[#0a0a1a] to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
              One Click to <span className="gradient-text">Unlimited Leads</span>
            </h2>
            <p className="text-base sm:text-xl text-white/70 mb-8">
              Experience the power of instant lead generation. Click the 3D button and watch as 
              qualified leads flow into your pipeline in real-time.
            </p>
            
            <div className="space-y-6">
              {/* Live Counter */}
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-2xl font-bold mb-2">
                  Leads Generated: <motion.span className="gradient-text">{countSpring}</motion.span>
                </h3>
                <p className="text-white/60">Click the 3D button to generate more leads!</p>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                  <p className="text-sm text-white/60">Instant</p>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✓
                  </motion.div>
                  <p className="text-sm text-white/60">Verified</p>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🎯
                  </motion.div>
                  <p className="text-sm text-white/60">Targeted</p>
                </div>
              </div>
              
              {/* CTA */}
              <motion.a
                href="/contact"
                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Generating Real Leads
              </motion.a>
            </div>
          </motion.div>
          
          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), transparent)',
            }}
          >
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
              <Scene />
            </Canvas>
            
            {/* Instructions */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 glass-morphism rounded-lg p-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-white/80">
                🖱️ Click the 3D cube to generate leads • Drag to rotate view
              </p>
            </motion.div>
            
            {/* Click Counter Badge */}
            <motion.div
              className="absolute top-4 right-4 px-4 py-2 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <p className="text-white font-bold">
                {clickCount} Clicks = {clickCount * 50} Leads
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}