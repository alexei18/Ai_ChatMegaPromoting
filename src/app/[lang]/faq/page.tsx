import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Bravin AI Mega Promoting',
  description: 'Răspunsuri la întrebările frecvente despre Bravin AI Mega Promoting.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              Întrebări Frecvente
            </h1>
            <p className="text-xl text-gray-600">
              Găsește răspunsuri rapide la întrebările tale
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold">
              General
            </button>
            <button className="bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Prețuri
            </button>
            <button className="bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Tehnic
            </button>
            <button className="bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Integrări
            </button>
            <button className="bg-gray-200 text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Suport
            </button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {/* General Questions */}
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Ce este Bravin AI Mega Promoting?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6">
                <p className="text-gray-600">
                  Bravin AI Mega Promoting este o platformă avansată de chatbot alimentat de inteligența artificială, 
                  proiectată să automatizeze comunicarea cu clienții și să optimizeze procesele de vânzări pentru 
                  afacerile din Moldova.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Cât timp durează implementarea?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Implementarea poate fi făcută în câteva minute cu widget-ul nostru simplu, 
                  sau în 1-2 săptămâni pentru integrări complexe personalizate.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Ce limbi sunt suportate?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Suportăm română, rusă și engleză nativ, cu posibilitatea de a adăuga și alte limbi 
                  în funcție de necesitățile afacerii tale.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Chatbot-ul poate procesa comenzi?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Da, chatbot-ul nostru poate fi integrat cu sistemele de e-commerce pentru a procesa 
                  comenzi, rezervări și plăți automat.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Datele clienților sunt securizate?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Absolut. Folosim criptare end-to-end și respectăm standardele GDPR pentru 
                  protecția datelor personale.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Pot personaliza aspectul chatbot-ului?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Da, poți personaliza complet designul, culorile, logo-ul și stilul conversației 
                  pentru a se potrivi cu brand-ul tău.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Ce fel de suport tehnic oferiți?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Oferim suport tehnic 24/7 prin chat, email și telefon. De asemenea, avem 
                  documentație detaliată și tutoriale video.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Există o perioadă de testare gratuită?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Da, oferim o perioadă de testare gratuită de 14 zile cu toate funcționalitățile 
                  incluse, fără să fie necesare detalii de plată.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <button className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-100 transition-colors">
                <h3 className="text-lg font-semibold text-black">
                  Pot integra chatbot-ul cu CRM-ul meu existent?
                </h3>
                <span className="text-2xl text-black">+</span>
              </button>
              <div className="px-6 pb-6 hidden">
                <p className="text-gray-600">
                  Da, avem integrări native cu majoritatea sistemelor CRM populare precum Salesforce, 
                  HubSpot, și oferim API pentru integrări personalizate.
                </p>
              </div>
            </div>
          </div>

          {/* Still have questions? */}
          <div className="mt-16 text-center bg-gray-50 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-black mb-4">
              Mai ai întrebări?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Echipa noastră de suport este gata să te ajute
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Contactează suportul
              </button>
              <button className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Programează o demonstrație
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
