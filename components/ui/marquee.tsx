// Adapted from Magic UI's marquee. Changed: the duration/gap knobs are plain props instead of
// arbitrary Tailwind values at the call site, and the keyframes live in globals.css since this
// project's Tailwind config has no custom animation entries.
import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  reverse?: boolean;
  pauseOnHover?: boolean;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn("group flex flex-row gap-[var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:2.5rem]", className)}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn("flex shrink-0 animate-marquee flex-row justify-around gap-[var(--gap)]", {
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
