"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

const DURATION_MS = 1300;

/** True once the preloader is gone. The hero waits on this so its entrance isn't spent behind it. */
const ReadyContext = createContext(true);
export const useAppReady = () => useContext(ReadyContext);

function Counter({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // easeOutCubic: races ahead early, then settles, so it never looks like a fake stall at 99.
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(step);
      else onDone();
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      className="fixed inset-0 z-[10000] flex items-end justify-between bg-[var(--hero-void)] px-6 pb-10 sm:px-10"
    >
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--hero-sage)]">
        Loading
      </span>
      <span
        // aria-hidden: a counter ticking 0–100 in the live region is noise, and the page content
        // underneath is already in the DOM for assistive tech.
        aria-hidden
        className="font-display text-[clamp(3rem,14vw,9rem)] font-extrabold leading-none tracking-[-0.05em] text-[var(--hero-cream)] tabular-nums"
      >
        {value}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-[var(--hero-amber)]"
        style={{ transform: `scaleX(${value / 100})` }}
      />
    </motion.div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  // Starts false so the server render and first client paint agree; the effect below decides.
  const [loading, setLoading] = useState(false);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    // Only the first visit in a tab gets the preloader — seeing it on every back-navigation is a
    // tax, not a flourish.
    const seen = sessionStorage.getItem("preloaded") === "1";
    if (!seen && !reduced) setLoading(true);
    setDecided(true);
  }, [reduced]);

  useEffect(() => {
    if (!loading) return;
    // The overlay covers the page, so scrolling underneath it would be scrolling blind.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [loading]);

  function finish() {
    sessionStorage.setItem("preloaded", "1");
    setLoading(false);
  }

  return (
    <ReadyContext.Provider value={decided && !loading}>
      <AnimatePresence>{loading && <Counter key="preloader" onDone={finish} />}</AnimatePresence>
      {children}
    </ReadyContext.Provider>
  );
}
