"use client";

import roLocale from '../../locales/ro.json';
import enLocale from '../../locales/en.json';
import ruLocale from '../../locales/ru.json';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const HowItWorksContainer1 = dynamic(() => import('./HowItWorksContainer1'));
const HowItWorksContainer2 = dynamic(() => import('./HowItWorksContainer2'));
const HowItWorksContainer3 = dynamic(() => import('./HowItWorksContainer3'));

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// All copy now sourced from locale JSON (HowItWorks / HowitWorks keys). No inline ROI copy.

export default function HowItWorks() {
  // Language detection from URL
  const pathname = typeof usePathname === 'function' ? usePathname() : '';
  const langMatch = pathname ? pathname.match(/^\/([a-z]{2})/) : null;
  const currentLanguage = langMatch ? langMatch[1].toLowerCase() : 'ro';

  const locales: Record<string, any> = { ro: roLocale, en: enLocale, ru: ruLocale };
  const _translations = locales[currentLanguage] || roLocale;
  const copy = _translations?.HowitWorks || _translations?.HowItWorks || { steps: [], cta: '' };

  type Step = { id: number; title: string; description: string };
  const steps: Step[] = (Array.isArray(copy?.steps) ? copy.steps : []).map((s: any, i: number) => ({
    id: typeof s.id === 'number' ? s.id : i + 1,
    title: s.title || `Step ${i + 1}`,
    description: s.description || ''
  }));
  const learnMore: string = String(copy?.cta || (copy as any)?.['Learn-more'] || '');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<SVGPathElement | null>(null);
  const line1Ref = useRef<SVGPathElement | null>(null);
  const line2Ref = useRef<SVGPathElement | null>(null);
  const line2ContinuedRef = useRef<SVGPathElement | null>(null);
  const line3Ref = useRef<SVGPathElement | null>(null);
  const line4Ref = useRef<SVGPathElement | null>(null);
  const line5Ref = useRef<SVGPathElement | null>(null);
  const line5ContinuedRef = useRef<SVGPathElement | null>(null);
  const line6Ref = useRef<SVGPathElement | null>(null);
  // refs for duplicate paths rendered in HowItWorksContainer2
  const line1_2Ref = useRef<SVGPathElement | null>(null);
  const line2_2Ref = useRef<SVGPathElement | null>(null);
  const line6_2Ref = useRef<SVGPathElement | null>(null);
  const line5_2Ref = useRef<SVGPathElement | null>(null);
  // Gradients (200-300 range) for each visible container icon
  const containerGradients: Record<number, string> = {
    7: 'linear-gradient(135deg,#f5d0fe 0%,#f9a8d4 100%)',   // fuchsia-200 -> pink-300
    10: 'linear-gradient(135deg,#bae6fd 0%,#7dd3fc 100%)',  // sky-200 -> sky-300
    11: 'linear-gradient(135deg,#e9d5ff 0%,#c4b5fd 100%)',  // purple-200 -> violet-300
    14: 'linear-gradient(135deg,#fbcfe8 0%,#fda4af 100%)',  // pink-200 -> rose-300
    15: 'linear-gradient(135deg,#fde68a 0%,#fcd34d 100%)',  // amber-200 -> amber-300
    18: 'linear-gradient(135deg,#c7d2fe 0%,#a5b4fc 100%)',  // indigo-200 -> indigo-300
    19: 'linear-gradient(135deg,#fecaca 0%,#fca5a5 100%)',  // red-200 -> red-300
    27: 'linear-gradient(135deg,#fed7aa 0%,#fdba74 100%)',  // orange-200 -> orange-300
    29: 'linear-gradient(135deg,#bbf7d0 0%,#6ee7b7 100%)',  // green-200 -> emerald-300
    32: 'linear-gradient(135deg,#a5f3fc 0%,#67e8f9 100%)',  // cyan-200 -> cyan-300
    35: 'linear-gradient(135deg,#d9f99d 0%,#bef264 100%)'   // lime-200 -> lime-300
  };
  const getGradientFor = (n: number) => containerGradients[n] || 'linear-gradient(135deg,#e5e7eb 0%,#d1d5db 100%)';
  // Visible containers (others hidden)
  const visibleContainers = [7,10,11,14,15,18,19,27,29,32,35];
  const INACTIVE_SIZE = 50; // baseline size
  const ACTIVE_SIZE = 38; // reduced size when active OR hover (visual contract)

  const isContainerActive = (num: number) => {
    // Evaluate membership on demand (avoid early reference to anim states)
    if ([7,10].includes(num) && line1Animating) return true;
    if ([11,18,29].includes(num) && line2Animating) return true;
    if ([14,32].includes(num) && line3Animating) return true;
  if ([32,35].includes(num) && line4Animating) return true;
    if ([15,19,27].includes(num) && line5Animating) return true;
    if ([19,27].includes(num) && line6Animating) return true;
    return false;
  };

  const renderIcon = (containerNum: number) => {
    const active = isContainerActive(containerNum);
    const baseStyle: React.CSSProperties = {
      background: getGradientFor(containerNum),
      WebkitMaskImage: `url(/HowItWorksSectin/container${containerNum}.svg)`,
      maskImage: `url(/HowItWorksSectin/container${containerNum}.svg)`,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskSize: '75% 75%',
      maskSize: '75% 75%',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    };
    return (
      <div className={`flex flex-col items-center h-full group/icon ${active ? 'justify-start pt-2' : 'justify-center pt-2 hover:justify-start hover:pt-2'}`}>
        <div
          role="img"
          aria-label={`Icon ${containerNum}`}
          style={{ ...baseStyle }}
          className={
            `transition-all duration-300 block filter ${active ? 'grayscale-0' : 'grayscale'} group-hover/icon:grayscale-0
             ${active ? 'mb-1' : 'mb-0'} ${active ? '' : 'group-hover/icon:mb-1'}`
          }
        >
          {/* sizing wrapper to allow smooth shrink */}
          <div className={`transition-all duration-300 mx-auto ${active ? 'w-[38px] h-[38px]' : 'w-[50px] h-[50px] group-hover/icon:w-[38px] group-hover/icon:h-[38px]'}`}></div>
        </div>
        <span className={`text-xs font-semibold text-gray-700 transition-all duration-300 
          ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover/icon:opacity-100 group-hover/icon:translate-y-0'}`}> 
          {containerNum === 7 ? 'Mesaj' : containerNum === 10 ? 'Text' : 'container'}
        </span>
      </div>
    );
  };
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Dynamic vertical offset for right panel (containers 1,2,3) depending on viewport height
  const [panelYOffset, setPanelYOffset] = useState(0);
  // Mouse follow orb state
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  // Fixed grid box (only over this section's currently visible area)
  const [gridBox, setGridBox] = useState<{ visible: boolean; left: number; width: number; top: number; height: number }>({ visible: false, left: 0, width: 0, top: 0, height: 0 });


  // ====================  Start(true) or Stop(false) animation for the lines in containers from the right  ======================
  const [animationsEnabled, setAnimationsEnabled] = useState(true);   // <==========    true or false       ======================
  // ====================  Start(true) or Stop(false) animation for the lines in containers from the right  ======================


  const [line1Animating, setLine1Animating] = useState(false);
  const [line2Animating, setLine2Animating] = useState(false);
  const [line3Animating, setLine3Animating] = useState(false);
  const [line4Animating, setLine4Animating] = useState(false);
  const [line5Animating, setLine5Animating] = useState(false);
  const [line6Animating, setLine6Animating] = useState(false);
  // Track active containers individually so repeated animations re-trigger correctly
  const [activeContainers, setActiveContainers] = useState<Set<number>>(new Set());
  const svgTimelineRef = useRef<any>(null);
  const [container3ResetKey, setContainer3ResetKey] = useState(0);

  const addActiveContainers = (nums: number[]) => {
    if (!nums || nums.length === 0) return;
    setActiveContainers(prev => {
      const s = new Set(prev);
      nums.forEach(n => s.add(n));
      return s;
    });
  };
  const removeActiveContainers = (nums: number[]) => {
    if (!nums || nums.length === 0) return;
    setActiveContainers(prev => {
      const s = new Set(prev);
      nums.forEach(n => s.delete(n));
      return s;
    });
  };
  // track visibility so we can reset animations each time the user returns
  const isInView = useInView(containerRef, { once: false, margin: '-80px' });

  // Generic reset helper: clears active flags, hides paths and restarts timeline so
  // when user returns to the section animations play from the start.
  const resetAllAnimations = useCallback(() => {
    // clear active container set & flags
    setActiveContainers(new Set());
    setLine1Animating(false);
    setLine2Animating(false);
    setLine3Animating(false);
    setLine4Animating(false);
    setLine5Animating(false);
    setLine6Animating(false);

    // reset SVG paths to their initial hidden state
    const refs = [lineRef, line1Ref, line1_2Ref, line2Ref, line2_2Ref, line2ContinuedRef, line3Ref, line4Ref, line5Ref, line5ContinuedRef, line5_2Ref, line6Ref, line6_2Ref];
    refs.forEach(r => {
      try {
        const p = r.current;
        if (!p) return;
        const L = p.getTotalLength();
        gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, opacity: 0 });
      } catch (e) {
        // ignore paths that are not mounted yet
      }
    });

    // reset the connecting line if present
    if (lineRef.current) {
      try {
        const p = lineRef.current;
        const L = p.getTotalLength();
        gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, opacity: 0 });
      } catch (e) {}
    }

    // restart or recreate the timeline so it plays from the beginning
    if (svgTimelineRef.current && typeof svgTimelineRef.current.restart === 'function') {
      try {
        svgTimelineRef.current.restart(true, false);
      } catch (e) {
        // fallback: kill and null so the effect that creates it will recreate
        try { svgTimelineRef.current.kill(); } catch(e) {}
        svgTimelineRef.current = null;
      }
    }
  // signal child containers to reset internal sequences if they support it
  setContainer3ResetKey(k => k + 1);
  }, [lineRef, line1Ref, line1_2Ref, line2Ref, line2_2Ref, line2ContinuedRef, line3Ref, line4Ref, line5Ref, line5ContinuedRef, line5_2Ref, line6Ref, line6_2Ref, svgTimelineRef, setActiveContainers, setLine1Animating, setLine2Animating, setLine3Animating, setLine4Animating, setLine5Animating, setLine6Animating]);

  // When the section comes into view (every time), reset animations so they replay
  useEffect(() => {
    if (isInView) {
      resetAllAnimations();
    }
  }, [isInView, resetAllAnimations]);

  // IntersectionObserver fallback: ensure we reset on every re-entry reliably
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    const node = containerRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          resetAllAnimations();
        }
      });
    }, { root: null, rootMargin: '-80px', threshold: 0.05 });
    io.observe(node);
    return () => io.disconnect();
  }, [resetAllAnimations]);

  // Ensure container3's internal sequence resets each time the right panel shows step 3
  useEffect(() => {
    if (activeStep === 2) {
      // increment the key so the child restarts
      setContainer3ResetKey(k => k + 1);
    }
  }, [activeStep]);

  // Control SVG animations - set to true to enable, false to disable
  // You can toggle this with: setAnimationsEnabled(true) or setAnimationsEnabled(false)
  const toggleAnimations = () => setAnimationsEnabled(!animationsEnabled);

  // Map step index -> image path (reuse existing assets)
  const stepImages = [
    '/HowItWorksSectin/1stImageHowItWorks.png',
    '/HowItWorksSectin/2ndImageHowItWorks.png',
    '/HowItWorksSectin/3rdImageHowItWorks.png'
  ];

  // Ensure refs array length matches steps
  stepRefs.current = [];
  const setStepRef = (el: HTMLDivElement | null, i: number) => {
    if (el) stepRefs.current[i] = el;
  };

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute vertical lift for right panel based on viewport height so it sits a bit higher on shorter screens
  useEffect(() => {
    const calcOffset = () => {
      if (typeof window === 'undefined') return;
      // Move up to center the animations
      setPanelYOffset(-115);
    };
    calcOffset();
    window.addEventListener('resize', calcOffset);
    return () => window.removeEventListener('resize', calcOffset);
  }, []);

  // Mouse move listener & smooth lerp animation for orb
  useEffect(() => {
    const sectionEl = containerRef.current;
    if (!sectionEl) return;
    const handleMove = (e: MouseEvent) => {
      const rect = sectionEl.getBoundingClientRect();
      targetPosRef.current.x = e.clientX - rect.left;
      targetPosRef.current.y = e.clientY - rect.top;
    };
    sectionEl.addEventListener('mousemove', handleMove);
    return () => sectionEl.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      setOrbPos(prev => ({
        x: lerp(prev.x, targetPosRef.current.x, 0.12),
        y: lerp(prev.y, targetPosRef.current.y, 0.12)
      }));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Measure section intersection with viewport to bound fixed grid
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    const el = containerRef.current;
    let raf: number | null = null;
    const measure = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const visible = r.bottom > 0 && r.top < vh;
      if (!visible) {
        setGridBox(prev => prev.visible ? { ...prev, visible: false, height: 0 } : prev);
        return;
      }
      const top = Math.max(r.top, 0);
      const bottom = Math.min(r.bottom, vh);
      const height = Math.max(0, bottom - top);
      setGridBox({
        visible: true,
        left: r.left,
        width: r.width,
        top,
        height
      });
    };
    const onScrollOrResize = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    const ro = new ResizeObserver(onScrollOrResize);
    ro.observe(el);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      try { ro.disconnect(); } catch {}
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ScrollTrigger setup for pinning and step activation
  useEffect(() => {
    if (isMobile || !containerRef.current || !rightPanelRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    // Pin right panel for the height of the left column
    const pinST = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: () => {
        const containerH = containerRef.current!.offsetHeight;
        // Use the outer panel height (without translate) for calculation
        const panelH = rightPanelRef.current!.getBoundingClientRect().height;
        return `+=${containerH - panelH}`;
      },
      pin: rightPanelRef.current,
      pinSpacing: true,
      anticipatePin: 1,
    });

    // Create triggers per step
    const triggers: ScrollTrigger[] = stepRefs.current.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveStep(i),
        onEnterBack: () => setActiveStep(i),
      })
    );

    return () => {
      pinST.kill();
      triggers.forEach(t => t.kill());
    };
  }, [steps.length, isMobile]);

  // Animate image crossfade when activeStep changes (smoother timing)
  useEffect(() => {
    if (isMobile || !imageLayerRef.current) return;
    const container = imageLayerRef.current;
    const items = Array.from(container.querySelectorAll('.hiw-image-item')) as HTMLDivElement[];
    items.forEach((item, idx) => {
      const isActive = idx === activeStep;
      // faster crossfade
      gsap.to(item, { autoAlpha: isActive ? 1 : 0, scale: isActive ? 1 : 0.99, duration: 0.5, ease: 'sine.inOut' });
    });
  }, [activeStep, isMobile]);

  // Animate connecting line
  useEffect(() => {
    if (!lineRef.current) return;
    const path = lineRef.current;
    const pathLength = path.getTotalLength();
    gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.out',
      repeat: -1,
      repeatDelay: 1.5,
    });
  }, []);

  // Animate SVG lines in sequence
  useEffect(() => {
    if (!animationsEnabled) return;
    
  const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1, defaults: { ease: 'sine.inOut' } });
  // keep a reference so other effects (like activeStep change) can control it
  svgTimelineRef.current = timeline;

  // Helper function to animate a single path
  // containers: list of container ids that this path activation should mark as active
  const animatePath = (pathRef: React.RefObject<SVGPathElement | null>, position: string = '+=0.3', containers: number[] = [], onStart?: () => void, onComplete?: () => void) => {
      if (pathRef.current) {
        const path = pathRef.current;
        const pathLength = path.getTotalLength();
        
        // Set initial state - invisible
        gsap.set(path, { 
          strokeDasharray: pathLength, 
          strokeDashoffset: pathLength,
          opacity: 0 
        });
        
        // Add to timeline; wire start/complete to update per-container active set as well
        timeline
          .to(path, {
            opacity: 1,
            duration: 0.25,
            onStart: () => {
              if (onStart) onStart();
              addActiveContainers(containers);
            }
          }, position)
          .to(path, {
            strokeDashoffset: 0,
            duration: 1.2
          }, '<')
          .to(path, {
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              if (onComplete) onComplete();
              removeActiveContainers(containers);
            }
          }, '+=0.4');
      }
    };

    // Helper function to animate two paths together
  const animatePathsTogether = (pathRef1: React.RefObject<SVGPathElement>, pathRef2: React.RefObject<SVGPathElement>, position: string = '+=0.3', containers: number[] = [], onStart?: () => void, onComplete?: () => void) => {
      [pathRef1, pathRef2].forEach(ref => {
        if (ref.current) {
          const path = ref.current;
          const pathLength = path.getTotalLength();
          
          // Set initial state - invisible
          gsap.set(path, { 
            strokeDasharray: pathLength, 
            strokeDashoffset: pathLength,
            opacity: 0 
          });
        }
      });

      // Animate both paths together; update container active set
      timeline
        .to([pathRef1.current, pathRef2.current], {
          opacity: 1,
          duration: 0.25,
          onStart: () => {
            if (onStart) onStart();
            addActiveContainers(containers);
          }
        }, position)
        .to([pathRef1.current, pathRef2.current], {
          strokeDashoffset: 0,
          duration: 1.2
        }, '<')
        .to([pathRef1.current, pathRef2.current], {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            if (onComplete) onComplete();
            removeActiveContainers(containers);
          }
        }, '+=0.4');
    };

    // Animate an arbitrary list of refs together (useful when same logical line has multiple DOM instances)
    const animateRefsTogether = (pathRefs: React.RefObject<SVGPathElement | null>[], position: string = '+=0.3', containers: number[] = [], onStart?: () => void, onComplete?: () => void) => {
      const elems = pathRefs.map(r => r.current).filter(Boolean) as SVGPathElement[];
      if (elems.length === 0) {
        // keep container state in sync
        timeline.add(() => { if (onStart) onStart(); addActiveContainers(containers); });
        timeline.add(() => { if (onComplete) onComplete(); removeActiveContainers(containers); }, '+=2');
        return;
      }

      elems.forEach(path => {
        const L = path.getTotalLength();
        gsap.set(path, { strokeDasharray: L, strokeDashoffset: L, opacity: 0 });
      });

      timeline
        .to(elems, {
          opacity: 1,
          duration: 0.25,
          onStart: () => {
            if (onStart) onStart();
            addActiveContainers(containers);
          }
        }, position)
        .to(elems, {
          strokeDashoffset: 0,
          duration: 1.2
        }, '<')
        .to(elems, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            elems.forEach(path => {
              const L = path.getTotalLength();
              gsap.set(path, { strokeDashoffset: L, opacity: 0 });
            });
            if (onComplete) onComplete();
            removeActiveContainers(containers);
          }
        }, '+=0.4');
    };

    // Animate in sequence
  // line-1: animate both instances (container1 + container2) together
  animateRefsTogether([line1Ref, line1_2Ref], '0', [7,10], () => setLine1Animating(true), () => setLine1Animating(false));
  // line-2: animate all related segments/instances together
  animateRefsTogether([line2Ref, line2ContinuedRef, line2_2Ref], '+=0.3', [11,18,29], () => setLine2Animating(true), () => setLine2Animating(false));
  animatePath(line3Ref, '+=0.3', [14,32], () => setLine3Animating(true), () => setLine3Animating(false)); // line-3
  animatePath(line4Ref, '+=0.3', [32,35], () => setLine4Animating(true), () => setLine4Animating(false)); // line-4
  // line-5: animate all instances/segments (container1 + container2)
  animateRefsTogether([line5Ref, line5ContinuedRef, line5_2Ref], '+=0.3', [15,19,27], () => setLine5Animating(true), () => setLine5Animating(false));
  // line-6: animate both instances (container1 + container2)
  animateRefsTogether([line6Ref, line6_2Ref], '+=0.3', [19,27], () => setLine6Animating(true), () => setLine6Animating(false));

    return () => {
      timeline.kill();
      svgTimelineRef.current = null;
    };
  }, [animationsEnabled]);

  // Reset animations when moving to a new container (activeStep changes)
  useEffect(() => {
    // reset visual states and SVG paths so animation restarts cleanly for the newly visible container
    const refs = [lineRef, line1Ref, line1_2Ref, line2Ref, line2_2Ref, line2ContinuedRef, line3Ref, line4Ref, line5Ref, line5ContinuedRef, line5_2Ref, line6Ref, line6_2Ref];

    if (!animationsEnabled) {
      // Animations are disabled: make all lines visible so you can style/model them easily
      refs.forEach(r => {
        const p = r.current;
        if (!p) return;
        try {
          const L = p.getTotalLength();
          gsap.set(p, { strokeDasharray: L, strokeDashoffset: 0, opacity: 1 });
        } catch (e) {
          // ignore if element not ready
        }
      });

      // also clear any animation flags
      setActiveContainers(new Set());
      setLine1Animating(false);
      setLine2Animating(false);
      setLine3Animating(false);
      setLine4Animating(false);
      setLine5Animating(false);
      setLine6Animating(false);

      // no timeline restart when disabled
      return;
    }

    // Animations enabled: reset to hidden and restart timeline as before
    refs.forEach(r => {
      const p = r.current;
      if (!p) return;
      try {
        const L = p.getTotalLength();
        gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, opacity: 0 });
      } catch (e) {
        // ignore if element not ready
      }
    });

    // reset animation flags and active containers
    setActiveContainers(new Set());
    setLine1Animating(false);
    setLine2Animating(false);
    setLine3Animating(false);
    setLine4Animating(false);
    setLine5Animating(false);
    setLine6Animating(false);

    // restart timeline from the beginning so the animation cycle is fresh
    if (svgTimelineRef.current && typeof svgTimelineRef.current.restart === 'function') {
      try {
        svgTimelineRef.current.restart(true);
      } catch (e) {
        // ignore restart failures
      }
    }
  }, [activeStep]);

  return (
  <section className="relative w-full bg-white py-16 md:py-24 overflow-hidden" ref={containerRef}>
      {/* Fixed grid confined to this section's visible slice */}
      {gridBox.visible && (
        <div
          aria-hidden
          className="pointer-events-none fixed transition-opacity duration-500 opacity-90"
          style={{
            left: gridBox.left,
            top: gridBox.top,
            width: gridBox.width,
            height: gridBox.height,
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 32px)',
            maskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.65), transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.65), transparent 70%)',
            zIndex: 0
          }}
        />
      )}
      {!gridBox.visible && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 32px)',
            maskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.65), transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.65), transparent 70%)'
          }}
        />
      )}
      {/* Mouse follow animated orb */}
      <div
        aria-hidden
        className="absolute w-[340px] h-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none mix-blend-screen blur-2xl opacity-60 transition-opacity duration-500"
        style={{
          left: orbPos.x || 0,
          top: orbPos.y || 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.45), rgba(168,85,247,0.28) 35%, rgba(236,72,153,0.15) 60%, rgba(236,72,153,0) 75%)'
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top heading / intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-2 md:mb-20 pt-12 md:pt-0"
        >
          <p className="text-black font-semibold mb-3 text-sm sm:text-base md:text-lg max-w-2xl">
            {copy.subtitle}
          </p>
          <h2
            className="font-extrabold text-black leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl max-w-4xl"
          >
            {copy.title?.replace(' AI', '')} <span className="text-black">AI</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left scrollable steps */}
          <div className="space-y-32 md:space-y-80 relative pt-32 md:pt-52">
            {steps.map((s, i) => (
              <div
                key={s.id}
                ref={(el) => setStepRef(el, i)}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="max-w-xl"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-base font-semibold transition-colors ${i === activeStep ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}>{s.id}</span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    {s.description}
                  </p>
                  {learnMore && (
                    <button
                      className="mt-7 inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-white hover:text-black"
                      type="button"
                      onClick={() => setActiveStep(i)}
                    >
                      {learnMore}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </motion.div>
                {isMobile && (
                  <div className="mt-8 rounded-3xl overflow-hidden aspect-square w-full">
                    {i === 0 ? (
                      <HowItWorksContainer1 />
                    ) : i === 1 ? (
                      <HowItWorksContainer2
                        visibleContainers={visibleContainers}
                        isContainerActive={isContainerActive}
                        renderIcon={renderIcon}
                        line1Animating={line1Animating}
                        line2Animating={line2Animating}
                        line5Animating={line5Animating}
                        line6Animating={line6Animating}
                      />
                    ) : (
                      <HowItWorksContainer3 backgroundImage={stepImages[i]} resetKey={container3ResetKey} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right pinned visual panel */}
          <div
            ref={rightPanelRef}
            className="relative w-full hidden md:block"
            style={{
              height: 'min(70vh, 640px)',
              width: 'min(70vh, 640px)',
              minHeight: '380px',
              minWidth: '380px'
            }}
          >
            <div
              style={{ transform: `translateY(${panelYOffset}px)` }}
              className="absolute inset-0"
            >
              <div ref={imageLayerRef} className="absolute inset-0 rounded-3xl overflow-visible">
              {stepImages.map((src, idx) => (
                <div
                  key={src}
                  className="hiw-image-item absolute inset-0 w-full h-full opacity-0"
                  aria-hidden={idx !== activeStep}
                >
                  {idx === 0 && (
                    <HowItWorksContainer1 />
                  )}
                  {idx === 1 && (
                    <HowItWorksContainer2
                      visibleContainers={visibleContainers}
                      isContainerActive={isContainerActive}
                      renderIcon={renderIcon}
                      line1Animating={line1Animating}
                      line2Animating={line2Animating}
                      line5Animating={line5Animating}
                      line6Animating={line6Animating}
                    />
                  )}
                  {idx === 2 && (
                    <HowItWorksContainer3 backgroundImage={src} resetKey={container3ResetKey} />
                  )}
                </div>
              ))}
                {/* Gradient overlay for readability if needed */}
                {/* <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/10 pointer-events-none" /> */}
                {/* Active step label */}
                {/* <div className="absolute bottom-4 left-4 bg-red-500/85 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium tracking-wide text-black flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-black" />
                  {steps[activeStep]?.title}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
