# Design Audit and Direction

## What is currently in the portfolio

The current site is a dark, single-page Next.js portfolio with a fixed section navigation and command palette. Its sequence is Hero, About, Skills, Experience, Projects, an empty/hidden Testimonials section, GitHub Activity, and Contact.

### Existing strengths worth preserving

- One typed content file drives profile, navigation, skills, experience, work, testimonials, and social links.
- Resume, portrait, and testimonials correctly disappear when missing instead of rendering broken or invented content.
- The GitHub service is server-only, caches daily, validates payload shape, and falls back instead of breaking the page.
- Reduced-motion checks already exist in several animation paths.
- Metadata, canonical URL, Open Graph image generation, focus styles, external-link safety, and a readable copy-email fallback are present.
- Navigation and command palette derive from the same section list, reducing drift.

### Current weaknesses

- The hero spends its strongest visual emphasis on a metallic WebGL object the user dislikes, then adds a loader, custom cursor, letter-weight interaction, glow sweep, rotating roles, gradient drift, and scroll prompt before proving any work.
- The three featured projects are generic placeholders. Their screenshots are text placeholders and every “Case study” points to Contact.
- Skills are broad category cards and a marquee rather than evidence linked to projects.
- Experience copy presents overlapping dates and claims that the source itself marks unresolved.
- The empty testimonials section is safely hidden, but it contributes no trust until real quotes exist.
- The GitHub fallback represents a dated snapshot but the current UI does not make staleness sufficiently prominent.
- The contact globe is attractive decoration but adds D3/topology code without making contact easier.
- The loader references undefined `--hero-void`, `--hero-sage`, `--hero-cream`, and `--hero-amber` tokens.
- The page uses three animation/rendering systems—Framer Motion, GSAP, and Three.js—plus Lenis, a custom cursor, and many CSS effects for one content page.

## Recommended information architecture

1. **Offer**: name, product-focused positioning, direct email action, selected-work action, one small evidence cue.
2. **Selected work**: three real case-study articles, each showing status, purpose, contribution, proof links, and verified media.
3. **Capabilities**: three outcome-led groups tied to the featured projects, not a technology wall.
4. **Approach / experience**: a compact delivery approach while employment dates remain unconfirmed; publish a timeline only after reconciliation.
5. **Public activity**: contribution calendar and repositories as dated secondary proof.
6. **Contact**: direct email plus GitHub and LinkedIn; no globe or form.

## Visual direction

### Chosen: warm ivory / ink / oxide

| Role | Token | Value | Contrast on canvas |
|---|---|---:|---:|
| Canvas | `--bg` | `#F2EDE3` | — |
| Raised surface | `--surface` | `#FAF7F0` | — |
| Primary ink | `--fg` | `#1D1B18` | 14.73:1 |
| Muted ink | `--muted` | `#625E57` | 5.52:1 |
| Border | `--line` | `#CFC6B8` | decorative only |
| Oxide accent | `--accent` | `#AD4527` | 4.92:1 |
| Deep teal support | `--support` | `#355C5A` | reserve for non-body accents after state-specific contrast check |

The original candidate accent `#B64B2A` measured 4.47:1 on the canvas, just below the 4.5:1 body-text threshold. It was darkened to `#AD4527` rather than relying on large-text exemptions.

### Alternatives tested

| Direction | Core values | Primary / muted / accent contrast | Assessment |
|---|---|---|---|
| Warm editorial dark | `#171512`, `#F2EDE3`, `#B1A99D`, `#E86A47` | 15.62 / 7.84 / 5.71 | Rich and safe, but still a dark developer portfolio. |
| Graphite electric | `#111315`, `#F1F2EE`, `#A7ADB3`, `#8FA6FF` | 16.56 / 8.22 / 8.04 | Polished but familiar SaaS/developer-tool territory. |
| Deep navy | `#0B1220`, `#EDF4FF`, `#A8B4C6`, `#79C7C5` | 16.93 / 8.92 / 9.62 | Trustworthy, slightly corporate and cool. |
| Warm ivory | `#F2EDE3`, `#1D1B18`, `#625E57`, `#AD4527` | 14.73 / 5.52 / 4.92 | Most distinctive and editorial; selected. |
| Neutral acid | `#101010`, `#F2F0EA`, `#AAA69D`, `#D8FF5B` | 16.70 / 7.84 / 16.65 | Excellent contrast but almost the current visual premise. |

## Typography and geometry

- Keep the existing locally optimized font pipeline. Space Grotesk can carry body and utility copy; Syne should be limited to a few editorial display moments rather than every heading.
- Use sentence case for most headings. All-caps remains a label treatment, not the site voice.
- Replace rounded glass cards with flat editorial divisions, 1px rules, image frames, and a small number of medium-radius surfaces.
- Use asymmetrical wide/narrow columns at desktop, then a straightforward single column on touch widths.
- Project media should be large enough to inspect, not a decorative thumbnail.

## Motion direction

- One short section reveal family, 180–350ms, no blur required.
- Project media may shift or crop subtly on hover/focus, never revealing otherwise hidden facts.
- Navigation may indicate the current section, but should not scramble text.
- Copy-email confirmation remains because it communicates success.
- Remove loader count-up, repeated glow sweep, word rotation, marquee, tech-chip bounce, decrypt/scramble text, cursor replacement, WebGL drift, tilt, and pinned scroll transitions.

## Expected dependency cleanup after implementation

Only after caller searches and successful verification:

- Remove `three`, `@react-three/fiber`, and `@react-three/drei` with the hero scene.
- Remove `d3-geo`, `topojson-client`, `world-atlas`, and their types if the globe has no remaining caller.
- Remove `gsap` and `@gsap/react` if the pinned project choreography and other GSAP callers are gone.
- Remove `lenis` if native scrolling replaces the smooth-scroll wrapper.
- Remove `cmdk` only if the command palette is intentionally dropped.

This is cleanup, not a requirement to delete useful code prematurely.
