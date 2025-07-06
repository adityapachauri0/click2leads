'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const plans = [
  {
    name: 'Pay-Per-Lead',
    subtitle: 'Most Popular Option',
    description: 'Pay-as-you-go lead generation with no long-term contracts',
    features: [
      'Pay-as-you-go model',
      'No long-term contracts',
      'Live dashboard access',
      'Direct contact with sector specialists',
      'Request pricing documents',
      'Flexible lead volumes',
      'Quality assured leads',
    ],
    color: '#0EA5E9',
    recommended: true,
    cta: 'Get in touch',
  },
  {
    name: 'Revenue Share',
    subtitle: 'Ideal For Growth',
    description: 'Trial collaboration to ensure a sustainable, long-term partnership',
    features: [
      'No upfront costs',
      'We invest in your success',
      'High-volume lead delivery',
      'Strategic partnership model',
      'Aligned incentives',
      'Consistent lead flow',
      'Sales success focus',
    ],
    color: '#A855F7',
    recommended: false,
    cta: 'Get in touch',
  },
  {
    name: 'Bespoke',
    subtitle: 'Tailored To You',
    description: 'Tailored lead generation strategy designed for your specific needs',
    features: [
      'Custom strategy design',
      'Flexible pricing models',
      'Combination of approaches',
      'Aligned with your goals',
      'Dedicated account team',
      'Process optimization',
      'Scalable solutions',
    ],
    color: '#10B981',
    recommended: false,
    cta: 'Talk to a specialist',
  },
]

function PricingCard({ plan, index }: { plan: typeof plans[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [particleCount, setParticleCount] = useState(0)

  const handleInteraction = () => {
    setParticleCount(prev => prev + 1)
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={handleInteraction}
      onClick={handleInteraction}
    >
      <div className="relative w-full h-full">
        <div
          className={`relative h-full rounded-2xl p-8 ${
            plan.recommended ? 'aurora-border' : 'border border-white/10'
          }`}
          style={{
            background: plan.recommended
              ? `linear-gradient(135deg, ${plan.color}10, ${plan.color}05)`
              : 'rgba(255, 255, 255, 0.05)',
          }}
        >
          {plan.subtitle && (
            <div className="text-sm font-medium mb-2" style={{ color: plan.color }}>
              {plan.subtitle}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>
            <p className="text-white/60 text-sm">{plan.description}</p>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span
                  className="mr-3 mt-0.5"
                  style={{ color: plan.color }}
                >
                  ✓
                </span>
                <span className="text-white/80 text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <motion.a
            href="/contact"
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all block text-center ${
              plan.recommended
                ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                : 'border border-white/20 text-white hover:bg-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.cta}
          </motion.a>
        </div>
      </div>

      <AnimatePresence>
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: plan.color,
              left: '50%',
              top: '50%',
            }}
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
            }}
            exit={{ scale: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setParticleCount(prev => Math.max(0, prev - 1))
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true })

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/90 to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
            Choose A Model That <span className="gradient-text">Fits You</span>
          </h2>
          <p className="text-base sm:text-xl text-white/60 max-w-3xl mx-auto mb-8">
            Flexible partnership models designed to align with your business goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-white/40 text-sm">
            It only works for us if it works for you • 100% exclusive leads
          </p>
        </motion.div>
      </div>
    </section>
  )
}