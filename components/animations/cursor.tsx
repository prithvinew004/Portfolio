"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";

/**
 * Targets opt in declaratively via `data-cursor`, so this component never needs to know which
 * section it's over:
 *   data-cursor="view" — morph into a filled "View →" puck (project cards)
 *   data-cursor="snap" — spring to the element's centre (pill buttons)
 * Headings are detected by tag and invert via mix-blend-mode instead.
 */
type Mode = "default" | "heading" | "view" | "snap";

const SIZE: Record<Mode, number> = { default: 36, heading: 44, snap: 64, view: 96 };

// Three springs off one pair of motion values: the dot is near-instant, the ring trails it, and the
// trailing dot lags furthest. Snapping springs all three, so the jump to a target reads as a pull.
const DOT = { stiffness: 900, damping: 45, mass: 0.25 };
const RING = { stiffness: 260, damping: 26, mass: 0.4 };
const TRAIL = { stiffness: 90, damping: 22, mass: 0.8 };

export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  // Touch devices get nothing at all — and globals.css only hides the native cursor behind the
  // same (pointer: fine) query, so there's never a screen with no cursor of any kind.
  const enabled = finePointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, DOT);
  const dotY = useSpring(y, DOT);
  const ringX = useSpring(x, RING);
  const ringY = useSpring(y, RING);
  const trailX = useSpring(x, TRAIL);
  const trailY = useSpring(y, TRAIL);

  const [mode, setMode] = useState<Mode>("default");
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      const el = e.target as Element | null;
      // data-cursor is resolved first and independently: a project card contains an <h3>, so
      // matching heading and data-cursor in one closest() would return the nearer heading.
      const marked = el?.closest?.("[data-cursor]") as HTMLElement | null;
      const kind = marked?.dataset.cursor;

      let next: Mode = "default";
      let px = e.clientX;
      let py = e.clientY;

      if (kind === "view") {
        next = "view";
      } else if (kind === "snap") {
        next = "snap";
        const r = marked!.getBoundingClientRect();
        px = r.left + r.width / 2;
        py = r.top + r.height / 2;
      } else if (el?.closest?.("h1, h2, h3")) {
        next = "heading";
      }

      x.set(px);
      y.set(py);
      // Both bail out when the value is unchanged, so this is not a re-render per pointermove.
      setSeen(true);
      setMode((prev) => (prev === next ? prev : next));
    };

    // Pointer left the window entirely — relatedTarget is null only on a real exit.
    const leave = (e: PointerEvent) => {
      if (!e.relatedTarget) setSeen(false);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerout", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = SIZE[mode];
  const inverted = mode === "heading";
  const isView = mode === "view";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      {/* Trailing dot — furthest behind, faintest. */}
      <motion.div
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: seen && !isView ? 0.35 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute size-1 rounded-full bg-[var(--ac)]"
      />

      {/* Ring — grows, fills, and becomes the "View →" puck. */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          // difference against white is a true inversion: the ring reads as a hole punched
          // through whatever heading it crosses.
          mixBlendMode: inverted ? "difference" : "normal",
        }}
        animate={{
          width: size,
          height: size,
          opacity: seen ? 1 : 0,
          backgroundColor: isView ? "var(--ac)" : "rgba(0,0,0,0)",
          borderColor: inverted ? "#ffffff" : "var(--ac)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.5 }}
        className="absolute flex items-center justify-center rounded-full border"
      >
        <motion.span
          animate={{ opacity: isView ? 1 : 0, scale: isView ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--bg)]"
        >
          View →
        </motion.span>
      </motion.div>

      {/* Precise dot — hidden once the puck takes over. */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: inverted ? "difference" : "normal",
        }}
        animate={{ opacity: seen && !isView ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={inverted ? "absolute size-1.5 rounded-full bg-white" : "absolute size-1.5 rounded-full bg-[var(--ac)]"}
      />
    </div>
  );
}
