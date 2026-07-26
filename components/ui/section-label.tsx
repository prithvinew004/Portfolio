import { EYEBROW } from "@/lib/section";
import { cn } from "@/lib/utils";

/** "01 — About". The number carries the accent; the em dash and name stay muted. */
export function SectionLabel({
  n,
  children,
  className,
}: {
  n: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(EYEBROW, className)}>
      <span className="text-[var(--ac)]">{n}</span> — {children}
    </div>
  );
}
