"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DEPTH = 8; // viewBox units of arc at rest; 0 is flat

const edge = (d: number) => `M0,${d} Q50,0 100,${d}`;
const body = (d: number) => `M0,${d} Q50,0 100,${d} L100,20 L0,20 Z`;

/**
 * Curved divider at the top of a dark section. The incoming section's top edge arcs upward, then
 * flattens to a straight line as it scrolls in, scrubbed to scroll position.
 *
 * Both sections are the same background, so the fill alone would be invisible — a hairline stroke
 * on the curve is what actually reads. The fill still matters: it masks the outgoing section
 * wherever the arc cuts into it.
 *
 * `d` is rebuilt per frame from a tweened number. GSAP can't interpolate a path string without
 * MorphSVG, and tweening one number is cheaper than either.
 */
export function SectionCurtain() {
  const host = useRef<HTMLDivElement>(null);
  const fill = useRef<SVGPathElement>(null);
  const line = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // `base` always matches — with only the reduced query the callback never fires for a
      // visitor who has motion enabled.
      mm.add({ base: "(min-width: 1px)", reduced: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { reduced } = ctx.conditions as Record<string, boolean>;
        const apply = (d: number) => {
          fill.current?.setAttribute("d", body(d));
          line.current?.setAttribute("d", edge(d));
        };

        if (reduced) {
          apply(0); // sits flat rather than mid-arc
          return;
        }

        const state = { d: DEPTH };
        gsap.to(state, {
          d: 0,
          ease: "none",
          scrollTrigger: {
            trigger: host.current,
            start: "top bottom",
            end: "top 55%",
            scrub: 0.4,
          },
          onUpdate: () => apply(state.d),
        });
      });
    },
    { scope: host }
  );

  return (
    <div
      ref={host}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(40px,5vw,80px)]"
    >
      <svg
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        className="size-full"
        // The arc is wider than it is tall once stretched; letting it distort is the point.
      >
        <path ref={fill} d={body(DEPTH)} fill="var(--bg)" />
        <path
          ref={line}
          d={edge(DEPTH)}
          fill="none"
          stroke="color-mix(in srgb, var(--ac) 28%, transparent)"
          strokeWidth="1"
          // Without this the stroke stretches with the viewBox and reads as a thick smear.
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
