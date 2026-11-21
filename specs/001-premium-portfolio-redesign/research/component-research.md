# Component and Pattern Research

Research was performed on 2026-11-21 in a visible headed Chromium session. The objective was to identify one useful pattern per source, not to accumulate libraries.

## Selection matrix

| Source | Pattern inspected | Behavior and fit | Dependency / compatibility | Accessibility and performance | Decision |
|---|---|---|---|---|---|
| [shadcn/ui](https://ui.shadcn.com/) | [Base UI Sheet](https://ui.shadcn.com/docs/components/base/sheet) | Accessible off-canvas navigation pattern suitable for mobile. | Supports Base UI, which is already installed; Bun installation is documented. | Primitive handles dialog semantics and focus when used correctly. A simple in-page menu may still be smaller. | **Pattern shortlisted**. Use existing Base UI only if collapsed navigation needs a focus trap; do not install a second primitive system. |
| [21st.dev](https://21st.dev/community/components) | [Interactive Image Accordion](https://21st.dev/@minhxthanh/components/interactive-image-accordion) | Strong visual browsing, but hides project detail behind interaction and resembles a showcase template. | Community component; dependency and quality vary by author. | Live demo exists, but accessible naming, keyboard behavior, and reduced-motion guarantees were not clear from the catalogue page. | **Reject** for primary work. Evidence must not be hover-dependent. |
| [Magic UI](https://magicui.design/) | [Blur Fade](https://magicui.design/docs/components/blur-fade) | Short in-view reveal could support section rhythm. | Motion dependency; shadcn registry and Bun command documented. | Reasonable when brief and disabled for reduced motion. | **Reject dependency**. Existing `Reveal`/`BlurWords` cover the behavior. |
| [Aceternity UI](https://ui.aceternity.com/) | [Link Preview](https://ui.aceternity.com/components/link-preview) | Previewing a project destination on focus/hover can add context. | Tailwind, Framer Motion, shadcn CLI, and Microlink remote image service. | Remote preview adds privacy, latency, availability, and hover/touch concerns. | **Reject implementation**. If preview is useful, use local verified screenshots with visible links. |
| [Cult UI](https://www.cult-ui.com/) | [Shift Card](https://www.cult-ui.com/docs/components/shift-card) | Animated card layers feel polished but prioritize effect over project narrative. | MIT shadcn registry; Bun install path documented. | Extra transforms and hidden layers need careful focus/touch handling. | **Reject**. Use semantic project articles with restrained media movement. |
| [Kibo UI](https://www.kibo-ui.com/) | [Case Study block](https://www.kibo-ui.com/blocks/case-study) | Useful long-form structure: narrative heading, prose, facts, and destinations. | Kibo/shadcn patterns; the repo already uses Kibo's contribution graph. | Semantic prose is cheap and accessible; no special runtime needed. | **Adopt as information-architecture reference**, implemented locally rather than importing a block. |
| [Skiper UI](https://skiper-ui.com/) | Image reveal / hover collection | Several visually relevant project reveals exist, but desirable examples are in the paid catalogue. | Premium access listed at $129 during research. | Could not inspect implementation/a11y of gated examples. | **Reject** without purchase and source review. |
| [Animate UI](https://animate-ui.com/docs/primitives) | [Base UI Sheet](https://animate-ui.com/docs/primitives/base-ui/sheet) | Animated mobile drawer with accessible primitive foundation. | Documented install adds `@animate-ui/react` and `motion`; current repo uses `framer-motion`, not that package. | Good primitive basis, but dependency duplication is unnecessary. | **Reject package; retain pattern** using installed Base UI if needed. |
| [React Bits](https://reactbits.dev/) | [Split Text](https://reactbits.dev/text-animations/split-text) | Character/word/line entrance and hover effects. | GSAP and `@gsap/react`, already installed today. | Documentation exposed many animation options but did not make reduced-motion behavior prominent. | **Reject**. Existing hero already duplicates it, and the redesign needs less text choreography. |

## Design-reference sites

| Source | What was useful | Application |
|---|---|---|
| [Recent.Design](https://recent.design/?ref=godly) | Godly currently redirects here. Current categories cover web, interface, branding, and motion references. | Use only for broad composition references; do not copy a landing-page template. |
| [Refero](https://refero.design/) | Organizes screens by page type, flows, patterns, and UI elements. Deeper exploration can require sign-in. | Validate information architecture: product/landing, about, contact, testimonial, card, and navigation patterns. |
| [Design Spells](https://designspells.com/) | Documents small, purposeful state transitions such as a date highlight morphing into search. | Prefer one continuous, meaningful state change over ambient motion across every section. |
| [Coolors](https://coolors.co/) | Palette exploration target. | Blocked by Cloudflare human verification; no CAPTCHA bypass. Candidate palettes were calculated and contrast-checked locally instead. |

## Chosen component strategy

1. Semantic local project articles inspired by Kibo's case-study hierarchy.
2. Existing Base UI only if mobile navigation requires dialog behavior.
3. Existing short reveal and copy feedback, with reduced-motion fallbacks.
4. Local, verified screenshots instead of remote link previews.
5. No new production UI or animation dependency.

## Library-level risk notes

- Community catalogues are inspiration sources, not automatic quality guarantees.
- Registry installation can silently add packages and styles that conflict with Tailwind 4 or the existing Base UI setup; no registry command should run without reviewing its output.
- Framer Motion and GSAP currently overlap. The proposed page can use one small motion system and delete the rest after caller checks.
- Remote preview/image services are inappropriate for portfolio evidence because their failure changes what the visitor can verify.
