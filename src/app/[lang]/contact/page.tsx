import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Bravin AI Mega Promoting',
  description: 'Contactează echipa Bravin AI Mega Promoting. Suntem aici să răspundem la întrebările tale.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              Contactează-ne
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Suntem aici să te ajutăm să transformi comunicarea cu clienții tăi. 
              Alege modalitatea de contact care îți convine cel mai bine.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-16">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-black mb-6">
                  Trimite-ne un mesaj
                </h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Nume *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Numele tău"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">
                        Prenume *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                        placeholder="Prenumele tău"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="+373 XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Compania
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                      placeholder="Numele companiei"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Tipul solicitării *
                    </label>
                    <select
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    >
                      <option value="">Selectează tipul solicitării</option>
                      <option value="demo">Programare demo</option>
                      <option value="pricing">Informații despre prețuri</option>
                      <option value="support">Suport tehnic</option>
                      <option value="partnership">Parteneriat</option>
                      <option value="other">Altele</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Mesajul tău *
                    </label>
                    <textarea
                      required
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                      placeholder="Descrie-ne cum te putem ajuta..."
                    ></textarea>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="privacy"
                      required
                      className="mt-1"
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      Sunt de acord cu <a href="/privacy" className="text-black hover:underline">politica de confidențialitate</a> și 
                      consimț la prelucrarea datelor personale în scopul răspunsului la solicitarea mea.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Trimite mesajul
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  Informații de contact
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mt-1">
                      <span className="text-xs font-bold text-black">@</span>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Email</p>
                      <p className="text-gray-600">contact@aichat.md</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mt-1">
                      <span className="text-xs font-bold text-black">T</span>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Telefon</p>
                      <p className="text-gray-600">+373 XX XXX XXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mt-1">
                      <span className="text-xs font-bold text-black">L</span>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Adresa</p>
                      <p className="text-gray-600">
                        str. Tighina 47/1<br />
                        MD-2001, Chișinău, Moldova
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mt-1">
                      <span className="text-xs font-bold text-black">H</span>
                    </div>
                    <div>
                      <p className="font-semibold text-black">Program</p>
                      <p className="text-gray-600">
                        Luni - Vineri: 09:00 - 18:00<br />
                        Sâmbătă: 10:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  Acțiuni rapide
                </h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-left">
                    Programează o demo
                  </button>
                  
                  <button className="w-full border-2 border-black text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-left">
                    Descarcă broșura
                  </button>
                  
                  <button className="w-full border-2 border-gray-300 text-black py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-left">
                    Calculează ROI
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-black mb-4">
                  Urmărește-ne
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gray-200 hover:bg-gray-300 text-black p-3 rounded-lg font-semibold transition-colors">
                    LinkedIn
                  </button>
                  
                  <button className="bg-gray-200 hover:bg-gray-300 text-black p-3 rounded-lg font-semibold transition-colors">
                    Facebook
                  </button>
                  
                  <button className="bg-gray-200 hover:bg-gray-300 text-black p-3 rounded-lg font-semibold transition-colors">
                    Twitter
                  </button>
                  
                  <button className="bg-gray-200 hover:bg-gray-300 text-black p-3 rounded-lg font-semibold transition-colors">
                    YouTube
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">
              Întrebări Frecvente
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-3">
                  Cât de repede primiți răspuns la o solicitare?
                </h3>
                <p className="text-gray-600">
                  Răspundem la toate solicitările în maxim 24 de ore în zilele lucrătoare. 
                  Pentru urgențe, ne poți contacta telefonic.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-3">
                  Oferiți consultanță gratuită?
                </h3>
                <p className="text-gray-600">
                  Da, oferim o consultanță inițială gratuită de 30 de minute pentru 
                  a înțelege nevoile afacerii tale.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-3">
                  Pot programa o demonstrație personalizată?
                </h3>
                <p className="text-gray-600">
                  Absolut! Programăm demonstrații personalizate pentru a îți arăta 
                  cum Bravin AI poate fi adaptat pentru afacerea ta.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-black mb-3">
                  Oferiți suport în limba română?
                </h3>
                <p className="text-gray-600">
                  Da, întreaga echipă de suport vorbește fluent româna și poate 
                  oferi asistență completă în limba noastră.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-black rounded-lg p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Situație de urgență?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Pentru probleme critice care afectează sistemul în producție, 
              ne poți contacta 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Suport de urgență
              </button>
              <a 
                href="tel:+37312345678" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors inline-block"
              >
                +373 XX XXX XXX
              </a>
            </div>
            
            <div className="mt-8 text-sm text-gray-400">
              <p>Timpul mediu de răspuns pentru urgențe: &lt; 30 minute</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
