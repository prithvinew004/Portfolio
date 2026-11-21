# Data Model: Premium Component Polish

This feature introduces presentation state only. There is no persisted data or API.

## Design Pattern Decision

| Field | Type | Meaning |
|---|---|---|
| `source` | string | Researched library or reference site |
| `pattern` | string | Visual or interaction pattern considered |
| `decision` | `adapt` \| `reject` | Whether it belongs in this portfolio |
| `reason` | string | Fit, accessibility, performance, and provenance rationale |

## Hero Evidence Tile

Derived from the first four entries in the existing `projects` content.

| Field | Source | Constraint |
|---|---|---|
| `title` | project title | Visible or accessible label |
| `image` | local project image | Must use stable dimensions |
| `projectId` | verified project slug | Tile links to its project section |
| `priority` | position | Only opening-view assets may be prioritized |

## Navigation State

| Field | Type | Values |
|---|---|---|
| `activeSection` | string | One of the existing section IDs |
| `mobileOpen` | boolean | Existing Base UI dialog state |

State transition: an observed section crossing the configured viewport band updates `activeSection`. A clicked anchor still uses native navigation. Mobile dialog behavior is unchanged.

## Project Media Frame

| Field | Type | Constraint |
|---|---|---|
| `src` | string | Existing local screenshot |
| `alt` | string | Existing descriptive project alt text |
| `title` | string | Accessible live-link label |
| `liveUrl` | URL string | Existing verified external URL |
| `priority` | boolean | Defaults false |
| `--spot-x`, `--spot-y` | CSS lengths | Cosmetic fine-pointer coordinates; not application state |

States: resting, hover-capable pointer highlight, keyboard focus-visible, active press, and reduced-motion fallback. Content and link behavior never depend on the cosmetic state.
