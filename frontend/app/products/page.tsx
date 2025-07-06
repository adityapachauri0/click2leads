'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const leadTypes = [
  {
    category: 'Home Improvement',
    icon: '🏠',
    color: '#0EA5E9',
    leads: [
      { name: 'Windows & Doors', description: 'Double glazing installation leads' },
      { name: 'Home Extensions', description: 'Property extension project leads' },
      { name: 'Kitchen & Bathroom', description: 'Renovation and remodeling leads' },
      { name: 'General Home Improvement', description: 'Various home upgrade leads' },
    ],
  },
  {
    category: 'Green Energy',
    icon: '🌱',
    color: '#10B981',
    leads: [
      { name: 'Solar Panels', description: 'Solar installation qualified leads' },
      { name: 'Heat Pumps', description: 'Air and ground source heat pump leads' },
      { name: 'ECO4 Grants', description: 'Government funded energy efficiency leads' },
      { name: 'Insulation', description: 'Cavity wall and loft insulation leads' },
    ],
  },
  {
    category: 'Financial Services',
    icon: '💰',
    color: '#A855F7',
    leads: [
      { name: 'Mortgages', description: 'First-time buyer and remortgage leads' },
      { name: 'Life Insurance', description: 'Term and whole life insurance leads' },
      { name: 'Investment', description: 'Investment opportunity qualified leads' },
      { name: 'IVA & Debt Management', description: 'Debt solution seeking leads' },
    ],
  },
  {
    category: 'Legal Services',
    icon: '⚖️',
    color: '#F59E0B',
    leads: [
      { name: 'Personal Injury', description: 'Accident claim qualified leads' },
      { name: 'Legal Claims', description: 'Various legal service leads' },
      { name: 'Conveyancing', description: 'Property transaction leads' },
      { name: 'Family Law', description: 'Divorce and family matter leads' },
    ],
  },
  {
    category: 'Healthcare',
    icon: '🏥',
    color: '#EF4444',
    leads: [
      { name: 'Hearing Aids', description: 'Hearing solution qualified leads' },
      { name: 'Mobility', description: 'Mobility equipment and scooter leads' },
      { name: 'Private Healthcare', description: 'Private medical insurance leads' },
      { name: 'Dental', description: 'Private dental treatment leads' },
    ],
  },
  {
    category: 'Other Services',
    icon: '📡',
    color: '#8B5CF6',
    leads: [
      { name: 'Broadband', description: 'Internet service switching leads' },
      { name: 'Home Security', description: 'CCTV and alarm system leads' },
      { name: 'Education', description: 'Online course and training leads' },
      { name: 'B2B Services', description: 'Business service qualified leads' },
    ],
  },
]

function LeadTypeCard({ category, index }: { category: typeof leadTypes[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-morphism rounded-2xl p-6"
    >
      <div className="flex items-center mb-4">
        <span className="text-4xl mr-3">{category.icon}</span>
        <h3 className="text-2xl font-display font-bold" style={{ color: category.color }}>
          {category.category}
        </h3>
      </div>
      
      <div className="space-y-3">
        {category.leads.map((lead) => (
          <motion.div
            key={lead.name}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            whileHover={{ x: 5 }}
          >
            <h4 className="font-semibold text-white mb-1">{lead.name}</h4>
            <p className="text-sm text-white/60">{lead.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function ProductsPage() {
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
            Lead Types We <span className="gradient-text">Generate</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive lead generation across multiple industries with guaranteed exclusivity and quality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {leadTypes.map((category, index) => (
            <LeadTypeCard key={category.category} category={category} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center glass-morphism rounded-2xl p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6">
            Can't See Your Industry?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            We can generate leads for almost any B2C or B2B sector. Our flexible approach means we can adapt our strategies to meet your specific requirements.
          </p>
          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Discuss Your Requirements
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}