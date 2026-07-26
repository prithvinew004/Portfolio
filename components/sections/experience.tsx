"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience } from "@/content/resume";
import { SECTION, SECTION_CONTAINER, SECTION_LABEL } from "@/lib/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** "2024-01" → "Jan 2024". Explicit so output never depends on the viewer's locale. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(value: string | null) {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export function Experience() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current!;
      // gsap.matchMedia rather than React state for the breakpoints: it reverts and rebuilds the
      // timeline atomically when a query flips. Driving this off useMediaQuery left cards stranded
      // at a stale from-state (hidden) when the query settled after mount.
      const mm = gsap.matchMedia();

      mm.add(
        {
          // `base` always matches. Without it the callback never fires on a small viewport with
          // motion enabled, because matchMedia only runs when at least one condition is true — the
          // cards then look fine (nothing was written) but the rail never draws.
          base: "(min-width: 1px)",
          alternating: "(min-width: 1024px)",
          pinned: "(min-width: 1024px) and (min-height: 800px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { alternating, pinned, reduced } = ctx.conditions as Record<string, boolean>;
          if (reduced) {
            // Cards are already legible untouched, but the rail's initial attribute leaves it
            // undrawn — show it complete rather than absent.
            gsap.set(root.querySelector("[data-line]"), { attr: { "stroke-dashoffset": 0 } });
            return;
          }

          const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-entry]"));

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: pinned ? "top top" : "top 80%",
              // Pinned, the pin spacer guarantees the invented scroll distance is reachable.
              // Unpinned, the end must stay within reach of the page's real scroll extent; an end
              // past it freezes the reveal part-drawn. This was the last section when it was
              // written, so keep the end anchored to the section itself, not to a viewport offset.
              end: pinned ? `+=${cards.length * 45 + 15}%` : "bottom bottom",
              scrub: 0.5,
              pin: pinned,
              // ScrollTrigger's default pin swaps the section to position:fixed and back. Nothing
              // visibly moves — the spacer holds the gap — but Chrome records each swap as a
              // full-viewport layout shift, which alone put this page's CLS above 2. Pinning by
              // transform instead never touches layout, so it costs no shift and looks identical.
              pinType: "transform",
              anticipatePin: pinned ? 1 : 0,
              invalidateOnRefresh: true,
            },
          });

          // pathLength="1" makes the draw independent of the rail's real pixel length. The duration
          // matches the last card's finish so the rail always leads the dot it's heading for
          // instead of trailing behind an entry that has already arrived.
          // attr, not style: as an inline CSS length ("0.75px") the offset is measured in user
          // units and pathLength="1" is ignored, so the rail renders as tiny dashes. Written as an
          // attribute it stays in the normalised 0–1 space pathLength defines.
          tl.to(
            root.querySelector("[data-line]"),
            {
              attr: { "stroke-dashoffset": 0 },
              ease: "none",
              duration: (cards.length - 1) * 0.85 + 0.55,
            },
            0
          );

          cards.forEach((card, i) => {
            // fromTo, not from: both ends are stated outright, so a rebuild can never leave a card
            // parked at an inferred value.
            tl.fromTo(
              card,
              { autoAlpha: 0, x: alternating ? (i % 2 === 0 ? -70 : 70) : 40 },
              { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" },
              i * 0.85
            ).fromTo(
              card.querySelector("[data-dot]"),
              { scale: 0.4, backgroundColor: "#0b1413" },
              { scale: 1, backgroundColor: "var(--hero-amber)", duration: 0.3, ease: "power2.out" },
              i * 0.85 + 0.15
            );
          });
        }
      );
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="experience"
      className={cn("relative overflow-hidden bg-[var(--hero-void)] text-[var(--hero-cream)]", SECTION, "lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:py-0")}
    >
      <div className={SECTION_CONTAINER}>
        <h2 className={SECTION_LABEL}>
          Experience
        </h2>

        <div className="relative mt-12">
          {/* The rail: left-aligned while cards stack, centred once they alternate around it. */}
          <svg
            aria-hidden
            preserveAspectRatio="none"
            viewBox="0 0 2 100"
            /* h-full is load-bearing: an SVG has an intrinsic ratio from its viewBox, so inset-y-0
                alone leaves it at its natural 100px height instead of spanning the timeline. */
            className="absolute inset-y-0 left-[7px] h-full w-0.5 lg:left-1/2 lg:-translate-x-1/2"
          >
            <line x1="1" y1="0" x2="1" y2="100" stroke="var(--hero-cream)" strokeOpacity="0.12" strokeWidth="2" />
            <line
              data-line
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              stroke="var(--hero-amber)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <ol>
            {experience.map((job, i) => (
              <li
                key={job.company}
                data-entry
                className={cn(
                  "relative pl-10 lg:w-1/2 lg:pl-0",
                  // Alternating cards interleave, so the negative offset is what keeps the pinned
                  // timeline inside one viewport instead of overflowing it.
                  i > 0 && "mt-10 lg:-mt-16",
                  i % 2 === 0 ? "lg:pr-14 lg:text-right" : "lg:ml-auto lg:pl-14"
                )}
              >
                {/* Dot rides the rail, so its offset mirrors the rail's own position. */}
                <span
                  data-dot
                  aria-hidden
                  className={cn(
                    "absolute top-7 size-3 rounded-full ring-4 ring-[var(--hero-void)]",
                    "left-[2px] lg:left-auto",
                    i % 2 === 0 ? "lg:-right-[6px]" : "lg:-left-[6px]"
                  )}
                />

                <article
                  className={cn(
                    "rounded-2xl border border-[var(--hero-cream)]/10 bg-[var(--hero-deep)] p-6",
                    "transition-[border-color,box-shadow] duration-500 ease-out",
                    "hover:border-[var(--hero-amber)]/45",
                    "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--hero-amber)_25%,transparent),0_20px_60px_-30px_var(--hero-amber)]"
                  )}
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--hero-sage)]">
                    {formatDate(job.start)} — {formatDate(job.end)}
                  </p>

                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight sm:text-xl">
                    {job.role}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--hero-amber)]">{job.company}</p>

                  <ul className="mt-4 space-y-1.5 text-[0.8rem] leading-relaxed text-[var(--hero-sage)]">
                    {job.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
