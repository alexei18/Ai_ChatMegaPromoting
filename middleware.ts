import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed languages present in routing structure (/ro /en /ru)
const SUPPORTED = ['ro','en','ru'] as const;
const DEFAULT_LANG = 'ro';

type Lang = typeof SUPPORTED[number];

// Basic country -> language mapping (extend as needed)
const countryToLang: Record<string, Lang> = {
  RO: 'ro', MD: 'ro', // Romania / Moldova
  US: 'en', GB: 'en', IE: 'en', CA: 'en', AU: 'en', NZ: 'en', DE: 'en', NL: 'en', SE: 'en', NO: 'en', DK: 'en', FI: 'en', BE: 'en', AT: 'en', CH: 'en', // fallback to EN for many EU
  RU: 'ru', BY: 'ru', KZ: 'ru', UA: 'ru' // treat UA here only if you intentionally want RU fallback
};

function pickFromAcceptLanguage(header: string | null): Lang | null {
  if (!header) return null;
  // Parse like: "en-US,en;q=0.9,ro;q=0.8"
  const parts = header.split(',').map(s => s.trim());
  for (const p of parts) {
    const code = p.split(';')[0].toLowerCase(); // en-us
    const primary = code.split('-')[0];
    if (SUPPORTED.includes(primary as Lang)) return primary as Lang;
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore next internals & static assets
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.match(/\.[a-zA-Z0-9]{2,4}$/)) {
    return NextResponse.next();
  }

  const pathMatch = pathname.match(/^\/(ro|en|ru)(?:\/|$)/i);
  const currentPathHasLang = !!pathMatch;
  const cookieLang = req.cookies.get('lang')?.value as Lang | undefined;

  // If path already has language -> ensure cookies are synced, then continue
  if (currentPathHasLang) {
    const segmentLang = pathMatch![1].toLowerCase() as Lang;
    if (cookieLang !== segmentLang || req.cookies.get('NEXT_LOCALE')?.value !== segmentLang) {
      const res = NextResponse.next();
      const common = { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' as const };
      res.cookies.set('lang', segmentLang, common);
      res.cookies.set('NEXT_LOCALE', segmentLang, common);
      return res;
    }
    return NextResponse.next();
  }

  // 1. Cookie
  if (cookieLang && SUPPORTED.includes(cookieLang)) {
    return redirectWithCookie(req, cookieLang, pathname);
  }

  // 2. Accept-Language
  const acceptLang = pickFromAcceptLanguage(req.headers.get('accept-language'));
  if (acceptLang) {
    return redirectWithCookie(req, acceptLang, pathname);
  }

  // 3. Geo IP header (Vercel / edge). Try request.geo then header.
  const country = (req.geo?.country || req.headers.get('x-vercel-ip-country') || '').toUpperCase();
  const geoLang = (countryToLang[country] || 'en') as Lang; // fallback to EN if unknown

  return redirectWithCookie(req, geoLang || DEFAULT_LANG, pathname);
}

function redirectWithCookie(req: NextRequest, lang: Lang, originalPath: string) {
  const url = new URL(`/${lang}${originalPath}`, req.url);
  const res = NextResponse.redirect(url);
  const common = { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' as const };
  res.cookies.set('lang', lang, common);
  res.cookies.set('NEXT_LOCALE', lang, common);
  return res;
}

export const config = {
  matcher: ['/((?!_next/|favicon|robots|sitemap|.*\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp4|txt)).*)'],
};
