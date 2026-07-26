"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=/<>_";
const TICK_MS = 40;
const TICKS_PER_CHAR = 1; // characters lock in fast — this fires on hover, not on scroll

/**
 * Scrambles on hover and settles left to right. Each character sits in a cell pinned to the real
 * letter's width, with the glyph painted on top, so swapping glyphs can never move its neighbours —
 * the same reflow that cost 0.22 CLS on the contact headline before it was pinned.
 *
 * Hover is handled by the parent link (`group`), so the whole hit area triggers it rather than just
 * the glyphs. Under reduced motion this renders plain text.
 */
export function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState(text.length);
  const [noise, setNoise] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (!active) {
      // Leaving mid-scramble settles immediately rather than finishing on its own.
      if (timer.current) clearInterval(timer.current);
      setRevealed(text.length);
      return;
    }
    let tick = 0;
    setRevealed(0);
    timer.current = setInterval(() => {
      tick += 1;
      setNoise((n) => n + 1);
      const next = Math.floor(tick / TICKS_PER_CHAR);
      setRevealed(next);
      if (next >= text.length && timer.current) clearInterval(timer.current);
    }, TICK_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [active, reduced, text.length]);

  if (reduced || revealed >= text.length) return <>{text}</>;

  return (
    <span className="relative inline-block">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span aria-hidden className="absolute inset-0 whitespace-nowrap">
        {[...text].map((char, i) => {
          if (char === " ") return <span key={i}> </span>;
          return (
            <span key={i} className="relative inline-block">
              <span className="invisible">{char}</span>
              <span className="absolute inset-0 flex items-center justify-center">
                {i < revealed ? char : GLYPHS[(i * 7 + noise * 13) % GLYPHS.length]}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** Wraps a link label so it scrambles while its parent is hovered or focused. */
export function ScrambleLabel({ text }: { text: string }) {
  const [active, setActive] = useState(false);
  return (
    <span
      className="inline-block"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <ScrambleText text={text} active={active} />
    </span>
  );
}
