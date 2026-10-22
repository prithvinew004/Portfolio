import { profile, github, sectionN } from "@/content/resume";
import { getContributions, getRepos, langColor } from "@/lib/github";
import { Reveal } from "@/components/animations/reveal";
import { SectionCurtain } from "@/components/animations/section-curtain";
import { SectionLabel } from "@/components/ui/section-label";
import { ContributionWave } from "@/components/sections/contribution-wave";
import { RepoCard } from "@/components/sections/repo-card";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";

/**
 * Server component: both GitHub calls happen here, at build time and then once a day per the
 * `revalidate` in lib/github. Nothing about the fetching reaches the client — no token, no
 * request per visitor, no rate limit to trip.
 */
export async function GitHubActivity() {
  const [contributions, { repos }] = await Promise.all([getContributions(), getRepos()]);

  return (
    <section id="activity" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionCurtain />
      <div className={CONTENT}>
        <SectionLabel n={sectionN("activity")} className="mb-9">
          Activity
        </SectionLabel>

        <Reveal from="left">
          <div className="mb-11 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-[clamp(15px,1.3vw,17px)] leading-[1.8]">
            <span className="flex items-center gap-2.5">
              <span aria-hidden className="pulse-dot" />
              <span className="text-[var(--muted)]">Currently building</span>
            </span>
            <span className="max-w-[52ch] text-pretty text-[var(--fg)]">
              {profile.currentlyBuilding}
            </span>
          </div>
        </Reveal>

        <Reveal from="right">
          <div className="gborder-plain rounded-[20px] p-6 sm:p-8">
            <ContributionWave days={contributions.days} total={contributions.total} />
          </div>
        </Reveal>

        <div className="mt-[18px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {repos.map((repo, i) => (
            <Reveal
              key={repo.name}
              delay={i * 80}
              from={i % 2 ? "right" : "left"}
              className="h-full"
            >
              <RepoCard repo={repo} color={langColor(repo.language)} />
            </Reveal>
          ))}
        </div>

        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noreferrer noopener"
          className="ul-draw relative mt-9 inline-block pb-[3px] text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] no-underline [transition:color_var(--dur)_var(--ease)] hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
        >
          All repositories on GitHub
        </a>
      </div>
    </section>
  );
}
