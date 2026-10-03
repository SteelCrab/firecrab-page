import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {useHistorySelector} from '@docusaurus/theme-common';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {languages, type LanguageInfo} from '../../../../src/shared/language';
import {headerLabels, pick, useHeaderLanguage} from './data';
import {ChevronDownIcon, LanguagesIcon} from './icons';

/**
 * 같은 페이지의 다른 언어판 주소. 언어마다 따로 빌드한 사이트라 Docusaurus 라우트가 아니고,
 * 전체 페이지 이동이 일어나야 하므로 원시 <a> 로 쓴다.
 */
function useLanguageHref(): (entry: LanguageInfo) => string {
  const {createUrl} = useAlternatePageUtils();
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);

  return (entry) => `${createUrl({locale: entry.htmlLang, fullyQualified: false})}${search}${hash}`;
}

/**
 * 헤더의 언어 드롭다운. 마크업과 클래스(fc-language-*)는 랜딩의 src/landing/LanguageMenu.tsx 와
 * 같고 src/shared/site-header.css 가 꾸민다. 항목만 버튼이 아니라 링크다.
 * data-firecrab-locale 은 theme/Root 가 고른 언어를 기억하는 데 쓴다.
 */
export function LanguageDropdown(): ReactNode {
  const language = useHeaderLanguage();
  const hrefFor = useLanguageHref();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="fc-language-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="fc-language-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${pick(headerLabels.languageSelector, language.code)}: ${language.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <LanguagesIcon size={13} />
        <span>{language.short}</span>
        <ChevronDownIcon size={12} />
      </button>

      {open && (
        <ul className="fc-language-list" id={listId}>
          {languages.map((entry) => (
            <li key={entry.code}>
              <a
                href={hrefFor(entry)}
                lang={entry.htmlLang}
                hrefLang={entry.htmlLang}
                data-firecrab-locale={entry.code}
                aria-current={entry.code === language.code ? 'true' : undefined}
              >
                <span>{entry.label}</span>
                <span className="fc-language-code">{entry.short}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** 모바일 서랍 맨 위의 언어 격자(랜딩 서랍과 같다). */
export function LanguageGrid(): ReactNode {
  const language = useHeaderLanguage();
  const hrefFor = useLanguageHref();

  return (
    <div
      className="fc-mobile-language"
      role="group"
      aria-label={pick(headerLabels.languageSelector, language.code)}
    >
      {languages.map((entry) => (
        <a
          key={entry.code}
          href={hrefFor(entry)}
          lang={entry.htmlLang}
          hrefLang={entry.htmlLang}
          data-firecrab-locale={entry.code}
          className={entry.code === language.code ? 'is-active' : undefined}
          aria-current={entry.code === language.code ? 'true' : undefined}
        >
          {entry.label}
        </a>
      ))}
    </div>
  );
}
