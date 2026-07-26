"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

// Aceternity's spotlight is a blurred SVG ellipse; a radial-gradient does the same job in CSS with
// no extra markup. Amber rather than the usual white so it reads as phosphor bloom, not a stage light.
export function Spotlight() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute -left-[20%] -top-[35%] h-[85vh] w-[75vw] -rotate-[18deg] rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--hero-amber) 26%, transparent), color-mix(in oklab, var(--hero-ember) 10%, transparent) 55%, transparent 78%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.3, ease: "easeOut" }}
        className="absolute -bottom-[30%] right-[-15%] h-[70vh] w-[60vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--hero-teal) 22%, transparent), transparent 72%)",
        }}
      />
      {/* Slow horizontal drift keeps the bloom from reading as a static PNG. */}
      {!reduced && (
        <motion.div
          animate={{ x: ["-6%", "6%", "-6%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-[10%] h-[55vh] w-[45vw] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--hero-amber) 12%, transparent), transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
