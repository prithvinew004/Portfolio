import { Star } from "lucide-react";
import { LiquidCard } from "@/components/ui/liquid-card";
import type { Repo } from "@/lib/github";

export function RepoCard({ repo, color }: { repo: Repo; color: string }) {
  return (
    <LiquidCard as="a" href={repo.url} target="_blank" rel="noreferrer noopener">
      <div className="mb-2.5 flex items-baseline gap-3">
        <span className="font-display text-lg font-bold text-[var(--fg)] group-hover:text-[var(--accent)]">
          {repo.name}
        </span>
        {/* A star count of zero is noise on a young account — show the badge only when it earns it. */}
        {repo.stars > 0 && (
          <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-[var(--muted)]">
            <Star aria-hidden className="size-3.5" />
            {repo.stars}
          </span>
        )}
      </div>

      <p className="m-0 mb-5 flex-1 text-pretty text-sm leading-[1.7] text-[var(--muted)]">
        {repo.description ?? "No description on GitHub yet."}
      </p>

      {repo.language && (
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <span
            aria-hidden
            className="size-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          {repo.language}
        </div>
      )}
    </LiquidCard>
  );
}
