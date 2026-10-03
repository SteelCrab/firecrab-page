# FireCrab Page

FireCrab promotional page for a Firecracker-focused lightweight MicroVM management platform.

Two apps live in this repository and are served from one domain:

| Path | App | Source |
| --- | --- | --- |
| `/` | Landing page (Vite + React SPA) | `src/` |
| `/docs` | Documentation (Docusaurus) | `docs-site/docs/` |
| `/blog` | Blog (Docusaurus) | `docs-site/blog/` |
| `/en/docs`, `/en/blog` | English locale | `docs-site/i18n/en/` |
| `/ja/…`, `/zh-Hans/…`, `/id/…`, `/es/…` | Japanese, Chinese, Indonesian, Spanish locales | English content for now, see [Languages](#languages) |

The docs site runs at `baseUrl: '/'` and splits its two plugins with
`docs.routeBasePath: '/docs'` and `blog.routeBasePath: '/blog'`, so docs and blog are
sibling top-level routes. Because both apps then share the site root, Vite emits its
bundle to `app-assets/` (`vite.config.ts`) and leaves `assets/` to Docusaurus.
Korean is the default locale. Both apps share one top navigation, see
[Shared header](#shared-header).

## Development

```bash
npm install
npm run dev        # landing + prebuilt docs/blog (all languages) on port 5173

npm run dev:landing # landing only; expects an existing docs-site/build for docs routes
npm run dev:docs    # live Docusaurus editing for the default Korean locale
```

The unified `npm run dev` builds every Docusaurus locale once, then serves `/`, `/docs`,
`/blog`, and the same routes under each language prefix (`/en/docs`, `/ja/blog`, …) from the
Vite origin. Restart it after editing docs or blog content. Use `npm run dev:docs` when live-reloading documentation is more important
than testing the unified origin.

`docs-site/` has its own `package.json` so the landing page (React 18) and Docusaurus
(React 19) do not share a dependency tree.

## Build

```bash
npm run build      # landing + docs, merged into dist/
npm run build:docs # docs site only
```

`npm run build` checks the landing translations (`npm run check:i18n`), type-checks and
builds the SPA, installs and builds the docs site (six locales), then merges
`docs-site/build` into `dist/` via `scripts/merge-docs-build.mjs`. The merge must stay
after `vite build` because Vite empties `dist/` first. The script refuses to run if the
docs build produced an `index.html`, which would overwrite the landing page.

## Deployment (Cloudflare Workers + static assets)

Git-connected Workers Builds (dashboard) runs:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | repository root |
| Production branch | `main` |
| Node.js version | from `.node-version` (22) |

Repo config lives in `wrangler.jsonc`:

| Field | Value | Why |
| --- | --- | --- |
| `assets.directory` | `./dist` | Final merge of Vite landing + Docusaurus |
| `assets.not_found_handling` | `404-page` | Serve Docusaurus `404.html` for missing paths |

Do **not** set `not_found_handling` to `single-page-application`. That rewrites every
unknown path to the landing `index.html` and would hide `/docs` and `/blog` when a
file is missing (and break real 404s). Workers also apply `dist/_headers` natively
(same rules as Pages); Vite copies `public/_headers` into `dist/`.

After the first successful deploy, attach the custom domain `firecrab.dev` to this
Worker in the dashboard (or via routes) so production traffic hits the new deployment.

## Content sources

The landing page and docs overview track [SteelCrab/firecrab](https://github.com/SteelCrab/firecrab)
(`README*.md`, `CHANGELOG.md`, `public-docs/`). When that project ships a release, update these together:

| What | Where |
| --- | --- |
| Version pill (landing and docs header) and release link | `version` in `src/shared/siteHeader.json`, plus `version` in `package.json` |
| Feature, component, and comparison copy | `src/landing/landingData.ts` (Korean/English inline, other languages in `src/landing/i18n/messages.ts`) |
| Install and run guide (Linux, macOS, Windows) | `src/landing/installGuide.ts`, taken from the firecrab `README.md` |
| Architecture: intro animation and the two diagrams | `public/firecrab-demo.gif` and `public/architecture/*.svg`, copied from `assets/dashboard/` and `assets/architecture/` in the firecrab repository; text in `architectureBlocks` of `src/landing/landingData.ts` |
| Docs overview | `docs-site/docs/intro.mdx` and `docs-site/i18n/en/.../current/intro.mdx` |

Only the two architecture diagrams have Korean variants (the firecrab `README.ko.md` uses them);
every other language shows the English diagrams, like the other READMEs. Boot-time and memory
figures quote Firecracker's published specification (boot ≤ 125 ms, VMM overhead ≤ 5 MiB), not a
FireCrab measurement.

## Languages

Six languages: Korean (default), English, Japanese, Chinese, Indonesian, Spanish. The list
(`languages` in `src/shared/siteHeader.json`) is the one source for the landing, the docs/blog
build, the language menus, and the dev server routing; `src/shared/language.ts` holds the shared
language preference, so both apps pick the same language (saved choice, else browser language).
To add a language, add it to the JSON, translate the labels there, add its rows to
`src/landing/i18n/messages.ts` (the check script lists what is missing), and give it a
`docs-site/i18n/<locale>/code.json`.

| Part | How it is translated |
| --- | --- |
| Landing | Korean and English inline, `t('한국어', 'English')`. Japanese, Chinese, Indonesian and Spanish are looked up by the English text in `src/landing/i18n/messages.ts`. `npm run check:i18n` (part of `npm run build`) fails when a string is missing or a translation changes `` `code` ``, links, `**bold**` or `{placeholders}`. |
| Docs and blog pages | Korean in `docs-site/docs/` and `docs-site/blog/`, English in `docs-site/i18n/en/`. The other four languages have no translated pages yet, so `docusaurus.config.ts` points them at the English files (`docsPath`, `blogPath`). A file placed in `docs-site/i18n/<locale>/docusaurus-plugin-content-{docs,blog}/` overrides the English one for that language only. |
| Docs and blog chrome | Docusaurus' built-in theme translations, `siteHeader.json` (header), the `tx()` strings in `docs-site/docusaurus.config.ts` (footer, blog title), and `docs-site/i18n/<locale>/code.json` (the share button). |

Write internal Markdown links without a language prefix (`/docs`, not `/en/docs`): Docusaurus
adds the prefix of the current language, and a hard-coded one breaks every other language.

## Shared header

The landing page and the docs/blog show the same top navigation, so it is defined once:

| What | Where |
| --- | --- |
| Content: version, repository, languages, links, labels in every language | `src/shared/siteHeader.json` |
| Style, including the breakpoints (menu button at 996px, Docusaurus' own mobile threshold) | `src/shared/site-header.css`, imported by `src/landing/LandingPage.tsx` and `docs-site/src/css/custom.css` |
| Markup, landing | `src/landing/SiteHeader.tsx`, `src/landing/LanguageMenu.tsx` |
| Markup, docs/blog | `docs-site/src/components/SiteHeader/`, wired in by `navbar.items` (`custom-fc*`) in `docusaurus.config.ts` and the `Navbar/Content`, `Navbar/MobileSidebar/*` and `NavbarItem/ComponentTypes` theme overrides |

Both render the same class names (`fc-*`), so a change to the markup contract has to be made in
both places. The docs copy of the five icons is in `components/SiteHeader/icons.tsx` (the
landing uses `lucide-react`). Links from the docs header to the landing page are plain `<a>`
elements, because `/` is not a Docusaurus route.

## Stack

- React
- TypeScript
- Vite
- Docusaurus
- Lucide React
- Simple Icons
