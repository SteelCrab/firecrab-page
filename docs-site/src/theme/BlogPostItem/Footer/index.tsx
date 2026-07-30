// swizzle --wrap: 원본 푸터(태그·수정 링크)는 그대로 두고 공유 버튼만 덧붙인다.
// 목록에서는 같은 푸터가 "자세히 보기"로 렌더링되므로 글 상세에서만 노출한다.
import type {ReactNode} from 'react';
import Footer from '@theme-original/BlogPostItem/Footer';
import type FooterType from '@theme/BlogPostItem/Footer';
import type {WrapperProps} from '@docusaurus/types';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import SharePost from '@site/src/components/SharePost';

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();

  return (
    <>
      <Footer {...props} />
      {isBlogPostPage && <SharePost />}
    </>
  );
}
