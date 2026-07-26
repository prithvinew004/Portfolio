import { cn } from "@/lib/utils";

/**
 * Two identical copies scrolling as one `width:max-content` strip. The keyframe translates -50%,
 * which lands copy two exactly where copy one started — so the seam is invisible and one loop is
 * one cycle. Rendering more copies would break that maths.
 */
export function Marquee({
  children,
  className,
  pauseOnHover,
}: {
  children: React.ReactNode;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    // `group` here, paused via group-hover: hovering the moving strip directly would fight the
    // animation as items slide out from under the pointer.
    <div
      className={cn(
        // animate the strip, never the copies: a copy translating -50% of *itself* moves half a
        // copy instead of a whole one, which breaks the seam the two-copy trick depends on.
        "group flex w-max animate-marquee",
        pauseOnHover && "hover:[animation-play-state:paused]",
        className
      )}
    >
      {[0, 1].map((i) => (
        <div key={i} aria-hidden={i > 0} className="flex shrink-0 items-center">
          {children}
        </div>
      ))}
    </div>
  );
}
