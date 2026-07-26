"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { profile } from "@/content/resume";
import { useReducedMotion } from "@/hooks/use-media-query";
import { Reveal } from "@/components/animations/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, SECTION_Y } from "@/lib/section";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The design dims unread words to .15. At that alpha this text measures ~1.6:1 against the
// background and fails WCAG, which needs 3:1 at this size — so it rests at .4 instead. Everything
// else about the effect is unchanged.
const DIM = 0.4;

export function About() {
  const scope = useRef<HTMLElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      // scrub ties word opacity to scroll position, so the sentence writes itself at whatever
      // speed the reader scrolls and reverses cleanly on the way back up.
      gsap.fromTo(
        "[data-word]",
        { opacity: DIM },
        {
          opacity: 1,
          ease: "none",
          // duration > stagger means neighbouring words overlap, so the lit edge reads as a soft
          // sweep rather than words snapping on one at a time.
          duration: 1.2,
          stagger: 0.45,
          scrollTrigger: {
            // Trigger on the paragraph, not the section: the section's vertical padding would
            // otherwise eat most of the range and the reveal would finish too early.
            trigger: copy.current,
            start: "top 82%",
            end: "bottom 55%",
            scrub: 0.4,
          },
        }
      );
    },
    { scope, dependencies: [reduced] }
  );

  return (
    <section ref={scope} id="about" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionLabel n="01" className="mb-9">
        About
      </SectionLabel>

      <p
        ref={copy}
        className="m-0 max-w-[22ch] text-pretty font-display text-[clamp(28px,4.4vw,58px)] font-bold leading-[1.22] tracking-[-0.01em]"
      >
        {profile.aboutHeadline.split(" ").map((word, i) => (
          // The dim start state is inline so there's no flash before GSAP takes over — but only
          // when GSAP will actually run. Under reduced motion nothing overwrites it, and the
          // paragraph would sit permanently dimmed.
          <span key={`${word}-${i}`} data-word style={reduced ? undefined : { opacity: DIM }}>
            {word}{" "}
          </span>
        ))}
      </p>

      <Reveal>
        <p className="m-0 mt-10 max-w-[56ch] text-pretty text-[clamp(15px,1.3vw,17px)] leading-[1.8] text-[var(--muted)]">
          {profile.aboutBody}
        </p>
      </Reveal>
    </section>
  );
}
