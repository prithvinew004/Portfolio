# UI Contract: Premium Component Polish

## Opening

- The opening presents the current name, positioning, primary CTA, secondary CTA, and four featured project evidence links.
- Each evidence tile uses an existing local screenshot and links to its matching project section.
- At 390x844, the primary and secondary CTA remain reachable in the opening viewport without horizontal scrolling.
- The evidence composition never covers copy or captures input needed by another control.

## Navigation

- Existing anchors and the Base UI mobile dialog remain the navigation model.
- Exactly one visible desktop anchor may expose `aria-current="location"` as the reader moves through the page.
- Native anchor navigation remains functional when JavaScript is unavailable; active styling is enhancement only.
- Mobile open/close, focus containment, Escape dismissal, and focus restoration continue to work.

## Featured Project Media

- Four featured projects render one stable-aspect-ratio local screenshot each.
- Each media frame is itself a keyboard-focusable direct link to the existing live project URL.
- A readable hostname and live-site affordance are present without relying on hover.
- Pointer highlight and depth are cosmetic, scoped to fine pointers, and absent under reduced motion where motion would distract.
- A missing image never collapses the project copy or reading order.

## Interaction and Motion

- Hover/focus transitions complete within 250 ms; press feedback within 160 ms.
- Strong ease-out is used for entered states; no continuous or autoplay motion is introduced.
- Every interactive element retains visible focus indication and a semantic role/name.
- The layout works at 390x844, 768x1024, 1280x800, 1440x900, 200% zoom, touch/coarse pointer, and `prefers-reduced-motion: reduce`.

## Resilience and Truthfulness

- All eight public projects, current links, claims, technology labels, and CTA destinations remain unchanged.
- No testimonial, metric, client claim, remote preview request, new package, or generated project image is introduced.
- No runtime console error, uncaught page error, broken internal anchor, or horizontal overflow is accepted.
