"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";

/**
 * CookiesConsent
 * - Shows once per browser (localStorage flag)
 * - Playful, animated, fixed container
 */
export default function CookiesConsent() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const accepted = localStorage.getItem("cookies-consent");
      if (!accepted) setShow(true);
    } catch {
      // ignore
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("cookies-consent", "accepted");
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.8 }}
          className="fixed z-[1000] left-4 right-4 bottom-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md"
          style={{ pointerEvents: "auto" }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-pink-500/90 via-amber-400/90 to-indigo-500/90 backdrop-blur-xl shadow-2xl">
            {/* playful floating shapes */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/20 blur-sm"
              animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.05, 0.98, 1] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-white/15 blur"
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.08, 0.96, 1] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            />

            <div className="flex items-start gap-3 p-4 sm:p-5 text-white">
              <motion.div
                className="shrink-0 mt-0.5"
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              >
                <div className="grid place-items-center h-10 w-10 rounded-full bg-white/25 border border-white/30 shadow">
                  <Cookie className="h-6 w-6" />
                </div>
              </motion.div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-tight text-base sm:text-lg drop-shadow">Cookie time! 🍪</h3>
                <p className="mt-1 text-sm sm:text-[15px] leading-snug text-white/95">
                  Folosim cookie-uri ca să-ți facem vizita mai dulce. 
                  Acceptă pentru o experiență mai bună.
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <motion.button
                    onClick={accept}
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ y: -2 }}
                    className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-pink-900 bg-white shadow-lg shadow-black/10 hover:shadow-xl hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-white/70"
                  >
                    Accept 🍪
                  </motion.button>

                  {/* optional tiny text link - kept subtle */}
                  <a
                    href="/trustcenter"
                    className="text-xs sm:text-[13px] underline decoration-white/50 hover:decoration-white/90 text-white/90"
                  >
                    Află mai multe
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
