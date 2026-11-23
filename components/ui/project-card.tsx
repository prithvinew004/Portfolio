import type { ProjectEvidence } from "@/content/resume";
import { LinkPreview } from "@/components/ui/link-preview";
import { Pill } from "@/components/ui/pill";
import { ProjectMedia } from "@/components/ui/project-media";
import { cn } from "@/lib/utils";

function ProjectDetails({ project, primary = false }: { project: ProjectEvidence; primary?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--accent)]">
        {project.n} · {project.statusLabel}
      </p>
      <h3
        className={cn(
          "mt-4 max-w-[18ch] text-balance font-display font-semibold leading-[1.02]",
          primary ? "text-[clamp(2.25rem,4vw,4rem)]" : "text-[clamp(2rem,3.2vw,3.25rem)]"
        )}
      >
        {project.title}
      </h3>
      <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-[var(--fg)]">
        {project.summary}
      </p>
      <p className="mt-4 max-w-2xl text-pretty leading-7 text-[var(--muted)]">
        {project.contribution}
      </p>
      <ul aria-label={`${project.title} capabilities`} className="mt-6 flex flex-wrap gap-2">
        {project.capabilities.map((capability) => (
          <li key={capability}>
            <Pill
              variant="outline"
              className="border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
            >
              {capability}
            </Pill>
          </li>
        ))}
      </ul>
      {project.liveUrl && (
        <LinkPreview
          url={project.liveUrl}
          isStatic
          imageSrc={project.image.src}
          imageAlt={`${project.title} website preview`}
          className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--fg)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
        >
          View live product
          <span className="sr-only">: {project.title} (opens in a new tab)</span>
        </LinkPreview>
      )}
    </div>
  );
}

export function PrimaryProjectCard({ project }: { project: ProjectEvidence }) {
  return (
    <article
      id={`project-${project.id}`}
      className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:p-4 lg:p-5"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)] lg:items-center lg:gap-12">
        <ProjectMedia
          src={project.image.src}
          alt={project.image.alt}
          title={project.title}
          liveUrl={project.liveUrl!}
          priority
        />
        <div className="px-3 pb-6 sm:px-5 lg:py-8 lg:pr-8">
          <p className="mb-4 text-sm font-semibold text-[var(--support)]">Primary case study</p>
          <ProjectDetails project={project} primary />
        </div>
      </div>
    </article>
  );
}

export function ProjectCard({ project, index }: { project: ProjectEvidence; index: number }) {
  const mediaFirst = index % 2 === 0;

  return (
    <article
      id={`project-${project.id}`}
      className="grid gap-8 border-b border-[var(--line)] py-14 md:grid-cols-2 md:items-center md:gap-12 lg:py-20"
    >
      <div className={cn(!mediaFirst && "md:order-2")}>
        <ProjectMedia
          src={project.image.src}
          alt={project.image.alt}
          title={project.title}
          liveUrl={project.liveUrl!}
        />
      </div>
      <div className={cn("md:px-4 lg:px-8", !mediaFirst && "md:order-1")}>
        <ProjectDetails project={project} />
      </div>
    </article>
  );
}
