import { ArrowUpRight } from "lucide-react";
import { independentProjects, projects, sectionN, supportingProjects } from "@/content/resume";
import { ProjectMedia } from "@/components/ui/project-media";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className={`${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("projects")}>Selected work</SectionLabel>
        <div className="mt-7 grid gap-8 border-b border-[var(--line)] pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.7fr)] lg:items-end">
          <h2
            id="projects-title"
            className="max-w-[10ch] font-display text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.9] tracking-[-0.05em]"
          >
            Real work, shown with context.
          </h2>
          <p className="max-w-[38rem] text-lg leading-8 text-[var(--muted)]">
            Four published product and organization surfaces, followed by independent builds. Every
            claim stays within what the public work can show.
          </p>
        </div>

        <div>
          {projects.map((project, index) => (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className="grid gap-8 border-b border-[var(--line)] py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center lg:gap-16 lg:py-24"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : undefined}>
                <ProjectMedia
                  src={project.image.src}
                  alt={project.image.alt}
                  title={project.title}
                  liveUrl={project.liveUrl!}
                  priority={index === 0}
                />
              </div>

              <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em]">
                  <span className="text-[var(--accent)]">{project.n}</span>
                  <span className="text-[var(--muted)]">{project.statusLabel}</span>
                </div>
                <h3 className="mt-5 font-display text-[clamp(2.4rem,5vw,5rem)] font-extrabold leading-none tracking-[-0.045em]">
                  {project.title}
                </h3>
                <p className="mt-6 text-xl leading-8">{project.summary}</p>
                <p className="mt-4 max-w-[60ch] leading-7 text-[var(--muted)]">
                  {project.contribution}
                </p>

                <ul aria-label={`${project.title} capabilities`} className="mt-7 flex flex-wrap gap-2">
                  {project.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--muted)]"
                    >
                      {capability}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--accent)] underline decoration-[var(--line)] underline-offset-4 hover:decoration-[var(--accent)]"
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
          <div className="grid gap-4 border-b border-[var(--line)] pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">
                Independent products
              </p>
              <h3 id="independent-work-title" className="mt-2 text-3xl font-bold">
                Tools and full-stack builds
              </h3>
            </div>
            <p className="max-w-xl text-[var(--muted)]">
              Public experiments and products that show implementation depth beyond the featured
              organization work.
            </p>
          </div>

          <ul className="grid border-b border-[var(--line)] lg:grid-cols-3">
            {independentProjects.map((project) => (
              <li
                key={project.id}
                id={`project-${project.id}`}
                className="border-b border-[var(--line)] py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {project.statusLabel}
                </p>
                <h4 className="mt-3 text-2xl font-bold">{project.title}</h4>
                <p className="mt-3 leading-7 text-[var(--muted)]">{project.summary}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
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

        <aside className="mt-10 flex flex-col justify-between gap-5 rounded-[var(--radius)] bg-[var(--fg)] p-6 text-[var(--surface)] sm:p-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--bg)]/65">Supporting work</p>
            <h3 className="mt-2 text-2xl font-bold">{supportingProjects[0].title}</h3>
            <p className="mt-2 max-w-2xl text-[var(--bg)]/75">{supportingProjects[0].summary}</p>
          </div>
          <a
            href={supportingProjects[0].liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border border-[var(--surface)]/50 px-5"
          >
            Open ImageToolkit <ArrowUpRight aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
