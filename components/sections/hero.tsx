import { ArrowDownRight } from "lucide-react";
import { profile } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import { HeroProjectStack } from "@/components/sections/hero-project-stack";
import { CONTENT, GUTTER } from "@/lib/section";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={`${GUTTER} hero-theatre relative isolate min-h-svh overflow-hidden border-b border-[var(--line)] pb-16 pt-28 text-[var(--fg)] sm:pt-32 lg:pb-8 lg:pt-28`}
    >
      <div aria-hidden className="hero-grid absolute inset-0 -z-20" />
      <div aria-hidden className="hero-glow absolute -right-[15rem] -top-[18rem] -z-10 size-[52rem] rounded-full" />

      <div className={`${CONTENT} relative mx-auto grid min-w-0 gap-12 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[minmax(20rem,0.78fr)_minmax(0,1.22fr)] lg:items-center lg:gap-5`}>
        <div className="relative z-10 min-w-0 lg:pb-24">
          <p className="hero-kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted)]">
            <span>{profile.name}</span>
            <span aria-hidden className="text-[var(--signal)]">/</span>
            <span>{profile.location}</span>
          </p>

          <h1
            id="hero-title"
            className="mt-7 max-w-[10ch] text-balance font-sans text-[clamp(3.25rem,7.1vw,7.1rem)] font-normal leading-[0.88] tracking-[-0.07em]"
          >
            I build the product,
            <span className="block text-[var(--signal)]">not just the page.</span>
          </h1>

          <p className="mt-7 max-w-[36rem] text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
            {profile.offer}
          </p>

          <ul aria-label="Areas of focus" className="mt-8 grid max-w-[38rem] grid-cols-1 border-y border-[var(--line)] text-sm sm:grid-cols-3">
            {profile.roles.slice(0, 3).map((role, index) => (
              <li
                key={role}
                className="flex min-h-12 items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
              >
                <span className="text-xs tabular-nums text-[var(--signal)]">0{index + 1}</span>
                <span>{role}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <ActionLink
              href="#projects"
              variant="primary"
              className="bg-[var(--signal)] text-[#0a0a08] hover:bg-[var(--surface)] hover:text-[#0a0a08]"
            >
              Explore selected work
            </ActionLink>
            <ActionLink
              href="#contact"
              variant="outline"
              className="border-[var(--line-strong)] text-[var(--fg)]"
            >
              Start a conversation
            </ActionLink>
          </div>
        </div>

        <HeroProjectStack />

        <div className="hidden items-center gap-3 self-end pb-5 text-xs uppercase tracking-[0.16em] text-[var(--muted)] lg:flex">
          <ArrowDownRight aria-hidden className="size-5 text-[var(--signal)]" />
          Scroll for the project index
        </div>
      </div>

      <p aria-hidden className="hero-wordmark pointer-events-none absolute inset-x-0 bottom-[-0.19em] -z-10 whitespace-nowrap text-center font-display text-[clamp(5rem,16.5vw,16rem)] font-medium leading-none tracking-[-0.08em] text-white/[0.035]">
        PRITHVIRAJ
      </p>
    </section>
  );
}
