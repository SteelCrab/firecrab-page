import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  HardDrive,
  Languages,
  Menu,
  Network,
  ShieldCheck,
  Star,
  Terminal,
  X,
  Zap,
  Box,
  Server,
  BookOpen,
} from 'lucide-react';
import './LandingPage.css';
import {
  productViews,
  featureHighlights,
  comparisonTable,
  workflow,
  architectureFlow,
  type Language,
} from './landingData';

const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const installCommand = 'curl -fsSL https://github.com/SteelCrab/firecrab/releases/latest/download/install.sh | bash';
const gitCloneCommand = 'git clone https://github.com/SteelCrab/firecrab.git\ncd firecrab\n./scripts/ci-prepare-install-payload.sh\n./install.sh --bin-dir target/release';
const optionsCommand = './install.sh --check\n./install.sh --doctor';

const languageStorageKey = 'firecrab-language';
const browserLanguageStorageKey = 'firecrab-browser-language';

const getBrowserLanguage = (): Language => {
  const browserLanguage = window.navigator.languages?.[0] ?? window.navigator.language;
  return browserLanguage.toLowerCase().startsWith('ko') ? 'ko' : 'en';
};

const getInitialLanguage = (): Language => {
  const browserLanguage = getBrowserLanguage();
  const savedLanguage = window.localStorage.getItem(languageStorageKey);
  const browserLanguageAtSave = window.localStorage.getItem(browserLanguageStorageKey);

  if (
    (savedLanguage === 'ko' || savedLanguage === 'en') &&
    browserLanguageAtSave === browserLanguage
  ) {
    return savedLanguage;
  }

  return browserLanguage;
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
    default:
      return <Server size={18} />;
  }
}

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [activeView, setActiveView] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedHero, setCopiedHero] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [installTab, setInstallTab] = useState<'curl' | 'options' | 'git'>('curl');

  const currentView = productViews[activeView];
  const t = (ko: string, en: string) => (language === 'ko' ? ko : en);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = 'FireCrab — Lightweight MicroVM Platform';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      language === 'ko'
        ? 'FireCrab은 단일 Linux 호스트에서 KVM 기반 Firecracker microVM, 격리 네트워크, 이미지와 시리얼 콘솔을 운영하는 오픈소스 경량 가상화 플랫폼입니다.'
        : 'FireCrab is an open-source lightweight virtualization platform for running Firecracker microVMs, isolated networks, and serial consoles on a single Linux host.',
    );
  }, [language]);

  const changeLanguage = (nextLanguage: Language) => {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    window.localStorage.setItem(browserLanguageStorageKey, getBrowserLanguage());
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

  const copyInstallTabCommand = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedInstall(true);
      window.setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      setCopiedInstall(false);
    }
  };

  return (
    <div className="fc-site">
      <a className="fc-skip-link" href="#main-content">
        {t('본문으로 건너뛰기', 'Skip to content')}
      </a>

      {/* TOP NAVIGATION */}
      <header className="fc-header">
        <div className="fc-nav-shell">
          <a className="fc-wordmark" href="#top" aria-label="FireCrab">
            <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
            <span className="fc-wordmark-title">FireCrab</span>
            <span className="fc-version-pill">v0.2.0</span>
          </a>

          <nav className="fc-desktop-nav" aria-label="메인 메뉴">
            <a href="#features">{t('특징', 'Features')}</a>
            <a href="#compare">{t('비교', 'Compare')}</a>
            <a href="#components">{t('컴포넌트', 'Components')}</a>
            <a href="#architecture">{t('아키텍처', 'Architecture')}</a>
            <a href="#install">{t('설치하기', 'Install')}</a>
            <a href={language === 'ko' ? '/docs' : '/en/docs'} className="fc-nav-link-ext">
              {t('문서', 'Docs')}
              <ExternalLink size={12} className="fc-ext-icon" />
            </a>
            <a href={language === 'ko' ? '/blog' : '/en/blog'} className="fc-nav-link-ext">
              {t('블로그', 'Blog')}
              <ExternalLink size={12} className="fc-ext-icon" />
            </a>
          </nav>

          <div className="fc-nav-actions">
            {/* Language switch */}
            <div className="fc-language-switch" aria-label={t('언어 선택', 'Language selector')}>
              <Languages size={13} aria-hidden="true" />
              <button
                type="button"
                className={language === 'ko' ? 'is-active' : ''}
                aria-pressed={language === 'ko'}
                onClick={() => changeLanguage('ko')}
              >
                KO
              </button>
              <i aria-hidden="true" />
              <button
                type="button"
                className={language === 'en' ? 'is-active' : ''}
                aria-pressed={language === 'en'}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* GitHub Star Pill */}
            <a
              className="fc-github-pill"
              href={repositoryUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={15} />
              <span>Star</span>
            </a>

            {/* Primary Orange CTA */}
            <a className="fc-btn-primary" href="#install">
              {t('설치하기', 'Install')}
            </a>
          </div>

          <button
            className="fc-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="fc-mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav
          className={`fc-mobile-nav ${mobileMenuOpen ? 'is-open' : ''}`}
          id="fc-mobile-nav"
          hidden={!mobileMenuOpen}
          aria-label="모바일 메뉴"
        >
          <div className="fc-mobile-language">
            <button
              type="button"
              className={language === 'ko' ? 'is-active' : ''}
              onClick={() => changeLanguage('ko')}
            >
              한국어
            </button>
            <button
              type="button"
              className={language === 'en' ? 'is-active' : ''}
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
          </div>
          {[
            [t('특징', 'Features'), '#features'],
            [t('비교', 'Compare'), '#compare'],
            [t('컴포넌트', 'Components'), '#components'],
            [t('아키텍처', 'Architecture'), '#architecture'],
            [t('설치하기', 'Install'), '#install'],
            [t('문서 (Docs)', 'Docs'), language === 'ko' ? '/docs' : '/en/docs'],
            [t('블로그 (Blog)', 'Blog'), language === 'ko' ? '/blog' : '/en/blog'],
          ].map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMobileMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="fc-mobile-gh-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Github size={15} /> GitHub ↗
          </a>
        </nav>
      </header>

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
                {t('FireCrab v0.2.0 릴리즈 보기', 'FireCrab v0.2.0 is now released on GitHub')} ↗
              </a>
            </div>

            <h1 id="fc-hero-title" className="fc-display-mega">
              {t('내 Linux 서버를 위한', 'The lightweight MicroVM platform')}
              <br />
              <span className="fc-hero-highlight">
                {t('초경량 MicroVM 플랫폼.', 'for your own Linux host.')}
              </span>
            </h1>

            <p className="fc-hero-lead">
              {t(
                '복잡한 클라우드 제어 계층 없이, 단 한 대의 사설 Linux 호스트에서 KVM 기반 하드웨어 격리, 사용자 정의 네트워크, 초고속 MicroVM을 웹 대시보드와 REST API로 운영하세요.',
                'Run hardware-isolated microVMs with dedicated guest kernels, declarative networks, and container imports on a single Linux server you control. 100% self-hosted, minimal, and fast.',
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
              <a
                className="fc-button-tertiary-text"
                href={language === 'ko' ? '/docs' : '/en/docs'}
              >
                <BookOpen size={16} />
                <span>{t('공식 문서 읽기', 'Documentation')}</span>
                <span className="fc-hero-arrow">↗</span>
              </a>
            </div>

            {/* Editorial specs row */}
            <div className="fc-hero-specs-row">
              <div className="fc-spec-item">
                <span className="fc-spec-val">&lt; 5ms</span>
                <span className="fc-spec-lbl">{t('부팅 시간', 'Boot time')}</span>
              </div>
              <div className="fc-spec-divider" />
              <div className="fc-spec-item">
                <span className="fc-spec-val">KVM</span>
                <span className="fc-spec-lbl">{t('하드웨어 가상화', 'Hardware isolation')}</span>
              </div>
              <div className="fc-spec-divider" />
              <div className="fc-spec-item">
                <span className="fc-spec-val">&lt; 5MB</span>
                <span className="fc-spec-lbl">{t('메모리 오버헤드', 'Memory footprint')}</span>
              </div>
              <div className="fc-spec-divider" />
              <div className="fc-spec-item">
                <span className="fc-spec-val">Single Host</span>
                <span className="fc-spec-lbl">{t('완전한 자체 소유', '100% Self-hosted')}</span>
              </div>
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
                  firecrab-dashboard — m2-overview (127.0.0.1:5523)
                </div>

              </div>



              {/* Mockup screen */}
              <div className="fc-ide-screen">
                <img
                  src="/dashboard-firecrab-m2.gif"
                  alt={t(
                    'FireCrab 대시보드 실시간 실행 데모',
                    'Real-time demo of managing M2s in FireCrab dashboard',
                  )}
                />
              </div>


            </div>
          </div>
        </section>

        {/* PROOF BAND */}
        <section className="fc-proof-section" aria-label="기술 구성">
          <div className="fc-proof-container">
            <div className="fc-proof-col">
              <span className="fc-badge-pill">ENGINE</span>
              <h4>Rust Daemon</h4>
              <p>{t('비동기 고성능 수명주기 및 리소스 관리 데몬', 'High-performance async lifecycle & resource management daemon')}</p>
            </div>
            <div className="fc-proof-col">
              <span className="fc-badge-pill">VIRTUALIZATION</span>
              <h4>Firecracker</h4>
              <p>{t('MicroVM마다 독립된 프로세스로 실행되는 가상화', 'Ultra-lightweight virtualization running one process per VM')}</p>
            </div>
            <div className="fc-proof-col">
              <span className="fc-badge-pill">INTERFACE</span>
              <h4>Web Dashboard</h4>
              <p>{t('브라우저 xterm 시리얼 콘솔 및 실시간 모니터링', 'Browser xterm serial console & live system telemetry')}</p>
            </div>
            <div className="fc-proof-col">
              <span className="fc-badge-pill">SOVEREIGNTY</span>
              <h4>100% Self-Hosted</h4>
              <p>{t('외부 클라우드 의존성 없이 단일 호스트에서 완벽 통제', 'Zero cloud lock-in, runs entirely on your own hardware')}</p>
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
                <h3 className="fc-title-md">{feature.title[language]}</h3>
                <p className="fc-body-md">{feature.description[language]}</p>
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
                  <th>Docker / Podman</th>
                  <th>Traditional VMs (QEMU/ESXi)</th>
                  <th className="fc-col-firecrab">FireCrab (Firecracker)</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className={row.highlight ? 'is-key-row' : ''}>
                    <td className="fc-dim-col">
                      <strong>{row.dimension[language]}</strong>
                    </td>
                    <td>{row.docker[language]}</td>
                    <td>{row.traditionalVm[language]}</td>
                    <td className="fc-col-firecrab">
                      <div className="fc-cell-highlight">
                        <Check size={14} className="fc-check-icon" />
                        <span>{row.firecrab[language]}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GitHub README.md Official Mission Callout */}
            <div className="fc-compare-quote-band">
              <p className="fc-compare-quote-text">
                “{t(
                  '컨테이너보다 강한 격리가 필요하지만 완전한 클라우드 컨트롤 플레인까지는 필요 없는 사설 단일 호스트 환경을 위한 도구입니다. 호스팅 서비스도, 멀티 호스트 스케줄러도 아닙니다.',
                  'Built for a private, single-host microVM environment: stronger isolation than containers, without a full cloud control plane. Not a hosted service and not a multi-host scheduler.',
                )}”
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
              {t('M2를 이루는', 'Four building blocks')}
              <br />
              {t('4가지 핵심 아키텍처 단위.', 'behind every FireCrab M2.')}
            </h2>
            <p className="fc-section-lead">
              {t(
                '컴퓨팅, 네트워크, 스토리지, 이미지를 직관적으로 결합해 완전한 실행 환경을 구성합니다.',
                'Assemble compute, networking, storage, and images into isolated MicroMachines with ease.',
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
                    <span className="fc-badge-pill">{currentView.badge[language]}</span>
                    <span className="fc-tour-index">0{activeView + 1} / 04</span>
                  </div>
                  <h3 className="fc-display-md">{currentView.title[language]}</h3>
                  <p className="fc-body-md">{currentView.description[language]}</p>

                  <div className="fc-tour-specs">
                    <span className="fc-caption-uppercase">{t('핵심 역량', 'Capabilities')}</span>
                    <ul>
                      {currentView.details[language].map((detail, dIdx) => (
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
                      alt={currentView.alt[language]}
                    />
                  </div>
                </div>
              </div>

              {/* Secondary view (Terminal or MicroBoot) */}
              {currentView.secondary ? (
                <div className="fc-tour-secondary-pane">
                  <div className="fc-secondary-top">
                    <div className="fc-secondary-title-box">
                      <img src={currentView.secondary.icon} alt="" aria-hidden="true" />
                      <div>
                        <span className="fc-badge-pill">{currentView.secondary.label}</span>
                        <h4 className="fc-title-md">{currentView.secondary.title[language]}</h4>
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
                  <p className="fc-body-sm">{currentView.secondary.description[language]}</p>
                  <div className="fc-secondary-media-frame">
                    <img
                      src={currentView.secondary.image}
                      alt={currentView.secondary.alt[language]}
                      style={{ objectPosition: currentView.secondary.imagePosition }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* 04 / ARCHITECTURE */}
        <section className="fc-section" id="architecture" aria-labelledby="fc-arch-title">
          <div className="fc-section-header">
            <span className="fc-caption-uppercase">04 / ARCHITECTURE</span>
            <h2 id="fc-arch-title" className="fc-display-lg">
              {t('단일 호스트에서 완성되는', 'Engineered for simplicity,')}
              <br />
              {t('MicroNetwork 시스템 아키텍처.', 'architected for isolation.')}
            </h2>
            <p className="fc-section-lead">
              {t(
                '호스트 Linux 커널과 KVM을 기반으로, 완전히 분리된 Subnet과 NAT Egress 환경 속에서 M2가 안전하게 실행됩니다.',
                'From bare metal Linux and KVM to isolated subnets and NAT egress, explore how FireCrab coordinates MicroVMs.',
              )}
            </p>
          </div>

          <div className="fc-arch-card">
            <div className="fc-arch-diagram-wrap">
              <img
                src="/micronetworks-architecture.png"
                alt={t(
                  'FireCrab MicroNetwork 아키텍처 다이어그램',
                  'FireCrab MicroNetwork Architecture Diagram',
                )}
              />
            </div>
            {/* Architecture Connected Flowchart (01 -> 02 -> 03 -> 04 -> 05 -> 06) */}
            <div className="fc-arch-flowchart" aria-label={t('아키텍처 실행 흐름도', 'Architecture Flowchart')}>
              {architectureFlow.map((step, index) => (
                <div className="fc-flow-step-item" key={step.number}>
                  <div className="fc-flow-node">
                    <div className="fc-flow-node-badge">
                      <span className="fc-flow-num">{step.number}</span>
                    </div>
                    <strong className="fc-flow-title">{step.title[language]}</strong>
                    <p className="fc-flow-desc">{step.description[language]}</p>
                  </div>
                  {index < architectureFlow.length - 1 && (
                    <div className="fc-flow-arrow-wrap" aria-hidden="true">
                      <ArrowRight size={15} className="fc-flow-arrow-right" />
                      <ArrowDown size={15} className="fc-flow-arrow-down" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

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
                <h3 className="fc-title-md">{item.title[language]}</h3>
                <p className="fc-body-md">{item.description[language]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 06 / INSTALLATION */}
        <section className="fc-section" id="install" aria-labelledby="fc-install-title">
          <div className="fc-install-layout">
            <div className="fc-install-guide">
              <span className="fc-caption-uppercase">06 / INSTALLATION</span>
              <h2 id="fc-install-title" className="fc-display-lg">
                {t('서버는 이미 있으니까.', 'You already have the server.')}
                <br />
                <span className="fc-ink-emphasis">
                  {t('이제 FireCrab만.', 'Now add FireCrab.')}
                </span>
              </h2>
              <p className="fc-body-md">
                {t(
                  'Linux + systemd, /dev/kvm, 네트워크와 sudo 권한이 있는 일반 사용자 계정이 필요합니다. 설치 스크립트 전체를 sudo로 실행하지 마세요. 필요한 단계에서만 권한을 요청합니다.',
                  'Linux + systemd, /dev/kvm, network access, and a regular user with sudo privileges are required. Do NOT run the installer with sudo; it asks for privilege only when needed.',
                )}
              </p>

              {/* Prerequisites Card */}
              <div className="fc-prereq-card">
                <span className="fc-caption-uppercase">{t('사전 요구사항 (Prerequisites)', 'Prerequisites')}</span>
                <ul>
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span>Linux OS + systemd (Debian, Ubuntu, Fedora, Arch, openSUSE, Alpine 등)</span>
                  </li>
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span><code>/dev/kvm</code> {t('하드웨어 가상화 접근 권한', 'Hardware virtualization access')}</span>
                  </li>
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span>{t('sudo 권한이 있는 일반 사용자 (sudo 접두사 없이 실행)', 'Regular user with sudo access (do NOT prefix with sudo)')}</span>
                  </li>
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span>{t('패키지 관리자: apt-get, dnf, zypper, pacman, apk', 'Package manager: apt-get, dnf, zypper, pacman, apk')}</span>
                  </li>
                </ul>
              </div>

              {/* Quickstart steps based on main README */}
              <div className="fc-quickstart-note">
                <span className="fc-caption-uppercase">{t('설치 후 빠른 시작 (Quick Start)', 'After Installation (Quick Start)')}</span>
                <p className="fc-body-sm">
                  <code>http://127.0.0.1:5523/</code> {t('접속 후:', '— open in your browser, then:')}
                </p>
                <ol className="fc-qs-steps">
                  <li><strong>1. {t('MicroNetwork 생성', 'Create a MicroNetwork')}</strong> — {t('숨겨진 기본 서브넷 없이 명시적으로 관리', 'No hidden default subnet')}</li>
                  <li><strong>2. {t('M2 생성', 'Create an M2')}</strong> — {t('설치된 이미지(또는 OCI)와 리소스 선택', 'Choose installed image or OCI and specs')}</li>
                  <li><strong>3. {t('시작 및 Terminal 연결', 'Start & open Terminal')}</strong> — {t('running 전환 후 브라우저 콘솔에서 즉시 명령 실행', 'Wait for running and open browser serial console')}</li>
                </ol>
              </div>

              <div className="fc-install-actions">
                <a
                  href={`${repositoryUrl}/blob/main/public-docs/installation.md`}
                  target="_blank"
                  rel="noreferrer"
                  className="fc-link-action"
                >
                  <BookOpen size={16} />
                  <span>{t('전체 설치 가이드 (public-docs/installation.md)', 'Full Installation Guide')}</span>
                  <span>↗</span>
                </a>
                <a
                  href={`${repositoryUrl}/blob/main/${language === 'ko' ? 'README.ko.md' : 'README.md'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="fc-link-action-subtle"
                >
                  {language === 'ko' ? 'README.ko.md 보기 ↗' : 'View README.md ↗'}
                </a>
              </div>
            </div>

            {/* Terminal Card */}
            <div className="fc-terminal-block">
              <div className="fc-terminal-tabbar">
                <div className="fc-terminal-tab-group">
                  <button
                    type="button"
                    className={installTab === 'curl' ? 'is-active' : ''}
                    onClick={() => setInstallTab('curl')}
                  >
                    {t('원클릭 설치 (install.sh)', 'One-line Install')}
                  </button>
                  <button
                    type="button"
                    className={installTab === 'options' ? 'is-active' : ''}
                    onClick={() => setInstallTab('options')}
                  >
                    {t('점검 및 옵션 (--check)', 'Check & Options')}
                  </button>
                  <button
                    type="button"
                    className={installTab === 'git' ? 'is-active' : ''}
                    onClick={() => setInstallTab('git')}
                  >
                    {t('로컬 소스 빌드', 'Local Build')}
                  </button>
                </div>

                <button
                  type="button"
                  className={`fc-term-copy ${copiedInstall ? 'is-copied' : ''}`}
                  onClick={() => {
                    const cmd =
                      installTab === 'curl'
                        ? installCommand
                        : installTab === 'options'
                        ? './install.sh --check'
                        : gitCloneCommand;
                    copyInstallTabCommand(cmd);
                  }}
                >
                  {copiedInstall ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedInstall ? t('복사됨', 'Copied') : t('복사', 'Copy')}</span>
                </button>
              </div>

              <div className="fc-terminal-viewport">
                {installTab === 'curl' && (
                  <pre>
                    <code>
                      <span className="fc-code-comment"># {t('일반 사용자 계정으로 실행 (sudo를 붙이지 마세요)', 'Run as regular user (do NOT prefix with sudo)')}</span>
                      {'\n'}
                      <span className="fc-code-comment"># {t('필요한 패키지 및 systemd 등록 시에만 sudo 암호를 요청합니다', 'The script calls sudo only when privilege is needed')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">{installCommand}</span>
                      {'\n\n'}
                      <span className="fc-code-comment"># {t('설치 완료 후 웹 브라우저에서 대시보드 열기:', 'Open dashboard after services start:')}</span>
                      {'\n'}
                      <span className="fc-code-url">http://127.0.0.1:5523/</span>
                    </code>
                  </pre>
                )}

                {installTab === 'options' && (
                  <pre>
                    <code>
                      <span className="fc-code-comment"># {t('사전 요구사항 및 설치 계획 점검 (Read-only)', 'Report prerequisites and planned changes (read-only)')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --check</span>
                      {'\n\n'}
                      <span className="fc-code-comment"># {t('KVM, 방화벽, 소켓 및 호스트 설정 진단', 'Diagnose KVM, firewall, socket, and host setup')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --doctor</span>
                      {'\n\n'}
                      <span className="fc-code-comment"># {t('libc 자동 감지 대신 수동 지정 (예: musl)', 'Pick a libc instead of autodetecting (e.g. musl)')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --libc musl</span>
                      {'\n\n'}
                      <span className="fc-code-comment"># {t('제거 (데이터 보존 / 완전 삭제)', 'Uninstall (retain data / purge all)')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --uninstall</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --uninstall --purge</span>
                    </code>
                  </pre>
                )}

                {installTab === 'git' && (
                  <pre>
                    <code>
                      <span className="fc-code-comment"># {t('저장소 체크아웃 후 공식 준비 스크립트로 로컬 빌드', 'Clone repository and build payload with repository script')}</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">git clone https://github.com/SteelCrab/firecrab.git</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">cd firecrab</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./scripts/ci-prepare-install-payload.sh</span>
                      {'\n'}
                      <span className="fc-code-prompt">$ </span>
                      <span className="fc-code-cmd">./install.sh --bin-dir target/release</span>
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </section>

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
              <a
                href={language === 'ko' ? '/docs' : '/en/docs'}
                className="fc-btn-secondary"
              >
                <BookOpen size={15} />
                <span>{t('문서 및 튜토리얼', 'Documentation')}</span>
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
                '단일 Linux 서버를 위한 경량 Firecracker MicroVM 관리 플랫폼',
                'A lightweight Firecracker microVM platform for your own Linux server.',
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
              <a href={language === 'ko' ? '/docs' : '/en/docs'}>{t('소개 및 시작하기', 'Introduction')}</a>
              <a href={language === 'ko' ? '/docs/three-tier-architecture' : '/en/docs/three-tier-architecture'}>
                {t('3티어 구성 튜토리얼', '3-Tier Tutorial')}
              </a>
              <a href={language === 'ko' ? '/blog' : '/en/blog'}>{t('블로그', 'Blog')}</a>
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
            </div>
          </div>
        </div>

        <div className="fc-footer-bottom-row">
          <span>© 2026 FireCrab Project. Inspired by Cursor design.</span>
          <div className="fc-footer-langs">
            <button
              type="button"
              className={language === 'ko' ? 'is-active' : ''}
              onClick={() => changeLanguage('ko')}
            >
              한국어
            </button>
            <span>·</span>
            <button
              type="button"
              className={language === 'en' ? 'is-active' : ''}
              onClick={() => changeLanguage('en')}
            >
              English
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
