// Server component on purpose: `new Date()` inside a client component can disagree with the
// build-time SSG render at a year boundary and fail hydration.
import { profile } from "@/content/resume";

export function Footer() {
  return (
    <footer className="border-t border-[var(--hero-cream)]/10 bg-[var(--hero-void)] px-6 py-10 text-[var(--hero-cream)] sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--hero-sage)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Built with Next.js · Three.js · GSAP</p>
      </div>
    </footer>
  );
}
