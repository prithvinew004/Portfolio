"use client";

// Adapted from Magic UI's word-rotate. Changed: imports framer-motion (already a dep) instead of
// pulling in `motion`, renders a span so the hero's <h1> stays the only h1, and holds still under
// reduced motion.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export function WordRotate({
  words,
  duration = 2600,
  className,
}: {
  words: readonly string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearInterval(id);
  }, [words, duration, reduced]);

  if (reduced) {
    return <span className={cn(className)}>{words[0]}</span>;
  }

  return (
    <span className="inline-grid overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: "0.7em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-0.7em" }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={cn("col-start-1 row-start-1", className)}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
