"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// 0.45 rather than the design's dimmer resting value: below roughly this, large text fails WCAG
// contrast against the background. blur is capped low because filter repaints on every scrub frame.
const REST_OPACITY = 0.45;
const REST_BLUR = 6;

/**
 * Words resolve from blurred to sharp as the block scrolls through, scrubbed to scroll position.
 *
 * The blur sits on a wrapper span, never on the element GSAP also writes transforms to — a filter
 * creates a containing block, and stacking one on a transformed node is what makes this kind of
 * effect judder.
 */
export function BlurWords({
  text,
  className,
  start = "top 82%",
  end = "bottom 55%",
}: {
  text: string;
  className?: string;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      gsap.fromTo(
        "[data-blur-word]",
        { opacity: REST_OPACITY, filter: `blur(${REST_BLUR}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          // duration > stagger so neighbouring words overlap and the sharp edge reads as a sweep
          // rather than words snapping into focus one at a time.
          duration: 1.2,
          stagger: 0.45,
          scrollTrigger: { trigger: ref.current, start, end, scrub: 0.4 },
        }
      );
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <p ref={ref} className={cn(className)}>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          data-blur-word
          className="inline-block"
          // Only set when GSAP will actually run: under reduced motion nothing overwrites it and
          // the words would sit permanently blurred.
          style={reduced ? undefined : { opacity: REST_OPACITY, filter: `blur(${REST_BLUR}px)` }}
        >
          {word}
          {" "}
        </span>
      ))}
    </p>
  );
}
