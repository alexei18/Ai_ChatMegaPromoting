import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator ROI - Bravin AI Mega Promoting',
  description: 'Calculează returul investiției pentru implementarea Bravin AI în businessul tău.',
};

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Calculator ROI
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descoperă cât poți economisi cu Bravin AI în businessul tău
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Calculator Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Introdu datele businessului tău
              </h2>
              
              <form className="space-y-6">
                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mărimea companiei
                  </label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Selectează...</option>
                    <option value="startup">Startup (1-10 angajați)</option>
                    <option value="small">Mică (11-50 angajați)</option>
                    <option value="medium">Medie (51-200 angajați)</option>
                    <option value="large">Mare (200+ angajați)</option>
                  </select>
                </div>

                {/* Monthly Inquiries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Întrebări/lună de la clienți
                  </label>
                  <input 
                    type="number" 
                    placeholder="500"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Average Response Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timpul mediu de răspuns (minute)
                  </label>
                  <input 
                    type="number" 
                    placeholder="15"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Support Staff Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cost orare echipă suport (€)
                  </label>
                  <input 
                    type="number" 
                    placeholder="25"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Conversion Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rata de conversie actuală (%)
                  </label>
                  <input 
                    type="number" 
                    placeholder="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Average Order Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valoare medie comandă (€)
                  </label>
                  <input 
                    type="number" 
                    placeholder="150"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button 
                  type="button"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-lg"
                >
                  Calculează ROI
                </button>
              </form>
            </div>

            {/* Results Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-8">
                Rezultatele calculului tău
              </h2>
              
              <div className="space-y-6">
                {/* Monthly Savings */}
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">€3,250</div>
                  <div className="text-blue-100">Economii lunare cu Bravin AI</div>
                  <div className="text-sm text-blue-200 mt-2">
                    Reducerea costurilor cu personalul de suport
                  </div>
                </div>

                {/* Annual Savings */}
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">€39,000</div>
                  <div className="text-blue-100">Economii anuale</div>
                  <div className="text-sm text-blue-200 mt-2">
                    Total economii pe an cu Bravin AI
                  </div>
                </div>

                {/* ROI */}
                <div className="bg-white/10 rounded-xl p-6">
                  <div className="text-3xl font-bold mb-2">1,250%</div>
                  <div className="text-blue-100">ROI în primul an</div>
                  <div className="text-sm text-blue-200 mt-2">
                    Returnul investiției în Bravin AI
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="bg-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Beneficii adiționale:</h3>
                  <ul className="space-y-2 text-sm text-blue-100">
                    <li>✓ Răspunsuri instantanee 24/7</li>
                    <li>✓ Creșterea satisfacției clienților</li>
                    <li>✓ Reducerea timpului de așteptare</li>
                    <li>✓ Automatizarea sarcinilor repetitive</li>
                    <li>✓ Creșterea ratei de conversie cu 40%</li>
                  </ul>
                </div>
              </div>

              <button className="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-8">
                Începe perioada de încercare gratuită
              </button>
            </div>
          </div>

          {/* Industry Benchmarks */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Benchmarkuri pe industrii
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🛍️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">E-commerce</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">€2,800</div>
                  <div className="text-sm text-gray-500">economii medii/lună</div>
                  <div className="text-lg font-semibold text-green-600">ROI: 980%</div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Servicii Financiare</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">€4,200</div>
                  <div className="text-sm text-gray-500">economii medii/lună</div>
                  <div className="text-lg font-semibold text-green-600">ROI: 1,400%</div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏥</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sănătate</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">€3,500</div>
                  <div className="text-sm text-gray-500">economii medii/lună</div>
                  <div className="text-lg font-semibold text-green-600">ROI: 1,150%</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Gata să începi să economisești?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Testează Bravin AI gratuit 14 zile și vezi rezultatele în timp real
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all text-lg">
              Începe perioada de încercare
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
