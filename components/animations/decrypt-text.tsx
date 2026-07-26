"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=/<>_";
const TICK_MS = 45;
const TICKS_PER_CHAR = 2; // how long each character stays scrambled before locking

/**
 * Characters churn through random glyphs and lock in left to right. The animated text is hidden
 * from assistive tech and the real string is exposed separately — otherwise a screen reader
 * announces the scramble as gibberish.
 */
export function DecryptText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(0);
  const [noise, setNoise] = useState(0);

  const done = reduced || revealed >= text.length;

  useEffect(() => {
    if (!inView || reduced) return;
    let tick = 0;
    const id = setInterval(() => {
      tick += 1;
      setNoise((n) => n + 1);
      const next = Math.floor(tick / TICKS_PER_CHAR);
      setRevealed(next);
      if (next >= text.length) clearInterval(id);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [inView, reduced, text.length]);

  return (
    <span ref={ref} className={cn("relative", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split("").map((char, i) => {
          if (done || i < revealed || char === " ") return <span key={i}>{char}</span>;
          // noise is in the dep chain purely so each tick re-rolls the glyph.
          const glyph = GLYPHS[(i * 7 + noise * 13) % GLYPHS.length];
          return (
            <span key={i} className="text-[var(--hero-amber)]/70">
              {glyph}
            </span>
          );
        })}
      </span>
    </span>
  );
}
