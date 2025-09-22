'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ro from '@/locales/ro.json';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
// footerLinks retained for any legacy sections; dynamic nav below supersedes for header pages
import { footerLinks } from '@/lib/data';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const titleRef = useRef(null);
  const isInView = useInView(titleRef, { once: true, margin: '-100px' });

  // Language + navigation logic (mirrors header, simplified)
  const pathname = usePathname() || '';
  const locales: Record<string, any> = { ro, en, ru };
  const langMatch = pathname.match(/^\/(ro|en|ru)(?:\/|$)/i);
  const currentLanguage = (langMatch ? langMatch[1] : 'ro').toLowerCase();
  const translations = locales[currentLanguage] || ro;

  // Build nav pages (titles only, no descriptions/images)
  const navGroups = useMemo(() => {
    const nav = translations?.Header?.nav || {};
    const items = nav.items || {};
    const prefix = `/${currentLanguage}`;
    const resources = [
      { label: items.blog, href: `${prefix}/blog` },
      { label: items.news, href: `${prefix}/news` },
      { label: items.guides, href: `${prefix}/guides` },
      { label: items.documentation, href: `${prefix}/documentation` },
      { label: items.faq, href: `${prefix}/faq` },
      { label: items.roiCalculator, href: `${prefix}/roi-calculator` },
    ].filter(x => x.label);
    const company = [
      { label: items.about, href: `${prefix}/about` },
      { label: items.career, href: `${prefix}/carier` },
      { label: items.partners, href: `${prefix}/parteneri` },
      { label: items.trustCenter, href: `${prefix}/trustcenter` },
      { label: items.contacts, href: `${prefix}/contact` },
    ].filter(x => x.label);
    const more = [
      { label: nav.integrations, href: `${prefix}/integrations` },
      { label: nav.pricing, href: `${prefix}/pricing` },
    ].filter(x => x.label);
    return [
      { heading: nav.resources || 'Resources', items: resources },
      { heading: nav.company || 'Company', items: company },
      { heading: 'More', items: more },
    ];
  }, [translations, currentLanguage]);

  return (
    <footer className="bg-black text-white py-12 md:py-16 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="w-full flex flex-col items-center mb-10">
          <motion.h2
            ref={titleRef}
            initial={{ opacity: 0, y: -60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="text-6xl md:text-9xl font-extrabold text-white text-center tracking-tight mb-2"
          >
            Bravin AI
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-14">
          {/* Brand + newsletter (kept minimal black/white) */}
          <div className="sm:col-span-2 lg:col-span-2">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={translations?.common?.enterEmail || 'Email'}
                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-black border border-white/25 rounded-md text-white placeholder-white/40 focus:outline-none focus:border-white/50 text-sm md:text-sm"
              />
              <button
                type="submit"
                className="px-4 md:px-6 py-2 md:py-2.5 bg-white text-black rounded-md font-semibold tracking-tight text-sm md:text-sm transition-colors duration-200 hover:bg-white/90"
              >
                {subscribed ? (translations?.common?.thankYou || 'Thanks!') : (translations?.common?.subscribe || 'Subscribe')}
              </button>
            </form>
          </div>

          {/* Dynamic navigation groups from Header */}
          {navGroups.map(group => (
            <div key={group.heading} className="min-w-[140px]">
              <h3 className="font-semibold mb-3 text-base md:text-lg tracking-tight text-white/90">{group.heading}</h3>
              <ul className="space-y-2">
                {group.items.map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block text-sm md:text-base text-white/55 hover:text-white transition-colors duration-150 tracking-tight"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs md:text-sm tracking-tight">
            © {new Date().getFullYear()} Bravin AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/terms" className="text-white/55 hover:text-white text-xs md:text-sm">Terms</a>
            <a href="/privacy" className="text-white/55 hover:text-white text-xs md:text-sm">Privacy</a>
            <a href="/cookies" className="text-white/55 hover:text-white text-xs md:text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
