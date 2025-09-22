import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prețuri - Bravin AI Mega Promoting',
  description: 'Planuri și prețuri transparente pentru soluțiile Bravin AI Mega Promoting.',
};

// ===== Server component wrapper (păstrăm metadata aici) =====
export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* fundal animat */}
      <AnimatedBackground />
      <div className="relative container mx-auto px-4 py-16">
        <PricingClient />
      </div>
    </div>
  );
}
import PricingClient from './PricingClient';

// ===== Animated Background (blobs + grid) =====
function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_98%,rgba(0,0,0,0.04)_98%),linear-gradient(90deg,transparent_98%,rgba(0,0,0,0.04)_98%)] bg-[length:30px_30px]" />
      {/* static blobs (server-safe) */}
      <div className="absolute -top-28 -right-24 h-96 w-96 rounded-full blur-3xl bg-[#fff200] opacity-30" />
      <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl bg-black opacity-20" />
    </div>
  );
}

// ===== util tailwind (optional): animație lentă de rotire =====
declare global { interface CSSStyleDeclaration { ['--unused']?: string } }
