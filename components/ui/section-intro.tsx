import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

type SectionIntroProps = {
  n: string;
  label: string;
  title: string;
  titleId: string;
  description: React.ReactNode;
  className?: string;
};

export function SectionIntro({
  n,
  label,
  title,
  titleId,
  description,
  className,
}: SectionIntroProps) {
  return (
    <div className={cn("border-b border-[var(--line)] pb-10 sm:pb-12", className)}>
      <SectionLabel n={n}>{label}</SectionLabel>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:items-end lg:gap-16">
        <h2
          id={titleId}
          className="max-w-[18ch] text-balance font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98]"
        >
          {title}
        </h2>
        <div className="max-w-[42rem] text-pretty text-base leading-7 text-[var(--muted)] sm:text-[1.0625rem] sm:leading-8">
          {description}
        </div>
      </div>
    </div>
  );
}
