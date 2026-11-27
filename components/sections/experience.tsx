import { experience, experienceIntro, sectionN, workingApproach } from "@/content/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

const publishedExperience = experience.filter((record) => record.publishable)
  .sort((a, b) => b.start.localeCompare(a.start));

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="approach-title"
      className={`${GUTTER} ${SECTION_Y}`}
    >
      <div className={`${CONTENT} section-reveal mx-auto`}>
        <SectionLabel n={sectionN("experience")}>Approach</SectionLabel>
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
          <h2
            id="approach-title"
            className="section-title"
          >
            {experienceIntro.heading[0]} {experienceIntro.heading[1]}.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-[var(--muted)]">
            {experienceIntro.blurb}
          </p>
        </div>

        {publishedExperience.length > 0 ? (
          <ol className="mt-9 border-l border-[var(--line)]">
            {publishedExperience.map((record) => (
              <li
                key={`${record.organization}-${record.start}`}
                className="relative grid gap-3 py-5 pl-6 before:absolute before:top-7 before:-left-1 before:size-2 before:rounded-full before:bg-[var(--accent)] lg:grid-cols-[0.8fr_1fr_2fr]"
              >
                <h3 className="text-xl font-bold">{record.organization}</h3>
                <p>{record.role}</p>
                <div>
                  <p className="text-sm text-[var(--muted)]">{record.period}</p>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{record.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-9 grid border-t border-[var(--line)] lg:grid-cols-3">
            {workingApproach.map((step, index) => (
              <article
                key={step.title}
                className="border-b border-[var(--line)] py-5 lg:border-b-0 lg:border-r lg:px-7 lg:py-6 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
              >
                <span className="font-mono text-xs text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
