'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import ShaderBackground from './ShaderBackground'
import { getContent, ContentData } from '@/lib/content'

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, isInView, text])

  return (
    <span ref={ref} className="relative">
      {displayedText.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-1 h-full bg-electric-blue ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  )
}

export default function HeroSection() {
  const controls = useAnimation()
  const magnetRef = useRef<HTMLAnchorElement>(null)
  const [magnetPos, setMagnetPos] = useState({ x: 0, y: 0 })
  const [content, setContent] = useState<ContentData['hero']>({
    title: 'A Lead Generation Powerhouse',
    subtitle: 'Partner for Life',
    stats_spending: '£28 million',
    stats_leads: '4.7 million leads',
    cta_primary: 'Talk to a Specialist',
    cta_secondary: 'Explore Our Work'
  })

  useEffect(() => {
    // Fetch dynamic content
    getContent('hero').then(data => {
      if (data.hero) {
        setContent(data.hero)
      }
    })
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!magnetRef.current) return
    const rect = magnetRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMagnetPos({ x: x * 0.3, y: y * 0.3 })
  }

  const handleMouseLeave = () => {
    setMagnetPos({ x: 0, y: 0 })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ShaderBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-hero font-display font-bold leading-tight">
            <TypewriterText text={content?.title || 'A Lead Generation Powerhouse'} />
            <br />
            <span className="gradient-text">
              <TypewriterText text={content?.subtitle || 'Partner for Life'} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-base sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto glass-morphism px-4 sm:px-6 py-4 rounded-2xl"
          >
            We&apos;ve spent over <span className="text-electric-blue font-bold">{content?.stats_spending || '£28 million'}</span> and created <span className="text-neon-purple font-bold">{content?.stats_leads || '4.7 million leads'}</span> using key digital advertising platforms, SEO and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              ref={magnetRef}
              href="/contact"
              className="relative inline-block px-8 py-4 font-medium text-white overflow-hidden group cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{
                x: magnetPos.x,
                y: magnetPos.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9, #A855F7)',
                }}
              />
              
              <motion.div
                className="absolute inset-0 rounded-lg border-2"
                style={{
                  borderImage: 'linear-gradient(135deg, #0EA5E9, #A855F7) 1',
                }}
                initial={{ pathLength: 0 }}
                whileHover={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              
              <span className="relative z-10">{content?.cta_primary || 'Talk to a Specialist'}</span>
              
              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, #0EA5E9 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 100%, #A855F7 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 0%, #0EA5E9 0%, transparent 50%)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            </motion.a>

            <motion.a
              href="#features"
              className="px-8 py-4 text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content?.cta_secondary || 'Explore Our Work'} →
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}