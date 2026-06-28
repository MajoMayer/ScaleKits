# Spec 06: Card Image Selection

**Status:** implemented
**Created:** 2026-03-17
**Depends on:** 01-architecture, 02-kit-gallery

---

## Goal

Select the most representative photo for each kit card using a priority rule based on the source image filename.

## Context

Currently the import script always uses the file named `_box.jpeg` as the card image. Some kits have a dedicated "card" photo (a finished model photo chosen specifically to represent the kit on the gallery) which is more visually interesting than the box art. This spec defines a priority order for selecting the card image so that the best available photo is always shown on the card.

## Inputs

| Input | Type | Source | Notes |
|-------|------|--------|-------|
| Kit photo files | JPEG | OneDrive kit folder | Filenames may contain "card" or "box" |

## Outputs

| Output | Description |
|--------|-------------|
| `boxArt` field in `kits.json` | Path to the selected card image (may now point to a "card" photo instead of box art) |
| `_box.jpeg` in `public/images/<kit>/` | The selected card image, still saved under this filename |

## Behaviour — Card Image Priority Rule

For each kit folder, the import script selects the card image using this priority order:

1. **"card" file** — a file whose original name contains the word `card` (case-insensitive). If multiple match, use the first alphabetically.
2. **"box" file** — a file whose original name contains the word `box` (case-insensitive). If multiple match, use the first alphabetically.
3. **First available image** — any JPEG file in the folder, sorted alphabetically.

The selected file is copied to `public/images/<kit>/_box.jpeg` as before. The `boxArt` field in `kits.json` continues to point to `images/<kit>/_box.jpeg`. No other fields change.

## Acceptance Criteria

1. A kit folder containing a file with "card" in the name uses that file as the card image.
2. A kit folder with no "card" file but a file with "box" in the name uses the "box" file.
3. A kit folder with neither "card" nor "box" file uses the first available JPEG alphabetically.
4. The selected image is saved as `_box.jpeg` in the output folder — the filename convention does not change.
5. The `boxArt` field in `kits.json` is unaffected in format — it still points to `images/<kit>/_box.jpeg`.
6. All other photos (build photos) are still copied and included in the `photos` array as before.
7. The card image selection rule applies to all kit categories (progress, finished, mid, early) — not to stash categories, which have only one image per kit by design.

## Out of Scope

- Changing the card image for stash-type categories (single image per kit, no selection needed)
- Allowing the user to manually override the card image via the UI
- Renaming or reorganising source files on OneDrive

## Open Questions

_None — all resolved._

### Decisions made

- **Priority:** card → box → first available
- **Filename match:** case-insensitive substring match (e.g. "card", "Card", "CARD" all match)
- **Output filename:** unchanged — always saved as `_box.jpeg`
- **Stash categories:** excluded — they always have exactly one image

---

## Implementation notes

Implemented 2026-03-17.

- `processKitFolder` in `scripts/import.js` updated. Card image selection: `cardFiles[0] || boxFiles[0] || allImages[0]` where `cardFiles` matches `/card/i` and `boxFiles` matches the existing `isBoxArt()` helper.
- Import log prints `INFO: using card image: <filename>` when a card file is selected, and `INFO: no box/card art in <kit>, using first image` when falling back to first available.
- No changes to template, CSS, or `kits.json` format.
