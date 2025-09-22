'use client'

import type { Metadata } from 'next';
import { useMemo, useState } from 'react';

// export const metadata: Metadata = {
//   title: 'Gid-uri',
//   description: 'Gid-uri complete',
// };

// ——— Helpers (monochrome only) ———
function ImgPlaceholder({ label = 'IMAGINE', className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`relative grid place-items-center bg-gray-100 text-gray-500 border border-gray-200 rounded-xl ${className}`}>
      <span className="text-[10px] tracking-widest">{label}</span>
    </div>
  );
}

function Badge({ children, tone = 'solid' as 'solid' | 'ghost' }: { children: React.ReactNode; tone?: 'solid' | 'ghost' }) {
  return tone === 'solid' ? (
    <span className="inline-flex items-center rounded-lg bg-black px-2.5 py-1 text-xs font-medium text-white">{children}</span>
  ) : (
    <span className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-800">{children}</span>
  );
}

function Pill({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
        active ? 'bg-black text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

// ——— Data ———
const CATEGORIES = ['Toate', 'Început', 'Configurare', 'Integrare', 'Optimizare', 'Avansate'] as const;

type Category = typeof CATEGORIES[number];

type Guide = {
  id: string;
  title: string;
  category: Category;
  readTime: string;
  level: 'Începător' | 'Intermediar' | 'Avansat';
  blurb: string;
};

const FEATURED: Guide[] = [
  {
    id: 'start-5min',
    title: 'Primii pași: conectează agentul AI în 5 minute',
    category: 'Început',
    readTime: '10 min',
    level: 'Începător',
    blurb: 'Creează contul, generează cheile și activează widgetul pe site.',
  },
  {
    id: 'style-voice',
    title: 'Personalizează vocea și răspunsurile',
    category: 'Configurare',
    readTime: '15 min',
    level: 'Intermediar',
    blurb: 'Ghid pentru ton, reguli și fallback la operator uman.',
  },
  {
    id: 'metrics',
    title: 'Măsoară performanța: CSAT, TTR, conversii',
    category: 'Optimizare',
    readTime: '20 min',
    level: 'Intermediar',
    blurb: 'Dashboard, evenimente și bune practici de A/B testing.',
  },
];

const LIBRARY: Guide[] = [
  {
    id: 'embed-web',
    title: 'Integrare pe website: script & CSS',
    category: 'Integrare',
    readTime: '12 min',
    level: 'Intermediar',
    blurb: 'Adaugă snippetul, poziționează launcher-ul și verifică încărcarea.',
  },
  {
    id: 'whatsapp',
    title: 'Conectează WhatsApp Business API',
    category: 'Integrare',
    readTime: '25 min',
    level: 'Avansat',
    blurb: 'Setare furnizor, webhook, template-uri și recepționare mesaje.',
  },
  {
    id: 'instagram',
    title: 'Instagram DM: permisiuni și fluxuri',
    category: 'Integrare',
    readTime: '18 min',
    level: 'Intermediar',
    blurb: 'Conectează pagina, aprobă permisiuni și pornește automatizările.',
  },
  {
    id: 'human-handoff',
    title: 'Handoff către operator: reguli și SLA',
    category: 'Configurare',
    readTime: '14 min',
    level: 'Intermediar',
    blurb: 'Escaladare contextuală, ferestre de timp și notificări.',
  },
  {
    id: 'kb-training',
    title: 'Antrenare pe baza de cunoștințe',
    category: 'Configurare',
    readTime: '16 min',
    level: 'Începător',
    blurb: 'Încărcare documente, sitemap crawl și reguli de citare.',
  },
  {
    id: 'api-webhooks',
    title: 'API & Webhooks pentru automatizări',
    category: 'Avansate',
    readTime: '35 min',
    level: 'Avansat',
    blurb: 'Autentificare, evenimente și exemple de integrare custom.',
  },
];

// ——— Blocks ———
function GuideCard({ g, index }: { g: Guide; index?: number }) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-gray-900">
          {index ?? '•'}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900">{g.title}</h3>
            <Badge>{g.category}</Badge>
          </div>
          <div className="mt-1 text-xs text-gray-500">{g.level} • {g.readTime} citire</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{g.blurb}</p>
      <div className="mt-4">
        <button className="rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800">Citește ghidul</button>
      </div>
    </article>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs font-semibold text-white">{n}</div>
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}

function LibraryRow({ g }: { g: Guide }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 sm:pr-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone="ghost">{g.category}</Badge>
            <span className="text-xs text-gray-500">{g.level} • {g.readTime} citire</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{g.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{g.blurb}</p>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">Citește</button>
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">Salvează</button>
        </div>
      </div>
    </div>
  );
}

export default function GidsPage() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<Category>('Toate');

  const filtered = useMemo(() => {
    const byCat = cat === 'Toate' ? [...LIBRARY] : LIBRARY.filter((g) => g.category === cat);
    if (!q.trim()) return byCat;
    const s = q.toLowerCase();
    return byCat.filter((g) => g.title.toLowerCase().includes(s) || g.blurb.toLowerCase().includes(s));
  }, [q, cat]);

  return (
  <div className="min-h-screen bg-white mt-16">
      {/* subtle grid background */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_60%)]" />

      <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-16">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Gid‑uri complete</h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">Instruiri pas cu pas pentru conectare, configurare și optimizare — totul în alb & negru.</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="search"
                placeholder="Caută un ghid (ex: WhatsApp, API, handoff)"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
          </div>
        </header>

        {/* Sticky category pills */}
        <div className="sticky top-0 z-10 mt-8 -mx-6 border-y border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-3">
            {CATEGORIES.map((c) => (
              <Pill key={c} active={c === cat} onClick={() => setCat(c)}>
                {c}
              </Pill>
            ))}
          </div>
        </div>

        {/* Featured */}
        <section className="mt-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">Gid‑uri populare</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((g, i) => (
              <GuideCard key={g.id} g={g} index={i + 1} />
            ))}
          </div>
        </section>

        {/* Quick steps */}
        <section className="mt-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Conectare în 6 pași</h2>
            <Badge tone="ghost">Monocrom • UX simplu</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Step n={1} title="Creează contul" text="Înregistrează-te și verifică emailul." />
            <Step n={2} title="Generează cheile" text="API key / Webhook secret pentru canale." />
            <Step n={3} title="Alege canalul" text="Website, WhatsApp, Instagram sau Email." />
            <Step n={4} title="Încarcă baza de cunoștințe" text="Documente, FAQ, sitemap crawler." />
            <Step n={5} title="Definește handoff" text="Reguli de escaladare la operator uman." />
            <Step n={6} title="Publică & măsoară" text="Activează și urmărește CSAT, TTR, conversii." />
          </div>
        </section>

        {/* Library */}
        <section className="mt-14">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900">Toate gid‑urile</h2>
          <div className="space-y-4">
            {filtered.map((g) => (
              <LibraryRow key={g.id} g={g} />
            ))}
            {!filtered.length && (
              <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">Niciun rezultat pentru căutarea curentă.</div>
            )}
          </div>
        </section>

        {/* Video section */}
        <section className="mt-16 rounded-2xl border border-gray-200 bg-black p-8 text-white">
          <h2 className="mb-6 text-center text-2xl font-bold">Tutoriale video</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <ImgPlaceholder className="mb-4 aspect-video w-full rounded-xl bg-gray-800" label="VIDEO" />
              <h3 className="text-sm font-semibold">Primul chatbot în 5 minute</h3>
              <p className="mt-1 text-xs text-gray-300">Setup end‑to‑end</p>
            </div>
            <div className="text-center">
              <ImgPlaceholder className="mb-4 aspect-video w-full rounded-xl bg-gray-800" label="VIDEO" />
              <h3 className="text-sm font-semibold">Personalizarea aspectului</h3>
              <p className="mt-1 text-xs text-gray-300">Teme, poziționare, launcher</p>
            </div>
            <div className="text-center">
              <ImgPlaceholder className="mb-4 aspect-video w-full rounded-xl bg-gray-800" label="VIDEO" />
              <h3 className="text-sm font-semibold">Analiza rezultatelor</h3>
              <p className="mt-1 text-xs text-gray-300">KPIs & raportare</p>
            </div>
          </div>
        </section>

        {/* Help CTA */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ai nevoie de ajutor?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600">Programează o sesiune 1‑la‑1 sau scrie-ne. Păstrăm totul simplu, clar și monocrom.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">Contactează suportul</button>
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">Programează 1‑on‑1</button>
          </div>
        </section>
      </div>
    </div>
  );
}
