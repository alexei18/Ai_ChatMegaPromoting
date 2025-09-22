import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust Center - Bravin AI Mega Promoting',
  description: 'Securitate, conformitate și transparență în serviciile Bravin AI Mega Promoting.',
};

export default function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              Trust Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transparență completă despre securitatea, conformitatea și practicile noastre 
              de protecție a datelor.
            </p>
          </div>

          {/* Security Overview */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Securitate Enterprise
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-xl">SSL</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Criptare End-to-End</h3>
                <p className="text-gray-600">
                  Toate datele sunt criptate cu AES-256 în tranzit și în repaus, 
                  garantând protecția maximă.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-xl">ISO</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Certificări ISO</h3>
                <p className="text-gray-600">
                  Conformitate cu standardele ISO 27001 pentru managementul 
                  securității informațiilor.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <span className="text-black font-bold text-xl">24/7</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Monitorizare 24/7</h3>
                <p className="text-gray-600">
                  Echipă dedicată de securitate care monitorizează sistemele 
                  permanent pentru amenințări.
                </p>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Conformitate și Certificări
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-sm">GDPR</span>
                </div>
                <h3 className="font-bold text-black mb-2">GDPR</h3>
                <p className="text-sm text-gray-600">
                  Conformitate completă cu Regulamentul European de Protecție a Datelor
                </p>
                <span className="inline-block bg-black text-white px-3 py-1 rounded-lg text-xs mt-3">
                  Certificat
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-sm">SOC</span>
                </div>
                <h3 className="font-bold text-black mb-2">SOC 2 Type II</h3>
                <p className="text-sm text-gray-600">
                  Audit independent al controalelor de securitate și disponibilitate
                </p>
                <span className="inline-block bg-black text-white px-3 py-1 rounded-lg text-xs mt-3">
                  Certificat
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-sm">MD</span>
                </div>
                <h3 className="font-bold text-black mb-2">Legea MD</h3>
                <p className="text-sm text-gray-600">
                  Conformitate cu legislația de protecție a datelor din Moldova
                </p>
                <span className="inline-block bg-black text-white px-3 py-1 rounded-lg text-xs mt-3">
                  Conform
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-sm">PCI</span>
                </div>
                <h3 className="font-bold text-black mb-2">PCI DSS</h3>
                <p className="text-sm text-gray-600">
                  Standard de securitate pentru procesarea plăților cu card
                </p>
                <span className="inline-block bg-gray-200 text-black px-3 py-1 rounded-lg text-xs mt-3">
                  În progres
                </span>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="bg-black rounded-lg p-12 text-white mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Protecția Datelor
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-6">Principiile Noastre:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Transparență:</strong> Îți spunem exact ce date colectăm și cum le folosim
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Control:</strong> Ai controlul complet asupra datelor tale
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Minimalism:</strong> Colectăm doar datele strict necesare
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Securitate:</strong> Protejăm datele cu cele mai înalte standarde
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6">Drepturile Tale:</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Acces:</strong> Vezi toate datele pe care le avem despre tine
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Rectificare:</strong> Corectează orice informație incorectă
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Ștergere:</strong> Solicită ștergerea datelor personale
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 mr-3"></div>
                    <span className="text-gray-300">
                      <strong className="text-white">Portabilitate:</strong> Exportă datele în format utilizabil
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Infrastructure Security */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Securitatea Infrastructurii
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-black mb-6">Cloud Security</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Provideri cloud:</span>
                    <span className="font-semibold text-black">AWS, Google Cloud</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Backup-uri:</span>
                    <span className="font-semibold text-black">Zilnice, multiple zone</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-semibold text-black">99.9% SLA</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Disaster Recovery:</span>
                    <span className="font-semibold text-black">&lt; 4 ore RTO</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-black mb-6">Application Security</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Penetration testing:</span>
                    <span className="font-semibold text-black">Trimestrial</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vulnerability scanning:</span>
                    <span className="font-semibold text-black">Zilnic</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Code reviews:</span>
                    <span className="font-semibold text-black">100% acoperire</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security updates:</span>
                    <span className="font-semibold text-black">24 ore maxim</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Response */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Răspuns la Incidente
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-bold text-black mb-2">Detectare</h3>
                <p className="text-sm text-gray-600">
                  Sisteme automate de monitorizare detectează anomaliile în timp real.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-bold text-black mb-2">Analiza</h3>
                <p className="text-sm text-gray-600">
                  Echipa de securitate analizează impactul și determină măsurile necesare.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-bold text-black mb-2">Conținere</h3>
                <p className="text-sm text-gray-600">
                  Implementarea imediată a măsurilor de conținere a incidentului.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="font-bold text-black mb-2">Comunicare</h3>
                <p className="text-sm text-gray-600">
                  Notificarea clienților și autorităților conform cerințelor legale.
                </p>
              </div>
            </div>
          </div>

          {/* Reports and Audits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Rapoarte și Audituri
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-4">Rapoarte de Securitate</h3>
                <p className="text-gray-600 mb-4">
                  Rapoarte trimestriale despre starea securității și eventualele incidente.
                </p>
                <button className="text-black hover:text-gray-600 font-semibold">
                  Descarcă ultimul raport
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-4">Certificări Actuale</h3>
                <p className="text-gray-600 mb-4">
                  Vezi toate certificările și standardele de conformitate actuale.
                </p>
                <button className="text-black hover:text-gray-600 font-semibold">
                  Vezi certificările
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-4">Audit Trail</h3>
                <p className="text-gray-600 mb-4">
                  Acces la jurnalele de audit pentru administratorii de sistem.
                </p>
                <button className="text-black hover:text-gray-600 font-semibold">
                  Acces securizat
                </button>
              </div>
            </div>
          </div>

          {/* Contact for Security */}
          <div className="text-center bg-black rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ai întrebări despre securitate?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Echipa noastră de securitate este disponibilă pentru orice întrebare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Contactează echipa de securitate
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Raportează o vulnerabilitate
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-400">
              <p>Pentru raportarea vulnerabilităților: security@aichat.md</p>
              <p>Răspundem în maxim 24 de ore la toate rapoartele de securitate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
