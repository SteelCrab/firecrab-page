// eject: 원본은 [햄버거·로고·왼쪽 항목 | 오른쪽 항목·색상 토글·검색] 의 Infima 막대다.
// 랜딩 헤더와 같은 [로고·버전 | 링크 | 언어·Star·설치하기 · 햄버거] 배치로 바꾼다.
// 클래스(fc-*)는 src/shared/site-header.css 가 꾸민다.
import type {ReactNode} from 'react';
import {ErrorCauseBoundary, useThemeConfig} from '@docusaurus/theme-common';
import {splitNavbarItems, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import {MenuButton, Wordmark} from '@site/src/components/SiteHeader';

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const [leftItems, rightItems] = splitNavbarItems(useNavbarItems());

  return (
    <div className="fc-nav-shell">
      <Wordmark />

      {/* 바깥 <nav class="navbar"> 가 이미 내비게이션 랜드마크라 여기는 div 로 둔다. */}
      <div className="fc-desktop-nav">
        <NavbarItems items={leftItems} />
      </div>

      <div className="fc-nav-actions">
        <NavbarItems items={rightItems} />
      </div>

      {!mobileSidebar.disabled && <MenuButton />}
    </div>
  );
}
