import { useEffect, useState, type CSSProperties } from 'react';
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  Cloud,
  Code2,
  Coffee,
  Cpu,
  Database,
  Flame,
  GitBranch,
  Network,
  PlayCircle,
  Server,
  TerminalSquare,
} from 'lucide-react';
import {
  siNginx,
  siPostgresql,
  siPython,
  siRedis,
  siUbuntu,
  type SimpleIcon,
} from 'simple-icons';
import './App.css';

type IconComponent = typeof Flame;

type Keyword = {
  title: string;
  description: string;
  icon: IconComponent;
};

type OverviewItem = {
  title: string;
  description: string;
  icon: IconComponent;
};

type Comparison = {
  label: string;
  vmPlatform: string;
  firecrab: string;
};

type Stage = {
  label: string;
  items: string[];
};

type ExecutionMode = {
  title: string;
  role: string;
  description: string;
  icon: IconComponent;
};

type MicroVmTemplate = {
  title: string;
  description: string;
  brandIcon?: SimpleIcon;
  icon?: IconComponent;
  iconColor?: string;
};

type DeploymentStep = {
  label: string;
  title: string;
  description: string;
  icon?: IconComponent;
};

type RevealStyle = CSSProperties & {
  '--reveal-delay'?: string;
};

const revealDelay = (index: number, step = 70): RevealStyle => ({
  '--reveal-delay': `${index * step}ms`,
});

const keywords: Keyword[] = [
  {
    title: 'MicroVM Web Dashboard',
    description: '브라우저에서 MicroVM 생성, 상태, 자원, 콘솔을 관리.',
    icon: Server,
  },
  {
    title: 'Firecracker Native',
    description: 'Firecracker API Socket, RootFS, TAP, Serial 제어에 맞춘 구조.',
    icon: Cpu,
  },
  {
    title: 'Template 기반 생성',
    description: 'Ubuntu, Python, Nginx, Redis 같은 템플릿으로 빠르게 생성.',
    icon: Network,
  },
  {
    title: 'Lifecycle Control',
    description: 'MicroVM 생성, 시작, 중지, 삭제를 일관된 흐름으로 제어.',
    icon: GitBranch,
  },
  {
    title: 'Console & Logs',
    description: 'Serial Console, Web SSH, 이벤트 로그로 실행 상태를 확인.',
    icon: Code2,
  },
  {
    title: 'Closed Network Ready',
    description: '인터넷 의존도를 낮춰 내부망·폐쇄망 설치 환경에도 어필.',
    icon: TerminalSquare,
  },
];

const overviewItems: OverviewItem[] = [
  {
    title: '관리 대상',
    description: 'Firecracker MicroVM, 이미지 템플릿, 자원 사양, 상태, 콘솔, 로그.',
    icon: Server,
  },
  {
    title: '생성 방식',
    description: '템플릿 선택 후 CPU, Memory, Disk, Network 값을 지정해 MicroVM 생성.',
    icon: Network,
  },
  {
    title: '운영 기능',
    description: '생성, 시작, 중지, 삭제, 상태 확인, Serial Console, 이벤트 로그.',
    icon: GitBranch,
  },
  {
    title: '설치 환경',
    description: '단일 서버, 온프레미스, 내부망·폐쇄망에서도 운영 가능한 구조.',
    icon: TerminalSquare,
  },
];

const comparisons: Comparison[] = [
  {
    label: '핵심 방향',
    vmPlatform: '범용 서버 가상화 플랫폼',
    firecrab: 'Firecracker 전용 MicroVM 관리 플랫폼',
  },
  {
    label: '가상화 방식',
    vmPlatform: 'KVM, QEMU, ESXi 기반 일반 VM',
    firecrab: 'Firecracker 기반 MicroVM',
  },
  {
    label: 'VM 구성',
    vmPlatform: 'BIOS / UEFI, VGA, 다양한 가상 장치 포함 가능',
    firecrab: 'vCPU, Memory, RootFS, Network, Serial 중심',
  },
  {
    label: '플랫폼 범위',
    vmPlatform: 'VM, Storage, Network, Cluster, HA, Backup까지 포함',
    firecrab: 'MicroVM 생성, 자원 설정, 콘솔, 모니터링에 집중',
  },
  {
    label: '사용 목적',
    vmPlatform: '데이터센터 / 서버 가상화 운영',
    firecrab: '가벼운 격리 VM을 빠르게 생성·관리',
  },
  {
    label: '자원 설정',
    vmPlatform: '가능하지만 일반 VM 기준',
    firecrab: '작은 MicroVM 단위로 CPU / Memory / Disk 커스텀',
  },
  {
    label: '콘솔 방식',
    vmPlatform: 'VNC, SPICE, Web Console, SSH',
    firecrab: 'Serial Console, Web SSH 중심',
  },
  {
    label: '운영 규모',
    vmPlatform: '대규모 / 복잡한 인프라에 적합',
    firecrab: '단일 서버 또는 소규모 인프라에 적합',
  },
  {
    label: '차별화 핵심',
    vmPlatform: '범용성과 기능 다양성',
    firecrab: '경량성, 단순성, Firecracker 전용성',
  },
];

const executionModes: ExecutionMode[] = [
  {
    title: 'MicroVM Lifecycle',
    role: 'CREATE / START / STOP',
    description: 'MicroVM 생성, 시작, 중지, 삭제를 Web Dashboard와 REST API에서 제어.',
    icon: Code2,
  },
  {
    title: 'Image Template',
    role: 'ROOTFS / KERNEL',
    description: 'Ubuntu Minimal, Python, Nginx, Redis 같은 목적별 이미지 타입으로 생성.',
    icon: Server,
  },
  {
    title: 'Resource Spec',
    role: 'CPU / MEMORY / DISK',
    description: 'vCPU, Memory, Disk, Network 값을 지정해 MicroVM Spec을 저장하고 실행.',
    icon: Network,
  },
  {
    title: 'Console & Logs',
    role: 'SERIAL / WEB LOG',
    description: 'Serial Console, Web SSH, Event Log로 부팅 상태와 실행 로그를 확인.',
    icon: GitBranch,
  },
  {
    title: 'Firecracker Native',
    role: 'API SOCKET',
    description: 'Firecracker API Socket, TAP Network, RootFS 중심으로 가볍게 제어.',
    icon: TerminalSquare,
  },
  {
    title: 'Closed Network Ready',
    role: 'ON-PREMISE',
    description: '내부 서버와 폐쇄망에도 설치 가능한 단순한 운영 구조를 목표로 확장.',
    icon: CheckCircle2,
  },
];

const microVmTemplates: MicroVmTemplate[] = [
  {
    title: 'Ubuntu Minimal',
    description: '가장 기본적인 Linux MicroVM 이미지. 테스트와 범용 서버 작업에 사용합니다.',
    brandIcon: siUbuntu,
  },
  {
    title: 'Python Server',
    description: 'Python 런타임이 포함된 MicroVM 이미지. API 서버나 작업 실행에 사용합니다.',
    brandIcon: siPython,
  },
  {
    title: 'Nginx Server',
    description: 'Nginx가 포함된 RootFS로 빠르게 Web Server MicroVM을 생성합니다.',
    brandIcon: siNginx,
  },
  {
    title: 'Redis Server',
    description: 'Redis 실행 준비가 된 MicroVM 이미지. 격리된 캐시 노드를 구성합니다.',
    brandIcon: siRedis,
  },
  {
    title: 'PostgreSQL Server',
    description: 'PostgreSQL이 포함된 MicroVM 이미지. 작은 내부 서비스 DB 검증에 사용합니다.',
    brandIcon: siPostgresql,
  },
  {
    title: 'Java Server',
    description: 'JDK가 포함된 MicroVM 이미지. Spring Boot 같은 JVM 서비스를 격리 실행합니다.',
    icon: Coffee,
    iconColor: '#e76f00',
  },
];

const deploymentSteps: DeploymentStep[] = [
  {
    label: '01',
    title: '관리자 / 개발자',
    description: 'Web Dashboard에서 생성할 MicroVM 정보를 입력합니다.',
    icon: Code2,
  },
  {
    label: '02',
    title: 'Web Dashboard',
    description: '템플릿과 CPU, Memory, Disk, Network 값을 선택합니다.',
    icon: Flame,
  },
  {
    label: '03',
    title: 'FireCrab Control',
    description: 'MicroVM Spec을 저장하고 Firecracker 제어 요청으로 변환합니다.',
    icon: Network,
  },
  {
    label: '04',
    title: 'Firecracker',
    description: 'API Socket으로 vCPU, Memory, RootFS, TAP을 구성합니다.',
    icon: Server,
  },
  {
    label: '05',
    title: 'MicroVM Ready',
    description: '상태, Console, Logs, Endpoint를 대시보드에 표시합니다.',
    icon: Cloud,
  },
];

const roadmap: Stage[] = [
  {
    label: 'MVP',
    items: [
      'MicroVM 목록 / 상세 조회',
      '템플릿 기반 생성',
      'CPU / Memory / Disk 설정',
      'MicroVM 생성 / 실행 / 종료',
      'Serial Console',
      '로그 조회',
      'REST API 제공',
    ],
  },
  {
    label: '2차 기능',
    items: ['Template 관리', 'Snapshot', 'Monitoring', '사용자 / 권한 관리', 'Host Agent', '배포 이력 관리'],
  },
  {
    label: '3차 기능',
    items: ['Multi Host', 'Scheduling', 'Template Marketplace', 'Terraform Provider', '폐쇄망 패키징', '운영 대시보드 고도화'],
  },
];

const stack = [
  ['Frontend', 'React, TypeScript'],
  ['Backend', 'Rust, Axum, Tokio'],
  ['Database', 'PostgreSQL'],
  ['API Server', 'REST API, WebSocket'],
  ['MicroVM Engine', 'Firecracker'],
  ['Host OS', 'Ubuntu Server / Debian'],
  ['Console', 'Serial Console, Web SSH'],
  ['Agent', 'FireCrab Host Agent'],
];

function App() {
  useScrollReveal();
  const activeDeploymentStep = useCyclingIndex(deploymentSteps.length, 1700);

  return (
    <main className="page-shell">
      <header className="topbar" aria-label="FireCrab navigation">
        <a className="brand" href="#top" aria-label="FireCrab home">
          <span className="brand-mark" aria-hidden="true">
            <img className="brand-mark-icon" src="/firecrab-icon.png" alt="" />
          </span>
          <span>FireCrab</span>
        </a>
        <nav className="nav-links" aria-label="주요 섹션">
          <a href="#overview">개요</a>
          <a href="#templates">템플릿</a>
          <a href="#difference">차별점</a>
          <a href="#roadmap">MVP</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <RuntimeScene />
        <div className="hero-copy">
          <p className="eyebrow">Firecracker 기반 MicroVM Web 관리 플랫폼</p>
          <h1 id="hero-title">FireCrab</h1>
          <p className="hero-titleline">
            웹 대시보드에서 Firecracker MicroVM을 생성하고, 자원 설정·상태·콘솔·로그를 가볍게 관리합니다.
          </p>
          <div className="hero-actions" aria-label="핵심 흐름 바로가기">
            <a className="primary-action" href="#deploy-flow">
              <PlayCircle size={18} />
              배포 흐름 보기
            </a>
            <a className="secondary-action" href="#difference">
              <GitBranch size={18} />
              차별점 보기
            </a>
          </div>
        </div>
      </section>

      <section className="section intro-section" id="overview" aria-labelledby="overview-title" data-reveal="section">
        <div className="section-kicker">Project Overview</div>
        <div className="intro-grid">
          <div data-reveal="slide-right">
            <h2 id="overview-title">Web Dashboard 기반 MicroVM 관리</h2>
            <p>
              FireCrab은 기존 VM 플랫폼보다 가볍게 MicroVM을 생성·관리할 수 있도록
              Firecracker에 특화된 오픈소스 경량 VM 관리 플랫폼입니다. 단일 서버, 온프레미스,
              내부망·폐쇄망 환경에서도 운영 가능한 구조를 목표로 합니다.
            </p>
          </div>
          <div className="keyword-grid" aria-label="핵심 키워드" data-reveal="slide-left">
            {keywords.map((keyword, index) => (
              <article
                className="keyword-item"
                data-reveal="tile"
                key={keyword.title}
                style={revealDelay(index)}
              >
                <keyword.icon size={22} />
                <h3>{keyword.title}</h3>
                <p>{keyword.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="overview-expansion" aria-labelledby="overview-expanded-title" data-reveal="fade-up">
          <div className="overview-expanded-heading">
            <div>
              <div className="section-kicker">Platform Scope</div>
              <h3 id="overview-expanded-title">FireCrab이 다루는 영역</h3>
            </div>
            <p>
              MicroVM을 만들고, 사양을 저장하고, 실행 상태를 확인하는 관리 흐름을
              Web Dashboard 안에 모읍니다.
            </p>
          </div>

          <div className="overview-scope-grid" aria-label="FireCrab 프로젝트 개요 확장">
            {overviewItems.map((item, index) => (
              <article className="overview-scope-card" data-reveal="tile" key={item.title} style={revealDelay(index, 60)}>
                <div className="overview-scope-icon" aria-hidden="true">
                  <item.icon size={22} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section contrast-section" id="difference" aria-labelledby="difference-title" data-reveal="section">
        <div className="section-kicker">Difference</div>
        <h2 id="difference-title" data-reveal="slide-right">VM 플랫폼과 FireCrab의 차이</h2>
        <div className="comparison-table" role="table" aria-label="기존 플랫폼과 FireCrab 비교">
          <div className="comparison-row comparison-head" role="row">
            <span role="columnheader">구분</span>
            <span role="columnheader">기존 VM 플랫폼</span>
            <span role="columnheader">FireCrab</span>
          </div>
          {comparisons.map((row, index) => (
            <div className="comparison-row" data-reveal="row" role="row" key={row.label} style={revealDelay(index, 55)}>
              <span role="cell">{row.label}</span>
              <span role="cell">{row.vmPlatform}</span>
              <strong role="cell">{row.firecrab}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section image-template-section" id="templates" aria-labelledby="templates-title" data-reveal="section">
        <div className="image-template-heading">
          <div data-reveal="slide-right">
            <div className="section-kicker">MicroVM Templates</div>
            <h2 id="templates-title">템플릿 카드로 MicroVM 생성</h2>
          </div>
          <p data-reveal="slide-left">
            OS 템플릿을 그대로 노출하기보다, 실행 목적에 맞춘 RootFS 이미지와 기본 설정을
            카드로 선택하게 만드는 관리 흐름입니다.
          </p>
        </div>

        <div className="microvm-template-grid" aria-label="MicroVM Template 목록">
          {microVmTemplates.map((template, index) => {
            const TemplateIcon = template.icon;
            const templateBrandColor = template.brandIcon ? `#${template.brandIcon.hex}` : template.iconColor;

            return (
              <article
                className="microvm-template-card"
                data-reveal="tile"
                key={template.title}
                style={revealDelay(index, 55)}
              >
                <div className="microvm-template-card-head">
                  <div
                    className="microvm-template-icon"
                    aria-hidden="true"
                    style={{ '--template-brand': templateBrandColor } as CSSProperties}
                  >
                    {template.brandIcon ? <BrandIcon icon={template.brandIcon} /> : null}
                    {TemplateIcon ? <TemplateIcon size={32} strokeWidth={2.2} /> : null}
                  </div>
                </div>
                <h3>{template.title}</h3>
                <p>{template.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section template-section" aria-labelledby="template-title" data-reveal="section">
        <div data-reveal="slide-right">
          <div className="section-kicker">Management Features</div>
          <h2 id="template-title">MicroVM 관리 기능</h2>
          <p>
            대시보드에서 MicroVM의 생성, 자원 설정, 상태 제어, 콘솔, 로그를 한 흐름으로 관리합니다.
          </p>
        </div>
        <div className="template-board" aria-label="FireCrab 실행 모드 목록" data-reveal="slide-left">
          {executionModes.map((template, index) => (
            <div className="template-chip" data-reveal="tile" key={template.title} style={revealDelay(index, 55)}>
              <div className="template-icon" aria-hidden="true">
                <template.icon size={30} />
              </div>
              <div>
                <span>{template.role}</span>
                <strong>{template.title}</strong>
                <p>{template.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="section deploy-flow-section"
        id="deploy-flow"
        aria-labelledby="deploy-flow-title"
        data-reveal="section"
      >
        <div className="section-kicker">Deploy Flow</div>
        <div className="split-heading">
          <h2 id="deploy-flow-title" data-reveal="slide-right">대시보드에서 Firecracker MicroVM까지</h2>
          <p data-reveal="slide-left">
            사용자가 Web Dashboard에서 템플릿과 자원 사양을 선택하면 FireCrab Control이
            MicroVM Spec을 저장하고 Firecracker 제어 요청으로 변환합니다.
          </p>
        </div>

        <div
          className="deploy-flow"
          aria-label="FireCrab 배포 흐름"
          data-reveal="fade-up"
        >
          <div className="deploy-flow-steps">
            {deploymentSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeDeploymentStep;
              const isComplete = index < activeDeploymentStep;

              return (
                <div className="deploy-flow-stage" key={step.title}>
                  <article
                    className={`deploy-flow-card${isActive ? ' is-active' : ''}${isComplete ? ' is-complete' : ''}`}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    <div className="deploy-flow-node" aria-hidden="true">
                      <span className="deploy-flow-number">{step.label}</span>
                      <div className="deploy-flow-icon">
                        {Icon ? <Icon size={24} /> : null}
                      </div>
                    </div>
                    <div className="deploy-flow-copy">
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </article>

                  {index < deploymentSteps.length - 1 ? (
                    <div
                      className={`deploy-flow-arrow${isComplete ? ' is-complete' : ''}${isActive ? ' is-active' : ''}`}
                      aria-hidden="true"
                    >
                      <span />
                      <ArrowRight size={20} />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section roadmap-section" id="roadmap" aria-labelledby="roadmap-title" data-reveal="section">
        <div className="section-kicker">Scope</div>
        <h2 id="roadmap-title" data-reveal="slide-right">MVP에서 Multi Host 운영까지</h2>
        <div className="roadmap-grid">
          {roadmap.map((stage, index) => (
            <article className="roadmap-stage" data-reveal="tile" key={stage.label} style={revealDelay(index, 70)}>
              <h3>{stage.label}</h3>
              <ul>
                {stage.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section stack-section" aria-labelledby="stack-title" data-reveal="section">
        <div data-reveal="slide-right">
          <div className="section-kicker">Technology Stack</div>
          <h2 id="stack-title">React, Rust, Firecracker 중심 스택</h2>
        </div>
        <div className="stack-list" aria-label="기술 스택" data-reveal="slide-left">
          {stack.map(([area, value], index) => (
            <div className="stack-row" data-reveal="row" key={area} style={revealDelay(index, 45)}>
              <span>{area}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>FireCrab</strong>
          <p>Firecracker 기반 MicroVM Web 관리 플랫폼.</p>
        </div>
        <a href="#top">맨 위로</a>
      </footer>
    </main>
  );
}

function useCyclingIndex(length: number, intervalMs: number) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (length <= 1) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setIndex((current) => (current + 1) % length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, length]);

  return index;
}

function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

    if (!elements.length) {
      return undefined;
    }

    const showAll = () => {
      elements.forEach((element) => element.classList.add('is-visible'));
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
      showAll();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.14,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" role="img" aria-label={icon.title}>
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function RuntimeScene() {
  const runtimeRows = [
    ['vm-ubuntu-fn42', 'Ubuntu Minimal', '2 GiB', 'ready'],
    ['vm-nginx-02', 'Nginx Server', '1 GiB', 'booting'],
    ['vm-redis-08', 'Redis Server', '512 MiB', 'ready'],
    ['vm-java-api', 'Java Server', '768 MiB', 'paused'],
  ];
  const platformNavItems: Array<[string, IconComponent]> = [
    ['Dashboard', Activity],
    ['MicroVMs', Activity],
    ['Images', Box],
    ['Hosts', Cpu],
    ['Monitoring', Network],
    ['Console', TerminalSquare],
  ];

  return (
    <div className="runtime-scene" aria-hidden="true">
      <div className="platform-window">
        <aside className="platform-sidebar">
          <div className="platform-logo">
            <img className="platform-logo-mark" src="/firecrab-icon.png" alt="" />
            <span>FireCrab</span>
          </div>
          <div className="platform-nav">
            {platformNavItems.map(([label, Icon]) => (
              <div className={label === 'Dashboard' ? 'active' : ''} key={label}>
                <Icon size={15} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>

        <div className="platform-workspace">
          <div className="platform-toolbar">
            <div>
              <span>FireCrab Console</span>
              <strong>prod-host-01 / microvms</strong>
            </div>
            <div className="platform-health">
              <span />
              Host healthy
            </div>
          </div>

          <div className="platform-content">
            <div className="platform-stats">
              <div className="platform-stat">
                <span>Running MicroVMs</span>
                <strong>18</strong>
                <i>+4 today</i>
              </div>
              <div className="platform-stat">
                <span>CPU Used</span>
                <strong>42%</strong>
                <i>12 vCPU</i>
              </div>
              <div className="platform-stat">
                <span>Memory Used</span>
                <strong>3.6 GiB</strong>
                <i>of 16 GiB</i>
              </div>
            </div>

            <section className="platform-runtime-table">
              <div className="platform-section-title">
                <div>
                  <span>MicroVM Instances</span>
                  <strong>Image based MicroVMs</strong>
                </div>
                <button tabIndex={-1}>Create MicroVM</button>
              </div>
              <div className="platform-table-head">
                <span>MicroVM</span>
                <span>Image Type</span>
                <span>Memory</span>
                <span>State</span>
              </div>
              {runtimeRows.map(([runtime, template, memory, state]) => (
                <div className="platform-table-row" key={runtime}>
                  <span>{runtime}</span>
                  <span>{template}</span>
                  <span>{memory}</span>
                  <strong className={`state-${state}`}>{state}</strong>
                </div>
              ))}
            </section>

            <div className="platform-side-grid">
              <section className="platform-host-map">
                <div className="platform-section-title compact">
                  <span>MicroVM Slots</span>
                  <strong>firecracker.sock</strong>
                </div>
                <div className="slot-grid">
                  {Array.from({ length: 20 }, (_, index) => (
                    <span
                      className={index % 7 === 0 ? 'booting' : index % 5 === 0 ? 'idle' : 'ready'}
                      key={index}
                    />
                  ))}
                </div>
              </section>

              <section className="platform-event-log">
                <div className="platform-section-title compact">
                  <span>Event Stream</span>
                  <strong>last 42s</strong>
                </div>
                <p><span>12:04:18</span> ubuntu-minimal image selected</p>
                <p><span>12:04:19</span> vCPU / memory / disk saved</p>
                <p><span>12:04:21</span> tap0 network attached</p>
                <p><span>12:04:22</span> serial console ready</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
