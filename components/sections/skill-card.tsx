"use client";

import { skills } from "@/content/resume";
import { TiltPill } from "@/components/ui/tilt-pill";
import { useCursorGlow } from "@/hooks/use-cursor-glow";
import { cn } from "@/lib/utils";

/**
 * Split out of the Skills section so only the card is a client component — the section itself, its
 * heading and the marquee stay server-rendered. The glow needs a ref and a pointer handler; the
 * rest of that section needs neither.
 */
export function SkillCard({
  card,
  index,
  last,
}: {
  card: (typeof skills)[number];
  index: number;
  last: boolean;
}) {
  const glow = useCursorGlow<HTMLDivElement>();

  return (
    <div
      ref={glow.ref}
      onPointerMove={glow.onPointerMove}
      className={cn(
        "group glow-border h-full rounded-[20px] p-8",
        // The last card flips the gradient so the accent sits on the outer edge, mirroring the
        // first — the two wide cards bookend the grid.
        last ? "gborder-flip" : index === 0 ? "gborder" : "gborder-plain"
      )}
    >
      <div className="mb-2 font-display text-2xl font-bold">{card.group}</div>
      <div className="mb-[22px] text-sm text-[var(--muted)]">{card.blurb}</div>
      <ul className="flex flex-wrap gap-2.5">
        {card.items.map((item, j) => (
          <TiltPill
            key={item}
            // index drives the staggered chip-pop when the whole card is hovered.
            index={j}
            className="rounded-full border border-[var(--hair)] px-4 py-2 text-sm [transition:transform_var(--dur)_var(--ease),border-color_var(--dur)_var(--ease),color_var(--dur)_var(--ease)] hover:border-[var(--ac)] hover:text-[var(--ac)]"
          >
            {item}
          </TiltPill>
        ))}
      </ul>
    </div>
  );
}
