'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SimpleBeamsBackground = dynamic(() => import('@/components/ui/SimpleBeamsBackground'), {
  ssr: false,
});
import en from '@/locales/en.json';
import ro from '@/locales/ro.json';
import ru from '@/locales/ru.json';

export default function DemoSectionDesktop() {
  const keypadRef = useRef<HTMLDivElement>(null);
  const [shake, setShake] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [holdActive, setHoldActive] = useState(false);

  // --- i18n (per-component lightweight) ---
  const LOCALES: Record<string, any> = { en, ro, ru };
  const [lang, setLang] = useState<'en' | 'ro' | 'ru'>(() => 'en');

  useEffect(() => {
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : '';
      if (path === 'ro' || path === 'ru' || path === 'en') {
        setLang(path as 'en' | 'ro' | 'ru');
        return;
      }
  const nav = typeof navigator !== 'undefined' ? (navigator.language || '') : '';
      if (nav.startsWith('ro')) setLang('ro');
      else if (nav.startsWith('ru')) setLang('ru');
      else setLang('en');
    } catch (e) {
      setLang('en');
    }
  }, []);

  const t = (path: string, fallback?: string) => {
    const translations = LOCALES[lang] ?? LOCALES.en;
    const parts = path.split('.');
    let cur: any = translations;
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) return fallback ?? '';
    }
    return typeof cur === 'string' ? cur : fallback ?? '';
  };

  // Pentru long-press backspace interval
  const backspaceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Ref pentru secțiunea principală
  const sectionRef = useRef<HTMLElement>(null);
  
  // State pentru a urmări dacă secțiunea este vizibilă
  const [isInView, setIsInView] = useState(false);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (backspaceIntervalRef.current) {
        clearInterval(backspaceIntervalRef.current);
        backspaceIntervalRef.current = null;
      }
    };
  }, []);

  // Intersection Observer pentru a detecta când secțiunea este vizibilă
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.3, // Se activează când 30% din secțiune este vizibilă
        rootMargin: '0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Listen for keyboard input globally (digits, plus, backspace) - DOAR când secțiunea este vizibilă
  useEffect(() => {
    if (!isInView) return; // Nu adăuga event listener dacă secțiunea nu este vizibilă

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle digits and plus
      if (/^[0-9]$/.test(e.key) || e.key === '+') {
        e.preventDefault();
        const input = inputRef.current;
        if (!input) return;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        setInputValue(prev => prev.slice(0, start) + e.key + prev.slice(end));
        setTimeout(() => {
          if (input) {
            const caret = start + e.key.length;
            input.setSelectionRange(caret, caret);
            input.focus();
          }
        }, 0);
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInView]); // Dependența pe isInView

  // Backspace handler - delete at caret position
  const handleBackspace = () => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    
    if (start === end && start > 0) {
      // No selection, delete character before cursor
      setInputValue(prev => prev.slice(0, start - 1) + prev.slice(start));
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(start - 1, start - 1);
          input.focus();
        }
      }, 0);
    } else if (start !== end) {
      // Has selection, delete selected text
      setInputValue(prev => prev.slice(0, start) + prev.slice(end));
      setTimeout(() => {
        if (input) {
          input.setSelectionRange(start, start);
          input.focus();
        }
      }, 0);
    }
  };

  // Spacing variables for keypad buttons
  const horizontalSpacing = 20; // gap-x spacing between buttons horizontally
  const verticalSpacing = 20;   // gap-y spacing between buttons vertically

  // Calculate container width dynamically based on spacing
  const containerWidth = 240 + (horizontalSpacing * 2); // 3 buttons (240px) + 2 gaps

  // Keypad handler - insert at caret position
  const handleKeypad = (val: string) => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    setInputValue(prev => {
      return prev.slice(0, start) + val + prev.slice(end);
    });
    // update caret position after state update
    setTimeout(() => {
      if (input) {
        const caret = start + val.length;
        input.setSelectionRange(caret, caret);
        input.focus();
      }
    }, 0);
  };

  // Special handler for 0/+ button
  const handleZeroMouseDown = () => {
    setHoldActive(false);
    const timeout = setTimeout(() => {
      setInputValue((prev) => prev + '+');
      setHoldActive(true);
    }, 500);
    setHoldTimeout(timeout);
  };

  const handleZeroMouseUp = () => {
    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);
    }
    if (!holdActive) {
      setInputValue((prev) => prev + '0');
    }
    setHoldActive(false);
  };

  return (
    <section ref={sectionRef} className="relative min-h-[100vh] bg-black flex items-center overflow-hidden">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
        <SimpleBeamsBackground />
      </div>

      {/* Global vignette & tint for depth (kept but dimmer) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/20" />
        <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)] bg-black/5" />
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-12 lg:gap-[100px] relative z-20 px-4">
        {/* Left Content */}
  <div className="flex flex-col space-y-8 ml-5 w-full md:w-auto max-w-lg flex-shrink-0 -mt-36">
          {/* Card above title */}
          <div className="bg-white/80 border border-gray-300 rounded-lg px-4 py-2 shadow-md w-[150px] flex items-center justify-center">
            <span className="text-black text-sm font-medium text-center">{t('Demo.card', 'Prezentare Demo')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            {t('Demo.title', 'Experimentează Puterea AI')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/80 leading-relaxed max-w-lg">
            {t('Demo.subtitle', 'Descoperă cum agentul nostru AI poate transforma complet experiența clienților tăi în doar câteva minute.')}
          </p>

          {/* Button */}
          <button
            className={`bg-white w-[230px] text-black font-semibold py-3 px-8 rounded-full text-1xl transition-all duration-300 hover:bg-black hover:text-white border-2 border-white ${
              shake ? 'animate-pulse' : ''
            }`}
            onClick={() => {
              setShake(true);
              // Vibrație smooth la toate butoanele keypad
              if (keypadRef.current) {
                const btns = keypadRef.current.querySelectorAll('button');
                btns.forEach(btn => btn.classList.add('vibrate-smooth'));
                setTimeout(() => {
                  btns.forEach(btn => btn.classList.remove('vibrate-smooth'));
                }, 900);
              }
              setTimeout(() => setShake(false), 500);
            }}
          >
            {t('Demo.button', 'Testează Demo-ul')}
          </button>
        </div>

        {/* Right Container – iOS26-like glass: subtler, more transparent center, background zoom */}
        <div className="flex-shrink-0 w-full md:w-auto mt-8 md:mt-0 max-w-full">
      {/* <div className="relative h-[700px] w-[800px] rounded-[28px] overflow-hidden bg-white/5 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-[26px] backdrop-saturate-150 backdrop-contrast-125 ring-1 ring-white/10"> */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] w-full sm:w-[500px] md:w-[500px] lg:w-[500px] overflow-hidden mx-auto">
            {/* FAUX BACKDROP ZOOM LAYER */}
            

            {/* Radial mask to make the center more transparent and edges slightly denser */}
            {/* <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(80%_80%_at_50%_50%,black_60%,transparent)]"/> */}

            {/* Subtle highlight & edge strokes (dimmed) */}
            {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18),inset_0_0_24px_rgba(255,255,255,0.06)]" /> */}

            {/* Soft inner bottom glow (dim) */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/8 to-transparent" />

            {/* Very light noise for realism */}
            {/* <div
              className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)',
                backgroundSize: '3px 3px'
              }}
            /> */}

            {/* INPUT STRIP – glass, with center extra transparent */}
            {/* <div className="absolute top-[4%] left-[10%] w-[80%] h-[14%] rounded-2xl flex items-center justify-center bg-white/6 border border-white/20 backdrop-blur-[24px] backdrop-saturate-200 shadow-[0_10px_24px_rgba(0,0,0,0.30)] [mask-image:radial-gradient(120%_120%_at_50%_50%,black_55%,transparent)]"> */}
            <div className="absolute top-[4%] left-[18%] w-[80%] h-[14%] rounded-2xl flex items-center justify-center">
              {/* <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]" /> */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl" />
              {/* <div className="pointer-events-none absolute -top-8 left-6 w-40 h-14 rotate-[8deg] bg-gradient-to-r from-white/20 to-transparent blur-md" /> */}
              <div className="pointer-events-none absolute -top-8 left-6 w-40 h-14 rotate-[8deg]" />

              <div className="relative w-full h-full flex items-center justify-center">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9+*#]*"
                  className="w-full h-full bg-transparent rounded-2xl text-center text-white outline-none border-none transition-all placeholder-white/60"
                  style={{
                    MozAppearance: 'textfield',
                    fontSize:
                      inputValue.length <= 6 ? '2.7rem' :
                      inputValue.length <= 10 ? '2.5rem' :
                      inputValue.length <= 14 ? '2.3rem' :
                      '2.1rem',
                    fontWeight: 500,
                    textShadow: '0 1px 2px rgba(0,0,0,0.35)'
                  }}
                  value={inputValue}
                  onChange={e => {
                    const val = e.target.value;
                    if (/^[0-9+*#]*$/.test(val)) {
                      setInputValue(val);
                    }
                  }}
                  onPaste={e => {
                    const paste = e.clipboardData.getData('text');
                    if (!/^[0-9+*#]*$/.test(paste)) {
                      e.preventDefault();
                    }
                  }}
                />
                {inputValue.length === 0 && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[2px] h-[60%] bg-white ai-blink"
                  />
                )}
              </div>
              <style>{`
                [type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                [type=number] { -moz-appearance: textfield; }
                @keyframes aiBlink { 0%,49%{opacity:1;} 50%,100%{opacity:0;} }
                .ai-blink { animation: aiBlink 1s steps(1) infinite; }
                .vibrate-smooth {
                  animation: vibrateSmooth 0.9s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes vibrateSmooth {
                  0% { transform: translateX(0); }
                  10% { transform: translateX(-2px); }
                  20% { transform: translateX(2px); }
                  30% { transform: translateX(-2px); }
                  40% { transform: translateX(2px); }
                  50% { transform: translateX(-1.5px); }
                  60% { transform: translateX(1.5px); }
                  70% { transform: translateX(-1px); }
                  80% { transform: translateX(1px); }
                  90% { transform: translateX(-0.5px); }
                  100% { transform: translateX(0); }
                }
              `}</style>
            </div>

            {/* KEYPAD */}
            <div className="absolute left-[30%] top-[24%]" style={{ width: `${containerWidth}px` }} ref={keypadRef}>
              <div
                className="grid grid-cols-3 select-none"
                style={{ gap: `${verticalSpacing}px ${horizontalSpacing}px`, WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }}
                onContextMenu={e => e.preventDefault()}
              >
                {/* Helper class string for buttons */}
                {/** We keep inline classes to avoid extracting a component */}

                {/* Row 1 */}
                <button aria-label="1" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white">
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span onClick={() => handleKeypad('1')} className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">1</span>
                  </span>
                </button>

                <button aria-label="2 ABC" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('2')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">2</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">ABC</span>
                  </span>
                </button>

                <button aria-label="3 DEF" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('3')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">3</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">DEF</span>
                  </span>
                </button>

                {/* Row 2 */}
                <button aria-label="4 GHI" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('4')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">4</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">GHI</span>
                  </span>
                </button>

                <button aria-label="5 JKL" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('5')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">5</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">JKL</span>
                  </span>
                </button>

                <button aria-label="6 MNO" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('6')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">6</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">MNO</span>
                  </span>
                </button>

                {/* Row 3 */}
                <button aria-label="7 PQRS" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('7')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">7</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">PQRS</span>
                  </span>
                </button>

                <button aria-label="8 TUV" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('8')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">8</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">TUV</span>
                  </span>
                </button>

                <button aria-label="9 WXYZ" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('9')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                    <span className="text-3xl font-medium leading-none drop-shadow">9</span>
                    <span className="text-[10px] tracking-widest mt-1 text-white/75">WXYZ</span>
                  </span>
                </button>

                {/* Row 4 */}
                <button aria-label="asterisk" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('*')}>
                  <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                  <span className="relative z-[1] flex items-center justify-center w-full h-full text-3xl leading-none">*</span>
                </button>

                <div className="flex flex-col items-center">
                  <button
                    aria-label="0 plus"
                    className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white"
                    onMouseDown={handleZeroMouseDown}
                    onMouseUp={handleZeroMouseUp}
                    onTouchStart={handleZeroMouseDown}
                    onTouchEnd={handleZeroMouseUp}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                    <span className="relative z-[1] flex flex-col items-center justify-center w-full h-full">
                      <span className="text-3xl font-medium leading-none drop-shadow">0</span>
                      <span className="text-[10px] tracking-widest mt-1">+</span>
                    </span>
                  </button>

                  {/* Call button (keep tint but dim border/highlight) */}
                  <button
                    aria-label="call"
                    className="mt-[20px] w-20 h-20 rounded-full bg-green-400/25 hover:bg-green-400/35 active:bg-green-400/45 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 flex items-center justify-center shadow-[0_12px_26px_rgba(0,0,0,0.35)] relative"
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]" />
                    <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto my-auto translate-y-[3px] drop-shadow">
                      <path d="M16.5562 12.9062L16.1007 13.359C16.1007 13.359 15.0181 14.4355 12.0631 11.4972C9.10812 8.55901 10.1907 7.48257 10.1907 7.48257L10.4775 7.19738C11.1841 6.49484 11.2507 5.36691 10.6342 4.54348L9.37326 2.85908C8.61028 1.83992 7.13596 1.70529 6.26145 2.57483L4.69185 4.13552C4.25823 4.56668 3.96765 5.12559 4.00289 5.74561C4.09304 7.33182 4.81071 10.7447 8.81536 14.7266C13.0621 18.9492 17.0468 19.117 18.6763 18.9651C19.1917 18.9171 19.6399 18.6546 20.0011 18.2954L21.4217 16.883C22.3806 15.9295 22.1102 14.2949 20.8833 13.628L18.9728 12.5894C18.1672 12.1515 17.1858 12.2801 16.5562 12.9062Z" />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-col items-center">
                  <button aria-label="hash" className="group w-20 h-20 rounded-full bg-white/8 hover:bg-white/12 active:bg-white/15 border border-white/20 backdrop-blur-[22px] backdrop-saturate-150 shadow-[0_10px_22px_rgba(0,0,0,0.30)] transition relative text-white" onClick={() => handleKeypad('#')}>
                    <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20)]" />
                    <span className="relative z-[1] flex items-center justify-center w-full h-full text-3xl leading-none">#</span>
                  </button>

                  {/* Backspace */}
                  <div className="mt-[20px] h-20 flex items-center justify-center">
                    <div
                      className={`transition-all duration-200 ease-out ${inputValue.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
                      style={{ display: 'inline-block' }}
                    >
                      <button
                        aria-label="backspace"
                        onClick={handleBackspace}
                        onMouseDown={() => {
                          if (backspaceIntervalRef.current) return;
                          backspaceIntervalRef.current = setInterval(() => {
                            handleBackspace();
                          }, 150);
                        }}
                        onMouseUp={() => {
                          if (backspaceIntervalRef.current) {
                            clearInterval(backspaceIntervalRef.current);
                            backspaceIntervalRef.current = null;
                          }
                        }}
                        onMouseLeave={() => {
                          if (backspaceIntervalRef.current) {
                            clearInterval(backspaceIntervalRef.current);
                            backspaceIntervalRef.current = null;
                          }
                        }}
                        onTouchStart={() => {
                          if (backspaceIntervalRef.current) return;
                          backspaceIntervalRef.current = setInterval(() => {
                            handleBackspace();
                          }, 150);
                        }}
                        onTouchEnd={() => {
                          if (backspaceIntervalRef.current) {
                            clearInterval(backspaceIntervalRef.current);
                            backspaceIntervalRef.current = null;
                          }
                        }}
                        className="relative h-8 w-10 rounded-xl bg-white/8 hover:bg-white/12 active:bg-white/15 text-white flex items-center justify-center shadow border border-white/20 backdrop-blur-[22px] backdrop-saturate-150"
                        style={{
                          boxShadow: '0 8px 16px rgba(0,0,0,0.30), inset 0 0 0 1px rgba(255,255,255,0.20)'
                        }}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="6" y1="6" x2="18" y2="18" />
                          <line x1="6" y1="18" x2="18" y2="6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
