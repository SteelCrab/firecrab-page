import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

function LinkIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1 1a1 1 0 0 0 1.4 1.4l1-1a1.54 1.54 0 0 1 2.2 2.2l-3 3a1.5 1.5 0 0 1-2.2 0 1 1 0 0 0-1.4 1.4Z" />
      <path d="M14.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1-1a1 1 0 0 0-1.4-1.4l-1 1a1.54 1.54 0 0 1-2.2-2.2l3-3a1.5 1.5 0 0 1 2.2 0 1 1 0 0 0 1.4-1.4Z" />
    </svg>
  );
}

export default function CopyLink(): ReactNode {
  const {metadata} = useBlogPost();
  const {siteConfig} = useDocusaurusContext();
  const [copied, setCopied] = useState(false);

  // permalink 은 로케일 접두를 포함한 경로다. 공유 링크는 절대 URL 이어야 한다.
  const url = new URL(metadata.permalink, siteConfig.url).href;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 권한이 없으면 조용히 넘어간다. 주소창에서 복사하면 된다.
    }
  };

  return (
    <button
      type="button"
      className={clsx(styles.button, copied && styles.copied)}
      onClick={copyLink}
      title={translate({id: 'blog.share.copyTitle', message: '이 글의 링크 복사'})}
    >
      <LinkIcon />
      {copied ? (
        <Translate id="blog.share.copied">복사됨</Translate>
      ) : (
        <Translate id="blog.share.copy">링크 복사</Translate>
      )}
    </button>
  );
}
