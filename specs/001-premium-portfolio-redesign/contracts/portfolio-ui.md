# UI Contract: Premium Client Portfolio

## Landmark and heading contract

- One page-level `h1` identifies Prithviraj and the offer.
- Each major section has a unique `h2` and stable anchor: `work`, `capabilities`, `experience` or `approach`, `activity`, `contact`.
- Header, main content, and footer/contact landmarks remain identifiable without styling.

## First viewport contract

- Shows name, concrete offer, primary email/contact action, and secondary selected-work action.
- Availability renders only when verified.
- No loader, modal, canvas, or animation delays access to the first action.

## Project case-study contract

- Every article exposes title, honest status, purpose, demonstrated contribution, capabilities, and available destinations.
- Repository and live-demo actions have distinct labels and disclose new-tab behavior.
- Missing destinations are omitted; `#contact` is never used as a fake case-study link.
- Project media has useful alt text when it adds evidence; decorative crops use empty alt text.

## Navigation contract

- Desktop and mobile navigation expose the same major destinations.
- A collapsed trigger is a real button with name, expanded state, and focus return.
- Anchor targets account for the fixed header.
- Command-palette navigation may remain only if it mirrors visible navigation.

## Motion contract

- Motion explains entrance, focus, selection, or success; no content depends on it.
- Reduced motion removes transforms, smooth scrolling, repeated text effects, cursor replacement, and pinned scroll sequences.
- Hover information is also visible on focus and touch.

## Contact contract

- The email is always readable and selectable.
- Copy reports success without relying on color and leaves `mailto:` available if clipboard access fails.
- No form is included in this release.

## Activity contract

- Activity labels its source and covered-through date.
- Fallback says it is a saved snapshot and does not imply live totals.
- A GitHub failure cannot remove or delay selected work and contact.

## Responsive contract

- Required viewports: 390×844, 768×1024, 1280×800, 1440×900.
- No horizontal page overflow.
- Tap targets are at least 44×44 CSS pixels where practical.
- Text remains usable at 200% zoom without clipping or lost actions.

## Error contract

- Broken project data fails during type/build checks.
- Remote GitHub and image failures degrade to dated or text-only evidence.
- Browser console errors, failed same-origin requests, and dead primary links block release unless documented and accepted.
