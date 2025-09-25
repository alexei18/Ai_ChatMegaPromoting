import { NextResponse } from 'next/server'

const STATIC_IMAGES = [
  '/placeholder/tech1.jpg',
  '/placeholder/tech2.jpg', 
  '/placeholder/tech3.jpg',
  '/placeholder/tech4.jpg',
  '/placeholder/tech5.jpg',
  '/placeholder/ai1.jpg',
  '/placeholder/ai2.jpg',
  '/placeholder/ai3.jpg',
  '/placeholder/business1.jpg',
  '/placeholder/business2.jpg',
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!q) {
    return NextResponse.json({ url: null })
  }

  // Generate a consistent image based on the query
  const hash = q.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const imageIndex = hash % STATIC_IMAGES.length
  const selectedImage = STATIC_IMAGES[imageIndex]

  const out = {
    url: selectedImage,
    alt: q,
    id: `static-${hash}`,
    photographer: 'Stock Photos',
    photographer_url: null,
    pexels_url: null,
  }

  return NextResponse.json(out, {
    headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' },
  })
}
