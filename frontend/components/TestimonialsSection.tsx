'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: 'John Hood',
    role: 'DNA Home Improvements',
    content: 'This is a calibre supplier with sensible cost-effective routes to market for small to medium SME and they show flexibility always absorbing ideas as well as developing innovative marketing and lead generation.',
    avatar: '👨‍💼',
    company: 'DNA Home Improvements',
  },
  {
    id: 2,
    name: 'Martin Dean',
    role: 'Fitter Windows',
    content: 'Click2leads are both experienced and knowledgeable in all fields of internet based marketing. I enjoy regular feedback and advanced management information that allows me the flexibility I need.',
    avatar: '👨‍🔬',
    company: 'Fitter Windows',
  },
  {
    id: 3,
    name: 'Danny Planner',
    role: 'Just Remortgages',
    content: 'Together we have built an array of sustainable lead sources that meet our CPA targets, lead volumes and conversion levels. They are always available and deliver what they say they will.',
    avatar: '👨‍💻',
    company: 'Just Remortgages',
  },
  {
    id: 4,
    name: 'Johnathan Edwards',
    role: 'Aaron & Partners',
    content: 'The team over at Pronto are great, we\'ve been working with them now for 3 years and seen a great shift in digital leads and overall digital strategy, could not fault them.',
    avatar: '👨‍⚖️',
    company: 'Aaron & Partners',
  },
  {
    id: 5,
    name: 'Ken Edge',
    role: 'Edge Performance',
    content: 'I have used a few web design and digital marketing companies over the years, these guys are by far the best. Have been using them for 6 years now and cannot recommend enough.',
    avatar: '👨‍💼',
    company: 'Edge Performance',
  },
]

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-80 sm:w-96 h-64 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePosition({ x: 0.5, y: 0.5 })}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden glass-morphism p-6">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(
                circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%,
                rgba(14, 165, 233, 0.4) 0%,
                rgba(168, 85, 247, 0.4) 50%,
                transparent 100%
              )
            `,
          }}
        />
        
        <div
          className="absolute inset-0 holographic"
          style={{
            mixBlendMode: 'overlay',
            opacity: 0.3,
            transform: `translateX(${(mousePosition.x - 0.5) * 20}px) translateY(${(mousePosition.y - 0.5) * 20}px)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{testimonial.avatar}</div>
              <div>
                <h4 className="font-display font-semibold text-white">{testimonial.name}</h4>
                <p className="text-sm text-white/60">{testimonial.role}</p>
              </div>
            </div>
            <div className="text-2xl text-electric-blue/40">❝</div>
          </div>
          
          <p className="text-white/80 mb-4">{testimonial.content}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/40">{testimonial.company}</span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent)',
              'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)',
              'radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ filter: 'blur(20px)' }}
        />
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const isInView = useInView(containerRef, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (!scrollRef.current || isPaused || !isInView) return

    const scrollContainer = scrollRef.current
    const scrollWidth = scrollContainer.scrollWidth
    const clientWidth = scrollContainer.clientWidth

    controls.start({
      x: -(scrollWidth - clientWidth),
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      },
    })

    return () => {
      controls.stop()
    }
  }, [isPaused, controls, isInView])

  return (
    <section ref={containerRef} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-deep-black via-deep-black/90 to-deep-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold mb-6">
            Client <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-base sm:text-xl text-white/60 max-w-3xl mx-auto">
            Hear from the visionaries who trusted us to bring their ideas to life
          </p>
        </motion.div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-deep-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-deep-black to-transparent z-10 pointer-events-none" />
        
        <div className="overflow-hidden">
          <motion.div
            ref={scrollRef}
            className="flex space-x-6 px-6"
            animate={controls}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <TestimonialCard
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center mt-12"
      >
        <p className="text-white/40 text-sm">
          Hover to pause • Cards feature holographic shimmer effect
        </p>
      </motion.div>
    </section>
  )
}