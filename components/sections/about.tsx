"use client";

import Image from "next/image";
import { profile, sectionN } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { SectionCurtain } from "@/components/animations/section-curtain";
import { BlurWords } from "@/components/animations/blur-words";
import { SectionLabel } from "@/components/ui/section-label";
import { TiltCard } from "@/components/ui/tilt-card";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <section id="about" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionCurtain />
      <SectionLabel n={sectionN("about")} className="mb-9">
        About
      </SectionLabel>

      <div className={cn("grid gap-12 md:grid-cols-12 md:items-center", CONTENT)}>
        <div className="md:col-span-7">
          <BlurWords
            text={profile.aboutHeadline}
            className="m-0 max-w-[22ch] text-pretty font-display text-[clamp(28px,4.4vw,58px)] font-bold leading-[1.22] tracking-[-0.01em]"
          />

          <Reveal from="left">
            <p className="m-0 mt-10 max-w-[56ch] text-pretty text-[clamp(15px,1.3vw,17px)] leading-[1.8] text-[var(--muted)]">
              {profile.aboutBody}
            </p>
          </Reveal>
        </div>

        {/* Portrait: mono at rest, colour on hover. Touch has no hover, so it shows colour there. */}
        {profile.photo && (
          <Reveal from="bottom" delay={120} className="w-full max-w-[360px] md:col-span-4 md:col-start-9 md:max-w-none">
            <TiltCard className="gborder glow-border group aspect-[4/5]">
              <Image
                src={profile.photo}
                alt={`${profile.name}, ${profile.role}`}
                fill
                sizes="(min-width: 768px) 30vw, 360px"
                className="object-cover grayscale transition-[filter,transform] duration-700 ease-[--ease] group-hover:scale-[1.03] group-hover:grayscale-0 pointer-coarse:grayscale-0"
              />
              <span className="absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-[color-mix(in_srgb,var(--bg)_70%,transparent)] px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--fg)] backdrop-blur-md">
                <span aria-hidden className="pulse-dot" />
                {profile.availability}
              </span>
            </TiltCard>
          </Reveal>
        )}
      </div>
    </section>
  );
}
