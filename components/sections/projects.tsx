import { ArrowUpRight } from "lucide-react";
import { independentProjects, projects, publicProjectCount, sectionN, supportingProjects } from "@/content/resume";
import { ProjectMedia } from "@/components/ui/project-media";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className={`${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("projects")}>Selected work</SectionLabel>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
          <h2 id="projects-title" className="section-title">Real work, shown with context.</h2>
          <p className="font-mono text-xs text-[var(--dim)]">{publicProjectCount} public projects</p>
        </div>

        <nav aria-label="Jump to a featured project" className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-b border-[var(--line)] pb-4">
          {projects.map((project) => (
            <a key={project.id} href={`#project-${project.id}`} className="text-link inline-flex min-h-11 items-center gap-1.5 text-sm text-[var(--muted)]">
              {project.title} <ArrowUpRight aria-hidden className="size-3" />
            </a>
          ))}
        </nav>

        <div>
          {projects.map((project, index) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className="grid gap-6 border-b border-[var(--line)] py-9 lg:grid-cols-[minmax(0,1.25fr)_minmax(17rem,0.75fr)] lg:items-center lg:gap-12 lg:py-14"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <ProjectMedia
                  src={project.image.src}
                  alt={project.image.alt}
                  title={project.title}
                  liveUrl={project.liveUrl!}
                />
              </div>

              <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="text-[var(--accent)]">{project.n}</span>
                  <span className="text-[var(--muted)]">{project.statusLabel}</span>
                </div>
                <h3 className="mt-3 text-balance text-[clamp(1.6rem,2.8vw,2.5rem)] font-semibold leading-tight">
                  {project.title}
                </h3>
                <p className="mt-3 text-pretty text-base leading-relaxed">{project.summary}</p>
                <p className="mt-3 max-w-[60ch] text-pretty text-sm leading-relaxed text-[var(--muted)]">
                  {project.contribution}
                </p>

                <ul aria-label={`${project.title} capabilities`} className="mt-5 flex flex-wrap gap-2">
                  {project.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)]"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-link inline-flex min-h-11 items-center gap-2 text-sm font-medium"
                    >
                      View live product <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">: {project.title} (opens in a new tab)</span>
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
                    >
                      View source <ArrowUpRight aria-hidden className="size-4" />
                      <span className="sr-only">: {project.title} (opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <section aria-labelledby="independent-work-title" className="mt-14">
          <div className="grid gap-4 pb-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-mono text-xs text-[var(--accent)]">
                Independent products
              </p>
              <h3 id="independent-work-title" className="mt-2 text-balance text-2xl font-semibold sm:text-3xl">
                Tools and full-stack builds
              </h3>
            </div>
          </div>

          <ul className="grid gap-4 lg:grid-cols-3">
            {independentProjects.map((project) => (
              <li
                key={project.id}
                id={`project-${project.id}`}
                className="min-w-0 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
              >
                <ProjectMedia src={project.image.src} alt={project.image.alt} title={project.title} liveUrl={project.liveUrl} compact />
                <p className="mt-5 font-mono text-xs text-[var(--dim)]">
                  {project.statusLabel}
                </p>
                <h4 className="mt-2 text-xl font-semibold">{project.title}</h4>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--muted)]">{project.summary}</p>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-[var(--muted)]">{project.contribution}</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--dim)]">{project.capabilities.join(" · ")}</p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-10 items-center gap-1 underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
                  >
                    Live <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">: {project.title} (opens in a new tab)</span>
                  </a>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex min-h-10 items-center gap-1 underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
                  >
                    Source <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">: {project.title} (opens in a new tab)</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <div>
            <p className="font-mono text-xs text-[var(--dim)]">Supporting work</p>
            <h3 className="mt-2 text-lg font-semibold">{supportingProjects[0].title}</h3>
            <p className="mt-1 max-w-xl text-pretty text-sm text-[var(--muted)]">{supportingProjects[0].summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={supportingProjects[0].liveUrl} target="_blank" rel="noreferrer noopener" className="button button-secondary">
              Open ImageToolkit <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href={supportingProjects[0].repoUrl} target="_blank" rel="noreferrer noopener" className="button button-secondary">
              Source <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">for ImageToolkit (opens in a new tab)</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
