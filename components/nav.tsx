"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { profile, sections } from "@/content/resume";
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
      { rootMargin: "-22% 0px -68% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`${GUTTER} fixed inset-x-0 top-0 z-50`}>
      <nav
        aria-label="Primary navigation"
        className="nav-shell mx-auto mt-3 flex h-14 max-w-[72rem] items-center justify-between gap-5 px-3 sm:px-4"
      >
        <a href="#hero" className="font-display text-lg font-extrabold tracking-[-0.04em]">
          PP<span className="text-[var(--accent)]">.</span>
          <span className="sr-only">{profile.name} — back to top</span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={activeSection === section.id ? "location" : undefined}
                className="nav-link"
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`mailto:${profile.email}`}
          className="hidden min-h-11 items-center rounded-full border border-[var(--fg)] px-5 text-sm font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:inline-flex"
        >
          Let&apos;s talk
        </a>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open navigation"
            className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--fg)] lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-[60] bg-[var(--fg)]/25 backdrop-blur-sm data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity" />
            <Dialog.Popup className="fixed inset-y-0 right-0 z-[61] flex w-[min(88vw,26rem)] flex-col bg-[var(--surface)] p-6 shadow-[-24px_0_80px_rgba(29,27,24,0.18)] outline-none data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full transition-transform">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                <Dialog.Title className="font-display text-lg font-bold">Navigate</Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--fg)]"
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
                      <span className="text-xs tracking-[0.16em] text-[var(--muted)]">
                        {section.n}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${profile.email}`}
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--fg)] px-6 text-[var(--surface)]"
              >
                Start a conversation
              </a>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
