"use client";

import dynamic from "next/dynamic";
import { Suspense, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";
import { profile } from "@/content/resume";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { WordRotate } from "@/components/ui/word-rotate";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Spotlight } from "@/components/ui/spotlight";
import { useAppReady } from "@/components/page-shell";

// ssr:false keeps three.js out of the server render and out of the initial chunk entirely.
// The gradient fallback is reused as the loading state so the slot is never blank and never
// changes size — the swap is a crossfade in a fixed-size container, so it costs no layout shift.
const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <GradientFallback />,
});

const WORK_HREF = "#work";

function NameLetters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word) => (
        // Words stay unbroken; only whole words wrap.
        <span key={word} className="mr-[0.22em] inline-block whitespace-nowrap last:mr-0">
          {word.split("").map((char, i) => (
            <span key={`${char}${i}`} className="inline-block overflow-hidden pb-[0.06em]">
              <span data-letter className="name-letter inline-block will-change-transform">
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

/** Static stand-in for the blob: same mass, same light, no WebGL. Sits above the copy on phones so
 *  it reads as its own object rather than a smudge behind the text. */
function GradientFallback() {
  return (
    <div
      aria-hidden
      className="absolute right-[-22%] top-[6%] aspect-square w-[72vw] rounded-full opacity-60 blur-[14px] md:right-[-4%] md:top-1/2 md:w-[42vw] md:-translate-y-1/2"
      style={{
        // Layer order matters: the dark disc paints on top of the amber and teal discs, and its
        // offset is what leaves them showing as rim crescents — same read as the lit 3D blob.
        background: [
          "radial-gradient(circle at 52% 48%, #0d0906 0 47%, transparent 48%)",
          "radial-gradient(circle at 45% 39%, var(--hero-amber) 0 34%, var(--hero-ember) 46%, transparent 56%)",
          "radial-gradient(circle at 66% 61%, var(--hero-teal) 0 30%, transparent 50%)",
        ].join(","),
      }}
    />
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  // Both must hold before we pay for three.js: a real pointer and a wide enough viewport.
  const canRender3D = useMediaQuery("(min-width: 768px) and (pointer: fine)");
  const [sceneReady, setSceneReady] = useState(false);
  // Hold the entrance until the preloader lifts, otherwise it plays out of sight behind it.
  const ready = useAppReady();
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced || !ready) return;
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from("[data-letter]", { yPercent: 115, duration: 1.1, stagger: 0.028 })
        .from("[data-rise]", { y: 18, opacity: 0, duration: 0.8, stagger: 0.12 }, "-=0.65");

      // Ambient phosphor sweep: a band of --glow walks the letters, then a long dark dwell.
      gsap
        .timeline({ repeat: -1, repeatDelay: 4.5, delay: 2 })
        .to("[data-letter]", { "--glow": 1, duration: 0.3, stagger: 0.035, ease: "none" })
        .to("[data-letter]", { "--glow": 0, duration: 0.45, stagger: 0.035, ease: "none" }, 0.22);
    },
    { scope, dependencies: [reduced, ready] }
  );

  return (
    <section
      ref={scope}
      className="relative isolate min-h-svh overflow-hidden bg-[var(--hero-void)] text-[var(--hero-cream)]"
    >
      <Spotlight />

      <div className="absolute inset-y-0 right-0 -z-10 w-full md:right-[-4%] md:w-[48%]">
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

      {/* max-w is the shared 72rem measure plus this element's own 5rem of padding: every other
          section pads the <section> and centres a bare 72rem box inside, so matching that here is
          what lines the hero up with the labels below it. */}
      <div className="mx-auto flex min-h-svh w-full max-w-[77rem] flex-col justify-center px-6 py-24 sm:px-10">
        <p
          data-rise
          className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[var(--hero-sage)]"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--hero-amber)] opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[var(--hero-amber)]" />
          </span>
          {profile.availableForWork ? "Available for work" : "Currently booked"}
        </p>

        <h1 className="mt-7 max-w-[10ch] font-display text-[clamp(2.7rem,8.4vw,7rem)] font-extrabold leading-[0.84] tracking-[-0.045em]">
          <NameLetters text={profile.name} />
        </h1>

        <div
          data-rise
          className="mt-8 flex items-baseline gap-3 font-mono text-sm tracking-tight text-[var(--hero-cream)] sm:text-base"
        >
          <span aria-hidden className="text-[var(--hero-amber)]">
            &gt;
          </span>
          <span className="sr-only">{profile.roles.join(", ")}</span>
          <span aria-hidden className="contents">
            <WordRotate words={profile.roles} className="whitespace-nowrap" />
          </span>
          <span aria-hidden className="ml-1 inline-block h-[1.05em] w-[0.5em] animate-[blink_1.1s_steps(1,end)_infinite] bg-[var(--hero-amber)]" />
        </div>

        <p data-rise className="mt-7 max-w-[46ch] text-pretty text-[var(--hero-sage)] sm:text-lg">
          {profile.tagline}
        </p>

        <div data-rise className="mt-11">
          <MagneticButton href={WORK_HREF}>
            <span className="size-1.5 rounded-full bg-[var(--hero-amber)] shadow-[0_0_10px_2px_var(--hero-amber)]" />
            View work
          </MagneticButton>
        </div>
      </div>

      <a
        href={WORK_HREF}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[var(--hero-sage)] transition-colors hover:text-[var(--hero-amber)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-amber)]"
      >
        <span className="h-12 w-px bg-gradient-to-b from-transparent via-[var(--hero-sage)] to-[var(--hero-amber)]" />
        <span className="flex items-center gap-2">
          Scroll <ArrowDown className="size-3" />
        </span>
      </a>

      {/* Anchors the empty bottom-right corner with real information rather than decoration. */}
      <p className="absolute bottom-9 right-6 hidden font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--hero-sage)] sm:right-10 md:block">
        {profile.location}
      </p>
    </section>
  );
}
