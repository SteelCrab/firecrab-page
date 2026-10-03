import { useEffect, useState } from 'react';
import { Github, Menu, X } from 'lucide-react';
import siteHeader from '../shared/siteHeader.json';
import { languages, pick, sitePath, type Language } from './i18n';
import { LanguageMenu } from './LanguageMenu';

type HeaderLink = (typeof siteHeader.links)[number];

/** Same breakpoint as src/shared/site-header.css (the bar collapses at 996px). */
const desktopQuery = '(min-width: 997px)';

/** Landing links are in-page anchors; docs and blog are separate builds under the language prefix. */
const linkHref = (link: HeaderLink, language: Language): string => {
  switch (link.kind) {
    case 'docs':
      return sitePath(language, '/docs');
    case 'blog':
      return sitePath(language, '/blog');
    default:
      return `#${link.hash}`;
  }
};

/**
 * Top navigation of the landing page. The docs/blog (Docusaurus) renders the same bar from the
 * same data and stylesheet: src/shared/siteHeader.json and src/shared/site-header.css.
 */
export function SiteHeader({
  language,
  onLanguageChange,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const label = (text: Record<Language, string>) => pick(text, language);
  const installLink = siteHeader.links.find((link) => link.id === 'install');

  useEffect(() => {
    const query = window.matchMedia(desktopQuery);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fc-header">
      <div className="fc-nav-shell">
        <a className="fc-wordmark" href="#top" aria-label="FireCrab">
          <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
          <span className="fc-wordmark-title">FireCrab</span>
          <span className="fc-version-pill">{siteHeader.version}</span>
        </a>

        <nav className="fc-desktop-nav" aria-label={label(siteHeader.labels.mainMenu)}>
          {siteHeader.links.map((link) => (
            <a href={linkHref(link, language)} key={link.id}>
              {label(link.label)}
            </a>
          ))}
        </nav>

        <div className="fc-nav-actions">
          <LanguageMenu language={language} onChange={onLanguageChange} />

          <a className="fc-github-pill" href={siteHeader.repositoryUrl} target="_blank" rel="noreferrer">
            <Github size={15} />
            <span>{label(siteHeader.labels.star)}</span>
          </a>

          <a className="fc-btn-primary" href={installLink ? linkHref(installLink, language) : '#install'}>
            {label(siteHeader.labels.install)}
          </a>
        </div>

        <button
          className="fc-menu-button"
          type="button"
          aria-label={menuOpen ? label(siteHeader.labels.closeMenu) : label(siteHeader.labels.openMenu)}
          aria-expanded={menuOpen}
          aria-controls="fc-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Drawer: language grid, the same links, GitHub */}
      <nav
        className={`fc-mobile-nav ${menuOpen ? 'is-open' : ''}`}
        id="fc-mobile-nav"
        hidden={!menuOpen}
        aria-label={label(siteHeader.labels.mobileMenu)}
      >
        <div className="fc-mobile-menu">
          <div className="fc-mobile-language" role="group" aria-label={label(siteHeader.labels.languageSelector)}>
            {languages.map((entry) => (
              <button
                type="button"
                key={entry.code}
                lang={entry.htmlLang}
                className={entry.code === language ? 'is-active' : ''}
                aria-pressed={entry.code === language}
                onClick={() => onLanguageChange(entry.code)}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {siteHeader.links.map((link) => (
            <a href={linkHref(link, language)} key={link.id} onClick={closeMenu}>
              {label(link.label)}
            </a>
          ))}

          <a
            href={siteHeader.repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="fc-mobile-gh-link"
            onClick={closeMenu}
          >
            <Github size={15} /> GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
