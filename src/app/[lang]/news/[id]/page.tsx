import { notFound } from 'next/navigation'
import Link from 'next/link'
import path from 'path'
import fs from 'fs/promises'

export const revalidate = 3600; // Revalidate every hour

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

async function getArticle(id: string): Promise<NewsArticle | null> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'stiri.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const stiriData = JSON.parse(fileContent);

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

    const raw: any[] = Array.isArray(stiriData) ? stiriData : [];
    const mapped: NewsArticle[] = raw.map((r, idx) => {
        const title: string = r.titlu_seo || r.meta_title || `articol-${idx+1}`
        const slug = slugify(title)
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
          id: slug,
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
    });
    
    const found = mapped.find(a => a.id === id);
    return found || null;
  } catch (error) {
    console.error('Failed to read or parse news data for article:', error);
    return null;
  }
}

export default async function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  if (!article) {
    notFound();
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
