import { skills, marqueeStack } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { Marquee } from "@/components/ui/marquee";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

// Server component: the pills are hover-only CSS and the marquee is a keyframe, so none of this
// needs to ship JS.
export function Skills() {
  return (
    <section id="skills" className="relative pt-[clamp(60px,10vh,140px)]">
      <div className={GUTTER}>
        <SectionLabel n="02" className="mb-9">
          Stack
        </SectionLabel>

        {/* Frontend(2) + Backend(1) fills row one; Databases(1) + Mobile(2) fills row two. */}
        <div className={cn("grid grid-cols-1 gap-[18px] md:grid-cols-3", CONTENT)}>
          {skills.map((s, i) => (
            <Reveal
              key={s.group}
              delay={i % 2 ? 80 : 0}
              className={cn("h-full", "wide" in s && s.wide && "md:col-span-2")}
            >
              <div
                className={cn(
                  "h-full rounded-[20px] p-8",
                  // The last card flips the gradient so the accent sits on the outer edge,
                  // mirroring the first — the two wide cards bookend the grid.
                  i === skills.length - 1 ? "gborder-flip" : i === 0 ? "gborder" : "gborder-plain"
                )}
              >
                <div className="mb-2 font-display text-2xl font-bold">{s.group}</div>
                <div className="mb-[22px] text-sm text-[var(--muted)]">{s.blurb}</div>
                <ul className="flex flex-wrap gap-2.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-[var(--hair)] px-4 py-2 text-sm transition-all duration-[250ms] hover:border-[var(--ac)] hover:text-[var(--ac)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-[clamp(60px,10vh,120px)] overflow-hidden border-y border-[var(--line)] py-[26px]">
        <Marquee>
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
      </div>
    </section>
  );
}
