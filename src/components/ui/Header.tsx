

'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { image } from 'framer-motion/client'
import { useRouter, usePathname } from 'next/navigation'

/**
 * Improved: smooth morph between top bar and centered pill with seamless connected dropdowns.
 * - Always centered via left-1/2 + -translate-x-1/2 (no side "slide")
 * - Animates top, width, border-radius, background & blur smoothly
 * - Connected dropdowns with smooth spring animations
 * - When at page top: content is constrained (not touching screen edges)
 */

type NavigationHeaderPillStaticProps = {
  logoSrc?: string
  logoAlt?: string
  leftImageSrc?: string
  rightImageSrc?: string
}


import roLocale from '../../locales/ro.json';
import enLocale from '../../locales/en.json';
import ruLocale from '../../locales/ru.json';

const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale };

type HoverContentType = { title: string; subtitle: string; image?: string };
const hoverImages: Record<string, string> = {
  blog: 'public/HeaderSection/BlogImage.png',
  news: 'public/HeaderSection/Case-StudiesImage.png',
  guides: 'public/HeaderSection/GidsImage.png',
  documentation: 'public/HeaderSection/DocumentationImage.png',
  faq: 'public/HeaderSection/Faq-Image.png',
  roiCalculator: 'public/HeaderSection/RoiCalculatorImage.png',
  about: 'public/HeaderSection/AboutUsImage.png',
  career: 'public/HeaderSection/CarierImage.png',
  partners: 'public/HeaderSection/PartnersImage.png',
  trustCenter: 'public/HeaderSection/TrustCenterImage.png',
  contacts: 'public/HeaderSection/ContactImage.png',
};

function getHoverContent(lang: string): Record<string, HoverContentType> {
  const translations = locales[lang.toLowerCase()] || roLocale;
  const hover = translations.Header?.hover || {};
  const result: Record<string, HoverContentType> = {};
  Object.keys(hoverImages).forEach((key) => {
    if (hover[key]) {
      result[key] = {
        title: hover[key].title,
        subtitle: hover[key].subtitle,
        image: hoverImages[key],
      };
    }
  });
  return result;
}

function getNavItemsWithLang(lang: string) {
  const prefix = `/${lang.toLowerCase()}`;
  const translations = locales[lang.toLowerCase()] || roLocale;
  const nav = translations.Header?.nav || {};
  const items = nav.items || {};
  return [
    { label: nav.resources, dropdown: [
      { title: items.blog, href: `${prefix}/blog`, key: 'blog' },
      { title: items.news, href: `${prefix}/news`, key: 'news' },
      { title: items.guides, href: `${prefix}/guides`, key: 'guides' },
      { title: items.documentation, href: `${prefix}/documentation`, key: 'documentation' },
      { title: items.faq, href: `${prefix}/faq`, key: 'faq' },
      { title: items.roiCalculator, href: `${prefix}/roi-calculator`, key: 'roiCalculator' },
    ] },
    { label: nav.company, dropdown: [
      { title: items.about, href: `${prefix}/about`, key: 'about' },
      { title: items.career, href: `${prefix}/carier`, key: 'career' },
      { title: items.partners, href: `${prefix}/parteneri`, key: 'partners' },
      { title: items.trustCenter, href: `${prefix}/trustcenter`, key: 'trustCenter' },
      { title: items.contacts, href: `${prefix}/contact`, key: 'contacts' },
    ] },
    { label: nav.integrations, href: `${prefix}/integrations` },
    { label: nav.pricing, href: `${prefix}/pricing` },
  ];
}

const sponsorsData = [
  {
    text: '🏆 We won 1st Place at ElevenLabs Hackathon – $20,000 for our AI Agents',
    url: '/blog/elevenlabs-hackathon-winner',
  },
  {
    text: '🚀 EBRD selected Aichat.md for the prestigious Star Venture Program',
    url: '/blog/ebrd-star-venture-program',
  },
  {
    text: '🥈 2nd Place at Sevan Startup Summit – $6,000 award for Aichat.md',
    url: '/blog/sevan-startup-summit-second-place',
  },
  {
    text: '🏅 Winner of the YoHealth Challenge at Sevan',
    url: '/blog/sevan-startup-summit-second-place',
  },
  {
    text: '🚀 Backed by Google Cloud – $25K grant to scale our AI infrastructure',
    url: '/blog/google-cloud-partnership-grant',
  },
  {
    text: '🔥 Part of UpNext Accelerator by Dreamups – with $10K start funding to grow Aichat.md',
    url: '/blog/upnext-accelerator-partnership',
  },
];

const duplicatedSponsors = [...sponsorsData, ...sponsorsData, ...sponsorsData];
  

export default function NavigationHeaderPillStatic({
  logoSrc,
  logoAlt = 'Bravin AI',
  leftImageSrc,
  rightImageSrc,
}: NavigationHeaderPillStaticProps) {

  const [isScrolled, setIsScrolled] = React.useState(false)
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [expandedMobileSection, setExpandedMobileSection] = React.useState<string | null>(null)
  const closeTimeout = React.useRef<NodeJS.Timeout | null>(null)
  const [hoveredDropdownIndex, setHoveredDropdownIndex] = React.useState<number | null>(null)
  const [activeDropdownIndex, setActiveDropdownIndex] = React.useState<number>(0) // Păstrează indexul activ pentru container
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('RO');

  // Get translated button texts from common section (must be after currentLanguage is defined)
  const translations = locales[currentLanguage.toLowerCase()] || roLocale;
  const signInText = translations.common?.signIn || 'Sign In';
  const getStartedText = translations.common?.getStarted || 'Get Started';
  
  // Hook-uri pentru routing
  const router = useRouter();
  const pathname = usePathname();

  // Detectează limba din URL
  useEffect(() => {
    const langMatch = pathname.match(/^\/([a-z]{2})/);
    if (langMatch) {
      setCurrentLanguage(langMatch[1].toUpperCase());
    }
  }, [pathname]);

  // Funcție pentru schimbarea limbii
  const changeLanguage = (newLang: string) => {
    const langCode = newLang.toLowerCase();
    setCurrentLanguage(newLang);
    
    const currentPath = pathname;
    const langMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/);
    
    if (langMatch) {
      // Înlocuiește limba existentă
      const newPath = `/${langCode}${langMatch[2] || ''}`;
      router.push(newPath);
    } else {
      // Adaugă limba la path-ul curent
      const newPath = `/${langCode}${currentPath === '/' ? '' : currentPath}`;
      router.push(newPath);
    }
  };

  const tickerStyles = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '32px',
    background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
    overflow: 'hidden',
    zIndex: 10000,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  };

  const tickerTrackStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '120px', // Perfect spacing between sponsors
    whiteSpace: 'nowrap' as const,
    animation: 'ticker-smooth-roll 120s linear infinite',
    willChange: 'transform', // Optimize for smooth animation
  };

  const tickerItemStyles = {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.5px',
    display: 'inline-block',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
    minWidth: 'max-content',
    opacity: 0.95,
    cursor: 'pointer',
    transition: 'text-decoration 0.2s, transform 0.18s cubic-bezier(0.4,0,0.2,1)',
    textDecoration: 'none',
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('ticker-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ticker-keyframes';
      style.innerHTML = `
        @keyframes ticker-smooth-roll { 
          0% { 
            transform: translateX(0%); 
          } 
          100% { 
            transform: translateX(-33.333%); 
          } 
        }
        .ticker-track {
          animation-play-state: running;
        }
        .ticker-track.ticker-paused {
          animation-play-state: paused !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Reset expanded section when menu closes
      setExpandedMobileSection(null)
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Smooth timing
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'

  // Layout values for both states
  const top = isScrolled ? 42 : 37 // 5px lower when at top (ticker is 32px + 5px)
  const width = isScrolled ? 'min(1120px, 92vw)' : 'min(1280px, 96vw)'
  const radius = isScrolled ? 9999 : 14
  const bg = isScrolled ? 'rgba(0,0,0,0.72)' : 'rgba(0,0,0,0.82)'
  const border = '1px solid rgba(255,255,255,0.12)'
  const blur = isScrolled ? '12px' : '10px'
  const shadow = isScrolled
    ? '0 8px 28px -14px rgba(0,0,0,0.45)'
    : '0 10px 32px -18px rgba(0,0,0,0.35)'

  // Dropdown handlers with improved timing to prevent flickering
  const handleDropdown = (label: string | null) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setOpenDropdown(label)
  }
  const handleDropdownDelayedClose = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current)
    closeTimeout.current = setTimeout(() => setOpenDropdown(null), 350) // Increased delay for better UX
  }

  const navItemsWithLang = getNavItemsWithLang(currentLanguage);
  const hoverContent = getHoverContent(currentLanguage);
  return (
  <header role="banner" className="fixed z-[9999] top-0 left-1/2 -translate-x-1/2 w-full">
      {/* Sponsors ticker line */}
  <div style={{...tickerStyles, pointerEvents: 'auto'}}>
        <div
          style={{ ...tickerTrackStyles, animationPlayState: isTickerPaused ? 'paused' : 'running', pointerEvents: 'auto' }}
          className={`ticker-track${isTickerPaused ? ' ticker-paused' : ''}`}
        >
          {duplicatedSponsors.map((item, idx) => (
            <a
              href={item.url}
              key={`sponsor-${idx}`}
              style={{...tickerItemStyles, pointerEvents: 'auto'}}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={e => {
                setIsTickerPaused(true);
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                setIsTickerPaused(false);
                e.currentTarget.style.transform = 'none';
              }}
              tabIndex={0}
              onFocus={e => {
                setIsTickerPaused(true);
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onBlur={e => {
                setIsTickerPaused(false);
                e.currentTarget.style.transform = 'none';
              }}
              className="hover:underline focus:underline"
            >
              {item.text}
            </a>
          ))}
        </div>
      </div>
      {/* Inner shell that morphs - ascuns complet cand popup-ul mobil este deschis */}
      {!isMobileMenuOpen && (
        <div
          className={
            'pointer-events-auto ' +
            (!isScrolled ? 'rounded-full' : '')
          }
          style={{
            position: 'absolute',
            top,
            left: '50%',
            transform: 'translateX(-50%)',
            width,
            borderRadius: isScrolled ? radius : 9999,
            background: bg,
            border,
            backdropFilter: `blur(${blur})`,
            WebkitBackdropFilter: `blur(${blur})`,
            boxShadow: shadow,
            willChange: 'backdrop-filter, -webkit-backdrop-filter',
            transitionProperty:
              'top, width, border-radius, background-color, backdrop-filter, -webkit-backdrop-filter, box-shadow',
            transitionDuration: '420ms',
            transitionTimingFunction: ease,
          }}
        >
          <div className="px-4 sm:px-5 md:px-6">
            <nav className="h-14 md:h-[60px] flex items-center gap-3 text-white/90 relative">
              {/* Left decorative image (optional) */}
              {leftImageSrc && (
                <div className="hidden sm:block shrink-0 pl-1">
                  <Image src={leftImageSrc} alt="" width={28} height={28} className="rounded" />
                </div>
              )}
              {/* Logo */}
              {logoSrc ? (
                <Link href={`/${currentLanguage.toLowerCase()}`} aria-label="Home" className="inline-flex items-center gap-2">
                  <Image src={logoSrc} alt={logoAlt} width={96} height={24} className="h-5 w-auto" />
                </Link>
              ) : (
                <Link href={`/${currentLanguage.toLowerCase()}`} className="inline-flex items-baseline font-bold tracking-tight text-white text-lg relative" aria-label="Home">
                  <span>Bravin</span>
                  <span
                    style={{
                      fontSize: '0.65em',
                      position: 'relative',
                      top: '-0.7em',
                      left: '0.1em',
                      fontWeight: 700,
                      letterSpacing: '0.01em',
                      opacity: 0.85
                    }}
                    className="text-xs text-white/80 select-none"
                  >AI</span>
                </Link>
              )}
              {/* Center nav (desktop only) */}
              <ul className="hidden lg:flex items-center gap-1.5 mx-auto relative z-10">
                {navItemsWithLang.map((item) => {
                  if (item.dropdown) {
                    return (
                      <li
                        key={item.label}
                        className="relative"
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <button
                          type="button"
                          className={
                            'inline-flex items-center h-9 px-3 select-none transition-all duration-300 ease-out ' +
                            (openDropdown === item.label
                              ? 'bg-white text-black rounded-t-xl rounded-b-none border-x border-t border-black border-b-0 border-opacity-100'
                              : 'text-white hover:text-white border-x border-t border-black border-b-0 border-opacity-0 rounded-t-xl rounded-b-none')
                          }
                          tabIndex={0}
                          aria-expanded={openDropdown === item.label}
                          aria-haspopup="true"
                          onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        >
                          {item.label}
                          <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="none">
                            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {openDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, y: 0 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 0 }}
                              transition={{ 
                                type: 'spring', 
                                stiffness: 260, 
                                damping: 26, 
                                mass: 0.8,
                                duration: 0.4
                              }}
                              className="fixed left-[calc(50%-430px)] top-[48px] w-[860px] min-h-[340px] bg-[#fff] text-black py-6 px-8 flex flex-col gap-3 pointer-events-auto rounded-xl border border-black border-t-0 overflow-y-auto"
                                style={{ zIndex: 999 }}
                            >
                              <motion.div
                                className="flex flex-row w-full items-start gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                style={{ minHeight: '340px', display: 'flex', justifyContent: 'space-between' }}
                              >
                                {/* Lista dropdown */}
                                <div className="flex flex-col items-start gap-2 w-[300px]">
                                  {item.dropdown.map((drop, index) => (
                                    <motion.div
                                      key={drop.title}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.1 + index * 0.04, duration: 0.28 }}
                                      className={`${(hoveredDropdownIndex === null && activeDropdownIndex === index) || hoveredDropdownIndex === index ? 'bg-[#f7f7f7] rounded-lg' : ''} w-[300px]`}
                                      onMouseEnter={() => {
                                        setHoveredDropdownIndex(index);
                                        setActiveDropdownIndex(index);
                                      }}
                                      onMouseLeave={() => setHoveredDropdownIndex(null)}
                                    >
                                      <Link
                                        href={drop.href}
                                        className={`block py-3 px-3 rounded-lg transition-all duration-200 hover:scale-[1.02] group focus:bg-[#f7f7f7] text-left ${(hoveredDropdownIndex === null && activeDropdownIndex === index) || hoveredDropdownIndex === index ? 'bg-[#f7f7f7] text-black' : 'hover:bg-[#f7f7f7] hover:text-black focus:text-black'}`}
                                        tabIndex={0}
                                      >
                                        <div className="font-semibold text-black text-[16px] leading-tight mb-1 transition-colors text-left">
                                          {drop.title}
                                        </div>
                                        {'desc' in drop && (
                                          <div className="text-gray-600 text-[14px] leading-snug transition-colors text-left">
                                            {(drop as any).desc}
                                          </div>
                                        )}
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                                {/* Container dreapta la hover sau default Blog */}
                                {(hoveredDropdownIndex !== null || activeDropdownIndex !== null) && (() => {
                                  const currentIndex = hoveredDropdownIndex !== null ? hoveredDropdownIndex : activeDropdownIndex;
                                  const dropdownArray = Array.isArray(item.dropdown) ? item.dropdown : undefined;
                                  // Safeguard: pick currentIndex if available, otherwise fallback to first entry
                                  const drop = dropdownArray ? (dropdownArray[currentIndex] ?? dropdownArray[0]) : undefined;
                                  if (!drop) return null; // nothing to show on the right side
                                  const hoverKey = (drop as any).key;
                                  const hoverData = hoverContent[hoverKey];
                                  return (
                                    <div 
                                      className="w-[60%] border border-gray-300 flex flex-col justify-center items-start px-10 py-8 overflow-hidden cursor-pointer" 
                                      style={{ borderRadius: 0, position: 'absolute', right: 0, top: 0, bottom: 0, height: '100%' }}
                                      onMouseEnter={() => {
                                        // Păstrăm containerul vizibil când intrăm pe el
                                      }}
                                      onMouseLeave={() => {
                                        // Resetăm la starea default când ieșim din container
                                        setHoveredDropdownIndex(null);
                                        setActiveDropdownIndex(0);
                                      }}
                                      onClick={() => {
                                        window.location.href = drop.href;
                                      }}
                                    >
                                      {hoverData?.image && typeof hoverData.image === 'string' && (
                                        <div style={{
                                          position: 'absolute',
                                          top: '80px',
                                          right: '10px',
                                          width: '330px',
                                          height: '330px',
                                          zIndex: 0,
                                          backgroundImage: `url(${hoverData.image.replace('public/', '/')})`,
                                          backgroundSize: 'contain',
                                          backgroundRepeat: 'no-repeat',
                                          backgroundPosition: 'top right',
                                          opacity: 0.8,
                                          pointerEvents: 'none',
                                        }} />
                                      )}
                                      <div className="relative z-10 flex flex-col h-full justify-between">
                                        {hoverData ? (
                                          <>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                                              <div className="text-5xl font-extrabold text-black mb-2 text-left w-full" style={{ marginTop: '24px' }}>
                                                <span style={{ display: 'inline-block', maxWidth: '340px', wordBreak: 'break-word', textAlign: 'left' }}>
                                                  {hoverData.title}
                                                </span>
                                              </div>
                                            </div>
                                            <div>
                                              <div className="text-gray-700 text-base">
                                                {hoverData.subtitle}
                                              </div>
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-2xl font-bold text-black mb-2">
                                              {drop.title}
                                            </div>
                                            {'desc' in drop && (
                                              <div className="text-gray-700 text-base">
                                                {(drop as any).desc}
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    )
                  }
                  return (
                    <li key={item.label} className="relative">
                      <Link
                        href={item.href}
                        className="inline-flex items-center h-9 px-3 transition-all duration-300 ease-out text-white/85 hover:text-white hover:bg-white/10 rounded-full"
                        tabIndex={0}
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
              {/* Mobile burger button */}
              <button
                type="button"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-auto lg:hidden relative w-9 h-9 inline-flex items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:border-white/40"
              >
                <span className="sr-only">Open menu</span>
                <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                  <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'}`}></span>
                  <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'}`}></span>
                </div>
              </button>
              {/* Right controls (desktop only) */}
              <div className="ml-auto hidden lg:flex items-center gap-2">
                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsLanguageDropdownOpen(false), 150)}
                    className="inline-flex items-center h-9 px-3 rounded-full text-white/85 hover:text-white hover:bg-white/10 transition-all duration-200"
                    aria-label="Select language"
                  >
                    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden>
                      <path
                        d="M12 2a10 10 0 100 20 10 10 0 000-20Zm0 0c2.5 0 5 4.03 5 10s-2.5 10-5 10-5-4.03-5-10 2.5-10 5-10Zm-9 10h18M3.5 8h17M3.5 16h17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    {currentLanguage}
                    <svg 
                      className={`ml-2 h-3 w-3 transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="none"
                    >
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  
                  {/* Language Dropdown */}
                  <AnimatePresence>
                    {isLanguageDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-full right-0 mt-2 w-32 bg-white/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              changeLanguage('RO');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-black/5 ${
                              currentLanguage === 'RO' ? 'text-black bg-black/5' : 'text-gray-700'
                            }`}
                          >
                            Română
                          </button>
                          <button
                            onClick={() => {
                              changeLanguage('EN');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-black/5 ${
                              currentLanguage === 'EN' ? 'text-black bg-black/5' : 'text-gray-700'
                            }`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => {
                              changeLanguage('RU');
                              setIsLanguageDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:bg-black/5 ${
                              currentLanguage === 'RU' ? 'text-black bg-black/5' : 'text-gray-700'
                            }`}
                          >
                            Русский
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  href="https://aichat.md/en/register"
                  className="min-w-[90px] h-9 inline-flex items-center justify-center rounded-[16px] px-4 font-semibold bg-white text-black border border-black"
                >
                  {signInText}
                </Link>
                <Link
                  href="https://aichat.md/en/login"
                  className="min-w-[90px] h-9 inline-flex items-center justify-center rounded-[16px] px-4 font-semibold bg-black text-white border border-black"
                >
                  {getStartedText}
                </Link>
                {rightImageSrc && (
                  <div className="hidden sm:block shrink-0 pr-1">
                    <Image src={rightImageSrc} alt="" width={28} height={28} className="rounded" />
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-md pointer-events-auto flex items-start justify-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Expanded Navigation Container */}
          <div
            className="bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden rounded-t-full"
            style={{
              width: isScrolled ? 'min(1120px, 92vw)' : 'min(1280px, 96vw)',
              borderRadius: '16px',
              background: isScrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.90)',
              position: 'absolute',
              top: isScrolled ? 48 : 32,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Mobile Menu Header - Same as original navbar */}
              <motion.div 
                className="px-4 sm:px-5 md:px-6"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                <div className="h-14 md:h-[60px] flex items-center gap-3 text-white/90 relative">
                  {/* Logo */}
                  <div className="shrink-0">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="inline-flex items-baseline font-bold tracking-tight text-white text-lg relative" aria-label="Home">
                      <span>Bravin</span>
                      <span
                        style={{
                          fontSize: '0.65em',
                          position: 'relative',
                          top: '-0.7em',
                          left: '0.1em',
                          fontWeight: 700,
                          letterSpacing: '0.01em',
                          opacity: 0.85
                        }}
                        className="text-xs text-white/80 select-none"
                      >AI</span>
                    </Link>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    aria-label="Close mobile menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="ml-auto w-9 h-9 inline-flex items-center justify-center rounded-md border border-white/20 text-white transition-colors hover:border-white/40"
                  >
                    <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                      <span className="block h-0.5 w-5 bg-current transition-all duration-300 rotate-45 translate-y-0"></span>
                      <span className="block h-0.5 w-5 bg-current transition-all duration-300 opacity-0"></span>
                      <span className="block h-0.5 w-5 bg-current transition-all duration-300 -rotate-45 translate-y-0"></span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Mobile Menu Content */}
              <motion.div 
                className="border-t border-white/10"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <nav className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
                  {navItemsWithLang.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setExpandedMobileSection(
                              expandedMobileSection === item.label ? null : item.label
                            )}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-left text-white font-medium hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <span>{item.label}</span>
                            <motion.svg 
                              className="w-4 h-4 text-white/70"
                              viewBox="0 0 20 20" 
                              fill="none"
                              animate={{ 
                                rotate: expandedMobileSection === item.label ? 180 : 0 
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <path 
                                d="M6 8l4 4 4-4" 
                                stroke="currentColor" 
                                strokeWidth="1.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                              />
                            </motion.svg>
                          </button>
                          <AnimatePresence>
                            {expandedMobileSection === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="pl-6 space-y-1 pt-1">
                                  {item.dropdown.map((drop, index) => (
                                    <motion.div
                                      key={drop.title}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.05, duration: 0.2 }}
                                    >
                                      <Link
                                        href={drop.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                      >
                                        <div className="font-medium">{drop.title}</div>
                                      </Link>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-3 py-2.5 text-white font-medium hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>

                {/* Mobile Language Selector */}
                <div className="border-t border-white/10 px-6 py-4">
                  <div className="mb-4">
                    <h3 className="text-white/70 text-sm font-medium mb-3">Limba / Language</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setCurrentLanguage('RO');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentLanguage === 'RO' 
                            ? 'bg-white text-black' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Română
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLanguage('EN');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentLanguage === 'EN' 
                            ? 'bg-white text-black' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLanguage('RU');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-2.5 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          currentLanguage === 'RU' 
                            ? 'bg-white text-black' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Русский
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Menu Footer */}
                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center justify-center space-x-3">
                      <Link
                        href="https://aichat.md/en/register"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-2.5 px-4 text-center text-sm font-semibold border border-white/30 rounded-xl text-white hover:bg-white/10 transition-colors"
                      >
                        {signInText}
                      </Link>
                      <Link
                        href="https://aichat.md/en/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-2.5 px-4 text-center text-sm font-semibold bg-white text-black rounded-xl hover:bg-white/90 transition-colors"
                      >
                        {getStartedText}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
    </header>
  )
}
