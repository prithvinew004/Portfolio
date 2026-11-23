import { ArrowDownRight } from "lucide-react";
import { capabilities, independentProjects, projects, workingApproach } from "@/content/resume";
import { CONTENT, GUTTER } from "@/lib/section";

const projectById = new Map(
  [...projects, ...independentProjects].map((project) => [project.id, project])
);

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="capabilities-title"
      className={`${GUTTER} bg-[var(--mineral)] py-24 text-[var(--fg)] sm:py-28 lg:py-36`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <div className="grid gap-8 border-b border-[var(--line)] pb-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="section-kicker">04 / Capability map</p>
            <h2
              id="capabilities-title"
              className="mt-5 max-w-[12ch] text-balance font-sans text-[clamp(2.8rem,6vw,6rem)] font-normal leading-[0.9] tracking-[-0.065em]"
            >
              Interface, system, and delivery in one line of sight.
            </h2>
          </div>
          <p className="max-w-xl text-pretty text-lg leading-8 text-[var(--muted)] lg:justify-self-end">
            Every capability points back to public work. The technology is supporting evidence, not the headline.
          </p>
        </div>

        <div className="border-b border-[var(--line)]">
          {capabilities.map((capability, index) => {
            const evidence = capability.evidenceProjectIds
              .map((id) => projectById.get(id))
              .filter((project) => project !== undefined);

            return (
              <article
                key={capability.title}
                className="group grid gap-6 border-t border-[var(--line)] py-8 first:border-t-0 sm:py-10 lg:grid-cols-[4rem_0.8fr_1.2fr] lg:items-start"
              >
                <span className="text-xs tabular-nums text-[var(--signal)]">0{index + 1}</span>
                <div>
                  <h3 className="max-w-[12ch] font-display text-[clamp(2rem,4vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.045em]">
                    {capability.title}
                  </h3>
                  <ul aria-label={`${capability.title} technologies`} className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs uppercase tracking-[0.13em] text-[var(--dim)]">
                    {capability.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div className="lg:pl-10">
                  <p className="max-w-2xl text-pretty text-lg leading-8 text-[var(--muted)]">
                    {capability.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {evidence.slice(0, 4).map((project) => (
                      <li key={project.id}>
                        <a
                          href={`#project-${project.id}`}
                          className="inline-flex min-h-10 items-center rounded-full border border-[var(--line-strong)] px-4 text-sm transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
                        >
                          {project.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>

        <div id="experience" className="pt-24 sm:pt-28" aria-labelledby="approach-title">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <p className="section-kicker">05 / Working approach</p>
              <h2
                id="approach-title"
                className="mt-5 max-w-[9ch] text-balance font-sans text-[clamp(2.8rem,6vw,6rem)] font-normal leading-[0.9] tracking-[-0.065em]"
              >
                Find the path. Build the whole thing.
              </h2>
            </div>
            <div className="flex items-end gap-4 lg:justify-self-end">
              <ArrowDownRight aria-hidden className="hidden size-9 text-[var(--signal)] sm:block" />
              <p className="max-w-lg text-pretty text-lg leading-8 text-[var(--muted)]">
                A three-step loop that moves from the real workflow to a tested, polished release.
              </p>
            </div>
          </div>

          <ol className="mt-12 grid border border-[var(--line)] lg:grid-cols-3">
            {workingApproach.map((step, index) => (
              <li
                key={step.title}
                className="min-h-72 border-b border-[var(--line)] p-6 last:border-b-0 sm:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="text-xs tabular-nums text-[var(--signal)]">0{index + 1}</span>
                <h3 className="mt-12 max-w-[11ch] font-display text-3xl font-medium leading-[1.02] tracking-[-0.035em] sm:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-sm text-pretty leading-7 text-[var(--muted)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
