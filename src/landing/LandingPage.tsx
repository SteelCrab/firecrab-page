import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BookOpen,
  Box,
  Check,
  Copy,
  Github,
  HardDrive,
  Monitor,
  Network,
  Server,
  ShieldCheck,
  Star,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';
import '../shared/site-header.css';
import './LandingPage.css';
import { ArchitectureSection } from './ArchitectureSection';
import { getPreferredLanguage, languageInfo, languages, rememberLanguage, readmeFile, type Language } from './i18n';
import { createI18n, I18nProvider } from './i18n/context';
import { InstallSection } from './InstallSection';
import {
  comparisonTable,
  featureHighlights,
  installCommand,
  productViews,
  releaseVersion,
  repositoryUrl,
  workflow,
} from './landingData';
import { SiteHeader } from './SiteHeader';

const architectureDocUrl = `${repositoryUrl}/blob/main/public-docs/architecture.md`;

/** 비교표 열 제목. 좁은 화면에서는 표가 카드로 쌓이므로 셀의 data-label로도 쓴다. */
const compareColumns = {
  docker: 'Docker / Podman',
  traditionalVm: 'Traditional VMs (QEMU/ESXi)',
  firecrab: 'FireCrab (Firecracker)',
};

function FeatureIcon({ name }: { name: string }) {
  switch (name) {
    case 'Zap':
      return <Zap size={18} />;
    case 'ShieldCheck':
      return <ShieldCheck size={18} />;
    case 'Network':
      return <Network size={18} />;
    case 'HardDrive':
      return <HardDrive size={18} />;
    case 'Box':
      return <Box size={18} />;
    case 'Terminal':
      return <Terminal size={18} />;
    case 'Monitor':
      return <Monitor size={18} />;
    case 'Activity':
      return <Activity size={18} />;
    case 'Wrench':
      return <Wrench size={18} />;
    default:
      return <Server size={18} />;
  }
}

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>(getPreferredLanguage);
  const [activeView, setActiveView] = useState(0);
  const [copiedHero, setCopiedHero] = useState(false);

  const i18n = useMemo(() => createI18n(language), [language]);
  const { t, loc, list, path } = i18n;
  const currentView = productViews[activeView];

  useEffect(() => {
    const { t: translateText } = createI18n(language);
    document.documentElement.lang = languageInfo(language).htmlLang;
    document.title = 'FireCrab — Lightweight MicroVM Platform';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      translateText(
        'FireCrab은 내 서버 한 대에서 KVM 기반 Firecracker microVM, 격리 네트워크, 이미지와 시리얼 콘솔을 운영하는 오픈소스 경량 가상화 플랫폼입니다. Linux는 직접, macOS·Windows는 microManager로 실행합니다.',
        'FireCrab is an open-source lightweight virtualization platform for running Firecracker microVMs, isolated networks, and serial consoles on one server you control. Linux runs it directly; macOS and Windows use microManager.',
      ),
    );
  }, [language]);

  // Deep links such as /#install (the docs/blog header links here, and so can a shared URL) load
  // before React has rendered the sections, so the browser's own fragment scroll finds nothing.
  // Images and fonts above the section keep moving it for a moment, so it stays aligned until the
  // page settles or the visitor scrolls.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return undefined;

    const align = () => document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
    const interaction = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    const observer = new ResizeObserver(align);
    const timer = window.setTimeout(stop, 3000);

    function stop() {
      observer.disconnect();
      window.clearTimeout(timer);
      interaction.forEach((type) => window.removeEventListener(type, stop));
    }

    align();
    observer.observe(document.body);
    interaction.forEach((type) => window.addEventListener(type, stop, { passive: true }));
    return stop;
  }, []);

  const changeLanguage = (nextLanguage: Language) => {
    rememberLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const copyHeroCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopiedHero(true);
      window.setTimeout(() => setCopiedHero(false), 2000);
    } catch {
      setCopiedHero(false);
    }
  };

  return (
    <I18nProvider value={i18n}>
      <div className="fc-site">
        <a className="fc-skip-link" href="#main-content">
          {t('본문으로 건너뛰기', 'Skip to content')}
        </a>

        <SiteHeader language={language} onLanguageChange={changeLanguage} />

        <main id="main-content">
          {/* HERO SECTION */}
          <section className="fc-hero-band" id="top" aria-labelledby="fc-hero-title">
            <div className="fc-hero-content">
              <div className="fc-hero-announcement">
                <span className="fc-badge-pill">Apache 2.0 Open Source</span>
                <a
                  href={`${repositoryUrl}/releases`}
                  target="_blank"
                  rel="noreferrer"
                  className="fc-announcement-link"
                >
                  {t('FireCrab {version} 릴리즈 보기', 'FireCrab {version} is now released on GitHub').replace(
                    '{version}',
                    releaseVersion,
                  )}{' '}
                  ↗
                </a>
              </div>

              <h1 id="fc-hero-title" className="fc-display-mega">
                {t('내 서버에서 바로 쓰는', 'The lightweight MicroVM platform')}
                <br />
                <span className="fc-hero-highlight">
                  {t('경량 MicroVM 플랫폼.', 'for your own server.')}
                </span>
              </h1>

              <p className="fc-hero-lead">
                {t(
                  '복잡한 클라우드 제어 계층 없이, 서버 한 대에서 KVM 기반 하드웨어 격리 MicroVM과 사용자 정의 네트워크·스토리지를 웹 대시보드, CLI, REST API로 운영하세요. Linux는 바로, macOS와 Windows(Preview)는 microManager로 같은 대시보드를 엽니다.',
                  'Run hardware-isolated MicroVMs with dedicated guest kernels, your own networks and storage, and container imports on one server you control, through a web dashboard, CLI, or REST API. Linux runs it directly; macOS and Windows (Preview) open the same dashboard via microManager.',
                )}
              </p>

              {/* Quick Install Code Card */}
              <div className="fc-hero-install-card">
                <div className="fc-install-code-group">
                  <span className="fc-prompt-sign">$</span>
                  <code>{installCommand}</code>
                </div>
                <button
                  type="button"
                  className={`fc-btn-copy ${copiedHero ? 'is-copied' : ''}`}
                  onClick={copyHeroCommand}
                  aria-label={t('명령어 복사', 'Copy command')}
                >
                  {copiedHero ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedHero ? t('복사됨', 'Copied') : t('복사', 'Copy')}</span>
                </button>
              </div>

              {/* CTAs */}
              <div className="fc-hero-cta-group">
                <a className="fc-button-download" href="#install">
                  <span>{t('설치 가이드 보기', 'Get Started')}</span>
                  <ArrowRight size={15} />
                </a>
                <a
                  className="fc-button-tertiary-text"
                  href={repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={16} />
                  <span>GitHub (SteelCrab/firecrab)</span>
                  <span className="fc-hero-arrow">↗</span>
                </a>
                <a className="fc-button-tertiary-text" href={path('/docs')}>
                  <BookOpen size={16} />
                  <span>{t('공식 문서 읽기', 'Documentation')}</span>
                  <span className="fc-hero-arrow">↗</span>
                </a>
              </div>
            </div>

            {/* IDE MOCKUP CARD with Signature Timeline Pastels */}
            <div className="fc-ide-mockup-wrapper">
              <div className="fc-ide-mockup-card">
                {/* Window Bar */}
                <div className="fc-ide-header">
                  <div className="fc-ide-dots">
                    <span className="fc-dot" />
                    <span className="fc-dot" />
                    <span className="fc-dot" />
                  </div>
                  <div className="fc-ide-title">
                    firecrab-dashboard — microvm (127.0.0.1:5523)
                  </div>
                </div>

                {/* Mockup screen */}
                <div className="fc-ide-screen">
                  <img
                    src="/dashboard-firecrab-m2.gif"
                    alt={t(
                      'FireCrab 대시보드 실시간 실행 데모',
                      'Real-time demo of managing MicroVMs in the FireCrab dashboard',
                    )}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PROOF BAND */}
          <section className="fc-proof-section" aria-label={t('기술 구성', 'Technology')}>
            <div className="fc-proof-container">
              <div className="fc-proof-col">
                <span className="fc-badge-pill">ENGINE</span>
                <h4>Rust API + net-helper</h4>
                <p>{t('권한을 나눈 두 서비스: 비특권 API와 제한된 capability의 네트워크 helper', 'Two privilege-separated services: an unprivileged API and a capability-bounded network helper')}</p>
              </div>
              <div className="fc-proof-col">
                <span className="fc-badge-pill">VIRTUALIZATION</span>
                <h4>Firecracker + KVM</h4>
                <p>{t('MicroVM마다 Firecracker 프로세스 하나, 각자 자기 커널로 부팅', 'One Firecracker process per MicroVM, each booting its own kernel')}</p>
              </div>
              <div className="fc-proof-col">
                <span className="fc-badge-pill">INTERFACE</span>
                <h4>Dashboard · CLI · API</h4>
                <p>{t('브라우저 Terminal, firecrab CLI, REST · WebSocket API', 'Browser Terminal, the firecrab CLI, and REST/WebSocket APIs')}</p>
              </div>
              <div className="fc-proof-col">
                <span className="fc-badge-pill">PLATFORM</span>
                <h4>Linux · macOS · Windows</h4>
                <p>{t('Linux는 직접 실행, macOS · Windows는 microManager (Windows는 Preview)', 'Linux runs directly; macOS and Windows use microManager (Windows is Preview)')}</p>
              </div>
            </div>
          </section>

          {/* 01 / FEATURES (WHY FIRECRAB) */}
          <section className="fc-section" id="features" aria-labelledby="fc-features-title">
            <div className="fc-section-header">
              <span className="fc-caption-uppercase">01 / WHY FIRECRAB</span>
              <h2 id="fc-features-title" className="fc-display-lg">
                {t('컨테이너의 가벼움과,', 'The speed of containers,')}
                <br />
                {t('가상머신의 완전한 격리를 하나로.', 'the security of virtual machines.')}
              </h2>
              <p className="fc-section-lead">
                {t(
                  'FireCrab은 단일 사설 호스트에서 필요한 핵심 기능만을 선별하여 가장 가볍고 안전한 격리 인프라를 제공합니다.',
                  'FireCrab delivers the most essential micro-virtualization capabilities on a single host with zero bloat.',
                )}
              </p>
            </div>

            <div className="fc-feature-grid">
              {featureHighlights.map((feature) => (
                <div className="fc-feature-card" key={feature.id}>
                  <div className="fc-card-top-row">
                    <div className="fc-feature-icon-box">
                      <FeatureIcon name={feature.iconName} />
                    </div>
                    <span className="fc-badge-pill">{feature.badge}</span>
                  </div>
                  <h3 className="fc-title-md">{loc(feature.title)}</h3>
                  <p className="fc-body-md">{loc(feature.description)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 02 / COMPARISON MATRIX */}
          <section className="fc-section" id="compare" aria-labelledby="fc-compare-title">
            <div className="fc-section-header">
              <span className="fc-caption-uppercase">02 / COMPARISON</span>
              <h2 id="fc-compare-title" className="fc-display-lg">
                {t('도커 vs 기존 가상머신 vs', 'Docker vs Traditional VMs vs')}
                <br />
                <span className="fc-ink-emphasis">FireCrab MicroVM</span>
              </h2>
              <p className="fc-section-lead">
                {t(
                  '호스트 커널을 공유하는 취약한 컨테이너, 혹은 기가바이트 단위의 무거운 레거시 가상화 대신 FireCrab을 선택해야 하는 기술적 이유입니다.',
                  'Why developers choose FireCrab over shared-kernel container risks and heavy legacy virtualization.',
                )}
              </p>
            </div>

            <div className="fc-comparison-card">
              <table className="fc-compare-table">
                <thead>
                  <tr>
                    <th>{t('비교 항목', 'Attribute')}</th>
                    <th>{compareColumns.docker}</th>
                    <th>{compareColumns.traditionalVm}</th>
                    <th className="fc-col-firecrab">{compareColumns.firecrab}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, idx) => (
                    <tr key={idx} className={row.highlight ? 'is-key-row' : ''}>
                      <td className="fc-dim-col">
                        <strong>{loc(row.dimension)}</strong>
                      </td>
                      <td data-label={compareColumns.docker}>{loc(row.docker)}</td>
                      <td data-label={compareColumns.traditionalVm}>{loc(row.traditionalVm)}</td>
                      <td className="fc-col-firecrab" data-label={compareColumns.firecrab}>
                        <div className="fc-cell-highlight">
                          <Check size={14} className="fc-check-icon" />
                          <span>{loc(row.firecrab)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* GitHub README.md Purpose (README.md / README.ko.md) */}
              <div className="fc-compare-quote-band">
                <p className="fc-compare-quote-text">
                  “{t(
                    '내 Linux 서버 한 대에서 Firecracker microVM을 만들고 운영합니다. 브라우저 대시보드·CLI·REST API로 관리하며, 개인 서버·홈랩·개발 환경에 적합합니다.',
                    'Run Firecracker microVMs on one Linux host you control, managed through a browser dashboard, CLI, or REST API. Built for personal servers, homelabs, and development environments.',
                  )}”
                </p>
                <p className="fc-compare-quote-note">
                  {t(
                    '단일 호스트 시스템입니다. 멀티 호스트 스케줄링, 고가용성, 라이브 마이그레이션은 제공하지 않으며, 인증이 없는 API 리스너를 외부 네트워크에 노출해서는 안 됩니다.',
                    'FireCrab stays a single-host system with no built-in multi-host scheduling, HA, or live migration, and its unauthenticated API listener must not be exposed to an external network.',
                  )}
                </p>
                <div className="fc-compare-quote-meta">
                  <span className="fc-quote-author">SteelCrab/firecrab</span>
                  <span className="fc-quote-badge">GitHub README</span>
                </div>
              </div>
            </div>
          </section>

          {/* 03 / CORE COMPONENTS (4-PILLAR TOUR) */}
          <section className="fc-section" id="components" aria-labelledby="fc-components-title">
            <div className="fc-section-header">
              <span className="fc-caption-uppercase">03 / CORE COMPONENTS</span>
              <h2 id="fc-components-title" className="fc-display-lg">
                {t('MicroVM 하나를 만드는', 'Four building blocks')}
                <br />
                {t('4가지 핵심 리소스.', 'behind every FireCrab MicroVM.')}
              </h2>
              <p className="fc-section-lead">
                {t(
                  'MicroVM, MicroNetwork, MicroStorage, M2Image를 조합해 완전히 격리된 실행 환경을 구성합니다.',
                  'Combine a MicroVM, MicroNetwork, MicroStorage, and M2Image into a fully isolated runtime.',
                )}
              </p>
            </div>

            <div className="fc-tour-wrapper">
              {/* Tour hairline tabs */}
              <div className="fc-tour-tablist" role="tablist">
                {productViews.map((view, index) => (
                  <button
                    type="button"
                    role="tab"
                    key={view.id}
                    aria-selected={activeView === index}
                    aria-controls="fc-tour-panel"
                    className={`fc-tour-tab ${activeView === index ? 'is-active' : ''}`}
                    onClick={() => setActiveView(index)}
                  >
                    <div className="fc-tab-label-group">
                      <img src={view.icon} alt="" aria-hidden="true" />
                      <span>{view.label}</span>
                    </div>
                    <span className="fc-tab-num">0{index + 1}</span>
                  </button>
                ))}
              </div>

              {/* Active Tour Panel */}
              <div className="fc-tour-panel-card" id="fc-tour-panel" role="tabpanel">
                <div className="fc-tour-split">
                  <div className="fc-tour-text-side">
                    <div className="fc-tour-meta">
                      <span className="fc-badge-pill">{loc(currentView.badge)}</span>
                      <span className="fc-tour-index">0{activeView + 1} / 04</span>
                    </div>
                    <h3 className="fc-display-md">{loc(currentView.title)}</h3>
                    <p className="fc-body-md">{loc(currentView.description)}</p>

                    <div className="fc-tour-specs">
                      <span className="fc-caption-uppercase">{t('핵심 역량', 'Capabilities')}</span>
                      <ul>
                        {list(currentView.details).map((detail, dIdx) => (
                          <li key={dIdx}>
                            <Check size={14} className="fc-check-icon" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="fc-tour-preview-side">
                    <div className="fc-screenshot-frame">
                      <div className="fc-screenshot-bar">
                        <div className="fc-screenshot-dots">
                          <span /><span /><span />
                        </div>
                        <code>{currentView.label}</code>
                      </div>
                      <img
                        key={currentView.image}
                        src={currentView.image}
                        alt={loc(currentView.alt)}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary view (Terminal) */}
                {currentView.secondary ? (
                  <div className="fc-tour-secondary-pane">
                    <div className="fc-secondary-top">
                      <div className="fc-secondary-title-box">
                        <img src={currentView.secondary.icon} alt="" aria-hidden="true" />
                        <div>
                          <span className="fc-badge-pill">{currentView.secondary.label}</span>
                          <h4 className="fc-title-md">{loc(currentView.secondary.title)}</h4>
                        </div>
                      </div>
                      <a
                        href={currentView.secondary.image}
                        target="_blank"
                        rel="noreferrer"
                        className="fc-open-img-link"
                      >
                        {t('고해상도 원본 보기', 'Open High-Res')} ↗
                      </a>
                    </div>
                    <p className="fc-body-sm">{loc(currentView.secondary.description)}</p>
                    <div className="fc-secondary-media-frame">
                      <img
                        src={currentView.secondary.image}
                        alt={loc(currentView.secondary.alt)}
                        style={{ objectPosition: currentView.secondary.imagePosition }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          {/* 04 / ARCHITECTURE (~/firecrab README: Intro GIF + "at a glance" + "runs anywhere") */}
          <ArchitectureSection />

          {/* 05 / GETTING STARTED WORKFLOW */}
          <section className="fc-section" aria-labelledby="fc-flow-title">
            <div className="fc-section-header">
              <span className="fc-caption-uppercase">05 / GETTING STARTED</span>
              <h2 id="fc-flow-title" className="fc-display-lg">
                {t('첫 MicroVM 가동까지', 'Your first MicroVM')}
                <br />
                {t('단 3단계.', 'in three simple steps.')}
              </h2>
            </div>

            <div className="fc-workflow-grid">
              {workflow.map((item) => (
                <div className="fc-workflow-card" key={item.number}>
                  <div className="fc-workflow-top">
                    <span className="fc-workflow-badge">{item.number}</span>
                    <div className="fc-workflow-divider" />
                  </div>
                  <h3 className="fc-title-md">{loc(item.title)}</h3>
                  <p className="fc-body-md">{loc(item.description)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 06 / INSTALLATION (~/firecrab README: Installation, Run, Run from source) */}
          <InstallSection />

          {/* CTA BAND (Pre-Footer) */}
          <section className="fc-cta-band" aria-labelledby="fc-cta-title">
            <div className="fc-cta-container">
              <span className="fc-caption-uppercase">100% FREE & OPEN SOURCE</span>
              <h2 id="fc-cta-title" className="fc-display-lg">
                {t('당신의 서버를 위한,', 'Isolated microVM workloads,')}
                <br />
                {t('가장 가벼운 MicroVM 인프라.', 'on your own single server.')}
              </h2>
              <p className="fc-body-md">
                {t(
                  'FireCrab은 오픈소스 커뮤니티와 함께 만듭니다. GitHub에서 Star를 눌러 응원해주시고, 자유롭게 기여해 주세요.',
                  'FireCrab is built in the open under Apache 2.0. Star the repository on GitHub and join the discussion.',
                )}
              </p>

              <div className="fc-cta-btn-row">
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="fc-button-download"
                >
                  <Github size={16} />
                  <span>{t('GitHub에서 Star 누르기', 'Star on GitHub')}</span>
                  <Star size={13} className="fc-star-icon" />
                </a>
                <a href={path('/docs')} className="fc-btn-secondary">
                  <BookOpen size={15} />
                  <span>{t('문서 및 튜토리얼', 'Docs & tutorials')}</span>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="fc-footer">
          <div className="fc-footer-inner">
            <div className="fc-footer-brand-col">
              <a className="fc-wordmark" href="#top">
                <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
                <span className="fc-wordmark-title">FireCrab</span>
              </a>
              <p className="fc-body-sm">
                {t(
                  '내 서버 한 대를 위한 경량 Firecracker MicroVM 관리 플랫폼',
                  'A lightweight Firecracker microVM platform for your own server.',
                )}
              </p>
              <span className="fc-caption">Apache 2.0 Open Source License</span>
            </div>

            <div className="fc-footer-nav-grid">
              <div className="fc-footer-col">
                <span className="fc-caption-uppercase">{t('프로젝트', 'Project')}</span>
                <a href="#features">{t('특징', 'Features')}</a>
                <a href="#compare">{t('기술 비교', 'Compare')}</a>
                <a href="#components">{t('컴포넌트', 'Components')}</a>
                <a href="#architecture">{t('아키텍처', 'Architecture')}</a>
                <a href="#install">{t('설치하기', 'Install')}</a>
              </div>

              <div className="fc-footer-col">
                <span className="fc-caption-uppercase">{t('문서', 'Docs')}</span>
                <a href={path('/docs')}>{t('소개 및 시작하기', 'Introduction')}</a>
                <a href={path('/docs/tutorials/three-tier-architecture')}>
                  {t('3티어 구성 튜토리얼', '3-Tier Tutorial')}
                </a>
                <a href={architectureDocUrl} target="_blank" rel="noreferrer">
                  {t('상세 아키텍처', 'Detailed Architecture')}
                </a>
                <a href={path('/blog')}>{t('블로그', 'Blog')}</a>
                <a href={`${repositoryUrl}/releases`} target="_blank" rel="noreferrer">
                  {t('릴리즈 노트', 'Releases')}
                </a>
              </div>

              <div className="fc-footer-col">
                <span className="fc-caption-uppercase">{t('커뮤니티', 'Community')}</span>
                <a href={repositoryUrl} target="_blank" rel="noreferrer">
                  GitHub Repository
                </a>
                <a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">
                  Issues
                </a>
                <a href={`${repositoryUrl}/discussions`} target="_blank" rel="noreferrer">
                  Discussions
                </a>
                <a href={`${repositoryUrl}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
                  Apache 2.0 License
                </a>
                <a href={`${repositoryUrl}/blob/main/${readmeFile(language)}`} target="_blank" rel="noreferrer">
                  {readmeFile(language)}
                </a>
              </div>
            </div>
          </div>

          <div className="fc-footer-bottom-row">
            <span>© 2026 FireCrab Project. Inspired by Cursor design.</span>
            <div className="fc-footer-langs">
              {languages.map((entry, index) => (
                <span key={entry.code} className="fc-footer-lang-item">
                  {index > 0 ? <span aria-hidden="true">·</span> : null}
                  <button
                    type="button"
                    lang={entry.htmlLang}
                    className={language === entry.code ? 'is-active' : ''}
                    aria-pressed={language === entry.code}
                    onClick={() => changeLanguage(entry.code)}
                  >
                    {entry.label}
                  </button>
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </I18nProvider>
  );
}
