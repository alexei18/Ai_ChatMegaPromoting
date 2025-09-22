import { NextResponse } from 'next/server'

const PEXELS_API = 'https://api.pexels.com/v1/search'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''

  if (!process.env.PEXELS_API_KEY) {
    return NextResponse.json({ error: 'Missing PEXELS_API_KEY' }, { status: 500 })
  }

  if (!q) {
    return NextResponse.json({ url: null })
  }

  try {
    const url = `${PEXELS_API}?query=${encodeURIComponent(q)}&per_page=1&page=1&orientation=landscape`
    const r = await fetch(url, {
      headers: { Authorization: process.env.PEXELS_API_KEY },
      cache: 'no-store',
    })

    if (!r.ok) {
      return NextResponse.json({ url: null }, { status: r.status })
    }

    const data = await r.json()
    const photo = data?.photos?.[0]

    if (!photo) {
      return NextResponse.json({ url: null })
    }

    const out = {
      url: photo?.src?.landscape || photo?.src?.large || null,
      alt: photo?.alt || q,
      id: photo?.id,
      photographer: photo?.photographer,
      photographer_url: photo?.photographer_url,
      pexels_url: photo?.url,
    }

    return NextResponse.json(out, {
      headers: { 'Cache-Control': 's-maxage=86400, stale-while-revalidate=604800' },
    })
  } catch (e) {
    return NextResponse.json({ url: null }, { status: 200 })
  }
}
