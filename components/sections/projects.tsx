"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { projects } from "@/content/resume";
import { useReducedMotion } from "@/hooks/use-media-query";
import { TiltCard } from "@/components/ui/tilt-card";
import { TechLogo } from "@/components/ui/tech-logo";
import { SECTION, SECTION_CONTAINER, SECTION_LABEL } from "@/lib/section";
import { cn } from "@/lib/utils";

const BORDER_GRADIENT =
  "linear-gradient(140deg, color-mix(in oklab, var(--hero-amber) 95%, transparent) 0%, color-mix(in oklab, var(--hero-teal) 60%, transparent) 40%, color-mix(in oklab, var(--hero-cream) 12%, transparent) 72%)";

function Card({ project }: { project: (typeof projects)[number] }) {
  const { title, year, summary, details, stack, links } = project;

  return (
    <TiltCard>
      <div className="group relative h-full rounded-2xl p-px">
        {/* Gradient sits behind the inner panel; the 1px of padding is what shows as the border. */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
          style={{ background: BORDER_GRADIENT }}
        />

        <article className="relative flex h-full flex-col rounded-[15px] bg-[var(--hero-deep)] p-6 transition-shadow duration-500 group-hover:shadow-[0_24px_70px_-40px_var(--hero-amber)]">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
            <span className="shrink-0 font-mono text-[0.6rem] tracking-[0.2em] text-[var(--hero-sage)]">
              {year}
            </span>
          </div>

          {/* Summary and details share one grid cell on a fine pointer, so they crossfade in place
              and the cell is already as tall as the longer of the two — no reflow mid-tilt, and no
              dead space reserved at rest. A coarse pointer has no hover to trigger the swap, so
              there the two fall into separate rows and both stay readable. */}
          <div className="mt-3 grid gap-3 pointer-fine:gap-0">
            <p
              className={cn(
                "text-sm leading-relaxed text-[var(--hero-sage)]",
                "pointer-fine:col-start-1 pointer-fine:row-start-1 pointer-fine:transition-opacity pointer-fine:duration-500",
                "pointer-fine:group-hover:opacity-0 pointer-fine:group-focus-within:opacity-0"
              )}
            >
              {summary}
            </p>
            <p
              className={cn(
                "border-l-2 border-[var(--hero-amber)]/50 pl-3 text-sm leading-relaxed text-[var(--hero-cream)]/80",
                "pointer-fine:col-start-1 pointer-fine:row-start-1 pointer-fine:border-l-0 pointer-fine:pl-0",
                "pointer-fine:opacity-0 pointer-fine:transition-opacity pointer-fine:duration-500",
                "pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100"
              )}
            >
              {details}
            </p>
          </div>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-[var(--hero-cream)]/10 bg-[var(--hero-void)]/60 px-2.5 py-1 font-mono text-[0.62rem] tracking-tight text-[var(--hero-cream)]/80"
              >
                {tech}
              </li>
            ))}
          </ul>

          {/* Links stay out of the hover state entirely — a link you must hover to discover is a
              link a touch user cannot find. mt-auto pins the row to the bottom of every card. */}
          <div className="mt-auto flex items-center gap-4 pt-5">
            {links.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--hero-sage)] transition-colors hover:text-[var(--hero-amber)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-amber)]"
              >
                <TechLogo slug="github" className="size-3.5" />
                Code
                <span className="sr-only">for {title} (opens in a new tab)</span>
              </a>
            )}
            {links.live && (
              <a
                href={links.live}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--hero-sage)] transition-colors hover:text-[var(--hero-amber)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-amber)]"
              >
                <ExternalLink className="size-3.5" />
                Live
                <span className="sr-only">demo of {title} (opens in a new tab)</span>
              </a>
            )}
            <ArrowUpRight
              aria-hidden
              className="ml-auto size-4 text-[var(--hero-sage)] transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--hero-amber)]"
            />
          </div>
        </article>
      </div>
    </TiltCard>
  );
}

export function Projects() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : 0.05 } },
  };
  const item: Variants = reduced
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      };

  return (
    <section
      id="work"
      className={cn("bg-[var(--hero-void)] text-[var(--hero-cream)]", SECTION)}
    >
      <div className={SECTION_CONTAINER}>
        <h2 className={SECTION_LABEL}>
          Selected work
        </h2>

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <motion.li key={project.slug} variants={item}>
              <Card project={project} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
