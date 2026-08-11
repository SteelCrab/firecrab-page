import {useEffect, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Language = 'ko' | 'en';

const languageStorageKey = 'firecrab-language';
const browserLanguageStorageKey = 'firecrab-browser-language';

function getBrowserLanguage(): Language {
  const browserLanguage = window.navigator.languages?.[0] ?? window.navigator.language;
  return browserLanguage.toLowerCase().startsWith('ko') ? 'ko' : 'en';
}

function getPreferredLanguage(): Language {
  const browserLanguage = getBrowserLanguage();
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  const browserLanguageAtSave = window.localStorage.getItem(browserLanguageStorageKey);

  if (
    (savedLanguage === 'ko' || savedLanguage === 'en') &&
    browserLanguageAtSave === browserLanguage
  ) {
    return savedLanguage;
  }

  return browserLanguage;
}

function localizedPath(path: string, language: Language): string {
  const pathWithoutEnglishLocale = path.replace(/^\/en(?=\/|$)/, '') || '/';
  return language === 'en' ? `/en${pathWithoutEnglishLocale}` : pathWithoutEnglishLocale;
}

export default function Root({children}: {children: ReactNode}) {
  const {i18n} = useDocusaurusContext();

  useEffect(() => {
    const preferredLanguage = getPreferredLanguage();
    if (preferredLanguage === i18n.currentLocale) return;

    const nextPath = localizedPath(window.location.pathname, preferredLanguage);
    window.location.replace(`${nextPath}${window.location.search}${window.location.hash}`);
  }, [i18n.currentLocale]);

  useEffect(() => {
    const rememberLanguage = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const localeLink = target.closest<HTMLElement>('[data-firecrab-locale]');
      const locale = localeLink?.dataset.firecrabLocale;
      if (locale === 'ko' || locale === 'en') {
        window.localStorage.setItem(languageStorageKey, locale);
        window.localStorage.setItem(browserLanguageStorageKey, getBrowserLanguage());
      }
    };

    document.addEventListener('click', rememberLanguage);
    return () => document.removeEventListener('click', rememberLanguage);
  }, []);

  useEffect(() => {
    const keepTitle = () => {
      if (document.title !== 'FireCrab') document.title = 'FireCrab';
    };

    keepTitle();
    const observer = new MutationObserver(keepTitle);
    observer.observe(document.head, {childList: true, subtree: true, characterData: true});
    return () => observer.disconnect();
  }, []);

  return children;
}
