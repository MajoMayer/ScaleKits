# Spec 05: Deployment

**Status:** implemented
**Created:** 2026-03-17
**Depends on:** 01-architecture, 02-kit-gallery

---

## Goal

Publish the MM Kits site to GitHub Pages so it is accessible at a public URL.

## Context

The site is currently only viewable on the developer's local machine (`http://localhost:8080`). This spec defines how to publish it to the internet using GitHub Pages — a free static hosting service built into GitHub. Deployment is manual: the developer runs one command to publish after adding new kits or making changes.

## Inputs

| Input | Type | Source | Notes |
|-------|------|--------|-------|
| Built site | HTML/CSS/JS/images | `dist/` | Produced by `npm run build` |
| GitHub repository | git repo | github.com | Must be public for free GitHub Pages |

## Outputs

| Output | Description |
|--------|-------------|
| Live website | Site accessible at `https://<username>.github.io/ScaleKits` |
| `gh-pages` branch | A git branch on GitHub containing only the built `dist/` contents |
| `npm run deploy` command | One command that builds the site and publishes it to GitHub Pages |

## Acceptance Criteria

1. Running `npm run deploy` publishes the site without errors.
2. The site is accessible at the public GitHub Pages URL within 2 minutes of deploying.
3. The page loads correctly in Chrome — all kit images, navigation, and lightbox work.
4. The URL is a free GitHub Pages subdomain (`github.io`) — no custom domain required.
5. Re-running `npm run deploy` after adding new kits updates the live site.
6. The `dist/` folder is not committed to the `main` branch — only the `gh-pages` branch contains built output.

## Out of Scope

- Automatic deployment (triggered by git push) — deploy is always manual
- Custom domain (e.g. `mmkits.com`)
- Password protection or access control
- CDN or performance optimisation
- Any server-side logic or backend

## Open Questions

_None — all resolved._

---

## Implementation notes

Implemented 2026-03-17.

- `gh-pages` npm package (v6.3.0) added as a dev dependency. Publishes `dist/` contents to the `gh-pages` branch on GitHub.
- `npm run deploy` script added to `package.json`: runs `npm run build && gh-pages -d dist --nojekyll`.
- GitHub Pages must be configured in the repo Settings → Pages → Branch: `gh-pages` / `/ (root)`.
- `--nojekyll` flag added to the `gh-pages` command. GitHub Pages runs Jekyll by default and silently skips all files starting with `_`. All kit images are named `_box.jpeg`, `_01.jpeg`, etc. — without this flag, no images appear on the live site.
- Image paths changed from absolute (`/images/...`) to relative (`images/...`) so paths resolve correctly under the GitHub Pages subdirectory `/ScaleKits/`.
- Live URL: https://majomayer.github.io/ScaleKits
