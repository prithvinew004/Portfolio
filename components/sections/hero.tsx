"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/content/resume";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { useAppReady } from "@/components/page-shell";
import { WordRotate } from "@/components/ui/word-rotate";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ScrambleLabel } from "@/components/animations/scramble-text";
import { GUTTER, CONTENT } from "@/lib/section";

// ssr:false keeps three.js out of the server render and out of the initial chunk. The gradient
// fallback doubles as the loading state so the slot is never blank and never changes size.
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <GradientFallback />,
});

/** Static stand-in for the blob: no WebGL, same mass and position. */
function GradientFallback() {
  return (
    <div
      aria-hidden
      className="absolute right-[-18%] top-1/2 aspect-square w-[80vw] -translate-y-1/2 rounded-full opacity-70 blur-[14px] md:right-[-6%] md:w-[46vw]"
      style={{
        background: [
          "radial-gradient(circle at 52% 48%, #0d0d0c 0 47%, transparent 48%)",
          "radial-gradient(circle at 44% 38%, var(--ac) 0 30%, #6d8a2e 46%, transparent 58%)",
        ].join(","),
      }}
    />
  );
}

/**
 * Splits a line into letters that rise into place. A CSS animation with a per-letter delay rather
 * than a JS timeline — same effect for no runtime — and `both` fill keeps each letter hidden
 * before its turn and parked after it.
 */
function SplitLine({ text, base, className }: { text: string; base: number; className?: string }) {
  const ready = useAppReady();
  const reduced = useReducedMotion();

  return (
    <span className={`block overflow-hidden whitespace-nowrap pb-[0.06em] ${className ?? ""}`}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          data-letter
          className="name-letter inline-block"
          style={
            reduced
              ? undefined
              : {
                  // Two animations on one element: the entrance (runs once) and the ambient sweep
                  // (loops). The sweep's own delay is what walks the band across the word.
                  animation: [
                    `letterUp .9s cubic-bezier(.2,.75,.2,1) ${base + i * 0.05}s both`,
                    `sweep 7s linear ${2.4 + base + i * 0.035}s infinite`,
                  ].join(","),
                  // Held until the preloader lifts, or all of this plays out of sight behind it.
                  animationPlayState: ready ? "running" : "paused",
                }
          }
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Syne's wght axis. Rest is the design's 800; the ramp only ever lightens, so a letter can never
 *  grow past the width its box was pinned at. */
const REST_WEIGHT = 800;
const MIN_WEIGHT = 450;
const REACH = 260; // px from the pointer at which a letter is back to full weight

export function Hero() {
  const ready = useAppReady();
  const reduced = useReducedMotion();

  const nameRef = useRef<HTMLHeadingElement>(null);

  // Weight changes alter glyph advance widths, which would reflow the line — and the clamp is
  // tuned so the name only just fits on one line, so that means clipping as well as layout shift.
  // Pinning each letter at its rest width means the ramp only ever repaints inside a fixed box.
  useEffect(() => {
    const el = nameRef.current;
    if (!el || reduced) return;
    let cancelled = false;
    // Wait for the webfont: measuring against the fallback pins the wrong widths.
    document.fonts.ready.then(() => {
      if (cancelled) return;
      el.querySelectorAll<HTMLElement>("[data-letter]").forEach((l) => {
        l.style.width = `${l.getBoundingClientRect().width}px`;
        l.style.textAlign = "center";
      });
    });
    return () => {
      cancelled = true;
    };
  }, [reduced]);

  // Written straight to style rather than through state: this fires on every pointermove, and a
  // re-render per frame would be the expensive way to do the same thing.
  function rampWeights(e: React.PointerEvent) {
    const el = nameRef.current;
    if (!el || reduced) return;
    el.querySelectorAll<HTMLElement>("[data-letter]").forEach((l) => {
      const r = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const t = Math.min(1, d / REACH);
      l.style.fontWeight = String(Math.round(MIN_WEIGHT + (REST_WEIGHT - MIN_WEIGHT) * t));
    });
  }

  function resetWeights() {
    nameRef.current
      ?.querySelectorAll<HTMLElement>("[data-letter]")
      .forEach((l) => (l.style.fontWeight = ""));
  }

  /** Staggered rise for the copy under the name, gated on the preloader like the letters. */
  const rise = (i: number) =>
    reduced
      ? undefined
      : ({
          animation: `riseUp .8s cubic-bezier(.16,1,.3,1) ${1.15 + i * 0.12}s both`,
          animationPlayState: ready ? "running" : "paused",
        } as React.CSSProperties);
  // Both must hold before we pay for three.js: a real pointer and a wide enough viewport.
  const canRender3D = useMediaQuery("(min-width: 768px) and (pointer: fine)");
  const [sceneReady, setSceneReady] = useState(false);


  return (
    <section
      id="hero"
      className={`relative flex min-h-svh flex-col justify-center overflow-hidden ${GUTTER} py-[clamp(24px,6vw,96px)]`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[10%] top-[-30%] h-[70vw] w-[70vw] animate-drift"
          style={{
            background:
              "radial-gradient(circle,color-mix(in srgb,var(--ac) 9%,transparent) 0%,transparent 60%)",
          }}
        />
        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
      </div>

      {/* The blob sits behind the copy, biased right so the left-aligned text stays clear of it. */}
      <div className="pointer-events-none absolute inset-y-0 right-[-6%] z-0 w-full opacity-60 md:w-[40%]">
        {canRender3D && !reduced ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={sceneReady ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="size-full"
          >
            <Suspense fallback={<GradientFallback />}>
              <HeroScene onReady={() => setSceneReady(true)} />
            </Suspense>
          </motion.div>
        ) : (
          <GradientFallback />
        )}
      </div>

      <div className={`relative z-[2] ${CONTENT}`}>
        <div
          style={rise(0)}
          className="mb-[clamp(20px,3vh,36px)] flex items-center gap-2.5 text-[13px] uppercase tracking-[0.22em] text-[var(--muted)]"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--ac)] opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--ac)] shadow-[0_0_12px_var(--ac)]" />
          </span>
          <span>{profile.availability}</span>
        </div>

        <h1
          ref={nameRef}
          onPointerMove={rampWeights}
          onPointerLeave={resetWeights}
          className="m-0 w-fit font-display text-[clamp(28px,8.4vw,128px)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em] [transition:none]"
        >
          <SplitLine text="Prithviraj" base={0} className="name-solid" />
          <SplitLine text="Panda" base={0.45} className="stroke-fg name-outline" />
        </h1>

        <div
          style={rise(1)}
          className="mt-[clamp(20px,3vh,36px)] flex flex-wrap items-baseline gap-3.5 text-[clamp(17px,2vw,24px)]"
        >
          <span className="text-[var(--muted)]">I build</span>
          <span className="sr-only">{profile.roles.join(", ")}</span>
          <span aria-hidden className="contents">
            <WordRotate words={profile.roles} />
          </span>
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1em] w-[0.5em] animate-[blink_1.1s_steps(1,end)_infinite] bg-[var(--ac)]"
          />
        </div>

        <p style={rise(2)} className="mt-[18px] max-w-[52ch] text-pretty text-[clamp(15px,1.4vw,18px)] leading-[1.7] text-[var(--muted)]">
          {profile.tagline}
        </p>

        <div style={rise(3)} className="mt-[clamp(28px,4vh,48px)] flex flex-wrap gap-4">
          <MagneticButton
            href="#projects"
            className="bg-[var(--ac)] px-[34px] py-[18px] font-semibold tracking-[0.04em] text-[var(--bg)] transition-shadow duration-300 hover:shadow-[0_0_40px_color-mix(in_srgb,var(--ac)_45%,transparent)]"
          >
            <ScrambleLabel text="View work" /> <span aria-hidden>→</span>
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="border border-white/20 px-[34px] py-[18px] font-medium tracking-[0.04em] text-[var(--fg)] transition-colors duration-300 hover:border-[var(--ac)] hover:text-[var(--ac)]"
          >
            <ScrambleLabel text="Get in touch" />
          </MagneticButton>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-7 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-[var(--muted)] transition-colors hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
      >
        <span>Scroll</span>
        <span aria-hidden className="inline-block animate-bob">
          ↓
        </span>
      </a>
    </section>
  );
}
