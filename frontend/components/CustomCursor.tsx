'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { isTouchDevice } from '@/lib/utils'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    setIsMobile(isTouchDevice())
  }, [])

  useEffect(() => {
    if (isMobile) return

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
      setIsVisible(true)
    }

    const mouseLeave = () => setIsVisible(false)
    const mouseEnter = () => setIsVisible(true)

    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseleave', mouseLeave)
    document.addEventListener('mouseenter', mouseEnter)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.matches('button, a')) {
        setCursorVariant('button')
      } else if (target.matches('h1, h2, h3, h4, h5, h6, p, span')) {
        setCursorVariant('text')
      } else if (target.matches('img')) {
        setCursorVariant('image')
      } else {
        setCursorVariant('default')
      }
    }

    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mousemove', mouseMove)
      document.removeEventListener('mouseleave', mouseLeave)
      document.removeEventListener('mouseenter', mouseEnter)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isMobile])

  const variants = {
    default: {
      width: 20,
      height: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    },
    button: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      border: '1px solid rgba(14, 165, 233, 0.5)',
    },
    text: {
      width: 8,
      height: 30,
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      border: '1px solid rgba(168, 85, 247, 0.5)',
    },
    image: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
    },
  }

  const spring = {
    type: 'spring' as const,
    stiffness: 500,
    damping: 28,
  }

  if (isMobile) return null

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
            animate={{
              x: mousePosition.x - (cursorVariant === 'text' ? 4 : 20),
              y: mousePosition.y - (cursorVariant === 'text' ? 15 : 20),
            }}
            transition={spring}
          >
            <motion.div
              className="relative rounded-full"
              variants={variants}
              animate={cursorVariant}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            >
              {cursorVariant === 'image' && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 30,
          y: mousePosition.y - 30,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          mass: 2,
        }}
      >
        <div className="w-[60px] h-[60px] rounded-full opacity-10">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, transparent 70%)',
            }}
          />
        </div>
      </motion.div>
    </>
  )
}