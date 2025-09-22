'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ro from '@/locales/ro.json';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import { pricingPlansMonthly, pricingPlansYearly } from '@/lib/data';

/**
 * Replică layout-ul și estetica din imagine:
 * - Hero cu titlu foarte mare + subtitlu centrat
 * - 3 carduri aliniate, cu container soft-grey și carduri albe cu colțuri rotunjite 2xl
 * - Card "Recommended" centrat, puțin mai mare, cu accente galbene (#ffe900 aprox.) și buton galben
 * - Badge-uri mici în colțul stânga-sus ("Basic Plan", "Recommended Plan", "Enquire now" etc.)
 * - Cardul Enterprise cu look mai "muted"/grey și buton negru "Contact us"
 *
 * IMPORTANT: păstrează toate textele din codul original și structura/funcționalitatea (toggle Monthly/Yearly,
 * maparea din pricingPlansMonthly/pricingPlansYearly, animațiile framer-motion).
 */

// Subtle animated background for the Pricing section
function PricingBackgroundFX() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Faint grid layer */}
      <div className="absolute inset-0 opacity-[0.98]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.25) 1px, transparent 0)',
        backgroundSize: '28px 28px'
      }} />
      {/* Gradient blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-[340px] h-[340px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #fff200, rgba(255,242,0,0) 70%)',
          opacity: 0.35
        }}
        initial={{ scale: 0.9, x: 0, y: 0 }}
        animate={reduce ? {} : { scale: [0.9, 1.05, 0.9], x: [0, 20, 0], y: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-160px] right-[-140px] w-[420px] h-[420px] rounded-full blur-3xl"
        style={{
          background: 'radial-gradient(circle at 70% 70%, #ffe900, rgba(255,233,0,0) 70%)',
          opacity: 0.28
        }}
        initial={{ scale: 1.05, rotate: 0 }}
        animate={reduce ? {} : { scale: [1.05, 0.95, 1.05], rotate: [0, 10, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Soft vignette mask for focus center */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 55%, rgba(255,255,255,0.55) 90%)'
      }} />
    </div>
  );
}

export default function Pricing() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isYearly, setIsYearly] = useState(false);
  const currentPlans = isYearly ? pricingPlansYearly : pricingPlansMonthly;

  // Remove any plan named or identified as "business" from this page
  const visiblePlans = currentPlans.filter((p: any) => {
    const name = (p?.name || '').toString();
    const id = (p?.id || '').toString();
    return !/business/i.test(name) && !/business/i.test(id);
  });

  // i18n: detect language from pathname and load translations
  const pn = usePathname();
  const pathname = (pn as string) ?? (typeof window === 'undefined' ? '' : (globalThis as any)?.location?.pathname || '');
  const locales: Record<string, any> = { ro, en, ru };
  const match = pathname ? (pathname as string).match(/^\/([a-z]{2})(?:\/|$)/) : null;
  const currentLanguage = match && match[1] ? match[1] : 'ro';
  const translations = locales[currentLanguage] || ro;
  const pricingTranslations = translations?.PricingPage || {};

  // Helper: deduce niște stiluri pe baza plan.period / isPopular
  const isEnterprise = (plan: any) => plan.period === 'pricing' || /enterprise/i.test(plan?.name || '');

  return (
    <section ref={ref} className="relative min-h-screen bg-white py-16 md:py-24 flex items-start overflow-hidden">
      <PricingBackgroundFX />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-[40px] leading-[1.05] sm:text-6xl md:text-7xl font-extrabold tracking-tight text-black mb-5">
            {pricingTranslations.title || (
              <>Simple, <span className="inline-block bg-[linear-gradient(180deg,transparent_60%,#fff200_60%)]">Transparent</span> Pricing</>
            )}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            {pricingTranslations.subtitle || 'Start free, scale as you grow. No hidden fees, no surprises.'}
          </p>

          {/* Toggle Monthly / Yearly */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-3 rounded-full p-1 bg-gray-100 border border-gray-200">
              <button
                type="button"
                onClick={() => setIsYearly(false)}
                className={`px-4 py-1.5 text-sm md:text-base rounded-full transition ${!isYearly ? 'bg-white shadow-sm text-black' : 'text-gray-600'}`}
              >
                {pricingTranslations.toggle?.monthly || 'Monthly'}
              </button>
              <button
                type="button"
                onClick={() => setIsYearly(true)}
                className={`px-4 py-1.5 text-sm md:text-base rounded-full transition ${isYearly ? 'bg-black text-white' : 'text-gray-600'}`}
              >
                {pricingTranslations.toggle?.yearly || 'Yearly'}
              </button>
            </div>
            {isYearly && (
              <span className="ml-3 text-lg font-semibold text-black bg-[#fff200] rounded-full px-3 py-1 inline-flex items-center justify-center text-center">{pricingTranslations.toggle?.discount || '-20%'}</span>
            )}
          </div>
        </motion.div>

        {/* CARD WRAPPER BACKPLATE (soft grey) */}
        <div className="relative rounded-3xl bg-gray-50 border border-gray-200 p-4 md:p-6 overflow-hidden">
          {/* subtle inner highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(255,249,150,0.18), transparent 65%)' }} />
          {/* GRID/CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6">
            {visiblePlans.map((plan: any, index: number) => {
              const enterprise = isEnterprise(plan);
              const recommended = !!plan.isPopular;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.7, delay: index * 0.08 }}
                  className={[
                    'relative flex flex-col rounded-2xl border-2 bg-white p-7 md:p-9',
                    'min-h-[560px]',
                    recommended ? 'border-black shadow-[0_8px_30px_rgba(0,0,0,0.08)] xl:scale-[1.02]' : 'border-gray-200',
                    enterprise ? 'bg-gray-100' : 'bg-white',
                  ].join(' ')}
                >
                  {/* BADGES (center top) */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
                    {/* Badge principal - din starea planului */}
                    <span
                      className={[
                        'text-xs font-semibold px-3 py-1 rounded-full border',
                        recommended ? 'bg-[#fff200] border-gray-900' : 'bg-white border-gray-300',
                      ].join(' ')}
                    >
                      {recommended ? (pricingTranslations.badges?.recommended || 'Recommended Plan') : enterprise ? (pricingTranslations.badges?.enquire || 'Enquire now') : (pricingTranslations.badges?.basic || 'Basic Plan')}
                    </span>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-200 text-gray-700">
                      {isYearly ? (pricingTranslations.badges?.annual || 'Annual') : (pricingTranslations.toggle?.monthly || 'Monthly')}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col flex-1 pt-2">
                    {/* Title */}
                    <h3 className={`mb-1 font-extrabold ${enterprise ? 'text-4xl' : 'text-3xl'} text-black`}>{plan.name}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-7">
                      {plan.originalPrice && (
                        <div className="flex items-center mb-1.5">
                          <span className="text-base text-gray-500 line-through mr-2">{plan.originalPrice}</span>
                          {plan.badge && (
                            <span className="bg-green-100 text-green-800 text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                              {plan.badge}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-end gap-2">
                        <span className={`font-extrabold leading-none ${enterprise ? 'text-5xl' : 'text-5xl md:text-6xl'} text-black`}>
                          {plan.price}
                        </span>
                        {plan.period !== 'pricing' && (
                          <span className="text-gray-600 mb-1 text-sm md:text-base">/ {plan.period}</span>
                        )}
                      </div>
                      {plan.subText && (
                        <p className="text-gray-500 text-xs mt-1">{plan.subText}</p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-black font-bold text-base leading-none select-none">+</span>
                          <span className="text-gray-700 text-[12px] md:text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto relative">
                      <button
                        className={[
                          'w-full py-3 md:py-4 px-5 rounded-full font-semibold text-sm md:text-base transition border',
                          recommended
                            ? 'bg-[#fff200] border-black text-black hover:brightness-95'
                            : enterprise
                              ? 'bg-black text-white border-black hover:opacity-90'
                              : 'bg-white text-black border-black hover:bg-gray-100 hover:text-black',
                          'relative z-10',
                        ].join(' ')}
                        style={{ borderRadius: 9999 }}
                      >
                        {plan.ctaText}
                      </button>
                      {recommended && (
                        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 w-[90%] h-3 rounded-full rainbow-shadow z-0" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FOOTNOTE (call-to-action) */}
  <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10 md:mt-14 px-4"
        >
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-lg text-gray-700">{pricingTranslations.footerText || 'Vrei să afli mai multe despre planurile noastre și opțiunile disponibile?'}</div>
            <Link href={`/${currentLanguage}/pricing`} className="inline-flex items-center px-5 py-3 bg-black text-white rounded-full font-semibold hover:opacity-95">
              {pricingTranslations.footerButton || 'Vezi mai multe detalii'}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
