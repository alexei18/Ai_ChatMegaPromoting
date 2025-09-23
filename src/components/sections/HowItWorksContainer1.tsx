"use client";
import React from 'react';

// Props needed to render the interactive grid + animated SVG lines exactly as before
export interface HowItWorksContainer1Props {
  visibleContainers: number[];
  isContainerActive: (n: number) => boolean;
  renderIcon: (n: number) => React.ReactNode;
  line1Ref: React.RefObject<SVGPathElement>;
  line2Ref: React.RefObject<SVGPathElement>;
  line2ContinuedRef: React.RefObject<SVGPathElement>;
  line3Ref: React.RefObject<SVGPathElement>;
  line4Ref: React.RefObject<SVGPathElement>;
  line5Ref: React.RefObject<SVGPathElement>;
  line5ContinuedRef: React.RefObject<SVGPathElement>;
  line6Ref: React.RefObject<SVGPathElement>;
}

export const HowItWorksContainer1: React.FC<HowItWorksContainer1Props> = ({
  visibleContainers,
  isContainerActive,
  renderIcon,
  line1Ref,
  line2Ref,
  line2ContinuedRef,
  line3Ref,
  line4Ref,
  line5Ref,
  line5ContinuedRef,
  line6Ref
}) => {
  return (
    <div className="w-full h-full relative p-1 md:p-2">
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1">
        {Array.from({ length: 36 }, (_, gridIdx) => {
          const num = gridIdx + 1;
          const isVisible = visibleContainers.includes(num);
          return (
            <div
              key={gridIdx}
              className={`flex items-center justify-center text-xs font-bold text-blue-800 rounded transition-colors duration-200 ${isVisible ? '' : 'opacity-0'}`}
            >
              {isVisible && (
                <div
                  className={`w-full h-full rounded flex items-center justify-center relative z-10 transition-all duration-200 ease-in-out group bg-white border border-gray-200 ${isContainerActive(num) ? 'scale-110 shadow-lg' : ''} hover:scale-110 hover:shadow-lg`}
                >
                  {renderIcon(num)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad-line1" x1="13" y1="25" x2="53" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="35%" stopColor="#fda4af" />
            <stop offset="70%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <linearGradient id="grad-line2" x1="73" y1="70" x2="73" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="35%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-line3" x1="25" y1="87" x2="25" y2="47" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="grad-line4" x1="30" y1="93" x2="70" y2="93" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="45%" stopColor="#a78bfa" />
            <stop offset="85%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id="grad-line5" x1="43" y1="46" x2="43" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#fcd34d" />
            <stop offset="70%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
            <linearGradient id="grad-line6" x1="8" y1="63" x2="37" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="35%" stopColor="#fdba74" />
            <stop offset="70%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        <path ref={line1Ref} d="M 13 25 L 53 25" stroke="url(#grad-line1)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-1' />
        <path ref={line2Ref} d="M 73 70 L 73 28" stroke="url(#grad-line2)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-2' />
        <path ref={line2ContinuedRef} d="M 75 70 L 75 50 A 6 7 0 0 1 81 43 L 88 43" stroke="url(#grad-line2)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-2-continued' />
        <path ref={line3Ref} d="M 25 87 L 25 47" stroke="url(#grad-line3)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-3' />
        <path ref={line4Ref} d="M 30 93 L 70 93" stroke="url(#grad-line4)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-4' />
        <path ref={line5Ref} d=" M 43 46 L 43 70 " stroke="url(#grad-line5)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-5' />
        <path ref={line5ContinuedRef} d="M 41 46 L 41 50 A 6 7 0 0 1 35 57 L 13 57" stroke="url(#grad-line5)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-5-continued' />
        <path ref={line6Ref} d="M 8 63 L 8 71 A 4 5 0 0 0 12 75 L 37 75" stroke="url(#grad-line6)" strokeWidth="0.6" strokeLinecap="round" fill="none" id='line-6' />
      </svg>
    </div>
  );
};

export default HowItWorksContainer1;
