'use client'

import { useEffect } from 'react'

export default function ChatWidget() {
  useEffect(() => {
    // Load the external chat widget script
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://bubble.aichat.md/apif/serve/chatbot-script.js?UserID=163'
    script.async = true
    
    document.body.appendChild(script)
    
    // Cleanup function to remove the script when component unmounts
    return () => {
      const existingScript = document.querySelector('script[src*="bubble.aichat.md"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  // Return null since the external script will handle rendering the chat widget
  return null
}