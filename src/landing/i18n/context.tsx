import { createContext, useContext, type ReactNode } from 'react';
import {
  localize,
  localizeList,
  sitePath,
  translate,
  type Language,
  type LocalizedList,
  type LocalizedText,
} from './index';

export interface I18n {
  language: Language;
  /** Inline text: t('한국어', 'English'). Other languages come from messages.ts. */
  t: (ko: string, en: string) => string;
  /** Text from landingData.ts: loc({ ko, en }). */
  loc: (text: LocalizedText) => string;
  /** Bullet lists from landingData.ts: list({ ko: [...], en: [...] }). */
  list: (items: LocalizedList) => string[];
  /** Path inside the docs/blog build for the current language. */
  path: (path: string) => string;
}

export function createI18n(language: Language): I18n {
  return {
    language,
    t: (ko, en) => translate(language, ko, en),
    loc: (text) => localize(language, text),
    list: (items) => localizeList(language, items),
    path: (path) => sitePath(language, path),
  };
}

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ value, children }: { value: I18n; children: ReactNode }) {
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
  return value;
}
