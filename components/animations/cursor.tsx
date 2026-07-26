"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

const RING = 32;

export function Cursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.4 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setActive(
        !!(e.target as Element)?.closest?.("a, button, [role=button], input, textarea, [data-cursor]")
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    // pointer-fine keeps this off touch devices entirely. Native cursor stays visible on purpose.
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden pointer-fine:block">
      <motion.div
        aria-hidden
        style={{ x: ringX, y: ringY, width: RING, height: RING, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: active ? 1.6 : 1, opacity: active ? 0.9 : 0.5 }}
        transition={{ duration: 0.2 }}
        className="absolute rounded-full border border-foreground mix-blend-difference"
      />
      <motion.div
        aria-hidden
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        className="absolute size-1.5 rounded-full bg-foreground mix-blend-difference"
      />
    </div>
  );
}
