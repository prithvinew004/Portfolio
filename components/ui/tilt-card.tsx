"use client";

import { useRef } from "react";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const MAX_TILT = 9; // degrees, per the design

/**
 * Perspective tilt plus a glare that tracks the pointer. Both are written straight to style rather
 * than through React state — this fires on every mousemove, and a re-render per frame would be the
 * expensive way to do the same thing.
 */
export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // A coarse pointer has no hover to track, and tilting on tap reads as a glitch.
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  function onMouseMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * MAX_TILT}deg) rotateX(${-py * MAX_TILT}deg)`;
    if (glare.current) {
      glare.current.style.background = `radial-gradient(420px circle at ${(px + 0.5) * 100}% ${
        (py + 0.5) * 100
      }%,rgba(255,255,255,.09),transparent 60%)`;
    }
  }

  function reset() {
    if (ref.current) ref.current.style.transform = "";
    if (glare.current) glare.current.style.background = "";
  }

  return (
    <div
      ref={ref}
      data-tilt
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      // transform-style + the parent's perspective are what make the rotation read as depth
      // rather than a skew.
      className={cn(
        "relative h-full overflow-hidden rounded-[22px] [transform-style:preserve-3d] transition-transform duration-150 ease-out",
        className
      )}
    >
      <div
        ref={glare}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(400px circle at 50% 0%,rgba(255,255,255,.06),transparent 60%)" }}
      />
      {children}
    </div>
  );
}
