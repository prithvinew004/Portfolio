import type { ProjectEvidence } from "@/content/resume";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LinkPreview } from "@/components/ui/link-preview";
import { ProjectMedia } from "@/components/ui/project-media";

function ProjectDetails({ project, primary = false }: { project: ProjectEvidence; primary?: boolean }) {
  return (
    <>
      <p className="text-sm font-semibold text-[var(--accent)]">
        {project.n} · {project.statusLabel}
      </p>
      <h3
        className={`mt-3 text-balance font-display font-semibold leading-tight ${primary ? "text-[clamp(1.5rem,2.4vw,1.875rem)]" : "text-2xl"}`}
      >
        {project.title}
      </h3>
      <p className="mt-4 text-pretty text-lg leading-7">{project.summary}</p>
      <p className="mt-3 text-pretty leading-7 text-[var(--muted)]">{project.contribution}</p>
      <ul aria-label={`${project.title} capabilities`} className="mt-5 flex flex-wrap gap-2">
        {project.capabilities.map((capability) => (
          <li key={capability}>
            <Badge
              variant="outline"
              className="h-auto border-[var(--line)] bg-transparent px-3 py-1 font-normal text-[var(--muted)]"
            >
              {capability}
            </Badge>
          </li>
        ))}
      </ul>
      {project.liveUrl && (
        <LinkPreview
          url={project.liveUrl}
          isStatic
          imageSrc={project.image.src}
          imageAlt={`${project.title} website preview`}
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--fg)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
        >
          View live product
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">: {project.title} (opens in a new tab)</span>
        </LinkPreview>
      )}
    </>
  );
}

export function PrimaryProjectCard({ project }: { project: ProjectEvidence }) {
  return (
    <article id={`project-${project.id}`} className="py-10 lg:py-14">
      <Card className="gap-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] py-0 shadow-[0_28px_80px_-58px_rgba(32,30,26,0.75)] ring-0">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:items-center">
          <ProjectMedia
            src={project.image.src}
            alt={project.image.alt}
            title={project.title}
            liveUrl={project.liveUrl!}
            priority
          />
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <p className="mb-3 text-sm font-semibold text-[var(--accent)]">Primary case study</p>
            <ProjectDetails project={project} primary />
          </CardContent>
        </div>
      </Card>
    </article>
  );
}

export function ProjectCard({ project }: { project: ProjectEvidence }) {
  return (
    <article id={`project-${project.id}`} className="h-full py-4">
      <Card className="h-full gap-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] py-0 shadow-none ring-0 transition-colors hover:border-[var(--line-strong)]">
        <ProjectMedia
          src={project.image.src}
          alt={project.image.alt}
          title={project.title}
          liveUrl={project.liveUrl!}
        />
        <CardContent className="flex flex-1 flex-col p-6">
          <ProjectDetails project={project} />
        </CardContent>
      </Card>
    </article>
  );
}
