import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionLinkProps = React.ComponentProps<"a"> & {
  variant?: "primary" | "outline" | "text";
};

export function ActionLink({
  children,
  className,
  variant = "text",
  ...props
}: ActionLinkProps) {
  return (
    <Button
      render={<a {...props} />}
      variant="ghost"
      size="lg"
      className={cn(
        "h-11 rounded-none px-0 text-sm font-semibold transition-colors duration-150 active:scale-[0.98]",
        variant === "primary" &&
          "rounded-full bg-[var(--fg)] px-5 text-[var(--surface)] hover:bg-[var(--accent)] hover:text-[var(--surface)]",
        variant === "outline" &&
          "rounded-full border border-[var(--line-strong)] px-5 hover:border-[var(--accent)] hover:bg-transparent hover:text-[var(--accent)]",
        variant === "text" &&
          "justify-start underline decoration-[var(--line)] underline-offset-4 hover:bg-transparent hover:text-[var(--accent)] hover:decoration-[var(--accent)]",
        className
      )}
    >
      {children}
    </Button>
  );
}
