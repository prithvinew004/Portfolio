# Product theatre redesign — implementation plan

## Outcome

Transform the existing editorial portfolio into a high-contrast, image-led product portfolio while preserving truthful content, the preferred stacked hero, accessibility, and the existing Next.js architecture.

## Page sequence

1. **Hero / identity stage**
   - Full viewport, near-black background.
   - Oversized name and concise product-engineering positioning.
   - Enlarged React Bits Card Swap becomes the dominant visual object.
   - Active project title, index, live action, and manual previous/next controls sit inside the same stage.

2. **Selected-work index**
   - Real React Bits Flowing Menu fills most of a viewport.
   - Four public projects appear as large rows with year/type metadata.
   - Hover or keyboard focus reveals a moving band containing the project's real screenshot.
   - A concise instruction and section label sit outside the interaction, not in cards.

3. **Primary case-study evidence**
   - Curoh receives a full-width product stage rather than a generic project card.
   - Large screenshot, contribution statement, capabilities, and verified public scope.
   - Other published work remains reachable through the work index and live links.

4. **Independent tools**
   - Real Watermelon UI Collection Grid Disclosure presents GolfGives, PDFToolkit, DevToolkit, and ImageToolkit.
   - Collapsed rows show product icons, names, and count.
   - Expanded rows show truthful status, summary, stack, live link, and source link.

5. **Capabilities / approach**
   - Replace Magic UI Bento cards with a sparse evidence matrix.
   - Use large capability names, one-sentence scope, and compact technology rails.
   - Keep the three-step approach, but integrate it into the matrix so the page does not become another document section.

6. **Public activity**
   - Retain real GitHub data and contribution graph.
   - Remove card-heavy repo presentation; use an index/list treatment that matches the work browser.

7. **Contact**
   - Oversized closing statement on the signal-color field.
   - Keep the real Animate UI copy interaction and direct email/social links.

## Component provenance

- Preserve `components/ui/card-swap.tsx` from React Bits.
- Add `components/FlowingMenu.tsx` from the official React Bits registry and adapt only presentation/content integration.
- Add `components/watermelon/collection-grid-disclosure.tsx` from the official Watermelon UI registry and adapt its data model plus semantic controls.
- Update `THIRD_PARTY_NOTICES.md` with both selected component URLs and license notes.

## Engineering tasks

1. Add required upstream dependencies for the two source components.
2. Add and adapt the two source component files with provenance comments.
3. Build new section compositions around existing content data.
4. Rework tokens, typography, spacing, and responsive behavior in `app/globals.css`.
5. Simplify navigation for the dark, full-viewport system.
6. Update E2E assertions for the new structure and add interaction coverage for Flowing Menu and the disclosure component.
7. Run lint, TypeScript, production build, and Playwright at desktop and mobile widths.
8. Inspect final screenshots in a visible browser, fix regressions, update the existing PR, and leave the site running on `localhost:3000`.

## Acceptance checks

- The hero stack is larger and unmistakably central.
- Text tags and technical labels are visible, readable, and not clipped.
- Selected work feels like a visual interaction, not a list of ordinary cards.
- Both newly requested components come from their official public registries.
- Keyboard, reduced-motion, and mobile flows remain usable.
- No new unverified claims appear.
- `lint`, `tsc`, `build`, and the E2E suite pass.
