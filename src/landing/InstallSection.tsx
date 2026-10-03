import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { readmeFile } from './i18n';
import { useI18n } from './i18n/context';
import { platformGuides, type GuideBlock, type PlatformId } from './installGuide';
import { repositoryUrl } from './landingData';
import { RichText } from './RichText';

/** Preselect the platform the visitor is probably on (phones fall back to Linux). */
const detectPlatform = (): PlatformId => {
  const hint = `${navigator.userAgent} ${navigator.platform ?? ''}`.toLowerCase();
  if (/iphone|ipad|android/.test(hint)) return 'linux';
  if (hint.includes('win')) return 'windows';
  if (hint.includes('mac')) return 'macos';
  return 'linux';
};

function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  const { loc } = useI18n();

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'text':
            return (
              <p className="fc-body-md fc-guide-text" key={index}>
                <RichText text={loc(block.text)} />
              </p>
            );
          case 'note':
            return (
              <p className="fc-guide-note" key={index}>
                <RichText text={loc(block.text)} />
              </p>
            );
          case 'code':
            return <CodeBlock key={index} code={block.code} shell={block.shell} />;
        }
      })}
    </>
  );
}

/**
 * Install section. Everything below the platform picker is ~/firecrab README.md:
 * "Installation", "Run" and "Run from source", per platform.
 */
export function InstallSection() {
  const { t, language } = useI18n();
  const [platformId, setPlatformId] = useState<PlatformId>(detectPlatform);
  const guide = platformGuides.find((entry) => entry.id === platformId) ?? platformGuides[0];

  return (
    <section className="fc-section" id="install" aria-labelledby="fc-install-title">
      <div className="fc-install-layout">
        <div className="fc-install-guide">
          <span className="fc-caption-uppercase">06 / INSTALLATION</span>
          <h2 id="fc-install-title" className="fc-display-lg">
            {t('서버는 이미 있으니까.', 'You already have the server.')}
            <br />
            <span className="fc-ink-emphasis">{t('이제 FireCrab만.', 'Now add FireCrab.')}</span>
          </h2>
          <p className="fc-body-md">
            <RichText
              text={t(
                '플랫폼을 고르세요. Linux는 `install.sh` 한 번이면 되고, macOS와 Windows(Preview)는 CLI를 설치한 뒤 `firecrab service install`로 관리용 Debian VM을 만듭니다.',
                'Pick your platform. Linux needs one `install.sh`; on macOS and Windows (Preview), install the CLI, then `firecrab service install` creates a managed Debian VM.',
              )}
            />
          </p>

          <div className="fc-platform-tabs" role="tablist" aria-label={t('플랫폼 선택', 'Choose a platform')}>
            {platformGuides.map((entry) => (
              <button
                type="button"
                role="tab"
                key={entry.id}
                id={`fc-platform-tab-${entry.id}`}
                aria-selected={entry.id === guide.id}
                aria-controls="fc-install-steps"
                className={`fc-platform-tab ${entry.id === guide.id ? 'is-active' : ''}`}
                onClick={() => setPlatformId(entry.id)}
              >
                <span className="fc-platform-name">
                  {entry.name}
                  {entry.preview ? <span className="fc-badge-pill">Preview</span> : null}
                </span>
                <span className="fc-platform-caption">{entry.caption}</span>
              </button>
            ))}
          </div>

          <div className="fc-install-actions">
            <a
              href={`${repositoryUrl}/blob/main/public-docs/installation.md`}
              target="_blank"
              rel="noreferrer"
              className="fc-link-action"
            >
              <BookOpen size={16} />
              <span>{t('전체 설치 가이드', 'Full installation guide')}</span>
              <span>↗</span>
            </a>
            <a
              href={`${repositoryUrl}/blob/main/${readmeFile(language)}`}
              target="_blank"
              rel="noreferrer"
              className="fc-link-action-subtle"
            >
              {readmeFile(language)} ↗
            </a>
          </div>
        </div>

        <div
          className="fc-install-steps"
          id="fc-install-steps"
          role="tabpanel"
          aria-labelledby={`fc-platform-tab-${guide.id}`}
        >
          <article className="fc-phase-card">
            <header className="fc-phase-head">
              <span className="fc-workflow-badge">01</span>
              <h3 className="fc-title-md">{t('설치', 'Installation')}</h3>
            </header>
            <GuideBlocks blocks={guide.install} />
          </article>

          <article className="fc-phase-card">
            <header className="fc-phase-head">
              <span className="fc-workflow-badge">02</span>
              <h3 className="fc-title-md">{t('실행', 'Run')}</h3>
            </header>
            <GuideBlocks blocks={guide.run} />
          </article>

          <details className="fc-phase-card fc-phase-details">
            <summary className="fc-phase-head">
              <span className="fc-workflow-badge">03</span>
              <h3 className="fc-title-md">{t('소스 실행', 'Run from source')}</h3>
              <span className="fc-phase-hint">
                {t(
                  'Linux API·대시보드 / macOS·Windows CLI',
                  'Linux API and dashboard / macOS and Windows CLI',
                )}
              </span>
            </summary>
            <GuideBlocks blocks={guide.source} />
          </details>
        </div>
      </div>
    </section>
  );
}
