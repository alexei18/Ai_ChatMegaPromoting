"use client";

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';

export default function PricingClient() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [yearly, setYearly] = useState(false);

  // ————————————————————————————————————————————————————————————————
  // NEW: rawPlans restructured ONLY for the FIRST CONTAINER (cards grid)
  // Matches the two reference images exactly for Monthly vs Annual
  // Fields per plan:
  // - badgeLeft: small tag in left (e.g. "Plan Basic", "Plan Recomandat", "Cere ofertă")
  // - monthly / yearly: variant blocks with price, strikePrice (optional), discountPill (optional),
  //   priceSuffix, bottomNote (e.g. "Se achită anual") and features (kept as-is)
  // - recommend: highlights Pro with yellow CTA + thicker look
  // - theme: card color scheme ("light" | "dark" | "muted") remains supported
  // ————————————————————————————————————————————————————————————————
  const rawPlans = useMemo(
    () => [
      {
        id: 'starter',
        name: 'Starter',
        badgeLeft: 'Plan Basic',
        description:
          'Ideal pentru testarea platformei și automatizarea interacțiunilor de bază.',
        monthly: {
          price: 49,
          strikePrice: null,
          discountPill: null,
          priceSuffix: '/ Lunar',
          bottomNote: null,
        },
        yearly: {
          price: 40,
          strikePrice: 49,
          discountPill: '2 luni gratis', // green in design
          priceSuffix: '/ Lunar',
          bottomNote: 'Se achită anual',
        },
        features: [
          '2.000 credite pentru mesaje/lună',
          '15.000 simboluri instrucțiuni',
          'Integrare rapidă cu orice platformă disponibilă',
          'Automatizare inteligentă: mesaje de follow‑up, scorarea lead‑urilor și generare de imagini personalizate',
          'Răspunsuri automate 24/7 pentru întrebări frecvente, reducând timpul de așteptare al clienților',
          'Suport tehnic lunar pentru a vă ajuta să configurați și să optimizați chatbot‑ul',
          'Actualizări regulate pentru a menține performanța și securitatea chatbot‑ului la nivel maxim',
          'Rapoarte de bază privind interacțiunile clienților, pentru a înțelege mai bine nevoile lor',
          'Acces nelimitat la personalizare, cu opțiuni de ajustare a scenariilor de bază și nu doar',
        ],
        cta: 'Începeți',
        theme: 'light' as const,
      },
      {
        id: 'professional',
        name: 'Profesional',
        badgeLeft: 'Recomandat',
        description:
          'Pentru afaceri în creștere care au nevoie de funcționalitate avansată.',
        monthly: {
          price: 105,
          strikePrice: 150, // small gray strike in image
          discountPill: 'Prima lună – 30%', // yellow pill
          priceSuffix: '/ Lunar',
          bottomNote: null,
        },
        yearly: {
          price: 120,
          strikePrice: 150,
          discountPill: '2 luni gratis',
          priceSuffix: '/ Lunar',
          bottomNote: 'Se achită anual',
        },
        features: [
          '10.000 credite pentru mesaje/lună',
          '30.000 simboluri instrucțiuni',
          'Toate funcțiile din pachetul Standard, plus gestionare avansată a fluxului mediu de clienți',
          'Personalizare completă a chatbot‑ului: ajustați tonul, limbajul și scenariile pentru brandul dvs',
          'Răspunsuri AI îmbunătățite, cu precizie ridicată pentru întrebări complexe, disponibil 24/7',
          'Integrări API pentru conectarea cu alte platforme, cum ar fi CRM‑uri sau sisteme de ecommerce',
          'Analize detaliate ale interacțiunilor, inclusiv tendințe și rapoarte personalizate lunare',
          'Suport priorititar pentru configurare și soluționarea problemelor, cu răspuns în 24 de ore',
          'Opțiuni de clonare a vocii pentru mesaje vocale personalizate, pentru o experiență unică a clienților',
        ],
        cta: 'Începeți',
        theme: 'light' as const,
        recommend: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        badgeLeft: 'Cere ofertă',
        description:
          'Soluție personalizată pentru dezvoltatori, cu suport și servicii premium.',
        monthly: {
          price: 499,
          strikePrice: null,
          discountPill: null,
          priceSuffix: '/ Lunar',
          bottomNote: null,
        },
        yearly: {
          price: 400,
          strikePrice: 499,
          discountPill: '2 luni gratis',
          priceSuffix: '/ Lunar',
          bottomNote: 'Se achită anual',
        },
        features: [
          '50.000 credite pentru mesaje/lună',
          '50.000 simboluri instrucțiuni',
          'Toate funcțiile din pachetul Ultra, plus capacitate maximă pentru gestionarea traficului global',
          'Integrări personalizate cu sistemele dvs',
          'Răspunsuri AI ultra‑precise, adaptate pentru limbaje multiple și dialecte regionale',
          'Analize avansate în timp real, cu predicții bazate pe IA pentru tendințele clienților',
          'Suport premium, inclusiv training pentru echipa dvs. de administrare',
          'Opțiuni de scalare nelimitată, pentru a suporta creșterea rapidă a interacțiunilor',
          'Garanție de performanță, cu uptime de 99,9% și backup automat pentru date',
        ],
        cta: 'Începeți',
        theme: 'light' as const,
      },
    ],
    []
  );

  const plans = useMemo(() => {
    return rawPlans.map((p) => ({
      ...p,
      active: yearly ? p.yearly : p.monthly,
      cycleBadge: yearly ? 'Anual' : 'Lunar',
    }));
  }, [rawPlans, yearly]);

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10 md:mb-14"
      >
        <span className="mt-16 inline-block text-xs font-semibold tracking-wider uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Pricing</span>
        <h1 className="mt-8 text-4xl lg:text-6xl font-extrabold text-black leading-[1.05]">
          Prețuri Simple și Transparente
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Alege planul care se potrivește cel mai bine nevoilor afacerii tale. Fără costuri ascunse, fără contracte pe termen lung.
        </p>

        {/* Toggle */}
        <div className="mt-6 flex justify-center items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full p-1 bg-gray-100 border border-gray-200">
            <button
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${!yearly ? 'bg-white text-black shadow-sm' : 'text-gray-600'}`}
              onClick={() => setYearly(false)}
            >
              Lunar
            </button>
            <button
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${yearly ? 'bg-black text-white' : 'text-gray-600'}`}
              onClick={() => setYearly(true)}
            >
              Anual (−20%)
            </button>
          </div>
        </div>
      </motion.div>

      {/* ——————————————————————————————————————————————————————————— */}
      {/* FIRST CONTAINER (updated cards) */}
      <div className="rounded-3xl bg-gray-50 border border-gray-200 p-4 md:p-6 mb-16 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-6 justify-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 35 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
              transition={{ duration: 0.6, delay: 0.05 * idx }}
              className={[
                  'relative flex flex-col rounded-2xl border p-7 md:p-8 bg-white text-black',
                  'min-h-[540px]',
                  plan.recommend ? 'border-black' : 'border-gray-200',
                ].join(' ')}
            >
              {/* BADGES — centered at top with decorative oval */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex items-center gap-3 z-10">
                <span className={[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  plan.recommend ? 'bg-black text-white ring-2 ring-black' : 'bg-gray-200 text-black',
                ].join(' ')}>
                  {plan.badgeLeft}
                </span>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-[11px] font-medium">
                  {plan.cycleBadge}
                </span>
              </div>

              {/* Content (fills available space) */}
              <div className="flex flex-col flex-1">
                {/* Header */}
                <div className="text-left mb-6">
                  <h3 className="text-2xl font-extrabold mb-2 text-black">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price block (with strike & discount pill) */}
                <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {plan.active.strikePrice && (
                    <span className="text-gray-400 line-through text-lg">${plan.active.strikePrice}</span>
                  )}
                  {plan.active.discountPill && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${yearly ? 'bg-[#fff200] text-black' : 'bg-[#fff200] text-black'}`}>
                      {plan.active.discountPill}
                    </span>
                  )}
                </div>
                <div className="leading-none">
                  <span className="text-5xl font-extrabold text-black">${plan.active.price}</span>
                  <span className="ml-2 text-sm text-gray-600">{plan.active.priceSuffix}</span>
                </div>
                {plan.active.bottomNote && (
                  <div className="text-xs text-gray-500 mt-1">{plan.active.bottomNote}</div>
                )}
              </div>

                {/* Features */}
                <ul className="space-y-2 text-gray-700 flex-1">
                {plan.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-black font-bold text-base leading-none select-none">+</span>
                    <span className="text-sm leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              </div>

              {/* CTA (stays at the bottom) */}
              <div className="mt-auto">
                <button
                  className={[
                    'w-full py-3.5 rounded-full font-semibold border transition',
                    plan.recommend
                      ? 'bg-[#fff200] text-black border-black hover:brightness-95'
                      : 'bg-white text-black border-black hover:bg-gray-100 hover:text-black',
                  ].join(' ')}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Add‑ons */}
      <SectionTitle title="Servicii Suplimentare" subtitle="Extinde capabilitățile, pe măsura creșterii" />
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { t: 'Conversații Extra', d: 'Pentru când depășești limita planului tău', p: '0.15 MDL', s: 'per conversație suplimentară' },
          { t: 'Implementare Premium', d: 'Configurare completă și training pentru echipa ta', p: '2,500 MDL', s: 'tarif unic' },
          { t: 'Integrări Personalizate', d: 'Dezvoltare de integrări specifice nevoilor tale', p: 'De la 5,000 MDL', s: 'în funcție de complexitate' },
        ].map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm"
          >
            <h3 className="text-xl font-bold text-black mb-2">{a.t}</h3>
            <p className="text-gray-600 mb-4">{a.d}</p>
            <div className="text-2xl font-extrabold text-black mb-1">{a.p}</div>
            <p className="text-sm text-gray-500">{a.s}</p>
          </motion.div>
        ))}
      </div>

      {/* Comparison */}
      <SectionTitle title="Comparația Detaliată" />
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-16">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                {['Funcționalități','Starter','Professional','Business','Enterprise'].map((h) => (
                  <th key={h} className="text-left md:text-center p-4 font-bold text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Conversații/lună','1,000','5,000','15,000','Nelimitate'],
                ['Număr chatbots','1','3','10','Nelimitate'],
                ['Suport 24/7','-','-','✓','✓'],
                ['Manager de cont','-','-','✓','✓'],
                ['White‑label','-','-','Opțional','✓'],
              ].map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-gray-200">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className={`p-4 ${cIdx===0 ? 'text-black text-left' : 'text-gray-700 text-center'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <SectionTitle title="Întrebări despre Prețuri" />
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          ['Există o perioadă de testare gratuită?','Da, oferim 14 zile de testare gratuită pentru toate planurile, fără să fie necesare detalii de plată.'],
          ['Pot schimba planul oricând?','Absolut! Poți face upgrade sau downgrade oricând. Modificările se aplică la următoarea facturare.'],
          ['Ce se întâmplă dacă depășesc limita de conversații?','Conversațiile suplimentare se taxează la 0.15 MDL per conversație, sau poți face upgrade la un plan superior.'],
          ['Acceptați diferite metode de plată?','Da, acceptăm carduri de credit/debit, transfer bancar și facturare pentru companii.'],
        ].map(([q, a], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.45, delay: i * 0.04 }}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-black mb-2">{q}</h3>
            <p className="text-gray-700">{a}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA final */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-12 bg-black text-white text-center"
      >
        {/* glow */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_60%)]">
          <div className="absolute -inset-40 bg-[conic-gradient(from_90deg_at_50%_50%,#fff200,transparent,transparent)] opacity-20 animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-extrabold mb-2">Gata să începi?</h2>
        <p className="text-lg text-gray-300 mb-6">Testează gratuit 14 zile și vezi diferența pe care o poate face Bravin AI</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">Începe testarea gratuită</button>
          <button className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition">Vorbește cu un expert</button>
        </div>
      </motion.div>
    </div>
  );
}

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-8 md:mb-10">
      <h2 className="text-3xl font-extrabold text-black">{title}</h2>
      {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
    </div>
  );
}

// Animated background is rendered by the server component to avoid client/import issues
