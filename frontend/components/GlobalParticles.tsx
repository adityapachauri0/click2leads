'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  path: string
}

const particleColors = ['#0EA5E9', '#A855F7', '#10B981', '#F59E0B']

const leadIcons = ['👤', '✉️', '📧', '💼', '🎯', '📊', '💰', '🚀']

export default function GlobalParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Detect mobile and reduce particles
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 10 : 30
    
    // Create initial particles
    const initialParticles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push(createParticle(i))
    }
    setParticles(initialParticles)

    // Add new particles periodically
    const interval = setInterval(() => {
      setParticles(prev => {
        const filtered = prev.filter(p => {
          const age = Date.now() - p.id
          return age < (p.duration + p.delay) * 1000
        })
        
        // Add new particles if needed
        if (filtered.length < particleCount) {
          filtered.push(createParticle(Date.now()))
        }
        
        return filtered
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  function createParticle(id: number): Particle {
    const side = Math.random() < 0.5 ? 'left' : 'right'
    const x = side === 'left' ? Math.random() * 30 : 70 + Math.random() * 30
    
    return {
      id,
      x,
      y: 100 + Math.random() * 20,
      size: Math.random() * 3 + 1,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 2,
      path: Math.random() < 0.5 ? 'straight' : 'curved',
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Mouse-reactive glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%)',
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      {/* Lead particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            initial={{
              x: `${particle.x}vw`,
              y: '100vh',
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: particle.path === 'curved' 
                ? [`${particle.x}vw`, `${particle.x + 10}vw`, `${particle.x - 5}vw`]
                : `${particle.x}vw`,
              y: ['-10vh'],
              opacity: [0, 1, 1, 0],
              scale: [0, particle.size, particle.size, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeOut',
              x: {
                duration: particle.duration,
                times: [0, 0.5, 1],
              },
            }}
            exit={{ opacity: 0 }}
          >
            <div
              className="relative"
              style={{
                width: `${particle.size * 12}px`,
                height: `${particle.size * 12}px`,
              }}
            >
              {/* Glowing core */}
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: particle.color,
                  opacity: 0.4,
                }}
              />
              
              {/* Main particle */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${particle.color} 0%, ${particle.color}88 100%)`,
                  boxShadow: `0 0 ${particle.size * 10}px ${particle.color}66`,
                }}
              />
              
              {/* Inner glow */}
              <div
                className="absolute inset-1 rounded-full"
                style={{
                  background: 'rgba(255, 255, 255, 0.3)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Lead icons floating up (less frequent) */}
      <AnimatePresence>
        {particles
          .filter((_, i) => i % 5 === 0) // Only every 5th particle
          .map((particle) => (
            <motion.div
              key={`icon-${particle.id}`}
              className="absolute text-2xl"
              initial={{
                x: `${particle.x}vw`,
                y: '100vh',
                opacity: 0,
                rotate: 0,
              }}
              animate={{
                x: particle.path === 'curved' 
                  ? [`${particle.x}vw`, `${particle.x + 5}vw`, `${particle.x - 2}vw`]
                  : `${particle.x}vw`,
                y: '-10vh',
                opacity: [0, 0.6, 0.6, 0],
                rotate: 360,
              }}
              transition={{
                duration: particle.duration * 1.5,
                delay: particle.delay + 2,
                ease: 'linear',
              }}
              exit={{ opacity: 0 }}
              style={{
                filter: `drop-shadow(0 0 10px ${particle.color})`,
              }}
            >
              {leadIcons[Math.floor(Math.random() * leadIcons.length)]}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Connection lines between particles */}
      <svg className="absolute inset-0 w-full h-full">
        <g opacity="0.1">
          {particles.slice(0, 10).map((p1, i) => 
            particles.slice(i + 1, 11).map((p2, j) => {
              const distance = Math.sqrt(
                Math.pow((p1.x - p2.x) * window.innerWidth / 100, 2) +
                Math.pow((p1.y - p2.y) * window.innerHeight / 100, 2)
              )
              
              if (distance < 200) {
                return (
                  <motion.line
                    key={`${p1.id}-${p2.id}`}
                    x1={`${p1.x}%`}
                    y1={`${p1.y}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y}%`}
                    stroke={p1.color}
                    strokeWidth="0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                  />
                )
              }
              return null
            })
          )}
        </g>
      </svg>

      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#0EA5E9 1px, transparent 1px),
            linear-gradient(90deg, #0EA5E9 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  )
}