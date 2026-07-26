"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const RADIUS = 110; // px from the button's centre at which it starts to follow
const PULL = 0.28; // fraction of the offset it travels

/**
 * Follows the pointer once it comes within RADIUS of the centre, per the design. Tracking is on
 * window rather than the element so the pull begins *before* the pointer arrives — an element-only
 * listener can't fire until you're already on top of it.
 */
export function MagneticButton({
  children,
  href,
  className,
  external,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  // No magnet on a coarse pointer: pointermove fires mid-tap and drags the button out from
  // under the finger.
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;
  const [hot, setHot] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.3 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < RADIUS;
      setHot(near);
      x.set(near ? dx * PULL : 0);
      y.set(near ? dy * PULL : 0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      style={enabled ? { x: sx, y: sy } : undefined}
      data-hot={hot || undefined}
      // Opts this element into the custom cursor's spring-snap.
      data-cursor="snap"
      onBlur={() => {
        x.set(0);
        y.set(0);
      }}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full text-[15px] uppercase",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]",
        className
      )}
    >
      {children}
    </motion.a>
  );
}
