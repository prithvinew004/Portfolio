import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { profile, projects, publicProjectCount } from "@/content/resume";
import { CONTENT, GUTTER } from "@/lib/section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={`${GUTTER} relative flex min-h-svh items-center overflow-hidden border-b border-[var(--line)] pb-10 pt-24 sm:pb-14 sm:pt-28`}
    >
      <div
        className={`${CONTENT} relative mx-auto grid w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.52fr)]`}
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)] sm:mb-7">
          {profile.name} · {profile.location}
        </p>

        <h1
          id="hero-title"
          className="min-w-0 max-w-[11ch] text-balance font-display text-[clamp(2.125rem,10vw,8rem)] font-extrabold leading-[0.88] tracking-[-0.055em]"
        >
          Product-focused full-stack developer.
        </h1>

        <div
          role="group"
          className="hero-proof mt-5 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-0"
          aria-label="Featured project evidence"
        >
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={`#project-${project.id}`}
              data-hero-proof
              aria-label={`View ${project.title} project`}
              className="hero-proof-card"
            >
              <Image
                src={project.image.src}
                alt=""
                fill
                priority={index < 2}
                sizes="(min-width: 1024px) 25vw, 25vw"
                className="object-cover object-top"
              />
            </a>
          ))}
        </div>

        <div className="mt-6 grid max-w-5xl gap-6 border-t border-[var(--line)] pt-6 sm:mt-8 sm:gap-8 sm:pt-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className="max-w-[44rem] text-pretty text-[clamp(1.05rem,2vw,1.5rem)] leading-[1.55] text-[var(--muted)]">
            {profile.offer}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-12 items-center justify-between gap-6 rounded-full bg-[var(--fg)] px-6 py-3 font-medium text-[var(--surface)] transition-colors hover:bg-[var(--accent)]"
            >
              Start a conversation
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
            <a
              href="#projects"
              className="inline-flex min-h-12 items-center justify-between gap-6 rounded-full border border-[var(--fg)] px-6 py-3 font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              See selected work
              <ArrowDownRight aria-hidden className="size-4" />
            </a>
          </div>
        </div>

        <dl className="mt-8 grid max-w-3xl grid-cols-2 gap-5 text-sm sm:mt-10 sm:grid-cols-3 sm:gap-6">
          <div>
            <dt className="text-[var(--muted)]">Selected evidence</dt>
            <dd className="mt-1 font-semibold">{publicProjectCount} public projects</dd>
          </div>
          <div>
            <dt className="text-[var(--muted)]">Core focus</dt>
            <dd className="mt-1 font-semibold">Product workflows</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-[var(--muted)]">Typical stack</dt>
            <dd className="mt-1 font-semibold">React · Next.js · TypeScript</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
