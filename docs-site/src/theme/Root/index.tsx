import {useEffect, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  getPreferredLanguage,
  isLanguage,
  languageOfLocale,
  rememberLanguage,
  sitePath,
  stripLanguagePrefix,
} from '../../../../src/shared/language';

// 언어 선택·기억·경로 규칙은 랜딩과 같은 src/shared/language.ts 를 쓴다. 두 앱이 항상 같은 언어를 고른다.

export default function Root({children}: {children: ReactNode}) {
  const {i18n} = useDocusaurusContext();

  // 선호 언어(저장된 선택 > 브라우저 언어)와 지금 보는 언어판이 다르면 같은 경로의 선호 언어판으로 보낸다.
  useEffect(() => {
    const preferredLanguage = getPreferredLanguage();
    if (preferredLanguage === languageOfLocale(i18n.currentLocale).code) return;

    const nextPath = sitePath(preferredLanguage, stripLanguagePrefix(window.location.pathname));
    window.location.replace(`${nextPath}${window.location.search}${window.location.hash}`);
  }, [i18n.currentLocale]);

  // 상단 헤더·푸터의 언어 링크를 누르면 그 언어를 선호 언어로 저장한다. 안 하면 위 효과가 되돌려 보낸다.
  useEffect(() => {
    const rememberChoice = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const localeLink = target.closest<HTMLElement>('[data-firecrab-locale]');
      const language = localeLink?.dataset.firecrabLocale;
      if (isLanguage(language)) rememberLanguage(language);
    };

    document.addEventListener('click', rememberChoice);
    return () => document.removeEventListener('click', rememberChoice);
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
