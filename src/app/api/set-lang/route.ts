import { NextResponse } from 'next/server';

const SUPPORTED = ['ro','en','ru'] as const;

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = (searchParams.get('lang') || '').toLowerCase();
  if (!SUPPORTED.includes(lang as any)) {
    return NextResponse.json({ ok: false, error: 'unsupported_language' }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, lang });
  const common = { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' as const };
  res.cookies.set('lang', lang, common);
  res.cookies.set('NEXT_LOCALE', lang, common);
  return res;
}

export async function GET(req: Request) { // allow GET for convenience
  return POST(req);
}
