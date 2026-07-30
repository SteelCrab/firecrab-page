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
npm run build          # builds both locales into build/ and build/en/
npm run serve
```

`npm run deploy` (GitHub Pages) is unused here — the root build merges `build/` into the
landing page's `dist/` and Vercel serves both from one domain.

## Notes

- `baseUrl` is `/`, with `docs.routeBasePath: '/docs'` and `blog.routeBasePath: '/blog'`,
  so docs and blog are sibling routes. `docs/intro.mdx` owns `/docs` via `slug: /`.
- **Never add a page that creates a `/` route** (e.g. `src/pages/index.tsx`). The site root
  belongs to the landing page; the root build fails if `build/index.html` appears.
- Korean is the default locale, English is served from `/en/`. Untranslated pages fall back
  to the Korean source file.
- Links to the landing page must be raw HTML (`type: 'html'` navbar item, `html` footer
  item). `/` is not a Docusaurus route, so a normal `to`/`href` would be flagged as a broken
  link and would client-side route into the 404 page instead of loading the landing.
- After changing navbar/footer labels, re-run
  `npm run write-translations -- --locale en` and update `i18n/en/`.
