import { projects } from "@/content/resume";
import { Reveal } from "@/components/animations/reveal";
import { TiltCard } from "@/components/ui/tilt-card";
import { SectionLabel } from "@/components/ui/section-label";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionLabel n="04" className="mb-9">
        Selected work
      </SectionLabel>

      {/* perspective on the grid, not the card: on the card itself it flattens the tilt. */}
      <div className={cn("grid grid-cols-1 gap-[22px] [perspective:1200px] md:grid-cols-3", CONTENT)}>
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 80} className="h-full">
            <TiltCard className="gborder">
              <div className="m-3.5 flex h-[180px] items-center justify-center rounded-[14px] font-mono text-xs tracking-[0.1em] text-[var(--muted)] bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.045)_0_10px,transparent_10px_22px)]">
                {p.media}
              </div>
              <div className="px-7 pb-[30px] pt-3.5">
                <div className="mb-2.5 text-xs tracking-[0.2em] text-[var(--ac)]">{p.n}</div>
                <h3 className="m-0 mb-2.5 font-display text-2xl font-bold">{p.title}</h3>
                <p className="m-0 mb-[18px] text-pretty text-sm leading-[1.7] text-[var(--muted)]">
                  {p.blurb}
                </p>
                <ul className="mb-5 flex flex-wrap gap-2">
                  {p.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/[0.12] px-3 py-[5px] text-xs text-[var(--muted)]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className="inline-block border-b border-[var(--ac)] pb-[3px] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] transition-colors hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
                >
                  Case study <span aria-hidden>→</span>
                  <span className="sr-only">for {p.title}</span>
                </a>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
