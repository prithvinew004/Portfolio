"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";

const REST = 36;
const HOVER = 58;

export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The ring lags behind; the dot stays pinned to the real pointer.
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setSeen(true);
      setHovering(!!(e.target as Element)?.closest?.("a, button, [data-tilt]"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [enabled, x, y]);

  // Returning null also restores the system cursor: globals.css only hides it on a fine pointer,
  // and the reduced-motion block puts it back.
  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: hovering ? HOVER : REST,
          height: hovering ? HOVER : REST,
          opacity: seen ? 0.9 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="absolute rounded-full border border-[var(--ac)]"
      />
      <motion.div
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: seen ? 1 : 0 }}
        className="absolute size-1.5 rounded-full bg-[var(--ac)]"
      />
    </div>
  );
}
