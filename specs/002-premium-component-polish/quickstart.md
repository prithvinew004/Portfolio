# Quickstart: Premium Component Polish

## Automated verification

```bash
bun run lint
bunx tsc --noEmit
bun run build
bunx playwright test
```

The Playwright configuration starts the production build on its configured local port. Build before the browser suite so tests exercise the current source.

## Visible browser review

Run the Playwright checks in headed Chrome and inspect:

1. 1440x900 desktop opening, active navigation, project frames, and contact.
2. 768x1024 tablet layout and reading order.
3. 390x844 mobile opening CTAs, project image stability, and Base UI menu keyboard flow.
4. Reduced-motion behavior and coarse-pointer/touch behavior.
5. 200% browser zoom, focus visibility, and absence of horizontal overflow.

## Performance review

Run Lighthouse against the production server and verify all categories remain at least 95, CLS is at most 0.02, and first-load JavaScript remains within 130 kB.

## Research comparison

Compare the final result to [research.md](./research.md): it should express verified project media, active navigation, and restrained depth—not reproduce a library demo or introduce rejected effects.
