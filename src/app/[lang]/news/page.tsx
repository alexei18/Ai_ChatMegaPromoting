// Your component patched to auto-fetch Pexels covers by title/keywords

'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronRight, Filter, X, Newspaper, Calendar, Globe2, Tag as TagIcon } from 'lucide-react'
import roLocale from '@/locales/ro.json'
import enLocale from '@/locales/en.json'
import ruLocale from '@/locales/ru.json'
import stiriData from '@/data/stiri.json'

interface NewsArticle {
  id: string
  title: string
  content?: string
  htmlContent?: string
  sourceDomain?: string
  publishDate?: string
  imageUrl?: string
  category?: string
  tags?: string[]
  seoMetadata?: { keywords?: string; metaDescription?: string; metaTitle?: string }
  readingTimeMinutes?: number
  difficulty?: string
  contentType?: string
}

type SortKey = 'newest' | 'oldest' | 'title'

export default function NewsPage() {
  const pathname = typeof usePathname === 'function' ? usePathname() : ''
  const langMatch = pathname ? pathname.match(/^\/([a-z]{2})/) : null
  const lang = langMatch ? langMatch[1].toLowerCase() : 'ro'
  const basePath = `/${lang}`
  const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale }
  const t = locales[lang] || locales['ro']

  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<NewsArticle[]>([])

  // Pexels cover cache (id -> url)
  const [coverMap, setCoverMap] = useState<Record<string, string>>({})
  const [fetchingIds, setFetchingIds] = useState<Set<string>>(new Set())

  // UI state
  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [showFilters, setShowFilters] = useState(false)


  // ---------------------
  // Load & normalize data
  // ---------------------
  useEffect(() => {
    const safeJSON = <T,>(value: any): T | undefined => {
      if (!value || typeof value !== 'string') return undefined
      try { return JSON.parse(value) as T } catch { return undefined }
    }
    const slugify = (str: string) => str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    try {
      const raw: any[] = Array.isArray(stiriData) ? stiriData as any[] : []
      const mapped: NewsArticle[] = raw.map((r, idx) => {
        const title: string = r.titlu_seo || r.meta_title || `articol-${idx+1}`
        const id = slugify(title)
        const htmlContent: string | undefined = r.continut_html || undefined
        const contentPrincipal: string | undefined = r.continut_principal || undefined
        const txtContent = htmlContent ? undefined : contentPrincipal
        const tagsArr = safeJSON<string[]>(r.tags) || safeJSON<string[]>(r.tags_json) || safeJSON<string[]>(r.keywords_principale) || []
        const cats = safeJSON<string[]>(r.categorii) || []
        const metaObj = safeJSON<any>(r.metadata) || {}
        const sourceUrl: string | undefined = r.sursa_originala || undefined
        let sourceDomain: string | undefined
        if (sourceUrl) {
          try { sourceDomain = new URL(sourceUrl).hostname.replace(/^www\./,'') } catch { /* noop */ }
        }
        // derive reading time from plain text length if not provided
        const plain = (htmlContent || contentPrincipal || '').replace(/<[^>]+>/g,' ')
        const words = plain.split(/\s+/).filter(Boolean).length
        const readingTimeMinutes = metaObj.reading_time ? parseInt(String(metaObj.reading_time).match(/\d+/)?.[0] || '0',10) || Math.max(1, Math.round(words/200)) : Math.max(1, Math.round(words/200))
        return {
          id,
            title,
            htmlContent: htmlContent || undefined,
            content: txtContent,
            category: cats[0],
            tags: tagsArr,
            sourceDomain,
            seoMetadata: {
              metaDescription: r.meta_description || metaObj.metaDescription,
              metaTitle: title,
              keywords: (tagsArr || []).join(', ')
            },
            readingTimeMinutes,
            difficulty: metaObj.difficulty,
            contentType: metaObj.content_type
        }
      })
      setArticles(mapped)
    } catch (e) {
      console.error('Error normalizing stiri.json', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // ---------------------
  // Helpers
  // ---------------------
  const stripTags = (html?: string) => (html ? html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() : '')
  const excerpt = (a: NewsArticle, n: number) => {
    const raw = a.htmlContent
      ? a.htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      : a.content || ''
    const text = stripTags(raw)
    if (!text) return ''
    return text.length > n ? text.slice(0, n).trim() + '…' : text
  }
  const fmtDate = (d?: string) => {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString(lang === 'ro' ? 'ro-RO' : lang === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
    })
  }
  const readingTime = (a: NewsArticle) => a.readingTimeMinutes || 1

  // Build a robust Pexels query from title/keywords/category
  const buildQuery = (a: NewsArticle) => {
    const base = [a.title, a.category, a.seoMetadata?.keywords, a.sourceDomain]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const tokens = Array.from(new Set(base.split(/[^a-z0-9]+/).filter((t) => t.length > 2)))

    // Prefer high-level nouns often available on stock sites
    const topicHints = ['ai','technology','economy','education','health','finance','industry','agriculture','tourism','people','city','office','business']

    const picked = tokens.slice(0, 5)
    const fallbacks = topicHints.filter((x) => tokens.includes(x))

    return (
      picked.join(' ').trim() || fallbacks.join(' ').trim() || 'news'
    )
  }

  // Fetch one cover from our API with small retry using alternates
  const fetchCoverFor = async (a: NewsArticle) => {
    if (a.imageUrl) return null
    if (fetchingIds.has(a.id) || coverMap[a.id]) return null

    setFetchingIds((s) => new Set(s).add(a.id))

    const tryQueries = [
      buildQuery(a),
      (a.category || ''),
      (a.seoMetadata?.keywords?.split(',')[0] || ''),
      (a.title?.split(':')[0] || a.title || ''),
    ].map((q) => q.trim()).filter(Boolean)

    let url: string | null = null
    for (const q of tryQueries) {
      try {
        const r = await fetch(`/api/news/cover?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        const j = await r.json()
        url = j?.url || null
        if (url) break
      } catch (_) { /* noop */ }
    }

    if (url) {
      setCoverMap((prev) => ({ ...prev, [a.id]: url as string }))
    }

    setFetchingIds((s) => {
      const next = new Set(s)
      next.delete(a.id)
      return next
    })

    return url
  }

  // Fire cover fetches (limited batch) when list changes
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      // continue fetching in batches until none left
      while (!cancelled) {
        const missing = articles.filter((a) => !a.imageUrl && !coverMap[a.id])
        if (missing.length === 0) break

        const batch = missing.slice(0, 12)
        // wait for the current batch to complete before starting next
        await Promise.all(batch.map((a) => fetchCoverFor(a)))

        // small pause to avoid tight loop and reduce rate-limit risk
        await new Promise((res) => setTimeout(res, 150))
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [articles, coverMap])

  // ---------------------
  // Derived collections
  // ---------------------
  const allCategories = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.category && set.add(a.category))
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [articles])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [articles])

  const allSources = useMemo(() => {
    const set = new Set<string>()
    articles.forEach((a) => a.sourceDomain && set.add(a.sourceDomain))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [articles])

  const getLocalizedTag = (tag: string) => {
    if (!tag) return tag
    const k = tag.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    let key = ''
    if (k.includes('video') && k.includes('live')) key = 'video_live'
    else if (k.includes('video')) key = 'video'
    else if (k.includes('presa') || k.includes('press')) key = 'press_online'
    else if (k.includes('social') || k.includes('facebook')) key = 'social_media'
    else if (k.includes('eu') || k.includes('organiza')) key = 'eu_org'
    return (t?.NewsPage?.tagLabels?.[key]) ?? tag
  }

  // ---------------------
  // Filters
  // ---------------------
  const [searchState, setSearchState] = useState({
    selectedCategory: 'all' as string,
  })

  const filtered = useMemo(() => {
    let list = [...articles]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => {
        const text = ((a.title || '') + ' ' + (a.content || '') + ' ' + (a.htmlContent || '')).toLowerCase()
        return text.includes(q)
      })
    }

    if (selectedCategory !== 'all') {
      list = list.filter((a) => a.category === selectedCategory)
    }

    if (selectedTags.length > 0) {
      list = list.filter((a) => {
        const tags = a.tags || []
        return selectedTags.every((t) => tags.includes(t))
      })
    }

    if (selectedSources.length > 0) {
      list = list.filter((a) => a.sourceDomain && selectedSources.includes(a.sourceDomain))
    }

    list.sort((a, b) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
      const da = a.publishDate ? new Date(a.publishDate).getTime() : 0
      const db = b.publishDate ? new Date(b.publishDate).getTime() : 0
      return sortBy === 'newest' ? db - da : da - db
    })

    return list
  }, [articles, search, selectedCategory, selectedTags, selectedSources, sortBy])

  // Lead & highlights (prefer original image if exists, else coverMap)
  const heroLead = useMemo(() => {
    const first = filtered[0]
    if (!first) return undefined
    const withImg = filtered.find((a) => !!(a.imageUrl || coverMap[a.id]))
    return withImg || first
  }, [filtered, coverMap])

  const heroRest = useMemo(() => filtered.filter((a) => a.id !== heroLead?.id).slice(0, 3), [filtered, heroLead])

  const trending = useMemo(() => {
    return [...articles]
      .sort((a, b) => (new Date(b.publishDate || 0).getTime() - new Date(a.publishDate || 0).getTime()))
      .slice(0, 6)
  }, [articles])



  const resetFilters = () => {
    setSearch('')
    setSelectedTags([])
    setSelectedCategory('all')
    setSelectedSources([])
    setSortBy('newest')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto mb-4" />
          <p className="text-gray-600">{t?.NewsPage?.loading || 'Loading news…'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ================= Header / Title ================= */}
      <section className="border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mt-32">
            <Newspaper className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
              {t?.NewsPage?.title || 'News'}
            </h1>
            <span className="hidden sm:inline text-gray-400">•</span>
            <p className="hidden sm:inline text-gray-600">
              {t?.NewsPage?.subtitle || 'Curated articles without the visual noise. Filter and find what matters quickly.'}
            </p>
          </div>
          {/* Top controls */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t?.NewsPage?.search?.placeholder || 'Search by title or content…'}
                className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="h-10 border border-gray-300 rounded-lg px-2 text-sm bg-white"
                aria-label={t?.NewsPage?.sortLabel || 'Sort'}
              >
                <option value="newest">{t?.NewsPage?.sortOptions?.newest || 'Newest'}</option>
                <option value="oldest">{t?.NewsPage?.sortOptions?.oldest || 'Oldest'}</option>
                <option value="title">{t?.NewsPage?.sortOptions?.title || 'Title A–Z'}</option>
              </select>
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="h-10 inline-flex items-center gap-2 border border-gray-300 rounded-lg px-3 text-sm hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                {t?.NewsPage?.filters || 'Filters'}
              </button>
            </div>
          </div>

          {/* Category rail */}
          <div className="mt-3 overflow-x-auto scrollbar-thin">
            <div className="flex items-center gap-2 min-w-max py-1">
              {allCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={
                    'px-3 py-1.5 rounded-full text-sm border transition ' +
                    (selectedCategory === c
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 text-gray-800 hover:bg-gray-50')
                  }
                >
                  {c === 'all' ? (t?.NewsPage?.all || 'All') : c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= Hero ================= */}
      {heroLead && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead */}
            <Link href={`${basePath}/news/${heroLead.id}`} className="group relative block rounded-2xl overflow-hidden border border-gray-200">
              <div className="relative h-72 sm:h-96">
            <Image
              src={heroLead.imageUrl || coverMap[heroLead.id] || '/placeholder/card.jpg'}
              alt={heroLead.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                    {heroLead.category && (
                      <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur px-2 py-0.5 rounded">
                        <TagIcon className="w-3.5 h-3.5" /> {heroLead.category}
                      </span>
                    )}
                    {heroLead.publishDate && (
                      <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur px-2 py-0.5 rounded">
                        <Calendar className="w-3.5 h-3.5" /> {fmtDate(heroLead.publishDate)}
                      </span>
                    )}
                    {heroLead.sourceDomain && (
                      <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur px-2 py-0.5 rounded">
                        <Globe2 className="w-3.5 h-3.5" /> {heroLead.sourceDomain}
                      </span>
                    )}
                  </div>
                  <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow group-hover:underline">
                    {heroLead.title}
                  </h2>
                  <p className="hidden sm:block mt-2 text-white/90 max-w-2xl">
                    {excerpt(heroLead, 160)}
                  </p>
                </div>
              </div>
            </Link>

            {/* Highlights */}
            <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {heroRest.map((a) => (
                <Link key={a.id} href={`${basePath}/news/${a.id}`} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                  <div className="relative h-40">
                    <Image src={a.imageUrl || coverMap[a.id] || '/placeholder/card.jpg'} alt={a.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {a.category && <span>{a.category}</span>}
                      {a.publishDate && <>
                        <span>•</span>
                        <span>{fmtDate(a.publishDate)}</span>
                      </>}
                    </div>
                    <h3 className="mt-1 text-base font-semibold text-black group-hover:underline">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700 line-clamp-2">{excerpt(a, 100)}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Sidebar (Trending) */}
            <aside className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-4 sticky top-24">
                <h4 className="font-semibold text-black mb-3">{t?.NewsPage?.trending || 'Trending'}</h4>
                <ol className="space-y-3">
                  {trending.map((a, idx) => (
                    <li key={a.id} className="flex items-start gap-3">
                      <span className="mt-1 w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs flex items-center justify-center">{idx + 1}</span>
                      <Link href={`${basePath}/news/${a.id}`} className="group flex-1">
                        <p className="text-sm text-black group-hover:underline line-clamp-2">{a.title}</p>
                        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          {a.publishDate && <span>{fmtDate(a.publishDate)}</span>}
                          {a.sourceDomain && <>
                            <span>•</span>
                            <span>{a.sourceDomain}</span>
                          </>}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ================= Filters Drawer ================= */}
      {showFilters && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t?.NewsPage?.filters || 'Filters'}</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded hover:bg-gray-100" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-600 mb-2">{t?.NewsPage?.categories || 'Categories'}</label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(c)}
                    className={(selectedCategory === c ? 'bg-black text-white border-black ' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 ') + 'px-3 py-1.5 rounded-full text-sm border'}>
                    {c === 'all' ? (t?.NewsPage?.all || 'All') : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">{t?.NewsPage?.tags || 'Tags'}</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tg) => {
                    const active = selectedTags.includes(tg)
                    return (
                      <button
                        key={tg}
                        onClick={() => setSelectedTags((prev) => (active ? prev.filter((x) => x !== tg) : [...prev, tg]))}
                        className={(active ? 'bg-gray-900 text-white border-gray-900 ' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 ') + 'px-3 py-1.5 rounded-full text-sm border'}
                      >
                        {tg}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sources */}
            {allSources.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-600 mb-2">{t?.NewsPage?.sources || 'Sources'}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {allSources.map((s) => {
                    const active = selectedSources.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => setSelectedSources((prev) => (active ? prev.filter((x) => x !== s) : [...prev, s]))}
                        className={(active ? 'bg-gray-900 text-white border-gray-900 ' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 ') + 'px-3 py-1.5 rounded-full text-sm border text-left'}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sort inside drawer */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-600 mb-2">{t?.NewsPage?.sortLabel || 'Sort'}</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="w-full h-10 border border-gray-300 rounded-lg px-2 text-sm bg-white">
                <option value="newest">{t?.NewsPage?.sortOptions?.newest || 'Newest'}</option>
                <option value="oldest">{t?.NewsPage?.sortOptions?.oldest || 'Oldest'}</option>
                <option value="title">{t?.NewsPage?.sortOptions?.title || 'Title A–Z'}</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => { resetFilters(); }} className="h-10 px-4 rounded-lg border border-gray-300 text-sm hover:bg-gray-50">
                {t?.NewsPage?.clearFilters || 'Clear filters'}
              </button>
              <button onClick={() => setShowFilters(false)} className="h-10 px-4 rounded-lg bg-black text-white text-sm">
                {t?.NewsPage?.apply || 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= Main Grid + Right Rail ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <div>
                {filtered.length} {t?.NewsPage?.itemsLabel || 'news'}
                {(selectedTags.length || selectedSources.length || selectedCategory !== 'all' || search) ? (
                  <span className="ml-2 text-gray-400">{t?.NewsPage?.filtered || '(filtered)'} </span>
                ) : null}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-800 font-medium">{t?.NewsPage?.noMatchesTitle || 'No matches found.'}</p>
                <p className="text-gray-500 text-sm mt-1">{t?.NewsPage?.noMatchesSubtitle || 'Try adjusting filters or clearing the search.'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                {filtered.map((a) => (
                  <Link key={a.id} href={`${basePath}/news/${a.id}`} className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
                    <div className="relative h-48">
            <Image
              src={a.imageUrl || coverMap[a.id] || '/placeholder/card.jpg'}
              alt={a.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
                      <div className="absolute left-3 top-3 inline-flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
                        {a.category || (t?.NewsPage?.news || 'News')}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {a.publishDate && <span>{fmtDate(a.publishDate)}</span>}
                        {a.sourceDomain && <>
                          <span>•</span>
                          <span>{a.sourceDomain}</span>
                        </>}
                        <span>•</span>
                        <span>{readingTime(a)} min</span>
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-black leading-snug group-hover:underline">
                        {a.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-700 line-clamp-3">{excerpt(a, 180)}</p>

                      {a.tags && a.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {a.tags.slice(0, 3).map((tg) => (
                            <span key={tg} className="inline-flex items-center gap-1 text-xs border border-gray-300 text-gray-700 rounded-full px-2 py-0.5">
                              <TagIcon className="w-3.5 h-3.5" /> {tg}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 inline-flex items-center text-sm text-black group-hover:underline">
                        {t?.NewsPage?.readMore || 'Read more'}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}


          </div>

          {/* Right rail: Sources & Newsletter */}
          <aside className="lg:col-span-1 space-y-6">
            {allSources.length > 0 && (
              <div className="border border-gray-200 rounded-2xl p-4">
                <h4 className="font-semibold text-black mb-3">{t?.NewsPage?.sources || 'Sources'}</h4>
                <div className="flex flex-wrap gap-2">
                  {allSources.map((s) => (
                    <button key={s}
                      onClick={() => setSelectedSources((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                      className={(selectedSources.includes(s) ? 'bg-black text-white border-black ' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 ') + 'px-3 py-1.5 rounded-full text-sm border'}>
                      {s}
                    </button>
                  ))}
                </div>
                {selectedSources.length > 0 && (
                  <button onClick={() => setSelectedSources([])} className="mt-3 text-xs text-gray-600 underline">
                    {t?.NewsPage?.clear || 'Clear'}
                  </button>
                )}
              </div>
            )}

            {allTags.length > 0 && (
              <div className="border border-gray-200 rounded-2xl p-4">
                <h4 className="font-semibold text-black mb-3">{t?.NewsPage?.tags || 'Tags'}</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 24).map((tg) => (
                    <button key={tg}
                      onClick={() => setSelectedTags((prev) => prev.includes(tg) ? prev.filter((x) => x !== tg) : [...prev, tg])}
                      className={(selectedTags.includes(tg) ? 'bg-black text-white border-black ' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 ') + 'px-3 py-1.5 rounded-full text-sm border'}>
                      {tg}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button onClick={() => setSelectedTags([])} className="mt-3 text-xs text-gray-600 underline">
                    {t?.NewsPage?.clear || 'Clear'}
                  </button>
                )}
              </div>
            )}

            <div className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-white">
              <h4 className="font-semibold text-black">{t?.NewsPage?.newsletterTitle || 'Get weekly highlights'}</h4>
              <p className="text-sm text-gray-600 mt-1">{t?.NewsPage?.newsletterSubtitle || 'The best stories, straight to your inbox.'}</p>
              <form className="mt-3 flex items-center gap-2">
                <input type="email" required placeholder="you@example.com" className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm" />
                <button type="submit" className="h-10 px-4 rounded-lg bg-black text-white text-sm">{t?.NewsPage?.subscribe || 'Subscribe'}</button>
              </form>
              <p className="text-[11px] text-gray-500 mt-2">{t?.NewsPage?.privacy || 'We respect your privacy. Unsubscribe any time.'}</p>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= Footer mini ================= */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex flex-wrap items-center gap-2">
          <span>© {new Date().getFullYear()} Kalina / Bravin AI</span>
          <span>•</span>
          <Link href={`${basePath}/privacy`} className="hover:underline">{t?.Common?.privacy || 'Privacy'}</Link>
          <span>•</span>
          <Link href={`${basePath}/terms`} className="hover:underline">{t?.Common?.terms || 'Terms'}</Link>
          <span>•</span>
          {/* Pexels attribution */}
          <a href="https://www.pexels.com" className="inline-flex items-center gap-2 ml-2" aria-label="Photos provided by Pexels">
            Photos provided by Pexels
            <Image src="https://images.pexels.com/lib/api/pexels.png" alt="Pexels" width={64} height={16} className="h-4 w-auto opacity-80" />
          </a>
        </div>
      </footer>
    </div>
  )
}

// ================================================================
// (Optional) next.config.mjs – allow remote images from Pexels when using next/image
// ================================================================
// export default {
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'images.pexels.com' },
//     ],
//   },
// }
