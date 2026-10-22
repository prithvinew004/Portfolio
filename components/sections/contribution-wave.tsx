"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphLegend,
  type Activity,
} from "@/components/kibo-ui/contribution-graph";
import { useReducedMotion } from "@/hooks/use-media-query";

/**
 * A cell's delay is driven mostly by its column, with a small per-row offset — that tilt is what
 * makes the sweep read as a diagonal wave rather than a vertical curtain wiping across.
 */
const PER_WEEK = 14; // ms
const PER_DAY = 26; // ms

export function ContributionWave({ days, total }: { days: Activity[]; total: number }) {
  const host = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Once: a graph that replays every time it scrolls past would be noise, not delight.
  const inView = useInView(host, { once: true, amount: 0.25 });
  const play = inView && !reduced;

  return (
    <div ref={host}>
      <ContributionGraph
        data={days}
        blockSize={11}
        blockMargin={3}
        blockRadius={2}
        fontSize={12}
        totalCount={total}
        // `cg` scopes the lime ramp to every [data-level] rect below, so the legend keys pick up
        // the same colours as the cells without being styled twice.
        // `w-max` would push the page wider than the viewport on mobile; the calendar scrolls
        // horizontally inside itself instead.
        className="cg !w-full text-[var(--dim)]"
      >
        <ContributionGraphCalendar className="cg-cal">
          {({ activity, dayIndex, weekIndex }) => (
            <ContributionGraphBlock
              activity={activity}
              dayIndex={dayIndex}
              weekIndex={weekIndex}
              // Kibo's default fills are shadcn tokens (`fill-muted-foreground`) this theme
              // never defined, so they resolve to nothing — `.cg` replaces them. `cg-cell`
              // only carries the wave.
              className={`cg-cell ${play ? "cg-play" : ""}`}
              style={
                reduced
                  ? undefined
                  : { animationDelay: `${weekIndex * PER_WEEK + dayIndex * PER_DAY}ms` }
              }
            >
              {/* Native SVG tooltip — no JS, no library, works on keyboard focus of the graph. */}
              <title>{`${activity.count} contribution${activity.count === 1 ? "" : "s"} on ${activity.date}`}</title>
            </ContributionGraphBlock>
          )}
        </ContributionGraphCalendar>

        <ContributionGraphFooterRow total={total} />
      </ContributionGraph>
    </div>
  );
}

/**
 * Kibo's own footer/total components render shadcn-token text and a `{{count}} in {{year}}`
 * template that reads oddly for a rolling 12 months. The legend is reused as-is.
 */
function ContributionGraphFooterRow({ total }: { total: number }) {
  return (
    <div className="mt-1 flex w-full flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
      <span>
        <span className="text-[var(--fg)]">{total.toLocaleString()}</span> contributions in the last
        year
      </span>
      <ContributionGraphLegend className="ml-auto" />
    </div>
  );
}
