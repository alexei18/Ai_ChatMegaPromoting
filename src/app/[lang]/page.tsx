import HeroSection from '@/components/sections/HeroSection';
import LogoTicker from '@/components/sections/LogoTicker';
import HowItWorks from '@/components/sections/HowItWorks';
import IndustryModules from '@/components/sections/IndustryModules';
import ROICalculator from '@/components/sections/ROICalculator';
import Testimonials from '@/components/sections/Testimonials';
import { ResponsiveDemoSection } from '@/components/sections/ResponsiveDemoSection';
import Pricing from '@/components/sections/Pricing';
import dynamic from 'next/dynamic';

const DynamicROICalculator = dynamic(() => import('@/components/sections/ROICalculator'), { ssr: false });
// Params are restricted at build time via generateStaticParams in layout.tsx
// so `lang` will always be one of the supported locale strings.
export default function HomePage({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return (
    <>
      <HeroSection lang={lang} />
      <LogoTicker lang={lang} />
      <HowItWorks />
      <IndustryModules />
      <DynamicROICalculator />
      {/* <Testimonials /> */}
      <ResponsiveDemoSection />
      <Pricing />
    </>
  );
}
