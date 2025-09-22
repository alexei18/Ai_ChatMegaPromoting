import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Despre Noi - Bravin AI Mega Promoting',
  description: 'Află mai multe despre echipa și misiunea Bravin AI Mega Promoting.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              Despre Noi
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Suntem pionerii în automatizarea conversațiilor de afaceri din Moldova, 
              ajutând companiile să-și transforme comunicarea cu clienții prin inteligența artificială.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-black mb-6">
                  Misiunea Noastră
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Să democratizăm accesul la tehnologiile de inteligență artificială pentru afacerile 
                  din Moldova, permitându-le să ofere un serviciu clienți excepțional 24/7, 
                  să crească vânzările și să reducă costurile operaționale.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Credem că fiecare afacere, indiferent de mărime, merită să beneficieze de 
                  puterea conversațiilor automatizate inteligente.
                </p>
              </div>
              <div className="bg-gray-200 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-black mb-2">500+</div>
                  <p className="text-gray-600 mb-4">Afaceri transformate</p>
                  
                  <div className="text-4xl font-bold text-black mb-2">2M+</div>
                  <p className="text-gray-600 mb-4">Conversații procesate</p>
                  
                  <div className="text-4xl font-bold text-black mb-2">95%</div>
                  <p className="text-gray-600">Rata de satisfacție</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Povestea Noastră
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">2020</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Începuturile</h3>
                <p className="text-gray-600">
                  Am observat că multe afaceri din Moldova pierdeau clienți din cauza 
                  timpilor lungi de răspuns și a disponibilității limitate.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">2021</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Primul Produs</h3>
                <p className="text-gray-600">
                  Am lansat prima versiune a Bravin AI, focusându-ne pe conversații 
                  simple dar eficiente în limba română.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">2024</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-4">Prezentul</h3>
                <p className="text-gray-600">
                  Astăzi suntem liderul pieței de chatbots din Moldova, cu sute de 
                  afaceri mulțumite și tehnologie de ultimă generație.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-black rounded-lg p-12 text-white mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Valorile Noastre
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Inovație Continuă</h3>
                <p className="text-gray-300">
                  Investim constant în cercetare și dezvoltare pentru a oferi cele mai 
                  avansate soluții de inteligență artificială.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Suport Excepțional</h3>
                <p className="text-gray-300">
                  Echipa noastră de suport este disponibilă 24/7 pentru a se asigura că 
                  clienții noștri reușesc să-și atingă obiectivele.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Transparență</h3>
                <p className="text-gray-300">
                  Credem în comunicarea deschisă și onestă cu clienții noștri, 
                  fără costuri ascunse sau promisiuni nerealiste.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Focus pe Rezultate</h3>
                <p className="text-gray-300">
                  Succesul nostru se măsoară prin rezultatele pe care le obțin clienții 
                  noștri - mai multe vânzări, costuri reduse, clienți fericiți.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Echipa Noastră
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">AV</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Alexandru Vrabie</h3>
                <p className="text-gray-600 mb-4">CEO & Co-fondator</p>
                <p className="text-sm text-gray-600">
                  10+ ani experiență în tech, fost engineer la Google. Specializat în AI și machine learning.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">MP</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Maria Popescu</h3>
                <p className="text-gray-600 mb-4">CTO & Co-fondator</p>
                <p className="text-sm text-gray-600">
                  Expert în arhitectura software și scalabilitate. Fost tech lead la Microsoft.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-black">IG</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Ion Georgescu</h3>
                <p className="text-gray-600 mb-4">VP Sales & Marketing</p>
                <p className="text-sm text-gray-600">
                  15+ ani în vânzări B2B și marketing digital. Cunoscător profund al pieței locale.
                </p>
              </div>
            </div>
          </div>

          {/* Recognition Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-12 mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Recunoaștere & Premii
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold">1</span>
                </div>
                <h3 className="font-bold text-black mb-2">Startup of the Year</h3>
                <p className="text-sm text-gray-600">Moldova IT Awards 2022</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold">AI</span>
                </div>
                <h3 className="font-bold text-black mb-2">Best AI Solution</h3>
                <p className="text-sm text-gray-600">TechHub Moldova 2023</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold">TOP</span>
                </div>
                <h3 className="font-bold text-black mb-2">Top 10 Startups</h3>
                <p className="text-sm text-gray-600">Eastern Europe 2023</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold">5</span>
                </div>
                <h3 className="font-bold text-black mb-2">5-Star Rating</h3>
                <p className="text-sm text-gray-600">Google Reviews</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-black rounded-lg p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Vrei să afli mai multe?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Hai să discutăm cum putem ajuta afacerea ta să crească
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Contactează-ne
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Programează o întâlnire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
