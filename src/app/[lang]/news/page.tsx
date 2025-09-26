import NewsClientPage from '@/components/ui/NewsClientPage';
import path from 'path';
import fs from 'fs/promises';

export const revalidate = 3600; // Revalidate every hour

async function getNewsData() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'stiri.json');
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

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

    const raw: any[] = Array.isArray(data) ? data : [];
    const mapped = raw.map((r, idx) => {
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
    });
    return mapped;
  } catch (error) {
    console.error('Failed to read or parse news data:', error);
    return [];
  }
}

export default async function NewsPage() {
  const articles = await getNewsData();

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Could not load news articles.</p>
        </div>
      </div>
    );
  }

  return <NewsClientPage initialArticles={articles} />;
}
