// Magic UI Bento Grid: https://magicui.design/docs/components/bento-grid
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"article"> {
  name: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => (
  <div
    className={cn("grid w-full auto-rows-[22rem] grid-cols-1 gap-4 lg:grid-cols-3", className)}
    {...props}
  >
    {children}
  </div>
);

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => (
  <article
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]",
      className
    )}
    {...props}
  >
    <div className="min-h-0 flex-1" aria-hidden="true">
      {background}
    </div>
    <div className="relative z-10 border-t border-[var(--line)] bg-[var(--surface)] p-6 sm:p-7">
      <Icon className="size-7 text-[var(--accent)]" aria-hidden="true" />
      <h3 className="mt-5 text-balance font-display text-2xl font-semibold text-[var(--fg)]">
        {name}
      </h3>
      <p className="mt-3 max-w-lg text-pretty leading-7 text-[var(--muted)]">{description}</p>
      <Button
        render={<a href={href} />}
        variant="link"
        className="mt-5 min-h-11 justify-start p-0 text-[var(--fg)] decoration-[var(--line-strong)] underline-offset-4"
      >
        {cta}
      </Button>
    </div>
  </article>
);

export { BentoCard, BentoGrid };
