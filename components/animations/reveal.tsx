"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-media-query";

/**
 * The design's `data-reveal`: fade up 36px on first entry, 0.12 threshold, optional stagger delay
 * in ms. Under reduced motion it renders a plain div so nothing is ever left mid-transition.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}
