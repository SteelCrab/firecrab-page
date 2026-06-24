import { useEffect, type CSSProperties } from 'react';
import {
  Activity,
  ArrowRight,
  Box,
  CheckCircle2,
  Cpu,
  Flame,
  GitBranch,
  HardDrive,
  MemoryStick,
  Network,
  PlayCircle,
  Server,
  TerminalSquare,
} from 'lucide-react';
import {
  siAlpinelinux,
  siDebian,
  siNginx,
  siPostgresql,
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

type Comparison = {
  label: string;
  legacy: string;
  firecrab: string;
};

type Stage = {
  label: string;
  items: string[];
};

type RuntimeTemplate = {
  title: string;
  role: string;
  description: string;
  brandIcon: SimpleIcon;
};

type MicroVmComparisonGroup = {
  title: string;
  columns: [string, string];
  rows: Array<[string, string, string]>;
};

type MicroVmSpec = {
  label: string;
  value: string;
  icon: IconComponent;
};

type ExecutionStep = {
  label: string;
  title: string;
  description: string;
  icon: IconComponent;
};

type RevealStyle = CSSProperties & {
  '--reveal-delay'?: string;
};

const revealDelay = (index: number, step = 70): RevealStyle => ({
  '--reveal-delay': `${index * step}ms`,
});

const keywords: Keyword[] = [
  {
    title: 'MicroVM 생성',
    description: 'Ubuntu, Debian, Alpine 이미지 기반 생성.',
    icon: Server,
  },
  {
    title: '자원 커스텀',
    description: 'CPU Core, Memory, Disk, Network 직접 설정.',
    icon: Cpu,
  },
  {
    title: 'Dashboard / Monitoring',
    description: 'VM 수, CPU, Memory, Disk 사용량 확인.',
    icon: Activity,
  },
  {
    title: 'Console / Image',
    description: 'Serial Console, Web SSH, OS 이미지 관리.',
    icon: TerminalSquare,
  },
];

const comparisons: Comparison[] = [
  {
    label: '핵심 방향',
    legacy: '범용 서버 가상화 플랫폼',
    firecrab: 'Firecracker 전용 MicroVM 관리 플랫폼',
  },
  {
    label: '가상화 방식',
    legacy: 'KVM, QEMU, ESXi 기반 일반 VM',
    firecrab: 'Firecracker 기반 MicroVM',
  },
  {
    label: 'VM 구성',
    legacy: 'BIOS / UEFI, VGA, 다양한 가상 장치 포함 가능',
    firecrab: 'vCPU, Memory, Linux Kernel, RootFS, Network, Serial 중심',
  },
  {
    label: '플랫폼 범위',
    legacy: 'VM, Storage, Network, Cluster, HA, Backup까지 포함',
    firecrab: 'MicroVM 생성, 자원 설정, 콘솔, 모니터링에 집중',
  },
  {
    label: '사용 목적',
    legacy: '데이터센터 / 서버 가상화 운영',
    firecrab: '가벼운 격리 VM을 빠르게 생성·관리',
  },
  {
    label: '자원 설정',
    legacy: '가능하지만 일반 VM 기준',
    firecrab: '작은 MicroVM 단위로 CPU / Memory / Disk / Network 커스텀',
  },
  {
    label: '콘솔 방식',
    legacy: 'VNC, SPICE, Web Console, SSH',
    firecrab: 'Serial Console, Web SSH 중심',
  },
  {
    label: '운영 규모',
    legacy: '대규모 / 복잡한 인프라에 적합',
    firecrab: '단일 서버 또는 소규모 인프라에 적합',
  },
  {
    label: '차별화 핵심',
    legacy: '범용성과 기능 다양성',
    firecrab: '경량성, 단순성, Firecracker 전용성',
  },
];

const microVmComparisons: MicroVmComparisonGroup[] = [
  {
    title: '일반 VM과 차이',
    columns: ['일반 VM', 'MicroVM'],
    rows: [
      ['구성', 'BIOS / UEFI, VGA, USB 포함 가능', 'vCPU, Memory, Kernel, RootFS 중심'],
      ['목적', '범용 서버 / 데스크톱 가상화', '빠르게 실행되는 작은 리눅스 서버 VM'],
      ['디스크', '가상 Disk', 'RootFS Disk'],
      ['네트워크', '범용 가상 네트워크', 'TAP Network 중심'],
      ['콘솔', 'VNC, SPICE, Web Console', 'Serial Console 중심'],
      ['사용 목적', '데이터센터 / 서버 가상화 운영', '서버 앱용 격리 실행 환경'],
    ],
  },
];

const firecrabMicroVmSpec: MicroVmSpec[] = [
  { label: 'CPU', value: '2 Core', icon: Cpu },
  { label: 'Memory', value: '2GB', icon: MemoryStick },
  { label: 'Disk', value: '20GB', icon: HardDrive },
  { label: 'Image', value: 'Ubuntu Minimal', icon: Server },
  { label: 'Network', value: 'NAT', icon: Network },
  { label: 'Console', value: 'Serial Console', icon: TerminalSquare },
];

const runtimeTemplates: RuntimeTemplate[] = [
  {
    title: 'Ubuntu Minimal',
    role: 'BASE OS',
    description: '기본 서버 이미지',
    brandIcon: siUbuntu,
  },
  {
    title: 'Debian Minimal',
    role: 'BASE OS',
    description: '안정적인 기본 이미지',
    brandIcon: siDebian,
  },
  {
    title: 'Alpine Minimal',
    role: 'BASE OS',
    description: '초경량 Linux 이미지',
    brandIcon: siAlpinelinux,
  },
  {
    title: 'Nginx Server',
    role: 'HTTP EDGE',
    description: 'Nginx 포함 RootFS',
    brandIcon: siNginx,
  },
  {
    title: 'Redis Server',
    role: 'CACHE',
    description: 'Redis 포함 RootFS',
    brandIcon: siRedis,
  },
  {
    title: 'PostgreSQL Server',
    role: 'SQL',
    description: 'PostgreSQL 포함 RootFS',
    brandIcon: siPostgresql,
  },
];

const executionSteps: ExecutionStep[] = [
  {
    label: '01',
    title: '이미지 선택',
    description: 'Ubuntu Minimal 이미지를 선택합니다.',
    icon: Server,
  },
  {
    label: '02',
    title: '자원 지정',
    description: '2 vCPU, 2GB Memory, 20GB Disk, NAT Network를 입력합니다.',
    icon: Cpu,
  },
  {
    label: '03',
    title: 'MicroVM 생성 요청',
    description: 'FireCrab이 MicroVM Spec을 저장하고 Firecracker에 전달합니다.',
    icon: Flame,
  },
  {
    label: '04',
    title: '부팅 및 네트워크 연결',
    description: 'Kernel, RootFS, TAP Network, Serial Console을 연결합니다.',
    icon: Network,
  },
  {
    label: '05',
    title: 'Running 상태 확인',
    description: '상태와 Console 접속 정보를 대시보드에 표시합니다.',
    icon: CheckCircle2,
  },
];

const executionLogs = [
  'image ubuntu-minimal selected',
  'spec saved: 2vcpu / 2048mb / 20gb',
  'firecracker socket request accepted',
  'tap0 attached, serial console opened',
  'state changed to running',
];

const roadmap: Stage[] = [
  {
    label: 'MVP',
    items: [
      '로그인',
      'Dashboard',
      'MicroVM 목록 조회',
      'MicroVM 생성',
      'CPU / Memory / Disk / Network 설정',
      '시작 / 중지 / 재시작 / 삭제',
      '상태 표시 / Serial Console / 로그',
    ],
  },
  {
    label: '2차 기능',
    items: ['이미지 업로드', '템플릿 관리', 'Snapshot', 'VM별 자원 그래프', 'REST API 문서화'],
  },
  {
    label: '3차 기능',
    items: ['Multi Host', '사용자별 VM 할당', '권한 관리', 'Scheduling', 'Terraform Provider'],
  },
];

const stack = [
  ['Frontend', 'React, TypeScript'],
  ['Backend', 'Rust, Axum, Tokio'],
  ['Database', 'PostgreSQL'],
  ['MicroVM Engine', 'Firecracker'],
  ['Host OS', 'Ubuntu Server / Debian'],
  ['Console', 'WebSocket'],
  ['API', 'REST API'],
];

function App() {
  useScrollReveal();

  return (
    <main className="page-shell">
      <header className="topbar" aria-label="FireCrab navigation">
        <a className="brand" href="#top" aria-label="FireCrab home">
          <span className="brand-mark" aria-hidden="true">
            <Flame size={20} strokeWidth={2.4} />
          </span>
          <span>FireCrab</span>
        </a>
        <nav className="nav-links" aria-label="주요 섹션">
          <a href="#difference">차별점</a>
          <a href="#roadmap">MVP</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <RuntimeScene />
        <div className="hero-copy">
          <p className="eyebrow">Firecracker 기반 MicroVM 관리 플랫폼</p>
          <h1 id="hero-title">FireCrab</h1>
          <p className="hero-titleline">
            웹에서 MicroVM을 만들고 CPU, Memory, Disk, Network를 직접 설정합니다.
          </p>
          <div className="hero-actions" aria-label="핵심 흐름 바로가기">
            <a className="primary-action" href="#runtime-flow">
              <PlayCircle size={18} />
              MicroVM 생성 흐름
            </a>
            <a className="secondary-action" href="#difference">
              <GitBranch size={18} />
              차별점 보기
            </a>
          </div>
        </div>
      </section>

      <section className="section intro-section" aria-labelledby="overview-title" data-reveal="section">
        <div className="section-kicker">Project Overview</div>
        <div className="intro-grid">
          <div data-reveal="slide-right">
            <h2 id="overview-title">웹에서 MicroVM 생성·관리</h2>
            <p>
              FireCrab은 기존 VM 플랫폼보다 가볍게 MicroVM을 생성·관리할 수
              있도록 Firecracker에 특화된 오픈소스 경량 VM 관리 플랫폼입니다.
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
      </section>

      <section className="section microvm-section" aria-labelledby="microvm-title" data-reveal="section">
        <div className="section-kicker">What is a MicroVM</div>
        <div className="microvm-intro">
          <div data-reveal="slide-right">
            <h2 id="microvm-title">MicroVM은 작은 리눅스 서버 VM입니다</h2>
            <p>
              Firecracker MicroVM은 서버 실행에 필요한 vCPU, Memory, Linux Kernel,
              RootFS, Network, Serial Console 중심으로 구성됩니다.
            </p>
          </div>
        </div>

        <div className="microvm-compare-grid single-card" aria-label="MicroVM 비교 요약">
          {microVmComparisons.map((group, index) => (
            <article
              className="microvm-compare-card"
              data-reveal="tile"
              key={group.title}
              style={revealDelay(index)}
            >
              <h3>{group.title}</h3>
              <div className="microvm-mini-table">
                <div className="microvm-mini-head">
                  <span>구분</span>
                  <span>{group.columns[0]}</span>
                  <strong>{group.columns[1]}</strong>
                </div>
                {group.rows.map(([label, source, micro]) => (
                  <div className="microvm-mini-row" key={label}>
                    <span data-label="구분">{label}</span>
                    <p data-label={group.columns[0]}>{source}</p>
                    <strong data-label={group.columns[1]}>{micro}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="microvm-example" aria-label="FireCrab MicroVM 예시" data-reveal="fade-up">
          <div>
            <div className="section-kicker">FireCrab Example</div>
            <h3>Ubuntu Minimal 이미지로 MicroVM 생성</h3>
            <p>
              Image, CPU, Memory, Disk, Network, Console 사양을 선택해 작은 리눅스
              서버 VM을 만듭니다.
            </p>
          </div>
          <div className="microvm-spec-grid">
            {firecrabMicroVmSpec.map((spec, index) => (
              <div
                className="microvm-spec"
                data-reveal="tile"
                key={spec.label}
                style={revealDelay(index, 45)}
              >
                <spec.icon size={18} />
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section contrast-section" id="difference" aria-labelledby="difference-title" data-reveal="section">
        <div className="section-kicker">Difference</div>
        <h2 id="difference-title" data-reveal="slide-right">기존 VM 플랫폼과 FireCrab의 차이</h2>
        <div className="comparison-table" role="table" aria-label="기존 VM 플랫폼과 FireCrab 비교">
          <div className="comparison-row comparison-head" role="row">
            <span role="columnheader">구분</span>
            <span role="columnheader">기존 VM 플랫폼</span>
            <span role="columnheader">FireCrab</span>
          </div>
          {comparisons.map((row, index) => (
            <div className="comparison-row" data-reveal="row" role="row" key={row.label} style={revealDelay(index, 55)}>
              <span role="cell">{row.label}</span>
              <span role="cell">{row.legacy}</span>
              <strong role="cell">{row.firecrab}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section flow-section" id="runtime-flow" aria-labelledby="flow-title" data-reveal="section">
        <div className="section-kicker">Execution Example</div>
        <div className="split-heading">
          <h2 id="flow-title" data-reveal="slide-right">Ubuntu MicroVM이 실행되기까지</h2>
          <p data-reveal="slide-left">
            이미지 선택부터 Firecracker 생성 요청, 부팅, Running 상태 표시까지의
            흐름을 한 번의 실행 예시로 보여줍니다.
          </p>
        </div>

        <div className="execution-demo" aria-label="MicroVM 실행 순서 예시" data-reveal="fade-up">
          <div className="execution-timeline" aria-label="실행 순서">
            {executionSteps.map((step, index) => (
              <article className="execution-step" key={step.title}>
                <span className="execution-step-number">{step.label}</span>
                <div className="execution-step-icon" aria-hidden="true">
                  <step.icon size={18} />
                </div>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
                {index < executionSteps.length - 1 ? (
                  <ArrowRight className="execution-step-arrow" size={18} aria-hidden="true" />
                ) : null}
              </article>
            ))}
          </div>

          <div className="execution-console" aria-label="MicroVM 실행 로그">
            <div className="execution-console-head">
              <div>
                <span>firecrab create</span>
                <strong>vm-ubuntu-fn42</strong>
              </div>
              <em>running</em>
            </div>

            <div className="execution-spec">
              <span>Ubuntu Minimal</span>
              <span>2 vCPU</span>
              <span>2GB Memory</span>
              <span>20GB Disk</span>
              <span>NAT</span>
            </div>

            <div className="execution-boot-visual" aria-hidden="true">
              <div className="boot-orbit">
                <Flame size={26} />
              </div>
              <div className="boot-stack">
                <span>Kernel</span>
                <span>RootFS</span>
                <span>TAP</span>
                <span>Serial</span>
              </div>
            </div>

            <div className="execution-log">
              {executionLogs.map((log, index) => (
                <p key={log}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {log}
                </p>
              ))}
            </div>

            <div className="execution-result">
              <CheckCircle2 size={18} />
              <span>Serial Console ready</span>
              <strong>ssh://vm-ubuntu.firecrab.local</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section template-section" aria-labelledby="template-title" data-reveal="section">
        <div data-reveal="slide-right">
          <div className="section-kicker">MicroVM Template</div>
          <h2 id="template-title">OS 이미지와 MicroVM 템플릿 관리</h2>
          <p>
            기본 OS 이미지를 관리하고, Nginx나 Redis처럼 미리 구성된 RootFS 템플릿은
            MicroVM 생성 편의 기능으로 제공합니다.
          </p>
        </div>
        <div className="template-board" aria-label="MicroVM Template 목록" data-reveal="slide-left">
          {runtimeTemplates.map((template, index) => (
            <div className="template-chip" data-reveal="tile" key={template.title} style={revealDelay(index, 55)}>
              <div className="template-icon" aria-hidden="true">
                <BrandIcon icon={template.brandIcon} />
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

      <section className="section roadmap-section" id="roadmap" aria-labelledby="roadmap-title" data-reveal="section">
        <div className="section-kicker">Scope</div>
        <h2 id="roadmap-title" data-reveal="slide-right">MVP에서 멀티 호스트까지</h2>
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
          <p>Firecracker에 특화된 오픈소스 경량 VM 관리 플랫폼.</p>
        </div>
        <a href="#top">맨 위로</a>
      </footer>
    </main>
  );
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
  const color = icon.hex === '000000' ? '#251c18' : `#${icon.hex}`;

  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      role="img"
      style={{ color }}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function RuntimeScene() {
  const runtimeRows = [
    ['vm-ubuntu-fn42', 'Ubuntu Minimal', '2 GiB', 'ready'],
    ['vm-alpine-2c91', 'Alpine Minimal', '512 MiB', 'ready'],
    ['vm-redis-a19c', 'Redis Server', '1 GiB', 'ready'],
    ['vm-postgres-db7', 'PostgreSQL Server', '4 GiB', 'paused'],
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
            <Flame size={18} />
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
