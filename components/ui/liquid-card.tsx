import type { ReactNode } from "react";

type LiquidCardProps = { children: ReactNode } & (
  | { as: "a"; href: string; target: "_blank"; rel: string }
  | { as: "li"; id: string }
);

export function LiquidCard({ as: Card, children, ...props }: LiquidCardProps) {
  return (
    <Card
      {...props}
      data-liquid-card
      className="liquid-card group flex h-full min-w-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--bg)] p-6 no-underline transition-colors hover:border-[var(--accent)]"
    >
      {children}
    </Card>
  );
}
