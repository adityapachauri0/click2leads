'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const methodologySteps = [
  {
    step: 1,
    title: 'ANALYZE',
    subtitle: 'Deep Business Analysis',
    description: 'We dive deep into your business model, target audience, and market position to create a data-driven strategy.',
    color: '#0EA5E9',
    gradient: 'from-[#0EA5E9] to-[#0875A7]',
  },
  {
    step: 2,
    title: 'STRATEGIZE',
    subtitle: 'Quick Wins Planning',
    description: 'We identify immediate opportunities while building a comprehensive long-term growth roadmap.',
    color: '#A855F7',
    gradient: 'from-[#A855F7] to-[#7C3AE3]',
  },
  {
    step: 3,
    title: 'IMPLEMENT',
    subtitle: 'Execute Campaigns',
    description: 'We roll out multi-channel campaigns with precision timing and tactical implementation.',
    color: '#10B981',
    gradient: 'from-[#10B981] to-[#059669]',
  },
  {
    step: 4,
    title: 'OPTIMIZE',
    subtitle: 'Continuous Growth',
    description: 'We continuously monitor, test, and refine campaigns to maximize ROI and scale success.',
    color: '#F59E0B',
    gradient: 'from-[#F59E0B] to-[#D97706]',
  },
]

function Cube3D({ step, isActive, onHover }: { step: typeof methodologySteps[0], isActive: boolean, onHover: (active: boolean) => void }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const rotateX = useTransform(mouseY, [-100, 100], [30, -30])
  const rotateY = useTransform(mouseX, [-100, 100], [-30, 30])
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x)
    mouseY.set(y)
  }
  
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    onHover(false)
  }

  return (
    <motion.div
      className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (step.step - 1) * 0.1 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: isActive ? rotateX : 20,
          rotateY: isActive ? rotateY : -30,
        }}
        animate={{
          rotateY: isActive ? rotateY.get() : [0, 360],
        }}
        transition={{
          rotateY: {
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
      >
        {/* Front Face */}
        <div
          className={`absolute w-full h-full bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center shadow-2xl`}
          style={{
            transform: 'translateZ(48px)',
            boxShadow: isActive ? `0 0 40px ${step.color}` : '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-6xl font-bold text-white">{step.step}</span>
        </div>
        
        {/* Back Face */}
        <div
          className={`absolute w-full h-full bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center`}
          style={{
            transform: 'rotateY(180deg) translateZ(96px)',
            opacity: 0.9,
          }}
        >
          <span className="text-lg md:text-xl lg:text-2xl font-bold text-white">{step.title}</span>
        </div>
        
        {/* Right Face */}
        <div
          className="absolute w-full h-full rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(to bottom, ${step.color}aa, ${step.color}66)`,
            transform: 'rotateY(90deg) translateZ(96px)',
          }}
        />
        
        {/* Left Face */}
        <div
          className="absolute w-full h-full rounded-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(to bottom, ${step.color}aa, ${step.color}66)`,
            transform: 'rotateY(-90deg) translateZ(96px)',
          }}
        />
        
        {/* Top Face */}
        <div
          className="absolute w-full h-full rounded-lg"
          style={{
            background: `linear-gradient(to br, ${step.color}, ${step.color}dd)`,
            transform: 'rotateX(90deg) translateZ(96px)',
          }}
        />
        
        {/* Bottom Face */}
        <div
          className="absolute w-full h-full rounded-lg"
          style={{
            background: step.color + '44',
            transform: 'rotateX(-90deg) translateZ(96px)',
          }}
        />
      </motion.div>
      
      {/* Labels */}
      <motion.div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center w-64"
        animate={{
          y: isActive ? -10 : 0,
        }}
      >
        <h3 className="text-xl font-bold mb-1" style={{ color: step.color }}>
          {step.title}
        </h3>
        <p className="text-sm text-white/60">{step.subtitle}</p>
      </motion.div>
      
      {/* Tooltip */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 p-4 glass-morphism rounded-lg z-20"
            style={{
              boxShadow: `0 0 30px ${step.color}33`,
            }}
          >
            <p className="text-sm text-white/80">{step.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FloatingParticle({ delay, duration, color }: { delay: number, duration: number, color: string }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
      initial={{
        x: Math.random() * 1200,
        y: 600,
        opacity: 0,
      }}
      animate={{
        y: -100,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  )
}

export default function GrowthMethodology3D() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative py-20 overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-[#0a0a1a] to-deep-black" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            duration={10 + Math.random() * 10}
            color={methodologySteps[i % 4].color}
          />
        ))}
      </div>
      
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(#0EA5E9 1px, transparent 1px),
            linear-gradient(90deg, #0EA5E9 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(1000px) rotateX(60deg)',
          transformOrigin: 'center bottom',
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            Discover Our <span className="gradient-text">Growth Methodology</span>
          </h2>
          <p className="text-base sm:text-xl text-white/70 max-w-3xl mx-auto">
            Our proven 4-step process powered by cutting-edge technology and data-driven insights
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 mb-20">
          {methodologySteps.map((step) => (
            <Cube3D
              key={step.step}
              step={step}
              isActive={activeStep === step.step}
              onHover={(active) => setActiveStep(active ? step.step : null)}
            />
          ))}
        </div>
        
        {/* Connection Lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          <motion.path
            d="M 300,400 Q 500,350 700,400 T 1100,400"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="2"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </svg>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-6">
            Ready to transform your lead generation?
          </p>
          <motion.a
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Your Growth Journey</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-neon-purple to-electric-blue"
              initial={{ x: '100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

import { AnimatePresence } from 'framer-motion'