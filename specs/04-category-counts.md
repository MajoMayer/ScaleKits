# Spec 04: Category Kit Counts

**Status:** implemented
**Created:** 2026-03-16
**Depends on:** 02-kit-gallery

---

## Goal

Display the number of kits in each category next to the category heading and navigation link.

## Context

The gallery has multiple category sections. Visitors currently have no indication of how many kits are in each section before scrolling. Showing a count next to each heading (e.g. "Kits in Progress (11)") gives an immediate overview of the collection size. The number of categories may change in future — this feature must work correctly regardless of how many categories exist or how many kits are in each.

## Inputs

| Input | Type | Source | Notes |
|-------|------|--------|-------|
| Kit metadata | JSON | `src/_data/kits.json` | Category field used to count per category |

## Outputs

| Output | Description |
|--------|-------------|
| Updated headings | Each `<h2>` category heading shows the count in parentheses |
| Updated nav links | Each nav link also shows the count in parentheses |

## Behaviour

- Count is computed at build time in the Nunjucks template using `selectattr`.
- Format: `Category Name (N)` — e.g. `Kits in Progress (11)`.
- The number is styled subtly — smaller and lighter than the heading text so it doesn't compete visually.
- Count in nav links uses the same format.

## Acceptance Criteria

1. Every category heading displays the correct kit count in parentheses.
2. Every navigation link displays the correct kit count in parentheses.
3. The count is always accurate — it reflects the actual number of kits in `kits.json` for that category.
4. The count number is visually distinct from the heading label (smaller or lighter).
5. No changes are required to the import script or `kits.json`.
6. Adding or removing a category in the future requires no changes to the counting logic — only the template section itself.

## Out of Scope

- A grand total count for the whole site
- Counts that update dynamically without a rebuild

## Open Questions

_None — all resolved._

### Decisions made

- **Source:** Computed in Nunjucks template using `selectattr("category", "equalto", "...")` — no import script changes needed.
- **Placement:** Next to heading text and next to nav link text.
- **Style:** Count is smaller/lighter, not a badge or pill.

---

## Implementation notes

Implemented 2026-03-16.

- Counts computed at build time using a custom Eleventy filter `categoryCount(kits, category)` registered in `.eleventy.js`. Nunjucks does not have a built-in `equalto` test so `selectattr` was silently returning all items — the custom filter avoids this.
- Headings use `.category-count` span (1rem, grey `#999`); nav links use `.nav-count` span (0.8em, 65% opacity).
- No changes to import script or `kits.json`.
