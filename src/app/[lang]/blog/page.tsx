import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import articlesData from '@/data/articles.json';
import roLocale from '@/locales/ro.json';
import enLocale from '@/locales/en.json';
import ruLocale from '@/locales/ru.json';

export const metadata: Metadata = {
  title: 'Blog - Bravin AI',
  description:
    'Descoperă cele mai recente articole și insights despre inteligența artificială în marketing și automatizare.',
};

// Types for the article structure
interface Article {
  id: string
  title: string
  content: string
  htmlContent?: string
  authorName: string
  sourceDomain: string
  seoMetadata: {
    keywords: string
    metaDescription: string
    metaTitle: string
  }
}

// Simple placeholder image block
function ImgPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 ${className}`}
      aria-label="Image placeholder"
      style={{ paddingTop: '56.25%' }} // For aspect-[16/9]
    >
      <div className="absolute inset-0 grid place-items-center text-xs text-gray-400">
        <span>IMAGE</span>
      </div>
    </div>
  );
}

function Author({ name, date }: { name: string; date: string }) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="h-7 w-7 rounded-full bg-gray-300" aria-hidden />
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium text-gray-700">{name}</span>
        <span>•</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

type CardProps = {
  title: string;
  description: string;
  date: string;
  author: string;
  href: string;
  imageSrc?: string;
};

function Card({
  title,
  description,
  date,
  author,
  href,
  imageSrc,
}: CardProps) {
  return (
    <Link href={href} className="block">
      <article className="group rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm cursor-pointer">
        {imageSrc ? (
          title === "Parteneri cu UpNext Accelerator: $10K Start Funding" ? (
            <div className="aspect-[16/9] w-full flex items-center justify-center">
              <Image src={imageSrc} alt={title} width={128} height={128} className="max-h-32 w-auto object-contain" style={{borderRadius: 0, border: 'none', margin: 0, padding: 0, display: 'block'}} />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full relative">
              <Image src={imageSrc} alt={title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover rounded-lg border border-gray-200" />
            </div>
          )
        ) : (
          <ImgPlaceholder className="aspect-[16/9] w-full" />
        )}
        <h3 className="mt-4 text-lg font-semibold leading-snug text-gray-900 group-hover:underline">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">{description}</p>
        <Author name={author} date={date} />
      </article>
    </Link>
  );
}

// Function to truncate content for preview
function truncateContent(content: string, maxLength: number = 150): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + '...';
}

// Function to format date
function formatDate(id: string): string {
  // Extract timestamp from article ID
  const match = id.match(/article-content-(\d+)/);
  if (match) {
    const timestamp = parseInt(match[1]);
    const date = new Date(timestamp);
    return date.toLocaleDateString('ro-RO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
  return 'Dată necunoscută';
}

export default function BlogPage({ params }: { params: { lang?: string } }) {
  const lang = params?.lang || 'ro';
  const basePath = `/${lang}`;
  const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale };
  const t = locales[lang] || locales['ro'];
  // Get articles from JSON data
  const articles: Article[] = (articlesData as any).articles || [];

  // Static/featured articles (keep the existing ones)
  const featuredArticles = [
    {
      id: 'elevenlabs-hackathon',
      title: "Câștigătorii ElevenLabs Hackathon: $20,000 pentru Agenții AI",
      description: "Cum am câștigat primul loc la ElevenLabs Hackathon cu tehnologia noastră de agenți AI vocali și ce înseamnă asta pentru viitorul industriei.",
      author: "Gabriel Vasilachi",
      date: "Nov 15, 2024",
      href: "/blog/elevenlabs-hackathon-winner",
      featured: true
    },
    {
      id: 'ebrd-star-venture',
      title: "EBRD ne Selectează pentru Programul Star Venture",
      description: "Aichat.md este selectat pentru prestigiosul program Star Venture de la EBRD. Ce înseamnă această recunoaștere pentru dezvoltarea AI în Moldova.",
      author: "Gabriel Vasilachi",
      date: "Jul 25, 2024",
      href: "/blog/ebrd-star-venture-program",
      imageSrc: "/EbdrArticleBlog/EBDR-LogoImage.png"
    },
    {
      id: 'sevan-startup-summit',
      title: "Locul 2 la Sevan Startup Summit: $6,000 pentru Aichat.md",
      description: "Performanța excepțională la Sevan Startup Summit ne aduce recunoașterea internațională și finanțarea pentru dezvoltarea ulterioară.",
      author: "Gabriel Vasilachi",
      date: "Aug 20, 2024",
      href: "/blog/sevan-startup-summit-second-place",
      imageSrc: "/gallerySevanStartUp/IMG_6544.jpg"
    },
    {
      id: 'google-cloud-partnership',
      title: "Google Cloud ne Susține: $25K Grant pentru Infrastructura AI",
      description: "Parteneriatul strategic cu Google Cloud ne permite să scalăm infrastructura AI la nivel global. Detalii despre grant-ul de $25,000.",
      author: "Gabriel Vasilachi", 
      date: "Sep 10, 2024",
      href: "/blog/google-cloud-partnership-grant",
      imageSrc: "/GoogleCloud/GoogleCloudLogo.webp"
    },
    {
      id: 'upnext-accelerator',
      title: "Parteneri cu UpNext Accelerator: $10K Start Funding",
      description: "Alăturarea programului UpNext Accelerator by Dreamups marchează o nouă etapă în dezvoltarea Aichat.md cu finanțare de $10,000.",
      author: "Gabriel Vasilachi",
      date: "Jun 5, 2024", 
      href: "/blog/upnext-accelerator-partnership",
      imageSrc: "/UpNext/image copy.png"
    },
    {
      id: 'upnext-accelerator',
      title: "YoHealth a dublat premiul câștigat la Sevan Startup Summit, ridicând valoarea acestuia la $12,000 pentru inovație în sănătate.",
      description: "Tehnologia noastră AI revoluționează sectorul medical — iar inovația noastră a fost premiată la Sevan Startup Summit. Datorită aprecierii YoHealth, premiul câștigat a fost dublat, ajungând la $12,000.",
      author: "Gabriel Vasilachi",
      date: "Jun 5, 2024", 
      href: "/blog/sevan-startup-summit-second-place",
      imageSrc: "/gallerySevanStartUp/IMG_5333.JPG"
    }
  ];

  // Map featured articles to localized values when available
  const localizedFeatured = featuredArticles.map((a) => {
    const localized = t?.BlogPage?.featured?.[a.id] || {};
    return {
      ...a,
      title: localized.title || a.title,
      description: localized.description || a.description,
      date: localized.date || a.date,
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-16 mt-12">
        {/* Title row (matches screenshot spacing) */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{t?.BlogPage?.title || 'Blog'}</h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            {t?.BlogPage?.subtitle || 'Learn more about Bravin through our blog!'}
          </p>
        </div>

        {/* 2-col layout: left sidebar (search + categories) and main content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24">

            {/* Categories */}
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-medium text-gray-500">{t?.BlogPage?.categories?.title || 'Categories'}</h2>
              <nav className="flex flex-col gap-1 text-sm">
                <a className="rounded-lg bg-gray-900 px-3 py-2 font-medium text-white">{t?.BlogPage?.categories?.items?.latest || 'Latest'}</a>
                <a className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">{t?.BlogPage?.categories?.items?.insights || 'Insights'}</a>
                <a className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">{t?.BlogPage?.categories?.items?.company || 'Company'}</a>
                <a className="rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">{t?.BlogPage?.categories?.items?.useCases || 'Use Cases'}</a>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main>
            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
              
              {/* Featured Articles First */}
      {localizedFeatured.map((article) => {
                if (article.featured) {
                  return (
        <Link key={article.id} href={`${basePath}${article.href}`} className="block">
                      <div className="group relative bg-white border-4 border-black overflow-hidden hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 transform hover:rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-w-[calc(100%+20px)] min-h-[calc(100%)]">
                        <div className="relative p-8">
                          <div className="flex items-center justify-between mb-4">
                            <span className="bg-black text-white px-4 py-2 border-2 border-black font-black text-xs transform -rotate-2">🏆 1ST PLACE</span>
                            <span className="text-black text-sm font-bold border-2 border-black px-2 py-1 bg-gray-100">5 min citire</span>
                          </div>
                          <h3 className="text-xl font-black text-black mb-3 group-hover:transform group-hover:rotate-1 transition-transform" style={{textShadow: '2px 2px 0px rgba(255,255,255,1), 4px 4px 0px rgba(0,0,0,1)'}}>
                            {article.title}
                          </h3>
                          <p className="text-black mb-6 leading-relaxed font-bold border-l-4 border-black pl-4 bg-gray-100 p-3">
                            {article.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center transform rotate-6">
                                <span className="text-white font-black text-sm transform -rotate-6">G</span>
                              </div>
                              <span className="text-sm text-black font-black">{article.author}</span>
                            </div>
                            <div className="text-black bg-white hover:bg-black hover:text-white font-black text-sm flex items-center gap-1 group-hover:gap-2 transition-all border-2 border-black px-3 py-2 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              Citește <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <Card
                      key={article.id}
                      title={article.title}
                      description={article.description}
                      author={article.author}
                      date={article.date}
                      href={`${basePath}${article.href}`}
                      imageSrc={article.imageSrc}
                    />
                  );
                }
              })}

              {/* Dynamic Articles from JSON */}
              {articles.map((article) => (
                <Card
                  key={article.id}
                  title={article.title}
                  description={truncateContent(article.seoMetadata.metaDescription)}
                  author={article.authorName}
                  date={formatDate(article.id)}
                  href={`${basePath}/blog/${article.id}`}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
