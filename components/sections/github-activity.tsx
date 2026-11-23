import { profile, github, sectionN } from "@/content/resume";
import { getContributions, getRepos, langColor } from "@/lib/github";
import { SectionIntro } from "@/components/ui/section-intro";
import { ContributionWave } from "@/components/sections/contribution-wave";
import { RepoCard } from "@/components/sections/repo-card";
import { Card, CardContent } from "@/components/ui/card";
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
    <section
      id="activity"
      aria-labelledby="activity-title"
      className={`relative overflow-x-hidden ${GUTTER} ${SECTION_Y}`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <SectionIntro
          n={sectionN("activity")}
          label="Public activity"
          title="Public activity, in context."
          titleId="activity-title"
          description={
            <div>
              <p>
                Development focus: {profile.currentlyBuilding} Repository data is supporting
                evidence, not a substitute for the work above.
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
          }
        />

        <Card className="mt-8 gap-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] py-0 shadow-none ring-0">
          <CardContent className="p-5 sm:p-7">
            <ContributionWave days={contributions.days} total={contributions.total} />
          </CardContent>
        </Card>

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
