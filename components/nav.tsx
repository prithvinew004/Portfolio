"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { profile, sections } from "@/content/resume";
import { ActionLink } from "@/components/ui/action-link";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { GUTTER } from "@/lib/section";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
        if (current) setActiveSection(current.target.id);
      },
      { rootMargin: "-20% 0px -58% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${GUTTER} fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)]`}>
      <nav
        aria-label="Primary navigation"
        className="nav-shell mx-auto mt-3 flex h-14 max-w-[77.5rem] items-center justify-between gap-5 px-3 sm:px-4"
      >
        <a href="#hero" className="inline-flex min-h-11 items-center font-display text-base font-medium tracking-[-0.02em]">
          P<span className="text-[var(--signal)]">/</span>Panda
          <span className="sr-only">{profile.name} — back to top</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          <AnimatedBackground
            defaultValue={activeSection || undefined}
            className="rounded-md bg-white/10"
            transition={{ type: "spring", duration: 0.42, bounce: 0.08 }}
          >
            {sections.map((section) => (
              <li key={section.id} data-id={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={activeSection === section.id ? "location" : undefined}
                  className="nav-link"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </AnimatedBackground>
        </ul>

        <ActionLink
          href={`mailto:${profile.email}`}
          variant="outline"
          className="hidden border-white/20 text-[var(--fg)] sm:inline-flex"
        >
          Email me
        </ActionLink>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open navigation"
            className="inline-flex size-11 items-center justify-center rounded-md border border-white/20 lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/65 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
            <Dialog.Popup className="fixed inset-y-0 right-0 z-50 flex w-[min(88vw,26rem)] flex-col bg-[var(--surface)] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[var(--fg)] shadow-2xl outline-none transition-transform duration-200 data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                <Dialog.Title className="font-display text-lg font-semibold">Navigate</Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="inline-flex size-11 items-center justify-center rounded-md border border-white/20"
                >
                  <X aria-hidden className="size-5" />
                </Dialog.Close>
              </div>

              <ul className="mt-8 flex flex-col">
                {sections.map((section) => (
                  <li key={section.id} className="border-b border-[var(--line)]">
                    <a
                      href={`#${section.id}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center justify-between text-xl font-semibold"
                    >
                      {section.label}
                      <span className="text-xs text-[var(--muted)]">
                        {section.n}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <ActionLink
                href={`mailto:${profile.email}`}
                variant="primary"
                className="mt-auto bg-[var(--signal)] text-black"
              >
                Start a conversation
              </ActionLink>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
