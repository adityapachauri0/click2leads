'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Product: [
    { name: 'Lead Generation', href: '/' },
    { name: 'Services', href: '/services' },
  ],
  Company: [
    { name: 'About Us', href: '/about' },
    { name: 'Meet the Team', href: '/company/team' },
    { name: 'News & Insights', href: '/resources/news' },
    { name: 'Contact', href: '/contact' },
  ],
  Resources: [
    { name: 'Case Studies', href: '/#testimonials' },
    { name: 'Blog', href: '/resources/news' },
    { name: 'FAQs', href: '#' },
    { name: 'Support', href: '/contact' },
  ],
  Legal: [
    { name: 'Cookie Policy', href: '/legal/cookies' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Hard Opt-in Policy', href: '#' },
  ],
}

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: 'https://twitter.com' },
  { name: 'GitHub', icon: '⚡', href: 'https://github.com' },
  { name: 'LinkedIn', icon: '◉', href: 'https://linkedin.com' },
  { name: 'Discord', icon: '⬢', href: 'https://discord.com' },
]

export default function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [connections, setConnections] = useState<Array<{ from: string; to: string }>>([])

  useEffect(() => {
    if (hoveredLink) {
      const category = Object.keys(footerLinks).find(cat =>
        footerLinks[cat as keyof typeof footerLinks].some(link => link.name === hoveredLink)
      )
      
      if (category) {
        const relatedLinks = footerLinks[category as keyof typeof footerLinks]
          .filter(link => link.name !== hoveredLink)
          .map(link => ({ from: hoveredLink, to: link.name }))
        
        setConnections(relatedLinks)
      }
    } else {
      setConnections([])
    }
  }, [hoveredLink])

  return (
    <footer className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M3 3L16 12L11 13L8 20L3 3Z" fill="url(#footer-arrow-gradient)" />
                <defs>
                  <linearGradient id="footer-arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <h3 className="text-3xl font-display font-bold">
                Click<span className="text-electric-blue">2</span><span className="gradient-text">Leads</span>
              </h3>
            </div>
            <p className="text-white/60 text-sm mb-4">
              UK&apos;s #1 Lead Generation Agency Since 2018
            </p>
            <div className="text-white/60 text-sm mb-6">
              <p className="mb-1">71-75 Shelton Street</p>
              <p className="mb-1">Covent Garden</p>
              <p>London, United Kingdom</p>
              <p>WC2H 9JQ</p>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold mb-4 text-white/80">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="relative text-white/60 hover:text-white transition-colors text-sm"
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <motion.span
                        className="relative inline-block"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                        {hoveredLink === link.name && (
                          <motion.span
                            className="absolute left-full ml-2 text-electric-blue"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                          >
                            ★
                          </motion.span>
                        )}
                      </motion.span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: -1 }}
        >
          {connections.map((connection, index) => (
            <motion.line
              key={index}
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="rgba(14, 165, 233, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            />
          ))}
        </svg>

        <div className="border-t border-white/10 pt-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/40 text-sm">
              © 2025 Click2leads. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <motion.div
                className="flex items-center space-x-2 text-white/40 text-sm"
                animate={{
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span>All systems operational</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}