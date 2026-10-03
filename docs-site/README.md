# FireCrab Docs

[Docusaurus](https://docusaurus.io/) site serving the FireCrab documentation and blog.
It is deployed as part of the landing page repository — see the root `README.md`.

## Local development

```bash
npm install
npm run start          # http://localhost:3000/docs
npm run start -- --locale en
```

## Build

```bash
npm run build          # every locale: Korean into build/, the others into build/<locale>/
npm run serve
```

Always build all locales. `docusaurus build --locale <locale>` is meant for deploying one
locale per subdomain: it empties `build/` and writes that locale at the root with `baseUrl: '/'`,
which also trips the broken-link check on the `/<locale>/…` links of the header and footer.

`npm run deploy` (GitHub Pages) is unused here — the root build merges `build/` into the
landing page's `dist/` and Cloudflare Pages serves both from one domain.

## Notes

- `baseUrl` is `/`, with `docs.routeBasePath: '/docs'` and `blog.routeBasePath: '/blog'`,
  so docs and blog are sibling routes. `docs/intro.mdx` owns `/docs` via `slug: /`.
- **Never add a page that creates a `/` route** (e.g. `src/pages/index.tsx`). The site root
  belongs to the landing page; the root build fails if `build/index.html` appears.
- **Languages.** The six locales (`ko` default, `en`, `ja`, `zh-Hans`, `id`, `es`) come from
  `../src/shared/siteHeader.json`, the list the landing page uses too. Korean is the source and
  English is translated in `i18n/en/`. The other four have no translated pages yet, so
  `docusaurus.config.ts` points their `docs.path` and `blog.path` at the English folders
  (Docusaurus' own fallback would show the Korean source). A file in
  `i18n/<locale>/docusaurus-plugin-content-{docs,blog}/` overrides the English one for that
  language only. Each of those locales has an `i18n/<locale>/code.json` for the strings of the
  components in `src/` (the share button); the rest of the theme comes from Docusaurus'
  bundled translations. `i18n/id/code.json` also replaces three plural strings, because the
  bundled Indonesian ones have two forms while Indonesian has one plural category (every post
  would read "Satu menit membaca").
- Write internal links in Markdown without a locale prefix (`/docs`, `/blog/contributing`).
  Docusaurus adds the prefix of the current locale; a hard-coded `/en/docs` becomes
  `/ja/en/docs` in the Japanese build and fails the broken-link check.
- **Top navigation.** It is the same bar as the landing page: content in
  `../src/shared/siteHeader.json`, style in `../src/shared/site-header.css` (imported at the top
  of `src/css/custom.css`), markup in `src/components/SiteHeader/`. `navbar.items` in
  `docusaurus.config.ts` declares the parts (`custom-fcLink`, `custom-fcLanguage`,
  `custom-fcStar`, `custom-fcInstall`), `src/theme/NavbarItem/ComponentTypes.tsx` registers them,
  and `src/theme/Navbar/Content` and `src/theme/Navbar/MobileSidebar/*` lay them out. On
  phones the docs/blog tree is the first panel of the drawer, with "Back to main menu" leading to
  the same drawer the landing page shows.
- Links to the landing page must be plain `<a>` elements (the header items, the `html` footer
  item). `/` is not a Docusaurus route, so a normal `to`/`href` would be flagged as a broken
  link and would client-side route into the 404 page instead of loading the landing.
- The footer, the blog title and the feed strings are written per language with `tx()` in
  `docusaurus.config.ts`, so they need no entries in `i18n/<locale>/docusaurus-theme-classic/`
  and `write-translations` does not have to be re-run after changing them (the `navbar.json` and
  `footer.json` that exist for `en` are left over from the old config and mostly unused).
- `src/theme/Root` sends a visitor to their preferred language (saved choice, else browser
  language) using `../src/shared/language.ts`, the same code the landing page runs. Links with
  `data-firecrab-locale` (the header and footer language links) save that choice when clicked.
