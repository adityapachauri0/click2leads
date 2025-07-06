'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is Click2Leads?',
        a: 'Click2Leads is the UK\'s #1 lead generation agency since 2018. We specialize in generating high-quality leads across multiple sectors using advanced digital marketing strategies and platforms.'
      },
      {
        q: 'How does your revenue share model work?',
        a: 'Our unique revenue share model means you don\'t pay us anything upfront. We generate leads at our own cost and only get paid when you convert those leads into sales. If you win, we win!'
      },
      {
        q: 'What sectors do you work with?',
        a: 'We work across multiple sectors including Home Improvement, Solar & ECO, Windows & Doors, Mortgages, Legal, Heat Pumps, Boilers, Insulation, and Home Security. However, we can adapt our services to any industry.'
      },
    ]
  },
  {
    category: 'Lead Generation',
    questions: [
      {
        q: 'How many leads can you generate?',
        a: 'We\'ve generated over 4.7 million leads since 2018. The volume of leads we can generate depends on your sector, target audience, and budget. We work with you to determine the optimal lead volume for your business.'
      },
      {
        q: 'What platforms do you use for lead generation?',
        a: 'We generate leads from all major digital advertising platforms including Facebook, Google, TikTok, Instagram, LinkedIn, Taboola, Outbrain, RevContent, MGID, TripleLift, Native, AdRoll, and many more.'
      },
      {
        q: 'How do you ensure lead quality?',
        a: 'All our leads are 100% verified and exclusive to you. We use advanced filtering and validation processes to ensure every lead meets your specific criteria and has genuine interest in your services.'
      },
    ]
  },
  {
    category: 'Pricing & Models',
    questions: [
      {
        q: 'What pricing models do you offer?',
        a: 'We offer two main models: Revenue Share (where you pay nothing upfront) and Pay Per Lead (where you pay a fixed price per lead). We work with you to determine which model best suits your business needs.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No, we believe in complete transparency. All costs are clearly outlined in our agreement, and there are no hidden fees or surprise charges.'
      },
      {
        q: 'What\'s your minimum commitment?',
        a: 'We offer flexible arrangements with no long-term contracts required. You can start small and scale up as you see results.'
      },
    ]
  },
  {
    category: 'Getting Started',
    questions: [
      {
        q: 'How quickly can I start receiving leads?',
        a: 'Once we understand your requirements and set up your campaign, you can start receiving leads within 24-48 hours. The exact timeline depends on your sector and specific requirements.'
      },
      {
        q: 'What information do you need from me?',
        a: 'We need to understand your target audience, geographical coverage, lead criteria, and capacity to handle leads. Our team will guide you through a simple onboarding process.'
      },
      {
        q: 'Do you provide support?',
        a: 'Yes, we provide dedicated account management and support throughout our partnership. Our team is always available to help optimize your campaigns and maximize your ROI.'
      },
    ]
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div className="border-b border-white/10 last:border-0">
      <button
        className="w-full py-6 text-left flex items-center justify-between group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium pr-8 text-white/90 group-hover:text-white transition-colors">
          {question}
        </h3>
        <motion.svg
          className="w-5 h-5 text-electric-blue flex-shrink-0"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/70 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('General')

  return (
    <div className="min-h-screen py-20">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-xl text-white/70">
            Everything you need to know about Click2Leads and our services
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {faqs.map((category) => (
            <button
              key={category.category}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category.category
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'glass-morphism text-white/60 hover:text-white'
              }`}
              onClick={() => setActiveCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </motion.div>

        <motion.div
          key={activeCategory}
          className="glass-morphism rounded-2xl p-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {faqs
            .find((cat) => cat.category === activeCategory)
            ?.questions.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.q}
                answer={faq.a}
              />
            ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/60 mb-6">
            Still have questions? We're here to help!
          </p>
          <motion.a
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </motion.a>
        </motion.div>
      </section>
    </div>
  )
}