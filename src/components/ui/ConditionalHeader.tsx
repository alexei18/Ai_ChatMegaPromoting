'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Check if we're on an article page
  // This includes both dynamic routes like /blog/[id] and static article routes
  const isArticlePage = pathname?.startsWith('/blog/') && pathname !== '/blog'
  
  // Don't render header on article pages
  if (isArticlePage) {
    return null
  }
  
  return <Header />
}
