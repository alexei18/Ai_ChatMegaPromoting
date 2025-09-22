"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ---- DATA ---------------------------------------------------------------
// 4 cards per industry. Feel free to edit copy later.
const industryContent: Record<string, { title: string; subtitle: string; button: string }[]> = {
  Company: [
    {
      title: "AI care răspunde instant",
      subtitle:
        "Conversational AI unifică telefonul, WhatsApp și chat-ul într-un singur hub, oferind răspunsuri automate în sub 3 secunde la întrebări despre prețuri, disponibilitate, program și status comenzi. Elimină cozile de așteptare și menține o experiență consecventă indiferent de volum sau oră.",
      button: "See demo",
    },
    {
      title: "Colectare leaduri 24/7",
      subtitle:
        "Conversații ghidate transformă vizitatorii în leaduri calificate: validăm nevoia, bugetul și termenul, apoi trimitem automat contactele în CRM cu notițe, etichete și scor. Echipa ta primește doar cereri relevante, gata de preluare.",
      button: "Try it",
    },
    {
      title: "Analiză conversații",
      subtitle:
        "Transcriere automată, rezumat per dialog, detecție de sentiment și extragere de topicuri cheie. Vezi întrebările recurente, obiecțiile frecvente și oportunitățile de upsell, astfel încât să-ți ajustezi rapid produsele, scripturile și paginile de vânzare.",
      button: "Learn more",
    },
    {
      title: "Integrare rapidă",
      subtitle:
        "Onboarding în ore, nu în săptămâni: conectăm website-ul, telefonia și canalele sociale existente fără schimbări de infrastructură. Configurăm fluxurile-cheie, testăm cap-coadă și pornim live cu risc minim pentru operațiuni.",
      button: "Get started",
    },
  ],

  Restaurant: [
    {
      title: "Rezervări automate",
      subtitle:
        "AI-ul preia cererile de rezervare direct din chat sau WhatsApp, verifică disponibilitatea în timp real și confirmă detaliile clientului. Datele sunt trimise instant către Owner sau în aplicația ta de gestiune, reducând apelurile repetate și erorile umane.",
      button: "Află mai mult",
    },
    {
      title: "Meniu interactiv",
      subtitle:
        "Oferă răspunsuri despre ingrediente, alergeni, opțiuni vegetariene și recomandări potrivite gusturilor clientului. Meniul devine o experiență interactivă care îmbunătățește decizia de comandă și crește valoarea bonului.",
      button: "Vezi detalii",
    },
    {
      title: "Comenzi online",
      subtitle:
        "Clientul comandă direct din chat: AI-ul validează adresa, preferințele și metoda de plată, apoi transmite comanda în sistemul tău. Confirmările sunt imediate, iar statusul livrării poate fi urmărit fără a suna la restaurant.",
      button: "Comandă acum",
    },
    {
      title: "Testimonial clienți",
      subtitle:
        "„Rezervările s-au dublat după implementarea AI-ului. Confirmările vin instant, iar noi ne concentrăm pe calitatea serviciului din sală, nu pe gestionarea telefonului.”",
      button: "Citește povestea",
    },
  ],

  Store: [
    {
      title: "Asistență la cumpărături",
      subtitle:
        "AI-ul răspunde la întrebări despre produse, stoc, mărimi și compatibilitate. Sugerează variante alternative când un articol nu este disponibil și explică diferențele dintre modele pentru a reduce indecizia și retururile.",
      button: "Detalii",
    },
    {
      title: "Promoții automate",
      subtitle:
        "Declanșează cupoane contextuale și oferte last-minute atunci când clientul întreabă de livrare, preț sau garanție. Crești rata de conversie fără să supraîncarci site-ul cu pop-up-uri generice.",
      button: "Activează",
    },
    {
      title: "Retur simplificat",
      subtitle:
        "Clientul inițiază returul direct în conversație. AI-ul verifică criteriile, generează instrucțiunile și eticheta (dacă e cazul) și sincronizează statusul în sistemul tău de suport, scăzând costul per cerere.",
      button: "Vezi cum",
    },
    {
      title: "Feedback clienți",
      subtitle:
        "„Am redus cu 40% timpul dedicat suportului. Clienții lasă feedback direct prin AI, iar echipa noastră prioritizează rapid îmbunătățirile cu impact real asupra vânzărilor.”",
      button: "Recenzie",
    },
  ],

  Hotel: [
    {
      title: "Rezervări camere",
      subtitle:
        "Agentul verifică disponibilitatea, propune opțiuni potrivite bugetului și preferințelor, face booking-ul și trimite confirmarea. Funcționează 24/7 în mai multe limbi, reducând presiunea de la recepție și scurtând timpul până la confirmare.",
      button: "Rezervă",
    },
    {
      title: "Check-in online",
      subtitle:
        "Oaspeții pot finaliza check-in-ul înainte de sosire: AI-ul colectează datele necesare, oferă instrucțiuni clare și reduce aglomerația la recepție. Experiență fluidă pentru clienți, timp câștigat pentru personal.",
      button: "Încearcă",
    },
    {
      title: "Ghid turistic",
      subtitle:
        "Concierge digital non-stop: recomandări de restaurante, evenimente și atracții locale, personalizate după interesele oaspetelui. Creezi o experiență memorabilă fără costuri suplimentare cu personal dedicat.",
      button: "Descoperă",
    },
    {
      title: "Rezultate reale",
      subtitle:
        "„Rata de ocupare a crescut cu 30% după integrarea AI-ului. Clienții apreciază rezervările rapide și suportul proactiv pe tot parcursul șederii.”",
      button: "Află povestea",
    },
  ],

  Salon: [
    {
      title: "Programări instant",
      subtitle:
        "Clienții își aleg stilistul, serviciile și intervalul preferat direct în chat. AI-ul verifică calendarul în timp real, previne suprapunerile și confirmă rezervarea fără apeluri sau mesaje pierdute.",
      button: "Programează",
    },
    {
      title: "Remindere automate",
      subtitle:
        "Reduci no-show-urile cu notificări smart pe WhatsApp/SMS: confirmări, reamintiri și opțiuni rapide de reprogramare. Agenda rămâne plină, iar timpii morți dispar.",
      button: "Activează",
    },
    {
      title: "Recomandări produse",
      subtitle:
        "După serviciu, AI-ul sugerează produse potrivite tipului de păr/ten și rutinei clientului, cu link direct de achiziție. Crești vânzările complementare fără presiune asupra stilistului.",
      button: "Vezi produse",
    },
    {
      title: "Testimonial",
      subtitle:
        "„Nu mai pierdem programări din cauza mesajelor ratate. AI-ul confirmă automat, iar clienții pot reprograma în câteva secunde.”",
      button: "Află mai mult",
    },
  ],

  Clinic: [
    {
      title: "Triaj & programări",
      subtitle:
        "Pacienții descriu simptomele, iar AI-ul propune cabinetul sau medicul potrivit și intervale disponibile. Colectăm acorduri, date de contact și motivul vizitei pentru o fișă clară înainte de consultație.",
      button: "Programare",
    },
    {
      title: "Instrucțiuni pre-vizită",
      subtitle:
        "Trimitem automat pregătirea necesară (analize, repaus alimentar, documente) și verificăm conformitatea. Mai puține vizite reprogramate și consultații care încep la timp.",
      button: "Detalii",
    },
    {
      title: "Follow-up",
      subtitle:
        "Mesaje post-consultație cu pași clari, reamintiri pentru tratament și posibilitatea de a raporta reacții. Creștem aderența și scădem apelurile repetitive către recepție.",
      button: "Vezi cum",
    },
    {
      title: "Confidențialitate",
      subtitle:
        "Toate conversațiile pot fi auditabile, cu politici stricte de acces și păstrare. Respectăm fluxuri conforme și separăm datele sensibile de canalele publice, pentru un risc operațional minim.",
      button: "Learn more",
    },
  ],

  Agency: [
    {
      title: "Qualificare leaduri",
      subtitle:
        "Filtrăm cererile după buget, deadline, industrie și obiective înainte să ajungă la account manager. Echipa primește brieful esențial fără ping-pong pe email și chat.",
      button: "Optimizează",
    },
    {
      title: "Brief inteligent",
      subtitle:
        "Strângem automat informații pentru brief-uri complete: context, benchmark, assets existente și restricții. Reducem timpul de kick-off și creștem claritatea încă din prima întâlnire.",
      button: "Încearcă",
    },
    {
      title: "Raportare clienți",
      subtitle:
        "Rezumat periodic al conversațiilor, status pe taskuri și highlighturi cu riscuri. Clienții au vizibilitate, iar echipa își aliniază prioritățile fără call-uri inutile.",
      button: "Vezi demo",
    },
    {
      title: "Integrare CRM",
      subtitle:
        "HubSpot, Pipedrive, Notion, ClickUp – sincronizăm automat leaduri, note și etichete. Păstrezi procesele actuale, dar cu mai puține erori și mai mult context la îndemână.",
      button: "Conectează",
    },
  ],

  School: [
    {
      title: "Răspunsuri pentru părinți",
      subtitle:
        "Program, taxe, transport, cantină, evenimente și absențe – AI-ul răspunde consistent și imediat, scăzând volumul de apeluri către secretariat și riscul de comunicări contradictorii.",
      button: "Detalii",
    },
    {
      title: "Înscrieri",
      subtitle:
        "Colectăm documente, validăm date și explicăm pașii pentru admitere sau transfer. Părinții primesc mesaje clare, iar școala reduce blocajele din perioadele aglomerate.",
      button: "Aplică",
    },
    {
      title: "Asistență elevi",
      subtitle:
        "Q&A despre orar, teme, resurse digitale și anunțuri importante. Elevii găsesc rapid informația corectă, iar profesorii rămân concentrați pe predare.",
      button: "Află mai mult",
    },
    {
      title: "Raportare",
      subtitle:
        "Agregăm temele recurente din conversații și generăm rapoarte pentru conducere: unde apar confuzii, ce canale lipsesc și ce trebuie actualizat în comunicarea oficială.",
      button: "Vezi model",
    },
  ],

  University: [
    {
      title: "Admitere & burse",
      subtitle:
        "AI-ul ghidează candidații prin criterii, calendare, documente și burse disponibile. Răspunsuri corecte și actualizate reduc presiunea pe staff și cresc calitatea aplicanților.",
      button: "Vezi ghid",
    },
    {
      title: "Suport administrativ",
      subtitle:
        "Cereri, adeverințe, înscrieri la examene, program secretariat – toate pot fi inițiate și urmărite în conversație, cu status vizibil și instructaj pas cu pas.",
      button: "Accesează",
    },
    {
      title: "Resurse campus",
      subtitle:
        "Orientare, bibliotecă, cluburi studențești, servicii de carieră – informația este centralizată și disponibilă 24/7, inclusiv pentru studenții internaționali.",
      button: "Explorează",
    },
    {
      title: "Analytics",
      subtitle:
        "Analizăm întrebările recurente ale studenților pentru a identifica goluri de comunicare, pagini neclare și procese care pot fi simplificate la nivel de facultate sau universitate.",
      button: "Află mai mult",
    },
  ],

  Service: [
    {
      title: "Programări & intervenții",
      subtitle:
        "Planificăm vizite tehnice și intervenții la domiciliu: verificăm disponibilitatea echipelor, colectăm detalii despre problemă și confirmăm programarea în câteva mesaje.",
      button: "Programează",
    },
    {
      title: "Status lucrări",
      subtitle:
        "Clienții verifică progresul în timp real, primesc estimări de cost și sunt anunțați la schimbarea statusului. Mai puține apeluri repetitive, mai multă transparență.",
      button: "Verifică",
    },
    {
      title: "Piese & oferte",
      subtitle:
        "Identificăm piesele necesare după simptom, model și serie, apoi generăm o ofertă personalizată. Reducem ciclul cerere-ofertă și eliminăm greșelile de identificare.",
      button: "Solicită",
    },
    {
      title: "Feedback & NPS",
      subtitle:
        "După intervenție, AI-ul colectează feedback și NPS, agregă plângerile recurente și trimite alertă când apare risc de churn, pentru a interveni proactiv.",
      button: "Închide ticket",
    },
  ],
};


const TABS: { key: keyof typeof industryContent; label: string }[] = [
  { key: "Company", label: "company" },
  { key: "Restaurant", label: "restaurant" },
  { key: "Store", label: "store" },
  { key: "Hotel", label: "hotel" },
  { key: "Salon", label: "salon" },
  { key: "Clinic", label: "clinic" },
  { key: "Agency", label: "agency" },
  { key: "School", label: "school" },
  { key: "University", label: "university" },
  { key: "Service", label: "service" },
];

// ---- COMPONENT ----------------------------------------------------------
export default function IndustryCards() {
  const [activeTab, setActiveTab] = useState<keyof typeof industryContent>("Company");

  return (
    <section className="max-w-[1200px] mx-auto px-6 pt-10 md:pt-14 pb-16 min-h-[640px] md:min-h-[760px] lg:min-h-[1100px]">
      {/* Title + subtitle */}
      <div className="mb-8 md:mb-10">
        <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-tight text-black md:text-[72px]">
          Bravin for
          <br className="hidden md:block" /> everyone
        </h1>
        <p className="mt-4 max-w-[560px] text-[18px] md:text-[20px] leading-relaxed text-slate-600">
          Conversational AI solutions tailored for every industry — automate,
          personalize, and scale customer interactions, no matter the field.
        </p>
      </div>

      {/* Tabs pill */}
      <div className="mb-10">
        <div className="inline-flex w-full md:w-auto items-center gap-1 rounded-full bg-slate-100 p-1 md:p-2 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={label}
              onClick={() => setActiveTab(key)}
              className={[
                "whitespace-nowrap rounded-full px-4 md:px-5 py-2 text-sm md:text-base font-medium transition",
                activeTab === key
                  ? "bg-white text-slate-900 shadow ring-1 ring-slate-200"
                  : "text-slate-700 hover:text-slate-900",
              ].join(" ")}
              aria-pressed={activeTab === key}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="wait">
          {industryContent[activeTab].map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, delay: idx * 0.04 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-[20px] md:text-[22px] font-bold mb-2 text-slate-900">{card.title}</h3>
                <p className="text-slate-600 text-[15px] md:text-[16px] leading-6">{card.subtitle}</p>
              </div>
              <button className="mt-4 inline-flex items-center justify-center self-start rounded-full px-4 py-2 text-sm font-semibold bg-black text-white hover:bg-black/90">
                {card.button}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
