import { profile, github, sectionN } from "@/content/resume";
import { getContributions, getRepos, langColor } from "@/lib/github";
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
  const [contributions, repoFeed] = await Promise.all([getContributions(), getRepos()]);
  const stale = contributions.stale || repoFeed.stale;
  const coveredThrough = [contributions.coveredThrough, repoFeed.coveredThrough].sort()[0];

  return (
    <section id="activity" aria-labelledby="activity-title" className={`${GUTTER} ${SECTION_Y} border-t border-[var(--line)] bg-[var(--surface)]`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("activity")}>Public activity</SectionLabel>

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-end">
          <h2 id="activity-title" className="section-title max-w-[18ch]">
            Public activity, in context.
          </h2>
          <div>
            <p className="max-w-md text-pretty text-sm leading-relaxed text-[var(--muted)]">
              Development focus: {profile.currentlyBuilding}
            </p>
            <p className="mt-3 font-mono text-xs text-[var(--dim)]">
              {stale ? "Saved public snapshot" : "Live GitHub data"} · covered through{" "}
              <time dateTime={coveredThrough}>
                {new Intl.DateTimeFormat("en", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(`${coveredThrough}T00:00:00Z`))}
              </time>
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--bg)] p-4 sm:p-6">
          <ContributionWave days={contributions.days} total={contributions.total} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {repoFeed.repos.map((repo) => (
            <RepoCard key={repo.name} repo={repo} color={langColor(repo.language)} />
          ))}
        </div>

        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-9 inline-flex min-h-11 items-center font-semibold underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--accent)]"
        >
          Visit GitHub profile
        </a>
      </div>
    </section>
  );
}
