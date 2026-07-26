"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

/** Which edge the wipe opens from. Callers alternate these to choreograph a section. */
export type WipeFrom = "left" | "right" | "bottom";

// inset() sides are top/right/bottom/left — closed on the far side, opening toward it.
const CLOSED: Record<WipeFrom, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  bottom: "inset(100% 0% 0% 0%)",
};
// Ends *outside* the border box on every side. inset(0%) would still clip there, cutting off any
// shadow or glow a child paints beyond its own bounds — and neither removing the property on
// completion nor the `style` prop survives, because framer re-applies its animated value on
// later renders. Overshooting the box is the state that actually holds.
const OPEN = "inset(-50% -50% -50% -50%)";

/**
 * Clip-path wipe, replacing the fade-up that used to run here.
 *
 * Two elements, and it has to be two: a fully closed clip-path leaves the element with zero visible
 * area, and IntersectionObserver then reports it as not intersecting — so `whileInView` on the
 * clipped element never fires and the wipe never opens. The outer div is observed and never
 * clipped; the inner one does the wiping.
 *
 * The open state overshoots the border box so nothing stays clipped once the wipe finishes.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  from = "left",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: WipeFrom;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.12 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full"
        initial={{ clipPath: CLOSED[from] }}
        animate={inView ? { clipPath: OPEN } : undefined}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: delay / 1000 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
