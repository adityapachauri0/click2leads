'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Get In Touch' },
]

export default function NavigationOrb() {
  const [isOpen, setIsOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const pathname = usePathname()
  const orbRef = useRef<HTMLDivElement>(null)

  const orbX = useMotionValue(100)
  const orbY = useMotionValue(100)

  const springConfig = { damping: 30, stiffness: 200 }
  const orbXSpring = useSpring(orbX, springConfig)
  const orbYSpring = useSpring(orbY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      if (!isOpen) {
        const distanceFromEdge = 150
        const magnetStrength = 0.3
        
        let targetX = 100
        let targetY = 100

        if (e.clientX < distanceFromEdge) {
          targetX = 50 + (e.clientX / distanceFromEdge) * 50 * magnetStrength
        }
        if (e.clientY < distanceFromEdge) {
          targetY = 50 + (e.clientY / distanceFromEdge) * 50 * magnetStrength
        }

        orbX.set(targetX)
        orbY.set(targetY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isOpen, orbX, orbY])

  const orbVariants = {
    closed: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
    open: {
      width: 300,
      height: 400,
      borderRadius: '24px',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  }

  return (
    <>
      <motion.div
        ref={orbRef}
        className="navigation-orb fixed z-[100] cursor-pointer"
        style={{
          x: orbXSpring,
          y: orbYSpring,
        }}
        animate={isOpen ? 'open' : 'closed'}
        variants={orbVariants}
        onClick={(e) => {
          // Only toggle if clicking on the orb itself, not the menu items
          if (e.target === e.currentTarget || !isOpen) {
            setIsOpen(!isOpen)
          }
        }}
        role="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <motion.div
          className="relative w-full h-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.9), rgba(168, 85, 247, 0.9))',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 40px rgba(14, 165, 233, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)',
          }}
          whileHover={{
            boxShadow: '0 0 60px rgba(14, 165, 233, 0.7), 0 0 120px rgba(168, 85, 247, 0.5)',
          }}
        >
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x - orbXSpring.get()}px ${mousePosition.y - orbYSpring.get()}px, rgba(255,255,255,0.3) 0%, transparent 50%)`,
              }}
            />
          </div>

          <AnimatePresence mode="wait">
            {!isOpen ? (
              <motion.div
                key="menu-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center w-full h-full"
              >
                <div className="space-y-1.5">
                  <motion.div
                    className="w-6 h-0.5 bg-white"
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }}
                  />
                  <motion.div
                    className="w-6 h-0.5 bg-white"
                    animate={{ opacity: isOpen ? 0 : 1 }}
                  />
                  <motion.div
                    className="w-6 h-0.5 bg-white"
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.nav
                key="menu-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full p-8"
              >
                <div className="absolute top-4 right-4">
                  <motion.div
                    className="w-8 h-8 flex items-center justify-center"
                    whileHover={{ rotate: 90 }}
                  >
                    <span className="text-2xl text-white/80">×</span>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="block group relative z-10"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsOpen(false)
                        }}
                      >
                        <motion.span
                          className={`text-2xl font-display font-medium transition-colors ${
                            pathname === item.href
                              ? 'text-white'
                              : 'text-white/60 hover:text-white'
                          }`}
                          whileHover={{ x: 10 }}
                        >
                          {item.label}
                        </motion.span>
                        {pathname === item.href && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="h-0.5 bg-white mt-1"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}