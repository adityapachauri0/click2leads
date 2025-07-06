'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'


export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/95 to-deep-black" />
        
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 text-center"
          style={{ opacity, scale }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About <span className="gradient-text">Click2leads</span>
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We are a collective of visionaries, engineers, and dreamers working at the intersection of imagination and reality
          </motion.p>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), transparent 50%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </section>


      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="glass-morphism rounded-2xl p-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-display font-bold mb-6 text-center">
              Our <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-white/80 text-center mb-8">
              To bridge the gap between cutting-edge technology and practical solutions that transform industries, empower businesses, and create a more connected, intelligent world.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-display font-semibold mb-2">Innovation First</h3>
                <p className="text-sm text-white/60">Pushing boundaries with every project</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤝</div>
                <h3 className="font-display font-semibold mb-2">Client Success</h3>
                <p className="text-sm text-white/60">Your vision is our mission</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-display font-semibold mb-2">Global Impact</h3>
                <p className="text-sm text-white/60">Technology for a better tomorrow</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}