import siteHeader from './siteHeader.json';

/**
 * Language registry and language preference, shared by the landing page (Vite) and the
 * docs/blog (Docusaurus), so that both always agree on which language a visitor sees.
 *
 * Plain TypeScript only: no React, and no browser API is touched at import time, so both
 * bundlers (and Docusaurus' server-side render) can compile it. The data is siteHeader.json.
 */
export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'id' | 'es';

export interface LanguageInfo {
  code: Language;
  /** Name in the language itself, as shown in menus. */
  label: string;
  /** Two-letter code shown on the header trigger. */
  short: string;
  /** <html lang> value, which is also the Docusaurus locale of the docs/blog build. */
  htmlLang: string;
  /** URL prefix of the docs/blog build for this language ('' for the default Korean build). */
  docsPrefix: string;
}

export const languages = siteHeader.languages as LanguageInfo[];

export const isLanguage = (value: unknown): value is Language =>
  languages.some((language) => language.code === value);

export const languageInfo = (language: Language): LanguageInfo =>
  languages.find((entry) => entry.code === language) ?? languages[0];

/** The language of a Docusaurus locale, e.g. 'zh-Hans' -> zh. */
export const languageOfLocale = (locale: string): LanguageInfo =>
  languages.find((entry) => entry.htmlLang === locale) ?? languages[0];

/** Path inside the docs/blog build, e.g. sitePath('ja', '/docs') -> '/ja/docs'. */
export const sitePath = (language: Language, path: string): string =>
  `${languageInfo(language).docsPrefix}${path}`;

/** Drops the language prefix of a docs/blog path: '/ja/docs' -> '/docs', '/zh-Hans' -> '/'. */
export function stripLanguagePrefix(pathname: string): string {
  for (const { docsPrefix } of languages) {
    if (docsPrefix && (pathname === docsPrefix || pathname.startsWith(`${docsPrefix}/`))) {
      return pathname.slice(docsPrefix.length) || '/';
    }
  }
  return pathname;
}

const languageStorageKey = 'firecrab-language';
const browserLanguageStorageKey = 'firecrab-browser-language';

/** First language in the browser's preference list that the site supports, else English. */
export function detectBrowserLanguage(): Language {
  const tags = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const tag of tags) {
    // 'zh-Hant-TW' -> 'zh'. Chrome still reports Indonesian as 'in' on some Android builds.
    const primary = tag.toLowerCase().split('-')[0];
    const code = primary === 'in' ? 'id' : primary;
    if (isLanguage(code)) return code;
  }

  return 'en';
}

/**
 * A saved choice only wins while the browser language is unchanged, so switching the browser
 * language is still honoured.
 */
export function getPreferredLanguage(): Language {
  const browserLanguage = detectBrowserLanguage();

  try {
    const saved = window.localStorage.getItem(languageStorageKey);
    const browserLanguageAtSave = window.localStorage.getItem(browserLanguageStorageKey);
    if (isLanguage(saved) && browserLanguageAtSave === browserLanguage) return saved;
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }

  return browserLanguage;
}

export function rememberLanguage(language: Language): void {
  try {
    window.localStorage.setItem(languageStorageKey, language);
    window.localStorage.setItem(browserLanguageStorageKey, detectBrowserLanguage());
  } catch {
    // Ignore: the choice just will not persist.
  }
}
