import { cn } from "@/lib/utils";

/**
 * Two identical copies scrolling as one `width:max-content` strip. The keyframe translates -50%,
 * which lands copy two exactly where copy one started — so the seam is invisible and one loop is
 * one cycle. Rendering more copies would break that maths.
 */
export function Marquee({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex w-max animate-marquee", className)}>
      {[0, 1].map((i) => (
        <div key={i} aria-hidden={i > 0} className="flex shrink-0 items-center">
          {children}
        </div>
      ))}
    </div>
  );
}
