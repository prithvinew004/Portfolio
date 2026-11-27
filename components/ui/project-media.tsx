"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";

type ProjectMediaProps = {
  src: string;
  alt: string;
  title: string;
  liveUrl: string;
  compact?: boolean;
};

export function ProjectMedia({ src, alt, title, liveUrl, compact = false }: ProjectMediaProps) {
  const host = new URL(liveUrl).hostname.replace(/^www\./, "");

  function updateSpotlight(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noreferrer noopener"
      data-project-media={compact ? "compact" : "featured"}
      onPointerMove={updateSpotlight}
      className="project-media group"
    >
      <span className="sr-only">Open {title} live site{compact ? "" : " at "}</span>
      {!compact && (
        <span className="project-media-bar">
          <span className="flex gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-[var(--accent)]" />
            <span aria-hidden className="size-2 rounded-full bg-[var(--support)]/70" />
            <span aria-hidden className="size-2 rounded-full bg-[var(--line)]" />
          </span>
          <span className="min-w-0 truncate text-xs text-[var(--muted)]">{host}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--fg)]">
            Live <ArrowUpRight aria-hidden className="size-3.5" />
          </span>
        </span>
      )}
      <span className="sr-only"> (opens in a new tab). </span>
      <span className="project-media-image">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={compact ? "(min-width: 1024px) 30vw, 90vw" : "(min-width: 1024px) 53vw, 90vw"}
          className="object-cover object-top"
        />
      </span>
    </a>
  );
}
