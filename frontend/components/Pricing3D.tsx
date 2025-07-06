'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Sphere, Ring, Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// 3D Pricing Calculator
function PricingCalculator3D() {
  const [leads, setLeads] = useState(1000)
  const [model, setModel] = useState<'revenue-share' | 'pay-per-lead'>('revenue-share')
  
  const pricePerLead = 25
  const revenueSharePercent = 20
  const avgLeadValue = 150

  const calculateCost = () => {
    if (model === 'pay-per-lead') {
      return leads * pricePerLead
    } else {
      return (leads * avgLeadValue * revenueSharePercent) / 100
    }
  }

  // 3D Slider Component
  function Slider3D() {
    const sliderRef = useRef<THREE.Group>(null)
    const [isDragging, setIsDragging] = useState(false)

    useFrame(({ mouse }) => {
      if (isDragging && sliderRef.current) {
        const newValue = Math.round((mouse.x + 1) * 2500)
        setLeads(Math.max(100, Math.min(5000, newValue)))
      }
    })

    return (
      <group ref={sliderRef} position={[0, -2, 0]}>
        {/* Slider Track */}
        <Box args={[8, 0.2, 0.5]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#1a1a2e" />
        </Box>
        
        {/* Slider Handle */}
        <Float speed={2} floatIntensity={0.5}>
          <Sphere
            args={[0.5]}
            position={[(leads / 5000) * 8 - 4, 0, 0]}
            onPointerDown={() => setIsDragging(true)}
            onPointerUp={() => setIsDragging(false)}
            onPointerLeave={() => setIsDragging(false)}
          >
            <MeshDistortMaterial
              color="#0EA5E9"
              emissive="#0EA5E9"
              emissiveIntensity={0.5}
              distort={0.2}
              speed={2}
            />
          </Sphere>
        </Float>
        
        {/* Value Display */}
        <Text
          position={[0, 1, 0]}
          fontSize={0.5}
          color="#0EA5E9"
          anchorX="center"
        >
          {leads.toLocaleString()} Leads
        </Text>
      </group>
    )
  }

  // 3D Cost Display
  function CostDisplay3D() {
    const cost = calculateCost()
    const cubeRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
      if (cubeRef.current) {
        cubeRef.current.rotation.y = state.clock.elapsedTime * 0.5
        cubeRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * 0.1)
      }
    })

    return (
      <group position={[0, 2, 0]}>
        <Float speed={2} rotationIntensity={0.5}>
          <Box ref={cubeRef} args={[2, 2, 2]}>
            <meshStandardMaterial
              color={model === 'revenue-share' ? '#10B981' : '#A855F7'}
              emissive={model === 'revenue-share' ? '#10B981' : '#A855F7'}
              emissiveIntensity={0.3}
              metalness={0.8}
              roughness={0.2}
            />
          </Box>
          
          <Text
            position={[0, 0, 1.1]}
            fontSize={0.3}
            color="white"
            anchorX="center"
          >
            £{cost.toLocaleString()}
          </Text>
          
          <Text
            position={[0, -0.5, 1.1]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            opacity={0.7}
          >
            {model === 'revenue-share' ? '/month (estimated)' : 'total cost'}
          </Text>
        </Float>
        
        {/* Orbiting Rings */}
        <Ring args={[2.5, 3, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0EA5E9" opacity={0.3} transparent />
        </Ring>
        <Ring args={[3, 3.5, 32]} rotation={[0, Math.PI / 2, 0]}>
          <meshStandardMaterial color="#A855F7" opacity={0.3} transparent />
        </Ring>
      </group>
    )
  }

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Interactive <span className="gradient-text">Pricing Calculator</span>
          </h2>
          <p className="text-xl text-white/70">
            Drag the 3D slider to see your investment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Calculator */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden glass-morphism">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <pointLight position={[-10, -10, -10]} color="#A855F7" intensity={0.5} />
              
              <Slider3D />
              <CostDisplay3D />
              
              {/* Background Elements */}
              {[...Array(10)].map((_, i) => (
                <Float key={i} speed={1 + Math.random()} floatIntensity={2}>
                  <Sphere
                    args={[0.1]}
                    position={[
                      (Math.random() - 0.5) * 10,
                      (Math.random() - 0.5) * 10,
                      -5 + Math.random() * 2
                    ]}
                  >
                    <meshStandardMaterial
                      color={['#0EA5E9', '#A855F7', '#10B981', '#F59E0B'][i % 4]}
                      emissive={['#0EA5E9', '#A855F7', '#10B981', '#F59E0B'][i % 4]}
                      emissiveIntensity={0.5}
                    />
                  </Sphere>
                </Float>
              ))}
            </Canvas>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Choose Your Model</h3>
              <div className="space-y-4">
                <motion.button
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    model === 'revenue-share'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => setModel('revenue-share')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-xl font-bold mb-2">Revenue Share</h4>
                  <p className="text-white/60">Pay only when you make sales</p>
                </motion.button>

                <motion.button
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    model === 'pay-per-lead'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                  onClick={() => setModel('pay-per-lead')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-xl font-bold mb-2">Pay Per Lead</h4>
                  <p className="text-white/60">Fixed price per lead</p>
                </motion.button>
              </div>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Your Investment</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/60">Leads per month:</span>
                  <span className="font-bold">{leads.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Pricing model:</span>
                  <span className="font-bold capitalize">{model.replace('-', ' ')}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span className="gradient-text">£{calculateCost().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.a
              href="/contact"
              className="block w-full px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}

// 3D Hero Section Concept
function Hero3D() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Floating Lead Icons */}
          {[...Array(50)].map((_, i) => {
            const x = (Math.random() - 0.5) * 20
            const y = (Math.random() - 0.5) * 20
            const z = (Math.random() - 0.5) * 10
            
            return (
              <Float key={i} speed={0.5 + Math.random()} floatIntensity={2}>
                <Text
                  position={[x, y, z]}
                  fontSize={0.5}
                  color="#0EA5E9"
                  opacity={0.3}
                >
                  {['👤', '📧', '💼', '🎯', '📊'][i % 5]}
                </Text>
              </Float>
            )
          })}
          
          {/* Central 3D Logo */}
          <Float speed={2} rotationIntensity={0.5}>
            <group>
              <Box args={[2, 2, 2]}>
                <MeshDistortMaterial
                  color="#0EA5E9"
                  attach="material"
                  distort={0.3}
                  speed={2}
                  roughness={0.2}
                  metalness={0.8}
                />
              </Box>
              <Text
                position={[0, 0, 1.1]}
                fontSize={0.4}
                color="white"
                anchorX="center"
              >
                C2L
              </Text>
            </group>
          </Float>
        </Canvas>
      </div>
      
      <div className="relative z-10 text-center">
        <motion.h1
          className="text-6xl md:text-8xl font-display font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Click2<span className="gradient-text">Leads</span>
        </motion.h1>
        <motion.p
          className="text-2xl text-white/70 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          A Lead Generation Powerhouse
        </motion.p>
      </div>
    </section>
  )
}

export { PricingCalculator3D, Hero3D }