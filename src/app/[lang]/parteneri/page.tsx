import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Parteneri - Bravin AI Mega Promoting',
  description: 'Devine partener Bravin AI și ajută businessurile să transforme comunicarea cu clienții prin tehnologii AI.',
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Programul de Parteneri
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Alătură-te rețelei noastre de parteneri și dezvoltă-ți businessul 
              oferind soluții Bravin AI clienților tăi
            </p>
          </div>

          {/* Partner Types */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reseller Partner</h2>
              <p className="text-gray-600 mb-6">
                Vinde direct soluțiile Bravin AI clienților tăi și câștigă comisioane atractive
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Comision 25-40% din vânzări
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Training și certificare gratuită
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Suport tehnic dedicat
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Materiale de marketing
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Aplică acum
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-4 border-purple-200">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏢</span>
              </div>
              <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
                RECOMANDAT
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">System Integrator</h2>
              <p className="text-gray-600 mb-6">
                Integrează Bravin AI în proiectele tale complexe și oferă soluții complete
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Discount 30-50% volum mare
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  API access complet
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  White-label options
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Technical Account Manager
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Aplică acum
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Referral Partner</h2>
              <p className="text-gray-600 mb-6">
                Recomandă Bravin AI și primește comisioane pentru fiecare client referit
              </p>
              <ul className="text-left space-y-2 mb-8">
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  15% comision recurring
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Tracking automat referrals
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Dashboard dedicat
                </li>
                <li className="flex items-center text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  Plăți lunare garantate
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                Aplică acum
              </button>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              De Ce să Devii Partener Bravin AI?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-2">Venituri Recurring</h3>
                <p className="text-blue-100 text-sm">
                  Comisioane lunare din abonamentele active ale clienților
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-2">Piață în Creștere</h3>
                <p className="text-blue-100 text-sm">
                  Sectorul AI chatbot crește cu 25% anual în Europa
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Suport Complet</h3>
                <p className="text-blue-100 text-sm">
                  Training, marketing materials și suport tehnic incluse
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Brand Recunoscut</h3>
                <p className="text-blue-100 text-sm">
                  Asociază-te cu liderul în soluții Bravin AI din România
                </p>
              </div>
            </div>
          </div>

          {/* Current Partners */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Partenerii Noștri Actuali
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">TechCorp</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">TechCorp Solutions</h3>
                <p className="text-sm text-gray-600 mb-2">System Integrator</p>
                <div className="text-green-600 font-semibold">€50K+ vânzări/lună</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">WebPro</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">WebPro Agency</h3>
                <p className="text-sm text-gray-600 mb-2">Reseller Partner</p>
                <div className="text-green-600 font-semibold">€35K+ vânzări/lună</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">Digital</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Marketing Pro</h3>
                <p className="text-sm text-gray-600 mb-2">Reseller Partner</p>
                <div className="text-green-600 font-semibold">€25K+ vânzări/lună</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">Cloud</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">CloudTech Systems</h3>
                <p className="text-sm text-gray-600 mb-2">System Integrator</p>
                <div className="text-green-600 font-semibold">€40K+ vânzări/lună</div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Cerințe pentru Parteneri
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">📋 Cerințe Generale</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Experiență min. 2 ani în tech/software
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Portfolio de clienți existenți
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Echipă dedicată sales/support
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Cunoștințe de bază AI/chatbots
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-purple-600 mb-4">💼 Pentru System Integrators</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Experiență integrări enterprise
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Echipă tehnică certificată
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Vânzări min. €200K anual
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Referințe proiecte similare
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-green-600 mb-4">🎯 Pentru Resellers</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Network de clienți SME
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Experiență vânzări SaaS
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Target min. €50K primul an
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    Dedicare exclusivă Bravin AI
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Procesul de Aplicare
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aplicație Online</h3>
                <p className="text-gray-600 text-sm">
                  Completează formularul de parteneriat cu detaliile companiei
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluare Partener</h3>
                <p className="text-gray-600 text-sm">
                  Analizăm aplicația și verificăm referințele
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Întâlnire Strategică</h3>
                <p className="text-gray-600 text-sm">
                  Discutăm planurile de business și target-urile
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lansare Parteneriat</h3>
                <p className="text-gray-600 text-sm">
                  Semnare contract și training echipei tale
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-6">
              Gata să Devii Partener Bravin AI?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Alătură-te rețelei noastre de parteneri de succes și profită de 
              cea mai rapidă piață în creștere din tech
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
                Aplică pentru Parteneriat
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg">
                Descarcă Partener Kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
