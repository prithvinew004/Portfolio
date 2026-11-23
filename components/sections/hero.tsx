import { profile, publicProjectCount } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import { HeroProjectStack } from "@/components/sections/hero-project-stack";
import { Pill } from "@/components/ui/pill";
import { CONTENT, GUTTER } from "@/lib/section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={`${GUTTER} overflow-hidden border-b border-[var(--line)] pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-32 lg:pt-36`}
    >
      <div
        className={`${CONTENT} mx-auto grid min-w-0 gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(30rem,1.08fr)] lg:items-center lg:gap-10 xl:gap-16`}
      >
        <div className="min-w-0 lg:pb-8">
          <p className="mb-6 text-sm font-semibold text-[var(--accent)]">
            {profile.name} · {profile.location}
          </p>

          <h1
            id="hero-title"
            className="max-w-[12ch] text-balance font-display text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.94]"
          >
            Clear products. Useful workflows. Built end to end.
          </h1>

          <p className="mt-7 max-w-[39rem] text-pretty text-lg leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
            {profile.offer}
          </p>

          <ul aria-label="Areas of focus" className="mt-7 flex flex-wrap gap-2">
            {profile.roles.slice(0, 3).map((role) => (
              <li key={role}>
                <Pill
                  variant="outline"
                  className="border-[var(--line-strong)] bg-[var(--surface)] text-[var(--fg)]"
                >
                  {role}
                </Pill>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="#projects" variant="primary">
              See selected work
            </ActionLink>
            <ActionLink href="#contact" variant="outline">
              Start a conversation
            </ActionLink>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--line)] pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-[var(--muted)]">Published work</dt>
              <dd className="mt-1 font-semibold">{publicProjectCount} public projects</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Focus</dt>
              <dd className="mt-1 font-semibold">Product workflows</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-[var(--muted)]">Core stack</dt>
              <dd className="mt-1 font-semibold">Next.js · TypeScript</dd>
            </div>
          </dl>
        </div>

        <HeroProjectStack />
      </div>
    </section>
  );
}
