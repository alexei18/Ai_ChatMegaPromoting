import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentație - Bravin AI Mega Promoting',
  description: 'Documentație tehnică completă pentru dezvoltatori și administratori Bravin AI.',
};

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              Documentație
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Resurse complete pentru dezvoltatori și administratori
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-black mb-4">Categorii</h3>
                <nav className="space-y-2">
                  <a href="#getting-started" className="block p-3 text-black bg-gray-200 rounded-lg font-medium">
                    Început rapid
                  </a>
                  <a href="#api" className="block p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    API Reference
                  </a>
                  <a href="#integration" className="block p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    Integrări
                  </a>
                  <a href="#customization" className="block p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    Personalizare
                  </a>
                  <a href="#security" className="block p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    Securitate
                  </a>
                  <a href="#troubleshooting" className="block p-3 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                    Depanare
                  </a>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-12">
                {/* Getting Started Section */}
                <section id="getting-started" className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-black mb-6">Început Rapid</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-3">1. Configurarea Inițială</h3>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <code className="text-sm text-black">
                          {`npm install @aichat/sdk
import { AIChat } from '@aichat/sdk';

const chat = new AIChat({
  apiKey: 'your-api-key',
  projectId: 'your-project-id'
});`}
                        </code>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-black mb-3">2. Integrarea de Bază</h3>
                      <p className="text-gray-600 mb-4">
                        Adaugă widget-ul Bravin AI pe website-ul tău în doar câteva linii de cod:
                      </p>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <code className="text-sm text-black">
                          {`<script src="https://cdn.aichat.md/widget.js"></script>
<script>
  AIChat.init({
    apiKey: 'your-api-key'
  });
</script>`}
                        </code>
                      </div>
                    </div>
                  </div>
                </section>

                {/* API Reference Section */}
                <section id="api" className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-black mb-6">API Reference</h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-black pl-4">
                      <h3 className="text-xl font-semibold text-black mb-2">POST /api/chat/send</h3>
                      <p className="text-gray-600 mb-4">Trimite un mesaj către Bravin AI</p>
                      
                      <h4 className="font-semibold text-black mb-2">Parametrii:</h4>
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <code className="text-sm text-black">
                          {`{
  "message": "string",
  "conversationId": "string",
  "userId": "string"
}`}
                        </code>
                      </div>

                      <h4 className="font-semibold text-black mb-2">Răspuns:</h4>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <code className="text-sm text-black">
                          {`{
  "response": "string",
  "conversationId": "string",
  "timestamp": "ISO string"
}`}
                        </code>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Integration Section */}
                <section id="integration" className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                  <h2 className="text-3xl font-bold text-black mb-6">Integrări Populare</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-gray-300 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-black font-bold">WP</span>
                        </div>
                        <h3 className="text-lg font-semibold text-black">WordPress</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Plugin oficial pentru WordPress</p>
                      <button className="text-black hover:text-gray-600 font-medium">
                        Vezi documentația
                      </button>
                    </div>

                    <div className="border border-gray-300 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-black font-bold">MG</span>
                        </div>
                        <h3 className="text-lg font-semibold text-black">Magento</h3>
                      </div>
                      <p className="text-gray-600 mb-4">Extensie pentru magazinele online</p>
                      <button className="text-black hover:text-gray-600 font-medium">
                        Vezi documentația
                      </button>
                    </div>
                  </div>
                </section>

                {/* Call to Action */}
                <div className="bg-black rounded-lg p-8 text-white">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">
                      Ai nevoie de ajutor suplimentar?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                      Echipa noastră de suport este aici să te ajute
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        Contactează suportul
                      </button>
                      <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                        Vezi exemplele
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
