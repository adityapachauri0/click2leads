'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'

const stats = [
  {
    label: 'Leads Generated',
    value: 4700000,
    suffix: '+',
    prefix: '',
    decimals: 0,
    color: '#0EA5E9',
  },
  {
    label: 'Clients',
    value: 180,
    suffix: '+',
    prefix: '',
    decimals: 0,
    color: '#A855F7',
  },
  {
    label: 'Ad Spend',
    value: 28,
    suffix: 'm+',
    prefix: '£',
    decimals: 0,
    color: '#10B981',
  },
  {
    label: 'UK In-house Staff',
    value: 85,
    suffix: '+',
    prefix: '',
    decimals: 0,
    color: '#F59E0B',
  },
]

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/95 to-deep-black" />
      
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-6">
            We Let Our <span className="gradient-text">Killer Stats</span> Since 2018 Do The Talking...
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="relative inline-block"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div
                  className="text-5xl md:text-6xl font-bold mb-2"
                  style={{ color: stat.color }}
                >
                  {isInView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  )}
                </div>
                
                <motion.div
                  className="absolute -inset-4 rounded-full opacity-20"
                  style={{
                    background: `radial-gradient(circle, ${stat.color}, transparent)`,
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
              </motion.div>
              
              <p className="text-white/60 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}