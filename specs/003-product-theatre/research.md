# Product theatre redesign — research record

Date: 2026-11-23
Scope: visual direction, interaction model, source availability, licensing, accessibility, and portfolio fit.

## Problem found in the current version

The first redesign improved organization but treated every section as similarly weighted editorial content. The result is calm and readable, yet the repeated headings, dividers, pills, and rounded cards make it feel like a document with components placed into it. The project work is present, but it does not control the page.

The new direction must do four things:

1. Make real project screenshots the largest visual material on the page.
2. Give the portfolio one memorable browsing mechanism instead of several generic grids.
3. Preserve the stacked-project hero the user preferred, at a much larger scale.
4. Use source-available components from their original libraries, not lookalikes.

## Godly / Recent reference study

Godly has moved into [Recent](https://recent.design/info). The portfolio feed and the live sites behind it were reviewed in a visible browser at desktop size, including interaction states rather than catalogue thumbnails alone.

### Harry Atkins

Source: [harryjatkins.com](https://harryjatkins.com/)

- A single oversized identity mark makes the first view recognizable before any copy is read.
- The work occupies a strict image grid while metadata stays small and peripheral.
- Regular-weight type and hairlines feel more premium than repeated bold cards.
- The screenshot or artifact is the evidence; UI chrome is secondary.

### Cathy Dolle

Source: [cathydolle.com](https://www.cathydolle.com/)

- A compact numbered project list controls a spatial, overlapping image composition.
- The interaction changes the page's visual state without navigating away.
- Images have varied scale and position, preventing the catalogue feeling of equal cards.
- Navigation is extremely quiet so the work remains dominant.

### Mike Matas

Source: [mikematas.com](https://mikematas.com/)

- Each project receives a large device or product stage rather than a thumbnail card.
- The surrounding copy is brief and low-contrast; the artifact carries the story.
- Large areas of negative space make the few elements feel deliberate.

### Dries Bos

Source: [driesbos.com](https://www.driesbos.com/)

- A project index can remain scannable while hover previews introduce rich visual evidence.
- A controlled perspective frame gives the page a signature spatial device without requiring WebGL.
- Table-like metadata works when the hover response is strong and immediate.

### Pacôme Pertant

Source: [pacomepertant.com](https://pacomepertant.com/)

- A stacked, spatial media browser is memorable because it is the composition, not decoration around it.
- The useful principle is depth and selection; the full WebGL/sound treatment is too heavy for this portfolio.

### Belen Jones, Meech213, Claudio Guglieri, and Daniel Triendl

Sources: [belenjones.com](https://www.belenjones.com/), [meech213.com](https://www.meech213.com/), [guglieri.com](https://guglieri.com/), and [danieltriendl.com](https://www.danieltriendl.com/)

- Belen Jones demonstrates scale contrast and overlapping geometry, but its deliberate visual collision would compete with product screenshots here.
- Meech213 shows the value of loose, tilted media placement. That principle belongs in the hero stack, not every section.
- Claudio Guglieri commits to one saturated field and one enormous visual object. A single signal color can create more identity than many muted surfaces.
- Daniel Triendl shows a clean visual index, but a conventional masonry gallery would return this portfolio to an equal-card catalogue.

### Godly / Recent conclusion

The shared pattern is not a particular font or color. It is hierarchy: one visual idea per viewport, huge evidence, tiny metadata, and a browsing interaction that becomes part of the identity. The redesign will use a dark product-theatre system with an electric signal color, full-width project imagery, and fewer boxed sections.

## Component library verification

### Selected: React Bits Card Swap

- Docs: [Card Swap](https://reactbits.dev/components/card-swap)
- Existing source: `components/ui/card-swap.tsx`
- Role: the hero's stacked website composition.
- Change: enlarge it, switch it to the dark stage, and integrate the active project's metadata into the hero.
- Reason: the user explicitly preferred the previous stacked-project hero; it also matches the spatial principle found in several Godly references.

### Selected: React Bits Flowing Menu

- Docs: [Flowing Menu](https://reactbits.dev/components/flowing-menu)
- Official registry: `https://reactbits.dev/r/FlowingMenu-TS-TW.json`
- Role: the primary selected-work index.
- Behavior: a liquid band travels between project rows and carries a moving marquee of real project screenshots.
- Accessibility retained from source: keyboard focus, reduced-motion handling, semantic links/buttons, and a named navigation region.
- License: MIT + Commons Clause; allowed in an application but not for resale or redistribution as a component library.

### Selected: Watermelon UI Collection Grid Disclosure

- Docs: [Collection Grid Disclosure](https://ui.watermelon.sh/animated-components/collection-grid-disclosure)
- Official registry: `https://registry.watermelon.sh/r/collection-grid-disclosure.json`
- Role: independent tools and experiments.
- Behavior: compact collection rows expand into detailed project actions using shared-layout animation.
- Adaptation: replace price-centric demo fields with truthful project status, stack, live link, and source link. Preserve the upstream disclosure/layout-animation structure while fixing button semantics and focus states.
- License: MIT.

### Retained selectively

- [Animate UI](https://animate-ui.com/) link preview and copy interaction remain useful for the contact and external-link details.
- [Kibo UI](https://www.kibo-ui.com/) contribution graph and pill primitives remain supporting elements, not compositional drivers.
- [Magic UI](https://magicui.design/) Safari frame may remain for product evidence, but Bento Grid is removed from the main story because it reinforces the card-catalogue feeling.

### Evaluated but not selected

- [21st.dev](https://21st.dev/) Portfolio Projects Showcase has an excellent persistent-media project list, but its source endpoint is account-gated. It is a reference only; no source will be copied or represented as imported.
- [Skiper UI Projects Showcase](https://skiper-ui.com/v1/skiper80) is visually relevant but requires a Pro license key. It is a reference only.
- [Aceternity UI](https://ui.aceternity.com/components) Focus Cards and Layout Grid are public, but another card grid would duplicate the selected project browser.
- [Cult UI](https://www.cult-ui.com/docs/components) Shadow Card is public, but introducing a second card language would weaken the system.
- [Magic UI Lens](https://magicui.design/docs/components/lens) is source-available, but magnification would be a novelty on already-large screenshots.
- [Uiverse](https://uiverse.io/) offers many isolated controls, but no evaluated component materially improves the portfolio's project-story structure.
- [Design Spells](https://designspells.com/) is a valuable interaction reference, not a source component library. Its best applicable lesson is to make state changes spatial and legible.
- Unicorn Studio and Spline can produce rich WebGL scenes, but a WebGL hero would add runtime weight and distract from the user's real work.
- shadcn/ui, Radix UI, Chakra UI, COSS, and Kibo UI are strong foundations; they are not, by themselves, a distinctive art direction.

## Chosen visual system

- Background: near-black ink.
- Primary text: warm white.
- Signal color: electric chartreuse used for active states, rules, and one or two large fields.
- Secondary field: cool mineral gray for quieter evidence and GitHub data.
- Type: existing Space Grotesk for readable regular-weight display and UI; Syne is limited to the name/signature rather than every heading.
- Corners: mostly square or lightly rounded; large radii only where inherited from the real component interaction.
- Motion: hover/focus selection, stacked-card movement, and shared-layout disclosure only. No continuous particle field, cursor replacement, or scroll-jacking.

## Content and accessibility constraints

- No fabricated metrics, testimonials, outcomes, or ownership claims.
- Every project remains available as ordinary text and links without hover.
- Hover-driven previews must have equivalent keyboard focus behavior.
- Reduced-motion users receive immediate state changes and no autoplay.
- Mobile replaces hover spectacle with readable rows, taps, and explicit controls.
- External links retain visible or screen-reader context that they open a new tab.
