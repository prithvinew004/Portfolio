"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=/<>_";
const TICK_MS = 45;
const TICKS_PER_CHAR = 2; // how long each character stays scrambled before locking

/**
 * Characters churn through random glyphs and lock in left to right.
 *
 * Every character gets its own fixed-width cell, sized by an invisible copy of the *real* letter,
 * with the scrambling glyph painted absolutely on top. Pinning only the outer box isn't enough:
 * the glyphs still reflow against each other inside it, and at display sizes those ±1px nudges
 * cost real CLS — they were worth 0.22 on their own here.
 *
 * Once settled the overlay is dropped entirely and the sizing layer simply becomes visible, so the
 * final text keeps its natural kerning and nothing moves on the handover.
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
    <span ref={ref} className={cn("relative inline-block", className)}>
      <span className="sr-only">{text}</span>
      {/* Sizing layer — the real text, laid out naturally. Never moves. */}
      <span aria-hidden className={done ? undefined : "invisible"}>
        {text}
      </span>

      {!done && (
        <span aria-hidden className="absolute inset-0 whitespace-nowrap">
          {[...text].map((char, i) => {
            if (char === " ") return <span key={i}> </span>;
            const settled = i < revealed;
            return (
              <span key={i} className="relative inline-block">
                {/* Holds this cell at the real character's width, so swapping the glyph on top
                    can never move its neighbours. */}
                <span className="invisible">{char}</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  {/* noise is in the dep chain purely so each tick re-rolls the glyph. */}
                  {settled ? char : GLYPHS[(i * 7 + noise * 13) % GLYPHS.length]}
                </span>
              </span>
            );
          })}
        </span>
      )}
    </span>
  );
}
