import { cn } from "@/lib/utils";

/**
 * Roll-up label: the text plus an identical copy stacked below it. On hover of the nearest `group`
 * ancestor the pair slides one line height. The copy is aria-hidden so the label is announced once.
 *
 * Motion lives entirely in CSS (`.roll` in globals.css) — no JS, and reduced motion simply drops
 * the copy.
 */
export function RollLabel({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("roll", className)}>
      <span>{text}</span>
      <span aria-hidden>{text}</span>
    </span>
  );
}
