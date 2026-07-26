"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { profile } from "@/content/resume";
import { useReducedMotion } from "@/hooks/use-media-query";
import { SECTION, SECTION_CONTAINER, SECTION_LABEL } from "@/lib/section";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const scope = useRef<HTMLElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // scrub ties word opacity directly to scroll position, so the sentence "writes itself" at
      // whatever speed the reader scrolls — and reverses cleanly on the way back up.
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.45 },
        {
          opacity: 1,
          ease: "none",
          // duration > stagger means neighbouring words overlap, so the band of half-lit words
          // reads as a soft edge sweeping the paragraph rather than words snapping on one by one.
          duration: 1.2,
          stagger: 0.45,
          scrollTrigger: {
            // Trigger on the paragraph, not the section — the section's vertical padding would
            // otherwise eat most of the scroll range and the reveal would finish too early.
            trigger: copy.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <section
      ref={scope}
      id="about"
      className={cn("relative bg-[var(--hero-void)] text-[var(--hero-cream)]", SECTION)}
    >
      <div className={SECTION_CONTAINER}>
        <h2 className={SECTION_LABEL}>
          About
        </h2>
        <p ref={copy} className="mt-10 max-w-4xl font-display text-[clamp(1.5rem,3.6vw,2.75rem)] font-medium leading-[1.28] tracking-[-0.02em]">
          {profile.about.split(" ").map((word, i) => (
            <span key={`${word}-${i}`} data-word className="inline-block">
              {word}
              {/* A real space, not a margin — margins break justification and copy/paste. */}
              {" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
