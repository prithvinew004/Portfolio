import { skills, stackMarquee } from "@/content/resume";
import { logos } from "@/content/logos";
import { Marquee } from "@/components/ui/marquee";
import { TechLogo } from "@/components/ui/tech-logo";
import { SECTION, SECTION_CONTAINER, SECTION_LABEL } from "@/lib/section";
import { cn } from "@/lib/utils";

// No JS in this section — hover states and the marquee are pure CSS, so it stays a server component.

function Card({ index, group, blurb, items }: (typeof skills)[number] & { index: number }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--hero-cream)]/10 bg-[var(--hero-deep)] p-6 sm:p-8",
        "transition-[transform,border-color,box-shadow] duration-500 ease-out",
        "hover:-translate-y-1 hover:border-[var(--hero-amber)]/40 hover:shadow-[0_18px_50px_-24px_var(--hero-amber)]",
        // First two cards are the wide pair, the remaining three split the row below.
        index < 2 ? "md:col-span-3" : "md:col-span-2"
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{group}</h3>
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[var(--hero-sage)]">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-2 max-w-[38ch] text-sm text-[var(--hero-sage)]">{blurb}</p>

      <ul className="mt-7 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <li
            key={item.name}
            style={{ "--i": i } as React.CSSProperties}
            className={cn(
              "tech-chip flex items-center gap-2 rounded-full border border-[var(--hero-cream)]/10 bg-[var(--hero-void)]/60 px-3 py-1.5",
              "font-mono text-[0.68rem] tracking-tight text-[var(--hero-cream)]/85",
              "transition-colors duration-300 group-hover:border-[var(--hero-cream)]/20"
            )}
          >
            {"logo" in item && item.logo in logos && (
              <TechLogo slug={item.logo} className="size-3.5 text-[var(--hero-amber)]" />
            )}
            {item.name}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills() {
  return (
    <section id="skills" className={cn("bg-[var(--hero-void)] text-[var(--hero-cream)]", SECTION, "pt-0")}>
      <div className={SECTION_CONTAINER}>
        <h2 className={SECTION_LABEL}>
          Skills
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {skills.slice(0, 2).map((s, i) => (
            <Card key={s.group} index={i} {...s} />
          ))}

          {/* The marquee is a card in its own right, not a strip bolted under the grid. */}
          <div className="relative overflow-hidden rounded-2xl border border-[var(--hero-cream)]/10 bg-[var(--hero-deep)] py-7 md:col-span-6">
            <Marquee pauseOnHover className="[--duration:34s] [--gap:3.5rem]">
              {stackMarquee.map((slug) => (
                <TechLogo
                  key={slug}
                  slug={slug}
                  className="size-8 text-[var(--hero-cream)]/50 transition-colors duration-300 hover:text-[var(--hero-amber)]"
                />
              ))}
            </Marquee>
            {/* Fade the strip into the card edges so logos enter and leave instead of popping. */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r sm:w-24 from-[var(--hero-deep)] to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l sm:w-24 from-[var(--hero-deep)] to-transparent" />
          </div>

          {skills.slice(2).map((s, i) => (
            <Card key={s.group} index={i + 2} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
