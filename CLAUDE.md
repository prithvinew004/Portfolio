# Portfolio — Prithviraj Panda
- Next.js 15 App Router, TypeScript, Tailwind CSS v4, Base UI, and Bun
- Prefer semantic server components; use client components only for direct interaction
- All animations must respect prefers-reduced-motion
- Mobile-first responsive with no horizontal document overflow
- Graphite/blue visual system; no theme toggle
- Target Lighthouse performance 90+
- Use next/font and next/image for stable media and typography
- Content source of truth: content/resume.ts (never hardcode personal details in components)

## Workflow (required)
- Verify every change in a real browser with Playwright before reporting it done.
  Assert on measured values — computed styles, geometry, CLS via PerformanceObserver,
  console errors — not on screenshots or assumption alone.
- Finish release work with `bun run build` and the Playwright suite.
- Check the three non-default states on anything visual: mobile width, coarse pointer,
  and `prefers-reduced-motion`. Reduced motion must leave nothing hidden.
- Apply ponytail restraint: reuse `lib/section.ts` and the existing semantic patterns
  before adding primitives or dependencies.
