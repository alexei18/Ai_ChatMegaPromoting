import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Users, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Carieră - Alătură-te echipei noastre | Bravin AI',
  description: 'Descoperă oportunitățile de carieră la Bravin AI. Construiește viitorul inteligenței artificiale împreună cu noi.',
};

const jobOpenings = [
  {
    id: 1,
    title: 'AI Engineer',
    department: 'Engineering',
    location: 'Chișinău, Moldova',
    type: 'Full-time',
    experience: '3+ ani',
    description: 'Dezvoltă și implementează soluții AI inovatoare pentru clienții noștri.',
    requirements: ['Python/JavaScript', 'Machine Learning', 'API Development'],
  },
  {
    id: 2,
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ ani',
    description: 'Creează interfețe utilizator excepționale pentru produsele noastre AI.',
    requirements: ['React/Next.js', 'TypeScript', 'UI/UX Design'],
  },
  {
    id: 3,
    title: 'Product Manager',
    department: 'Product',
    location: 'Chișinău, Moldova',
    type: 'Full-time',
    experience: '4+ ani',
    description: 'Conduce dezvoltarea produselor AI și strategia de piață.',
    requirements: ['Product Strategy', 'AI Knowledge', 'Leadership'],
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ ani',
    description: 'Dezvoltă strategii de marketing pentru produsele AI.',
    requirements: ['Digital Marketing', 'Content Strategy', 'Analytics'],
  },
];

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: 'Creștere profesională',
    description: 'Oportunități continue de dezvoltare și promovare în echipă.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Echipă talentată',
    description: 'Lucrează alături de cei mai buni specialiști în domeniul AI.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Flexibilitate',
    description: 'Program flexibil și opțiuni de lucru remote.',
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Locații moderne',
    description: 'Birouri moderne și facilități de top în Chișinău.',
  },
];

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Alătură-te echipei
              <span className="text-blue-600"> Bravin AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Construiește viitorul inteligenței artificiale împreună cu noi. 
              Căutăm oameni pasionați care vor să revoluționeze modul în care 
              afacerile interactionează cu clienții lor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#positions"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Vezi pozițiile disponibile
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#culture"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-colors"
              >
                Despre cultura noastră
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24 bg-white" id="culture">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              De ce să lucrezi cu noi?
            </h2>
            <p className="text-xl text-gray-600">
              Oferim un mediu de lucru inspirațional unde poți să-ți dezvolți 
              cariera și să contribui la inovații care schimbă lumea.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 text-blue-600 rounded-xl mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Positions Section */}
      <div className="py-24 bg-gray-50" id="positions">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pozițiile disponibile
            </h2>
            <p className="text-xl text-gray-600">
              Găsește rolul perfect pentru tine și începe o carieră de excepție în AI.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8">
              {jobOpenings.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {job.department}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <Link
                        href={`mailto:careers@Bravin.ai?subject=Aplicație pentru ${job.title}&body=Salut,%0D%0A%0D%0AAș dori să aplic pentru poziția de ${job.title}.%0D%0A%0D%0AVă rog să găsiți CV-ul meu atașat.%0D%0A%0D%0AMulțumesc!`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Aplică acum
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {job.description}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Experiență necesară:</h4>
                    <span className="text-gray-600">{job.experience}</span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Cerințe:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-24 bg-blue-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Nu găsești poziția potrivită?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Trimite-ne CV-ul tău și te vom contacta când va apărea o oportunitate potrivită pentru tine.
            </p>
            <Link
              href="mailto:careers@Bravin.ai?subject=Aplicație spontană&body=Salut,%0D%0A%0D%0AAș fi Bravinsat să mă alătur echipei Bravin AI.%0D%0A%0D%0AVă rog să găsiți CV-ul meu atașat.%0D%0A%0D%0AMulțumesc!"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Trimite CV-ul spontan
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
