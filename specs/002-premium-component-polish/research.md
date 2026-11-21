# Research: Premium Component Polish

## Method

Every source below was opened in a visible Chrome window with Playwright on 2026-11-21. Research focused on reusable interaction and composition ideas rather than copying source code or installing registries. Coolors was the only inaccessible source; it returned Cloudflare human verification and was not bypassed.

## Source Matrix

| Source | Access | Inspected examples | Useful signal | Decision |
|---|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com/) | 200 | Navigation Menu, Hover Card, Sheet | Compact navigation and accessible overlays | Reuse the portfolio's existing Base UI dialog; adapt only the compact nav treatment |
| [21st.dev](https://21st.dev/) | 200; some source gated | Spotlight Card, Limelight Nav, Background Paths | Pointer-local light, active-nav marker, layered hero composition | Adapt spotlight and active-state concepts locally; reject motion background and gated source |
| [Magic UI](https://magicui.design/) | 200 | Magic Card, Text Reveal, Border Beam, Dock | Media-local highlight and clear interactive affordance | Adapt a quiet local highlight; reject continuous beam, reveal, and dock |
| [Aceternity UI](https://ui.aceternity.com/) | 200 | Minimal Interactive Hero, Apple Cards Carousel, Hero Highlight, Link Preview | Large verified media can carry the hero | Use real project imagery; reject carousel, remote preview, and Framer Motion requirement |
| [Cult UI](https://cult-ui.com/) | Redirected to `www`; 200 | Shift Card, Shadow Card, Folded Card | Layered shadows can create hierarchy without extra content | Use restrained depth; do not install registry components |
| [Kibo UI](https://www.kibo-ui.com/) | 200 | Case Study, Case Studies, Image Zoom, Contact, Hero | Strong case-study rhythm and direct CTAs | Preserve current case-study hierarchy; keep direct live-site links instead of modal zoom |
| [Skiper UI](https://skiper-ui.com/) | 200; implementation not publicly inspectable | Projects Showcase, Apple Feature Block, Text Roll Nav | Premium project presentation and editorial composition | Inspiration only because source/usage was not publicly inspectable |
| [Animate UI](https://animate-ui.com/) | 200 | Base UI Tabs, Accordion, Sheet | State change should drive motion and preserve semantics | Use native CSS state transitions; reject `motion` package |
| [React Bits](https://reactbits.dev/) | 200 | Split Text, Spotlight Card, Scroll Reveal | Spotlight pattern works when tightly scoped | Adapt pointer highlight; reject GSAP/OGL/WebGL and text effects |
| [Recent.design](https://recent.design/?ref=godly) ([Godly](https://godly.website/) redirect) | Redirected; 200 | ElevenLabs cards, Brand Identity Portfolio Reel, WebGPU renderer | Rich project media, bold typography, geometric restraint | Use project cards and image fan; reject experimental WebGPU |
| [Refero](https://refero.design/) | 200; deeper examples require sign-in | Web Apps index | Dense references benefit from clear categorization | No component copied; deeper examples require sign-in |
| [Design Spells](https://www.designspells.com/) | 200 | Dia swipe-hold, Instagram super-like | Motion is strongest as state/feedback | Keep motion tied to hover, press, focus, and active section only |
| [Coolors](https://coolors.co/) | 403 human verification | Homepage | Palette comparison intended | Inaccessible due to verification; use measured local palette instead |

## Selected Patterns

### 1. Verified image fan in the hero

The best portfolio references establish quality with work, not an abstract effect. Four local screenshots become evidence links to their project sections near the headline. The layout is fanned only at large viewports and becomes a simple grid on mobile so it does not obscure content or cause overflow.

### 2. Active compact navigation

The existing anchor navigation remains. `IntersectionObserver` marks the current section and `aria-current="location"` exposes that state to assistive technology. The treatment is a quiet floating capsule, not a dock or a new navigation model.

### 3. Browser-like project media frames

Each featured project screenshot becomes a stable, direct live-site link with a small browser bar and hostname. A CSS radial highlight follows the pointer only on hover-capable fine pointers; keyboard and touch users receive the same content and link without dependence on the effect.

## Rejected Patterns

- Shaders, WebGL, canvas, parallax, and animated paths: disproportionate runtime and accessibility cost.
- Carousels and horizontal docks: hide work and change the page's straightforward reading order.
- Remote link previews: add network/privacy fragility and image-domain configuration.
- Continuous border beams and autoplay reveals: decorative motion without state meaning.
- Text splitting and custom cursors: reduce readability or platform familiarity.
- Paid or gated components whose implementation could not be inspected: unsuitable for a verifiable codebase change.

## Palette and Contrast

The existing warm editorial palette is retained rather than replaced by a trend palette. Measured WCAG contrast ratios:

| Pair | Ratio | Use |
|---|---:|---|
| `#1d1b18` ink / `#f2ede3` canvas | 14.73:1 | Primary text |
| `#625e57` muted / canvas | 5.52:1 | Secondary text |
| `#ad4527` oxide / canvas | 4.92:1 | Accent text and controls |
| `#355c5a` teal / canvas | 6.36:1 | Secondary accent |
| `#faf7f0` paper / ink | 16.06:1 | Inverse text |
| oxide / ink | 2.99:1 | Decorative only; never small text |

## Technical Decision

Use local images, Next Image, `IntersectionObserver`, pointer coordinates stored as CSS custom properties, and CSS transitions. Add no production dependency and no external data request. This is the smallest implementation that materially improves the visual hierarchy while retaining the current content model and accessibility surface.
