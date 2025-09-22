'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { tr } from 'framer-motion/client';

// Locales (structured under HeroSection)
import enLocale from '../../locales/en.json'
import ruLocale from '../../locales/ru.json'
import roLocale from '../../locales/ro.json'

/**
 * Minimal Hero: only left-aligned badge, title, and subtitle.
 * - No CTAs, no right-side content, no extra elements
 * - Subtle background grid + soft spotlight that follows cursor
 */
type HeroProps = { lang?: string }

export default function HeroSectionLeftClean({ lang }: HeroProps) {
  // Track if the text is fully typed
  const [isTextFullyTyped, setIsTextFullyTyped] = useState(false);
  const ref = useRef<HTMLElement>(null)

  // Pick translations based on provided lang prop (server-rendered) or fallback to path/client detection.
  const locales: Record<string, any> = { en: enLocale, ru: ruLocale, ro: roLocale };
  // Use only the server-provided lang param for deterministic SSR. Avoid client pathname detection to prevent hydration mismatches.
  let initialLang = (lang && Object.keys(locales).includes(lang)) ? lang : 'ro';
  const [currentLang, setCurrentLang] = useState(initialLang);
  const translations = locales[currentLang] ?? roLocale;
  // Chat data types and translation-backed source
  type Conversation = { sender: string; message: string };
  type RightBox = { name: string; conversations: Conversation[] };
  const rightBoxData: RightBox[] = translations?.HeroSection?.chat?.rightBoxData as RightBox[];
  const [selectedBox, setSelectedBox] = useState(0)
  const [currentMessageIndex, setCurrentMessageIndex] = useState([0, 0, 0, 0]) // Index pentru fiecare container separat
  const [displayedMessages, setDisplayedMessages] = useState<{sender: string, message: string}[][]>([[], [], [], []]) // Mesajele afișate pentru fiecare container
  const [showFakeMouse, setShowFakeMouse] = useState(true)
  const [hideOnScroll, setHideOnScroll] = useState(false);
  const [isTypingSimulation, setIsTypingSimulation] = useState([false, false, false, false]); // Simulare typing pentru fiecare chat
  // Initialize with stable deterministic values for SSR; fill actual times/status after mount.
  const [lastActivity, setLastActivity] = useState([0, 0, 0, 0]);
  const [onlineStatus, setOnlineStatus] = useState([true, false, true, true]); // static initial ok
  const [unreadCount, setUnreadCount] = useState([3, 1, 2, 0]); // Numărul de mesaje necitite
  const [messageStatus, setMessageStatus] = useState<('sent' | 'delivered' | 'read' | 'new')[][]>([[], [], [], []]); // Status pentru fiecare mesaj
  const [showNewMessageNotification, setShowNewMessageNotification] = useState([false, false, false, false]); // Notificare mesaj nou
  const [lastBotMessageTime, setLastBotMessageTime] = useState([0, 0, 0, 0]); // Timpul ultimului mesaj de la bot
  // Ascunde mouse-ul fake și bubble-ul la scroll, reapare după 400ms fără scroll
  useEffect(() => {
    // Populate lastActivity with current timestamps after mount (client only) to avoid SSR mismatch.
    setLastActivity([Date.now(), Date.now() - 300000, Date.now() - 120000, Date.now() - 60000]);
    let timeout: NodeJS.Timeout;
    function onScroll() {
      setHideOnScroll(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setHideOnScroll(false), 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Inițializează primul mesaj pentru fiecare container când se încarcă componenta
  useEffect(() => {
    // Inițializează primul mesaj pentru fiecare container
    rightBoxData.forEach((boxData, idx) => {
      if (boxData.conversations.length > 0 && boxData.conversations[0].sender !== 'Bot') {
        setDisplayedMessages(prev => {
          const newMessages = [...prev];
          newMessages[idx] = [boxData.conversations[0]];
          return newMessages;
        });
        setCurrentMessageIndex(prev => {
          const newIndices = [...prev];
          newIndices[idx] = 1; // Următorul mesaj va fi de la bot
          return newIndices;
        });
      }
    });
  }, []);

  // Simulare activitate realistă - typing indicators, status updates, mesaje noi
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    // Simulare typing pentru fiecare chat la intervale diferite
    rightBoxData.forEach((_, idx) => {
      const typingInterval = setInterval(() => {
        if (Math.random() < 0.3 && !isTypingSimulation[idx]) { // 30% șansă să înceapă typing
          setIsTypingSimulation(prev => {
            const newTyping = [...prev];
            newTyping[idx] = true;
            return newTyping;
          });
          
          // Oprește typing după 2-5 secunde
          setTimeout(() => {
            setIsTypingSimulation(prev => {
              const newTyping = [...prev];
              newTyping[idx] = false;
              return newTyping;
            });
          }, 2000 + Math.random() * 3000);
        }
      }, 8000 + Math.random() * 7000); // Între 8-15 secunde
      
      intervals.push(typingInterval);
    });
    
    // Simulare schimbări de status online/offline
    const statusInterval = setInterval(() => {
      setOnlineStatus(prev => {
        const newStatus = [...prev];
        const randomIndex = Math.floor(Math.random() * 4);
        newStatus[randomIndex] = Math.random() > 0.7; // 30% șansă să schimbe statusul
        return newStatus;
      });
    }, 15000); // La fiecare 15 secunde
    
    intervals.push(statusInterval);
    
    // Simulare mesaje noi - incrementează unread count
    const messageInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% șansă să primești mesaj nou
        const randomUser = Math.floor(Math.random() * 4);
        setUnreadCount(prev => {
          const newCount = [...prev];
          if (randomUser !== selectedBox) { // Nu adăuga mesaje necitite pentru chat-ul activ
            newCount[randomUser] = Math.min(newCount[randomUser] + 1, 9); // Max 9 mesaje
          }
          return newCount;
        });
        
        // Actualizează ultima activitate
        setLastActivity(prev => {
          const newActivity = [...prev];
          newActivity[randomUser] = Date.now();
          return newActivity;
        });
      }
    }, 10000); // La fiecare 10 secunde
    
    intervals.push(messageInterval);
    
    return () => intervals.forEach(interval => clearInterval(interval));
  }, [selectedBox]);

  // Resetează unread count când selectezi un chat
  useEffect(() => {
    setUnreadCount(prev => {
      const newCount = [...prev];
      newCount[selectedBox] = 0;
      return newCount;
    });
  }, [selectedBox]);

  // --- viewport detection to conditionally render desktop vs mobile chat ---
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler as (ev: MediaQueryListEvent) => any); else mq.addListener(handler as any);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler as (ev: MediaQueryListEvent) => any); else mq.removeListener(handler as any);
    };
  }, []);

  const [showRealMouseImage, setShowRealMouseImage] = useState(false)
  const [realMousePos, setRealMousePos] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 400, y: 180 })
  const [isClicking, setIsClicking] = useState(false)
  const fakeMouseRef = useRef<HTMLDivElement>(null)
  const rightBoxRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const inputRef = useRef<HTMLInputElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const chatAreaRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  // Keep track of which bot/container is the current target for the next send action
  const lastTargetBotRef = useRef<number>(0);
  // Guard to avoid retyping the same message before it is sent
  const awaitingSendRef = useRef(false);
  const awaitingBoxRef = useRef<number | null>(null);

  // Store sent messages per bot
  const [sentMessages, setSentMessages] = useState<string[][]>([[], [], [], []]);
  // For simulating typing per bot
  const [inputValues, setInputValues] = useState<string[]>(['', '', '', '']);
  // Track pending user message additions to prevent duplicates
  const [pendingUserMessages, setPendingUserMessages] = useState<boolean[]>([false, false, false, false]);

  // --- MouseResponses logic (now after all state/refs are declared) ---
  // Bubble texts for different areas, din locale
  const mouseResponsesLeft = translations?.HeroSection?.mouseResponses?.left || [];
  const mouseResponseInput = translations?.HeroSection?.mouseResponses?.input || '';
  const mouseResponseSend = translations?.HeroSection?.mouseResponses?.send || '';
  const [mouseResponseIdx, setMouseResponseIdx] = useState(0);
  const [isOverLeftContainer, setIsOverLeftContainer] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isOverSend, setIsOverSend] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Flag pentru a preveni scrierea multiplă
  // Bubble text changes random la fiecare 5 secunde doar pentru left container
  useEffect(() => {
    if (!showFakeMouse) return;
    if (!isOverLeftContainer) return;
    const interval = setInterval(() => {
      setMouseResponseIdx(() => Math.floor(Math.random() * mouseResponsesLeft.length));
    }, 5000);
    return () => clearInterval(interval);
  }, [showFakeMouse, isOverLeftContainer, mouseResponsesLeft.length]);

  // Când mouse-ul fake intră peste left container, alege random un mesaj
  useEffect(() => {
    if (isOverLeftContainer) {
      setMouseResponseIdx(Math.floor(Math.random() * mouseResponsesLeft.length));
    }
  }, [isOverLeftContainer, mouseResponsesLeft.length]);

  // Detect if fake mouse is over input, send button, or left container
  useEffect(() => {
    if (!showFakeMouse) return;
    let overInput = false;
    let overSend = false;
    let overLeft = false;
    // Check input
    const input = inputRef.current;
    if (input) {
      const rect = input.getBoundingClientRect();
      overInput = mousePos.x >= rect.left && mousePos.x <= rect.right && mousePos.y >= rect.top && mousePos.y <= rect.bottom;
    }
    // Check send button
    const btn = sendBtnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      overSend = mousePos.x >= rect.left && mousePos.x <= rect.right && mousePos.y >= rect.top && mousePos.y <= rect.bottom;
    }
    // Check left container (first left box container)
    const leftBox = rightBoxRefs[0].current?.parentElement?.parentElement; // .flex-col.w-full.h-[300px] -> .relative (left container)
    if (leftBox) {
      const rect = leftBox.getBoundingClientRect();
      overLeft = mousePos.x >= rect.left && mousePos.x <= rect.right && mousePos.y >= rect.top && mousePos.y <= rect.bottom;
    }
    if (overInput !== isOverInput) setIsOverInput(overInput);
    if (overSend !== isOverSend) setIsOverSend(overSend);
    if (overLeft !== isOverLeftContainer) setIsOverLeftContainer(overLeft);
  }, [mousePos.x, mousePos.y, showFakeMouse]);

  // Smoothly interpolate bubble position to follow mousePos
  const [bubblePos, setBubblePos] = useState<{x:number,y:number}>({x: mousePos.x, y: mousePos.y});
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setBubblePos(prev => {
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        return {
          x: lerp(prev.x, mousePos.x, 0.18),
          y: lerp(prev.y, mousePos.y, 0.18),
        };
      });
      animationFrame = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos.x, mousePos.y]);

  const MouseResponses = ({ text }: { text: string }) => {
    return (
      <div
        style={{
          position: 'fixed',
          left: bubblePos.x + 18,
          top: bubblePos.y - 30,
          zIndex: 9000,
          pointerEvents: 'none',
          minWidth: 220, // Increased minWidth to accommodate longer messages
          maxWidth: 220,
          minHeight: 60, // Added minHeight to prevent vertical shifts
          transition: 'none',
          visibility: text ? 'visible' : 'hidden',
        }}
        className="bg-white rounded-xl rounded-l-md shadow px-3 py-2 text-sm text-gray-800 border border-gray-200"
      >
        {text.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
          {line}
          {idx !== text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Functie: fake mouse typing - răspunde la ultimul mesaj al utilizatorului cu următorul mesaj bot
  function fakeMouseType(selectedBoxIdx: number, callback?: () => void) {
    // Dacă deja a fost scris și se așteaptă trimiterea, nu mai rescrie
    if (awaitingSendRef.current && awaitingBoxRef.current === selectedBoxIdx) {
      if (callback) callback();
      return;
    }
    // Ensure we are operating on the currently selected box
    if (selectedBox !== selectedBoxIdx) {
      setSelectedBox(selectedBoxIdx);
    }
    lastTargetBotRef.current = selectedBoxIdx;
    
    // Găsește următorul mesaj bot care să răspundă la ultimul mesaj al utilizatorului
    const conversations = rightBoxData[selectedBoxIdx]?.conversations;
    if (!conversations || currentMessageIndex[selectedBoxIdx] >= conversations.length) {
      if (callback) callback();
      return;
    }
    
    const nextMessage = conversations[currentMessageIndex[selectedBoxIdx]];
    if (nextMessage.sender !== 'Bot') {
      if (callback) callback();
      return;
    }
    
    const message = nextMessage.message;
    // Instantly fill input value with bot response
    setInputValues(vals => {
      const newVals = [...vals];
      newVals[selectedBoxIdx] = message;
      return newVals;
    });
    // Set awaiting-send lock
    awaitingSendRef.current = true;
    awaitingBoxRef.current = selectedBoxIdx;
    if (callback) callback();
  }

  // Auto-start typing when fake mouse hovers over input and it's Bot's turn (top-level effect)
  useEffect(() => {
    if (!showFakeMouse) return;
    if (!isOverInput) return;
    if (isTyping) return;
    // Nu reporni typing dacă așteptăm trimiterea pentru acest box
    if (awaitingSendRef.current && awaitingBoxRef.current === selectedBox) return;
    
    const conversations = rightBoxData[selectedBox]?.conversations;
    const idx = currentMessageIndex[selectedBox];
    
    // Verifică dacă următorul mesaj este de la bot și poate fi folosit ca răspuns
    if (conversations && idx < conversations.length && conversations[idx].sender === 'Bot') {
      const t = setTimeout(() => fakeMouseType(selectedBox), 250);
      return () => clearTimeout(t);
    }
  }, [isOverInput, isTyping, selectedBox, currentMessageIndex, showFakeMouse, awaitingSendRef.current]);


  // Random movement for fake mouse, always active when showFakeMouse is true
  useEffect(() => {
    if (!showFakeMouse) return;
    let timeout: NodeJS.Timeout;
    let running = true;
    // Secvența fixă: indexii botilor și acțiuni speciale
    const sequence = [0, 2, 1, 'input', 'send', 3, 'input', 'send', 1, 0, 'input', 'send', 3, 2, 'input', 'send'];
    let step = 0;

    function nextStep() {
      if (!running) return;
      const action = sequence[step];
      if (typeof action === 'number') {
        // Select bot
        const boxIdx = action;
        const btn = rightBoxRefs[boxIdx].current;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          setMousePos({ x, y });
          setTimeout(() => {
            setIsClicking(true);
            setTimeout(() => {
              setIsClicking(false);
              setSelectedBox(boxIdx);
              lastTargetBotRef.current = boxIdx;
              step++;
              timeout = setTimeout(nextStep, 900);
            }, 180);
          }, 500);
        } else {
          step++;
          timeout = setTimeout(nextStep, 500);
        }
        return;
      }
      if (action === 'input') {
        // Move to input - folosește bot-ul din secvența anterioară
        const prevAction = sequence[step - 1];
        const currentBotIndex = typeof prevAction === 'number' ? prevAction : selectedBox;
        const input = inputRef.current;
        if (input) {
          const rect = input.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          console.log('🎯 Moving mouse to input at coordinates:', { x, y });
          setMousePos({ x, y });
          setTimeout(() => {
            setIsClicking(true);
            setTimeout(() => {
              setIsClicking(false);
              console.log('🖱️ Mouse clicked on input, starting typing sequence...');
              setTimeout(() => {
                console.log('🚀 Starting typing sequence for bot:', currentBotIndex);
                lastTargetBotRef.current = currentBotIndex;
                // Dacă deja a fost scris și așteaptă send, sari direct la 'send'
                if (awaitingSendRef.current && awaitingBoxRef.current === currentBotIndex) {
                  console.log('⏭️ Already awaiting send, skipping typing for bot:', currentBotIndex);
                  step++;
                  if (step >= sequence.length) step = 0;
                  timeout = setTimeout(nextStep, 400);
                } else {
                  fakeMouseType(currentBotIndex, () => {
                    console.log('✅ Typing sequence completed for bot (ready to send):', currentBotIndex);
                    step++; // advance to 'send'
                    if (step >= sequence.length) step = 0;
                    timeout = setTimeout(nextStep, 600); // Short delay before send
                  });
                }
              }, 500); // Delay scurt după click
            }, 250); // Click duration pe input
          }, 1000); // Delay mai mare pentru a ajunge la input
        } else {
          step++;
          timeout = setTimeout(nextStep, 500);
        }
        return;
      }
      if (action === 'send') {
        // Explicit send step: move to button, hover, click, and add bot message
        const boxIdx = lastTargetBotRef.current;
        if (selectedBox !== boxIdx) setSelectedBox(boxIdx);
        const btn = sendBtnRef.current;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          setMousePos({ x, y });
          setTimeout(() => {
            setIsClicking(true);
            setTimeout(() => {
              setIsClicking(false);
              // Simulează click real pe butonul Trimite
              btn.click();
              // Clear awaiting-send imediat după trimitere
              awaitingSendRef.current = false;
              awaitingBoxRef.current = null;
              // Continue sequence - logica de adăugare a mesajului utilizatorului este doar în butonul Trimite
              step++;
              if (step >= sequence.length) step = 0;
              timeout = setTimeout(nextStep, 2000);
            }, 200); // Click duration
          }, 900); // Hover + travel duration
        } else {
          step++;
          if (step >= sequence.length) step = 0;
          timeout = setTimeout(nextStep, 500);
        }
        return;
      }
    }
    nextStep();
    return () => {
      running = false;
      clearTimeout(timeout);
    };
  }, [showFakeMouse]);

  // Show only the image mouse and hide everything else when hovering big container (including all nested elements)
  const [isInsideBigContainer, setIsInsideBigContainer] = useState(false);
  const handleBigContainerEnter = () => {
    setIsInsideBigContainer(true);
    setShowRealMouseImage(true);
    setShowFakeMouse(false);
  };
  const handleBigContainerLeave = () => {
    setIsInsideBigContainer(false);
    setShowRealMouseImage(false);
    setShowFakeMouse(true);
  };
  const handleBigContainerMove = (e: React.MouseEvent<any>) => {
    setRealMousePos({ x: e.clientX, y: e.clientY });
  };

  // Helper to render the responsive chat container for desktop or mobile
  const renderChat = (variant: 'desktop' | 'mobile') => {
    const wrapperSizing = variant === 'desktop'
      ? 'w-[min(90vw,700px)] h-[clamp(320px,40vw,420px)]'
      : 'w-full h-[min(72vw,380px)]';
    return (
      <div
          className={`${wrapperSizing} bg-white rounded-2xl border border-gray-400 shadow-lg flex items-center justify-center ml-auto relative ${isInsideBigContainer ? 'cursor-none' : ''}`}
          onMouseEnter={handleBigContainerEnter}
          onMouseLeave={handleBigContainerLeave}
          onMouseMove={handleBigContainerMove}
        >
        {/* Decorative colored blobs (violet, yellow, blue) behind the chat container */}
        <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
          <span
            className="absolute rounded-full blur-3xl transition-all duration-500 ease-out"
            style={{
              left: '8%',
              top: '-2%',
              width: isInsideBigContainer ? 420 : 340,
              height: isInsideBigContainer ? 420 : 340,
              transform: isInsideBigContainer ? 'scale(1.08)' : 'scale(1)',
              background: 'radial-gradient(circle at 30% 30%, rgba(236,72,153,0.26), rgba(236,72,153,0.9) 60%, transparent 45%)',
              opacity: isInsideBigContainer ? 1 : 0.92,
            }}
          />
          <span
            className="absolute rounded-full blur-3xl transition-all duration-600 ease-out"
            style={{
              right: '2%',
              top: '8%',
              width: isInsideBigContainer ? 420 : 340,
              height: isInsideBigContainer ? 420 : 340,
              transform: isInsideBigContainer ? 'scale(1.02)' : 'scale(1)',
              background: 'radial-gradient(circle at 60% 40%, rgba(250,204,21,0.76), rgba(250,204,21,0.98) 60%, transparent 25%)',
              opacity: isInsideBigContainer ? 1 : 0.9,
            }}
          />
          <span
            className="absolute rounded-full blur-3xl transition-all duration-700 ease-out"
            style={{
              left: '-4%',
              top: '8%',
              width: isInsideBigContainer ? 360 : 300,
              height: isInsideBigContainer ? 360 : 300,
              transform: isInsideBigContainer ? 'scale(1)' : 'scale(1)',
              background: 'radial-gradient(circle at 40% 60%, rgba(59,130,246,0.26), rgba(59,130,246,0.98) 60%, transparent 48%)',
              opacity: isInsideBigContainer ? 1 : 0.9,
            }}
          />
        </div>
        {/* MacBook-style window controls */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-red-300 shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-300 shadow-sm"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 border border-green-300 shadow-sm"></span>
        </div>
        {/* Nested container */}
        <div className="w-[calc(100%-2px)] h-[calc(100%-37px)] bg-white rounded-2xl border border-gray-300 absolute left-0 top-[35px] flex flex-row items-stretch justify-between overflow-hidden">
          {/* Left small container */}
          <div
            className={`w-[28%] h-full bg-white rounded-l-2xl rounded-tr-none rounded-br-none border border-gray-200 flex flex-col items-stretch justify-start ml-0 relative ${isInsideBigContainer ? 'cursor-none' : ''}`}
            onMouseEnter={e => { handleBigContainerEnter(); setIsOverLeftContainer(true); }}
            onMouseLeave={e => { handleBigContainerLeave(); setIsOverLeftContainer(false); }}
            onMouseMove={handleBigContainerMove}
          >
            <div className="absolute top-3 left-3 flex gap-1"></div>
            {/* Four stacked containers, responsive heights */}
            <div className="flex flex-col w-full h-full">
              {rightBoxData.map((user, idx) => {
                const timeSinceActivity = lastActivity[idx] === 0 ? 0 : (Date.now() - lastActivity[idx]);
                const minutesAgo = Math.floor(timeSinceActivity / 60000);
                
                let statusText = '';
                let statusColor = 'text-gray-500';
                
                if (isTypingSimulation[idx]) {
                  statusText = translations?.HeroSection?.mouseResponses?.typing;
                  statusColor = 'text-green-600 animate-pulse';
                } else if (onlineStatus[idx]) {
                  if (minutesAgo < 1) {
                    statusText = 'Online';
                    statusColor = 'text-green-600';
                  } else if (minutesAgo < 5) {
                    const minutesAgoText = translations?.HeroSection?.mouseResponses?.minutesAgo;
                    statusText = minutesAgoText.replace('{min}', String(minutesAgo));
                  } else {
                    const hoursAgo = translations?.HeroSection?.mouseResponses?.hoursAgo;
                    statusText = `${Math.floor(minutesAgo / 60)}${hoursAgo}`;
                  }
                } else {
                  statusText = 'Offline';
                  statusColor = 'text-gray-400';
                }
                
                // Compute once per render; if lastActivity not yet set (0) show placeholder to keep SSR/CSR consistent.
                const currentTime = lastActivity[idx] === 0 ? null : new Date();
                const timeString = currentTime ? `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}` : '--:--';
                
                return (
                  <div
                    key={idx}
                    className={`flex-1 min-h-0 w-full border border-gray-200 flex items-center justify-between ${selectedBox === idx ? 'bg-gray-100' : 'bg-white'} transition ${isInsideBigContainer ? 'cursor-none' : ''} hover:bg-gray-50`}
                    onClick={() => setSelectedBox(idx)}
                    style={{cursor: isInsideBigContainer ? 'none' : 'pointer'}}
                    ref={rightBoxRefs[idx]}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="relative mr-2 ml-2 flex-shrink-0 hidden md:block">
                        <span
                          className="bg-gray-200 aspect-square w-5 h-5 rounded-full inline-block shrink-0"
                          style={{ display: 'inline-block' }}
                        ></span>
                        {/* Dynamic notification and online indicators */}
                        {unreadCount[idx] > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[12px] h-3 bg-red-500 rounded-full border border-white flex items-center justify-center animate-pulse">
                            {unreadCount[idx] > 9 ? (
                              <span className="text-[8px] text-white font-bold">9+</span>
                            ) : (
                              <span className="text-[8px] text-white font-bold">{unreadCount[idx]}</span>
                            )}
                          </div>
                        )}
                        {unreadCount[idx] === 0 && onlineStatus[idx] && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 pl-[2px]">
                        <span className="text-[11px] md:text-[15px] text-gray-700 font-medium truncate">
                          {user.name}
                        </span>
                        <span className={`text-[9px] md:text-[11px] ${statusColor} truncate font-medium`} suppressHydrationWarning>
                          {statusText}
                        </span>
                      </div>
                    </div>
                    <div className="mr-2 text-[9px] md:text-[10px] text-gray-400 flex-shrink-0" suppressHydrationWarning>
                      {timeString}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Right main container */}
          <div
            className={`flex-1 h-full bg-white rounded-r-2xl rounded-tl-none rounded-bl-none border border-gray-200 flex flex-col mr-0 relative overflow-hidden ${isInsideBigContainer ? 'cursor-none' : ''}`}
            onMouseEnter={handleBigContainerEnter}
            onMouseLeave={handleBigContainerLeave}
            onMouseMove={handleBigContainerMove}
          >
            {/* Name at top left - FIXED */}
            <div className="absolute top-0 left-0 right-0 text-[15px] md:text-lg font-bold text-gray-700 select-none z-10 bg-white px-4 py-1">
              <div className="max-w-full truncate">{rightBoxData[selectedBox].name}</div>
            </div>
            
            {/* Scrollable content area */}
            <div 
              ref={chatAreaRefs[selectedBox]}
              style={{
                flex: 1,
                overflowY: 'auto',
                paddingTop: '50px',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                paddingBottom: '80px',
              }}
              className="flex flex-col gap-3"
            >
              {/* Conversația dinamică */}
              {displayedMessages[selectedBox].map((msg, idx) => (
                <div key={idx} className={`flex flex-col gap-1 ${
                  msg.sender === 'Bot' ? 'items-end' : 'items-start'
                }`}>
                  <div className={`text-[10px] md:text-sm rounded px-3 py-2 w-fit break-words max-w-[65%] ${
                    msg.sender === 'Bot' 
                      ? 'bg-blue-100 text-blue-900 self-end' // Bot / fake-mouse on the right
                      : 'bg-gray-100 text-gray-600 self-start'    // Utilizator pe stânga, gri
                  }`}>
                    <strong>{msg.sender}:</strong> {msg.message}
                  </div>
                  {/* Status indicators pentru mesaje */}
                  {msg.sender === 'Bot' && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 self-end">
                      {messageStatus[selectedBox] && messageStatus[selectedBox][idx] === 'read' && (
                        <>
                          <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <svg className="w-3 h-3 text-blue-500 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{translations?.HeroSection?.mouseResponses?.statusRead}</span>
                        </>
                      )}
                      {messageStatus[selectedBox] && messageStatus[selectedBox][idx] === 'delivered' && (
                        <>
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <svg className="w-3 h-3 text-gray-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{translations?.HeroSection?.mouseResponses?.statusDelivered}</span>
                        </>
                      )}
                      {messageStatus[selectedBox] && messageStatus[selectedBox][idx] === 'sent' && (
                        <>
                          <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{translations?.HeroSection?.mouseResponses?.statusSent}</span>
                        </>
                      )}
                    </div>
                  )}
                  {/* Notificare mesaj nou pentru răspunsuri utilizator */}
                  {msg.sender !== 'Bot' && messageStatus[selectedBox] && messageStatus[selectedBox][idx] === 'new' && (
                    <div className="flex items-center gap-1 text-[10px] text-green-600 self-end animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                      <span className="font-medium">Mesaj nou</span>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Chat messages (mesajele trimise manual) */}
              {sentMessages[selectedBox] && sentMessages[selectedBox].map((msg, idx) => (
                <div key={idx} className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg w-fit self-start text-[10px] md:text-sm shadow-sm break-words max-w-[65%]">{msg}</div>
              ))}
            </div>
            {/* Input container mic jos */}
            <div 
              style={{
                position: 'absolute', 
                left: 0, 
                bottom: 0, 
                width: '100%', 
                background: 'rgba(255,255,255,0.95)', 
                borderTop: '1px solid #e5e7eb', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                justifyContent: variant === 'mobile' ? 'center' : 'flex-start',
                padding: variant === 'mobile' ? '0.6rem 0' : '0.75rem',
              }}
              className={isInsideBigContainer ? 'cursor-none' : ''}
            >
              <div className={variant === 'mobile' ? 'w-full max-w-[460px] px-3 flex items-center gap-2' : 'w-full flex items-center gap-2'}>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={translations?.HeroSection?.mouseResponses?.inputPlaceholder}
                  value={inputValues[selectedBox]}
                  onChange={e => {
                    const val = e.target.value;
                    setInputValues(vals => {
                      const newVals = [...vals];
                      newVals[selectedBox] = val;
                      return newVals;
                    });
                  }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: '1px solid #d1d5db', 
                    borderRadius: 8, 
                    padding: '0.5rem 0.75rem', 
                    fontSize: 14, 
                    outline: 'none'
                  }} 
                  className={isInsideBigContainer ? 'cursor-none' : ''}
                  onMouseEnter={() => setIsOverInput(true)}
                  onMouseLeave={() => setIsOverInput(false)}
                />
                <button
                  ref={sendBtnRef}
                  style={{
                    background: '#2563eb', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 8, 
                    padding: '0.5rem 0.8rem', 
                    fontWeight: 500, 
                    fontSize: 14
                  }}
                  className={isInsideBigContainer ? 'cursor-none' : ''}
                  onClick={() => {
                    const val = inputValues[selectedBox];
                    if (val.trim()) {
                      // Verifică dacă mesajul este răspunsul botului la următoarea întrebare
                      const conversations = rightBoxData[selectedBox]?.conversations;
                      const currentIdx = currentMessageIndex[selectedBox];
                      
                      if (conversations && currentIdx < conversations.length && 
                          conversations[currentIdx]?.sender === 'Bot' &&
                          conversations[currentIdx]?.message === val) {
                        // Adaugă mesajul ca răspuns de la bot în displayedMessages
                        const currentMsgIndex = displayedMessages[selectedBox].length;
                        setDisplayedMessages(prev => {
                          const newMessages = [...prev];
                          newMessages[selectedBox] = [...newMessages[selectedBox], conversations[currentIdx]];
                          return newMessages;
                        });
                        
                        // Adaugă status pentru mesajul botului
                        setMessageStatus(prev => {
                          const newStatus = [...prev];
                          if (!newStatus[selectedBox]) newStatus[selectedBox] = [];
                          newStatus[selectedBox][currentMsgIndex] = 'sent';
                          return newStatus;
                        });
                        
                        // După 1 secundă, schimbă la "delivered"
                        setTimeout(() => {
                          setMessageStatus(prev => {
                            const newStatus = [...prev];
                            if (newStatus[selectedBox]) {
                              newStatus[selectedBox][currentMsgIndex] = 'delivered';
                            }
                            return newStatus;
                          });
                        }, 1000);
                        
                        // După 3 secunde, schimbă la "read"
                        setTimeout(() => {
                          setMessageStatus(prev => {
                            const newStatus = [...prev];
                            if (newStatus[selectedBox]) {
                              newStatus[selectedBox][currentMsgIndex] = 'read';
                            }
                            return newStatus;
                          });
                        }, 3000);
                        
                        setLastBotMessageTime(prev => {
                          const newTimes = [...prev];
                          newTimes[selectedBox] = Date.now();
                          return newTimes;
                        });
                        
                        // Capturează următorul index înainte de increment
                        const nextIdx = currentIdx + 1;
                        setCurrentMessageIndex(prev => {
                          const newIndices = [...prev];
                          newIndices[selectedBox] = nextIdx;
                          return newIndices;
                        });
                        
                        // După 3 secunde, adaugă următorul mesaj al utilizatorului (dacă există și nu e deja în proces)
                        if (!pendingUserMessages[selectedBox]) {
                          setPendingUserMessages(prev => {
                            const newPending = [...prev];
                            newPending[selectedBox] = true;
                            return newPending;
                          });
                          
                          setTimeout(() => {
                            if (conversations && nextIdx < conversations.length && conversations[nextIdx]?.sender !== 'Bot') {
                              const nextUserMsg = conversations[nextIdx];
                              
                              // Double check pentru a evita duplicarea
                              setDisplayedMessages(prevMessages => {
                                const currentMessages = prevMessages[selectedBox];
                                const lastMsg = currentMessages[currentMessages.length - 1];
                                
                                if (!lastMsg || lastMsg.message !== nextUserMsg.message || lastMsg.sender !== nextUserMsg.sender) {
                                  const newMessages = [...prevMessages];
                                  newMessages[selectedBox] = [...currentMessages, nextUserMsg];
                                  
                                  // Adaugă status "new" pentru mesajul utilizatorului
                                  setMessageStatus(prevStatus => {
                                    const newStatus = [...prevStatus];
                                    if (!newStatus[selectedBox]) newStatus[selectedBox] = [];
                                    newStatus[selectedBox][currentMessages.length] = 'new';
                                    return newStatus;
                                  });
                                  
                                  // După 4 secunde, elimină notificarea "Mesaj nou"
                                  setTimeout(() => {
                                    setMessageStatus(prevStatus => {
                                      const newStatus = [...prevStatus];
                                      if (newStatus[selectedBox]) {
                                        delete newStatus[selectedBox][currentMessages.length];
                                      }
                                      return newStatus;
                                    });
                                  }, 4000);
                                  
                                  return newMessages;
                                }
                                return prevMessages;
                              });
                              
                              setCurrentMessageIndex(prev => {
                                const newIndices = [...prev];
                                newIndices[selectedBox] = nextIdx + 1;
                                return newIndices;
                              });
                            }
                            
                            // Reset pending flag
                            setPendingUserMessages(prev => {
                              const newPending = [...prev];
                              newPending[selectedBox] = false;
                              return newPending;
                            });
                          }, 3000);
                        }
                      } else {
                        // Adaugă ca mesaj manual de la utilizator
                        setSentMessages(msgs => {
                          const newMsgs = msgs.map(arr => [...arr]);
                          newMsgs[selectedBox].push(val);
                          return newMsgs;
                        });
                      }
                      
                      // Clear input
                      setInputValues(vals => {
                        const newVals = [...vals];
                        newVals[selectedBox] = '';
                        return newVals;
                      });
                      
                      // Auto-scroll
                      setTimeout(() => {
                        const chatArea = chatAreaRefs[selectedBox].current;
                        if (chatArea) {
                          chatArea.scrollTop = chatArea.scrollHeight;
                        }
                      }, 50);
                    }
                  }}
                  onMouseEnter={() => setIsOverSend(true)}
                  onMouseLeave={() => setIsOverSend(false)}
                >
                  {translations?.HeroSection?.mouseResponses?.sendButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={ref}
  className="bg-white relative min-h-[78vh] flex items-center overflow-hidden px-6 md:px-10 pt-32 sm:pt-20 md:pt-28 pb-4 md:pb-6"
    >
      {/* Fake mouse image absolutely positioned at section level */}
      {showFakeMouse && !isInsideBigContainer && !hideOnScroll && (
        <>
          <Image
            src="/HeroSection/MouseForRightContainer.png"
            alt="Mouse"
            width={22}
            height={22}
            style={{
              position: 'fixed',
              left: mousePos.x - 30,
              top: mousePos.y - 0,
              pointerEvents: 'none',
              zIndex: 9000,
              transition: 'left 0.5s cubic-bezier(0.4,0,0.2,1), top 0.5s cubic-bezier(0.4,0,0.2,1)',
              filter: isClicking ? 'brightness(0.8)' : 'none',
            }}
          />
          {/* Bubble for fake mouse, context-aware */}
          <MouseResponses 
            text={isOverSend ? mouseResponseSend : isOverInput ? mouseResponseInput : isOverLeftContainer ? mouseResponsesLeft[mouseResponseIdx] : ''}
          />
        </>
      )}
      {/* Real mouse image when hovering right container */}
      {showRealMouseImage && (
        <Image
          src="/HeroSection/MouseForRightContainer.png"
          alt="Mouse"
          width={22}
          height={22}
          style={{
            position: 'fixed',
            left: realMousePos.x - 11,
            top: realMousePos.y - 11,
            pointerEvents: 'none',
            zIndex: 9000,
          }}
        />
      )}
      {/* Background Video (section only) */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <video
          className="w-full h-full object-cover"
          src={"/HeroSection/BackgroundVideoHeroSection_compressed.mp4"}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        {/* White overlay */}
        <div className="absolute inset-0 w-full h-full bg-white/50 pointer-events-none" />
        {/* Bottom SVG background image */}
        <div className="absolute left-0 bottom-0 w-full" style={{ paddingTop: '25%', zIndex: 1 }}>
          <Image
            src="/HeroSection/BottomBackgroundImageHeroSection.svg"
            alt="Bottom background"
            fill
            sizes="100vw"
            className="pointer-events-none select-none drop-shadow-4xl"
            draggable="false"
          />
        </div>
      </div>
      {/* CONTENT (left only) */}
      <div className="relative mx-auto w-full max-w-7xl z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10">
          <div className="md:col-span-6 lg:col-span-5 xl:col-span-5">
            {/* Small container above title */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 border border-black/10 bg-white/70 px-3 py-1.5 backdrop-blur-md shadow-sm rounded-md"
            >
              <span className="text-[11px] font-medium tracking-wide text-gray-700">{translations?.HeroSection?.news}</span>
              <span className="h-1 w-1 rounded-full bg-gray-400" />
              <span className="text-[11px] text-gray-600">{translations?.HeroSection?.virtual_agent}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-left text-5xl sm:text-6xl md:text-7xl leading-[1.06] font-extrabold tracking-tight text-gray-900"
            >
              {translations?.HeroSection?.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 max-w-xl text-left text-base md:text-lg text-gray-600"
            >
              {translations?.HeroSection?.subtitle}
            </motion.p>

            {/* Mobile-only: chat container under subtitle */}
            {isMobile && (
              <div className="mt-6 md:hidden">
                {renderChat('mobile')}
              </div>
            )}

            {/* Tiny extras to fill a bit of space (left only) */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs text-gray-700">{translations?.HeroSection?.under_subtitle_cards1}</span>
              <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs text-gray-700">{translations?.HeroSection?.under_subtitle_cards2}</span>
              <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-xs text-gray-700">{translations?.HeroSection?.under_subtitle_cards3}</span>
            </div>
            {/* Auth buttons */}
            <div className="mt-5 flex gap-3">
              <button
                className="px-5 py-2 rounded-full border border-black text-black font-semibold bg-white hover:bg-gray-100 hover:text-black"
                type="button"
              >
                {translations?.common?.signIn}
              </button>
              <div className="relative inline-block">
                <button
                  className="px-5 py-2 rounded-full border border-black bg-black text-white font-semibold hover:bg-gray-800 hover:text-white relative z-10"
                  type="button"
                >
                    {translations?.common?.getStarted}
                </button>
                {/* Rainbow shadow using a blurred gradient pseudo-element */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 w-full h-2 z-0 rainbow-shadow"
                />
              </div>
            </div>
          </div>

          {/* Right side container (desktop/tablet). Not rendered on mobile to avoid duplicate refs. */}
          {!isMobile && (
            <div className="hidden md:flex md:col-span-6 lg:col-span-7 items-center justify-end">
              {renderChat('desktop')}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

