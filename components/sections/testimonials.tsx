"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sectionN, testimonials } from "@/content/resume";
import { SectionCurtain } from "@/components/animations/section-curtain";
import { SectionLabel } from "@/components/ui/section-label";
import { useReducedMotion } from "@/hooks/use-media-query";
import { GUTTER, SECTION_Y, CONTENT } from "@/lib/section";
import { cn } from "@/lib/utils";

const BEHIND = 2; // cards peeking out above the front one

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/**
 * Draggable card stack, after 21st.dev's glass testimonial swiper. Swipe the front card either way
 * to send it to the back; the dots and arrows do the same for keyboard and assistive tech.
 *
 * Every card sits in the same grid cell, so the stack is as tall as its tallest card and nothing
 * jumps when the front one changes. Renders nothing while there are no quotes.
 */
export function Testimonials() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const total = testimonials.length;
  if (!total) return null;

  const go = (i: number) => setActive((i + total) % total);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <section id="testimonials" className={`relative ${GUTTER} ${SECTION_Y}`}>
      <SectionCurtain />
      <div className={CONTENT}>
        <SectionLabel n={sectionN("testimonials")} className="mb-9">
          Kind words
        </SectionLabel>

        {/* Top padding leaves room for the cards stacked behind to peek above the front one. */}
        <div className="grid max-w-[720px] pt-10 [&>*]:[grid-area:1/1]">
          {testimonials.map((t, i) => {
            const order = (i - active + total) % total; // 0 is the front card
            const front = order === 0;
            const shown = order <= BEHIND;
            return (
              <motion.article
                key={t.name}
                drag={front ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 60) go(active + (info.offset.x < 0 ? 1 : -1));
                }}
                animate={{
                  scale: 1 - 0.05 * order,
                  y: -22 * order,
                  opacity: shown ? 1 - 0.3 * order : 0,
                }}
                transition={spring}
                // Opaque, not glass: three translucent cards stacked over each other muddy into one
                // haze, and the accent corner of .gborder bleeds through every layer.
                style={{ zIndex: total - order, backgroundColor: "var(--bg)" }}
                aria-hidden={!front}
                // Only the front card is reachable: the ones behind are decoration until their turn.
                inert={!front}
                className={cn(
                  "gborder-plain select-none rounded-[22px] p-7 sm:p-9",
                  front && "cursor-grab active:cursor-grabbing"
                )}
              >
                <blockquote className="m-0 text-pretty text-[clamp(17px,1.6vw,22px)] leading-[1.6] text-[var(--fg)]">
                  “{t.quote}”
                </blockquote>
                <footer className="mt-7 flex items-center gap-4 border-t border-[var(--line)] pt-5">
                  <span
                    aria-hidden
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--ac)_18%,transparent)] font-display text-sm font-bold text-[var(--ac)]"
                  >
                    {initials(t.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium text-[var(--fg)]">{t.name}</div>
                    <div className="text-sm text-[var(--muted)]">{t.role}</div>
                  </div>
                  {t.href && (
                    <a
                      href={t.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="ul-draw ml-auto shrink-0 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] transition-colors duration-[--dur] ease-[--ease] hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ac)]"
                    >
                      Source<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </footer>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-6 flex max-w-[720px] items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Testimonials">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Quote from ${t.name}`}
                onClick={() => go(i)}
                className="flex size-6 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ac)]"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-[--dur] ease-[--ease]",
                    i === active ? "w-6 bg-[var(--ac)]" : "w-1.5 bg-white/25"
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {(["Previous", "Next"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                aria-label={`${dir} quote`}
                onClick={() => go(active + (dir === "Next" ? 1 : -1))}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-[var(--fg)] transition-colors duration-[--dur] ease-[--ease] hover:border-[var(--ac)] hover:text-[var(--ac)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ac)]"
              >
                <span aria-hidden>{dir === "Next" ? "→" : "←"}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
