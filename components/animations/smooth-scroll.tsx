"use client";

import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-media-query";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pushes every Lenis scroll frame into ScrollTrigger. Without it Lenis animates scroll on its own
 * rAF while ScrollTrigger only recalculates on native scroll events, so at the moment a pin engages
 * ScrollTrigger is acting on a frame-stale position and the pinned section jumps a full viewport.
 *
 * Deliberately a scroll subscriber rather than taking over Lenis's rAF with gsap.ticker: the ticker
 * version is the common recipe, but if the Lenis instance isn't ready when the effect first runs
 * nothing drives the loop and the page stops scrolling outright.
 */
function ScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <ScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
