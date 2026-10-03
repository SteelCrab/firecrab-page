import {useEffect, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {headerLabels, headerLinks, pick, repositoryUrl, useHeaderLanguage, version} from './data';
import {CloseIcon, GithubIcon, MenuIcon} from './icons';
import {LanguageDropdown, LanguageGrid} from './LanguageMenu';

/**
 * 문서·블로그의 상단 헤더. 랜딩(src/landing/SiteHeader.tsx)과 같은 마크업·클래스를 쓰고,
 * 스타일은 src/shared/site-header.css, 내용은 src/shared/siteHeader.json 이 원본이다.
 *
 * 구성 항목은 docusaurus.config.ts 의 navbar.items 에 custom-fc* 타입으로 선언돼 있고
 * (theme/NavbarItem/ComponentTypes.tsx 에서 아래 컴포넌트에 연결), 데스크톱 막대는
 * theme/Navbar/Content, 모바일 서랍은 theme/Navbar/MobileSidebar/PrimaryMenu 가 배치한다.
 */

interface ItemProps {
  /** 모바일 서랍 안에서 그려질 때 true. */
  mobile?: boolean;
  /** 서랍을 닫는 콜백(Docusaurus 가 항목마다 넘긴다). */
  onClick?: () => void;
}

/** 지금 어느 영역(문서/블로그)을 보고 있는지. 링크의 활성 표시에 쓴다. */
function useActiveSection(): 'docs' | 'blog' | null {
  const {pathname} = useLocation();
  const docs = useBaseUrl('/docs');
  const blog = useBaseUrl('/blog');
  const within = (base: string) => pathname === base || pathname.startsWith(`${base}/`);

  if (within(docs)) return 'docs';
  if (within(blog)) return 'blog';
  return null;
}

export function Wordmark(): ReactNode {
  const iconUrl = useBaseUrl('/img/firecrab-icon.png');

  // 랜딩(/)은 이 사이트의 라우트가 아니므로 원시 <a> 로 전체 페이지 이동을 일으킨다.
  return (
    <a className="fc-wordmark" href="/" aria-label="FireCrab">
      <img src={iconUrl} alt="" aria-hidden="true" />
      <span className="fc-wordmark-title">FireCrab</span>
      <span className="fc-version-pill">{version}</span>
    </a>
  );
}

/** 막대의 햄버거 버튼. 서랍(Docusaurus 모바일 사이드바)을 열고 닫으며 열린 동안 Esc 로 닫는다. */
export function MenuButton(): ReactNode {
  const language = useHeaderLanguage();
  const {shown, toggle} = useNavbarMobileSidebar();

  useEffect(() => {
    if (!shown) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') toggle();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [shown, toggle]);

  return (
    <button
      className="fc-menu-button"
      type="button"
      aria-label={pick(shown ? headerLabels.closeMenu : headerLabels.openMenu, language.code)}
      aria-expanded={shown}
      onClick={toggle}
    >
      {shown ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
    </button>
  );
}

/** custom-fcLink: 특징·비교·컴포넌트·아키텍처·설치하기(랜딩 앵커)와 문서·블로그. */
export function HeaderLink({linkId, onClick}: ItemProps & {linkId: string}): ReactNode {
  const language = useHeaderLanguage();
  const section = useActiveSection();
  const link = headerLinks.find((entry) => entry.id === linkId);

  if (!link) return null;
  const text = pick(link.label, language.code);

  // 랜딩 섹션은 다른 앱이다. Link 로 넣으면 broken-link 검사에 걸리고 404 로 라우팅된다.
  if (link.kind === 'landing') {
    return (
      <a href={`/#${link.hash}`} onClick={onClick}>
        {text}
      </a>
    );
  }

  // 문서·블로그는 같은 언어판 안이라 Link 가 baseUrl(/ja/ 등)을 붙이고 SPA 로 이동한다.
  const active = section === link.kind;
  return (
    <Link
      to={`/${link.kind}`}
      className={active ? 'is-active' : undefined}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {text}
    </Link>
  );
}

/** custom-fcLanguage: 막대에서는 드롭다운, 서랍에서는 언어 격자. */
export function HeaderLanguage({mobile}: ItemProps): ReactNode {
  return mobile ? <LanguageGrid /> : <LanguageDropdown />;
}

/** custom-fcStar: 막대에서는 Star 알약, 서랍에서는 맨 아래 GitHub 링크. */
export function HeaderStar({mobile, onClick}: ItemProps): ReactNode {
  const language = useHeaderLanguage();

  if (mobile) {
    return (
      <a href={repositoryUrl} target="_blank" rel="noreferrer" className="fc-mobile-gh-link" onClick={onClick}>
        <GithubIcon size={15} /> GitHub ↗
      </a>
    );
  }

  return (
    <a className="fc-github-pill" href={repositoryUrl} target="_blank" rel="noreferrer">
      <GithubIcon size={15} />
      <span>{pick(headerLabels.star, language.code)}</span>
    </a>
  );
}

/** custom-fcInstall: 막대의 주황색 CTA. 서랍에는 같은 링크가 이미 목록에 있어 그리지 않는다. */
export function HeaderInstall({mobile}: ItemProps): ReactNode {
  const language = useHeaderLanguage();
  const install = headerLinks.find((entry) => entry.id === 'install');

  if (mobile) return null;

  return (
    <a className="fc-btn-primary" href={`/#${install?.hash ?? 'install'}`}>
      {pick(headerLabels.install, language.code)}
    </a>
  );
}
