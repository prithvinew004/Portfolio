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
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
          <h2
            id="capabilities-title"
            className="section-title max-w-[19ch]"
          >
            Capabilities tied to real work.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-[var(--muted)]">
            From responsive interfaces to application data and browser-based tools.
          </p>
        </div>

        <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="min-w-0 bg-[var(--surface)] p-5 sm:p-7"
            >
              <h3 className="text-xl font-semibold">{capability.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--muted)] lg:min-h-16">{capability.description}</p>

              <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                {capability.skills.map((skill) => (
                  <li key={skill} className="rounded-md border border-[var(--line)] px-2.5 py-1">{skill}</li>
                ))}
              </ul>

              <div className="mt-6 border-t border-[var(--line)] pt-4">
                <p className="font-mono text-xs text-[var(--dim)]">See it in practice</p>
                <ul className="mt-1">
                  {capability.evidenceProjectIds.map((projectId) => {
                    const project = projectById.get(projectId);
                    if (!project) return null;
                    return (
                      <li key={projectId}>
                        <a
                          href={`#project-${projectId}`}
                          className="text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
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
