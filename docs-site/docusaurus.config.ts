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
const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const editUrl = 'https://github.com/SteelCrab/firecrab-page/tree/main/docs-site/';

const config: Config = {
  title: 'FireCrab',
  tagline: 'Firecracker 기반 MicroVM 관리 플랫폼',
  favicon: 'img/favicon.svg',

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
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'FireCrab',
      logo: {
        alt: 'FireCrab',
        src: 'img/firecrab-icon.png',
        // 기본값은 baseUrl(=/)인데 그건 랜딩이라 Docusaurus 라우트가 없다. 브랜드는 문서 홈으로.
        href: '/docs',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: '문서',
        },
        {to: '/blog', label: '블로그', position: 'left'},
        {
          type: 'html',
          position: 'left',
          value: `<a class="navbar__item navbar__link" href="${landingUrl}">${t('홈', 'Home')}</a>`,
        },
        {type: 'localeDropdown', position: 'right'},
        {
          href: repositoryUrl,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '문서',
          items: [
            {label: '소개', to: '/docs'},
            {label: '블로그', to: '/blog'},
          ],
        },
        {
          title: '제품',
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
          title: '커뮤니티',
          items: [
            {label: 'Issues', href: `${repositoryUrl}/issues`},
            {label: 'Discussions', href: `${repositoryUrl}/discussions`},
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
