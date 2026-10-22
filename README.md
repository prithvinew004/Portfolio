# Prithviraj Panda — Portfolio

Personal portfolio: a single scroll-driven page with an interactive particle hero, a live GitHub activity section, and a draggable contact globe.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger, Lenis, and React Three Fiber.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run github:refresh` | Regenerate the GitHub fallback snapshot (see below) |

## Project layout

```
app/            Layout, page, global styles, favicon and Open Graph image
components/
  animations/   Reveal, scramble and decrypt text, section curtain, smooth scroll, cursor
  sections/     Hero, About, Skills, Experience, Projects, Testimonials, GitHub activity, Contact
  three/        Hero particle scene (React Three Fiber)
  ui/           Primitives: marquee, tilt card, magnetic button, globe, copy-email, word rotate
content/        resume.ts (all copy) and github-fallback.json
hooks/          Media query, reduced motion and cursor glow hooks
lib/            Section rhythm constants, GitHub fetcher, cn()
scripts/        refresh-github-fallback.mjs
```

## Content

All copy — name, bio, skills, experience, projects, socials and section order — lives in [`content/resume.ts`](content/resume.ts). Components never hardcode personal details, so editing that one file updates the whole site.

- `profile.photo`: path under `public/` for the About portrait. Leave it empty and the portrait is hidden.
- `testimonials`: add entries to enable the "Kind words" section. While empty, the section and its nav entry don't render.
- `github.repos`: which repositories get cards in the Activity section.

### GitHub activity

The Activity section fetches the contribution graph and repo cards from the GitHub API on the server, revalidated once a day. If those requests fail it falls back to [`content/github-fallback.json`](content/github-fallback.json). Refresh that snapshot with:

```bash
npm run github:refresh
```

## Environment variables

Both are optional. Copy `.env.example` to `.env.local` if you need either.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical and Open Graph base URL once a custom domain is attached. Falls back to `VERCEL_PROJECT_PRODUCTION_URL`, then localhost. |
| `GITHUB_TOKEN` | Raises the GitHub API rate limit for the Activity section. Read on the server only; never shipped to the browser. |

## Deploying

Zero config on Vercel: import the repo at [vercel.com/new](https://vercel.com/new) and deploy. `VERCEL_PROJECT_PRODUCTION_URL` is injected automatically, so social preview tags resolve to absolute URLs without setup. Set `NEXT_PUBLIC_SITE_URL` once a custom domain is attached.

## Design notes

- Dark theme only. The design defines no light palette, so there is no theme toggle.
- Every animation respects `prefers-reduced-motion`. Under reduced motion nothing is left hidden.
- The three.js hero scene is dynamically imported and only loads on wide viewports with a fine pointer and motion enabled. Mobile and reduced-motion visitors get a static gradient and download none of it.
- Lenis and ScrollTrigger share one clock via `components/animations/smooth-scroll.tsx`.
- Section spacing (gutter, vertical padding, content measure) comes from `lib/section.ts`.
