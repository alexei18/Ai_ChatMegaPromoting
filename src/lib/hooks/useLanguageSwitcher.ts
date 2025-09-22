"use client";

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const SUPPORTED = ['ro','en','ru'] as const;

type Lang = typeof SUPPORTED[number];

export function useLanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  async function setLanguage(lang: Lang) {
    if (!SUPPORTED.includes(lang)) return;
    try {
      await fetch(`/api/set-lang?lang=${lang}`, { method: 'POST' });
    } catch {}
    // strip existing leading /xx if present
    const newPath = pathname.replace(/^\/(ro|en|ru)(?=\/|$)/, '');
    startTransition(() => {
      router.push(`/${lang}${newPath}` || `/${lang}`);
    });
  }

  return { setLanguage, pending };
}
