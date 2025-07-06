'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

const platforms = [
  // Major Platforms
  { name: 'Google Ads', category: 'Search' },
  { name: 'Facebook', category: 'Social' },
  { name: 'Instagram', category: 'Social' },
  { name: 'TikTok', category: 'Social' },
  { name: 'Twitter', category: 'Social' },
  { name: 'LinkedIn', category: 'Social' },
  
  // Native & Content
  { name: 'Outbrain', category: 'Native' },
  { name: 'RevContent', category: 'Native' },
  { name: 'MGID', category: 'Native' },
  { name: 'TripleLift', category: 'Native' },
  { name: 'Nativo', category: 'Native' },
  { name: 'Content Studio', category: 'Native' },
  { name: 'Ad Now', category: 'Native' },
  { name: 'Gravity', category: 'Native' },
  { name: 'AdBlade', category: 'Native' },
  
  // Programmatic & DSP
  { name: 'iQadexchange', category: 'Programmatic' },
  { name: 'StackAdapt', category: 'Programmatic' },
  { name: 'Amazon DSP', category: 'Programmatic' },
  
  // B2B Platforms
  { name: 'AdRoll', category: 'B2B' },
  { name: 'RelayTo', category: 'B2B' },
  { name: 'RollWorks', category: 'B2B' },
  
  // Marketing Tools
  { name: 'Bynder', category: 'MarTech' },
  { name: 'Marine Software', category: 'MarTech' },
]

const categories = ['All', 'Search', 'Social', 'Native', 'Programmatic', 'B2B', 'MarTech']
const categoryColors = {
  Search: '#0EA5E9',
  Social: '#A855F7',
  Native: '#10B981',
  Programmatic: '#F59E0B',
  B2B: '#EF4444',
  MarTech: '#8B5CF6',
}

function PlatformCard({ platform, index }: { platform: typeof platforms[0]; index: number }) {
  const color = categoryColors[platform.category as keyof typeof categoryColors] || '#666'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.03, duration: 0.5, type: 'spring' }}
      whileHover={{ 
        y: -10, 
        rotateX: 10,
        rotateY: 5,
        scale: 1.1,
        transition: { duration: 0.3 }
      }}
      className="relative group perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative p-3 sm:p-6 rounded-2xl glass-morphism overflow-hidden transform-3d">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${color}10, transparent)`,
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${color}30, transparent)`,
            filter: 'blur(40px)',
            transform: 'translateZ(-20px)',
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
        
        <div className="relative z-10 text-center">
          <motion.div
            className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              border: `2px solid ${color}40`,
            }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color }}
            >
              {platform.name.charAt(0)}
            </span>
          </motion.div>
          <h4 className="font-semibold text-white mb-1">{platform.name}</h4>
          <p className="text-xs text-white/60">{platform.category}</p>
        </div>
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            opacity: 0,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default function PlatformsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  
  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          backgroundPosition: backgroundY,
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
            Multi-Platform <span className="gradient-text">Advertising</span>
          </h2>
          <p className="text-base sm:text-xl text-white/60 max-w-3xl mx-auto">
            We leverage 25+ advertising platforms to ensure maximum reach and quality lead generation across all channels
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 mb-12">
          {platforms.map((platform, index) => (
            <PlatformCard key={platform.name} platform={platform} index={index} />
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center glass-morphism rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-display font-bold mb-4">
            Platform Expertise Across All Channels
          </h3>
          <p className="text-white/70 mb-6">
            Our team has extensive experience managing campaigns across search, social, native, programmatic, and B2B platforms. We optimize each channel to deliver the highest quality leads at the best possible cost.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.slice(1).map((category) => (
              <span
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${categoryColors[category as keyof typeof categoryColors]}20`,
                  color: categoryColors[category as keyof typeof categoryColors],
                  border: `1px solid ${categoryColors[category as keyof typeof categoryColors]}40`,
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}