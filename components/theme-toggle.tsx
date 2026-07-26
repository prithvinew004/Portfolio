"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// No next-themes: one class on <html> + localStorage is the whole feature.
// The FOUC-preventing script lives inline in app/layout.tsx.
export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      // It sits fixed over scrolling content, so it needs its own opaque backdrop — a transparent
      // button let card text run straight through it. Palette matches the rest of the page.
      className="rounded-full border border-[var(--hero-cream)]/15 bg-[var(--hero-deep)]/85 p-2.5 text-[var(--hero-cream)] backdrop-blur-md transition-colors hover:border-[var(--hero-amber)]/50 hover:text-[var(--hero-amber)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--hero-amber)]"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
