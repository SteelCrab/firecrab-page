import { useEffect, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Github,
  HardDrive,
  Languages,
  Menu,
  Monitor,
  Network,
  ShieldCheck,
  Star,
  Terminal,
  Wrench,
  X,
  Zap,
  Box,
  Server,
  BookOpen,
} from 'lucide-react';
import './LandingPage.css';
import {
  architectureFlow,
  architectureViews,
  comparisonTable,
  featureHighlights,
  installCommand,
  installTabCopyText,
  installTabs,
  productViews,
  releaseVersion,
  repositoryUrl,
  workflow,
  type InstallLine,
  type Language,
} from './landingData';

const architectureDocUrl = `${repositoryUrl}/blob/main/public-docs/architecture.md`;

/** 비교표 열 제목. 좁은 화면에서는 표가 카드로 쌓이므로 셀의 data-label로도 쓴다. */
const compareColumns = {
  docker: 'Docker / Podman',
  traditionalVm: 'Traditional VMs (QEMU/ESXi)',
  firecrab: 'FireCrab (Firecracker)',
};

/** 헤더가 햄버거 메뉴로 접히는 경계. LandingPage.css 의 1140px 브레이크포인트와 같아야 한다. */
const desktopNavQuery = '(min-width: 1141px)';

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

function InstallCodeLine({ line, language }: { line: InstallLine; language: Language }) {
  switch (line.kind) {
    case 'comment':
      return (
        <>
          <span className="fc-code-comment"># {line.text[language]}</span>
          {'\n'}
        </>
      );
    case 'cmd':
      return (
        <>
          <span className="fc-code-prompt">{line.prompt ?? '$ '}</span>
          <span className="fc-code-cmd">{line.text}</span>
          {'\n'}
        </>
      );
    case 'url':
      return (
        <>
          <span className="fc-code-url">{line.text}</span>
          {'\n'}
        </>
      );
    case 'blank':
      return <>{'\n'}</>;
  }
}

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [activeView, setActiveView] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedHero, setCopiedHero] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [installTabId, setInstallTabId] = useState(installTabs[0].id);
  const [activeArch, setActiveArch] = useState(0);

  const currentView = productViews[activeView];
  const currentArch = architectureViews[activeArch];
  const currentInstallTab = installTabs.find((tab) => tab.id === installTabId) ?? installTabs[0];
  const t = (ko: string, en: string) => (language === 'ko' ? ko : en);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = 'FireCrab — Lightweight MicroVM Platform';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      language === 'ko'
        ? 'FireCrab은 내 서버 한 대에서 KVM 기반 Firecracker microVM, 격리 네트워크, 이미지와 시리얼 콘솔을 운영하는 오픈소스 경량 가상화 플랫폼입니다. Linux는 직접, macOS·Windows는 microManager로 실행합니다.'
        : 'FireCrab is an open-source lightweight virtualization platform for running Firecracker microVMs, isolated networks, and serial consoles on one server you control. Linux runs it directly; macOS and Windows use microManager.',
    );
  }, [language]);

  useEffect(() => {
    const query = window.matchMedia(desktopNavQuery);
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, []);

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
            <span className="fc-version-pill">{releaseVersion}</span>
          </a>

          <nav className="fc-desktop-nav" aria-label={t('메인 메뉴', 'Main menu')}>
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
          aria-label={t('모바일 메뉴', 'Mobile menu')}
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
                {t(`FireCrab ${releaseVersion} 릴리즈 보기`, `FireCrab ${releaseVersion} is now released on GitHub`)} ↗
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
                <span className="fc-spec-val">≤ 125ms</span>
                <span className="fc-spec-lbl">{t('부팅 (Firecracker 사양)', 'Boot (Firecracker spec)')}</span>
              </div>
              <div className="fc-spec-divider" />
              <div className="fc-spec-item">
                <span className="fc-spec-val">KVM</span>
                <span className="fc-spec-lbl">{t('하드웨어 가상화', 'Hardware isolation')}</span>
              </div>
              <div className="fc-spec-divider" />
              <div className="fc-spec-item">
                <span className="fc-spec-val">≤ 5 MiB</span>
                <span className="fc-spec-lbl">{t('VMM 메모리 오버헤드', 'VMM memory overhead')}</span>
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
        <section className="fc-proof-section" aria-label="기술 구성">
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
                  <th>{compareColumns.docker}</th>
                  <th>{compareColumns.traditionalVm}</th>
                  <th className="fc-col-firecrab">{compareColumns.firecrab}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className={row.highlight ? 'is-key-row' : ''}>
                    <td className="fc-dim-col">
                      <strong>{row.dimension[language]}</strong>
                    </td>
                    <td data-label={compareColumns.docker}>{row.docker[language]}</td>
                    <td data-label={compareColumns.traditionalVm}>{row.traditionalVm[language]}</td>
                    <td className="fc-col-firecrab" data-label={compareColumns.firecrab}>
                      <div className="fc-cell-highlight">
                        <Check size={14} className="fc-check-icon" />
                        <span>{row.firecrab[language]}</span>
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
              {t('권한을 나눠 단순하게 만든', 'Privilege-separated by design,')}
              <br />
              {t('FireCrab 시스템 아키텍처.', 'simple on a single host.')}
            </h2>
            <p className="fc-section-lead">
              {t(
                '비특권 API가 리소스 상태와 VM 프로세스를 소유하고, 권한이 필요한 호스트 네트워킹만 net-helper에 위임합니다. MicroVM마다 Firecracker 프로세스가 하나씩 KVM 위에서 실행됩니다.',
                'An unprivileged API owns resource state and VM processes, and only privileged host networking is delegated to the net-helper. Each MicroVM runs as its own Firecracker process on KVM.',
              )}
            </p>
          </div>

          <div className="fc-arch-card">
            <div className="fc-arch-tablist" role="tablist" aria-label={t('아키텍처 도식 선택', 'Architecture diagrams')}>
              {architectureViews.map((view, index) => (
                <button
                  type="button"
                  role="tab"
                  key={view.id}
                  id={`fc-arch-tab-${view.id}`}
                  aria-selected={activeArch === index}
                  aria-controls="fc-arch-panel"
                  className={`fc-arch-tab ${activeArch === index ? 'is-active' : ''}`}
                  onClick={() => setActiveArch(index)}
                >
                  {view.label[language]}
                </button>
              ))}
            </div>

            <div id="fc-arch-panel" role="tabpanel" aria-labelledby={`fc-arch-tab-${currentArch.id}`}>
              <div className="fc-arch-diagram-wrap">
                <img
                  key={currentArch.image[language]}
                  src={currentArch.image[language]}
                  alt={currentArch.alt[language]}
                />
              </div>

              <div className="fc-arch-caption">
                {currentArch.steps ? (
                  <ol className="fc-arch-steps">
                    {currentArch.steps[language].map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : null}
                {currentArch.note ? <p className="fc-body-sm">{currentArch.note[language]}</p> : null}
                <div className="fc-arch-caption-meta">
                  {currentArch.englishOnly && language === 'ko' ? (
                    <span>{t('도식 라벨은 영문으로 제공됩니다.', '')}</span>
                  ) : null}
                  <a
                    href={currentArch.image[language]}
                    target="_blank"
                    rel="noreferrer"
                    className="fc-open-img-link"
                  >
                    {t('도식 원본(SVG) 보기', 'Open diagram (SVG)')} ↗
                  </a>
                  <a href={architectureDocUrl} target="_blank" rel="noreferrer" className="fc-open-img-link">
                    {t('상세 아키텍처 문서', 'Detailed architecture')} ↗
                  </a>
                </div>
              </div>
            </div>

            {/* MicroVM start flow (public-docs/architecture.md → "VM start flow") */}
            <div className="fc-arch-flow-head">
              <span className="fc-caption-uppercase">{t('MicroVM 시작 흐름', 'MicroVM start flow')}</span>
            </div>
            <div className="fc-arch-flowchart" aria-label={t('MicroVM 시작 흐름도', 'MicroVM start flowchart')}>
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

            <p className="fc-arch-credit">
              {t(
                '도식의 Linux · Apple · Debian 로고는 simple-icons(CC0), 선형 아이콘은 Lucide(ISC)에서 가져왔습니다. 모든 로고와 상표는 해당 소유자에게 속합니다.',
                'Linux, Apple, and Debian logos in the diagrams are from simple-icons (CC0); line icons are from Lucide (ISC). All logos and trademarks belong to their respective owners.',
              )}
            </p>
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
                  'Linux는 systemd, /dev/kvm, 네트워크와 sudo 권한이 있는 일반 사용자 계정으로 install.sh 한 번이면 됩니다. 설치 스크립트 전체를 sudo로 실행하지 마세요. macOS와 Windows(Preview)는 CLI를 설치한 뒤 firecrab service install로 관리용 Debian VM을 만듭니다.',
                  'On Linux, one install.sh run is enough with systemd, /dev/kvm, network access, and a regular user with sudo; do NOT run the installer with sudo. On macOS and Windows (Preview), install the CLI, then run firecrab service install to provision a managed Debian VM.',
                )}
              </p>

              {/* Prerequisites Card */}
              <div className="fc-prereq-card">
                <span className="fc-caption-uppercase">{t('사전 요구사항 (Prerequisites)', 'Prerequisites')}</span>
                <ul>
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span>{t('Linux x86_64 · ARM64 + systemd (Debian, Ubuntu, Fedora, Arch, openSUSE, Alpine 등)', 'Linux x86_64 or ARM64 + systemd (Debian, Ubuntu, Fedora, Arch, openSUSE, Alpine)')}</span>
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
                  <li>
                    <Check size={14} className="fc-check-icon" />
                    <span>{t('macOS: Apple silicon(M3 이상) · macOS 15+ / Windows: WSL2 + 중첩 KVM (Preview)', 'macOS: Apple silicon (M3 or later) · macOS 15+ / Windows: WSL2 + nested KVM (Preview)')}</span>
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
                  <li><strong>2. {t('MicroVM 생성', 'Create a MicroVM')}</strong> — {t('설치된 이미지(또는 OCI)와 리소스 선택', 'Choose installed image or OCI and specs')}</li>
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
                <div className="fc-terminal-tab-group" role="tablist" aria-label={t('설치 방법', 'Install method')}>
                  {installTabs.map((tab) => (
                    <button
                      type="button"
                      role="tab"
                      key={tab.id}
                      aria-selected={tab.id === currentInstallTab.id}
                      className={tab.id === currentInstallTab.id ? 'is-active' : ''}
                      onClick={() => setInstallTabId(tab.id)}
                    >
                      {tab.label[language]}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className={`fc-term-copy ${copiedInstall ? 'is-copied' : ''}`}
                  onClick={() => copyInstallTabCommand(installTabCopyText(currentInstallTab))}
                >
                  {copiedInstall ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedInstall ? t('복사됨', 'Copied') : t('복사', 'Copy')}</span>
                </button>
              </div>

              <div className="fc-terminal-viewport" role="tabpanel">
                <pre>
                  <code>
                    {currentInstallTab.lines.map((line, index) => (
                      <InstallCodeLine key={index} line={line} language={language} />
                    ))}
                  </code>
                </pre>
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
              <a href={language === 'ko' ? '/docs' : '/en/docs'}>{t('소개 및 시작하기', 'Introduction')}</a>
              <a href={language === 'ko' ? '/docs/tutorials/three-tier-architecture' : '/en/docs/tutorials/three-tier-architecture'}>
                {t('3티어 구성 튜토리얼', '3-Tier Tutorial')}
              </a>
              <a href={architectureDocUrl} target="_blank" rel="noreferrer">
                {t('상세 아키텍처', 'Detailed Architecture')}
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
