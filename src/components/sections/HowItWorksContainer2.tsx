"use client";
import React, { useRef } from 'react';
import ConnectingLine from './ConnectingLine';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface HowItWorksContainer2Props {
  visibleContainers: number[];
  isContainerActive: (n: number) => boolean;
  renderIcon: (n: number) => React.ReactNode;
  line1Animating: boolean;
  line2Animating: boolean;
  line5Animating: boolean;
  line6Animating: boolean;
}

export const HowItWorksContainer2: React.FC<HowItWorksContainer2Props> = ({
  visibleContainers,
  isContainerActive,
  renderIcon,
  line1Animating,
  line2Animating,
  line5Animating,
  line6Animating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const logos = [
    '/HowItWorksSectin/whatsapp-logo.svg',
    '/HowItWorksSectin/telegram-logo.svg',
    '/HowItWorksSectin/messenger-logo.svg',
    '/HowItWorksSectin/instagram-logo.svg',
    '/HowItWorksSectin/google-sheets-logo.svg',
    '/HowItWorksSectin/google-calendar-logo.svg',
    '/HowItWorksSectin/facebook-logo.svg',
    '/HowItWorksSectin/chatwidget-logo.webp',
    '/HowItWorksSectin/amocrm-logo.jpg',
    '/HowItWorksSectin/999-logo.png',
  ];

  return (
    <div ref={containerRef} className="w-full h-full relative p-2 grid grid-cols-6 grid-rows-6 gap-1">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        <defs>
          <linearGradient id="grad-line-dynamic" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#fbcfe8" />
          </linearGradient>
        </defs>
      </svg>
        <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[320px] rounded-[36px] z-30 pointer-events-none bg-black border border-black"
      />
      <div
        aria-hidden="true"
        className="absolute top-[4px] bottom-[4px] left-1/2 transform -translate-x-1/2 w-[calc(90%-8px)] sm:w-[310px] rounded-[34px] z-30 pointer-events-none bg-white border border-black"
      />

      {/* Two infinite carousels centered in the overlay area */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-40 pointer-events-auto flex flex-col items-center gap-4 w-[85%] sm:w-[287px]">
        <style dangerouslySetInnerHTML={{ __html: `
          .hw-carousel{ width:100%; overflow:hidden; border-radius:20px }
          .hw-track{ display:flex; align-items:center; gap:8px; }
          /* smaller carousel items only */
          .hw-item{ flex:0 0 140px; height:100px; border-radius:10px; display:flex; align-items:center; justify-content:center; background:white; box-shadow:0 6px 18px rgba(0,0,0,0.08); border:1px solid #e5e7eb; }
          .hw-track.loop{ animation: scroll-left 18s linear infinite; }
          .hw-track.loop.reverse{ animation-direction: reverse; }
          @keyframes scroll-left{ from{ transform: translateX(0) } to{ transform: translateX(-50%) } }
          /* smaller variant for the secondary track */
          .hw-item.small{ flex:0 0 120px; height:88px; }
        ` }} />

        {/* Large top carousel (5 items, duplicated for seamless loop) */}
        <div className="hw-carousel" aria-hidden>
          <div className="hw-track loop" style={{ width: 'max-content' }}>
            {logos.concat(logos).map((src, i) => (
              <div key={`big-${i}-${src}`} className="hw-item">
                <Image src={src} alt={`logo-${i}`} width={140} height={100} style={{ maxWidth: '68%', maxHeight: '68%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Small bottom carousel moving in the opposite direction */}
        <div className="hw-carousel" aria-hidden>
          <div className="hw-track loop reverse" style={{ width: 'max-content' }}>
            {logos.concat(logos).map((src, i) => (
              <div key={`small-${i}-${src}`} className="hw-item small">
                <Image src={src} alt={`logo-small-${i}`} width={120} height={88} style={{ maxWidth: '58%', maxHeight: '58%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Render Lines First */}
      <ConnectingLine fromRef={{ current: iconRefs.current[7] }} toRef={{ current: iconRefs.current[10] }} containerRef={containerRef} isActive={line1Animating} />
      <ConnectingLine fromRef={{ current: iconRefs.current[11] }} toRef={{ current: iconRefs.current[18] }} containerRef={containerRef} isActive={line2Animating} cornerPreference="vertical-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[15] }} toRef={{ current: iconRefs.current[19] }} containerRef={containerRef} isActive={line5Animating} cornerPreference="horizontal-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[19] }} toRef={{ current: iconRefs.current[27] }} containerRef={containerRef} isActive={line6Animating} cornerPreference="vertical-first" />

      {/* Render Icons Second */}
      {visibleContainers.map((num) => (
        <motion.div
          key={num}
          ref={(el) => { iconRefs.current[num] = el; }}
          className={`flex items-center justify-center text-xs font-bold text-blue-800 rounded`}
          style={{
            gridColumn: `${(num - 1) % 6 + 1} / span 1`,
            gridRow: `${Math.floor((num - 1) / 6) + 1} / span 1`,
            zIndex: 10,
          }}
          animate={{ scale: isContainerActive(num) ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div
            className={`w-full h-full rounded flex items-center justify-center relative transition-all duration-200 ease-in-out group bg-white border border-gray-200 hover:scale-110 hover:shadow-lg`}
          >
            {renderIcon(num)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HowItWorksContainer2;