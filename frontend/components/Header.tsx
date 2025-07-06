'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navigationItems = [
  {
    name: 'Services',
    href: '/services',
    dropdown: [
      { name: 'Our Sectors', href: '/services' },
      { name: 'Platforms', href: '/services#platforms' },
    ],
  },
  {
    name: 'Company',
    href: '#',
    dropdown: [
      { name: 'About Us', href: '/about' },
      { name: 'Meet the Team', href: '/company/team' },
      { name: 'Careers', href: '#' },
    ],
  },
  {
    name: 'Resources',
    href: '#',
    dropdown: [
      { name: 'News & Insights', href: '/resources/news' },
      { name: 'Case Studies', href: '/#testimonials' },
      { name: 'FAQs', href: '/resources/faq' },
    ],
  },
]

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-deep-black/80 backdrop-blur-lg border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3L16 12L11 13L8 20L3 3Z" fill="url(#arrow-gradient)" />
                  <defs>
                    <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-2xl font-display font-bold">
                  Click<span className="text-electric-blue">2</span><span className="gradient-text">Leads</span>
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
              <motion.span
                className="block h-0.5 w-6 bg-white"
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 6 : 0 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-white"
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className="block h-0.5 w-6 bg-white"
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -6 : 0 }}
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-electric-blue'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>

                <AnimatePresence>
                  {activeDropdown === item.name && item.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-48 rounded-xl glass-morphism overflow-hidden"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <motion.a
              href="/contact"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white text-sm font-medium inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-deep-black/95 backdrop-blur-lg border-b border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`block py-2 text-lg font-medium ${
                      pathname === item.href
                        ? 'text-electric-blue'
                        : 'text-white/70'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 mt-2 space-y-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block py-1 text-sm text-white/60"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <motion.a
                href="/contact"
                className="block w-full px-6 py-3 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white text-center font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}