"use client";

import { useRef } from "react";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const MAX = 14; // degrees — a pill is only ~34px tall, and past this it reads as jitter

/**
 * A stack pill that tips toward the cursor.
 *
 * Two elements on purpose. The outer <li> hosts the existing `tech-pop` bounce (which fires on
 * *card* hover and animates transform), the inner span does the tilt (which fires on *pill* hover
 * and also animates transform). On one element the animation would win — CSS animations outrank
 * inline styles, and `fill: both` means the pop's end frame would clamp the tilt permanently once
 * it finished.
 *
 * Transforms are written straight to style: a card holds a dozen of these all tracking one pointer,
 * so state would mean a dozen re-renders a frame.
 */
export function TiltPill({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const inner = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  function onPointerMove(e: React.PointerEvent) {
    const el = inner.current;
    if (!enabled || !el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    // Perspective per pill, not on the list: a shared vanishing point shears the outer pills
    // instead of tipping them.
    el.style.transform = `perspective(300px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`;
  }

  function reset() {
    if (inner.current) inner.current.style.transform = "";
  }

  return (
    <li
      className="tech-chip"
      style={index === undefined ? undefined : ({ "--i": index } as React.CSSProperties)}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <span
        ref={inner}
        className={cn("block [transition:transform_var(--dur)_var(--ease)]", className)}
      >
        {children}
      </span>
    </li>
  );
}
