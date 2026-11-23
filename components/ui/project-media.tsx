import { ArrowUpRight } from "lucide-react";
import { Safari } from "@/components/ui/safari";

type ProjectMediaProps = {
  src: string;
  alt: string;
  title: string;
  liveUrl: string;
  priority?: boolean;
};

export function ProjectMedia({ src, alt, title, liveUrl, priority = false }: ProjectMediaProps) {
  const host = new URL(liveUrl).hostname.replace(/^www\./, "");

  return (
    <a
      href={liveUrl}
      target="_blank"
      rel="noreferrer noopener"
      data-project-media
      className="project-media group"
    >
      <span className="sr-only">Open {title} live site at {host} (opens in a new tab).</span>
      <Safari
        url={host}
        imageSrc={src}
        imageAlt={alt}
        imagePriority={priority}
        className="block"
      />
      <span className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-[var(--fg)] px-3 py-1.5 text-xs font-semibold text-[var(--surface)] shadow-sm transition-colors group-hover:bg-[var(--accent)]">
        Live <ArrowUpRight aria-hidden className="size-3.5" />
      </span>
    </a>
  );
}
