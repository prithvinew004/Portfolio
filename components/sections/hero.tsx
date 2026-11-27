import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ParticleHero } from "@/components/gpu/particle-hero";
import { profile } from "@/content/resume";
import { CONTENT, GUTTER } from "@/lib/section";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className={`hero ${GUTTER}`}>
      <ParticleHero />

      <div className={`${CONTENT} mx-auto w-full min-w-0`}>
        <p className="mb-5 font-mono text-xs font-medium uppercase text-[var(--muted)] sm:mb-7">
          {profile.name} <span className="px-1 text-[var(--accent)]" aria-hidden>·</span> {profile.location}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span className="block">{profile.roleLines[0]}</span>{" "}
          <span className="block">{profile.roleLines[1]}.</span>
        </h1>
        <p className="mt-5 max-w-[43ch] text-pretty text-base leading-relaxed text-[var(--muted)] sm:mt-7 sm:text-lg">
          {profile.offer}
        </p>

        <div className="mt-7 flex flex-wrap gap-2.5 sm:mt-9">
          <a href="#projects" className="button button-primary">
            See selected work <ArrowDownRight aria-hidden className="size-4" />
          </a>
          <a href="#contact" className="button button-secondary">
            Contact me <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
