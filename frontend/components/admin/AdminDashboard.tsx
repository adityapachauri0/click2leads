'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ContentEditor from './ContentEditor'
import PasswordChange from './PasswordChange'

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'settings'>('content')
  const [content, setContent] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content')
      const data = await response.json()
      
      if (data.success) {
        setContent(data.content)
      }
    } catch (error) {
      console.error('Failed to fetch content:', error)
      setMessage({ type: 'error', text: 'Failed to load content' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContentUpdate = (section: string, key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const saveContent = async () => {
    setIsSaving(true)
    setMessage(null)

    const updates: any[] = []
    
    // Convert content object to updates array
    Object.entries(content).forEach(([section, fields]: any) => {
      Object.entries(fields).forEach(([key, value]) => {
        updates.push({ section, key, value })
      })
    })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ updates })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Content saved successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save content' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading content...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            Content Editor
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-electric-blue to-neon-purple text-white'
                : 'bg-white/10 text-white/60 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Content */}
        <div className="glass-morphism rounded-2xl p-6 md:p-8">
          {activeTab === 'content' ? (
            <>
              <ContentEditor 
                content={content} 
                onUpdate={handleContentUpdate}
              />
              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveContent}
                  disabled={isSaving}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <PasswordChange />
          )}
        </div>
      </div>
    </div>
  )
}