// swizzle --wrap: 목록 뷰에서 BlogPostItem 이 붙이는 margin-bottom--xl 을 걷어낸다.
//
// 이 여백은 카드 그리드에서 트랙 높이에 그대로 더해져 카드 아래에 80px 빈칸을 만든다.
// custom.css 로는 못 지운다 — Infima 의 .margin-bottom--xl 은 !important 이고
// @layer docusaurus.infima 안에 있는데, important 선언은 레이어 우선순위가 역전되어
// 레이어 없는 사이트 CSS 의 !important 보다 강하다. 그래서 클래스 자체를 뺀다.
// 카드 사이 간격은 그리드 gap 이 담당한다.
import type {ReactNode} from 'react';
import Container from '@theme-original/BlogPostItem/Container';
import type ContainerType from '@theme/BlogPostItem/Container';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContainerType>;

export default function ContainerWrapper({
  className,
  ...props
}: Props): ReactNode {
  const withoutListMargin = className
    ?.split(' ')
    .filter((name) => name !== 'margin-bottom--xl')
    .join(' ');

  return <Container {...props} className={withoutListMargin || undefined} />;
}
