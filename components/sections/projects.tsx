import { independentProjects, projects, sectionN, supportingProjects } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import {
  CutoutCard,
  CutoutCardAction,
  CutoutCardContent,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCorner,
  cutoutCardSurfaceClassName,
} from "@/components/ui/cutout-card";
import { Pill } from "@/components/ui/pill";
import { PrimaryProjectCard, ProjectCard } from "@/components/ui/project-card";
import { SectionIntro } from "@/components/ui/section-intro";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";
import { cn } from "@/lib/utils";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className={`${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionIntro
          n={sectionN("projects")}
          label="Selected work"
          title="Real products, given room to speak."
          titleId="projects-title"
          description={
            <p>
              Four published product and organization surfaces, followed by independent builds.
              Every claim stays within what the public work can show.
            </p>
          }
        />

        <PrimaryProjectCard project={projects[0]} />
        <div className="mt-6 border-t border-[var(--line)]">
          {projects.slice(1).map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <section aria-labelledby="independent-work-title" className="mt-24 sm:mt-28">
          <div className="grid gap-5 border-b border-[var(--line)] pb-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">Independent products</p>
              <h3
                id="independent-work-title"
                className="mt-3 max-w-xl text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl"
              >
                Tools that make implementation depth visible.
              </h3>
            </div>
            <p className="max-w-xl text-pretty leading-7 text-[var(--muted)]">
              Public experiments and products covering multi-role workflows, browser files, and
              focused developer utilities.
            </p>
          </div>

          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {independentProjects.map((project, index) => (
              <li
                key={project.id}
                id={`project-${project.id}`}
                className={cn("h-full", index === 2 && "md:col-span-2")}
              >
                <CutoutCard
                  className={cn(
                    cutoutCardSurfaceClassName,
                    "flex h-full flex-col bg-[var(--surface)]",
                    index === 2 && "md:grid md:grid-cols-[0.9fr_1.1fr]"
                  )}
                  trackPointerHover={false}
                >
                  <CutoutCardMedia
                    className={cn("h-64 sm:h-72", index === 2 && "md:h-full md:min-h-96")}
                  >
                    <CutoutCardImage
                      src={project.image.src}
                      alt={project.image.alt}
                      className="object-cover object-top motion-reduce:transition-none"
                    />
                    <CutoutCardInsetLabel className="bottom-0 left-0 rounded-tr-3xl bg-[var(--surface)] px-5 py-3">
                      <span className="text-sm font-semibold text-[var(--muted)]">
                        {project.statusLabel}
                      </span>
                      <CutoutCorner className="absolute -right-8 bottom-0 rotate-90 text-[var(--surface)]" />
                      <CutoutCorner className="absolute -top-8 left-0 rotate-90 text-[var(--surface)]" />
                    </CutoutCardInsetLabel>
                    <CutoutCardAction className="right-4 top-4" revealOnHover={false}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-10 items-center rounded-full bg-[var(--fg)] px-4 text-sm font-semibold text-[var(--surface)]"
                      >
                        Live site
                        <span className="sr-only">: {project.title} (opens in a new tab)</span>
                      </a>
                    </CutoutCardAction>
                  </CutoutCardMedia>

                  <CutoutCardContent className="flex flex-1 flex-col p-6 sm:p-7">
                    <h4 className="text-balance font-display text-3xl font-semibold">{project.title}</h4>
                    <p className="mt-4 text-pretty leading-7 text-[var(--muted)]">{project.summary}</p>
                    <ul aria-label={`${project.title} technologies`} className="mt-6 flex flex-wrap gap-2">
                      {project.capabilities.slice(0, 4).map((capability) => (
                        <li key={capability}>
                          <Pill
                            variant="outline"
                            className="border-[var(--line)] bg-transparent text-[var(--muted)]"
                          >
                            {capability}
                          </Pill>
                        </li>
                      ))}
                    </ul>
                    <CutoutCardFooter className="mt-auto border-t border-[var(--line)] pt-6">
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex min-h-11 items-center font-semibold underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--accent)]"
                      >
                        View source
                        <span className="sr-only">: {project.title} (opens in a new tab)</span>
                      </a>
                    </CutoutCardFooter>
                  </CutoutCardContent>
                </CutoutCard>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-8 flex flex-col justify-between gap-6 rounded-3xl bg-[var(--fg)] p-7 text-[var(--surface)] sm:p-9 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[var(--bg)]/65">Supporting work</p>
            <h3 className="mt-3 text-balance font-display text-3xl font-semibold">
              {supportingProjects[0].title}
            </h3>
            <p className="mt-3 max-w-2xl text-pretty text-[var(--bg)]/75">
              {supportingProjects[0].summary}
            </p>
          </div>
          <ActionLink
            href={supportingProjects[0].liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            variant="outline"
            className="max-w-full border-[var(--surface)]/40 text-[var(--surface)] hover:border-[var(--surface)] hover:text-[var(--surface)]"
          >
            Open ImageToolkit
            <span className="sr-only">(opens in a new tab)</span>
          </ActionLink>
        </aside>
      </div>
    </section>
  );
}
