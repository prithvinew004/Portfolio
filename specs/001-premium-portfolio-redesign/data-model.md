# Phase 1 Data Model: Portfolio Content

The portfolio remains static and typed. These entities describe the content contract; they do not introduce persistence.

## Profile

| Field | Rules |
|---|---|
| `name` | Required verified public name. |
| `role` | Concise positioning supported by demonstrated work. |
| `offer` | One audience-relevant sentence; no unsupported outcome claim. |
| `location` | Optional and user-authorized. |
| `availability` | Optional; must be current and user-confirmed before release. |
| `email` | Required public contact destination. |
| `resumeUrl` | Optional; renders only when a real file is supplied. |
| `photo` | Optional; renders only when a real authorized image is supplied. |

## Project Evidence Record

| Field | Rules |
|---|---|
| `id` | Stable unique slug. |
| `title` | Public project name. |
| `status` | `deployed`, `assignment`, `prototype`, `in-progress`, `learning`, `fork`, or `scaffold`. |
| `summary` | Purpose visible in the product or repository. |
| `contribution` | Demonstrable contribution; avoid sole-authorship language unless verified. |
| `capabilities` | Small evidence-backed list. |
| `repoUrl` / `liveUrl` | Optional working public destinations. |
| `media` | Optional local screenshot with evidence source and alt text. |
| `verifiedOn` | Date the evidence was checked. |
| `excludedClaims` | Internal list of unsupported claims that must not render. |
| `featured` | True only for primary evidence-backed case studies. |

### Validation

- A featured record requires `deployed` or `assignment` status and at least one working public destination.
- A `fork`, `scaffold`, `learning`, or `in-progress` record cannot be featured as shipped client work.
- Media must correspond to the linked deployment or an authorized supplied asset.

## Capability Group

| Field | Rules |
|---|---|
| `title` | Client outcome or delivery stage, not a technology category alone. |
| `description` | One short practical explanation. |
| `skills` | Verified technologies or practices. |
| `evidenceProjectIds` | At least one related Project Evidence Record. |

## Experience Record

| Field | Rules |
|---|---|
| `organization` / `role` | User-confirmed public values. |
| `start` / `end` | Reconciled date range; ongoing uses `present`. |
| `summary` | Responsibilities safe to state publicly. |
| `evidence` | User confirmation or authorized public source. |
| `publishable` | False while dates, role, or confidentiality are unresolved. |

## Activity Snapshot

| Field | Rules |
|---|---|
| `days` | Ordered dated public contribution counts. |
| `total` | Derived from displayed days. |
| `source` / `coveredThrough` | Disclosed provider and latest date. |
| `stale` | True when committed fallback is used. |

State: `live request pending` → `live current` on a valid response; otherwise → `dated fallback`. Both render without blocking the page.

## Contact Route

| Field | Rules |
|---|---|
| `label` / `href` | Human label and verified destination. |
| `primary` | Exactly one primary route. |
| `external` | Controls safe new-tab disclosure. |
| `copyValue` | Optional plain-text clipboard fallback. |

## Relationships

- Profile owns Contact Routes.
- Projects support Capability Groups.
- Experience renders only when publishable.
- One Activity Snapshot supports the secondary activity section.
