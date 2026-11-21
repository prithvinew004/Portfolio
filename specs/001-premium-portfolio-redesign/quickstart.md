# Validation Quickstart

## Prerequisites

- Bun 1.4.x
- Chromium installed for Playwright
- Optional `GITHUB_TOKEN` only for raising GitHub's server-side rate limit

## Install and static checks

```bash
bun install --frozen-lockfile
bun run lint
bunx tsc --noEmit
bun run build
```

Expected: every command exits successfully; the build does not require GitHub or private credentials.

## Run locally

```bash
bun run dev
```

Open `http://localhost:3000` in a headed browser.

## Automated browser checks

```bash
bunx playwright test
```

Expected coverage:

- First viewport includes offer, contact, and selected-work actions.
- Four featured work samples and four independent/supporting projects expose honest status and working destinations.
- Keyboard navigation reaches every primary action with visible focus.
- Reduced motion removes repeated/pinned motion without hiding content.
- No horizontal overflow at 390×844, 768×1024, 1280×800, or 1440×900.
- No unexpected console errors, failed same-origin requests, or broken primary links.

## Required headed review

Run the same journeys with a visible Chromium window and inspect:

1. Fresh load and first paint.
2. Desktop navigation and every case-study destination.
3. Mobile navigation, touch-equivalent interactions, and contact.
4. Keyboard-only route from top to contact.
5. Reduced-motion rendering.
6. Saved GitHub fallback with remote data unavailable.
7. 200% zoom and all four required viewports.

Use [portfolio-ui.md](./contracts/portfolio-ui.md) as the behavior contract and [data-model.md](./data-model.md) for content validation.
