import { ArrowDownRight } from "lucide-react";
import { capabilities, independentProjects, projects, sectionN } from "@/content/resume";
import { SectionIntro } from "@/components/ui/section-intro";
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
        <SectionIntro
          n={sectionN("skills")}
          label="Capabilities"
          title="Capabilities tied to real work."
          titleId="capabilities-title"
          description={
            <p>
            Tools matter when they help a product move. Each capability below points back to a
            public implementation you can inspect.
            </p>
          }
        />

        <div className="grid lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <article
              key={capability.title}
              className="border-b border-[var(--line)] py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
            >
              <span className="text-xs font-semibold text-[var(--accent)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{capability.title}</h3>
              <p className="mt-3 min-h-20 text-pretty leading-7 text-[var(--muted)]">{capability.description}</p>

              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {capability.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>

              <div className="mt-8 border-t border-[var(--line)] pt-5">
                <p className="text-xs font-semibold text-[var(--muted)]">Evidence</p>
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
