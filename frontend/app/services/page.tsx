'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

const sectors = [
  {
    id: 'home-improvement',
    title: 'Home Improvement',
    icon: '🏠',
    description: 'Quality leads for renovation and improvement projects',
    color: '#0EA5E9',
  },
  {
    id: 'eco',
    title: 'ECO',
    icon: '🌱',
    description: 'High-quality ECO 4 leads for energy efficiency',
    color: '#10B981',
  },
  {
    id: 'windows-doors',
    title: 'Windows & Doors',
    icon: '🪟',
    description: 'Double glazing and installation leads',
    color: '#A855F7',
  },
  {
    id: 'solar',
    title: 'Solar',
    icon: '☀️',
    description: 'Solar panel installation and energy leads',
    color: '#F59E0B',
  },
  {
    id: 'heat-pumps',
    title: 'Heat Pumps',
    icon: '🔥',
    description: 'Heat pump installation and upgrade leads',
    color: '#EF4444',
  },
  {
    id: 'boilers',
    title: 'Boilers',
    icon: '🔧',
    description: 'Quality ECO boiler replacement leads',
    color: '#8B5CF6',
  },
  {
    id: 'mortgages',
    title: 'Mortgages',
    icon: '🏦',
    description: 'Qualified mortgage and remortgage leads',
    color: '#06B6D4',
  },
  {
    id: 'legal',
    title: 'Legal',
    icon: '⚖️',
    description: 'Legal services and claim leads',
    color: '#84CC16',
  },
  {
    id: 'insulation',
    title: 'Insulation',
    icon: '🛡️',
    description: 'Cavity wall and loft insulation leads',
    color: '#F97316',
  },
  {
    id: 'home-security',
    title: 'Home Security',
    icon: '🔒',
    description: 'CCTV and security system installation leads',
    color: '#EC4899',
  },
]

const platforms = [
  { name: 'Facebook', icon: '📘' },
  { name: 'Google', icon: '🔍' },
  { name: 'TikTok', icon: '📱' },
  { name: 'Instagram', icon: '📸' },
  { name: 'LinkedIn', icon: '💼' },
  { name: 'Taboola', icon: '📰' },
]

function SectorCard({ sector }: { sector: typeof sectors[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="relative rounded-2xl p-6 glass-morphism overflow-hidden"
        style={{
          borderColor: isHovered ? sector.color : 'rgba(255, 255, 255, 0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${sector.color}, transparent)`,
          }}
        />
        
        <div className="relative z-10">
          <div className="text-4xl mb-4">{sector.icon}</div>
          <h3 className="text-xl font-display font-semibold mb-2" style={{ color: sector.color }}>
            {sector.title}
          </h3>
          <p className="text-white/60 text-sm">{sector.description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('sectors')
  const router = useRouter()

  useEffect(() => {
    // Check if URL has #platforms hash
    if (window.location.hash === '#platforms') {
      setActiveTab('platforms')
    }
  }, [])

  return (
    <div className="min-h-screen py-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-6">
            We Can Produce Results In <span className="gradient-text">Any Sector</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            While we excel in key sectors, our lead generation services can be applied to any industry to bring in new leads and business growth
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          id="platforms"
        >
          <div className="inline-flex items-center space-x-4 p-1 rounded-full glass-morphism">
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'sectors'
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveTab('sectors')}
            >
              Our Sectors
            </button>
            <button
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === 'platforms'
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveTab('platforms')}
            >
              Platforms
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'sectors' ? (
            <motion.div
              key="sectors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectors.map((sector, index) => (
                  <motion.div
                    key={sector.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SectorCard sector={sector} />
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-white/60 mb-6">
                  Can&apos;t see your sector above? Get in touch with our expert team today!
                </p>
                <motion.a
                  href="/contact"
                  className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get in touch
                </motion.a>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="platforms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <p className="text-xl text-white/70 mb-12">
                We generate 10,000s of digital leads from multiple platforms
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-6xl mb-3">{platform.icon}</div>
                    <p className="text-white/80 font-medium">{platform.name}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="glass-morphism rounded-2xl p-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-2xl font-display font-bold mb-4">
                  Multi-Platform <span className="gradient-text">Lead Generation</span>
                </h3>
                <p className="text-white/70">
                  Using our unique revenue share model we can generate your leads without you having to pay us a single penny. 
                  We produce quality and compliant leads from all major digital advertising platforms.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}