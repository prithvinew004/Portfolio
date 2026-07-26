/**
 * One source of truth for section rhythm. Every section uses this so the vertical gaps between
 * them stay equal — they drifted apart while the sections were built one at a time.
 */
export const SECTION = "px-6 py-20 sm:px-10 md:py-28";

/**
 * Shared measure. Every section used a different max-width, so no two section labels started at the
 * same x — the page read as a stack of unrelated blocks. Constrain prose inside this, not by
 * narrowing the container itself.
 */
export const SECTION_CONTAINER = "mx-auto w-full max-w-6xl";

/** Small-caps mono label that heads every section. */
export const SECTION_LABEL =
  "font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--hero-sage)]";
