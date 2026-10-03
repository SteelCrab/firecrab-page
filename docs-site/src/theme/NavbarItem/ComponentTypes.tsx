// wrap: 랜딩과 같은 상단 헤더를 이루는 항목 타입을 등록한다(navbar.items 의 type: 'custom-fc*').
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import {
  HeaderInstall,
  HeaderLanguage,
  HeaderLink,
  HeaderStar,
} from '@site/src/components/SiteHeader';

export default {
  ...ComponentTypes,
  'custom-fcLink': HeaderLink,
  'custom-fcLanguage': HeaderLanguage,
  'custom-fcStar': HeaderStar,
  'custom-fcInstall': HeaderInstall,
};
