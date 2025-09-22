'use client'

import { useEffect, useState } from 'react'
import DemoSectionMobile from './DemoSectionMobile'
import DemoSectionDesktop from './DemoSectionDesktop'

export function ResponsiveDemoSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth < 1130 // lg breakpoint
      setIsMobile(isMobileDevice)
      setIsLoaded(true)
    }

    // Initial check
    checkDevice()

    // Listen for resize events
    window.addEventListener('resize', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isLoaded) {
    return (
      <section className="relative py-0 overflow-hidden bg-black min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </section>
    )
  }

  return isMobile ? <DemoSectionMobile /> : <DemoSectionDesktop />
}

// Export both individual components for direct use if needed
export { DemoSectionMobile, DemoSectionDesktop }
