import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// 랜딩(/)은 이 사이트의 라우트가 아니다. Docusaurus의 Link는 to/href를 가리지 않고 내부
// 링크를 SPA 라우팅으로 처리하므로, 랜딩으로 나가는 링크는 원시 HTML <a>로 넣어 전체 페이지
// 이동이 일어나게 한다. 원시 HTML은 번역 JSON을 타지 않으므로 라벨만 로케일별로 직접 고른다.
const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'ko';
const t = <T,>(ko: T, en: T): T => (currentLocale === 'en' ? en : ko);

const landingUrl = '/';
const docsUrl = currentLocale === 'en' ? '/en/docs' : '/docs';
const blogUrl = currentLocale === 'en' ? '/en/blog' : '/blog';
const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const editUrl = 'https://github.com/SteelCrab/firecrab-page/tree/main/docs-site/';

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

  // 블로그·문서 아키텍처 다이어그램용. ```mermaid 코드 블록을 렌더한다.
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    localeConfigs: {
      ko: {label: '한국어'},
      en: {label: 'English'},
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: './sidebars.ts',
          editUrl,
        },
        blog: {
          routeBasePath: '/blog',
          showReadingTime: true,
          blogTitle: 'FireCrab 블로그',
          blogDescription: 'FireCrab 개발 기록과 릴리스 소식',
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
            title: t('FireCrab 블로그', 'FireCrab Blog'),
            description: t(
              'FireCrab 개발 기록과 릴리스 소식',
              'Development notes and release news for FireCrab',
            ),
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
      title: 'FireCrab',
      logo: {
        alt: 'FireCrab',
        src: 'img/firecrab-icon.png',
        // 기본값은 baseUrl(=/)인데 그건 랜딩이라 Docusaurus 라우트가 없다. 브랜드는 문서 홈으로.
        href: docsUrl,
      },
      // 랜딩 헤더(.fc-nav-links)와 같은 항목·순서를 유지한다. 랜딩 섹션 앵커는 baseUrl
      // 밖이라 원시 HTML로 넣는다.
      items: [
        {
          type: 'html',
          position: 'left',
          value: `<a class="navbar__item navbar__link" href="/#product">${t('서비스', 'Services')}</a>`,
        },
        {
          type: 'html',
          position: 'left',
          value: `<a class="navbar__item navbar__link" href="/#workflow">${t('사용 흐름', 'Workflow')}</a>`,
        },
        {
          type: 'html',
          position: 'left',
          value: `<a class="navbar__item navbar__link" href="/#install">${t('설치', 'Install')}</a>`,
        },
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: t('문서', 'Docs'),
        },
        {
          type: 'html',
          position: 'left',
          value: `<a class="navbar__item navbar__link" href="${blogUrl}">${t('블로그', 'Blog')}</a>`,
        },
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
        },
        {
          href: repositoryUrl,
          label: t('현재 구현 보기', 'View source'),
          position: 'right',
          className: 'fc-navbar-cta',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: t('문서', 'Docs'),
          items: [
            {label: t('소개', 'Introduction'), href: docsUrl},
            {label: t('블로그', 'Blog'), href: blogUrl},
          ],
        },
        {
          title: t('서비스', 'Services'),
          items: [
            {
              html: `<a class="footer__link-item" href="${landingUrl}">${t(
                'FireCrab 홈',
                'FireCrab home',
              )}</a>`,
            },
            {label: 'GitHub', href: repositoryUrl},
          ],
        },
        {
          title: t('커뮤니티', 'Community'),
          items: [
            {label: 'Issues', href: `${repositoryUrl}/issues`},
            {label: 'Discussions', href: `${repositoryUrl}/discussions`},
          ],
        },
        // 상단 바를 랜딩과 같게 유지하려고 로케일 드롭다운을 뺐으므로 언어 전환은 여기에 둔다.
        // 서로 다른 로케일 빌드의 경로라 Docusaurus 라우트가 아니고, 원시 HTML로 넣는다.
        {
          title: t('언어', 'Language'),
          items: [
            {html: '<a class="footer__link-item" data-firecrab-locale="ko" href="/docs">한국어</a>'},
            {html: '<a class="footer__link-item" data-firecrab-locale="en" href="/en/docs">English</a>'},
          ],
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
