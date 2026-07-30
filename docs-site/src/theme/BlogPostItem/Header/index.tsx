// swizzle --wrap: 원본 헤더(제목·날짜·작성자)는 그대로 두고, 글 상세에서만
// 오른쪽 위에 링크 복사 버튼을 붙인다. 목록 카드에는 넣지 않는다.
import type {ReactNode} from 'react';
import Header from '@theme-original/BlogPostItem/Header';
import type HeaderType from '@theme/BlogPostItem/Header';
import type {WrapperProps} from '@docusaurus/types';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import CopyLink from '@site/src/components/CopyLink';
import styles from './styles.module.css';

type Props = WrapperProps<typeof HeaderType>;

export default function HeaderWrapper(props: Props): ReactNode {
  const {isBlogPostPage} = useBlogPost();

  if (!isBlogPostPage) {
    return <Header {...props} />;
  }

  return (
    <div className={styles.header}>
      <div className={styles.main}>
        <Header {...props} />
      </div>
      <CopyLink />
    </div>
  );
}
