'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import NetworkAnimation from '@/components/NetworkAnimation'


function Globe() {
  return (
    <Sphere args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#0EA5E9"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [phoneError, setPhoneError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Extract only digits from phone number
    const digitsOnly = formData.phone.replace(/\D/g, '')
    
    // Validate phone number length
    if (digitsOnly.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits')
      return
    }
    
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    
    // Validate phone number on change
    if (e.target.name === 'phone') {
      const digitsOnly = e.target.value.replace(/\D/g, '')
      if (digitsOnly.length > 0 && digitsOnly.length !== 10) {
        setPhoneError('Phone number must be exactly 10 digits')
      } else {
        setPhoneError('')
      }
    }
  }

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
            Let&apos;s <span className="gradient-text">Connect</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Ready to transform your vision into reality? We&apos;re here to help you build the future
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/80">
                  Your Name
                </label>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-all"
                  placeholder="John Doe"
                  animate={{
                    borderColor: focusedField === 'name' ? '#0EA5E9' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/80">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-all"
                  placeholder="john@company.com"
                  animate={{
                    borderColor: focusedField === 'email' ? '#0EA5E9' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white/80">
                  Phone Number
                </label>
                <motion.input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${
                    phoneError ? 'border-red-500' : 'border-white/10'
                  } text-white placeholder-white/40 focus:outline-none transition-all`}
                  placeholder="+44 20 1234 5678"
                  animate={{
                    borderColor: phoneError 
                      ? '#EF4444' 
                      : focusedField === 'phone' 
                        ? '#0EA5E9' 
                        : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
                {phoneError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {phoneError}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2 text-white/80">
                  Company
                </label>
                <motion.input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('company')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-all"
                  placeholder="Acme Corp"
                  animate={{
                    borderColor: focusedField === 'company' ? '#0EA5E9' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-white/80">
                  Project Details
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-all resize-none"
                  placeholder="Tell us about your project..."
                  animate={{
                    borderColor: focusedField === 'message' ? '#0EA5E9' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={!!phoneError || !formData.phone}
                className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
                  phoneError || !formData.phone
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-electric-blue to-neon-purple text-white cursor-pointer'
                }`}
                whileHover={!phoneError && formData.phone ? { scale: 1.02 } : {}}
                whileTap={!phoneError && formData.phone ? { scale: 0.98 } : {}}
              >
                Send Message
              </motion.button>
            </form>

            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center">
                  <span className="text-electric-blue">✉</span>
                </div>
                <div>
                  <p className="text-sm text-white/60">Email us at</p>
                  <p className="text-white">info@click2leads.co.uk</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full glass-morphism flex items-center justify-center">
                  <span className="text-green-500">📍</span>
                </div>
                <div>
                  <p className="text-sm text-white/60">Visit us at</p>
                  <p className="text-white">71-75 Shelton Street</p>
                  <p className="text-white">Covent Garden, London</p>
                  <p className="text-white">WC2H 9JQ, United Kingdom</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="glass-morphism rounded-2xl p-8 mb-8">
              <div className="h-[300px] relative">
                <NetworkAnimation />
              </div>
            </div>

            <motion.div
              className="glass-morphism rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h3 className="text-xl font-display font-bold mb-4">Why Choose Click2leads?</h3>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-electric-blue mr-2">✓</span>
                  <span>4.7M+ leads generated across all industries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-2">✓</span>
                  <span>100% exclusive leads - never resold</span>
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-2">✓</span>
                  <span>Real-time delivery to your CRM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-electric-blue mr-2">✓</span>
                  <span>Flexible pricing models to suit your business</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}