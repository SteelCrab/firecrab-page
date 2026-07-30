# FireCrab Page

FireCrab promotional page for a Firecracker-focused lightweight MicroVM management platform.

Two apps live in this repository and are served from one domain:

| Path | App | Source |
| --- | --- | --- |
| `/` | Landing page (Vite + React SPA) | `src/` |
| `/docs` | Documentation (Docusaurus) | `docs-site/docs/` |
| `/blog` | Blog (Docusaurus) | `docs-site/blog/` |
| `/en/docs`, `/en/blog` | English locale | `docs-site/i18n/en/` |

The docs site runs at `baseUrl: '/'` and splits its two plugins with
`docs.routeBasePath: '/docs'` and `blog.routeBasePath: '/blog'`, so docs and blog are
sibling top-level routes. Because both apps then share the site root, Vite emits its
bundle to `app-assets/` (`vite.config.ts`) and leaves `assets/` to Docusaurus.
Korean is the default locale; untranslated pages fall back to the Korean source.

## Development

```bash
npm install
npm run dev        # landing page

npm run dev:docs   # docs site (installs docs-site deps on first run)
```

`docs-site/` has its own `package.json` so the landing page (React 18) and Docusaurus
(React 19) do not share a dependency tree.

## Build

```bash
npm run build      # landing + docs, merged into dist/
npm run build:docs # docs site only
```

`npm run build` builds the SPA, installs and builds the docs site, then merges
`docs-site/build` into `dist/` via `scripts/merge-docs-build.mjs`. The merge must stay
after `vite build` because Vite empties `dist/` first. The script refuses to run if the
docs build produced an `index.html`, which would overwrite the landing page.

## Deployment (Cloudflare Pages)

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | repository root |
| Node.js version | from `.node-version` (22) |

No routing config file is needed, and adding one would break the site. Two Cloudflare
Pages behaviours drive this:

- `_redirects` rules are applied **even when a matching static asset exists**, so a
  catch-all SPA rewrite (`/* /index.html 200`) would swallow `/docs`, `/blog` and the
  hashed asset directories.
- Pages only switches into SPA mode when the output has no top-level `404.html`. Ours
  has one (Docusaurus generates it), so unmatched paths render the Docusaurus 404 page
  and every real file is served directly.

`public/_headers` sets long-lived immutable caching for the two hashed asset
directories; Vite copies it to the deployment root.

## Stack

- React
- TypeScript
- Vite
- Docusaurus
- Lucide React
- Simple Icons
