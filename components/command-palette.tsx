"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Check, Copy, Download, Search } from "lucide-react";
import { profile, sections, socials } from "@/content/resume";

/**
 * ⌘K palette. cmdk supplies the filtering and roving focus; Base UI's Dialog supplies the focus
 * trap, escape handling and scroll lock — accessibility worth taking from a primitive rather than
 * hand-rolling.
 *
 * shadcn's generated wrappers were removed: they style against --popover/--muted-foreground, a
 * token layer this project dropped when it went dark-only, so every class would have needed
 * replacing anyway. Only cmdk itself was kept.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.metaKey || e.ctrlKey)) return;
      // Chrome binds ⌘K to the address bar, so this has to be prevented to win.
      e.preventDefault();
      setOpen((v) => !v);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close first, then act: scrolling while the dialog still owns scroll-lock goes nowhere.
  const run = useCallback((fn: () => void) => {
    setOpen(false);
    requestAnimationFrame(fn);
  }, []);

  const copyEmail = () =>
    navigator.clipboard?.writeText(profile.email).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );

  const github = socials.find((s) => s.label === "GitHub");

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px] data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity duration-200" />
        <Dialog.Popup
          aria-label="Command palette"
          className="fixed left-1/2 top-[18vh] z-[201] w-[min(92vw,560px)] -translate-x-1/2 outline-none data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 transition-[opacity,transform] duration-200"
        >
          {/* Glass: translucent panel + heavy backdrop blur + a hairline lift. */}
          <Command
            loop
            className="overflow-hidden rounded-2xl border border-white/12 bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search aria-hidden className="size-4 shrink-0 text-[var(--muted)]" />
              <Command.Input
                autoFocus
                placeholder="Search sections and actions…"
                className="h-12 w-full bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--muted)]"
              />
              <kbd className="hidden shrink-0 rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-[var(--muted)] sm:block">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[min(56vh,380px)] overflow-y-auto overscroll-contain p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                Nothing matches that.
              </Command.Empty>

              <Command.Group heading="Go to" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted)]">
                {sections.map((s) => (
                  <Item
                    key={s.id}
                    // Keywords let "work" find Projects and "stack" find Skills.
                    value={`${s.label} ${s.id}`}
                    onSelect={() =>
                      run(() =>
                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
                      )
                    }
                  >
                    <span className="w-6 shrink-0 text-[11px] tracking-[0.16em] text-[var(--ac)]">
                      {s.n}
                    </span>
                    {s.label}
                  </Item>
                ))}
              </Command.Group>

              <Command.Group heading="Actions" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-[var(--muted)]">
                <Item value="Copy email address" onSelect={() => run(copyEmail)}>
                  {copied ? (
                    <Check aria-hidden className="size-4 shrink-0 text-[var(--ac)]" />
                  ) : (
                    <Copy aria-hidden className="size-4 shrink-0 text-[var(--muted)]" />
                  )}
                  {copied ? "Copied" : "Copy email"}
                  <span className="ml-auto truncate pl-3 text-xs text-[var(--muted)]">
                    {profile.email}
                  </span>
                </Item>

                {/* Only rendered once a PDF exists — an action that 404s is worse than no action. */}
                {profile.resumeUrl && (
                  <Item
                    value="Download resume CV"
                    onSelect={() => run(() => window.open(profile.resumeUrl, "_blank", "noopener"))}
                  >
                    <Download aria-hidden className="size-4 shrink-0 text-[var(--muted)]" />
                    Download resume
                  </Item>
                )}

                {github && (
                  <Item
                    value="View GitHub profile"
                    onSelect={() => run(() => window.open(github.href, "_blank", "noopener"))}
                  >
                    <ArrowUpRight aria-hidden className="size-4 shrink-0 text-[var(--muted)]" />
                    View GitHub
                    <span className="ml-auto pl-3 text-xs text-[var(--muted)]">prithvinew004</span>
                  </Item>
                )}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Item({
  value,
  onSelect,
  children,
}: {
  value: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--fg)] data-[selected=true]:bg-[color-mix(in_srgb,var(--ac)_14%,transparent)] data-[selected=true]:text-[var(--ac)]"
    >
      {children}
    </Command.Item>
  );
}
