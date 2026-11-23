import { experience, experienceIntro, sectionN, workingApproach } from "@/content/resume";
import { SectionIntro } from "@/components/ui/section-intro";
import { CONTENT, GUTTER, SECTION_Y } from "@/lib/section";

const publishedExperience = experience.filter((record) => record.publishable);

export function Experience() {
  return (
    <section id="experience" aria-labelledby="approach-title" className={`${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionIntro
          n={sectionN("experience")}
          label="Approach"
          title={`${experienceIntro.heading[0]} ${experienceIntro.heading[1]}.`}
          titleId="approach-title"
          description={<p>{experienceIntro.blurb}</p>}
        />

        {publishedExperience.length > 0 ? (
          <div className="mt-10 border-t border-[var(--line)]">
            {publishedExperience.map((record) => (
              <article
                key={`${record.organization}-${record.start}`}
                className="grid gap-3 border-b border-[var(--line)] py-8 lg:grid-cols-[0.8fr_1fr_2fr]"
              >
                <h3 className="text-xl font-semibold">{record.organization}</h3>
                <p>{record.role}</p>
                <div>
                  <p className="text-sm text-[var(--muted)]">{record.period}</p>
                  <p className="mt-2 text-pretty leading-7 text-[var(--muted)]">{record.summary}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(15rem,0.7fr)_minmax(0,1.3fr)] lg:gap-16">
            <div>
              <p className="max-w-sm text-pretty text-2xl leading-9 text-[var(--fg)]">
                Find the useful path, build it end to end, then spend polish where it earns trust.
              </p>
            </div>
            <div className="border-t border-[var(--line)]">
              {workingApproach.map((step, index) => (
                <article
                  key={step.title}
                  className="grid gap-5 border-b border-[var(--line)] py-8 sm:grid-cols-[4rem_1fr] sm:py-10"
                >
                  <span className="text-sm font-semibold tabular-nums text-[var(--accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-balance font-display text-3xl font-semibold">{step.title}</h3>
                    <p className="mt-4 max-w-xl text-pretty text-lg leading-8 text-[var(--muted)]">
                      {step.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
