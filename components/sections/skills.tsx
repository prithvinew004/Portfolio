import { skills, marqueeStack, sectionN } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { SectionCurtain } from "@/components/animations/section-curtain";
import { Marquee } from "@/components/ui/marquee";
import { SkillCard } from "@/components/sections/skill-card";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

// Server component: the pills are hover-only CSS and the marquee is a keyframe, so none of this
// needs to ship JS.
export function Skills() {
  return (
    <section id="skills" className="relative pt-[clamp(60px,10vh,140px)]">
      <SectionCurtain />
      <div className={GUTTER}>
        <SectionLabel n={sectionN("skills")} className="mb-9">
          Stack
        </SectionLabel>

        {/* Frontend(2) + Backend(1) fills row one; Databases(1) + Mobile(2) fills row two. */}
        <div className={cn("grid grid-cols-1 gap-[18px] md:grid-cols-3", CONTENT)}>
          {skills.map((s, i) => (
            <Reveal
              key={s.group}
              delay={i % 2 ? 80 : 0}
              from={i % 2 ? "right" : "left"}
              className={cn("h-full", "wide" in s && s.wide && "md:col-span-2")}
            >
              <SkillCard card={s} index={i} last={i === skills.length - 1} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="relative mt-[clamp(60px,10vh,120px)] overflow-hidden border-y border-[var(--line)] py-[26px]">
        <Marquee pauseOnHover>
          {marqueeStack.map((tech) => (
            <span key={tech} className="flex items-center">
              <span className="whitespace-nowrap font-display text-[clamp(20px,2.4vw,32px)] font-bold uppercase tracking-[0.02em] text-[var(--dim)]">
                {tech}
              </span>
              <span aria-hidden className="px-[18px] text-[0.6em] text-[var(--ac)]">
                ◦
              </span>
            </span>
          ))}
        </Marquee>
        {/* Fade the strip into the section edges so words enter and leave instead of popping. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--bg)] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent sm:w-32" />
      </div>
    </section>
  );
}
