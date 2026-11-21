# Implementation Plan: Premium Client Portfolio Redesign

**Branch**: `research/premium-client-portfolio` | **Date**: 2026-11-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-premium-portfolio-redesign/spec.md`

## Summary

Reframe the current effect-heavy one-page portfolio as a proof-first client acquisition page. Keep the existing Next.js application and content boundary, replace the 3D hero and placeholder case studies with a concise offer and verified project evidence, adopt a warm ivory/ink/oxide editorial system, reduce motion and client JavaScript, preserve the resilient server-side GitHub feed, and add focused end-to-end validation.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 15.5 App Router

**Primary Dependencies**: Tailwind CSS 4, existing Base UI primitives, Framer Motion for the few retained reveals, Kibo contribution graph, `next/font`, `next/image`; no new production dependency planned

**Storage**: Static typed content in `content/resume.ts`, committed project media in `public/`, existing dated GitHub fallback JSON; no database

**Testing**: ESLint, TypeScript compiler, Next.js production build, and one small Playwright end-to-end suite added as a development dependency

**Target Platform**: Modern evergreen browsers on mobile, tablet, laptop, and wide desktop; content-first fallback when enhancement fails

**Project Type**: Single Next.js web application

**Performance Goals**: Remove WebGL and preloader from the first experience; avoid layout shift from project media; keep non-essential animation off the critical path; target 90+ mobile Lighthouse performance when the local test environment is stable

**Constraints**: WCAG 2.1 AA, reduced motion, keyboard and touch parity, no fabricated evidence, no confidential material, Bun-only project commands, no commit/push/deploy without approval

**Scale/Scope**: One public page, four user-authorized featured work samples, four compact independent/supporting projects, one direct contact route, one public activity feed, four representative test viewports

## Constitution Check

*GATE: Passed before Phase 0 and re-checked after Phase 1.*

| Principle | Pre-research gate | Post-design result |
|---|---|---|
| Evidence Before Claims | Every proposed case study needs a public repository, working deployment, or user-supplied evidence. | Passed. Project inventory classifies all 20 public repositories and excludes unsupported claims, forks, tutorials, scaffolds, and in-progress foundations from primary work. |
| Editorial Restraint Serves Conversion | The offer and proof must precede decorative interaction. | Passed. The information architecture places offer, selected work, capability evidence, approach, activity, and contact in that order; WebGL, preloader, and decorative scene are removed. |
| Accessible, Responsive, Fast by Default | Core content must work without animation or live services. | Passed. Static project evidence and direct contact remain independent of GitHub, canvas, clipboard, and animation; keyboard, touch, reduced motion, and overflow checks are contractual. |
| Preserve the Smallest Sound Architecture | Reuse the current app and installed primitives. | Passed. No new production library is selected; existing content, sections, Base UI, Next metadata/image/font features, and GitHub service are adapted. |
| Verified Delivery Under Explicit Control | Complete artifacts and validation before release actions. | Passed. Plan includes lint, types, build, Playwright, headed browser review, broken-link checks, and an explicit approval gate before implementation or external Git actions. |

No constitution exception is required.

## Project Structure

### Documentation (this feature)

```text
specs/001-premium-portfolio-redesign/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/portfolio-ui.md
├── research/
│   ├── component-research.md
│   ├── design-direction.md
│   └── project-inventory.md
├── checklists/requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── globals.css                 # editorial tokens, base states, reduced motion
├── layout.tsx                  # fonts, metadata, shell simplification
├── opengraph-image.tsx         # truthful social preview
└── page.tsx                    # proof-first section order

components/
├── animations/                # retain only purposeful reveal/scroll helpers
├── sections/
│   ├── hero.tsx               # offer, proof cue, actions; no WebGL
│   ├── projects.tsx           # real case-study summaries and media
│   ├── skills.tsx             # outcome-led capability evidence
│   ├── experience.tsx         # verified entries only
│   ├── github-activity.tsx    # secondary dated public evidence
│   └── contact.tsx            # direct low-friction conversion
├── ui/                        # existing buttons, labels, and focus-safe primitives
├── nav.tsx                    # responsive section navigation
└── page-shell.tsx             # remove artificial loader

content/
├── resume.ts                  # verified profile, project, capability, and link records
└── github-fallback.json       # dated resilient activity snapshot

lib/
├── github.ts                  # existing server-only daily feed and fallback
└── section.ts                 # layout constants

public/projects/               # captured evidence from verified live deployments
tests/portfolio.spec.ts        # key flows, viewport, link, console, motion checks
playwright.config.ts
package.json
bun.lock
```

**Structure Decision**: Keep the current single-application structure and typed content source. The redesign is a page/content refactor, not a new service or routing architecture. Delete unused effect components and dependencies only after caller searches show they are orphaned.

## Delivery Approach

1. Lock truthful content and asset permissions before visual coding.
2. Replace global tokens and the page shell, then verify basic rendering and contrast.
3. Rebuild the hero and navigation around the offer and primary contact action.
4. Replace placeholder work with four user-authorized featured work samples and captured deployment media, then retain verified independent products as supporting evidence.
5. Reframe capabilities and experience; omit anything unresolved.
6. Restyle the activity and contact sections without changing the resilient server data boundary.
7. Remove orphaned 3D, globe, cursor, loader, pinned-card, and duplicate animation code plus unused dependencies.
8. Add focused Playwright coverage and complete headed browser verification at all target widths.

## Complexity Tracking

No constitution violations or architectural exceptions.
