'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const departments = [
  'All',
  'Leadership',
]

const team = [
  { name: 'Anthony Neale', role: 'CEO', department: 'Leadership', avatar: '👨‍💼' },
]

function TeamMemberCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      className="relative group"
    >
      <div className="relative rounded-2xl p-6 glass-morphism overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isHovered
              ? 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.1), transparent)'
              : 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0), transparent)',
          }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-4">{member.avatar}</div>
          <h3 className="text-lg font-display font-semibold mb-1">{member.name}</h3>
          <p className="text-sm text-electric-blue">{member.role}</p>
          <p className="text-xs text-white/50 mt-2">{member.department}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function TeamPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  
  const filteredTeam = selectedDepartment === 'All'
    ? team
    : team.filter(member => member.department === selectedDepartment)

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
            Meet Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            We will boost your business growth and have the right customers knocking at your door
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedDepartment === dept
                  ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                  : 'glass-morphism text-white/70 hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTeam.map((member, index) => (
            <TeamMemberCard key={member.name} member={member} index={index} />
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-display font-bold mb-6">
            Work With The #1 Lead Generation Company In The UK!
          </h2>
          <motion.a
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in touch
          </motion.a>
        </motion.div>
      </section>
    </div>
  )
}