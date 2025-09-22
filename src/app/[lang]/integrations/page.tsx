import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Integrări - Bravin',
  description: 'Conectează Bravin cu platformele și sistemele pe care le folosești deja.',
};

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="container mx-auto px-4 pt-10 lg:pt-14">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          {/* Left copy */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2.5 py-1 bg-white shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Lansare Nouă
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-4">
              Bine ai venit la Bravin!
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl">
              Folosește uneltele noastre pentru a automatiza procesele și pentru a îmbunătăți interacțiunea cu clienții.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition">
                Începe acum
              </button>
              <button className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition">
                Află mai multe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Integrările Noastre */}
      <section className="container mx-auto px-4 py-14">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-black">Integrările Noastre</h2>
          <p className="text-gray-600 mt-3">
            Simplifică gestionarea proceselor de afaceri cu ajutorul integrărilor noastre. Conectează platforme populare precum Instagram, Telegram, Facebook și multe altele pentru a automatiza interacțiunea cu clienții.
          </p>
        </div>

        {/* Grid of cards – exactly ca în imagine: 6 cărți */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {[
            {
              icon: '📸',
              title: 'Instagram',
              desc: 'Conectează Instagram pentru a automatiza interacțiunile în mesajele private.',
              cta: 'Află mai multe',
            },
            {
              icon: '📘',
              title: 'Facebook',
              desc: 'Gestionează comentariile și mesajele prin Facebook.',
              cta: 'Află mai multe',
            },
            {
              icon: '📊',
              title: 'AmoCRM',
              desc: 'Automatizează vânzările cu AmoCRM.',
              cta: 'Află mai multe',
            },
            {
              icon: '📨',
              title: 'Telegram',
              desc: 'Conectează Telegram pentru automatizarea interacțiunilor cu clienții.',
              cta: 'Află mai multe',
            },
            {
              icon: '✨',
              title: 'Integrare cu 999.md',
              desc: 'Optimizează procesele cu ajutorul 999.md.',
              cta: 'Află mai multe',
            },
            {
              icon: '💬',
              title: 'Widget de Chat',
              desc: 'Adaugă un chat pe site-ul tău pentru comunicare directă cu clienții.',
              cta: 'Află mai multe',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-lg">
                  {card.title === 'Instagram' ? (
                    <Image src="/Integrations/InstagramLogo.png" alt="Instagram" width={40} height={40} className="w-full h-full object-contain" />
                  ) : card.title === 'Facebook' ? (
                    <Image src="/Integrations/FacebookLogo.png" alt="Facebook" width={40} height={40} className="w-full h-full object-contain" />
                  ) : card.title === 'Integrare cu 999.md' ? (
                    <Image src="/Integrations/999Logo.png" alt="999.md" width={40} height={40} className="w-full h-full object-contain" />
                  ) : card.title === 'Telegram' ? (
                    <Image src="/Integrations/TelegramLogo.png" alt="Telegram" width={40} height={40} className="w-full h-full object-contain" />
                  ) : card.title === 'AmoCRM' ? (
                    <Image src="/Integrations/AmoCRM-Logo.png" alt="AmoCRM" width={40} height={40} className="w-full h-full object-contain" />
                  ) : (
                    <span aria-hidden>{card.icon}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-black">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{card.desc}</p>
                  <button className="mt-4 inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-md bg-black text-white hover:bg-gray-800">
                    {card.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h3 className="text-2xl sm:text-3xl font-bold text-black">
            Începe să-ți dezvolți
            <br className="hidden sm:block" /> afacerea mai rapid
          </h3>
          <p className="text-gray-600 mt-3">
            Încearcă uneltele noastre pentru a crește eficiența. Descoperă cum îți pot îmbunătăți munca!
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button className="px-4 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition">
              Încearcă gratuit
            </button>
            <button className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold hover:bg-gray-100 transition">
              Află mai multe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}