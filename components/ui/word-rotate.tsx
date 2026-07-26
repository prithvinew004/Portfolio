"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 2600;

/**
 * Cycles the roles after "I build". Alternates between two identical keyframes so the animation
 * name changes on every swap — that name change is what restarts it, and it's how the design does
 * it too. Under reduced motion the first role just sits there.
 */
export function WordRotate({ words, className }: { words: readonly string[]; className?: string }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => n + 1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    // overflow-hidden clips the 14px rise so the word slides up out of the baseline.
    <span className="inline-block overflow-hidden align-bottom">
      <span
        key={i}
        className={cn("inline-block font-semibold text-[var(--ac)]", className)}
        style={
          reduced
            ? undefined
            : { animation: `${i % 2 ? "roleB" : "roleA"} .55s cubic-bezier(.2,.7,.2,1) both` }
        }
      >
        {words[i % words.length]}
      </span>
    </span>
  );
}
