// Sample data for Bravin AI marketing site

export interface Company {
  id: number;
  name: string;
  logo: string; // placeholder path
}

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: string; // placeholder path
  quote: string;
  metrics: {
    label: string;
    value: string;
  };
}

export interface IndustryCard {
  id: number;
  title: string;
  description: string;
  benefits: string[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  badge?: string;
  subText?: string;
}

// Company logos for social proof
export const companies: Company[] = [
  { id: 1, name: "TechCorp", logo: "/placeholder-logo-1.png" },
  { id: 2, name: "MedHealth", logo: "/placeholder-logo-2.png" },
  { id: 3, name: "AutoDealer", logo: "/placeholder-logo-3.png" },
  { id: 4, name: "RetailPlus", logo: "/placeholder-logo-4.png" },
  { id: 5, name: "LogiFlow", logo: "/placeholder-logo-5.png" },
  { id: 6, name: "SaaS Solutions", logo: "/placeholder-logo-6.png" },
  { id: 7, name: "RestaurantChain", logo: "/placeholder-logo-7.png" },
  { id: 8, name: "FinanceFirst", logo: "/placeholder-logo-8.png" },
];

// How it works steps
export const howItWorksSteps = [
  {
    id: 1,
    title: "Conectează-te",
    description: "Ne contactezi și stabilim împreună obiectivele și tipul de conversații pe care agentul tău AI le va gestiona.",
  },
  {
    id: 2,
    title: "Alegi platforma",
    description: "Selectezi platforma (WhatsApp, Facebook Messenger, site web, Instagram, etc.) de pe care vrei să fie preluate mesajele.",
  },
  {
    id: 3,
    title: "AI răspunde",
    description: "Agentul nostru virtual AI răspunde instant și profesionist clienților tăi, fără a fi nevoie de o persoană reală, 24/7.",
  },
];


// Customer testimonials
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Customer Success Director",
    company: "TechFlow Solutions",
    avatar: "/placeholder-avatar-1.png",
    quote: "The AI chatbot has revolutionized our customer support. Response times dropped by 85% and customer satisfaction increased dramatically.",
    metrics: {
      label: "Response Time",
      value: "-85%",
    },
  },
  {
    id: 2,
    name: "Michael Chen",
    title: "Operations Manager",
    company: "Digital Dynamics",
    avatar: "/placeholder-avatar-2.png",
    quote: "Our team now focuses on complex issues while AI handles routine queries. It's like having 24/7 support without the overhead costs.",
    metrics: {
      label: "Cost Savings",
      value: "60%",
    },
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    title: "Head of Customer Experience",
    company: "InnovateCorp",
    avatar: "/placeholder-avatar-3.png",
    quote: "The implementation was seamless and the results were immediate. Our customers love the instant, accurate responses they receive.",
    metrics: {
      label: "CSAT Score",
      value: "+40%",
    },
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Sales Director",
    company: "GrowthTech Inc",
    avatar: "/placeholder-avatar-4.png",
    quote: "We've seen a 300% increase in lead conversion since implementing the Bravin AI. It's incredible how it nurtures prospects automatically.",
    metrics: {
      label: "Lead Conversion",
      value: "+300%",
    },
  },
  {
    id: 5,
    name: "Lisa Park",
    title: "Product Manager",
    company: "NextGen Systems",
    avatar: "/placeholder-avatar-5.png",
    quote: "The AI understands context perfectly and provides personalized responses. Our customers often don't realize they're chatting with AI.",
    metrics: {
      label: "Resolution Rate",
      value: "92%",
    },
  },
  {
    id: 6,
    name: "Robert Kim",
    title: "Chief Technology Officer",
    company: "ScaleUp Ventures",
    avatar: "/placeholder-avatar-6.png",
    quote: "ROI was positive within the first month. The AI handles 80% of our inquiries, freeing up our team for strategic initiatives.",
    metrics: {
      label: "ROI",
      value: "+250%",
    },
  },
];

// Pricing plans
export const pricingPlansMonthly: PricingPlan[] = [
  {
    id: 1,
    name: "Starter",
    price: "$49",
    period: "Lunar",
    description:
      "Ideal pentru testarea platformei și automatizarea interacțiunilor de bază.",
    features: [
      "2.000 credite pentru mesaje/lunar",
      "15.000 simboluri instrucțiuni",
      "Integrare rapidă cu orice platformă disponibilă",
      "Automatizare inteligentă: mesaje de follow-up, scorarea lead-urilor și generare de imagini personalizate",
      "Răspunsuri automate 24/7 pentru întrebări frecvente, reducând timpul de așteptare al clienților",
      "Suport tehnic lunar pentru a vă ajuta să configurați și să optimizați chatbot-ul",
      "Actualizări regulate pentru a menține performanța și securitatea chatbot-ului la nivel maxim",
      "Rapoarte de bază privind interacțiunile clienților, pentru a înțelege mai bine nevoile lor",
      "Acces nelimitat la personalizare, cu opțiuni de ajustare a scenariilor de bază și nu doar"
    ],
    ctaText: "Începeți"
  },
  {
    id: 2,
    name: "Profesional",
    price: "$105",
    originalPrice: "$150",
    period: "Lunar",
    description:
      "Pentru afaceri în creștere care au nevoie de funcționalitate avansată.",
    features: [
      "10.000 credite pentru mesaje/lunar",
      "30.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Standard, plus gestionare avansată a fluxului mediu de clienți",
      "Personalizare completă a chatbot-ului: ajustați tonul, limbajul și scenariile pentru brandul dvs",
      "Răspunsuri AI îmbunătățite, cu precizie ridicată pentru întrebări complexe, disponibil 24/7",
      "Integrări API pentru conectarea cu alte platforme, cum ar fi CRM-uri sau sisteme de ecommerce",
      "Analize detaliate ale interacțiunilor, inclusiv tendințe și rapoarte personalizate lunare",
      "Suport prioritar pentru configurare și soluționarea problemelor, cu răspuns în 24 de ore",
      "Opțiuni de clonare a vocii pentru mesaje vocale personalizate, pentru o experiență unică a clienților"
    ],
    isPopular: true,
    ctaText: "Începeți",
    badge: "Prima lună - 30%"
  },
  {
    id: 3,
    name: "Business",
    price: "$299",
    period: "Lunar",
    description:
      "Pentru companii mari cu nevoi complexe și management dedicat.",
    features: [
      "30.000 credite pentru mesaje/lunar",
      "40.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Pro, plus acces nelimitat la configurarea avansată a chatbotului",
      "Gestionare eficientă a traficului ridicat, fără întreruperi, pentru mii de interacțiuni zilnice",
      "Experiență complet personalizată: ton, limbaj, scenarii și integrări API",
      "Automatizare avansată, inclusiv generare de conținut dinamic și răspunsuri bazate pe date în timp real",
      "Dashboard de analiză premium, cu insight-uri detaliate pentru optimizarea strategiilor de chat",
      "Suport dedicat 24/7, cu manager de cont personal pentru asistență continuă",
      "Utilizare comercială nelimitată, inclusiv pentru campanii globale și multi-canal"
    ],
    ctaText: "Începeți"
  },
  {
    id: 4,
    name: "Enterprise",
    price: "$499",
    period: "Lunar",
    description:
      "Soluție personalizată pentru dezvoltatori, cu suport și servicii premium.",
    features: [
      "50.000 credite pentru mesaje/lunar",
      "50.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Ultra, plus capacitate maximă pentru gestionarea traficului global",
      "Integrări personalizate cu sistemele dvs",
      "Răspunsuri AI ultra-precise, adaptate pentru limbaje multiple și dialecte regionale",
      "Analize avansate în timp real, cu predicții bazate pe IA pentru tendințele clienților",
      "Suport premium, inclusiv training pentru echipa dvs. de administrare",
      "Opțiuni de scalare nelimitată, pentru a suporta creșterea rapidă a interacțiunilor",
      "Garanție de performanță, cu uptime de 99,9% și backup automat pentru date"
    ],
    ctaText: "Începeți"
  }
];

export const pricingPlansYearly: PricingPlan[] = [
  {
    id: 1,
    name: "Starter",
    price: "$40",
    originalPrice: "$49",
    period: "Lunar",
    subText: "Se achită anual",
    description:
      "Ideal pentru testarea platformei și automatizarea interacțiunilor de bază.",
    features: [
      "2.000 credite pentru mesaje/lunar",
      "15.000 simboluri instrucțiuni",
      "Integrare rapidă cu orice platformă disponibilă",
      "Automatizare inteligentă: mesaje de follow-up, scorarea lead-urilor și generare de imagini personalizate",
      "Răspunsuri automate 24/7 pentru întrebări frecvente, reducând timpul de așteptare al clienților",
      "Suport tehnic lunar pentru a vă ajuta să configurați și să optimizați chatbot-ul",
      "Actualizări regulate pentru a menține performanța și securitatea chatbot-ului la nivel maxim",
      "Rapoarte de bază privind interacțiunile clienților, pentru a înțelege mai bine nevoile lor",
      "Acces nelimitat la personalizare, cu opțiuni de ajustare a scenariilor de bază și nu doar"
    ],
    ctaText: "Începeți",
    badge: "2 luni gratis"
  },
  {
    id: 2,
    name: "Profesional",
    price: "$120",
    originalPrice: "$150",
    period: "Lunar",
    subText: "Se achită anual",
    description:
      "Pentru afaceri în creștere care au nevoie de funcționalitate avansată.",
    features: [
      "10.000 credite pentru mesaje/lunar",
      "30.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Standard, plus gestionare avansată a fluxului mediu de clienți",
      "Personalizare completă a chatbot-ului: ajustați tonul, limbajul și scenariile pentru brandul dvs",
      "Răspunsuri AI îmbunătățite, cu precizie ridicată pentru întrebări complexe, disponibil 24/7",
      "Integrări API pentru conectarea cu alte platforme, cum ar fi CRM-uri sau sisteme de ecommerce",
      "Analize detaliate ale interacțiunilor, inclusiv tendințe și rapoarte personalizate lunare",
      "Suport prioritar pentru configurare și soluționarea problemelor, cu răspuns în 24 de ore",
      "Opțiuni de clonare a vocii pentru mesaje vocale personalizate, pentru o experiență unică a clienților"
    ],
    isPopular: true,
    ctaText: "Începeți",
    badge: "2 luni gratis"
  },
  {
    id: 3,
    name: "Business",
    price: "$240",
    originalPrice: "$299",
    period: "Lunar",
    subText: "Se achită anual",
    description:
      "Pentru companii mari cu nevoi complexe și management dedicat.",
    features: [
      "30.000 credite pentru mesaje/lunar",
      "40.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Pro, plus acces nelimitat la configurarea avansată a chatbotului",
      "Gestionare eficientă a traficului ridicat, fără întreruperi, pentru mii de interacțiuni zilnice",
      "Experiență complet personalizată: ton, limbaj, scenarii și integrări API",
      "Automatizare avansată, inclusiv generare de conținut dinamic și răspunsuri bazate pe date în timp real",
      "Dashboard de analiză premium, cu insight-uri detaliate pentru optimizarea strategiilor de chat",
      "Suport dedicat 24/7, cu manager de cont personal pentru asistență continuă",
      "Utilizare comercială nelimitată, inclusiv pentru campanii globale și multi-canal"
    ],
    ctaText: "Începeți",
    badge: "2 luni gratis"
  },
  {
    id: 4,
    name: "Enterprise",
    price: "$400",
    originalPrice: "$499",
    period: "Lunar",
    subText: "Se achită anual",
    description:
      "Soluție personalizată pentru dezvoltatori, cu suport și servicii premium.",
    features: [
      "50.000 credite pentru mesaje/lunar",
      "50.000 simboluri instrucțiuni",
      "Toate funcțiile din pachetul Ultra, plus capacitate maximă pentru gestionarea traficului global",
      "Integrări personalizate cu sistemele dvs",
      "Răspunsuri AI ultra-precise, adaptate pentru limbaje multiple și dialecte regionale",
      "Analize avansate în timp real, cu predicții bazate pe IA pentru tendințele clienților",
      "Suport premium, inclusiv training pentru echipa dvs. de administrare",
      "Opțiuni de scalare nelimitată, pentru a suporta creșterea rapidă a interacțiunilor",
      "Garanție de performanță, cu uptime de 99,9% și backup automat pentru date"
    ],
    ctaText: "Începeți",
    badge: "2 luni gratis"
  }
];


// Keep backward compatibility
export const pricingPlans = pricingPlansMonthly;

// Code examples for developer section
export const codeExamples = {
  curl: `curl -X POST "https://api.Bravin-AI.com/v1/chat" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "How can I help you today?",
    "user_id": "user123",
    "context": {
      "channel": "website",
      "previous_messages": []
    }
  }'`,
  
  javascript: `import { AiChat } from '@Bravin-AI/sdk';

const client = new AiChat('YOUR_API_KEY');

async function handleMessage(message, userId) {
  try {
    const response = await client.chat.create({
      message,
      userId,
      context: {
        channel: 'website',
        previousMessages: []
      }
    });
    
    return response.reply;
  } catch (error) {
    console.error('Bravin AI error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}`,
};

// Footer links
export const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API Docs", href: "/docs" },
    { label: "Integrations", href: "/integrations" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
    { label: "Privacy", href: "/privacy" },
  ],
};