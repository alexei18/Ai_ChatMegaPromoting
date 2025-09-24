"use client";

import React from "react";
import { motion, animate, useMotionValue, AnimatePresence } from "framer-motion";

// ================= Helpers =================
const workdaysPerMonth = 22;
const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

function useAnimatedNumber(value: number) {
  const v = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const controls = animate(v, value, { duration: 0.45, ease: "easeOut" });
    const unsub = v.on("change", (latest) => setDisplay(latest));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value]);
  return Math.round(display);
}

// ================= UI Primitives =================

type SliderMark = { value: number; color?: string; label?: string };

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
  marks?: SliderMark[];
  subtitle?: string;
  disabled?: boolean;
  valueDisplay?: string | number;
};

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
  marks,
  subtitle,
  disabled,
  valueDisplay,
}) => (
  <div className="w-full select-none">
    <div className="flex items-end justify-between">
      <div>
  <label className="text-sm text-white/80 tracking-wide">{label}</label>
  {subtitle && <div className="text-xs text-white/80 mt-1">{subtitle}</div>}
      </div>
  <span className="text-sm tabular-nums text-white">
    {valueDisplay ?? value}
        {suffix}
      </span>
    </div>

    <div className="relative mt-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full appearance-none h-1.5 rounded-full focus:outline-none bg-neutral-200 dark:bg-neutral-800 ${
          disabled ? "opacity-50 cursor-not-allowed" : "[accent-color:theme(colors.black)] dark:[accent-color:theme(colors.white)]"
        }`}
        aria-label={label}
      />

      {/* Marks overlay */}
      {marks && marks.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {marks.map((m) => {
            let pct = ((m.value - min) / (max - min)) * 100;
            // small visual nudge for the first marker (commonly 49) so it's not flush to the edge
            if (m.value === 49) pct = Math.min(100, pct + 1.7);
            if (m.value === 150) pct = Math.min(100, pct + 1.4);
            if (m.value === 499) pct = Math.min(100, pct + 0.1);
            return (
              <div key={m.value} style={{ left: `${pct}%`, top: "59%" }} className="absolute -translate-y-1/2 -translate-x-1/2">
                <div className={`w-2 h-2 rounded-full ${m.color ?? "bg-neutral-700 dark:bg-neutral-300"} border border-white/10`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

const Pill: React.FC<{ text: string; dot?: boolean; muted?: boolean }> = ({ text, dot, muted }) => (
  <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs border ${muted ? "bg-neutral-100/60 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-white/80" : "bg-white/70 dark:bg-neutral-900/70 border-neutral-200/60 dark:border-neutral-800/60"}`}>
    {/* dot intentionally not rendered to remove small gray circle */}
    <span>{text}</span>
  </div>
);

const Panel: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
    className="flex flex-col justify-between h-full rounded-2xl p-6 md:p-8 bg-white/70 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm">
    <div className="mb-6">
  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-white">{title}</h3>
  {subtitle && <p className="text-sm text-white/80 mt-1">{subtitle}</p>}
    </div>
  <div className="flex-1 flex flex-col justify-between space-y-4">{children}</div>
  </motion.div>
);

// ================= Types =================

type HumanInputs = {
  salaryMonthly: number;
  workHoursPerDay: number; // 4..12h
  messagesPerDay: number; // 10..5000
  efficiencyPct: number; // 1..99 (% of messages efectiv gestionate)
};

type AIInputs = {
  agentPriceMonthly: number;
  messagesPerDay: number; // 10..5000
};

// ================= Calculations =================

function calcHuman(i: HumanInputs, people: number) {
  const effectiveMsgs = Math.round(i.messagesPerDay * (i.efficiencyPct / 100));
  const monthlyCost = i.salaryMonthly * Math.max(1, Math.floor(people));
  const dailyCost = monthlyCost / workdaysPerMonth;
  return {
    effectiveMsgs,
    monthlyCost,
    dailyCost,
  };
}

function calcAI(i: AIInputs) {
  const effectiveMsgs = i.messagesPerDay; // AI tratează 100% din trafic definit aici
  const monthlyCost = i.agentPriceMonthly;
  const dailyCost = monthlyCost / workdaysPerMonth;
  return {
    effectiveMsgs,
    monthlyCost,
    dailyCost,
  };
}

// ================= Component =================

export default function ROICalculator() {
  // --- Human sliders as requested ---
  const [salaryMonthly, setSalaryMonthly] = React.useState<number>(1200);
  const [workHoursPerDay, setWorkHoursPerDay] = React.useState<number>(8); // 4..12
  const [messagesPerDay, setMessagesPerDay] = React.useState<number>(200); // 10..5000
  const [efficiencyPct, setEfficiencyPct] = React.useState<number>(70); // 1..99 (handled %)

  // Optional: count of identical-salary people (kept, not a slider)
  const [teamCount, setTeamCount] = React.useState<number>(1);

  // Auto-adjust teamCount: 1 worker per 200 messages (round up).
  // When messagesPerDay changes, update teamCount accordingly.
  React.useEffect(() => {
    const calculated = Math.max(1, Math.ceil(messagesPerDay / 200));
    setTeamCount(calculated);
  }, [messagesPerDay]);

  // --- AI sliders ---
  const [agentPrice, setAgentPrice] = React.useState<number>(150); // keep as-is, free range
  const [aiMessagesPerDay, setAiMessagesPerDay] = React.useState<number>(200); // same range as Human
  const [agentCustom, setAgentCustom] = React.useState<boolean>(false);
  const [agentUserSet, setAgentUserSet] = React.useState<boolean>(false);
  const agentAnimRef = React.useRef<any>(null);
  const aiAnimRef = React.useRef<any>(null);
  // Which panel currently "owns" the Enterprise CTA (null | 'human' | 'ai')
  const [enterpriseOwner, setEnterpriseOwner] = React.useState<null | 'human' | 'ai'>(null);

  const animateAgentPriceTo = (target: number, duration = 0.45) => {
    if (agentAnimRef.current) agentAnimRef.current.stop();
    // start from current agentPrice
    agentAnimRef.current = animate(agentPrice, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setAgentPrice(Math.round(v)),
    });
  };

  const animateAiMessagesTo = (target: number, duration = 0.45) => {
    if (aiAnimRef.current) aiAnimRef.current.stop();
    aiAnimRef.current = animate(aiMessagesPerDay, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setAiMessagesPerDay(Math.round(v)),
    });
  };

  // Agent price change handler with downward-snapping behavior:
  // - when user slides lower: snap to 49, then 150, then 499; from 499+ allow free values
  const handleAgentPriceChange = (v: number) => {
  // user explicitly changed agent price
  setAgentUserSet(true);
    const vRounded = Math.round(v);
    const maxVal = 1000;

    // If user dragged to max, treat as Custom
    if (vRounded >= maxVal) {
      setAgentCustom(true);
  setAgentPrice(maxVal);
      return;
    }

    // otherwise clear custom and snap to nearest stops
    if (agentCustom) setAgentCustom(false);
    const stopA = 49;
    const stopB = 150;
    const stopC = 499;
    const midAB = Math.floor((stopA + stopB) / 2); // ~99
    const midBC = Math.floor((stopB + stopC) / 2); // ~324

    let newVal: number;
    if (vRounded <= midAB) {
      newVal = stopA;
    } else if (vRounded <= midBC) {
      newVal = stopB;
    } else if (vRounded < 500) {
      newVal = stopC;
    } else {
      newVal = vRounded;
    }

  // when user picks a canonical plan, map back to messages/day maxima
    if (newVal === stopA) {
      animateAiMessagesTo(200);
    } else if (newVal === stopB) {
      animateAiMessagesTo(800);
    } else if (newVal === stopC) {
      animateAiMessagesTo(1600);
    }

    // user-driven agent change should be instant
    setAgentPrice(newVal);
  };

  // helper: returns allowed messages/day range for a given agent price
  const getRangeForPrice = (price: number) => {
    if (price === 49) return { min: 10, max: 200 };
    if (price === 150) return { min: 201, max: 800 };
    if (price === 499) return { min: 801, max: 1600 };
    // custom/enterprise
    return { min: 1601, max: 5000 };
  };

  const handleAiMessagesChange = (v: number) => {
    const vRounded = Math.round(v);
    if (agentUserSet) {
      const range = getRangeForPrice(agentPrice);
      if (vRounded >= range.min && vRounded <= range.max) {
        setAiMessagesPerDay(vRounded);
        return; // keep agent price as user set
      }
      // outside allowed range: clear user-set override and allow auto-mapping
      setAgentUserSet(false);
    }

    setAiMessagesPerDay(vRounded);
    // Enterprise ownership: user raised AI messages beyond 1600 -> AI owns
    if (vRounded > 1600) {
      setEnterpriseOwner('ai');
    } else if (enterpriseOwner === 'ai') {
      // If AI drops below threshold, transfer to human if eligible, else clear
      if (messagesPerDay > 1600) setEnterpriseOwner('human');
      else setEnterpriseOwner(null);
    }
  };

  // Human messages change with ownership logic
  const handleHumanMessagesChange = (v: number) => {
    const vRounded = Math.round(v);
    setMessagesPerDay(vRounded);
    setAiMessagesPerDay(vRounded); // <-- Add this line to sync AI messages
    if (vRounded > 1600) {
      setEnterpriseOwner('human');
    } else if (enterpriseOwner === 'human') {
      if (aiMessagesPerDay > 1600) setEnterpriseOwner('ai');
      else setEnterpriseOwner(null);
    }
  };

  // subtitle text for agent price showing plan names for the snap values
  const getAgentPlanSubtitle = (price: number) => {
    if (price === 49) return "Plan: Starter — $49 / lună";
    if (price === 150) return "Plan: Professional — $150 / lună";
    if (price === 499) return "Plan: Business — $499 / lună";
    if (agentCustom) return `Plan: Custom — $${price} / lună`;
    if (price > 499) return `Plan: Enterprise — $${price} / lună`;
    return `Plan: Custom — $${price} / lună`;
  };
  const agentPlanSubtitle = getAgentPlanSubtitle(agentPrice);

  // Sync agent price based on AI messages per day ranges (map AI slider -> price)
  React.useEffect(() => {
    // user request mapping:
    // 10..200 -> 49
    // 201..800 -> 150
    // 801..1600 -> 499
    // >1600 -> custom (set to max 1000 and show Custom label)
    if (agentUserSet) return; // don't override user-chosen agent price

    if (aiMessagesPerDay <= 200) {
      setAgentCustom(false);
      animateAgentPriceTo(49);
    } else if (aiMessagesPerDay <= 800) {
      setAgentCustom(false);
      animateAgentPriceTo(150);
    } else if (aiMessagesPerDay <= 1600) {
      setAgentCustom(false);
      animateAgentPriceTo(499);
    } else {
      setAgentCustom(true);
      animateAgentPriceTo(1000);
    }
  }, [aiMessagesPerDay, agentUserSet]);

  const humanRes = React.useMemo(
    () => calcHuman({ salaryMonthly, workHoursPerDay, messagesPerDay, efficiencyPct }, teamCount),
    [salaryMonthly, workHoursPerDay, messagesPerDay, efficiencyPct, teamCount]
  );
  const aiRes = React.useMemo(
    () => calcAI({ agentPriceMonthly: agentPrice, messagesPerDay: aiMessagesPerDay }),
    [agentPrice, aiMessagesPerDay]
  );

  const monthlyHuman = useAnimatedNumber(Math.round(humanRes.monthlyCost));
  const monthlyAI = useAnimatedNumber(Math.round(aiRes.monthlyCost));
  const monthlySavings = useAnimatedNumber(Math.max(0, Math.round(humanRes.monthlyCost - aiRes.monthlyCost)));
  const annualSavings = useAnimatedNumber(Math.max(0, Math.round((humanRes.monthlyCost - aiRes.monthlyCost) * 12)));

  const getHumanCostColor = (cost: number) => {
    if (cost <= 1000) return '#FFFFFF'; // White
    if (cost > 1000 && cost <= 50000) {
      const percentage = (cost - 1000) / (50000 - 1000);
      // Transition from white to yellow
      const green = 255;
      const blue = 255 - Math.floor(255 * percentage);
      return `rgb(255, ${green}, ${blue})`;
    }
    if (cost > 50000) {
      const percentage = Math.min(1, (cost - 50000) / (125000 - 50000));
      // Transition from yellow to red
      const green = 255 - Math.floor(255 * percentage);
      return `rgb(255, ${green}, 0)`;
    }
    return '#FF0000'; // Red
  };

  const getSavingsGlowStyle = (savings: number) => {
    if (savings <= 0) return {};
    const intensity = Math.min(1, savings / 50000); // Cap intensity at 50k savings
    const blur = Math.round(intensity * 20);
    const color = `rgba(255, 255, 255, ${intensity * 0.7})`;
    return {
      textShadow: `0 0 ${blur}px ${color}`,
    };
  };

  return (
    <div className="relative overflow-hidden bg-black w-full text-white pt-[150px] pb-[100px] md:pb-[130px]">
      {/* Angled top divider (~30°), rising to the right */}
      <div className="absolute inset-x-0 top-0 h-28 md:h-36 pointer-events-none z-[1]" aria-hidden>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Triangle with bottom edge at ~30°: from (0,57.735) up to (100,0) */}
          <polygon points="0,0 100,0 0,57.735" fill="#ffffff" />
        </svg>
      </div>
      <div className="relative z-10 mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-8 md:mb-12">
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="text-4xl text-white md:text-6xl font-extrabold tracking-tight leading-tight">
            ROI Calculator — Om vs AI Agent
          </motion.h1>
          <p className="mt-3 text-sm md:text-base text-white/80 max-w-2xl">
            Din costuri lunare și eficiență umană limitată → la AI care răspunde non-stop și nu ratează nicio oportunitate.
          </p>
        </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch min-h-[520px]">
          {/* Human Panel */}
          <Panel title="Agent uman">
            {/* People (kept) */}
            <div className="flex items-center gap-3 -mt-2 mb-2">
              <label className="text-xs text-white/80">Agenti cu acelasi salariu:</label>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={500}
                value={teamCount}
                onChange={(e) => setTeamCount(clamp(parseInt(e.target.value || "1", 10) || 1, 1, 500))}
                className="h-8 w-20 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 px-2 text-sm tabular-nums"
              />
            </div>

            <Slider label="Salariu lunar / lună ($)" min={100} max={5000} step={50} value={salaryMonthly} onChange={setSalaryMonthly} />
            <Slider label="Program de lucru / zi" min={4} max={12} step={1} value={workHoursPerDay} onChange={setWorkHoursPerDay} />
            <Slider label="Mesaje / zi" min={10} max={5000} step={10} value={messagesPerDay} onChange={handleHumanMessagesChange} />
            <Slider label="Eficiență (%)" subtitle="Rata de reușită per interacțiune" min={1} max={99} step={1} value={efficiencyPct} onChange={setEfficiencyPct} />

            <div className="pt-4 grid grid-cols-2 gap-4 text-sm text-white/90">
              <div>
                <div className="uppercase tracking-wider text-xs text-white/80">Mesaje gestionate eficient</div>
                <div className="mt-1 font-extrabold text-2xl md:text-3xl tabular-nums text-white">{humanRes.effectiveMsgs} / day</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="uppercase tracking-wider text-xs text-white/80">Program de lucru</div>
                <Pill text={`${workHoursPerDay}h / zi`} muted />
              </div>
            </div>

              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
              <div>
                <div className="uppercase text-xs tracking-wider text-white/80">Total lunar</div>
                <motion.div
                  className="text-3xl md:text-5xl font-semibold tabular-nums"
                  style={{ color: getHumanCostColor(monthlyHuman) }}
                >
                  ${monthlyHuman}
                </motion.div>
                <div className="text-xs text-white/80 mt-1">Salariu × Agenți</div>
              </div>
              <div className="opacity-70">
                <div className="uppercase text-xs tracking-wider text-white/80">Pe zi</div>
                <div className="text-lg md:text-xl font-medium tabular-nums">${Math.round((salaryMonthly * Math.max(1, Math.floor(teamCount))) / workdaysPerMonth)}</div>
              </div>
              <AnimatePresence>
                {enterpriseOwner === 'human' && messagesPerDay > 1600 && (
                  <motion.div
                    key="human-enterprise"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-4 md:mt-0"
                  >
                    <div className="relative inline-block">
                      <button aria-label="Enterprise contact" className="relative z-10 rounded-full bg-white text-black flex items-center justify-center px-4 py-2 text-sm md:text-base font-semibold shadow-sm border border-white hover:scale-105 transition-transform">Enterprise?</button>
                      {/* Rainbow shadow (same as Hero) */}
                      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 w-[90%] h-2 z-0 rainbow-shadow" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 0.06 }}
                      className="text-xs text-white/80 mt-3"
                    >
                      Let&apos;s Discuss about your investments
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Panel>

          {/* AI Panel */}
          <Panel title="Agent AI">
            <Slider
              label="Cost agent ai / lună ($)"
              subtitle={agentPlanSubtitle}
              min={49}
              max={1000}
              step={1}
              value={agentPrice}
              valueDisplay={agentCustom ? "Custom" : agentPrice}
              onChange={handleAgentPriceChange}
              marks={[{ value: 49, color: "bg-gray-200" }, { value: 150, color: "bg-gray-200" }, { value: 499, color: "bg-gray-200" }]}
            />

            {/* Locked 24/7 field */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 tracking-wide">Program de lucru / zi</div>
              </div>
              <Pill text="24 / 7" dot />
            </div>
            <input type="range" min={0} max={24} value={24} disabled readOnly aria-valuemin={0} aria-valuemax={24} className="w-full mt-2 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 opacity-50 cursor-not-allowed" />

            <Slider label="Mesaje / zi" min={10} max={5000} step={10} value={aiMessagesPerDay} onChange={handleAiMessagesChange} />

            <div className="pt-4 grid grid-cols-2 gap-4 text-sm text-white/90">
              <div>
                <div className="uppercase tracking-wider text-xs text-white/80">Mesaje gestionate eficient</div>
                <div className="mt-1 font-extrabold text-2xl md:text-3xl tabular-nums text-white">{aiRes.effectiveMsgs} / day</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="uppercase tracking-wider text-xs text-white/80">Program de lucru</div>
                <Pill text="24 / 7" dot />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6">
              <div>
                <div className="uppercase text-xs tracking-wider text-white/80">Total lunar</div>
                <motion.div className="text-3xl md:text-5xl font-semibold tabular-nums">{agentCustom ? "Custom" : `$${monthlyAI}`}</motion.div>
              </div>
              <div className="opacity-70">
                <div className="uppercase text-xs tracking-wider text-white/80">Pe zi</div>
                <div className="text-lg md:text-xl font-medium tabular-nums">${Math.round(agentPrice / workdaysPerMonth)}</div>
              </div>
              <AnimatePresence>
                {enterpriseOwner === 'ai' && aiMessagesPerDay > 1600 && (
                  <motion.div
                    key="ai-enterprise"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-4 md:mt-0"
                  >
                    <div className="relative inline-block">
                      <button aria-label="Enterprise contact" className="relative z-10 rounded-full bg-white text-black flex items-center justify-center px-4 py-2 text-sm md:text-base font-semibold shadow-sm border border-white hover:scale-105 transition-transform">Enterprise?</button>
                      {/* Rainbow shadow (same as Hero) */}
                      <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-1 w-[90%] h-2 z-0 rainbow-shadow" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 0.06 }}
                      className="text-xs text-white/80 mt-3"
                    >
                      Let&apos;s Discuss about your investments
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Panel>
        </div>

        {/* Savings */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-8 md:mt-12 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-6 md:p-8 bg-neutral-50/60 dark:bg-black/40"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
              <div className="uppercase text-xs tracking-wider text-white/80">Economii lunare estimate</div>
              <div
                className="text-4xl md:text-6xl font-semibold tabular-nums"
                style={getSavingsGlowStyle(monthlySavings)}
              >
                ${monthlySavings}
              </div>
            </div>
            <div className="opacity-80">
              <div className="uppercase text-xs tracking-wider text-white/80">Economii anuale estimate</div>
              <div className="text-2xl md:text-4xl font-semibold tabular-nums">${annualSavings}</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-700 dark:text-neutral-300">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="uppercase tracking-wider text-xs text-white/80">Baze de calcul</div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>{workdaysPerMonth} zile/lună</li>
                {/* <li>Eficiență Umană = % Mesaje gestionate eficient (1–99%)</li> */}
                <li>AI = 100% trafic</li>
                <li>Human: ore/zi variabile, AI: 24/7</li>
                {/* <li>Cost = Salariu vs Abonament</li> */}
                {/* <li>1 agent/200 mesaje</li> */}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="uppercase text-xs tracking-wider text-white/80">Note</div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><em>Eficiență</em> = % mesaje rezolvate complet, nu doar citite.</li>
                <li><em>Mesaje/zi</em> include orele de vârf</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="uppercase text-xs tracking-wider text-white/80">Sfaturi</div>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Pornește de la date reale.</li>
                <li>Simulează: crește <em>Eficiență</em> și observă impactul pe economii.</li>
              </ul>
            </div>
          </div>
        </motion.div>

  <div className="mt-6 text-xs text-white/80">*Doar estimări. Ajustează parametrii la piața ta.</div>
      </div>
    </div>
  );
}
