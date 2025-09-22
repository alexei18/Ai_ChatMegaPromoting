'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import stiriData from '@/data/stiri.json'

// Types for the news article structure
interface NewsArticle {
  id: string
  title: string
  content?: string
  htmlContent?: string
  sourceDomain?: string
  category?: string
  tags?: string[]
  metaDescription?: string
  readingTimeMinutes?: number
  difficulty?: string
  contentType?: string
}

export default function NewsArticlePage() {
  const params = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadArticle = () => {
      try {
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
        const raw: any[] = Array.isArray(stiriData) ? stiriData as any[] : []
        const mapped: NewsArticle[] = raw.map((r, idx) => {
          const title: string = r.titlu_seo || r.meta_title || `articol-${idx+1}`
          const id = slugify(title)
          const htmlContent: string | undefined = r.continut_html || undefined
          const contentPrincipal: string | undefined = r.continut_principal || undefined
          const tagsArr = safeJSON<string[]>(r.tags) || safeJSON<string[]>(r.keywords_principale) || []
          const cats = safeJSON<string[]>(r.categorii) || []
          const metaObj = safeJSON<any>(r.metadata) || {}
          const sourceUrl: string | undefined = r.sursa_originala || undefined
          let sourceDomain: string | undefined
          if (sourceUrl) {
            try { sourceDomain = new URL(sourceUrl).hostname.replace(/^www\./,'') } catch { /* noop */ }
          }
          const plain = (htmlContent || contentPrincipal || '').replace(/<[^>]+>/g,' ')
          const words = plain.split(/\s+/).filter(Boolean).length
          const readingTimeMinutes = metaObj.reading_time ? parseInt(String(metaObj.reading_time).match(/\d+/)?.[0] || '0',10) || Math.max(1, Math.round(words/200)) : Math.max(1, Math.round(words/200))
          return {
            id,
            title,
            htmlContent: htmlContent || undefined,
            content: htmlContent ? undefined : contentPrincipal,
            category: cats[0],
            tags: tagsArr,
            sourceDomain,
            metaDescription: r.meta_description || metaObj.metaDescription,
            readingTimeMinutes,
            difficulty: metaObj.difficulty,
            contentType: metaObj.content_type
          }
        })
        const found = mapped.find(a => a.id === params.id)
        if (found) {
          setArticle(found)
        } else {
          setNotFound(true)
        }
      } catch (e) {
        console.error('Error parsing stiri.json', e)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadArticle()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Se încarcă articolul...</p>
        </div>
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Articolul nu a fost găsit</h2>
            <p className="text-gray-600 mb-8">
              Ne pare rău, dar articolul pe care îl căutați nu există sau a fost mutat.
            </p>
          </div>
          <Link 
            href="/news" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            ← Înapoi la Noutăți
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/news" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors duration-200"
          >
            ← Înapoi la Noutăți
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            {article.sourceDomain && <span>{article.sourceDomain}</span>}
            {article.category && <><span>•</span><span>{article.category}</span></>}
            {article.readingTimeMinutes && <><span>•</span><span>{article.readingTimeMinutes} min</span></>}
            {article.difficulty && <><span>•</span><span>{article.difficulty}</span></>}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="prose prose-lg max-w-none">
          {article.htmlContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: article.htmlContent }}
              className="text-gray-800 leading-relaxed"
            />
          ) : (
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {article.content}
            </div>
          )}
        </article>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-600 mb-4 sm:mb-0">
              {article.sourceDomain && <p>Sursă: <span className="font-medium text-gray-900">{article.sourceDomain}</span></p>}
              {article.tags && article.tags.length > 0 && (
                <p className="mt-1 flex flex-wrap gap-2">{article.tags.map(t => <span key={t} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{t}</span>)}</p>
              )}
            </div>
            <Link 
              href="/news" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              Vezi toate noutatile
            </Link>
          </div>
        </footer>
      </main>
    </div>
  )
}
