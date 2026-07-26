"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const MAX_TILT = 9; // degrees; past ~12 the text edges start to shimmer
const SPRING = { stiffness: 200, damping: 22, mass: 0.4 };

/**
 * Perspective tilt that follows the pointer. The tilt lives here rather than on the entrance
 * wrapper so a whileInView transform and the rotation never write to the same element.
 */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // A coarse pointer has no hover to track, and tilting on tap just looks like a glitch.
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), SPRING);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), SPRING);

  function onPointerMove(e: React.PointerEvent) {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    // Perspective must sit on the parent — on the rotating element itself it flattens the effect.
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={reset}
        onBlur={reset}
        style={enabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={cn("h-full", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}
