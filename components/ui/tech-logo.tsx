import { logos, type LogoSlug } from "@/content/logos";
import { cn } from "@/lib/utils";

export function TechLogo({ slug, className }: { slug: LogoSlug; className?: string }) {
  const logo = logos[slug];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label={logo.name}
      className={cn("size-6 shrink-0", className)}
    >
      <path d={logo.d} />
    </svg>
  );
}
