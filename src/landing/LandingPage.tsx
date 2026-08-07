import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clipboard,
  Github,
  Languages,
  Menu,
  X,
} from 'lucide-react';
import './LandingPage.css';

const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const installCommand = 'git clone https://github.com/SteelCrab/firecrab.git\ncd firecrab\n./install.sh';
type Language = 'ko' | 'en';

const productViews = [
  {
    id: 'm2',
    label: 'M2',
    title: { ko: '내 서버에 만드는 전용 M2', en: 'Your own M2, on your server' },
    description: {
      ko: 'M2는 FireCrab의 실행 단위인 MicroMachine입니다. M2Image, CPU, 메모리, 디스크, MicroNetwork와 저장 위치를 조합해 독립된 Firecracker microVM을 만듭니다.',
      en: 'M2 is FireCrab’s MicroMachine runtime unit. Combine an M2Image, CPU, memory, disk, MicroNetwork, and storage location into an isolated Firecracker microVM.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab M2 생성 폼과 실행 중인 M2 목록', en: 'FireCrab M2 creation form and running M2 list' },
    icon: '/m2-icon.png',
    details: { ko: ['생성·시작·중지·삭제', 'M2별 시작 과정과 상태', '브라우저 시리얼 콘솔'], en: ['Create, start, stop, and delete', 'Startup progress and state per M2', 'Browser serial console'] },
    secondary: {
      label: 'TERMINAL',
      title: { ko: '실행 중인 M2에 바로 연결', en: 'Connect directly to a running M2' },
      description: {
        ko: '브라우저 시리얼 콘솔에서 부팅 로그와 로그인 프롬프트를 실시간으로 확인하고 명령을 입력합니다. 콘솔 로그 복사·저장과 M2의 사양, 네트워크, 스토리지 정보도 한 화면에서 볼 수 있습니다.',
        en: 'Use the browser serial console to watch boot logs and the login prompt in real time, then enter commands. Copy or save console logs and inspect the M2’s specs, network, and storage on the same screen.',
      },
      image: '/dashboard-terminal.png',
      alt: { ko: '실행 중인 M2의 브라우저 시리얼 Terminal', en: 'Browser serial Terminal connected to a running M2' },
      icon: '/m2-icon.png',
      imagePosition: 'center 34%',
    },
  },
  {
    id: 'micronetwork',
    label: 'MicroNetwork',
    title: { ko: '직접 설계하는 격리 네트워크', en: 'Isolated networks you define' },
    description: {
      ko: 'MicroNetwork는 bridge, gateway, DHCP, NAT와 방화벽 규칙을 하나의 명시적인 네트워크로 관리합니다. 서로 다른 네트워크의 M2는 기본적으로 분리됩니다.',
      en: 'MicroNetwork manages a bridge, gateway, DHCP, NAT, and firewall rules as one explicit network. M2s on different networks are isolated by default.',
    },
    image: '/dashboard-networks.png',
    alt: { ko: 'FireCrab MicroNetwork 생성과 네트워크 목록', en: 'FireCrab MicroNetwork creation and network list' },
    icon: '/micronetwork-icon.png',
    details: { ko: ['사용자 정의 subnet CIDR', '네트워크별 인터넷 정책', '고정 IPv4·MAC·hostname'], en: ['Custom subnet CIDR', 'Internet policy per network', 'Persistent IPv4, MAC, and hostname'] },
    secondary: null,
  },
  {
    id: 'microstorage',
    label: 'MicroStorage',
    title: { ko: '워크로드에 맞춰 고르는 저장 위치', en: 'Storage placement per workload' },
    description: {
      ko: 'MicroStorage는 호스트에 마운트된 디렉터리를 M2 스토리지 풀로 등록합니다. 기본 디스크, NVMe, 별도 SSD 등 원하는 위치에 VM rootfs를 분산할 수 있습니다.',
      en: 'MicroStorage registers host-mounted directories as M2 storage pools. Place VM root filesystems across a default disk, NVMe, or separate SSDs.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab M2 생성 화면의 MicroStorage 저장 위치 선택', en: 'Selecting a MicroStorage location while creating an M2' },
    icon: '/microstorage-icon.png',
    details: { ko: ['기존 마운트 경로 등록', 'M2별 저장 위치 선택', '중지 후에도 rootfs 유지'], en: ['Register existing mount paths', 'Choose storage per M2', 'Persistent rootfs across restarts'] },
    secondary: null,
  },
  {
    id: 'm2image',
    label: 'M2Image',
    title: { ko: 'M2를 시작하는 검증된 이미지', en: 'Verified images that boot M2s' },
    description: {
      ko: 'M2Image는 커널, rootfs, initramfs와 부팅 설정을 담은 Firecracker 전용 템플릿입니다. Alpine, Ubuntu, Rocky 이미지를 준비하고 검증해 재사용합니다.',
      en: 'M2Image is a Firecracker-ready template containing the kernel, rootfs, initramfs, and boot configuration. Prepare, verify, and reuse Alpine, Ubuntu, and Rocky images.',
    },
    image: '/dashboard-images.png',
    alt: { ko: 'FireCrab M2Image 목록과 설치 상태', en: 'FireCrab M2Image list and installation state' },
    icon: '/m2image-icon.png',
    details: { ko: ['패키지 다운로드·검증', '임시 builder VM 부트스트랩', '사용 중인 VM 추적'], en: ['Download and verify packages', 'Bootstrap in a temporary builder VM', 'Track M2s using each image'] },
    secondary: {
      label: 'MICROBOOT',
      title: { ko: '배포판을 M2Image로 부트스트랩', en: 'Bootstrap a distribution into an M2Image' },
      description: {
        ko: 'MicroBoot는 임시 builder VM을 실행해 운영체제를 설치하고 Firecracker용 이미지로 패키징합니다. 준비, 시스템 설치, 패키징, 마무리 단계를 추적하며 builder 콘솔을 실시간으로 확인할 수 있습니다.',
        en: 'MicroBoot starts a temporary builder VM, installs the operating system, and packages it as a Firecracker-ready image. Follow preparation, installation, packaging, and finalization while watching the builder console live.',
      },
      image: '/dashboard-microboot.png',
      alt: { ko: 'MicroBoot builder VM의 이미지 설치 진행 과정과 실시간 콘솔', en: 'MicroBoot builder VM image installation progress and live console' },
      icon: '/microboot-icon.svg',
      imagePosition: 'center 72%',
    },
  },
];

const workflow = [
  {
    number: '01',
    title: { ko: 'MicroNetwork 생성', en: 'Create a MicroNetwork' },
    description: { ko: '서브넷과 인터넷 정책을 직접 정합니다. 숨겨진 기본 네트워크는 없습니다.', en: 'Define the subnet and internet policy yourself. There is no hidden default network.' },
  },
  {
    number: '02',
    title: { ko: '이미지와 자원 선택', en: 'Choose image and resources' },
    description: { ko: '설치된 이미지, vCPU, RAM, 디스크와 저장 위치를 선택해 VM을 만듭니다.', en: 'Create an M2 with an installed image, vCPU, RAM, disk, and storage location.' },
  },
  {
    number: '03',
    title: { ko: '시작하고 Terminal 연결', en: 'Start and open Terminal' },
    description: { ko: '게스트가 네트워크 준비를 보고하면 running으로 전환되고 콘솔에 연결할 수 있습니다.', en: 'Once the guest reports network readiness, it becomes running and the console is available.' },
  },
];

export default function LandingPage() {
  const [language, setLanguage] = useState<Language>(() => {
    const browserLanguage = window.navigator.languages?.[0] ?? window.navigator.language;
    return browserLanguage.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  });
  const [activeView, setActiveView] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentView = productViews[activeView];
  const t = (ko: string, en: string) => language === 'ko' ? ko : en;

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = 'FireCrab';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      language === 'ko'
        ? 'FireCrab은 사용자가 관리하는 Linux 단일 호스트에서 Firecracker microVM, 격리 네트워크, 이미지와 시리얼 콘솔을 운영하는 오픈소스 플랫폼입니다.'
        : 'FireCrab is an open-source platform for operating Firecracker microVMs, isolated networks, images, and serial consoles on a Linux host you control.',
    );
  }, [language]);

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  const copyInstallCommand = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fc-site">
      <a className="fc-skip-link" href="#main-content">{t('본문으로 건너뛰기', 'Skip to content')}</a>

      <header className="fc-header">
        <div className="fc-nav-shell">
          <a className="fc-wordmark" href="#top" aria-label="FireCrab 홈">
            <img src="/firecrab-icon.png" alt="" aria-hidden="true" /><span>FireCrab</span>
          </a>

          <nav className="fc-desktop-nav" aria-label="주요 메뉴">
            <a href="#product">{t('제품', 'Product')}</a>
            <a href="#workflow">{t('사용 흐름', 'Workflow')}</a>
            <a href="#install">{t('설치', 'Install')}</a>
            <a href={language === 'ko' ? '/docs' : '/en/docs'}>{t('문서', 'Docs')}</a>
            <a href={language === 'ko' ? '/blog' : '/en/blog'}>{t('블로그', 'Blog')}</a>
          </nav>

          <div className="fc-nav-actions">
            <div className="fc-language-switch" aria-label={t('언어 선택', 'Language selector')}>
              <Languages size={15} aria-hidden="true" />
              <button type="button" className={language === 'ko' ? 'is-active' : ''} aria-pressed={language === 'ko'} onClick={() => changeLanguage('ko')}>한국어</button>
              <i aria-hidden="true" />
              <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>English</button>
            </div>
            <a className="fc-github-link" href={repositoryUrl} target="_blank" rel="noreferrer">
              <Github size={17} /> GitHub
            </a>
            <a className="fc-nav-cta" href="#install">{t('설치하기', 'Install')}</a>
          </div>

          <button
            className="fc-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? t('메뉴 닫기', 'Close menu') : t('메뉴 열기', 'Open menu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="fc-mobile-nav"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        <nav className="fc-mobile-nav" id="fc-mobile-nav" hidden={!mobileMenuOpen} aria-label="모바일 메뉴">
          <div className="fc-mobile-language">
            <button type="button" className={language === 'ko' ? 'is-active' : ''} aria-pressed={language === 'ko'} onClick={() => changeLanguage('ko')}>한국어</button>
            <button type="button" className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>English</button>
          </div>
          {[
            [t('제품', 'Product'), '#product'],
            [t('사용 흐름', 'Workflow'), '#workflow'],
            [t('설치', 'Install'), '#install'],
            [t('문서', 'Docs'), language === 'ko' ? '/docs' : '/en/docs'],
            [t('블로그', 'Blog'), language === 'ko' ? '/blog' : '/en/blog'],
          ].map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMobileMenuOpen(false)}>{label}</a>
          ))}
          <a href={repositoryUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub ↗</a>
        </nav>
      </header>

      <main id="main-content">
        <section className="fc-hero" id="top" aria-labelledby="fc-hero-title">
          <div className="fc-hero-copy">
            <p className="fc-kicker"><span /> PRIVATE MICROVM CLOUD</p>
            <h1 id="fc-hero-title">{t('내 서버에 두는', 'A smaller VM platform')}<br /><em>{t('가장 작은 VM 플랫폼.', 'for your own server.')}</em></h1>
            <p className="fc-hero-lead">
              {t(
                'FireCrab은 내가 관리하는 Linux 호스트에서 Firecracker microVM을 실행하는 오픈소스 플랫폼입니다. 강한 격리는 필요하지만 거대한 클라우드 컨트롤 플레인은 필요 없는 환경을 위해 만들었습니다.',
                'FireCrab is an open-source platform for running Firecracker microVMs on a Linux host you control. It is built for environments that need strong isolation without a large cloud control plane.',
              )}
            </p>
            <div className="fc-hero-actions">
              <a className="fc-primary-button" href="#install">{t('3줄로 설치하기', 'Install in 3 lines')} <ArrowRight size={18} /></a>
              <a className="fc-text-button" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={18} /> {t('소스 코드 보기', 'View source')}</a>
            </div>
            <ul className="fc-requirement-list" aria-label="핵심 조건">
              <li><Check size={14} /> Linux + KVM</li>
              <li><Check size={14} /> Single host</li>
              <li><Check size={14} /> Apache 2.0</li>
            </ul>
          </div>

          <figure className="fc-hero-visual">
            <div className="fc-hero-media">
              <img src="/dashboard-firecrab-m2.gif" alt={t('FireCrab 대시보드에서 M2와 네트워크, 이미지를 관리하는 데모', 'Demo of managing M2s, networks, and images in the FireCrab dashboard')} />
            </div>
          </figure>
        </section>

        <section className="fc-proof-strip" aria-label="기술 구성">
          <div><strong>Rust API</strong><span>{t('수명주기와 상태 관리', 'Lifecycle and state management')}</span></div>
          <div><strong>Firecracker</strong><span>{t('VM마다 하나의 프로세스', 'One process per VM')}</span></div>
          <div><strong>React Dashboard</strong><span>{t('한국어·영어 지원', 'Korean and English')}</span></div>
          <div><strong>Self-hosted</strong><span>{t('데이터와 호스트를 직접 소유', 'You own the host and data')}</span></div>
        </section>

        <section className="fc-positioning">
          <p className="fc-section-index">01 / PRODUCT POSITION</p>
          <div className="fc-positioning-grid">
            <h2>{t('컨테이너보다 강하게 격리하고,', 'Stronger isolation than containers,')}<br /><span>{t('클라우드보다 작게 운영합니다.', 'smaller operations than a cloud.')}</span></h2>
            <div>
              <p>
                {t(
                  'FireCrab은 호스팅 서비스도, 멀티 호스트 스케줄러도 아닙니다. 사설 단일 서버에서 서로 격리된 워크로드를 명확한 네트워크·스토리지 정책과 함께 운영하는 도구입니다.',
                  'FireCrab is not a hosted service or a multi-host scheduler. It runs isolated workloads on a private single server with explicit network and storage policies.',
                )}
              </p>
              <div className="fc-fit-list">
                <span><CheckCircle2 size={17} /> {t('홈랩·엣지·내부 서비스', 'Homelab, edge, and internal services')}</span>
                <span><CheckCircle2 size={17} /> {t('온프레미스·폐쇄망 호스트', 'On-premises and air-gapped hosts')}</span>
                <span><CheckCircle2 size={17} /> {t('컨테이너 이상의 격리가 필요한 작업', 'Workloads needing stronger isolation than containers')}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="fc-product" id="product" aria-labelledby="fc-product-title">
          <div className="fc-section-heading">
            <div>
              <p className="fc-section-index">02 / PRODUCT TOUR</p>
              <h2 id="fc-product-title">{t('M2를 이루는', 'Four building blocks')}<br />{t('네 가지 기본 단위.', 'behind every M2.')}</h2>
            </div>
            <p>{t('M2, 네트워크, 스토리지와 이미지를 하나의 흐름으로 조합해 전용 실행 환경을 만듭니다.', 'Combine compute, networking, storage, and images in one flow to create a dedicated runtime environment.')}</p>
          </div>

          <div className="fc-product-tour">
            <div className="fc-tour-tabs" role="tablist" aria-label="대시보드 화면 선택">
              {productViews.map((view, index) => {
                return (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === index}
                    aria-controls="fc-tour-panel"
                    className={activeView === index ? 'is-active' : ''}
                    onClick={() => setActiveView(index)}
                    key={view.id}
                  >
                    <span><img src={view.icon} alt="" aria-hidden="true" /> {view.label}</span>
                    <small>0{index + 1}</small>
                  </button>
                );
              })}
            </div>

            <div className="fc-tour-panel" id="fc-tour-panel" role="tabpanel">
              <div className="fc-tour-copy">
                <img className="fc-tour-product-icon" src={currentView.icon} alt="" aria-hidden="true" />
                <span>0{activeView + 1} — {currentView.label.toUpperCase()}</span>
                <h3>{currentView.title[language]}</h3>
                <p>{currentView.description[language]}</p>
                <ul>{currentView.details[language].map((detail) => <li key={detail}><Check size={15} /> {detail}</li>)}</ul>
              </div>
              <div className="fc-tour-media">
                <figure className="fc-screen-frame">
                  <img key={currentView.image} src={currentView.image} alt={currentView.alt[language]} />
                </figure>
              </div>
              {currentView.secondary ? (
                <article className="fc-tour-secondary">
                  <div className="fc-tour-secondary-copy">
                    <img src={currentView.secondary.icon} alt="" aria-hidden="true" />
                    <span>{currentView.secondary.label}</span>
                    <h4>{currentView.secondary.title[language]}</h4>
                    <p>{currentView.secondary.description[language]}</p>
                    <a href={currentView.secondary.image} target="_blank" rel="noreferrer">
                      {t('원본 이미지 보기', 'Open original image')} <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                  <figure>
                    <figcaption>{t('모바일에서는 이미지를 좌우로 밀어 자세히 볼 수 있습니다.', 'Swipe the image horizontally on mobile to inspect details.')}</figcaption>
                    <img
                      src={currentView.secondary.image}
                      alt={currentView.secondary.alt[language]}
                      style={{ objectPosition: currentView.secondary.imagePosition }}
                    />
                  </figure>
                </article>
              ) : null}
            </div>
          </div>
        </section>

        <section className="fc-workflow" id="workflow" aria-labelledby="fc-workflow-title">
          <div className="fc-section-heading">
            <div>
              <p className="fc-section-index">03 / FIRST RUN</p>
              <h2 id="fc-workflow-title">{t('첫 M2까지 세 단계.', 'Your first M2 in three steps.')}</h2>
            </div>
            <p>{t('설치 후', 'After installation, start at')} <code>127.0.0.1:3000</code>{t('에서 시작합니다.', '.')}</p>
          </div>
          <ol className="fc-workflow-list">
            {workflow.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title[language]}</h3>
                <p>{step.description[language]}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="fc-install" id="install" aria-labelledby="fc-install-title">
          <div className="fc-install-copy">
            <p className="fc-section-index">04 / INSTALL</p>
            <h2 id="fc-install-title">{t('서버는 이미 있으니까.', 'You already have the server.')}<br /><span>{t('이제 FireCrab만.', 'Now add FireCrab.')}</span></h2>
            <p>Linux + systemd, <code>/dev/kvm</code>{t(', 네트워크와 sudo 권한이 있는 일반 사용자 계정이 필요합니다.', ', network access, and a regular user account with sudo privileges are required.')}</p>
            <div className="fc-install-links">
              <a href={language === 'ko' ? `${repositoryUrl}/blob/main/docs/20-guides/install.md` : `${repositoryUrl}#install-on-a-linux-host`} target="_blank" rel="noreferrer">{t('전체 설치 가이드', 'Full install guide')} <ArrowRight size={16} /></a>
              <a href={`${repositoryUrl}/blob/main/${language === 'ko' ? 'README.ko.md' : 'README.md'}`} target="_blank" rel="noreferrer">{language === 'ko' ? 'README.ko' : 'README'}</a>
            </div>
          </div>

          <div className="fc-install-terminal">
            <div className="fc-terminal-header"><span>TERMINAL</span><button type="button" onClick={copyInstallCommand}>{copied ? <Check size={15} /> : <Clipboard size={15} />}{copied ? t('복사됨', 'Copied') : t('복사', 'Copy')}</button></div>
            <pre><code><span>$</span> git clone https://github.com/SteelCrab/firecrab.git{`\n`}<span>$</span> cd firecrab{`\n`}<span>$</span> ./install.sh</code></pre>
            <div className="fc-terminal-status"><i /> {t('설치가 끝나면', 'When installation finishes:')} http://127.0.0.1:3000</div>
          </div>
        </section>

        <section className="fc-final-cta">
          <div>
            <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
            <p>YOUR SERVER. YOUR MICROVMS.</p>
          </div>
          <h2>{t('작은 서버 한 대에서', 'Isolated workloads,')}<br />{t('제대로 격리된 워크로드를.', 'on one small server.')}</h2>
          <a href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={19} /> {t('GitHub에서 FireCrab 보기', 'View FireCrab on GitHub')} <ArrowRight size={18} /></a>
        </section>
      </main>

      <footer className="fc-footer">
        <a className="fc-wordmark" href="#top"><img src="/firecrab-icon.png" alt="" aria-hidden="true" /><span>FireCrab</span></a>
        <p>A lightweight microVM platform for your own server.</p>
        <nav aria-label={t('푸터 메뉴', 'Footer navigation')}><a href={language === 'ko' ? '/docs' : '/en/docs'}>Docs</a><a href={language === 'ko' ? '/blog' : '/en/blog'}>Blog</a><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a></nav>
        <span>Apache 2.0 · © 2026 FireCrab</span>
      </footer>
    </div>
  );
}
