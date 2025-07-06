'use client'

import { useEffect } from 'react'

export default function DebugInfo() {
  useEffect(() => {
    console.log('DebugInfo component mounted')
    
    // Force all elements to be visible
    const hiddenElements = document.querySelectorAll('[style*="opacity: 0"], [style*="opacity:0"]')
    console.log('Found hidden elements:', hiddenElements.length)
    
    hiddenElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      }
    })
    
    // Check for any errors
    window.addEventListener('error', (e) => {
      console.error('Global error:', e)
    })
  }, [])
  
  return null
}