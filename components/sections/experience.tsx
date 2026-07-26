"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { experience, experienceIntro } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { SectionCurtain } from "@/components/animations/section-curtain";
import { BlurWords } from "@/components/animations/blur-words";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Experience() {
  const scope = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current!;
      // matchMedia rather than React state so a breakpoint flip reverts and rebuilds atomically.
      // The `base` condition always matches — with only the reduced query, the callback would
      // never fire for a visitor with motion enabled.
      const mm = gsap.matchMedia();
      mm.add({ base: "(min-width: 1px)", reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { reduced } = ctx.conditions as Record<string, boolean>;
        const line = root.querySelector("[data-progress]");
        const dots = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-node]"));

        if (reduced) {
          // Show the rail complete and every node lit rather than absent.
          gsap.set(line, { attr: { "stroke-dashoffset": 0 } });
          gsap.set(dots, { backgroundColor: "var(--ac)", borderColor: "var(--ac)" });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: { trigger: rail.current, start: "top 72%", end: "bottom 60%", scrub: 0.4 },
        });

        // attr, not style: as an inline CSS length the offset is measured in user units and
        // pathLength="1" is ignored, which renders the rail as a row of tiny dashes.
        tl.to(line, { attr: { "stroke-dashoffset": 0 }, ease: "none", duration: dots.length }, 0);

        // The rail spans t=0..dots.length, so spacing the nodes evenly across that span lights
        // each one at the moment the line arrives: first at the start, last exactly at the end.
        const step = dots.length / Math.max(1, dots.length - 1);
        dots.forEach((dot, i) => {
          tl.to(
            dot,
            {
              backgroundColor: "var(--ac)",
              borderColor: "var(--ac)",
              boxShadow: "0 0 14px var(--ac)",
              duration: 0.25,
            },
            i * step
          );
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="experience" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionCurtain />
      <div className={cn("grid grid-cols-1 gap-[clamp(32px,6vw,90px)] lg:grid-cols-[1fr_1.4fr]", CONTENT)}>
        <div>
          {/* Sticky only where there are two columns — on one column it would pin over the list. */}
          <div className="lg:sticky lg:top-[120px]">
            <SectionLabel n="03" className="mb-6">
              Experience
            </SectionLabel>
            {/* Each line is nowrap so the design's break lands after "Where I've" — left to itself
                the narrower left column broke it again mid-phrase into three lines. */}
            <h2 className="m-0 font-display text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.05] tracking-[-0.01em]">
              {experienceIntro.heading.map((line) => (
                // One BlurWords per line so the design's break after "Where I've" survives; each
                // line stays nowrap so the narrow left column can't re-break it mid-phrase.
                <BlurWords key={line} text={line} className="m-0 block whitespace-nowrap" />
              ))}
            </h2>
            <p className="mt-5 max-w-[34ch] text-pretty text-[15px] leading-[1.7] text-[var(--muted)]">
              {experienceIntro.blurb}
            </p>
          </div>
        </div>

        <div ref={rail} className="relative pl-11">
          <svg
            aria-hidden
            viewBox="0 0 2 100"
            preserveAspectRatio="none"
            // h-full is load-bearing: an SVG carries an intrinsic ratio from its viewBox, so
            // inset-y-0 alone leaves it at its natural height instead of spanning the column.
            className="absolute left-[11px] top-0 h-full w-0.5"
          >
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,.1)" strokeWidth="2" />
            <line
              data-progress
              x1="1"
              y1="0"
              x2="1"
              y2="100"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              stroke="var(--ac)"
              strokeWidth="2"
            />
          </svg>

          <ol className="m-0 list-none p-0">
            {experience.map((job, i) => (
              <li key={job.company} className="relative">
                <span
                  data-node
                  aria-hidden
                  className="absolute left-[-39px] top-2 box-border size-3.5 rounded-full border-2 border-white/25 bg-[var(--node)]"
                />
                <Reveal
                  delay={i * 60}
                  from={i % 2 ? "right" : "left"}
                  className={i < experience.length - 1 ? "pb-[clamp(48px,8vh,90px)]" : undefined}
                >
                  <div className="mb-2.5 text-[13px] uppercase tracking-[0.18em] text-[var(--ac)]">
                    {job.period}
                  </div>
                  <h3 className="m-0 font-display text-[clamp(24px,2.6vw,34px)] font-bold">
                    {job.company}
                  </h3>
                  <div className="mb-3.5 mt-1.5 text-[15px] text-[var(--muted)]">{job.role}</div>
                  <p className="m-0 max-w-[52ch] text-pretty text-[15px] leading-[1.7] text-[var(--muted)]">
                    {job.blurb}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
