# Implementation Plan: Premium Component Polish

**Branch**: `research/premium-client-portfolio` | **Date**: 2026-11-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-premium-component-polish/spec.md`

## Summary

Make the existing portfolio feel more premium without replacing its editorial identity or adding ornamental runtime weight. Use verified project imagery in the opening, an active compact navigation treatment, and larger browser-like project frames with restrained pointer-aware depth. Preserve every project, claim, CTA, and external link.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 15

**Primary Dependencies**: Next.js, Tailwind CSS 4, Base UI, Lucide React; no new production dependency

**Storage**: Static TypeScript content and local images in `public/projects/`

**Testing**: Playwright browser tests, TypeScript, ESLint, Next.js production build, Lighthouse

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-page portfolio web application

**Performance Goals**: Lighthouse performance/accessibility/best-practices/SEO >= 95; CLS <= 0.02; first-load JavaScript <= 130 kB

**Constraints**: WCAG 2.1 AA contrast and keyboard behavior; reduced-motion and coarse-pointer fallbacks; no remote previews, shaders, canvas, WebGL, carousels, docks, custom cursor, or autoplay animation

**Scale/Scope**: One page, four featured projects, four additional projects, one desktop navigation, one Base UI mobile dialog

## Constitution Check

*GATE: Passed before research and re-checked after design.*

- **Evidence before ornament — PASS**: the polish is built from the portfolio's real screenshots and verified links.
- **Accessibility is product quality — PASS**: links remain semantic; active state has `aria-current`; keyboard, zoom, touch, focus, and reduced motion are explicit verification targets.
- **Performance is a feature — PASS**: local images, CSS transitions, and existing dependencies only; no shader, animation, preview, or carousel library.
- **Smallest complete change — PASS**: one small media component plus focused edits to Hero, Nav, Projects, global CSS, and Playwright coverage.
- **Truthful content — PASS**: no testimonials, metrics, employers, capabilities, or project outcomes are invented.
- **Reversible delivery — PASS**: all changes remain local and uncommitted; no deployment or external write is part of this plan.

## Project Structure

### Documentation (this feature)

```text
specs/002-premium-component-polish/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── portfolio-polish-ui.md
├── checklists/
│   ├── requirements.md
│   └── ux.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
└── globals.css
components/
├── nav.tsx
├── sections/
│   ├── hero.tsx
│   └── projects.tsx
└── ui/
    └── project-media.tsx
content/
└── resume.ts
public/
└── projects/
tests/
└── portfolio.spec.ts
```

**Structure Decision**: Preserve the existing Next.js app structure. Add only the reusable project media frame because the same browser-like behavior is needed four times; keep the hero composition and navigation logic in their current components.

## Design and Implementation Approach

1. Render the four featured project screenshots as compact evidence links to their project sections. On desktop they form a restrained image fan; on mobile they collapse into a stable strip.
2. Keep the existing navigation and Base UI mobile dialog. Add active-section state with `IntersectionObserver` and style the desktop bar as a compact floating capsule.
3. Replace the passive featured-project screenshot wrapper with one direct live-site media link. Add a browser chrome line, stable aspect ratio, local-image fallback behavior, and a cosmetic radial highlight on fine pointers.
4. Centralize only the new depth, timing, and pointer/reduced-motion behavior in global CSS.
5. Extend Playwright coverage first, then implement until the contract passes.

## Complexity Tracking

No constitution violations. No complexity exception is required.
