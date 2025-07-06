'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const methodologySteps = [
  {
    step: 1,
    title: 'Analysis & Strategy',
    icon: '🔍',
    description: 'We analyze your business through our experienced lead generation framework to create an execution plan that maximizes all opportunities for growth.',
    color: '#0EA5E9',
  },
  {
    step: 2,
    title: 'Quick Wins & Planning',
    icon: '🚀',
    description: 'We identify and deliver quick wins while setting up specific, long-term, scalable lead generation goals for sustainable growth.',
    color: '#A855F7',
  },
  {
    step: 3,
    title: 'Implementation',
    icon: '⚡',
    description: 'We roll out our full execution plan with timely, tactical implementation, setting up scalable growth opportunities across all channels.',
    color: '#10B981',
  },
  {
    step: 4,
    title: 'Optimization',
    icon: '📈',
    description: 'We continuously monitor your results at every step, leveraging data insights to optimize campaigns and maximize your ROI.',
    color: '#F59E0B',
  },
]

export default function GrowthMethodology() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/95 to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Discover Our <span className="gradient-text">Growth Methodology</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our proven 4-step process has generated over 4.7M leads and counting. 
            We focus on metrics that directly boost revenue, not vanity metrics.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-electric-blue via-neon-purple to-green-500 opacity-20 hidden lg:block" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodologySteps.map((step, index) => (
              <motion.div
                key={step.step}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredStep(step.step)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Number Circle */}
                <motion.div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold z-20"
                  style={{
                    background: hoveredStep === step.step ? step.color : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: hoveredStep === step.step ? `0 0 30px ${step.color}` : 'none',
                  }}
                  whileHover={{ scale: 1.2 }}
                >
                  {step.step}
                </motion.div>

                {/* Card */}
                <motion.div
                  className="glass-morphism rounded-2xl p-8 h-full relative overflow-hidden"
                  style={{
                    borderColor: hoveredStep === step.step ? step.color : 'rgba(255, 255, 255, 0.1)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                  whileHover={{ y: -10 }}
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0"
                    animate={{ opacity: hoveredStep === step.step ? 0.1 : 0 }}
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${step.color}, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{step.icon}</div>
                    <h3 
                      className="text-2xl font-display font-bold mb-4"
                      style={{ color: hoveredStep === step.step ? step.color : '#FFFFFF' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < methodologySteps.length - 1 && (
                    <motion.svg
                      className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20 hidden lg:block"
                      viewBox="0 0 24 24"
                      fill="none"
                      animate={{
                        x: hoveredStep === step.step ? 5 : 0,
                      }}
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-6">
            Ready to experience the Click2Leads difference?
          </p>
          <motion.a
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Growth Journey
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}