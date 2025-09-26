"use client";
import React, { useEffect, useState, useCallback, useImperativeHandle } from 'react';
import Image from 'next/image';

export interface HowItWorksContainer3Props {
  backgroundImage: string;
  // optional numeric key that when changed forces the internal animation to reset and replay
  resetKey?: number;
}


export type HowItWorksContainer3Handle = {
  /** Porneste sau opreste complet animatiile interne */
  setAnimations: (run: boolean) => void;
  /** Afiseaza direct un stage (1 = cerc verde, 2 = cele 3 containere) si opreste animatiile */
  setStage: (stage: 1 | 2 | 3 | 4) => void;
};

export const HowItWorksContainer3 = React.forwardRef<HowItWorksContainer3Handle, HowItWorksContainer3Props>(({ resetKey }, ref) => {
  const [animate, setAnimate] = useState(false); // controleaza efectul de disparitie al cercului







  const [stage, setStage] = useState<number>(4); // pornim direct pe stage 2 conform cerintei
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true); // animatii oprite implicit










  // keep timeout ids so we can clear/restart when asked
  const tCheckRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const t1Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tP1Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tP2Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tP3Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tStage3Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tS3DownRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tS3UpRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tStage3FadeRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tStage4Ref = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tStage4MoveRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tStage4ActionRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const tResetAfterNewBoxRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = () => {
    if (tCheckRef.current) { clearTimeout(tCheckRef.current as any); tCheckRef.current = null; }
    if (t1Ref.current) { clearTimeout(t1Ref.current as any); t1Ref.current = null; }
    if (t2Ref.current) { clearTimeout(t2Ref.current as any); t2Ref.current = null; }
    if (tP1Ref.current) { clearTimeout(tP1Ref.current as any); tP1Ref.current = null; }
    if (tP2Ref.current) { clearTimeout(tP2Ref.current as any); tP2Ref.current = null; }
    if (tP3Ref.current) { clearTimeout(tP3Ref.current as any); tP3Ref.current = null; }
  if (tStage3Ref.current) { clearTimeout(tStage3Ref.current as any); tStage3Ref.current = null; }
  if (tS3DownRef.current) { clearTimeout(tS3DownRef.current as any); tS3DownRef.current = null; }
  if (tS3UpRef.current) { clearTimeout(tS3UpRef.current as any); tS3UpRef.current = null; }
  if (tStage3FadeRef.current) { clearTimeout(tStage3FadeRef.current as any); tStage3FadeRef.current = null; }
  if (tStage4Ref.current) { clearTimeout(tStage4Ref.current as any); tStage4Ref.current = null; }
  if (tStage4MoveRef.current) { clearTimeout(tStage4MoveRef.current as any); tStage4MoveRef.current = null; }
  if (tStage4ActionRef.current) { clearTimeout(tStage4ActionRef.current as any); tStage4ActionRef.current = null; }
  if (tResetAfterNewBoxRef.current) { clearTimeout(tResetAfterNewBoxRef.current as any); tResetAfterNewBoxRef.current = null; }
  };

  // phased state for stage 2 sequence
  const [box1Exit, setBox1Exit] = useState(false);
  const [box2Exit, setBox2Exit] = useState(false);
  const [box3Exit, setBox3Exit] = useState(false);
  const [phase, setPhase] = useState<number>(0);
  // small step state for stage 3 mouse choreography: 0 = initial, 1 = down, 2 = up over circle1
  const [stage3Step, setStage3Step] = useState<number>(0);
  const [stage3Fade, setStage3Fade] = useState<boolean>(false);
  // stage-4 choreography state
  const [stage4MouseOver5, setStage4MouseOver5] = useState<boolean>(false);
  const [stage4Box2Hidden, setStage4Box2Hidden] = useState<boolean>(false);
  const [stage4Box3Raised, setStage4Box3Raised] = useState<boolean>(false);
  const [stage4Box4Raised, setStage4Box4Raised] = useState<boolean>(false);
  const [stage4ShowNewBox, setStage4ShowNewBox] = useState<boolean>(false);

  const startSequence = useCallback(() => {
    // clear any existing timers
    clearAllTimers();

    if (!animationsEnabled) return; // daca sunt oprite, nu rulam nimic

    setAnimate(false);
    setStage(0);

    // checkbox animation (existing) fires after 2000ms
    tCheckRef.current = setTimeout(() => setAnimate(true), 2000);

    // sequence for mouse image: enter circle then move down-right
    t1Ref.current = setTimeout(() => setStage(1), 400); // go into circle
    // keep the mouse over the green circle longer (previously 1400ms)
    t2Ref.current = setTimeout(() => setStage(2), 2600); // then go down-right
  }, [animationsEnabled]);

  // when entering stage 2 and animations are enabled, run the phased box-exit sequence
  useEffect(() => {
  if (stage !== 2) return;
    // reset exits
    setBox1Exit(false);
    setBox2Exit(false);
    setBox3Exit(false);
    setPhase(0);

    if (!animationsEnabled) return;

    // Phase timings: move mouse to A, then trigger A exit left (longer dwell), then move to B, trigger B exit right, then C -> left
    // Phase 1: after 400ms, move to A and trigger exit after a longer dwell so mouse lingers
    tP1Ref.current = setTimeout(() => {
      setPhase(1);
      // longer delay so mouse stays over Feature A before it exits
      tP2Ref.current = setTimeout(() => {
        setBox1Exit(true);
      }, 1000);
    }, 400);

    // Phase 2: after 2200ms (shifted to account for the longer dwell), move to B and trigger exit right
    tP3Ref.current = setTimeout(() => {
      setPhase(2);
      setTimeout(() => setBox2Exit(true), 400);
    }, 2200);

    // Phase 3: after 3400ms, move to C and trigger exit left
    const tFinish = setTimeout(() => {
      setPhase(3);
      const tExit3 = setTimeout(() => setBox3Exit(true), 400);
      // after the exit animation completes, advance to stage 3 (give a little buffer)
      tStage3Ref.current = setTimeout(() => setStage(3), 400 + 700);
    }, 3400);
    // store finish in tP1Ref to clear later
    tP1Ref.current = tFinish as any;

    return () => {
      if (tP1Ref.current) { clearTimeout(tP1Ref.current as any); tP1Ref.current = null; }
      if (tP2Ref.current) { clearTimeout(tP2Ref.current as any); tP2Ref.current = null; }
      if (tP3Ref.current) { clearTimeout(tP3Ref.current as any); tP3Ref.current = null; }
  if (tStage3Ref.current) { clearTimeout(tStage3Ref.current as any); tStage3Ref.current = null; }
    };
  }, [stage, animationsEnabled]);

  // when entering stage 3 schedule mouse to go down then up over circle 1
  useEffect(() => {
    if (stage !== 3) return;
    setStage3Step(0);

    if (!animationsEnabled) return;

    // small delay then move mouse down
    tS3DownRef.current = setTimeout(() => {
      setStage3Step(1);
    }, 600);

    // then after the down animation, lift mouse up over circle 1
    tS3UpRef.current = setTimeout(() => {
      setStage3Step(2);
    }, 1400);

    return () => {
      if (tS3DownRef.current) { clearTimeout(tS3DownRef.current as any); tS3DownRef.current = null; }
      if (tS3UpRef.current) { clearTimeout(tS3UpRef.current as any); tS3UpRef.current = null; }
    };
  }, [stage, animationsEnabled]);

  // when stage3Step reaches 2 (mouse above circle1), fade out the circles and show stage 4
  useEffect(() => {
    if (stage !== 3 || stage3Step !== 2) return;
    setStage3Fade(false);

    if (!animationsEnabled) return;

    // start fade shortly after mouse arrives
    tStage3FadeRef.current = setTimeout(() => {
      setStage3Fade(true);
    }, 300);

    // after fade completes, show stage 4
    tStage4Ref.current = setTimeout(() => {
      setStage(4);
    }, 300 + 600);

    return () => {
      if (tStage3FadeRef.current) { clearTimeout(tStage3FadeRef.current as any); tStage3FadeRef.current = null; }
      if (tStage4Ref.current) { clearTimeout(tStage4Ref.current as any); tStage4Ref.current = null; }
      if (tStage4MoveRef.current) { clearTimeout(tStage4MoveRef.current as any); tStage4MoveRef.current = null; }
      if (tStage4ActionRef.current) { clearTimeout(tStage4ActionRef.current as any); tStage4ActionRef.current = null; }
    };
  }, [stage, stage3Step, animationsEnabled]);

  // choreography for stage 4: move mouse over box-5, hide box-2 upward, raise box-3 and box-4, show new box
  useEffect(() => {
    if (stage !== 4) return;
    // reset flags
    setStage4MouseOver5(false);
    setStage4Box2Hidden(false);
    setStage4Box3Raised(false);
    setStage4Box4Raised(false);
    setStage4ShowNewBox(false);

    if (!animationsEnabled) return;

    // move mouse to box-5 after a short delay
    tStage4MoveRef.current = setTimeout(() => {
      setStage4MouseOver5(true);
    }, 300);

    // after mouse is over box-5, trigger the actions: hide box2, raise box3/4, show new box
    tStage4ActionRef.current = setTimeout(() => {
      setStage4Box2Hidden(true);
      setStage4Box3Raised(true);
      setStage4Box4Raised(true);
      setStage4ShowNewBox(true);
    }, 1000);

    return () => {
      if (tStage4MoveRef.current) { clearTimeout(tStage4MoveRef.current as any); tStage4MoveRef.current = null; }
      if (tStage4ActionRef.current) { clearTimeout(tStage4ActionRef.current as any); tStage4ActionRef.current = null; }
    };
  }, [stage, animationsEnabled]);

  // when the new box for stage 4 becomes visible, reset to stage 1 after 1s to loop the sequence
  useEffect(() => {
    if (!stage4ShowNewBox) return;
    if (!animationsEnabled) return;

    // schedule a reset back to stage 1 after 1000ms
    tResetAfterNewBoxRef.current = setTimeout(() => {
      // restart the sequence from stage 1
      setStage(1);
      // give a short moment then start the regular sequence timers
      startSequence();
    }, 1000);

    return () => {
      if (tResetAfterNewBoxRef.current) { clearTimeout(tResetAfterNewBoxRef.current as any); tResetAfterNewBoxRef.current = null; }
    };
  }, [stage4ShowNewBox, animationsEnabled, startSequence]);

  // ruleaza secventa la mount / cand se reactiveaza animatiile
  useEffect(() => {
    startSequence();
    return () => clearAllTimers();
  }, [startSequence]);

  // restart sequence whenever resetKey changes
  useEffect(() => {
    if (typeof resetKey !== 'undefined' && animationsEnabled) {
      startSequence();
    }
  }, [resetKey, startSequence, animationsEnabled]);

  // expunem functiile imperative
  useImperativeHandle(ref, () => ({
    setAnimations: (run: boolean) => {
      if (run === animationsEnabled) return;
      if (!run) {
        // oprim animatiile si curatam
        setAnimationsEnabled(false);
        clearAllTimers();
        setAnimate(false); // cerc static daca ramane pe stage 1
      } else {
        setAnimationsEnabled(true);
        // reluam de la inceput secventa
        startSequence();
      }
    },
  setStage: (s: 1 | 2 | 3 | 4) => {
      clearAllTimers();
      setAnimationsEnabled(false); // blocam animatiile ca sa ramana fix
      setAnimate(false);
      setStage(s);
    }
  }), [animationsEnabled, startSequence]);

  // base styles for the floating mouse image
  const imgBase: React.CSSProperties = {
    position: 'absolute',
    width: 48,
    height: 'auto',
    pointerEvents: 'none',
  transition: 'all 700ms cubic-bezier(0.22, 1, 0.36, 1)',
  willChange: 'transform, top, left, opacity',
  zIndex: 9999,
  };

  // stage-based positioning using top/left + transform
  const imgStyle: React.CSSProperties = (() => {
    if (stage === 1) {
      // position centered on the green circle
      return {
        ...imgBase,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.95)',
        opacity: 1,
      };
    }

    if (stage === 2) {
      // when in stage 2, position mouse according to phase (hover over boxes)
      if (phase === 1) {
  // hover over Feature A (box-1)
  return { ...imgBase, top: '20%', left: '30%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
      }
      if (phase === 2) {
  // hover over Feature B (box-2) - updated top position
  return { ...imgBase, top: '50%', left: '70%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
      }
      if (phase === 3) {
  // hover over Feature C (box-3) - moved lower
  return { ...imgBase, top: '80%', left: '30%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
      }
      // default for stage 2 (before phases)
      return { ...imgBase, top: '80%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95) rotate(6deg)', opacity: 1 };
    }

    if (stage === 3) {
      // stage3Step controls the micro-motion: 0 = resting, 1 = moved down, 2 = over circle1
      if (stage3Step === 1) {
        return { ...imgBase, top: '85%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95) rotate(12deg)', opacity: 1 };
      }
      if (stage3Step === 2) {
        // move above circle1 (left:30% top:20%)
        return { ...imgBase, top: '20%', left: '30%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
      }

      // default resting for stage 3
      return { ...imgBase, top: '80%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95) rotate(6deg)', opacity: 1 };
    }

    if (stage === 4) {
      // when stage4MouseOver5 is true we position over box-5 (which sits near bottom-left)
      if (stage4MouseOver5) {
        return { ...imgBase, top: '95%', left: '16%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
      }

      // default for stage 4 (mouse rests near bottom)
      return { ...imgBase, top: '85%', left: '50%', transform: 'translate(-50%, -50%) scale(0.95)', opacity: 1 };
    }

    // initial (stage 0) - start a bit upper-left so movement is visible
    return {
      ...imgBase,
      top: '20%',
      left: '15%',
      transform: 'translate(0, 0) scale(1)',
      opacity: 1,
    };
  })();

  return (
    <div className="w-full h-full bg-white rounded-2xl relative overflow-hidden">
      {/* Floating mouse image that will animate into the circle then out */}
      <Image
        src="/HeroSection/MouseForRightContainer.png"
        alt=""
        aria-hidden
        width={48}
        height={48}
        style={imgStyle}
        className="md:block"
      />

      {stage === 1 || stage === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div
            className={`flex items-center justify-center transition-all duration-700 ease-in-out ${animate ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}
            style={{ transitionProperty: 'transform, opacity' }}
          >
            <span className="inline-flex items-center justify-center rounded-full bg-green-500" style={{ width: 96, height: 96, boxShadow: '0 6px 30px 0 #22c55e33' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 7 11 17 4 10" />
              </svg>
            </span>
          </div>
        </div>
      ) : null}

      {/* When the circle has moved away, show three simplified non-interactive boxes centered */}
  {stage === 2 && (
        <div className="absolute inset-0 z-30 pointer-events-none p-2 md:p-0">
          {/* Minimalist background blobs (subtle, blurred) */}
          <div className="hidden md:block" style={{ position: 'absolute', left: '18%', top: '6%', width: 280, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.14), rgba(99,102,241,0) 60%)', filter: 'blur(28px)', zIndex: 5, willChange: 'filter' }} />
          <div className="hidden md:block" style={{ position: 'absolute', left: '62%', top: '34%', width: 260, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.12), rgba(16,185,129,0) 60%)', filter: 'blur(28px)', zIndex: 5, willChange: 'filter' }} />
          <div className="hidden md:block" style={{ position: 'absolute', left: '18%', top: '58%', width: 300, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.10), rgba(249,115,22,0) 60%)', filter: 'blur(28px)', zIndex: 5, willChange: 'filter' }} />

          {/* Box 1 - default left */}
          <div id="hw-box-1" className="absolute bg-white border border-gray-200 rounded-2xl shadow-md p-3 md:p-4 w-[90%] max-w-[300px] md:max-w-[500px] h-auto md:h-36 text-right overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ left: '50%', top: '15%', transform: `translate(-50%, -50%) ${box1Exit ? 'translateX(-120%)' : ''}`, transition: 'transform 600ms ease', zIndex: 20 }}>
            {/* subtle top accent */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-indigo-200 via-pink-100 to-yellow-100" />
            <div className="flex items-start gap-4 pr-4 justify-end">
              {/* icon removed per request */}
              <div className="text-right">
                <div className="text-base md:text-2xl font-semibold text-gray-800 leading-tight">Global & Precise</div>
                <div className="text-xs text-gray-500 mt-2 md:w-1/2 md:ml-auto">Se adaptează oricărei țări, oferind acuratețe maximă și conversații naturale, fără efort.</div>
              </div>
            </div>
          </div>

          {/* Box 2 - default center */}
          <div id="hw-box-2" className="absolute bg-white border border-gray-200 rounded-2xl shadow-md p-3 md:p-4 w-[90%] max-w-[300px] md:max-w-[500px] h-auto md:h-36 text-left overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ left: '50%', top: '50%', transform: `translate(-50%, -50%) ${box2Exit ? 'translateX(120%)' : ''}`, transition: 'transform 600ms ease', zIndex: 20 }}>
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-green-200 via-teal-100 to-cyan-100" />
            <div className="flex items-start gap-4 pl-2">
              {/* icon removed per request */}
              <div>
                <div className="text-base md:text-2xl font-semibold text-gray-800 leading-tight">Omnichannel & Always-On</div>
                <div className="text-xs text-gray-500 mt-2 md:w-1/2">Conectează-te prin orice canal, 24/7, cu integrare completă și disponibilitate permanentă.</div>
              </div>
            </div>
          </div>

          {/* Box 3 - default right */}
          <div id="hw-box-3" className="absolute bg-white border border-gray-200 rounded-2xl shadow-md p-3 md:p-4 w-[90%] max-w-[300px] md:max-w-[500px] h-auto md:h-36 text-right overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ left: '50%', top: '85%', transform: `translate(-50%, -50%) ${box3Exit ? 'translateX(-120%)' : ''}`, transition: 'transform 600ms ease', zIndex: 20 }}>
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-orange-100 via-amber-100 to-red-100" />
            <div className="flex items-start gap-4 pr-4 justify-end">
              {/* icon removed per request */}
              <div className="text-right">
                <div className="text-lg md:text-2xl font-semibold text-gray-800 leading-tight">Smart Insights</div>
                <div className="text-xs text-gray-500 mt-2 md:w-1/2 md:ml-auto">Transformă datele în decizii clare prin analize inteligente și recomandări precise în timp real.</div>
              </div>
            </div>
          </div>
        </div>
      )}

  {/* Stage 3: four large circles positioned similarly to the stage-2 containers */}
          {stage === 3 && (
            <div className="absolute inset-0 z-40 pointer-events-none">
              {/* Decorative soft background for Stage 3 */}
              <div style={{ position: 'absolute', inset: 0 }} />
              <div className="hidden md:block" style={{ position: 'absolute', left: '16%', top: '6%', width: 320, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.12), rgba(99,102,241,0) 60%)', filter: 'blur(36px)', zIndex: 5, opacity: 0.9, willChange: 'filter' }} />
              <div className="hidden md:block" style={{ position: 'absolute', left: '64%', top: '34%', width: 280, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(16,185,129,0.10), rgba(16,185,129,0) 60%)', filter: 'blur(36px)', zIndex: 5, opacity: 0.9, willChange: 'filter' }} />
              <div className="hidden md:block" style={{ position: 'absolute', left: '18%', top: '58%', width: 300, height: 220, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(249,115,22,0.08), rgba(249,115,22,0) 60%)', filter: 'blur(36px)', zIndex: 5, opacity: 0.9, willChange: 'filter' }} />

              {/* Subtle grid overlay for texture */}
              <div className="hidden md:block" style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 24px)`, opacity: 0.18 }} />

              {/* Circles (kept same size/positions) with updated visual treatment */}
              <div className="absolute" style={{ left: '30%', top: '20%', transform: 'translate(-50%, -50%)' }}>
                <span className={`relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-1 ring-gray-300 overflow-hidden ${stage3Fade ? 'opacity-0' : 'opacity-100'}`} style={{position: 'relative'}}>
                  <Image src="/HowItWorksSectin/ProfilePicture1.png" alt="" fill sizes="(max-width: 768px) 90px, 120px"/>
                </span>
              </div>

              <div className="absolute" style={{ left: '70%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                <span className={`relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-1 ring-gray-300 overflow-hidden ${stage3Fade ? 'opacity-0' : 'opacity-100'}`} style={{position: 'relative'}}>
                  <Image src="/HowItWorksSectin/ProfilePicture2.png" alt="" fill sizes="(max-width: 768px) 90px, 120px"/>
                </span>
              </div>

              <div className="absolute" style={{ left: '70%', top: '80%', transform: 'translate(-50%, -50%)' }}>
                <span className={`relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-1 ring-gray-300 overflow-hidden ${stage3Fade ? 'opacity-0' : 'opacity-100'}`} style={{position: 'relative'}}>
                  <Image src="/HowItWorksSectin/ProfilePicture3.png" alt="" fill sizes="(max-width: 768px) 90px, 120px"/>
                </span>
              </div>

              <div className="absolute" style={{ left: '30%', top: '60%', transform: 'translate(-50%, -50%)' }}>
                <span className={`relative w-[90px] h-[90px] md:w-[120px] md:h-[120px] inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl ring-1 ring-gray-300 overflow-hidden ${stage3Fade ? 'opacity-0' : 'opacity-100'}`} style={{position: 'relative'}}>
                  <Image src="/HowItWorksSectin/ProfilePicture4.png" alt="" fill sizes="(max-width: 768px) 90px, 120px"/>
                </span>
              </div>
            </div>
          )}

        {/* Stage 4: six containers grid */}
        {stage === 4 && (
          <div className="absolute inset-0 z-50">
            {/* stage4-container holds absolute boxes that you can reposition freely */}
            <div id="stage4-container" className="absolute inset-0 p-2">
              <div id="hw-stage4-box-1" className="absolute bg-white border border-gray-200 rounded-2xl shadow-md h-full w-full pointer-events-auto">
                <div className="text-2xl font-semibold text-gray-800"></div>
              </div>

              <div id="hw-stage4-box-2" className="absolute bg-gray-100 border border-gray-300 rounded-2xl shadow-md p-3 w-[60%] pointer-events-auto flex items-center justify-center text-center top-[20%] left-[5%]" style={{ transition: 'transform 600ms ease, opacity 600ms ease', transform: stage4Box2Hidden ? 'translateY(-120%)' : 'translateY(0)', opacity: stage4Box2Hidden ? 0 : 1 }}>
                <div className="text-[11px] md:text-[13px] font-semibold text-gray-800 leading-snug">Bună ziua! Vreau să cumpăr un telefon nou. Care sunt modelele disponibile în acest moment?</div>
              </div>

              <div id="hw-stage4-box-3" className="absolute bg-blue-100 border border-blue-300 rounded-2xl shadow-md p-3 w-[70%] pointer-events-auto flex items-center justify-center text-center top-[40%] right-[5%]" style={{ transition: 'transform 600ms ease', transform: stage4Box3Raised ? 'translateY(-70%)' : 'translateY(0)' }}>
                <div className="text-[11px] md:text-[13px] font-semibold text-gray-800 leading-snug">Bună ziua! Avem în stoc cele mai recente modele de la Apple, Samsung și Xiaomi. Care marcă vă interesează?</div>
              </div>

              <div id="hw-stage4-box-4" className="absolute bg-gray-100 border border-gray-300 rounded-2xl shadow-md p-3 w-[80%] pointer-events-auto flex items-center justify-center text-center top-[60%] left-[5%]" style={{ transition: 'transform 600ms ease', transform: stage4Box4Raised ? 'translateY(-70%)' : 'translateY(0)' }}>
                <div className="text-[11px] md:text-[13px] font-semibold text-gray-800 leading-snug">Mă interesează un iPhone. Care sunt modelele noi disponibile?</div>
              </div>

              <div id="hw-stage4-box-5" className="absolute bg-white border border-gray-200 rounded-2xl shadow-md p-3 h-auto md:h-[50px] w-[90%] pointer-events-auto bottom-[2%] left-[5%]" style={{ transition: 'transform 600ms ease' }}>
              </div>

              <div id="hw-stage4-box-6" className="absolute bg-blue-400 border border-blue-200 rounded-2xl shadow-md p-3 h-auto md:h-[50px] w-[25%] pointer-events-auto bottom-[2%] right-[5%]" style={{}}>
              </div>

              {/* New box that appears at the position/dimensions of box-3 when choreography triggers */}
              {stage4ShowNewBox && (
                <div id="hw-stage4-newbox" className="absolute bg-blue-100 border border-blue-300 rounded-2xl shadow-md p-3 w-[70%] pointer-events-auto flex items-center justify-center text-center top-[70%] right-[5%]" style={{ transition: 'opacity 400ms ease' }}>
                  <div className="text-[11px] md:text-[13px] font-semibold text-gray-800 leading-snug">Avem iPhone 15, iPhone 15 Plus, iPhone 15 Pro și iPhone 15 Pro Max.</div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
});

export default HowItWorksContainer3;
