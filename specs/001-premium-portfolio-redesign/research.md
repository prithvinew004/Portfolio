# Phase 0 Research: Premium Client Portfolio Redesign

## Decision 1: Use a proof-first single-page structure

**Decision**: Keep one page, ordered as offer → selected work → capability evidence → working approach/verified experience → public activity → contact.

**Rationale**: The current page already has useful content boundaries, but real evidence appears after generic skills and placeholder work. Reordering and rewriting is smaller and clearer than adding routes before the evidence supports them.

**Alternatives considered**: Dedicated case-study pages are deferred until approved screenshots, role narratives, and outcomes justify them. A services/pricing funnel lacks verified packages. A multi-page résumé adds navigation cost without better proof.

## Decision 2: Adopt warm ivory, ink, and oxide

**Decision**: Recommend `#F2EDE3` canvas, `#FAF7F0` raised surface, `#1D1B18` text, `#625E57` muted text, `#CFC6B8` borders, and `#AD4527` oxide accent.

**Rationale**: This is the clearest break from the current black/neon developer-template look. It supports editorial hierarchy and restrained interaction. Measured contrast is 14.73:1 for text/canvas, 5.52:1 for muted text/canvas, and 4.92:1 for accent/canvas.

**Alternatives considered**: Warm editorial dark stays close to the existing category; graphite/electric is common in developer tools; navy/teal reads more enterprise; neutral/acid preserves the current stereotype.

Full comparison: [research/design-direction.md](./research/design-direction.md).

## Decision 3: Remove spectacle that delays evidence

**Decision**: Remove the preloader, WebGL hero object, custom cursor, contact globe, pinned project-card choreography, and ambient repeated effects. Keep only short reveal, navigation feedback, copy confirmation, and optional hover/focus media treatment.

**Rationale**: These effects consume client JavaScript and attention before a visitor sees real work. None is required to understand or complete the conversion journey.

**Alternatives considered**: Retuning the Three.js scene or replacing it with another generative canvas fails the same purpose test. Keeping the loader once per session still creates an artificial delay.

## Decision 4: Reuse local primitives; add no production UI dependency

**Decision**: Use existing section, button, Base UI, animation, and contribution-graph primitives. Treat researched libraries as pattern references only unless an implementation gap appears.

**Rationale**: Shadcn/Base UI already provides accessible foundations, and local equivalents cover the useful effects. Adding another runtime would duplicate behavior and complicate accessibility.

**Alternatives considered**: Magic UI Blur Fade and React Bits Split Text duplicate local code; Aceternity Link Preview adds a remote preview service; Animate UI Sheet adds an avoidable package; 21st, Cult UI, and Skiper options are template-like, gated, or insufficiently documented.

Full matrix: [research/component-research.md](./research/component-research.md).

## Decision 5: Lead with demonstrable projects, not repository recency

**Decision**: Primary case studies are GolfGives, PDFToolkit, and DevToolkit. ImageToolkit can become supporting work if its story remains distinct. MedLinkPro is eligible only as a visual implementation example after all unverifiable metrics, testimonials, availability, and business-outcome claims are removed.

**Rationale**: These projects have visible deployments and public repository evidence. Breakpoint and RemoteHire Agent are foundations/in progress. Forks, tutorials, scaffolds, and small learning exercises do not support the client proposition.

**Alternatives considered**: The newest public repository is empty; Breakpoint states product features are unimplemented; MedLinkPro's public 10k-user/rating/partner/testimonial claims are not substantiated; contribution volume is activity, not an outcome.

Full audit: [research/project-inventory.md](./research/project-inventory.md).

## Decision 6: Keep GitHub as resilient secondary evidence

**Decision**: Retain the server-only daily repository/contribution fetch with a dated local fallback, but place it after curated work and expose stale/current state.

**Rationale**: The current service protects the token, avoids per-visitor calls, validates response shape, and falls back safely. Its snapshot date and total must not masquerade as live data.

**Alternatives considered**: Removing it loses freshness evidence; browser fetching weakens resilience and privacy; repository cards are too thin to replace case studies.

## Decision 7: Add one focused browser test layer

**Decision**: Add Playwright as the only new development dependency and cover critical viewports, navigation/contact, public project destinations, overflow, console/network failures, and reduced motion.

**Rationale**: The repository currently has no tests, while the highest risks are browser behaviors. One end-to-end suite provides more value than broad unit-test scaffolding for static composition.

**Alternatives considered**: Unit tests for presentational sections are low-value; a hosted visual-regression service adds unnecessary infrastructure; manual-only QA is too easy to regress.

## Research Constraints

- Coolors stopped at Cloudflare human verification; no CAPTCHA bypass was attempted. Contrast was computed locally.
- GitHub CLI authentication is invalid, so private remote repositories were not inspected. Public sources and explicitly local worktrees were used; private content is excluded from public evidence.
- Godly redirects to Recent.Design and was treated as a current inspiration index.
- No VibeWise skill or project state exists here. These local artifacts and the final learning report preserve the checkpoints instead.
