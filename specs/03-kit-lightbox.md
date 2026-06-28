# Spec 03: Kit Lightbox

**Status:** implemented
**Created:** 2026-03-16
**Depends on:** 02-kit-gallery

---

## Goal

When a kit card is clicked, show all of that kit's photos in a fullscreen overlay that the user can navigate through and dismiss.

## Context

Spec 02 displays one box art photo per kit card with no way to see build photos. This spec adds a lightbox overlay so the visitor can browse all photos for any kit without leaving the gallery page.

## Inputs

| Input | Type | Source | Notes |
|-------|------|--------|-------|
| Kit photos | JPEG | `public/images/<kit-folder>/` | All files: `_box.jpeg`, `_01.jpeg`, `_02.jpeg`, … |
| Kit metadata | JSON | `src/_data/kits.json` | Name, manufacturer, scale, folder path |

## Outputs

| Output | Description |
|--------|-------------|
| Lightbox overlay | Fullscreen dark overlay with main photo and thumbnail strip |
| Thumbnail strip | Row of small thumbnails along the bottom of the overlay |
| Previous / Next controls | Arrow buttons to navigate between photos |
| Photo counter | "2 / 7" indicator showing current position |
| Close button | Button (and Escape key) to dismiss the overlay |
| Updated CSS | Styles for the overlay, thumbnail strip, controls, and counter |
| Updated JS | Script to open, navigate, and close the lightbox |

## Behaviour

- Clicking a kit card opens the lightbox at the first photo (`_box.jpeg`).
- Photos are shown in order: box art first, then build photos in numbered order.
- The overlay covers the full viewport with a dark semi-transparent background.
- The main photo is centered and scaled to fit the screen without cropping.
- A horizontal thumbnail strip runs along the bottom of the overlay, showing all photos as small clickable thumbnails.
- The currently displayed photo's thumbnail is visually highlighted (bright border).
- Clicking a thumbnail navigates directly to that photo.
- Left / right arrow buttons navigate to the previous / next photo.
- Left / right keyboard arrow keys also navigate.
- Pressing Escape or clicking outside the photo area closes the overlay.
- If a kit has only one photo (box art), the arrow buttons and thumbnail strip are hidden.
- Stash kits typically have only one photo — lightbox still opens, just no strip or arrows.

## Acceptance Criteria

1. Clicking any kit card opens the lightbox showing that kit's first photo.
2. A thumbnail strip is visible at the bottom of the overlay showing all photos for that kit.
3. The currently shown photo's thumbnail is highlighted with a visible border.
4. Clicking a thumbnail navigates to that photo.
5. The lightbox displays a photo counter ("1 / N" format).
6. Clicking the next arrow advances to the next photo; clicking previous goes back.
7. The left and right keyboard arrow keys navigate photos when the lightbox is open.
8. Pressing Escape closes the lightbox.
9. Clicking outside the photo (on the dark overlay) closes the lightbox.
10. A kit with only one photo shows no arrow buttons and no thumbnail strip.
11. The gallery page behind the overlay does not scroll while the lightbox is open.
12. The lightbox works on screens 320px wide or wider without horizontal overflow.

## Out of Scope

- Swipe gestures for touch/mobile
- Zoom or pan on individual photos
- Photo captions or descriptions
- Download button
- Sharing individual photos
- Keyboard navigation outside of arrows and Escape

## Open Questions

_None — all resolved._

### Decisions made

- **Trigger:** clicking the card (anywhere on it)
- **First photo shown:** box art (`_box.jpeg`)
- **Photo order:** box art first, then `_01`, `_02`, … in numbered order
- **Thumbnail strip:** visible at bottom for kits with more than one photo
- **Close method:** Escape key or click outside the photo area
- **No external lightbox library** — implemented in plain JS to keep dependencies minimal

---

## Implementation notes

Implemented 2026-03-16.

- Lightbox HTML restructured into `.lightbox-main` (photo + arrows) and `.lightbox-footer` (counter + thumbnail strip).
- Thumbnail strip (`#lightbox-thumbs`) is built dynamically in JS from the `data-photos` array on each card — no server-side changes needed.
- Active thumbnail highlighted with steel blue border (`#4A7FA5`); scrolls into view automatically on navigation.
- Strip is hidden for kits with only one photo (Stash items).
- 8 HEIC files disguised as `.jpeg` discovered in the Kfz-14 kit; converted to real JPEG using `sips`. Import script updated to auto-detect and convert HEIC files on all future imports.
- All 12 acceptance criteria verified in Chrome and Safari.
