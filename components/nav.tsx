"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile, sections } from "@/content/resume";
import { CONTENT, GUTTER } from "@/lib/section";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const elements = ["hero", ...sections.map(({ id }) => id)]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    let frame = 0;
    function update() {
      frame = 0;
      const marker = Math.min(window.innerHeight * 0.35, 180);
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? elements.at(-1)
        : elements.reduce<HTMLElement | undefined>((active, element) =>
            element.getBoundingClientRect().top <= marker ? element : active, undefined);
      setActiveSection(current?.id ?? "hero");
      setScrolled(window.scrollY > 12);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header data-scrolled={scrolled} className={`nav-shell ${GUTTER} fixed inset-x-0 top-0 z-50`}>
      <nav
        aria-label="Primary navigation"
        className={`${CONTENT} mx-auto flex h-16 items-center justify-between gap-3`}
      >
        <a href="#hero" aria-current={activeSection === "hero" ? "location" : undefined} className="inline-flex min-h-11 shrink-0 items-center gap-2.5 font-semibold">
          <span className="grid size-8 place-items-center rounded-md border border-[var(--line)] font-mono text-xs">PP</span>{" "}
          <span className="sr-only text-sm sm:not-sr-only">{profile.name}</span>
          <span className="sr-only"> — Home</span>
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
          href={profile.bookingUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-link hidden min-h-11 items-center gap-2 text-sm font-medium lg:inline-flex"
        >
          Let&apos;s talk
          <ArrowUpRight aria-hidden className="size-3.5" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open navigation"
            className="inline-flex size-11 items-center justify-center rounded-md border border-[var(--line)] lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-[60] bg-black/65 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 transition-opacity" />
            <Dialog.Popup className="fixed inset-y-0 right-0 z-[61] flex w-[min(88vw,26rem)] flex-col overflow-y-auto border-l border-[var(--line)] bg-[var(--surface)] p-6 outline-none data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full transition-transform">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-5">
                <Dialog.Title className="font-display text-lg font-bold">Navigate</Dialog.Title>
                <Dialog.Close
                  aria-label="Close navigation"
                  className="inline-flex size-11 items-center justify-center rounded-md border border-[var(--line)]"
                >
                  <X aria-hidden className="size-5" />
                </Dialog.Close>
              </div>

              <ul className="my-5 flex flex-col">
                {sections.map((section) => (
                  <li key={section.id} className="border-b border-[var(--line)]">
                    <a
                      href={`#${section.id}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 items-center justify-between text-lg font-medium"
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
                href={profile.bookingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="button button-primary mt-auto"
                onClick={() => setOpen(false)}
              >
                Start a conversation
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </header>
  );
}
