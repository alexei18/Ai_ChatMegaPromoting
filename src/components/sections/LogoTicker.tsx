"use client";
import React from 'react';
import Image from 'next/image';
import roLocale from '../../locales/ro.json';
import enLocale from '../../locales/en.json';
import ruLocale from '../../locales/ru.json';

// Dynamic language detection based on URL path
function detectClientLang(): string {
  try {
    if (typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/').filter(Boolean)[0];
      if (seg && ['ro','en','ru'].includes(seg)) return seg;
    }
  } catch {}
  return 'ro';
}

const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale };
// NOTE: Do not call window-dependent logic here to keep SSR deterministic.

// Static logo wall (no motion) styled to match Clay-style compact section
// Replace the placeholder image paths with your 20 sponsor logos.

type Sponsor = {
  name: string;
  src: string;
  caseStudy?: boolean;
  customSize?: string; // custom size class for specific logos
};

const sponsors: Sponsor[] = [
  { name: 'MolarMed', src: '/Sponsors/sponsor-1.png', customSize: 'w-16 h-6' },
  { name: 'Aquadis', src: '/Sponsors/sponsor-2.png', customSize: 'w-28 h-20' },
  { name: 'Mealtime', src: '/Sponsors/sponsor-3.png', customSize: 'w-16 h-8' },
  { name: 'universul-ferestrelor', src: '/Sponsors/sponsor-4.png', customSize: 'w-16 h-6' },
  { name: 'Autoplaza', src: '/Sponsors/sponsor-5.png', customSize: 'w-25 h-9' },
  { name: 'Megadent', src: '/Sponsors/sponsor-6.png', customSize: 'w-16 h-6' },
  { name: 'Dentpark', src: '/Sponsors/sponsor-7.png', customSize: 'w-16 h-6' },
  { name: 'Impactacademies', src: '/Sponsors/sponsor-8.png', customSize: 'w-14 h-6' },
  { name: 'BygGym', src: '/Sponsors/sponsor-9.png', customSize: 'w-16 h-6' },
  { name: 'Valdimobila', src: '/Sponsors/sponsor-10.png', customSize: 'w-18 h-16' },
  { name: 'Acoperisassigur', src: '/Sponsors/sponsor-11.png', customSize: 'w-12 h-6' },
  { name: 'Munch', src: '/Sponsors/sponsor-12.png', customSize: 'w-16 h-6' },
  { name: 'Zavoiul_nistrului_insta', src: '/Sponsors/sponsor-13.png', customSize: 'w-10 h-6' },
  { name: 'Pizza9', src: '/Sponsors/sponsor-14.png', customSize: 'w-16 h-6' },
  { name: 'Casadellapizza', src: '/Sponsors/sponsor-15.png', customSize: 'w-12 h-6' },
  { name: 'Picoteo', src: '/Sponsors/sponsor-16.png', customSize: 'w-14 h-6' },
  { name: 'Django', src: '/Sponsors/sponsor-17.png', customSize: 'w-16 h-6' },
  { name: 'Sauto', src: '/Sponsors/sponsor-18.png', customSize: 'w-14 h-6' },
  { name: 'MyCleanShoes', src: '/Sponsors/sponsor-19.png', customSize: 'w-12 h-6' },
  { name: 'CipAuto', src: '/Sponsors/sponsor-20.png', customSize: 'w-16 h-6' },
];

const getDimensions = (customSize: string | undefined) => {
  let width = 96; // Default for w-24 (24 * 4)
  let height = 40; // Default for h-10 (10 * 4)

  if (customSize) {
    const widthMatch = customSize.match(/w-(\d+)/);
    const heightMatch = customSize.match(/h-(\d+)/);
    if (widthMatch) {
      width = parseInt(widthMatch[1]) * 4;
    }
    if (heightMatch) {
      height = parseInt(heightMatch[1]) * 4;
    }
  }
  return { width, height };
};

export default function LogoWall({ lang: langProp }: { lang?: string }) {
  const initial = (langProp && ['ro','en','ru'].includes(langProp)) ? langProp : 'ro';
  const [lang, setLang] = React.useState(initial);
  React.useEffect(() => {
    if (!langProp) {
      setLang(detectClientLang());
    }
  }, [langProp]);
  const translations = locales[lang]?.LogoTicker || locales['ro'].LogoTicker;
  return (
    <section className="bg-white py-10 md:py-10">
      <div className="w-full px-0 flex flex-col items-center">
        {/* Eyebrow + rating row (optional, easy to remove) */}
        <div className="text-center mb-8">
          <p className="uppercase tracking-[0.18em] text-[11px] font-semibold text-gray-700">
            {translations.usedBy}
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="text-yellow-400">★ ★ ★ ★ ★</span>
              <span>4.9 {translations.rating}</span>
            </span>
            <span>•</span>
            <span>{translations.supportedBy}</span>
          </div>
        </div>

        {/* Compact static grid */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 max-w-6xl mx-auto">
          {sponsors.map((s, idx) => {
            const { width, height } = getDimensions(s.customSize);
            return (
            <div key={idx} className="flex items-center justify-center">
              <div className="flex items-center justify-center">
                  {s.name === 'Pizza9' ? (
                    <Image
                      src={s.src}
                      alt={s.name}
                      width={width}
                      height={height}
                      className={`${['Aquadis','Mealtime','Autoplaza'].includes(s.name) ? s.customSize : (s.customSize ? s.customSize.replace(/w-\d+/,'w-24').replace(/h-\d+/,'h-10') : 'w-24 h-10') } object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200 -ml-3`}
                    />
                  ) : s.name === 'Zavoiul_nistrului_insta' ? (
                    <Image
                      src={s.src}
                      alt={s.name}
                      width={width}
                      height={height}
                      className={`${['Aquadis','Mealtime','Autoplaza'].includes(s.name) ? s.customSize : (s.customSize ? s.customSize.replace(/w-\d+/,'w-24').replace(/h-\d+/,'h-10') : 'w-24 h-10') } object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200 ml-3 scale-125`}
                    />
                  ) : s.name === 'Autoplaza' ? (
                    <Image
                      src={s.src}
                      alt={s.name}
                      width={width}
                      height={height}
                      className={`${['Aquadis','Mealtime','Autoplaza'].includes(s.name) ? s.customSize : (s.customSize ? s.customSize.replace(/w-\d+/,'w-24').replace(/h-\d+/,'h-10') : 'w-24 h-10') } object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200 scale-110`}
                    />
                  ) : (
                    <Image
                      src={s.src}
                      alt={s.name}
                      width={width}
                      height={height}
                      className={`${['Aquadis','Mealtime','Autoplaza','Valdimobila'].includes(s.name) ? s.customSize : (s.customSize ? s.customSize.replace(/w-\d+/,'w-24').replace(/h-\d+/,'h-10') : 'w-24 h-10') } object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-200`}
                    />
                  )}
              </div>
              {s.caseStudy && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  Case study
                </span>
              )}
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
