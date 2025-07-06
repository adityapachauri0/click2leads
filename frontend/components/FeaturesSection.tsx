'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Float, Text3D, Center } from '@react-three/drei'

const features = [
  {
    title: 'Paid Social',
    description: 'Excel at running social media paid ads via Facebook, Twitter, TikTok and Instagram to drive quality leads.',
    icon: '📱',
    color: '#0EA5E9',
  },
  {
    title: 'PPC (Google Ads)',
    description: 'Extensive reach with carefully managed campaigns delivering qualified PPC leads that convert.',
    icon: '🎯',
    color: '#A855F7',
  },
  {
    title: 'SEO Marketing',
    description: 'Maximize organic search potential with proven strategies that deliver long-term results.',
    icon: '🔍',
    color: '#10B981',
  },
  {
    title: 'Web Dev & Design',
    description: 'Create intuitive websites that improve visitor journeys and boost conversions.',
    icon: '💻',
    color: '#F59E0B',
  },
  {
    title: 'Revenue Focused',
    description: 'Service offering always tied to improving your bottom line with clear ROI.',
    icon: '💰',
    color: '#EF4444',
  },
  {
    title: '100% Exclusive Leads',
    description: 'Never double-sold, so you won\'t compete against others for the same lead.',
    icon: '🎖️',
    color: '#8B5CF6',
  },
]

function FloatingCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const angle = (index / features.length) * Math.PI * 2

  const baseX = Math.cos(angle) * 300
  const baseY = Math.sin(angle) * 150

  const springConfig = { stiffness: 100, damping: 15 }
  const x = useSpring(baseX, springConfig)
  const y = useSpring(baseY, springConfig)

  return (
    <motion.div
      ref={cardRef}
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
      }}
      animate={{
        x: isHovered ? baseX * 1.1 : baseX,
        y: isHovered ? baseY * 1.1 : baseY,
      }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-64 h-80 cursor-pointer transform-3d"
        animate={{
          rotateY: isHovered ? 0 : index * 10,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl p-6 glass-morphism"
          style={{
            boxShadow: isHovered
              ? `0 20px 40px ${feature.color}40, 0 0 60px ${feature.color}20`
              : `0 10px 30px rgba(0,0,0,0.3)`,
            background: isHovered
              ? `linear-gradient(135deg, ${feature.color}10, ${feature.color}05)`
              : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="flex flex-col h-full">
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
            <p className="text-white/60 text-sm flex-grow">{feature.description}</p>
            
            <motion.div
              className="mt-4 overflow-hidden rounded-lg"
              initial={{ height: 0 }}
              animate={{ height: isHovered ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="w-full py-2 px-4 bg-gradient-to-r from-electric-blue to-neon-purple text-white rounded-lg text-sm font-medium">
                Learn More
              </button>
            </motion.div>
          </div>

          <motion.div
            className="absolute -inset-0.5 rounded-2xl opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: `linear-gradient(45deg, ${feature.color}, transparent)`,
            }}
            transition={{ duration: 0.3 }}
            style={{ zIndex: -1 }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${feature.color}20, transparent)`,
            filter: 'blur(40px)',
            transform: 'translateZ(-50px) scale(1.2)',
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative min-h-screen py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/95 to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Why Use <span className="gradient-text">Click2leads?</span>
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            We generate 10,000s of digital leads from multiple platforms so you have a continuous daily lead flow
          </p>
        </motion.div>

        <div className="relative h-[600px] perspective-1000">
          <motion.div
            className="absolute inset-0"
            style={{ rotateY }}
          >
            {features.map((feature, index) => (
              <FloatingCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
            <motion.div
              className="w-full h-full rounded-full"
              animate={{
                background: [
                  'radial-gradient(circle, #0EA5E940, transparent)',
                  'radial-gradient(circle, #A855F740, transparent)',
                  'radial-gradient(circle, #0EA5E940, transparent)',
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-white/40 text-sm">
            Hover over cards to explore • Scroll to see parallax effects
          </p>
        </motion.div>
      </div>
    </section>
  )
}