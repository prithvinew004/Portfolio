"use client";

import { useCallback, useRef } from "react";

/**
 * Writes the pointer's position into --mx/--my on the element so `.glow-border` can paint its
 * radial gradient there. Straight to style rather than through state: this fires on every
 * pointermove, and a re-render per frame would be the expensive way to move a gradient.
 *
 * Spread the returned props onto any element carrying `glow-border`.
 */
export function useCursorGlow<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return { ref, onPointerMove };
}
