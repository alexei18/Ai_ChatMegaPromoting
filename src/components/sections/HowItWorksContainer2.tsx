"use client";
import React from 'react';
import Image from 'next/image';

// Props needed to render the interactive grid + animated SVG lines exactly as before
export interface HowItWorksContainer1Props {
  visibleContainers: number[];
  isContainerActive: (n: number) => boolean;
  renderIcon: (n: number) => React.ReactNode;
  line1_2Ref: React.RefObject<SVGPathElement>;
  line2_2Ref: React.RefObject<SVGPathElement>;
  line5_2Ref?: React.RefObject<SVGPathElement>;
  line6_2Ref: React.RefObject<SVGPathElement>;
}

export const HowItWorksContainer2: React.FC<HowItWorksContainer1Props> = ({
  visibleContainers,
  isContainerActive,
  renderIcon,
  line1_2Ref,
  line2_2Ref,
  line5_2Ref,
  line6_2Ref
}) => {
  // list of logos (public path is relative to /public)
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
    <div className="w-full h-full relative p-1 md:p-2">
      {/* Overlay container (height:100%, width:200px, rounded corners) positioned above the inner elements */}
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

      {/* Exclude specific containers locally (14 and 15) regardless of incoming visibleContainers */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-9 md:grid-cols-6 md:grid-rows-6 gap-1">
        {(() => {
          // Excluded container IDs (local override) - will be hidden regardless of incoming props
          const excluded = new Set([14, 15, 27, 32, 29, 35, 10, 11]);
          return Array.from({ length: 36 }, (_, gridIdx) => {
            const num = gridIdx + 1;
            const isVisible = visibleContainers.includes(num) && !excluded.has(num);
            const smallSet = new Set([7, 18, 19]);
            const isSmall = smallSet.has(num);
            return (
              <div
                key={gridIdx}
                className={`flex items-center justify-center text-xs font-bold text-blue-800 rounded transition-colors duration-200 ${isVisible ? '' : 'opacity-0'}`}
              >
                {isVisible && (
                  <div
                    className={`w-full h-full rounded flex items-center justify-center relative z-10 transition-all duration-200 ease-in-out group bg-white overflow-hidden ${isContainerActive(num) ? 'scale-110 shadow-lg' : ''} hover:scale-110 hover:shadow-lg ${isContainerActive(num) ? '' : 'border border-gray-200'}`}
                  >
                    {(() => {
                      const node = renderIcon(num)
                      if (React.isValidElement(node)) {
                        const liftedChildren = React.Children.map(node.props.children, (child) => {
                          if (!React.isValidElement(child)) return child
                          const el = child as React.ReactElement<any>
                          const className = el.props?.className || ''
                          // lift label span higher and also lift image wrapper when active
                          // Active state now uses same slight lift as hover to keep consistency
                          const hoverClass = 'group-hover/icon:-translate-y-2'
                          const activeLiftClass = isContainerActive(num) ? '-translate-y-2' : ''
                          const transitionClass = 'transform transition-transform duration-150'
                          if (el.type === 'span' || String(className).includes('text-xs')) {
                            const existingClass = el.props?.className || ''
                            const newClass = `${existingClass} ${transitionClass} ${activeLiftClass} ${hoverClass}`.trim()
                            return React.cloneElement(el, { className: newClass })
                          }
                          // detect inner sizing wrapper (div with w-[] h-[] classes) and lift it too
                          if (el.type === 'div' && String(className).includes('w-[')) {
                            const existingClass = el.props?.className || ''
                            const newClass = `${existingClass} ${transitionClass} ${activeLiftClass} ${hoverClass}`.trim()
                            return React.cloneElement(el, { className: newClass })
                          }
                          return el
                        })
                        return React.cloneElement(node, {}, liftedChildren)
                      }
                      return node
                    })()}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad-line1_2" x1="13" y1="25" x2="53" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="35%" stopColor="#fda4af" />
            <stop offset="70%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <linearGradient id="grad-line2_2" x1="73" y1="70" x2="73" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="35%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="grad-line5_2" x1="43" y1="46" x2="43" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7EE7D9" />
            <stop offset="40%" stopColor="#34D1C6" />
            <stop offset="75%" stopColor="#0EA5C9" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
            <linearGradient id="grad-line6_2" x1="8" y1="63" x2="37" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="35%" stopColor="#fdba74" />
            <stop offset="70%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        <path ref={line1_2Ref} d="M 13 25 L 53 25" stroke="url(#grad-line1_2)" strokeWidth="0.5" strokeLinecap="round" fill="none" id='line-1' />
        <path ref={line2_2Ref} d="M 93 37 L 93 30 A 4 5 0 0 0 89 25 L 75 25" stroke="url(#grad-line2_2)" strokeWidth="0.5" strokeLinecap="round" fill="none" id='line-2' />
        <path ref={line5_2Ref} d="M 13 58 L 28 58" stroke="url(#grad-line5_2)" strokeWidth="0.5" strokeLinecap="round" fill="none" id='line-5' />
        <path ref={line6_2Ref} d="M 8 63 L 8 71 A 4 5 0 0 0 12 75 L 37 75" stroke="url(#grad-line6_2)" strokeWidth="0.5" strokeLinecap="round" fill="none" id='line-6' />
      </svg>
        
    </div>
  );
};

export default HowItWorksContainer2;
