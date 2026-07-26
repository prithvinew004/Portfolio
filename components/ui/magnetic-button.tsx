"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const PULL = 0.35; // fraction of the cursor's offset the button travels
const RANGE = 90; // px beyond the button's box that still attracts it

export function MagneticButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  // No magnet on a coarse pointer: pointermove fires mid-tap and drags the button out from
  // under the finger.
  const finePointer = useMediaQuery("(pointer: fine)");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 220, damping: 18, mass: 0.3 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  function onPointerMove(e: React.PointerEvent) {
    if (reduced || !finePointer || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * PULL);
    y.set((e.clientY - (r.top + r.height / 2)) * PULL);
  }

  function release() {
    x.set(0);
    y.set(0);
  }

  return (
    // The wrapper is the hit area: it extends past the button so the pull starts before you arrive.
    <div
      onPointerMove={onPointerMove}
      onPointerLeave={release}
      style={{ padding: RANGE }}
      className="-m-[90px] w-fit"
    >
      <motion.a
        ref={ref}
        href={href}
        style={{ x: sx, y: sy }}
        onBlur={release}
        className={cn(
          // Magnetism and the base pill only — callers compose whatever goes inside.
          "group relative inline-flex items-center gap-3 rounded-full border border-[var(--hero-amber)]/35 bg-[var(--hero-amber)]/[0.06] px-7 py-3.5",
          "font-mono text-xs uppercase tracking-[0.18em] text-[var(--hero-cream)]",
          "transition-colors duration-300 hover:border-[var(--hero-amber)]/80 hover:bg-[var(--hero-amber)]/15",
          "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-amber)]",
          className
        )}
      >
        {children}
      </motion.a>
    </div>
  );
}
