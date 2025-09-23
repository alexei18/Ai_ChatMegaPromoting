"use client";
import React, { useRef } from 'react';
import ConnectingLine from './ConnectingLine';
import { motion } from 'framer-motion';

export interface HowItWorksContainer1Props {
  visibleContainers: number[];
  isContainerActive: (n: number) => boolean;
  renderIcon: (n: number) => React.ReactNode;
  line1Animating: boolean;
  line2Animating: boolean;
  line3Animating: boolean;
  line4Animating: boolean;
  line5Animating: boolean;
  line6Animating: boolean;
}

export const HowItWorksContainer1: React.FC<HowItWorksContainer1Props> = ({
  visibleContainers,
  isContainerActive,
  renderIcon,
  line1Animating,
  line2Animating,
  line3Animating,
  line4Animating,
  line5Animating,
  line6Animating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

      {/* Render Lines First (Underneath Icons) */}
      <ConnectingLine fromRef={{ current: iconRefs.current[7] }} toRef={{ current: iconRefs.current[10] }} containerRef={containerRef} isActive={line1Animating} />
      <ConnectingLine fromRef={{ current: iconRefs.current[11] }} toRef={{ current: iconRefs.current[18] }} containerRef={containerRef} isActive={line2Animating} cornerPreference="vertical-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[18] }} toRef={{ current: iconRefs.current[29] }} containerRef={containerRef} isActive={line2Animating} cornerPreference="horizontal-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[14] }} toRef={{ current: iconRefs.current[32] }} containerRef={containerRef} isActive={line3Animating} cornerPreference="vertical-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[32] }} toRef={{ current: iconRefs.current[35] }} containerRef={containerRef} isActive={line4Animating} />
      <ConnectingLine fromRef={{ current: iconRefs.current[15] }} toRef={{ current: iconRefs.current[19] }} containerRef={containerRef} isActive={line5Animating} cornerPreference="horizontal-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[19] }} toRef={{ current: iconRefs.current[27] }} containerRef={containerRef} isActive={line5Animating} cornerPreference="vertical-first" />
      <ConnectingLine fromRef={{ current: iconRefs.current[19] }} toRef={{ current: iconRefs.current[27] }} containerRef={containerRef} isActive={line6Animating} />

      {/* Render Icons Second (On Top of Lines) */}
      {visibleContainers.map((num) => (
        <motion.div
          key={num}
          ref={(el) => (iconRefs.current[num] = el)}
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

export default HowItWorksContainer1;
