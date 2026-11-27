import { profile, sectionN } from "@/content/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={`${GUTTER} ${SECTION_Y} border-t border-[var(--line)]`}>
      <div className={`${CONTENT} section-reveal mx-auto grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end`}>
        <div>
          <SectionLabel n={sectionN("about")}>About</SectionLabel>
          <h2 id="about-title" className="section-title mt-5 max-w-[18ch]">{profile.aboutHeadline}</h2>
        </div>
        <div className="max-w-xl">
          <p className="text-pretty text-base leading-relaxed text-[var(--muted)] sm:text-lg">{profile.aboutBody}</p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-[var(--dim)]">{profile.tagline}</p>
        </div>
      </div>
    </section>
  );
}
