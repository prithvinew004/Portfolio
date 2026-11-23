import { ArrowUpRight, Star } from "lucide-react";
import { profile, github } from "@/content/resume";
import { getContributions, getRepos, langColor } from "@/lib/github";
import { ContributionWave } from "@/components/sections/contribution-wave";
import { GUTTER, CONTENT } from "@/lib/section";

export async function GitHubActivity() {
  const [contributions, repoFeed] = await Promise.all([getContributions(), getRepos()]);
  const stale = contributions.stale || repoFeed.stale;
  const coveredThrough = [contributions.coveredThrough, repoFeed.coveredThrough].sort()[0];

  return (
    <section
      id="activity"
      aria-labelledby="activity-title"
      className={`relative overflow-x-hidden ${GUTTER} bg-[var(--bg)] py-24 text-[var(--fg)] sm:py-28 lg:py-36`}
    >
      <div className={`${CONTENT} mx-auto`}>
        <div className="grid gap-8 border-b border-[var(--line)] pb-9 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="section-kicker">06 / Public activity</p>
            <h2
              id="activity-title"
              className="mt-5 max-w-[9ch] text-balance font-sans text-[clamp(2.8rem,6vw,6rem)] font-normal leading-[0.9] tracking-[-0.065em]"
            >
              The work continues in public.
            </h2>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-pretty text-lg leading-8 text-[var(--muted)]">
              Development focus: {profile.currentlyBuilding} Repository data supports the work above; it does not replace it.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--dim)]">
              {stale ? "Saved public snapshot" : "Live GitHub data"} / covered through{" "}
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

        <div className="activity-graph mt-10 overflow-x-auto border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
          <ContributionWave days={contributions.days} total={contributions.total} />
        </div>

        <div className="mt-10 border-t border-[var(--line)]">
          {repoFeed.repos.map((repo, index) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group grid gap-4 border-b border-[var(--line)] py-6 transition-colors hover:text-[var(--signal)] sm:grid-cols-[3rem_0.7fr_1.3fr_auto] sm:items-center sm:py-7"
            >
              <span className="text-xs tabular-nums text-[var(--dim)]">0{index + 1}</span>
              <span className="font-display text-2xl font-medium tracking-[-0.025em] sm:text-3xl">
                {repo.name}
              </span>
              <span className="max-w-xl text-sm leading-6 text-[var(--muted)] group-hover:text-current/70">
                {repo.description ?? "No description on GitHub yet."}
              </span>
              <span className="flex items-center gap-4 text-xs uppercase tracking-[0.12em] text-[var(--dim)]">
                {repo.language ? (
                  <span className="flex items-center gap-2">
                    <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: langColor(repo.language) }} />
                    {repo.language}
                  </span>
                ) : null}
                {repo.stars > 0 ? (
                  <span className="flex items-center gap-1">
                    <Star aria-hidden className="size-3.5" />
                    {repo.stars}
                  </span>
                ) : null}
                <ArrowUpRight aria-hidden className="size-4" />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>

        <a
          href={`https://github.com/${github.username}`}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-[var(--line-strong)] font-medium hover:border-[var(--signal)] hover:text-[var(--signal)]"
        >
          Visit the complete GitHub profile
          <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
