import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import siteHeader from '../src/shared/siteHeader.json';
import {languageOfLocale, languages, type Language} from '../src/shared/language';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// 언어 목록·상단 헤더 링크는 랜딩과 같은 src/shared/ (siteHeader.json, language.ts)에서 가져온다.
// 문서·블로그는 언어마다 별도 빌드이며, Docusaurus 로케일 이름은 레지스트리의 htmlLang 이다.
const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'ko';
const currentLanguage = languageOfLocale(currentLocale);
const tx = (strings: Record<Language, string>): string => strings[currentLanguage.code];

// 랜딩은 Docusaurus 밖(Vite)이라 이 사이트의 라우트가 아니다. 랜딩으로 나가는 링크는 원시 <a> 로
// 넣어 전체 페이지 이동이 일어나게 한다(SiteHeader 컴포넌트, 푸터 html 항목).
const landingUrl = 'https://firecrab.dev/';
const docsUrl = `${currentLanguage.docsPrefix}/docs`;
const blogUrl = `${currentLanguage.docsPrefix}/blog`;
const repositoryUrl = siteHeader.repositoryUrl;
const editUrl = 'https://github.com/SteelCrab/firecrab-page/tree/main/docs-site/';

// 문서·블로그 본문은 한국어(원문)와 영어(i18n/en)만 번역돼 있다. 번역이 없는 로케일은 Docusaurus 가
// 기본 로케일(한국어) 원문으로 채우는데, ja·zh-Hans·id·es 방문자에게는 영어가 낫다. 그래서 이
// 로케일은 영어 번역본 폴더를 원문 경로로 쓴다. i18n/<locale>/ 에 번역 파일을 두면 그 파일만
// 우선하고 나머지는 계속 영어로 채워진다(README 의 "Languages" 참고).
const usesEnglishContent = currentLanguage.code !== 'ko' && currentLanguage.code !== 'en';
const docsPath = usesEnglishContent ? 'i18n/en/docusaurus-plugin-content-docs/current' : 'docs';
const blogPath = usesEnglishContent ? 'i18n/en/docusaurus-plugin-content-blog' : 'blog';

const blogTitle = tx({
  ko: 'FireCrab 블로그',
  en: 'FireCrab Blog',
  ja: 'FireCrab ブログ',
  zh: 'FireCrab 博客',
  id: 'Blog FireCrab',
  es: 'Blog de FireCrab',
});
const blogDescription = tx({
  ko: 'FireCrab 개발 기록과 릴리스 소식',
  en: 'Development notes and release news for FireCrab',
  ja: 'FireCrab の開発記録とリリース情報',
  zh: 'FireCrab 开发记录与发布动态',
  id: 'Catatan pengembangan dan kabar rilis FireCrab',
  es: 'Notas de desarrollo y novedades de versiones de FireCrab',
});
const blogSidebarTitle = tx({
  ko: '최근 글',
  en: 'Recent posts',
  ja: '最近の投稿',
  zh: '近期文章',
  id: 'Postingan terbaru',
  es: 'Entradas recientes',
});

const config: Config = {
  title: 'FireCrab',
  tagline: 'Firecracker 기반 MicroVM 관리 플랫폼',
  // 랜딩(index.html)의 <link rel="icon"> 과 같은 파일이어야 탭 아이콘이 통일된다.
  favicon: 'img/firecrab-icon.png',

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://firecrab.dev',
  // 랜딩(Vite SPA)과 같은 도메인을 쓴다. baseUrl은 루트로 두고 플러그인별 routeBasePath로
  // /docs 와 /blog 를 형제 경로로 나눈다. 사이트 루트(/)는 랜딩이 차지하므로 여기서는
  // 어떤 라우트도 만들지 않는다.
  baseUrl: '/',

  organizationName: 'SteelCrab',
  projectName: 'firecrab-page',

  onBrokenLinks: 'throw',

  // 랜딩(index.html)과 같은 웹폰트. 상단 헤더가 랜딩과 같은 글꼴로 그려지게 한다.
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap',
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css',
  ],
  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
  ],

  // 블로그·문서 아키텍처 다이어그램용. ```mermaid 코드 블록을 렌더한다.
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  // ko 가 기본이고 나머지는 /<locale>/ 아래로 빌드된다. 로케일 이름·라벨·경로는 랜딩과 공유하는
  // src/shared/siteHeader.json 의 언어 목록이 원본이다.
  i18n: {
    defaultLocale: 'ko',
    locales: languages.map((language) => language.htmlLang),
    localeConfigs: Object.fromEntries(
      languages.map((language) => [language.htmlLang, {label: language.label, htmlLang: language.htmlLang}]),
    ),
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: docsPath,
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          editUrl,
        },
        blog: {
          path: blogPath,
          routeBasePath: '/blog',
          showReadingTime: true,
          blogTitle,
          blogDescription,
          blogSidebarTitle,
          // 기본값 5면 최신 글만 남고 7월 글이 사이드바에서 빠진다.
          blogSidebarCount: 'ALL',
          // 최신 작성일 우선. 같은 시각이면 파일 경로로 안정 정렬.
          sortPosts: 'descending',
          processBlogPosts: async ({blogPosts}) =>
            [...blogPosts].sort((a, b) => {
              const byDate =
                b.metadata.date.getTime() - a.metadata.date.getTime();
              if (byDate !== 0) {
                return byDate;
              }
              return b.metadata.source.localeCompare(a.metadata.source);
            }),
          editUrl,
          feedOptions: {
            type: ['rss', 'atom'],
            // 지정하지 않으면 로케일과 무관하게 "<siteTitle> Blog"가 쓰인다.
            title: blogTitle,
            description: blogDescription,
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og.png',
    colorMode: {
      // 랜딩이 라이트 전용이라 다크 모드를 두지 않는다. 남겨두면 문서에만 토글이 생겨
      // 상단 바 구성이 랜딩과 달라진다.
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      // 로고·제목은 두지 않는다. 랜딩과 같은 워드마크(로고 · FireCrab · 버전)를
      // src/theme/Navbar/Content 가 직접 그린다.
      // 랜딩 헤더와 같은 구성(링크 7개 · 언어 메뉴 · Star · 설치하기). 항목의 렌더링은
      // src/theme/NavbarItem/ComponentTypes.tsx 에 등록한 custom-fc* 컴포넌트가 맡고,
      // 링크 목록은 src/shared/siteHeader.json 이 원본이다.
      items: [
        ...siteHeader.links.map((link) => ({
          type: 'custom-fcLink',
          position: 'left' as const,
          linkId: link.id,
        })),
        {type: 'custom-fcLanguage', position: 'right' as const},
        {type: 'custom-fcStar', position: 'right' as const},
        {type: 'custom-fcInstall', position: 'right' as const},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: tx({ko: '문서', en: 'Docs', ja: 'ドキュメント', zh: '文档', id: 'Dokumentasi', es: 'Documentación'}),
          items: [
            {
              label: tx({ko: '소개', en: 'Introduction', ja: 'はじめに', zh: '简介', id: 'Pengantar', es: 'Introducción'}),
              href: docsUrl,
            },
            {
              label: tx({ko: '블로그', en: 'Blog', ja: 'ブログ', zh: '博客', id: 'Blog', es: 'Blog'}),
              href: blogUrl,
            },
          ],
        },
        {
          title: tx({ko: '서비스', en: 'Services', ja: 'サービス', zh: '服务', id: 'Layanan', es: 'Servicios'}),
          items: [
            {
              html: `<a class="footer__link-item" href="${landingUrl}">${tx({
                ko: 'FireCrab 홈',
                en: 'FireCrab home',
                ja: 'FireCrab ホーム',
                zh: 'FireCrab 首页',
                id: 'Beranda FireCrab',
                es: 'Inicio de FireCrab',
              })}</a>`,
            },
            {label: 'GitHub', href: repositoryUrl},
          ],
        },
        {
          title: tx({ko: '커뮤니티', en: 'Community', ja: 'コミュニティ', zh: '社区', id: 'Komunitas', es: 'Comunidad'}),
          items: [
            {label: 'Issues', href: `${repositoryUrl}/issues`},
            {label: 'Discussions', href: `${repositoryUrl}/discussions`},
          ],
        },
        // 상단 바의 언어 메뉴는 보고 있는 페이지의 같은 언어판으로 보내고, 푸터는 각 언어의 문서 첫
        // 화면으로 보낸다. 로케일마다 별도 빌드라 Docusaurus 라우트가 아니므로 원시 HTML 로 넣는다.
        // data-firecrab-locale 은 theme/Root 가 선택한 언어를 기억하는 데 쓴다.
        {
          title: tx({ko: '언어', en: 'Language', ja: '言語', zh: '语言', id: 'Bahasa', es: 'Idioma'}),
          items: languages.map((language) => ({
            html: `<a class="footer__link-item" data-firecrab-locale="${language.code}" lang="${language.htmlLang}" href="${language.docsPrefix}/docs">${language.label}</a>`,
          })),
        },
      ],
      copyright: `© ${new Date().getFullYear()} FireCrab.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
