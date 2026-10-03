import { messages } from './messages';
import type { Language } from '../../shared/language';

/**
 * Landing-page i18n.
 *
 * Korean and English are authored inline: t('한국어', 'English'). The other languages are
 * looked up in ./messages.ts by the English text, and fall back to English when a string has
 * not been translated yet. scripts/check-i18n.mjs fails the build when a string is missing.
 *
 * The language list and the language preference are shared with the docs/blog (Docusaurus)
 * through src/shared/language.ts, which reads src/shared/siteHeader.json.
 */
export {
  detectBrowserLanguage,
  getPreferredLanguage,
  isLanguage,
  languageInfo,
  languages,
  rememberLanguage,
  sitePath,
} from '../../shared/language';
export type { Language, LanguageInfo } from '../../shared/language';

export type TranslatedLanguage = Exclude<Language, 'ko' | 'en'>;

export interface LocalizedText {
  ko: string;
  en: string;
}

/** A list of strings in landingData.ts, e.g. the bullet points of a feature. */
export interface LocalizedList {
  ko: string[];
  en: string[];
}

export function translate(language: Language, ko: string, en: string): string {
  if (language === 'ko') return ko;
  if (language === 'en') return en;
  return messages[en]?.[language] ?? en;
}

export const localize = (language: Language, text: LocalizedText): string =>
  translate(language, text.ko, text.en);

export const localizeList = (language: Language, list: LocalizedList): string[] =>
  list.en.map((en, index) => translate(language, list.ko[index] ?? en, en));

/** Strings in siteHeader.json carry every language. */
export const pick = (text: Record<Language, string>, language: Language): string =>
  text[language] ?? text.en;

/** README of the firecrab repository that exists for this language (Spanish uses English). */
export const readmeFile = (language: Language): string => {
  switch (language) {
    case 'ko':
      return 'README.ko.md';
    case 'ja':
      return 'README.ja.md';
    case 'zh':
      return 'README.zh.md';
    case 'id':
      return 'README.id.md';
    default:
      return 'README.md';
  }
};
