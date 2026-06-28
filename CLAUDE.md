# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MM Kits — a personal scale model kit showcase website. Source images and data live in OneDrive at `../Modely/__Public data/` (relative to this repo's parent). The site replaces an existing Google Sites page.

---

## Spec Driven Development (SDD)

This project is a learning exercise in SDD. **No code is written without a spec.** This is the rule.

### The workflow

```
1. Write spec  →  2. Review spec  →  3. Implement  →  4. Validate
```

- Every feature starts as a `.md` file in `specs/`
- Specs are reviewed and approved before any implementation begins
- Implementation must match the spec exactly — no gold-plating
- After implementation, validate against acceptance criteria in the spec

### Spec file naming

```
specs/NN-short-name.md   (e.g., specs/01-architecture.md, specs/02-kit-gallery.md)
```

### Spec structure (see `specs/00-template.md`)

Each spec must have:
- **Goal** — one sentence
- **Context** — why this exists
- **Inputs** — data/files/props coming in
- **Outputs** — what gets built/rendered
- **Acceptance Criteria** — numbered, testable statements
- **Out of Scope** — explicit exclusions to prevent scope creep
- **Open Questions** — unresolved decisions (must be empty before implementation starts)

### SDD commands

| Command | Purpose |
|---|---|
| `/spec-new` | Scaffold a new spec file |
| `/spec-review` | Critique a spec before implementation |
| `/spec-implement` | Implement from a named spec file |
| `/spec-validate` | Check implementation against a spec's acceptance criteria |
| `/retro` | Run a retrospective review of the SDD process at a natural milestone |

---

## Repository structure

```
specs/          # One .md file per feature — source of truth
src/            # Generated after architecture spec is approved
CLAUDE.md       # This file
```

## Data source

Images are at:
```
/Users/marianmayer/Library/CloudStorage/OneDrive-AstonITMspol.sr.o/#mm/Modely/__Public data/
```

Folder naming convention encodes all metadata:
```
ModelName_Scale_Manufacturer/
  _box.jpeg       ← box art photo
  _01.jpeg        ← build/detail photos (numbered)
  _02.jpeg
  ...
```

Categories are encoded by folder location:

| OneDrive path | Category | Notes |
|---|---|---|
| Root folders (no prefix) | Kits in Progress | Kit folders with build photos |
| `_Finished Kits/` | Finished Kits | Completed builds |
| `_Mid Age Kits/` | Mid Age Kits | Kit folders with build photos |
| `_Early Age Kits/` | Early Age Kits | Kit folders with build photos |
| `_Stash/` root files | Stash | Loose JPEG files, box art only |
| `_Stash/_Figures & Material/` | Figures & Material | Loose JPEG files, box art only |
| `_Stash/_Stash No More/` | Stash No More | Loose JPEG files, box art only |

### Import and renaming rules

- Images are **never modified on OneDrive**. All renaming happens only when copying into `public/images/`.
- Folders and files are renamed to `Name_Scale_Manufacturer` on import:
  - Fields are separated by `_` (underscore)
  - Spaces within a field become `-` (hyphen)
  - Scale slash becomes hyphen: `1/72` → `1-72`
- Stash-type categories contain loose JPEG files (no subfolders). Metadata is in the filename.
- HEIC files disguised as `.jpeg` are auto-detected and converted during import.
- Subsequent imports use `npm run import`.

---

## SDD rules (enforced in every session)

1. If there is no spec for the work being requested, write the spec first.
2. Never implement more than the spec describes.
3. Open Questions in a spec must be resolved before implementation.
4. If implementation reveals a gap in the spec, stop and update the spec — don't fill the gap silently.
5. Acceptance Criteria drive validation, not vibes.
