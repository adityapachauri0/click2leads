'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContentEditorProps {
  content: any
  onUpdate: (section: string, key: string, value: string) => void
}

export default function ContentEditor({ content, onUpdate }: ContentEditorProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['hero'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const sections = [
    { id: 'hero', title: 'Hero Section', icon: '🏠' },
    { id: 'about', title: 'About Section', icon: '📝' },
    { id: 'services', title: 'Services', icon: '🚀' }
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Content Editor</h2>
      
      {sections.map(section => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border border-white/10 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{section.icon}</span>
              <h3 className="text-lg font-medium text-white">{section.title}</h3>
            </div>
            <motion.svg
              animate={{ rotate: expandedSections.includes(section.id) ? 180 : 0 }}
              className="w-5 h-5 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          {expandedSections.includes(section.id) && content[section.id] && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="px-6 py-4 space-y-4"
            >
              {Object.entries(content[section.id]).map(([key, value]: any) => (
                <div key={key}>
                  <label className="block text-white/80 mb-2 text-sm">
                    {formatLabel(key)}
                  </label>
                  {key.includes('desc') || key.includes('description') ? (
                    <textarea
                      value={value}
                      onChange={(e) => onUpdate(section.id, key, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-colors resize-y"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onUpdate(section.id, key, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-electric-blue transition-colors"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-yellow-400 text-sm">
          <strong>💡 Tip:</strong> Changes are not saved automatically. Click "Save Changes" to update your website content.
        </p>
      </div>
    </div>
  )
}