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
    <section id="activity" className={`relative overflow-x-hidden ${GUTTER} ${SECTION_Y}`}>
      <div className={`${CONTENT} mx-auto`}>
        <SectionLabel n={sectionN("activity")}>Public activity</SectionLabel>

        <div className="mt-7 grid gap-8 border-b border-[var(--line)] pb-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(20rem,1fr)] lg:items-end">
          <h2 className="max-w-[11ch] font-display text-[clamp(2.5rem,6vw,6.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
            Public activity, in context.
          </h2>
          <div>
            <p className="max-w-[42rem] text-lg leading-8 text-[var(--muted)]">
              Development focus: {profile.currentlyBuilding} Repository data is supporting evidence,
              not a substitute for the work above.
            </p>
            <p className="mt-4 text-sm font-medium">
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

        <div className="mt-10 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
          <ContributionWave days={contributions.days} total={contributions.total} />
        </div>

        <div className="mt-[18px] grid grid-cols-1 gap-[18px] md:grid-cols-3">
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
