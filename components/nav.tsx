"use client";

import { useEffect, useState } from "react";
import { sections } from "@/content/resume";
import { ScrambleLabel } from "@/components/animations/scramble-text";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GUTTER } from "@/lib/section";
import { cn } from "@/lib/utils";

/**
 * Minimal fixed bar. It exists because the ⌘K hint was asked for "in the navbar" and there wasn't
 * one — deliberately small: section anchors and the hint, no mobile drawer, no scroll-hiding.
 *
 * Links come from content/resume.ts `sections`, the same list the palette uses, so the two can't
 * drift apart.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // The hint is a lie on a device with no keyboard, so it only renders where ⌘K can be pressed.
  const finePointer = useMediaQuery("(pointer: fine)");
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        GUTTER,
        // Transparent over the hero, glass once past it — the same glass as the palette.
        scrolled &&
          "border-b border-white/10 bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] backdrop-blur-xl"
      )}
    >
      <nav
        aria-label="Sections"
        className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-6"
      >
        <a
          href="#hero"
          className="font-display text-sm font-bold tracking-tight text-[var(--fg)] transition-colors hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
        >
          PP
          <span className="sr-only">Prithviraj Panda — back to top</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-[13px] uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
              >
                <ScrambleLabel text={s.label} />
              </a>
            </li>
          ))}
        </ul>

        {finePointer && (
          <span
            aria-hidden
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-2.5 py-1 text-[11px] text-[var(--muted)]"
          >
            <kbd className="font-sans">{isMac ? "⌘" : "Ctrl"}</kbd>
            <kbd className="font-sans">K</kbd>
          </span>
        )}
      </nav>
    </header>
  );
}
