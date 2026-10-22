"use client";

import { Star } from "lucide-react";
import type { Repo } from "@/lib/github";
import { useCursorGlow } from "@/hooks/use-cursor-glow";

/**
 * Same card language as the Skills bento — `gborder` edge, cursor-following `glow-border`,
 * underline-draw on the title. Client only for the glow's pointer handler.
 */
export function RepoCard({ repo, color }: { repo: Repo; color: string }) {
  const glow = useCursorGlow<HTMLAnchorElement>();

  return (
    <a
      ref={glow.ref}
      onPointerMove={glow.onPointerMove}
      href={repo.url}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor="view"
      className="gborder glow-border group flex h-full flex-col rounded-[20px] p-7 no-underline [transition:box-shadow_var(--dur)_var(--ease),transform_var(--dur)_var(--ease)] hover:-translate-y-1 hover:shadow-[0_24px_70px_-46px_var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
    >
      <div className="mb-2.5 flex items-baseline gap-3">
        <span className="ul-draw relative font-display text-lg font-bold text-[var(--fg)] [transition:color_var(--dur)_var(--ease)] group-hover:text-[var(--ac)]">
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
    </a>
  );
}
