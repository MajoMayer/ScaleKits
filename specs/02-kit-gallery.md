# Spec 02: Kit Gallery

**Status:** implemented
**Created:** 2026-03-13
**Depends on:** 01-architecture

---

## Goal

Display all kits as a visual grid of cards, grouped by category, in a clean magazine-style layout.

## Context

The current Google Sites page has no visual structure or design — it is plain default styling with no hierarchy. This spec defines what the visitor sees: the layout, card design, navigation, and visual style of the site.

## Inputs

| Input | Type | Source | Notes |
|-------|------|--------|-------|
| Kit metadata | JSON | `src/_data/kits.json` | Name, scale, manufacturer, category, photo paths |
| Kit photos | JPEG | `public/images/` | Box art (`_box.jpeg`) used as card image |

## Outputs

| Output | Description |
|--------|-------------|
| Gallery page | A single HTML page showing all kits grouped by category |
| Kit card | A card component: box art image, kit name, manufacturer, scale |
| Navigation bar | Links to each category, site title on the left |
| CSS stylesheet | All visual styles for the page |

## Visual Design

- **Style:** Clean magazine — white background, strong black typography, minimal chrome
- **Accent color:** Steel blue `#4A7FA5` — used for headings, links, and hover states
- **Layout:** Responsive grid — multiple columns on desktop, fewer on smaller screens
- **Typography:** System font stack (no custom fonts required)

## Card Design

Each kit card contains:
1. Box art photo (full width of card)
2. Kit name (prominent, steel blue)
3. Manufacturer and scale (smaller, grey)

## Categories

Kits are grouped into seven sections, displayed in this order:
1. **Kits in Progress** — root folders
2. **Finished Kits** — `_Finishes Kits/` on OneDrive
3. **Mid Age Kits**
4. **Early Age Kits**
5. **Stash** — box art only
6. **Figures & Material** — box art only
7. **Stash No More** — box art only

Each category has a visible heading. The navigation bar contains one link per category.

## Acceptance Criteria

1. All 104 kits appear on the page across 7 category sections.
2. Kits are grouped under their correct category heading.
3. Each card shows: box art image, kit name, manufacturer, and scale.
4. The navigation bar contains the site title ("MM Kits") and one link per each of the 7 categories.
5. The page background is white and the accent color is `#4A7FA5`.
6. The layout is a grid with at least 3 columns on a 1280px-wide screen.
7. The page has no horizontal scrollbar on screens 320px wide or wider.
8. Clicking a navigation link scrolls to the correct category section.

## Out of Scope

- Individual kit detail pages (clicking a card does nothing)
- Search or filtering
- Sorting within a category
- Animations or transitions
- Dark mode
- Custom fonts

## Open Questions

_None — all resolved._

### Decisions made

- **Style:** Clean magazine (white + steel blue `#4A7FA5`)
- **Card click:** No action — detail pages are out of scope
- **Fonts:** System font stack, no external dependencies

---

## Implementation notes

Implemented 2026-03-13. Updated 2026-03-17 (category restructure).

- `src/index.njk`: Nunjucks template with 7 explicit category sections. Used `{% if kit.category == "..." %}` filtering inside `{% for kit in kits %}` loops.
- `src/css/style.css`: CSS Grid layout with 4/3/2/1 column breakpoints at 1280/900/600/320px. Steel blue `#4A7FA5` accent. System font stack. Sticky nav bar.
- `dist/index.html` verified: 104 cards rendered across 7 sections (11 progress, 4 finished, 13 mid, 15 early, 43 stash, 13 figures, 5 stash no more).
- Eleventy passthrough corrected to copy `public/images/` → `dist/images/` (not `public/` → `dist/public/`).
