"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query. The server snapshot is always false, so the markup React hydrates against
 * matches; React then re-renders with the real value in the same pass — no mismatch, no flash.
 * Reading matchMedia during render instead (as framer-motion's useReducedMotion does) makes any
 * component that branches on it fail hydration.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
