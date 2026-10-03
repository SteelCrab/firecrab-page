import { useI18n } from './i18n/context';
import { architectureBlocks, architectureIntro } from './landingData';
import { RichText } from './RichText';

/**
 * Architecture section, laid out like ~/firecrab README.md "Architecture":
 * the intro animation, then "at a glance" and "runs anywhere" with their text.
 * Only Korean has translated diagrams (README.ko.md does the same); every other language
 * shows the English SVGs, exactly like the other READMEs.
 */
export function ArchitectureSection() {
  const { t, loc, language } = useI18n();
  const { glance, anywhere } = architectureBlocks;
  const diagram = (image: { ko: string; en: string }) => (language === 'ko' ? image.ko : image.en);

  return (
    <section className="fc-section" id="architecture" aria-labelledby="fc-arch-title">
      <div className="fc-section-header">
        <span className="fc-caption-uppercase">04 / ARCHITECTURE</span>
        <h2 id="fc-arch-title" className="fc-display-lg">
          {t('하나의 단순한 아키텍처,', 'One simple architecture,')}
          <br />
          {t('어디서든 같은 대시보드.', 'the same dashboard anywhere.')}
        </h2>
        <p className="fc-section-lead">
          <RichText
            text={t(
              '[상세 아키텍처](public-docs/architecture.md): OS별 microManager 구성, VM 시작, 이미지·커널 공급, 게스트 기능, CLI·업데이트 흐름.',
              '[Detailed architecture](public-docs/architecture.md): OS-specific microManager layers, VM startup, image/kernel supply, guest features, and CLI updates.',
            )}
          />
        </p>
      </div>

      <div className="fc-arch-card">
        <figure className="fc-arch-intro">
          <img src={architectureIntro.image} alt={loc(architectureIntro.alt)} loading="lazy" />
        </figure>

        <article className="fc-arch-block">
          <h3 className="fc-title-md">{loc(glance.title)}</h3>
          <div className="fc-arch-diagram-wrap">
            <img src={diagram(glance.image)} alt={loc(glance.alt)} loading="lazy" />
          </div>
          <ol className="fc-arch-steps">
            {glance.steps.map((step) => (
              <li key={step.en}>{loc(step)}</li>
            ))}
          </ol>
        </article>

        <article className="fc-arch-block">
          <h3 className="fc-title-md">{loc(anywhere.title)}</h3>
          <div className="fc-arch-diagram-wrap">
            <img src={diagram(anywhere.image)} alt={loc(anywhere.alt)} loading="lazy" />
          </div>
          {anywhere.paragraphs.map((paragraph) => (
            <p className="fc-body-sm fc-arch-text" key={paragraph.en}>
              <RichText text={loc(paragraph)} />
            </p>
          ))}
        </article>

        <p className="fc-arch-credit">{loc(architectureBlocks.credit)}</p>
      </div>
    </section>
  );
}
