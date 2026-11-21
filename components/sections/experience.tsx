import { experience, experienceIntro, sectionN, workingApproach } from "@/content/resume";
import { SectionLabel } from "@/components/ui/section-label";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

const publishedExperience = experience.filter((record) => record.publishable);

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="approach-title"
      className={`${GUTTER} ${SECTION_Y}`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("experience")}>Approach</SectionLabel>
        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1fr)] lg:items-end">
          <h2
            id="approach-title"
            className="font-display text-[clamp(3.2rem,7vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.055em]"
          >
            {experienceIntro.heading[0]} {experienceIntro.heading[1]}.
          </h2>
          <p className="max-w-[38rem] text-lg leading-8 text-[var(--muted)]">
            {experienceIntro.blurb}
          </p>
        </div>

        {publishedExperience.length > 0 ? (
          <div className="mt-14 border-t border-[var(--line)]">
            {publishedExperience.map((record) => (
              <article
                key={`${record.organization}-${record.start}`}
                className="grid gap-3 border-b border-[var(--line)] py-8 lg:grid-cols-[0.8fr_1fr_2fr]"
              >
                <h3 className="text-xl font-bold">{record.organization}</h3>
                <p>{record.role}</p>
                <div>
                  <p className="text-sm text-[var(--muted)]">{record.period}</p>
                  <p className="mt-2 leading-7 text-[var(--muted)]">{record.summary}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-14 grid border-t border-[var(--line)] lg:grid-cols-3">
            {workingApproach.map((step, index) => (
              <article
                key={step.title}
                className="border-b border-[var(--line)] py-8 lg:border-b-0 lg:border-r lg:px-8 lg:py-10 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
              >
                <span className="text-xs font-semibold tracking-[0.18em] text-[var(--accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{step.body}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
