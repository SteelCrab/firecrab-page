import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import siteHeader from '../../../../src/shared/siteHeader.json';
import {languageOfLocale, type Language, type LanguageInfo} from '../../../../src/shared/language';

// 상단 헤더의 링크·문구·버전은 랜딩과 같은 src/shared/siteHeader.json 이 원본이다.

export type LocalizedLabel = Record<Language, string>;

export interface HeaderLinkData {
  id: string;
  /** landing 은 랜딩의 #앵커, docs·blog 는 이 사이트(Docusaurus)의 같은 언어판 경로다. */
  kind: 'landing' | 'docs' | 'blog';
  hash: string;
  label: LocalizedLabel;
}

export const headerLinks = siteHeader.links as HeaderLinkData[];
export const headerLabels = siteHeader.labels as Record<keyof typeof siteHeader.labels, LocalizedLabel>;
export const {version, repositoryUrl} = siteHeader;

/** siteHeader.json 의 문구는 모든 언어를 담고 있다. */
export const pick = (text: LocalizedLabel, language: Language): string => text[language] ?? text.en;

/** 지금 보고 있는 빌드의 언어. Docusaurus 로케일 'zh-Hans' 는 레지스트리의 zh 다. */
export function useHeaderLanguage(): LanguageInfo {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  return languageOfLocale(currentLocale);
}
