"use client";

import { profile } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { BlurWords } from "@/components/animations/blur-words";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, SECTION_Y } from "@/lib/section";

export function About() {
  return (
    <section id="about" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionLabel n="01" className="mb-9">
        About
      </SectionLabel>

      <BlurWords
        text={profile.aboutHeadline}
        className="m-0 max-w-[22ch] text-pretty font-display text-[clamp(28px,4.4vw,58px)] font-bold leading-[1.22] tracking-[-0.01em]"
      />

      <Reveal>
        <p className="m-0 mt-10 max-w-[56ch] text-pretty text-[clamp(15px,1.3vw,17px)] leading-[1.8] text-[var(--muted)]">
          {profile.aboutBody}
        </p>
      </Reveal>
    </section>
  );
}
