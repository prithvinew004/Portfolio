"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/content/resume";
import { TiltCard } from "@/components/ui/tilt-card";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const XFADE = 0.7; // length of one card-to-card transition, in timeline units
const STEP = 1; // spacing between transitions; the gap above XFADE is the dwell on each card

function Card({ project }: { project: (typeof projects)[number] }) {
  return (
    <TiltCard className="gborder group flex h-full flex-col transition-shadow duration-500 hover:shadow-[0_24px_70px_-40px_var(--ac)]">
      {/* flex-1 + min-h-0 lets the media band absorb the leftover height, so the card fits whatever
          the pinned stage gives it rather than forcing the section taller than the viewport. */}
      <div className="m-3.5 flex min-h-0 flex-1 items-center justify-center rounded-[14px] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.045)_0_10px,transparent_10px_22px)] font-mono text-xs tracking-[0.1em] text-[var(--muted)]">
        {project.media}
      </div>
      <div className="px-7 pb-7 pt-3.5">
        <div className="mb-2.5 text-xs tracking-[0.2em] text-[var(--ac)]">{project.n}</div>
        <h3 className="m-0 mb-2.5 font-display text-2xl font-bold sm:text-3xl">{project.title}</h3>
        <p className="m-0 mb-[18px] max-w-[60ch] text-pretty text-sm leading-[1.7] text-[var(--muted)]">
          {project.blurb}
        </p>
        <ul className="mb-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/[0.12] px-3 py-[5px] text-xs text-[var(--muted)]"
            >
              {tech}
            </li>
          ))}
        </ul>
        <a
          href={project.href}
          className="inline-block border-b border-[var(--ac)] pb-[3px] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] transition-colors hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
        >
          Case study{" "}
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
          <span className="sr-only">for {project.title}</span>
        </a>
      </div>
    </TiltCard>
  );
}

export function Projects() {
  const scope = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const total = projects.length;

  useGSAP(
    () => {
      const root = scope.current!;
      // matchMedia rather than React state: it reverts and rebuilds atomically on a query flip.
      // `base` always matches — with only the reduced query the callback would never fire for a
      // visitor who has motion enabled.
      const mm = gsap.matchMedia();
      mm.add({ base: "(min-width: 1px)", reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { reduced } = ctx.conditions as Record<string, boolean>;
        // Under reduced motion the motion-reduce: classes already lay the cards out in flow, and
        // writing any style here would strand one mid-transition.
        if (reduced) return;

        const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-card]"));
        if (cards.length < 2) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            // Roughly one viewport of scroll per transition, plus a little lead-out.
            end: `+=${(cards.length - 1) * 110 + 30}%`,
            scrub: 0.5,
            pin: true,
            // The default position:fixed pin is counted by Chrome as a full-viewport layout shift
            // each time it engages; pinning by transform never touches layout.
            pinType: "transform",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(total - 1, Math.round(self.progress * (cards.length - 1)));
              // Guarded, so this is two state updates across the sequence rather than one a frame.
              setActive((prev) => (prev === i ? prev : i));
            },
          },
        });

        // GSAP drives the wrapper, never the card: TiltCard writes its own transform, and both
        // touching the same element would fight over it.
        cards.forEach((card, k) => {
          if (k === cards.length - 1) return;
          const at = k * STEP;
          tl.to(
            card,
            { yPercent: -8, scale: 0.9, opacity: 0, ease: "power2.in", duration: XFADE },
            at
          ).fromTo(
            cards[k + 1],
            { yPercent: 12, scale: 0.96, opacity: 0 },
            { yPercent: 0, scale: 1, opacity: 1, ease: "power2.out", duration: XFADE },
            at
          );
        });
      });
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="projects"
      className={cn(
        "relative overflow-hidden",
        GUTTER,
        SECTION_Y,
        "motion-safe:flex motion-safe:min-h-svh motion-safe:flex-col motion-safe:justify-center motion-safe:py-0"
      )}
    >
      <div className={cn("w-full", CONTENT)}>
        <div className="flex items-end justify-between gap-6">
          <SectionLabel n="04">Selected work</SectionLabel>

          {/* Meaningless when all three cards are on screen at once, so it's hidden in that mode. */}
          <div
            className="flex items-baseline gap-2 font-display text-sm font-bold tabular-nums motion-reduce:hidden"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="text-[var(--ac)]">{projects[active].n}</span>
            <span className="text-[var(--muted)]">/</span>
            <span className="text-[var(--muted)]">{String(total).padStart(2, "0")}</span>
            <span className="sr-only">
              Project {active + 1} of {total}: {projects[active].title}
            </span>
          </div>
        </div>

        {/* Progress rail — one segment per project. */}
        <div className="mt-4 flex gap-1.5 motion-reduce:hidden" aria-hidden>
          {projects.map((p, i) => (
            <span
              key={p.n}
              className={cn(
                "h-px flex-1 transition-colors duration-500",
                i <= active ? "bg-[var(--ac)]" : "bg-white/15"
              )}
            />
          ))}
        </div>

        <div
          className={cn(
            "relative mt-8 [perspective:1200px]",
            // Pinned mode stacks the cards in a fixed-height stage sized in svh, so the section
            // always fits the viewport. Reduced motion drops them back into normal flow.
            "motion-safe:h-[62svh] motion-safe:min-h-[420px]",
            "motion-reduce:flex motion-reduce:flex-col motion-reduce:gap-6"
          )}
        >
          {projects.map((p) => (
            <div
              key={p.title}
              data-card
              className="motion-safe:absolute motion-safe:inset-0 motion-reduce:relative motion-reduce:h-[520px]"
            >
              <Card project={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
