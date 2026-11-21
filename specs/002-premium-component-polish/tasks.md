# Tasks: Premium Component Polish

**Input**: Design documents from `/specs/002-premium-component-polish/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`

**Tests**: Browser tests are required by the specification and are written before each implementation slice.

**Organization**: Tasks are grouped by user story and executed sequentially because the shared one-page browser suite covers the integrated reading flow.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run independently in a different file
- **[Story]**: User story traceability
- Every task includes the exact file or command surface it changes or verifies

## Phase 1: Setup and Research

**Purpose**: Preserve the current redesign, document research decisions, and establish the implementation boundary.

- [X] T001 Record every inspected, redirected, gated, inaccessible, adapted, and rejected source in `specs/002-premium-component-polish/research.md`
- [X] T002 Verify the current dirty worktree, existing portfolio content, public screenshots, dependencies, and browser tests without discarding prior work
- [X] T003 Confirm `.vibe-wise/` is locally excluded when present and keep learning/spec artifacts local-only

---

## Phase 2: Foundational Test Contract

**Purpose**: Convert the approved UI contract into failing browser assertions before implementation.

- [X] T004 Add failing opening evidence, first-viewport CTA, project-media, active-navigation, reduced-motion, and overflow assertions in `tests/portfolio.spec.ts`
- [X] T005 Build the pre-change application and run the focused Playwright contract to confirm the new assertions fail for the intended missing behavior

**Checkpoint**: Browser contract proves the premium components are not already present.

---

## Phase 3: User Story 1 — Premium, credible opening (Priority: P1) 🎯 MVP

**Goal**: Pair the existing offer and actions with four verified project screenshots without losing the mobile first viewport.

**Independent Test**: At desktop and mobile widths, four named hero evidence links are visible/reachable, target matching project anchors, and both existing CTAs remain within the opening viewport.

- [X] T006 [US1] Add verified project evidence links and stable local images to `components/sections/hero.tsx`
- [X] T007 [US1] Add responsive evidence-grid/image-fan layout, focus state, and reduced-motion fallback to `app/globals.css`
- [X] T008 [US1] Run the opening Playwright assertions in headed Chrome at 1440×900 and 390×844

**Checkpoint**: User Story 1 works without project-frame or navigation enhancement.

---

## Phase 4: User Story 2 — Premium selected-work media (Priority: P1)

**Goal**: Turn each featured screenshot into a stable, browser-like direct live-site frame with restrained optional pointer feedback.

**Independent Test**: All four media frames expose their title, hostname, live URL, keyboard focus, stable geometry, and content-equivalent touch/reduced-motion experience.

- [X] T009 [US2] Implement the minimal pointer-aware `ProjectMedia` component in `components/ui/project-media.tsx`
- [X] T010 [US2] Integrate four direct live media frames and matching section IDs in `components/sections/projects.tsx`
- [X] T011 [US2] Add stable frame, browser bar, fine-pointer spotlight, focus, press, and reduced-motion styles to `app/globals.css`
- [X] T012 [US2] Run the featured-media Playwright assertions in headed Chrome with keyboard, touch/coarse-pointer, and reduced-motion contexts

**Checkpoint**: User Stories 1 and 2 independently preserve content and destinations.

---

## Phase 5: User Story 3 — Active compact navigation (Priority: P2)

**Goal**: Add orientation to the existing navigation without changing anchor or mobile-dialog behavior.

**Independent Test**: Scrolling labelled sections exposes one `aria-current="location"` item, anchors still navigate natively, and the mobile dialog retains Escape/focus behavior.

- [X] T013 [US3] Add deterministic `IntersectionObserver` section state and `aria-current` to `components/nav.tsx`
- [X] T014 [US3] Add compact floating navigation, active marker, focus, and press styles to `app/globals.css`
- [X] T015 [US3] Run the navigation Playwright assertions in headed Chrome across direct anchors, scrolling, keyboard use, and the mobile dialog

**Checkpoint**: User Story 3 enhances orientation while remaining non-blocking enhancement.

---

## Phase 6: User Story 4 — Polish without friction (Priority: P2)

**Goal**: Verify the complete premium pass across required inputs, viewports, accessibility, and failure-safe behavior.

**Independent Test**: The full browser suite passes with no overflow, serious accessibility violation, runtime error, broken internal anchor, or lost reduced-motion/touch content.

- [X] T016 [US4] Complete responsive, zoom, reduced-motion, coarse-pointer, focus-visible, accessibility, runtime, and link coverage in `tests/portfolio.spec.ts`
- [X] T017 [US4] Tune shared depth/motion tokens and fallback rules in `app/globals.css` only where a failing contract requires it
- [X] T018 [US4] Run the complete Playwright suite in headed Chrome at 390×844, 768×1024, 1280×800, and 1440×900 plus 200% zoom

**Checkpoint**: All four user stories satisfy the UI contract together.

---

## Phase 7: Verification and Handoff

**Purpose**: Prove code quality, performance, and scope discipline without external writes.

- [X] T019 Run `bun run lint`, `bunx tsc --noEmit`, and `bun run build`
- [X] T020 Run the production Playwright suite and inspect the final desktop and mobile screenshots in visible Chrome
- [X] T021 Run mobile Lighthouse and record category scores, CLS, and homepage first-load JavaScript
- [X] T022 Compare the final result against `specs/002-premium-component-polish/research.md`, inspect the final diff, and verify no new dependency, fabricated claim, private note, commit, push, publish, or deployment was introduced

---

## Dependencies and Execution Order

- Phase 1 precedes all implementation.
- Phase 2 establishes the red browser contract and blocks UI edits.
- User Story 1 and User Story 2 are both P1; execute US1 then US2 because the hero links depend on project section IDs.
- User Story 3 depends only on the existing section IDs but follows P1 proof surfaces.
- User Story 4 and final verification depend on all component slices.
- Tasks are intentionally sequential: `hero.tsx`, `projects.tsx`, `nav.tsx`, `globals.css`, and one browser spec form a small integrated change, so parallel edits would add coordination cost.

## Implementation Strategy

The smallest complete delivery is the three selected patterns: hero evidence, browser-like project media, and active compact navigation. No library package is installed. The first failing contract is retained and expanded into the final regression suite. Stop if a requirement would require a new claim, remote preview, generated asset, or external write.
