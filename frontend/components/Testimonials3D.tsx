'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Box, Cylinder, Float, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

const testimonials = [
  {
    quote: "Click2Leads transformed our business. We went from 100 to 5,000 leads per month!",
    author: "Sarah Johnson",
    company: "TechStart Solutions",
    rating: 5,
    color: '#0EA5E9',
  },
  {
    quote: "The revenue share model meant we could scale without upfront costs. Game changer!",
    author: "Michael Chen",
    company: "GrowthBox Inc",
    rating: 5,
    color: '#A855F7',
  },
  {
    quote: "4.7 million leads generated speaks for itself. These guys know what they're doing.",
    author: "Emma Davis",
    company: "Solar Innovations",
    rating: 5,
    color: '#10B981',
  },
  {
    quote: "From day one, the leads were high quality. Our conversion rate doubled!",
    author: "James Wilson",
    company: "HomePro Services",
    rating: 5,
    color: '#F59E0B',
  },
]

// 3D Testimonial Card
function TestimonialCard3D({ testimonial, index, total, active }: any) {
  const meshRef = useRef<THREE.Group>(null)
  const angle = (index / total) * Math.PI * 2
  const radius = 4

  useFrame((state) => {
    if (meshRef.current) {
      const targetAngle = angle + state.clock.elapsedTime * 0.1
      meshRef.current.position.x = Math.sin(targetAngle) * radius
      meshRef.current.position.z = Math.cos(targetAngle) * radius
      meshRef.current.rotation.y = -targetAngle + Math.PI / 2
      
      // Scale based on position
      const scale = active ? 1.2 : 0.8 + Math.cos(targetAngle) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.1}>
        {/* Glass Card */}
        <Box args={[3, 4, 0.1]}>
          <MeshTransmissionMaterial
            backside
            thickness={0.5}
            roughness={0.1}
            transmission={0.8}
            ior={1.2}
            chromaticAberration={0.02}
            color={testimonial.color}
          />
        </Box>
        
        {/* Content */}
        <Text
          position={[0, 0.5, 0.1]}
          fontSize={0.15}
          maxWidth={2.5}
          textAlign="center"
          color="white"
        >
          "{testimonial.quote}"
        </Text>
        
        <Text
          position={[0, -1, 0.1]}
          fontSize={0.12}
          color={testimonial.color}
          fontWeight="bold"
        >
          {testimonial.author}
        </Text>
        
        <Text
          position={[0, -1.3, 0.1]}
          fontSize={0.1}
          color="white"
        >
          <meshBasicMaterial attach="material" color="white" opacity={0.7} transparent />
          {testimonial.company}
        </Text>
        
        {/* Rating Stars */}
        <group position={[0, -1.7, 0.1]}>
          {[...Array(5)].map((_, i) => (
            <Text
              key={i}
              position={[(i - 2) * 0.3, 0, 0]}
              fontSize={0.2}
              color="#F59E0B"
            >
              ★
            </Text>
          ))}
        </group>
      </Float>
    </group>
  )
}

// 3D Platform Showcase
function Platforms3D() {
  const platforms = [
    { name: 'Facebook', icon: '📘', color: '#1877F2' },
    { name: 'Google', icon: '🔍', color: '#4285F4' },
    { name: 'TikTok', icon: '📱', color: '#FF0050' },
    { name: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Platform <span className="gradient-text">Integration</span>
        </h2>
        
        <div className="relative h-[400px] rounded-2xl overflow-hidden glass-morphism">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {platforms.map((platform, i) => {
              const angle = (i / platforms.length) * Math.PI * 2
              return (
                <Float
                  key={platform.name}
                  speed={2}
                  rotationIntensity={1}
                  floatIntensity={2}
                >
                  <group
                    position={[
                      Math.cos(angle) * 3,
                      Math.sin(angle) * 2,
                      0
                    ]}
                  >
                    <Cylinder args={[1, 1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                      <meshStandardMaterial color={platform.color} metalness={0.8} roughness={0.2} />
                    </Cylinder>
                    <Text
                      position={[0, 0, 0.2]}
                      fontSize={0.5}
                      anchorX="center"
                      anchorY="middle"
                    >
                      {platform.icon}
                    </Text>
                  </group>
                </Float>
              )
            })}
            
            {/* Central Hub */}
            <Float speed={1}>
              <Box args={[1.5, 1.5, 1.5]}>
                <meshStandardMaterial
                  color="#0EA5E9"
                  emissive="#0EA5E9"
                  emissiveIntensity={0.5}
                  metalness={0.9}
                  roughness={0.1}
                />
              </Box>
              <Text
                position={[0, 0, 0.8]}
                fontSize={0.3}
                color="white"
                anchorX="center"
              >
                C2L
              </Text>
            </Float>
            
            {/* Connection Lines */}
            {platforms.map((_, i) => {
              const angle = (i / platforms.length) * Math.PI * 2
              return (
                <line key={i}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      args={[new Float32Array([
                        0, 0, 0,
                        Math.cos(angle) * 3, Math.sin(angle) * 2, 0
                      ]), 3]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#0EA5E9" opacity={0.3} transparent />
                </line>
              )
            })}
          </Canvas>
        </div>
      </div>
    </section>
  )
}

// 3D Stats Counter
function Stats3D() {
  const stats = [
    { label: 'Leads', value: 4700000, color: '#0EA5E9' },
    { label: 'Clients', value: 180, color: '#A855F7' },
    { label: 'Ad Spend', value: 28000000, color: '#10B981' },
    { label: 'Team', value: 85, color: '#F59E0B' },
  ]

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative h-64"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} />
                
                <Float speed={2} rotationIntensity={0.5}>
                  <Box args={[2, 2, 2]}>
                    <meshStandardMaterial
                      color={stat.color}
                      emissive={stat.color}
                      emissiveIntensity={0.3}
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </Box>
                  
                  <Text
                    position={[0, 0, 1.1]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                  >
                    {stat.value.toLocaleString()}
                  </Text>
                </Float>
              </Canvas>
              
              <div className="absolute bottom-0 left-0 right-0 text-center">
                <h3 className="text-xl font-bold" style={{ color: stat.color }}>
                  {stat.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// 3D Lead Funnel
function LeadFunnel3D() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          Lead Generation <span className="gradient-text">Funnel</span>
        </h2>
        
        <div className="relative h-[600px] rounded-2xl overflow-hidden">
          <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, 10, -10]} color="#A855F7" intensity={0.5} />
            
            {/* Funnel Stages */}
            {['Awareness', 'Interest', 'Decision', 'Action'].map((stage, i) => {
              const y = -i * 2
              const scale = 4 - i * 0.8
              
              return (
                <group key={stage} position={[0, y, 0]}>
                  <Cylinder
                    args={[scale, scale - 0.8, 1.5, 32, 1, true]}
                    rotation={[0, 0, 0]}
                  >
                    <meshStandardMaterial
                      color={['#0EA5E9', '#A855F7', '#10B981', '#F59E0B'][i]}
                      transparent
                      opacity={0.7}
                      side={THREE.DoubleSide}
                    />
                  </Cylinder>
                  
                  <Text
                    position={[0, 0, scale + 0.5]}
                    fontSize={0.3}
                    color="white"
                    anchorX="center"
                  >
                    {stage}
                  </Text>
                </group>
              )
            })}
            
            {/* Falling Leads */}
            {[...Array(20)].map((_, i) => (
              <Float key={i} speed={1 + Math.random()} floatIntensity={5}>
                <mesh
                  position={[
                    (Math.random() - 0.5) * 6,
                    6 + Math.random() * 4,
                    (Math.random() - 0.5) * 2
                  ]}
                >
                  <sphereGeometry args={[0.1]} />
                  <meshStandardMaterial
                    color="#0EA5E9"
                    emissive="#0EA5E9"
                    emissiveIntensity={0.5}
                  />
                </mesh>
              </Float>
            ))}
          </Canvas>
        </div>
      </div>
    </section>
  )
}

export { Platforms3D, Stats3D, LeadFunnel3D }

// Main 3D Testimonials Component
function Scene({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#A855F7" />
      
      {/* Testimonial Cards Carousel */}
      {testimonials.map((testimonial, index) => (
        <TestimonialCard3D
          key={index}
          testimonial={testimonial}
          index={index}
          total={testimonials.length}
          active={index === activeIndex}
        />
      ))}
      
      {/* Center Platform */}
      <Cylinder args={[5, 5, 0.2]} position={[0, -3, 0]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </>
  )
}

export default function Testimonials3D() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-[#0a0a1a] to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-xl text-white/70">
            Join hundreds of satisfied businesses generating leads with Click2Leads
          </p>
        </motion.div>

        <div className="relative h-[600px] rounded-2xl overflow-hidden">
          <Canvas camera={{ position: [0, 2, 10], fov: 45 }}>
            <Scene activeIndex={activeIndex} />
          </Canvas>
          
          {/* Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-electric-blue w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}