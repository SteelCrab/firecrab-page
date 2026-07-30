import {useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

function XIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.8L23 22h-6.3l-4.9-6.4L6.2 22H3.1l7.2-8.3L2.3 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.7L8.3 3.8H6.5L17.8 20Z" />
    </svg>
  );
}

function LinkedInIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05C21.6 8.65 23 10.9 23 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.03 0-2.34 1.58-2.34 3.21V21h-4V9Z" />
    </svg>
  );
}

function LinkIcon(): ReactNode {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.6 13.4a1 1 0 0 0 1.4 0l3.5-3.5a2 2 0 1 0-2.8-2.9l-1 1a1 1 0 0 0 1.4 1.5l1-1a.1.1 0 0 1 .1.1l-3.5 3.4a1 1 0 0 0 0 1.4Zm2.8-2.8a1 1 0 0 0-1.4 0l-3.5 3.5a2 2 0 1 0 2.8 2.9l1-1a1 1 0 1 0-1.4-1.5l-1 1a.1.1 0 0 1-.1-.1l3.5-3.4a1 1 0 0 0 .1-1.4Z" />
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z" />
    </svg>
  );
}

export default function SharePost(): ReactNode {
  const {metadata} = useBlogPost();
  const {siteConfig} = useDocusaurusContext();
  const [copied, setCopied] = useState(false);

  // permalink 은 로케일 접두까지 포함된 경로다. 공유 링크는 절대 URL 이어야 한다.
  const url = new URL(metadata.permalink, siteConfig.url).href;
  const shareText = `${metadata.title} — ${siteConfig.title}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // 클립보드 권한이 없으면 조용히 넘어간다. 주소창으로 복사하면 된다.
    }
  };

  return (
    <div className={styles.share}>
      <span className={styles.label}>
        <Translate id="blog.share.label">공유</Translate>
      </span>

      <button
        type="button"
        className={clsx(styles.button, copied && styles.copied)}
        onClick={copyLink}
      >
        <LinkIcon />
        {copied ? (
          <Translate id="blog.share.copied">복사됨</Translate>
        ) : (
          <Translate id="blog.share.copy">링크 복사</Translate>
        )}
      </button>

      <a
        className={styles.button}
        href={`https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={translate({id: 'blog.share.x', message: 'X에 공유'})}
      >
        <XIcon />X
      </a>

      <a
        className={styles.button}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={translate({id: 'blog.share.linkedin', message: 'LinkedIn에 공유'})}
      >
        <LinkedInIcon />
        LinkedIn
      </a>
    </div>
  );
}
