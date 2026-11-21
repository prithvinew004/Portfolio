# Tasks: Premium Client Portfolio Redesign

**Input**: Design documents from `specs/001-premium-portfolio-redesign/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/portfolio-ui.md`, explicit user approval

**Tests**: Playwright browser coverage is required by the specification and mission. Each implementation phase ends with a focused check before the next phase.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches independent files and has no incomplete dependency.
- **[Story]**: Maps the task to a user story in `spec.md`.
- No commit, push, pull request, deployment, or confidential disclosure is included.

## Phase 1: Setup and Approval Gate

**Purpose**: Start implementation only after the user approves this discovery package.

- [X] T001 Record explicit implementation approval and any supplied content decisions in `specs/001-premium-portfolio-redesign/research/project-inventory.md`
- [X] T002 Reconfirm a clean `research/premium-client-portfolio` worktree and compare its base with `origin/main` using Git status/log without altering tracked files
- [X] T003 Add `@playwright/test`, browser scripts, and the minimal test configuration in `package.json`, `bun.lock`, and `playwright.config.ts`
- [X] T004 Create the shared portfolio browser harness with console, failed-request, horizontal-overflow, and four-viewport helpers in `tests/portfolio.spec.ts`

---

## Phase 2: Foundational Content and Visual System

**Purpose**: Establish truthful typed data and the shared editorial system before building sections.

**⚠️ CRITICAL**: No user-story composition starts until these tasks pass lint and type checking.

- [X] T005 Replace placeholder content shapes with the Profile, Project Evidence Record, Capability Group, Experience Record, Activity Snapshot, and Contact Route constraints from `data-model.md` in `content/resume.ts`
- [X] T006 Define warm ivory/ink/oxide colors, type, spacing, geometry, focus, selection, link, and reduced-motion tokens in `app/globals.css`
- [X] T007 Simplify the global shell by removing the artificial preloader and preparing content-first fallbacks in `components/page-shell.tsx`
- [X] T008 Update page metadata copy to use only verified Profile fields in `app/layout.tsx` and `app/opengraph-image.tsx`
- [X] T009 Run `bun run lint` and `bunx tsc --noEmit`; resolve foundational failures in the files changed by T005–T008

**Checkpoint**: Typed content and global styles are usable without hero, project, or GitHub enhancements.

---

## Phase 3: User Story 1 — Understand the Offer and Take Action (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor understands the offer and can reach contact or selected work from the first viewport.

**Independent Test**: At 390×844 and 1440×900, the first viewport names Prithviraj, states the offer, and exposes working Contact and Selected Work actions with keyboard-visible focus and no loader.

### Tests for User Story 1

- [X] T010 [US1] Add first-viewport, CTA destination, heading-order, and keyboard-focus assertions to `tests/portfolio.spec.ts` and observe the pre-implementation failure

### Implementation for User Story 1

- [X] T011 [P] [US1] Rebuild the offer-led opening without WebGL, rotating roles, or decorative scroll prompts in `components/sections/hero.tsx`
- [X] T012 [P] [US1] Rebuild section navigation with equivalent desktop/mobile destinations and a focus-safe collapsed state in `components/nav.tsx`
- [X] T013 [US1] Compose the offer and navigation into the first page increment in `app/page.tsx` and `app/layout.tsx`
- [X] T014 [US1] Run the US1 Playwright cases headed at mobile and desktop widths and fix only US1 regressions in `components/sections/hero.tsx`, `components/nav.tsx`, and `app/globals.css`

**Checkpoint**: The page works as a minimal client-acquisition landing view before any case-study enhancement.

---

## Phase 4: User Story 2 — Evaluate Real Work (Priority: P1)

**Goal**: Replace all placeholder work with three evidence-backed case-study summaries and working destinations.

**Independent Test**: GolfGives, PDFToolkit, and DevToolkit each expose honest status, purpose, contribution, capability evidence, and only available public repository/live links; no link points to Contact as a substitute.

### Tests for User Story 2

- [X] T015 [US2] Add project-count, status, evidence-link, no-placeholder, and no-fake-anchor assertions to `tests/portfolio.spec.ts` and observe the expected failure

### Implementation for User Story 2

- [X] T016 [P] [US2] Capture, crop, and optimize truthful screenshots from the verified GolfGives, PDFToolkit, and DevToolkit deployments into `public/projects/` with no generated or invented product UI
- [X] T017 [US2] Populate the three featured Project Evidence Records and optional ImageToolkit supporting record in `content/resume.ts`, including explicit excluded-claim notes that never render
- [X] T018 [US2] Replace the pinned placeholder-card sequence with semantic evidence-led project articles in `components/sections/projects.tsx`
- [X] T019 [US2] Integrate project media with stable dimensions and descriptive alternative text in `components/sections/projects.tsx` and `app/globals.css`
- [X] T020 [US2] Run the US2 Playwright cases headed, open every project destination, and correct broken labels, destinations, or media behavior in `content/resume.ts` and `components/sections/projects.tsx`

**Checkpoint**: The portfolio has a credible proof section independent of skills, experience, and live GitHub data.

---

## Phase 5: User Story 3 — Judge Capability and Working Style (Priority: P2)

**Goal**: Connect capabilities to evidence and present only reconciled experience or a clearly labelled working approach.

**Independent Test**: Each capability group cites supporting projects; no broad badge wall, duplicated marquee, unsupported experience date, or testimonial shell appears.

### Tests for User Story 3

- [X] T021 [US3] Add capability-evidence, absent-testimonial, and unresolved-experience-content assertions to `tests/portfolio.spec.ts` and observe the expected failure

### Implementation for User Story 3

- [X] T022 [P] [US3] Replace technology-category cards and marquee data with outcome-led capability groups linked to project IDs in `content/resume.ts`
- [X] T023 [P] [US3] Mark every unresolved experience record `publishable: false` and add a working-approach fallback in `content/resume.ts` until the user supplies reconciled dates
- [X] T024 [US3] Rebuild capability presentation around evidence references in `components/sections/skills.tsx` and remove obsolete `components/sections/skill-card.tsx` only after caller search
- [X] T025 [US3] Rebuild `components/sections/experience.tsx` to show verified experience records or the working-approach fallback, never both by accident
- [X] T026 [US3] Remove the empty testimonial composition from `app/page.tsx` and delete `components/sections/testimonials.tsx` only after confirming no remaining caller
- [X] T027 [US3] Run lint, types, and the US3 Playwright cases; resolve only capability/experience regressions in the changed files

**Checkpoint**: Capability and working-style evidence is independently understandable without GitHub activity.

---

## Phase 6: User Story 4 — Explore Without Friction (Priority: P2)

**Goal**: Make the full page stable, responsive, keyboard/touch equivalent, and restrained under normal and reduced-motion preferences.

**Independent Test**: The complete page has no horizontal overflow, hidden actions, hover-only evidence, console errors, or motion-dependent meaning at 390×844, 768×1024, 1280×800, and 1440×900.

### Tests for User Story 4

- [X] T028 [US4] Add four-viewport overflow, reduced-motion, mobile-navigation, zoom-safe structure, and clipboard-denial assertions to `tests/portfolio.spec.ts`

### Implementation for User Story 4

- [X] T029 [P] [US4] Simplify contact into direct email, copy fallback, GitHub, and LinkedIn actions in `components/sections/contact.tsx`
- [X] T030 [P] [US4] Remove the custom cursor and smooth-scroll wrappers from `app/layout.tsx` while preserving native anchor behavior in `app/globals.css`
- [X] T031 [US4] Normalize focus, hover, active, touch, and reduced-motion states across `app/globals.css` and the retained components under `components/ui/`
- [X] T032 [US4] Run headed US4 checks at all required viewports and correct overflow or focus-order issues in `app/globals.css`, `components/nav.tsx`, and affected section files

**Checkpoint**: All primary content is usable across target devices without decorative systems.

---

## Phase 7: User Story 5 — Verify Professional Freshness (Priority: P3)

**Goal**: Keep public activity as dated secondary proof that degrades honestly.

**Independent Test**: Valid live data shows its covered-through period; unavailable data shows a saved-snapshot label and still leaves work/contact fully usable.

### Tests for User Story 5

- [X] T033 [US5] Add live/fallback disclosure, source/date, and remote-failure resilience assertions to `tests/portfolio.spec.ts`

### Implementation for User Story 5

- [X] T034 [US5] Extend Activity Snapshot output with covered-through/source metadata while preserving server-only daily fetch and fallback behavior in `lib/github.ts`
- [X] T035 [US5] Restyle and relabel public activity as secondary evidence with a visible stale snapshot state in `components/sections/github-activity.tsx` and `components/sections/repo-card.tsx`
- [X] T036 [US5] Run the US5 test in live and intercepted-failure states; correct stale/current wording in `lib/github.ts` and `components/sections/github-activity.tsx`

**Checkpoint**: GitHub improves freshness but cannot undermine the core portfolio.

---

## Phase 8: Polish and Cross-Cutting Verification

**Purpose**: Remove orphaned systems, validate the complete release candidate, and stop before external actions.

- [X] T037 Search all callers, then delete orphaned WebGL, globe, cursor, loader, pinned-card, tilt, marquee, scramble/decrypt, and duplicate animation files under `components/` without removing retained error handling or accessibility behavior
- [X] T038 Remove only dependencies proven unused after T037 from `package.json` and `bun.lock`, including Three/R3F/Drei, D3/topology, GSAP, Lenis, or cmdk when their last caller is gone
- [X] T039 [P] Update truthful structured metadata, social preview copy, and canonical values in `app/layout.tsx`, `app/opengraph-image.tsx`, and `app/icon.svg`
- [X] T040 Run `bun run lint`, `bunx tsc --noEmit`, `bun run build`, and `bunx playwright test`; record exact results in the final VibeWise-equivalent implementation report
- [X] T041 Run a visible headed Chromium review for first paint, keyboard, reduced motion, clipboard denial, live/fallback activity, every external project link, 200% zoom, and all four target viewports using `quickstart.md`
- [X] T042 Inspect `git diff --check`, `git status`, and the complete diff; verify `.vibe-wise/`, credentials, global instructions, and private evidence are absent, then stop without commit, push, PR, or deployment

---

## Dependencies and Execution Order

### Phase dependencies

- Phase 1 requires explicit user approval; no implementation task may run before T001.
- Phase 2 depends on Phase 1 and blocks all user stories.
- US1 and US2 are both P1; implement US1 first so the smallest conversion journey exists, then add proof.
- US3 depends on the project IDs created in US2.
- US4 integrates US1–US3 responsive and accessibility behavior.
- US5 can start after Phase 2 but should land after the primary proof hierarchy is stable.
- Phase 8 depends on all selected stories and performs deletion only after caller searches.

### Parallel opportunities

- T011 and T012 touch independent components after shared content/styles exist.
- T016 media capture can proceed while T015 is being drafted, but T017–T019 depend on the final evidence.
- T022 and T023 update different logical records but share `content/resume.ts`; execute sequentially in one worktree.
- T029 and T030 touch separate components/layout surfaces.
- T039 can run separately from dependency cleanup once public copy is final.

## Implementation Strategy

### Smallest useful increment

1. Complete setup and foundation.
2. Complete US1 and validate the offer/contact journey.
3. Complete US2; this is the smallest credible portfolio release candidate.
4. Add US3–US5 and cross-cutting verification.
5. Stop for review; do not publish automatically.

### Story-level validation rule

Run the focused test and a visible browser check after each story. Fix failures within that story before starting the next; do not defer known content, accessibility, console, or overflow failures to polish.

## Notes

- Every implementation item names the file or directory it affects.
- User-supplied assets and factual corrections update content tasks; they do not expand architecture.
- Missing evidence results in omission.
- No task authorizes a commit, push, pull request, deployment, or disclosure of private material.
