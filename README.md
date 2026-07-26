# Portfolio — Prithviraj Panda

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · GSAP · Framer Motion · React Three Fiber

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Content

All copy lives in [`content/resume.ts`](content/resume.ts) — nothing personal is hardcoded in a
component. Content came from the Claude Design handoff (`Prithviraj Portfolio.dc.html`).

Still needs your input:

- **Experience dates don't reconcile.** DigiFrills reads `Oct 2024 — Present`, but LOMAA
  (`Oct — Dec 2025`) and Navachis (`Jun — Oct 2025`) both fall inside that range.
- **Projects are generic.** "SaaS MVP" / "REST API Platform" / "Cross-Platform App" have no repo
  or live links, and each card's image band is a placeholder caption.

## Deploying to Vercel

Zero config — Vercel detects Next.js and needs no `vercel.json`.

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Deploy. `VERCEL_PROJECT_PRODUCTION_URL` is injected automatically, so OG tags resolve to
   absolute URLs on the preview and production domains without any setup.
4. Once a custom domain is attached, set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so canonical
   and OG URLs point at the real domain rather than the `.vercel.app` one.

Social preview image is generated at build time by [`app/opengraph-image.tsx`](app/opengraph-image.tsx);
the favicon is [`app/icon.svg`](app/icon.svg).

## Notes worth knowing before editing

- **three.js is dynamically imported and never server-rendered.** It loads only on a wide viewport
  with a fine pointer and motion enabled — mobile and reduced-motion visitors download none of its
  ~940 kB and get a static gradient instead.
- **Motion is opt-out everywhere.** `useReducedMotion` in `hooks/use-media-query.ts` is
  `useSyncExternalStore`-based so it can't cause hydration mismatches. Under reduced motion the page
  runs zero animations and nothing is left hidden.
- **Lenis and ScrollTrigger share a clock** via the bridge in `components/animations/smooth-scroll.tsx`.
  Removing it desyncs every scroll-driven animation.
- **Dark only.** The design defines no light palette, so there is no theme toggle and no
  light-mode variables — don't reintroduce half of one.
- Section rhythm (gutter, vertical padding, content measure) comes from `lib/section.ts`.
- Three colour values deviate from the design on purpose, each marked in the source: the About
  reveal's resting opacity, `--dim`, and the small-text uses of `--dim`. All three failed WCAG
  contrast at the designed values.
