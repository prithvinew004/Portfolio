import Image from "next/image";
import { profile, projects, publicProjectCount } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import { CONTENT, GUTTER } from "@/lib/section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={`${GUTTER} border-b border-[var(--line)] pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36`}
    >
      <div
        className={`${CONTENT} mx-auto grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-center lg:gap-16`}
      >
        <div className="min-w-0">
          <p className="mb-5 text-sm font-semibold text-[var(--accent)]">
            {profile.name} · {profile.location}
          </p>

          <h1
            id="hero-title"
            className="max-w-[18ch] text-balance font-display text-[clamp(2.75rem,6vw,3.5rem)] font-semibold leading-[1.02]"
          >
            {profile.role}.
          </h1>

          <p className="mt-6 max-w-[42rem] text-pretty text-lg leading-8 text-[var(--muted)]">
            {profile.offer}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="#projects" variant="primary" direction="down">
              See selected work
            </ActionLink>
            <ActionLink href="#contact" variant="outline" direction="down">
              Start a conversation
            </ActionLink>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[var(--muted)]">Public work</dt>
              <dd className="mt-1 font-semibold">{publicProjectCount} public projects</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Focus</dt>
              <dd className="mt-1 font-semibold">Product workflows</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[var(--muted)]">Stack</dt>
              <dd className="mt-1 font-semibold">React · Next.js · TypeScript</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-semibold">Selected evidence</span>
            <span className="text-[var(--muted)]">Published work</span>
          </div>
          <div role="group" className="hero-proof" aria-label="Featured project evidence">
            {projects.map((project, index) => (
              <a
                key={project.id}
                href={`#project-${project.id}`}
                data-hero-proof
                aria-label={`View ${project.title} project`}
                className="hero-proof-card aspect-[16/9]"
              >
                <Image
                  src={project.image.src}
                  alt=""
                  fill
                  priority={index < 2}
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="object-cover object-top"
                />
              </a>
            ))}
          </div>
          <p className="mt-3 text-pretty text-sm leading-6 text-[var(--muted)]">
            Curoh is the primary product case study; the remaining work shows range across service
            and organization websites.
          </p>
        </div>
      </div>
    </section>
  );
}
