Create a CLAUDE.md file with these project rules:

# Portfolio — Prithviraj Panda
- Next.js 15 App Router, TypeScript, Tailwind CSS v4, shadcn/ui on Radix
- Animation: Framer Motion for component/page animations, GSAP + ScrollTrigger
  for scroll-driven sections, Lenis for smooth scroll
- 3D: React Three Fiber + drei; Spline embeds allowed for hero scene
- Component sources: prefer Aceternity UI, Magic UI, React Bits, Animate UI,
  Skiper UI via their CLIs/registries before writing from scratch
- All animations must respect prefers-reduced-motion
- Mobile-first responsive; 3D scenes must degrade gracefully on mobile
  (static fallback or lighter scene)
- Dark theme only — the Claude Design handoff defines no light palette, so there is
  deliberately no theme toggle and no light-mode variables
- Target Lighthouse performance 90+; lazy-load all 3D below the fold
- Use next/font, next/image, dynamic imports for heavy components
- Content source of truth: content/resume.ts (never hardcode personal details in components)

## Workflow (required)
- Verify every change in a real browser with Playwright before reporting it done.
  Assert on measured values — computed styles, geometry, CLS via PerformanceObserver,
  console errors — not on screenshots or assumption alone.
- Finish every task with `npm run build`. Stop the dev server and `rm -rf .next` first:
  running a production build against a live dev server corrupts `.next` and the page
  will 500 or silently stop hydrating.
- Check the three non-default states on anything visual: mobile width, coarse pointer,
  and `prefers-reduced-motion`. Reduced motion must leave nothing hidden.
- Apply ponytail restraint (smallest thing that works; reuse `lib/section.ts`,
  `hooks/use-media-query.ts`, `Reveal`, `TiltCard`, `Marquee` before adding primitives)
  and invoke the Superpowers process skills by name rather than improvising.
