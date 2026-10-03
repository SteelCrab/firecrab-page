// eject: 원본은 navbar.items 를 선언한 순서대로 Infima 메뉴 목록에 늘어놓는다.
// 랜딩의 모바일 서랍과 같은 순서(언어 격자 → 링크 → GitHub)로 놓는다.
// 막대의 설치하기 버튼은 링크 목록에 같은 항목이 있어 서랍에서는 빠진다.
import type {ReactNode} from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';

const drawerOrder = ['custom-fcLanguage', 'custom-fcLink', 'custom-fcStar'];

export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];

  return (
    <div className="fc-mobile-menu">
      {drawerOrder.flatMap((type) =>
        items
          .filter((item) => item.type === type)
          .map((item, index) => (
            <NavbarItem
              mobile
              {...item}
              onClick={() => mobileSidebar.toggle()}
              key={`${type}-${index}`}
            />
          )),
      )}
    </div>
  );
}
