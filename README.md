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
component. Anything still reading `PLACEHOLDER` needs replacing:

- `profile.role`, `profile.tagline`, `profile.about`, `profile.location`
- every `projects[]` entry (titles, summaries, repo URLs)
- every `experience[]` role, date and bullet (company names are real)
- `skills[]` — inferred from the roles, not from a resume

`content/logos.ts` holds monochrome brand paths extracted from
[simple-icons](https://simpleicons.org) (CC0); logos remain trademarks of their owners.

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
- **The pinned Experience section uses `pinType: "transform"`.** The default `position: fixed` pin is
  counted by Chrome as a full-viewport layout shift each time it engages.
- Section rhythm (padding, container, label style) comes from `lib/section.ts`. Use it for new
  sections so they stay aligned with the rest.
