"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageSquare, Zap, PlugZap, UserCog, PiggyBank } from "lucide-react";
import { usePathname } from "next/navigation";
import ro from "@/locales/ro.json";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";

/*****************************************
 * Small helpers
 *****************************************/
const icons = [MessageSquare, Zap, PlugZap, UserCog, PiggyBank];

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

/*****************************************
 * Animated network diagram (SVG)
 * - 3 nodes (User → AI → Platform)
 * - glowing links
 * - highlights sync with list hover/selection
 *****************************************/
function AnimatedDiagram({ activeIndex }: { activeIndex: number }) {
  const prefersReduced = useReducedMotion();

  // Node positions (responsive-ish within viewBox 1000x600)
  const nodes = [
    { x: 220, y: 300, label: "User" },
    { x: 500, y: 260, label: "AI" },
    { x: 780, y: 320, label: "Platform" },
  ];

  const paths = [
    `M ${nodes[0].x} ${nodes[0].y} C 340 220, 420 220, ${nodes[1].x} ${nodes[1].y}`,
    `M ${nodes[1].x} ${nodes[1].y} C 580 260, 660 300, ${nodes[2].x} ${nodes[2].y}`,
  ];

  const pulse = prefersReduced
    ? {}
    : { strokeDasharray: "6 10", strokeDashoffset: [0, -64] };

  const dur = 2.2;

  return (
    <svg
      viewBox="0 0 1000 600"
      className="w-full h-full"
      aria-label="How Bravin routes requests: User to AI to Platform"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(99,102,241,0.7)" />
          <stop offset="100%" stopColor="rgba(99,102,241,0)" />
        </radialGradient>
        <linearGradient id="linkGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Links */}
      {paths.map((d, i) => (
        <g key={i}>
          {/* soft outer glow */}
          <path d={d} stroke="url(#linkGradient)" strokeWidth={10} opacity={0.15} fill="none" />
          {/* animated dash */}
          <motion.path
            d={d}
            stroke="url(#linkGradient)"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            filter="url(#soft)"
            initial={false}
            animate={pulse}
            transition={{ duration: dur, ease: "linear", repeat: Infinity }}
            style={{ opacity: activeIndex >= 0 ? 0.9 : 0.6 }}
          />
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isHot = activeIndex === i || (activeIndex === 4 && i === 1); // map last item to center node
        return (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={56} fill="url(#nodeGlow)" opacity={isHot ? 0.6 : 0.25} />
            <circle cx={n.x} cy={n.y} r={30} fill="#ffffff" />
            <text x={n.x} y={n.y + 56} textAnchor="middle" fontSize={16} fill="#0f172a" opacity={0.8}>
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/*****************************************
 * Tabs (industry selector)
 *****************************************/
function IndustryTabs({
  tabs,
  value,
  onChange,
}: {
  tabs: string[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div role="tablist" aria-label="Industries" className="inline-flex rounded-full bg-black/5 p-1">
      {tabs.map((t, i) => (
        <button
          key={t}
          role="tab"
          aria-selected={i === value}
          aria-controls={`tab-panel-${i}`}
          className={classNames(
            "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition",
            i === value ? "bg-white shadow text-black" : "text-black/70 hover:text-black"
          )}
          onClick={() => onChange(i)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/*****************************************
 * Main redesigned component
 *****************************************/
export default function IndustryModulesRedesign() {
  // language
  const pn = usePathname();
  const pathname = (pn as string) ?? (typeof window === "undefined" ? "" : (globalThis as any)?.location?.pathname || "");
  const locales: Record<string, any> = { ro, en, ru };
  const match = pathname ? (pathname as string).match(/^\/([a-z]{2})(?:\/|$)/) : null;
  const currentLanguage = match && match[1] ? match[1] : "ro";
  const translations = locales[currentLanguage] || ro;

  const industryModule = translations?.IndustryModules;
  if (!industryModule || !Array.isArray(industryModule.industries) || industryModule.industries.length === 0 || !Array.isArray(industryModule.menuItems) || industryModule.menuItems.length === 0) {
    return null;
  }

  const tabs = industryModule.industries as string[]; // e.g. ["university", ...]
  const items = useMemo(() => {
    const raw = industryModule.menuItems as any[];
    return raw.map((m: any, i: number) => ({ id: m.id ?? i + 1, title: m.title, subtitle: m.subtitle }));
  }, [industryModule.menuItems]);

  const [tabIndex, setTabIndex] = useState(0);
  // no item open by default; items open only on hover
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // auto-advance items while list is visible
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const [menuVisible, setMenuVisible] = useState(true);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const el = leftColRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        const visible = e.isIntersecting && e.intersectionRatio > 0.2;
        setMenuVisible(visible);
      },
      { threshold: [0, 0.2, 0.5, 1] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  
  // Auto-advance is disabled; left-column items change only via user interaction.

  // map hover/selection to diagram active node (0: User, 1: AI, 2: Platform, 4: cost/ops → center)
  const activeForDiagram = hoveredIndex > -1 ? hoveredIndex : selectedIndex;

  return (
    <section aria-labelledby="industry-h2" className="relative bg-white">
      <div className="mx-auto max-w-[1200px] px-6 pt-20 md:pt-28 pb-20">
        {/* Header */}
        <div className="flex flex-col gap-6 md:gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 id="industry-h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1]">
              {industryModule.title || translations.IndustryModules?.title}
            </h2>
            <p className="mt-4 text-[17px] md:text-lg text-[#374151] max-w-2xl">
              {industryModule.subtitle || translations.IndustryModules?.subtitle}
            </p>
          </div>
                  <IndustryTabs tabs={tabs} value={tabIndex} onChange={(i) => { setTabIndex(i); setSelectedIndex(-1); }} />
        </div>

        {/* Grid 12-col */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 items-start">
          {/* Left list */}
          <div ref={leftColRef} className="col-span-12 md:col-span-7 flex flex-col gap-3">
            {items.map((item, idx) => {
              const Icon = icons[idx % icons.length];
              // active state is driven only by hover
              const active = hoveredIndex === idx;
              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  className={classNames(
                    "group text-left rounded-2xl border border-black/10 transition shadow-sm",
                    active ? "bg-white" : "bg-white hover:bg-black/[0.02]"
                  )}
                >
                  <div className="relative z-[1] flex items-start gap-4 px-4 py-4 md:px-5 md:py-5">
                    <div className={classNames(
                      "shrink-0 grid place-items-center h-10 w-10 rounded-xl",
                      active ? "bg-black/[0.06]" : "bg-black/[0.05]"
                    )}>
                      <Icon className={classNames("h-5 w-5", active ? "text-black" : "text-black/70")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={classNames("font-semibold", active ? "text-black" : "text-black/90 group-hover:text-black")}>{item.title}</div>
                      <AnimatePresence initial={false}>
                        {(active || hoveredIndex === idx) && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="text-sm md:text-[15px] text-[#4B5563] mt-1 pr-2"
                          >
                            {item.subtitle}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Social proof */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-black/60">
              <span className="font-medium">Trusted by</span>
              <div className="flex items-center gap-3 opacity-80">
                <div className="h-6 w-20 rounded bg-black/5" />
                <div className="h-6 w-16 rounded bg-black/5" />
                <div className="h-6 w-24 rounded bg-black/5" />
                <div className="h-6 w-14 rounded bg-black/5" />
              </div>
            </div>
          </div>

          {/* Right card */}
          <div className="col-span-12 md:col-span-5 md:sticky md:top-24">
            <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-amber-300/40 via-sky-300/40 to-violet-300/40 shadow-[0_12px_40px_rgba(0,0,0,.06)]">
              <div className="rounded-3xl bg-white/90 backdrop-blur-sm">
                <div className="aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden">
                  <AnimatedDiagram activeIndex={activeForDiagram} />
                </div>
              </div>
            </div>

            {/* CTA cluster */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#get-started"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold bg-black text-white hover:bg-black/90"
              >
                {translations.common?.getStarted || "Get started"}
              </a>
              <a
                href="#demo"
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold border border-black/15 text-black hover:bg-black/[0.03]"
              >
                {translations.common?.seeDemo || "See demo"}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom fade */}
      <div className="pointer-events-none h-24 w-full bg-gradient-to-t from-black/5 to-transparent" />
    </section>
  );
}
