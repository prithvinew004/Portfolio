import { independentProjects, projects, sectionN, supportingProjects } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import { Badge } from "@/components/ui/badge";
import {
  MinimalCard,
  MinimalCardContent,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";
import { PrimaryProjectCard, ProjectCard } from "@/components/ui/project-card";
import { SectionIntro } from "@/components/ui/section-intro";
import { Separator } from "@/components/ui/separator";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className={`${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionIntro
          n={sectionN("projects")}
          label="Selected work"
          title="Real work, shown with context."
          titleId="projects-title"
          description={
            <p>
            Four published product and organization surfaces, followed by independent builds. Every
            claim stays within what the public work can show.
            </p>
          }
        />

        <PrimaryProjectCard project={projects[0]} />
        <div className="grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(1).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <section aria-labelledby="independent-work-title" className="mt-16">
          <div className="grid gap-4 pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">Independent products</p>
              <h3 id="independent-work-title" className="mt-2 text-2xl font-semibold">
                Tools and full-stack builds
              </h3>
            </div>
            <p className="max-w-xl text-pretty leading-7 text-[var(--muted)]">
              Public experiments and products that show implementation depth beyond the featured
              organization work.
            </p>
          </div>

          <Separator className="mt-6 bg-[var(--line)]" />
          <ul className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {independentProjects.map((project) => (
              <li
                key={project.id}
                id={`project-${project.id}`}
                className="h-full"
              >
                <MinimalCard className="flex h-full flex-col rounded-[var(--radius)] bg-[var(--surface)] p-2 shadow-[0_18px_50px_-42px_rgba(32,30,26,0.7)] hover:bg-[var(--surface)]">
                  <MinimalCardImage
                    src={project.image.src}
                    alt={project.image.alt}
                    className="mb-0 h-44"
                  />
                  <MinimalCardContent className="flex flex-1 flex-col p-5">
                    <Badge
                      variant="outline"
                      className="mb-3 border-[var(--line)] bg-transparent text-[var(--muted)]"
                    >
                      {project.statusLabel}
                    </Badge>
                    <MinimalCardTitle as="h4" className="m-0 px-0 text-xl">
                      {project.title}
                    </MinimalCardTitle>
                    <MinimalCardDescription className="mt-3 px-0 pb-0 text-pretty text-base leading-7 text-[var(--muted)]">
                      {project.summary}
                    </MinimalCardDescription>
                  </MinimalCardContent>
                  <MinimalCardFooter className="gap-5 px-5 pb-5 pt-0">
                    <ActionLink
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Live
                      <span className="sr-only">: {project.title} (opens in a new tab)</span>
                    </ActionLink>
                    <ActionLink
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Source
                      <span className="sr-only">: {project.title} (opens in a new tab)</span>
                    </ActionLink>
                  </MinimalCardFooter>
                </MinimalCard>
              </li>
            ))}
          </ul>
        </section>

        <aside className="mt-10 flex flex-col justify-between gap-5 rounded-[var(--radius)] bg-[var(--fg)] p-6 text-[var(--surface)] sm:p-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-semibold text-[var(--bg)]/65">Supporting work</p>
            <h3 className="mt-2 text-xl font-semibold">{supportingProjects[0].title}</h3>
            <p className="mt-2 max-w-2xl text-pretty text-[var(--bg)]/75">{supportingProjects[0].summary}</p>
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
