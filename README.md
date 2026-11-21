# Prithviraj Panda — Portfolio

Personal portfolio: a warm, editorial single-page site centered on public work, evidence-linked capabilities, and direct contact.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Base UI, and Bun.

## Getting started

```bash
bun install
bun run dev      # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | ESLint |
| `bun run test:e2e` | Playwright browser suite |
| `bun run github:refresh` | Regenerate the GitHub fallback snapshot (see below) |

## Project layout

```
app/            Layout, page, global styles, favicon and Open Graph image
components/
  sections/     Hero, Projects, Skills, Experience, GitHub activity and Contact
  ui/           Section label and copy-email interaction
content/        resume.ts (all copy) and github-fallback.json
lib/            Section rhythm constants, GitHub fetcher, cn()
scripts/        refresh-github-fallback.mjs
tests/          Playwright accessibility, responsive and journey coverage
```

## Content

All copy — name, bio, skills, experience, projects, socials and section order — lives in [`content/resume.ts`](content/resume.ts). Components never hardcode personal details, so editing that one file updates the whole site.

- `github.repos`: which repositories get cards in the Activity section.

### GitHub activity

The Activity section fetches the contribution graph and repo cards from the GitHub API on the server, revalidated once a day. If those requests fail it falls back to [`content/github-fallback.json`](content/github-fallback.json). Refresh that snapshot with:

```bash
bun run github:refresh
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

- Warm ivory, ink, and oxide tokens keep the interface readable without a theme toggle.
- Motion is limited to a restrained contribution-graph entrance and is disabled by `prefers-reduced-motion`.
- Project claims and screenshots are limited to public, verifiable evidence.
- Section spacing (gutter, vertical padding, content measure) comes from `lib/section.ts`.
