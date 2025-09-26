'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ChevronRight, Filter, X, Newspaper, Calendar, Globe2, Tag as TagIcon } from 'lucide-react'
import roLocale from '@/locales/ro.json'
import enLocale from '@/locales/en.json'
import ruLocale from '@/locales/ru.json'

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

const ArticleCard = React.memo(({ article, basePath, coverUrl, t }: { article: NewsArticle, basePath: string, coverUrl: string, t: any }) => {
  const excerpt = (a: NewsArticle, n: number) => {
    const raw = a.htmlContent
      ? a.htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      : a.content || ''
    const text = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (!text) return ''
    return text.length > n ? text.slice(0, n).trim() + '…' : text
  }

  const fmtDate = (d?: string) => {
    if (!d) return ''
    const date = new Date(d)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('ro-RO', {
      year: 'numeric', month: 'short', day: '2-digit',
    })
  }

  return (
    <Link href={`${basePath}/news/${article.id}`} className="group block border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition">
      <div className="relative h-48">
        <Image
          src={coverUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
          {article.category || (t?.NewsPage?.news || 'News')}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {article.publishDate && <span>{fmtDate(article.publishDate)}</span>}
          {article.sourceDomain && <><span>•</span><span>{article.sourceDomain}</span></>}
          <span>•</span>
          <span>{article.readingTimeMinutes || 1} min</span>
        </div>
        <h3 className="mt-1 text-lg font-semibold text-black leading-snug group-hover:underline">
          {article.title}
        </h3>
        <p className="mt-1 text-sm text-gray-700 line-clamp-3">{excerpt(article, 180)}</p>
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tg) => (
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
  )
});
ArticleCard.displayName = 'ArticleCard';


export default function NewsClientPage({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const pathname = typeof usePathname === 'function' ? usePathname() : ''
  const langMatch = pathname ? pathname.match(/^\/([a-z]{2})/) : null
  const lang = langMatch ? langMatch[1].toLowerCase() : 'ro'
  const basePath = `/${lang}`
  const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale }
  const t = locales[lang] || locales['ro']

  const [articles] = useState<NewsArticle[]>(initialArticles)
  const [coverMap, setCoverMap] = useState<Record<string, string>>({})
  const [fetchingIds, setFetchingIds] = useState<Set<string>>(new Set())

  const [search, setSearch] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [showFilters, setShowFilters] = useState(false)

  const buildQuery = (a: NewsArticle) => {
    const base = [a.title, a.category, a.seoMetadata?.keywords, a.sourceDomain]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const tokens = Array.from(new Set(base.split(/[^a-z0-9]+/).filter((t) => t.length > 2)))
    const topicHints = ['ai','technology','economy','education','health','finance','industry','agriculture','tourism','people','city','office','business']
    const picked = tokens.slice(0, 5)
    const fallbacks = topicHints.filter((x) => tokens.includes(x))
    return (picked.join(' ').trim() || fallbacks.join(' ').trim() || 'news')
  }

  const fetchCoverFor = async (a: NewsArticle) => {
    if (a.imageUrl || fetchingIds.has(a.id) || coverMap[a.id]) return null
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
    if (url) setCoverMap((prev) => ({ ...prev, [a.id]: url as string }))
    setFetchingIds((s) => {
      const next = new Set(s)
      next.delete(a.id)
      return next
    })
    return url
  }

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      while (!cancelled) {
        const missing = articles.filter((a) => !a.imageUrl && !coverMap[a.id])
        if (missing.length === 0) break
        const batch = missing.slice(0, 12)
        await Promise.all(batch.map((a) => fetchCoverFor(a)))
        await new Promise((res) => setTimeout(res, 150))
      }
    }
    void run()
    return () => { cancelled = true }
  }, [articles, coverMap])

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

  const filtered = useMemo(() => {
    let list = [...articles]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => ((a.title || '') + ' ' + (a.content || '') + ' ' + (a.htmlContent || '')).toLowerCase().includes(q))
    }
    if (selectedCategory !== 'all') list = list.filter((a) => a.category === selectedCategory)
    if (selectedTags.length > 0) list = list.filter((a) => selectedTags.every((t) => (a.tags || []).includes(t)))
    if (selectedSources.length > 0) list = list.filter((a) => a.sourceDomain && selectedSources.includes(a.sourceDomain))
    list.sort((a, b) => {
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
      const da = a.publishDate ? new Date(a.publishDate).getTime() : 0
      const db = b.publishDate ? new Date(b.publishDate).getTime() : 0
      return sortBy === 'newest' ? db - da : da - db
    })
    return list
  }, [articles, search, selectedCategory, selectedTags, selectedSources, sortBy])

  const resetFilters = () => {
    setSearch('')
    setSelectedTags([])
    setSelectedCategory('all')
    setSelectedSources([])
    setSortBy('newest')
  }

  return (
    <>
      {/* Header, Filters, and Content */}
    </>
  )
}
