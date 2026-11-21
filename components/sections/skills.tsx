import { ArrowDownRight } from "lucide-react";
import { capabilities, independentProjects, projects, sectionN } from "@/content/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

const projectById = new Map(
  [...projects, ...independentProjects].map((project) => [project.id, project])
);

export function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="capabilities-title"
      className={`${GUTTER} ${SECTION_Y} border-y border-[var(--line)] bg-[var(--surface)]`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("skills")}>Capabilities</SectionLabel>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1fr)] lg:items-end">
          <h2
            id="capabilities-title"
            className="min-w-0 max-w-[10ch] text-balance font-display text-[clamp(1.875rem,6vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]"
          >
            Capabilities tied to real work.
          </h2>
          <p className="max-w-[38rem] text-lg leading-8 text-[var(--muted)]">
            Tools matter when they help a product move. Each capability below points back to a
            public implementation you can inspect.
          </p>
        </div>

        <div className="mt-14 grid border-t border-[var(--line)] lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <article
              key={capability.title}
              className="border-b border-[var(--line)] py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
            >
              <span className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl font-bold">{capability.title}</h3>
              <p className="mt-3 min-h-24 leading-7 text-[var(--muted)]">{capability.description}</p>

              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {capability.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Evidence</p>
                <ul className="mt-3 space-y-2">
                  {capability.evidenceProjectIds.map((projectId) => {
                    const project = projectById.get(projectId);
                    if (!project) return null;
                    return (
                      <li key={projectId}>
                        <a
                          href={`#project-${projectId}`}
                          className="inline-flex min-h-10 items-center gap-2 font-semibold underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
                        >
                          {project.title} <ArrowDownRight aria-hidden className="size-4" />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
