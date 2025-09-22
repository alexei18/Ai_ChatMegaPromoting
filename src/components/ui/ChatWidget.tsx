'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bună! Sunt asistentul virtual AI. Cu ce te pot ajuta astăzi?',
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // State for showing/hiding the info containers
  const [showDesktopInfo, setShowDesktopInfo] = useState(true)
  const [showMobileInfo, setShowMobileInfo] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const chatButtonRef = useRef<HTMLButtonElement>(null)

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.parentElement) {
      const container = messagesEndRef.current.parentElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  useEffect(() => {
    // Timeout to ensure DOM is painted and input is measured
    const t = setTimeout(scrollToBottom, 30);
    return () => clearTimeout(t);
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Simulate AI response
  const generateAIResponse = (userMessage: string) => {
    const responses = [
      'Înțeleg întrebarea ta. Pot să îți ofer mai multe detalii despre soluțiile noastre AI.',
      'Sunt aici să te ajut! Ce anume te Bravinează cel mai mult?',
      'Excelentă întrebare! Soluțiile noastre AI pot automatiza multe procese pentru afacerea ta.',
      'Îți pot explica cum funcționează tehnologia noastră și ce beneficii aduce.',
      'Pentru informații detaliate, echipa noastră de specialiști îți poate oferi o consultanță gratuită.'
    ]
    
    // Simple keyword-based responses
    if (userMessage.toLowerCase().includes('preț') || userMessage.toLowerCase().includes('cost')) {
      return 'Prețurile variază în funcție de nevoile specifice ale afacerii tale. Îți recomand să programezi o consultanță gratuită pentru o ofertă personalizată.'
    }
    
    if (userMessage.toLowerCase().includes('demo') || userMessage.toLowerCase().includes('demonstrație')) {
      return 'Cu plăcere! Pot programa o demonstrație live pentru tine. În ce zi și oră ai fi disponibil?'
    }
    
    if (userMessage.toLowerCase().includes('implementare') || userMessage.toLowerCase().includes('instalare')) {
      return 'Procesul de implementare durează în general 2-4 săptămâni, în funcție de complexitate. Echipa noastră te ghidează pas cu pas.'
    }
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)
    const original = trimmed
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(original),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    const current = inputValue
    setInputValue('')
    sendMessage(current)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Suggested quick prompts for the redesigned intro card
  const suggestions = [
    'Care sunt prețurile?',
    'Vreau o demonstrație',
    'Ajutor la implementare'
  ];

  const handleSuggestionClick = (text: string) => {
    // Open chat, hide info cards, send message instantly
    if (!isOpen) setIsOpen(true)
    setShowDesktopInfo(false)
    setShowMobileInfo(false)
    sendMessage(text)
  };

  // Close chat on outside click
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (
        chatWindowRef.current && chatWindowRef.current.contains(target)
      ) return;
      if (chatButtonRef.current && chatButtonRef.current.contains(target)) return;
      // clicked outside
      setIsOpen(false)
      setShowDesktopInfo(false)
      setShowMobileInfo(false)
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <>
      {/* Decorative fixed gradient blob (independent of open state) */}
      {/* <div
        aria-hidden
        className="fixed bottom-0 right-0 w-[380px] h-[380px] sm:w-[460px] sm:h-[460px] pointer-events-none z-30"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(99,102,241,0.35), rgba(99,102,241,0.08) 55%, rgba(99,102,241,0) 70%)',
          filter: 'blur(40px)',
          opacity: 0.9,
          maskImage: 'radial-gradient(circle at 70% 70%, black, transparent 70%)'
        }}
      /> */}
      {/* Info Containers above chat widget */}
      {/* Desktop container */}

      {/* Desktop info container - positioned above chat widget button */}
      <AnimatePresence>
        {showDesktopInfo && (
          <motion.div
            className="hidden sm:flex fixed right-6 bottom-[7.2rem] w-[410px] bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.08)] rounded-3xl z-50 p-5 flex-col gap-3"
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          >
            <div className="flex items-start gap-3">
              {/* Removed gradient clock icon per request */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm tracking-tight">Bravin AI te poate ajuta rapid</h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">Întreabă despre prețuri, programarea unui demo sau implementare. Răspunsurile sunt generate instant.</p>
              </div>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 shrink-0"
                onClick={() => setShowDesktopInfo(false)}
                aria-label="Închide card intro"
              >
                <span className="text-sm font-bold">×</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="text-[11px] px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 hover:from-indigo-500/20 hover:via-violet-500/20 hover:to-fuchsia-500/20 border border-indigo-400/30 text-indigo-700 font-medium backdrop-blur-sm transition-colors"
                  type="button"
                >{s}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile info container - positioned above chat widget button */}
      <AnimatePresence>
        {showMobileInfo && (
          <motion.div
            className="flex sm:hidden fixed right-3 bottom-[4.4rem] w-[88vw] bg-white/85 backdrop-blur-xl border border-white/50 rounded-2xl shadow-lg z-50 p-3 flex-col gap-2"
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="flex items-start gap-2">
              {/* Removed gradient clock icon per request */}
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-[12px] font-semibold text-gray-800 leading-snug">Întreabă AI-ul</p>
                <p className="text-[10px] text-gray-600 leading-snug mt-0.5">Prețuri, demo, implementare – răspunsuri rapide.</p>
              </div>
              <button
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                onClick={() => setShowMobileInfo(false)}
                aria-label="Închide card mobil"
              >
                <span className="text-xs font-bold">×</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/30 text-indigo-700 font-medium transition-colors"
                  type="button"
                >{s}</button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Widget Button - Fixed position in bottom right */}
      <motion.div
        className="fixed bottom-3 right-3 z-[99999] sm:bottom-6 sm:right-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          ref={chatButtonRef}
          onClick={() => {
            const opening = !isOpen;
            setIsOpen(opening);
            if (opening) {
              // hide the intro notifications when the chat opens
              setShowDesktopInfo(false);
              setShowMobileInfo(false);
            }
          }}
          className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Notification dot when closed */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.svg
                key="close"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 180, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="chat"
                initial={{ rotate: 180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            className="fixed bottom-20 right-2 w-[95vw] max-w-xs h-[70vh] min-h-[340px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[99999] overflow-hidden sm:bottom-24 sm:right-6 sm:w-[480px] sm:max-w-lg sm:h-[500px] flex flex-col"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header + Phone Button */}
            <div className="bg-gray-600 text-white p-2 sm:p-4 flex items-center gap-2 sm:gap-3 justify-between relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                    <h3 className="font-semibold text-[11px] sm:text-base">Bravin AI</h3>
                  <p className="text-[10px] sm:text-sm text-blue-100">Online</p>
                </div>
              </div>
              {/* Phone Button */}
              <PhonePopup />
            </div>

            {/* Messages */}
            <div className="relative flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4 pb-16 sm:pb-20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80vw] sm:max-w-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl ${
                      message.isUser
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-[11px] sm:text-sm leading-snug">{message.text}</p>
                    <p
                      className={`text-[9px] sm:text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}
                      suppressHydrationWarning
                    >
                      {message.timestamp.toLocaleTimeString('ro-RO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input - fixed bottom */}
            <div className="absolute left-0 bottom-0 w-full border-t border-gray-200 p-2 sm:p-4 bg-white">
              <div className="flex gap-1 sm:gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrie un mesaj..."
                  className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-full p-2 sm:p-2.5 transition-colors"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// PhonePopup component
function PhonePopup() {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length >= 7) {
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setSubmitted(false);
        setPhone('');
      }, 2000);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Text + săgeată */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center bg-white text-gray-900 px-3 py-1 rounded-lg shadow border border-gray-200 text-sm font-medium select-none mr-1"
          >
              <span className="text-[11px] sm:text-base">Facem un apel?</span>
            <svg className="w-4 h-4 ml-1 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Butonul verde */}
      <button
        className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setOpen((v) => !v)}
        aria-label="Solicită apel telefonic"
        type="button"
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2A19.72 19.72 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.13 1.13.37 2.23.72 3.28a2 2 0 01-.45 2.11l-1.27 1.27a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c1.05.35 2.15.59 3.28.72A2 2 0 0121 16.92z" />
        </svg>
      </button>
      {/* Pop-up input telefon */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 z-50 p-4"
          >
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-green-600 text-2xl mb-2">✔️</div>
                <div>Număr trimis! Vei fi contactat în curând.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <label htmlFor="phone-input" className="text-xs sm:text-sm font-medium">Noi te vom suna :)</label>
                <input
                  id="phone-input"
                  ref={inputRef}
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="+373xxxxxxxx"
                  required
                  minLength={7}
                />
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 mt-2 font-semibold transition-colors text-xs sm:text-sm"
                >Trimite</button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
