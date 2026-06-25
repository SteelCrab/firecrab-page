import { useEffect, useState, type CSSProperties } from 'react';
import {
  Activity,
  ArrowRight,
  Bell,
  Box,
  CheckCircle2,
  Cloud,
  Code2,
  Coffee,
  Cpu,
  Flame,
  GitBranch,
  LayoutDashboard,
  MoreHorizontal,
  Network,
  PlayCircle,
  Plus,
  Power,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
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

type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
  icon: IconComponent;
  tone: 'blue' | 'green' | 'yellow' | 'gray';
};

type DashboardMicroVm = {
  id: string;
  name: string;
  image: string;
  state: 'running' | 'booting' | 'paused' | 'stopped';
  host: string;
  cpu: string;
  memory: string;
  disk: string;
  ip: string;
  endpoint: string;
  updated: string;
};

type DashboardEvent = {
  time: string;
  level: 'info' | 'success' | 'warn';
  message: string;
};

type DashboardTemplateOption = {
  title: string;
  meta: string;
  icon?: IconComponent;
  brandIcon?: SimpleIcon;
};

type VmGraphMetric = {
  label: string;
  vm: number;
  microvm: number;
  vmLabel: string;
  microvmLabel: string;
  note: string;
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

const vmMicroVmGraphMetrics: VmGraphMetric[] = [
  {
    label: '부팅 / 준비 시간',
    vm: 100,
    microvm: 24,
    vmLabel: '전체 VM 기준',
    microvmLabel: '빠른 시작',
    note: '작은 VM 구성으로 생성 후 실행까지의 대기 시간을 줄입니다.',
  },
  {
    label: '기본 자원 사용',
    vm: 100,
    microvm: 36,
    vmLabel: '크게 할당',
    microvmLabel: '작게 할당',
    note: '필요한 vCPU, Memory, RootFS 중심으로 MicroVM을 구성합니다.',
  },
  {
    label: '가상 장치 범위',
    vm: 94,
    microvm: 34,
    vmLabel: '범용 장치',
    microvmLabel: '최소 장치',
    note: 'BIOS, VGA 같은 범용 구성보다 서버 실행에 필요한 장치에 집중합니다.',
  },
  {
    label: '운영 복잡도',
    vm: 88,
    microvm: 42,
    vmLabel: '넓은 범위',
    microvmLabel: '단순 제어',
    note: 'Storage, Cluster, HA 전체보다 MicroVM 생성과 상태 제어에 집중합니다.',
  },
  {
    label: '격리 경계',
    vm: 86,
    microvm: 82,
    vmLabel: 'VM 수준',
    microvmLabel: 'MicroVM 수준',
    note: '컨테이너와 달리 독립 커널을 가진 작은 VM 단위로 격리합니다.',
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
    description: '선택한 사양을 저장하고 Firecracker에 MicroVM 생성을 요청합니다.',
    icon: Network,
  },
  {
    label: '04',
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

const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Running MicroVM',
    value: '18',
    detail: '3개 호스트에서 실행 중',
    icon: Server,
    tone: 'blue',
  },
  {
    label: 'Allocated vCPU',
    value: '32',
    detail: '사용률 42%',
    icon: Cpu,
    tone: 'green',
  },
  {
    label: 'Memory Pool',
    value: '28 GiB',
    detail: '전체 64 GiB 중 할당',
    icon: Activity,
    tone: 'yellow',
  },
  {
    label: 'Template Images',
    value: '7',
    detail: 'Ubuntu, Python, Nginx 포함',
    icon: Box,
    tone: 'gray',
  },
];

const dashboardMicroVms: DashboardMicroVm[] = [
  {
    id: 'fc-web-001',
    name: 'fc-web-001',
    image: 'Ubuntu Minimal',
    state: 'running',
    host: 'host-01',
    cpu: '2 vCPU',
    memory: '2 GiB',
    disk: '20 GiB',
    ip: '10.24.0.18',
    endpoint: 'ssh://fc-web-001.local',
    updated: '방금 전',
  },
  {
    id: 'fc-nginx-edge',
    name: 'fc-nginx-edge',
    image: 'Nginx Server',
    state: 'running',
    host: 'host-01',
    cpu: '1 vCPU',
    memory: '1 GiB',
    disk: '10 GiB',
    ip: '10.24.0.21',
    endpoint: 'http://edge.firecrab.local',
    updated: '2분 전',
  },
  {
    id: 'fc-python-job',
    name: 'fc-python-job',
    image: 'Python Server',
    state: 'booting',
    host: 'host-02',
    cpu: '2 vCPU',
    memory: '2 GiB',
    disk: '12 GiB',
    ip: '10.24.0.32',
    endpoint: 'serial://fc-python-job',
    updated: '5분 전',
  },
  {
    id: 'fc-redis-cache',
    name: 'fc-redis-cache',
    image: 'Redis Server',
    state: 'paused',
    host: 'host-02',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '8 GiB',
    ip: '10.24.0.41',
    endpoint: 'redis://10.24.0.41:6379',
    updated: '14분 전',
  },
  {
    id: 'fc-java-api',
    name: 'fc-java-api',
    image: 'Java Server',
    state: 'running',
    host: 'host-03',
    cpu: '2 vCPU',
    memory: '3 GiB',
    disk: '24 GiB',
    ip: '10.24.0.52',
    endpoint: 'https://api.firecrab.local',
    updated: '21분 전',
  },
];

const dashboardEvents: DashboardEvent[] = [
  { time: '14:22:10', level: 'success', message: 'fc-nginx-edge 상태가 running으로 변경되었습니다.' },
  { time: '14:21:48', level: 'info', message: 'Python Server 이미지로 MicroVM 생성 요청이 접수되었습니다.' },
  { time: '14:20:31', level: 'warn', message: 'host-02 memory allocation이 54%에 도달했습니다.' },
  { time: '14:18:09', level: 'info', message: 'Serial Console 세션이 fc-web-001에 연결되었습니다.' },
];

const dashboardTemplates: DashboardTemplateOption[] = [
  { title: 'Ubuntu Minimal', meta: 'Kernel + RootFS', brandIcon: siUbuntu },
  { title: 'Python Server', meta: 'API / Batch', brandIcon: siPython },
  { title: 'Nginx Server', meta: 'Web Server', brandIcon: siNginx },
  { title: 'Redis Server', meta: 'Cache Node', brandIcon: siRedis },
  { title: 'Java Server', meta: 'JVM Service', icon: Coffee },
];

function App() {
  const currentPath = useCurrentPath();
  useScrollReveal();
  const activeDeploymentStep = useCyclingIndex(deploymentSteps.length, 1700);

  if (currentPath === '/dashboard') {
    return <DashboardMockupPage />;
  }

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
          <a href="/dashboard">대시보드</a>
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
            <a className="primary-action" href="/dashboard">
              <LayoutDashboard size={18} />
              대시보드 보기
            </a>
            <a className="secondary-action" href="#deploy-flow">
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

        <div
          className="vm-graph-panel"
          aria-labelledby="vm-graph-title"
          data-reveal="fade-up"
        >
          <div className="vm-graph-heading">
            <div>
              <div className="section-kicker">VM vs MicroVM</div>
              <h3 id="vm-graph-title">일반 VM과 MicroVM의 상대 비교</h3>
            </div>
            <p>
              FireCrab이 목표로 하는 방향은 범용 VM 전체 관리보다 작고 빠른 MicroVM 생성과
              상태 제어에 집중하는 것입니다.
            </p>
          </div>

          <div className="vm-graph-grid">
            <div className="vm-graph-bars" role="img" aria-label="일반 VM과 MicroVM 상대 그래프">
              {vmMicroVmGraphMetrics.map((metric, index) => (
                <article
                  className="vm-graph-row"
                  data-reveal="row"
                  key={metric.label}
                  style={{
                    '--vm-score': `${metric.vm}%`,
                    '--microvm-score': `${metric.microvm}%`,
                    '--reveal-delay': `${index * 60}ms`,
                  } as CSSProperties}
                >
                  <div className="vm-graph-label">
                    <strong>{metric.label}</strong>
                    <span>{metric.note}</span>
                  </div>
                  <div className="vm-graph-track-group">
                    <div className="vm-graph-track">
                      <span>일반 VM</span>
                      <div className="vm-graph-track-line">
                        <i className="vm-bar" />
                      </div>
                      <em>{metric.vmLabel}</em>
                    </div>
                    <div className="vm-graph-track">
                      <span>MicroVM</span>
                      <div className="vm-graph-track-line">
                        <i className="microvm-bar" />
                      </div>
                      <em>{metric.microvmLabel}</em>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="vm-profile-grid" aria-label="VM과 MicroVM 요약">
              <article className="vm-profile-card" data-reveal="tile">
                <div className="vm-profile-icon" aria-hidden="true">
                  <Server size={24} />
                </div>
                <h4>일반 VM</h4>
                <p>범용 OS와 다양한 가상 장치를 포함해 서버 전체를 운영하는 방식.</p>
                <ul>
                  <li>넓은 기능 범위</li>
                  <li>큰 자원 단위</li>
                  <li>복잡한 운영 기능</li>
                </ul>
              </article>

              <article className="vm-profile-card micro" data-reveal="tile" style={revealDelay(1, 80)}>
                <div className="vm-profile-icon" aria-hidden="true">
                  <Cpu size={24} />
                </div>
                <h4>MicroVM</h4>
                <p>독립 커널을 가진 작은 VM을 빠르게 만들고 서버 앱 실행에 집중하는 방식.</p>
                <ul>
                  <li>작은 실행 단위</li>
                  <li>빠른 생성 흐름</li>
                  <li>Firecracker 전용 제어</li>
                </ul>
              </article>
            </div>
          </div>
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
            사용자가 템플릿과 자원 사양을 선택하면 FireCrab Control이 설정을 저장하고
            Firecracker에 MicroVM 생성을 요청합니다.
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

function DashboardMockupPage() {
  const [selectedMicroVmId, setSelectedMicroVmId] = useState(dashboardMicroVms[0].id);
  const selectedMicroVm =
    dashboardMicroVms.find((microVm) => microVm.id === selectedMicroVmId) ?? dashboardMicroVms[0];
  const stateLabels: Record<DashboardMicroVm['state'], string> = {
    running: 'Running',
    booting: 'Booting',
    paused: 'Paused',
    stopped: 'Stopped',
  };
  const dashboardNavItems: Array<[string, IconComponent, boolean]> = [
    ['Dashboard', LayoutDashboard, true],
    ['MicroVM instances', Server, false],
    ['Image templates', Box, false],
    ['Host agents', Cpu, false],
    ['Serial console', TerminalSquare, false],
    ['Access control', ShieldCheck, false],
  ];
  const selectedSpecRows = [
    ['MicroVM ID', selectedMicroVm.id],
    ['Image type', selectedMicroVm.image],
    ['Host agent', selectedMicroVm.host],
    ['Endpoint', selectedMicroVm.endpoint],
    ['Last event', selectedMicroVm.updated],
  ];

  return (
    <div className="dashboard-shell">
      <header className="dashboard-globalbar" aria-label="FireCrab console global navigation">
        <a className="dashboard-global-brand" href="/" aria-label="FireCrab landing page">
          <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
          <strong>FireCrab</strong>
        </a>
        <button className="dashboard-services-button" type="button">
          <Box size={16} />
          Services
        </button>
        <label className="dashboard-global-search">
          <Search size={16} />
          <span className="sr-only">콘솔 검색</span>
          <input type="search" placeholder="Search MicroVMs, templates, host agents" />
        </label>
        <div className="dashboard-global-actions" aria-label="Console utilities">
          <button type="button">Support</button>
          <button type="button">firecrab-admin</button>
        </div>
      </header>

      <aside className="dashboard-sidebar" aria-label="FireCrab dashboard navigation">
        <nav className="dashboard-nav" aria-label="대시보드 메뉴">
          <div className="dashboard-nav-heading">FireCrab Control</div>
          {dashboardNavItems.map(([label, Icon, active]) => (
            <a className={active ? 'is-active' : ''} href="#dashboard-overview" key={label}>
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="dashboard-sidebar-status">
          <span>CONTROL PLANE</span>
          <strong>Available</strong>
          <p>Host Agent 3대 연결, Firecracker socket 정상</p>
        </div>
      </aside>

      <main className="dashboard-main" id="dashboard-overview">
        <div className="dashboard-content">
          <section className="dashboard-page-header" aria-labelledby="dashboard-title">
            <div className="dashboard-breadcrumb">
              <a href="/">FireCrab</a>
              <ArrowRight size={13} />
              <span>MicroVM management</span>
            </div>
            <div className="dashboard-page-title-row">
              <div>
                <div className="dashboard-kicker">FireCrab Control Plane</div>
                <h1 id="dashboard-title">MicroVM Dashboard</h1>
              </div>
              <div className="dashboard-header-actions">
                <button className="dashboard-secondary-button" type="button">
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button className="dashboard-secondary-button" type="button">
                  <Bell size={16} />
                  Alarms
                </button>
                <a className="dashboard-primary-button" href="#dashboard-create">
                  <Plus size={16} />
                  Launch MicroVM
                </a>
              </div>
            </div>
            <p>
              Firecracker 기반 MicroVM 인스턴스, 이미지 템플릿, Host Agent, Serial Console을
              운영자 관점에서 빠르게 제어하는 전문가용 콘솔입니다.
            </p>
          </section>

          <section className="dashboard-alert" aria-label="운영 상태 알림">
            <ShieldCheck size={18} />
            <div>
              <strong>Control plane healthy</strong>
              <span>3 host agents connected. TAP network and serial console checks passed.</span>
            </div>
          </section>

          <div className="dashboard-tabs" aria-label="MicroVM dashboard tabs">
            <a className="is-active" href="#dashboard-overview">Instances</a>
            <a href="#dashboard-create">Launch template</a>
            <a href="#log-title">Event log</a>
            <a href="#console-title">Console</a>
          </div>

          <section className="dashboard-metric-grid" aria-label="대시보드 주요 지표">
            {dashboardMetrics.map((metric) => (
              <article className={`dashboard-metric-card tone-${metric.tone}`} key={metric.label}>
                <div className="dashboard-metric-icon" aria-hidden="true">
                  <metric.icon size={20} />
                </div>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.detail}</p>
              </article>
            ))}
          </section>

          <div className="dashboard-grid">
            <section className="dashboard-panel dashboard-instance-panel" aria-labelledby="instance-title">
              <div className="dashboard-panel-head">
                <div>
                  <span>Resources</span>
                  <h2 id="instance-title">MicroVM instances</h2>
                </div>
                <div className="dashboard-panel-tools">
                  <label className="dashboard-table-filter">
                    <Search size={15} />
                    <span className="sr-only">MicroVM 목록 검색</span>
                    <input type="search" placeholder="Filter by name, host, image" />
                  </label>
                  <button className="dashboard-ghost-button" type="button">
                    <RefreshCw size={15} />
                    Sync
                  </button>
                  <button className="dashboard-ghost-button" type="button">
                    <MoreHorizontal size={15} />
                  </button>
                </div>
              </div>

              <div className="dashboard-instance-table" role="table" aria-label="MicroVM 목록">
                <div className="dashboard-instance-row dashboard-instance-head" role="row">
                  <span role="columnheader">Name</span>
                  <span role="columnheader">Image</span>
                  <span role="columnheader">State</span>
                  <span role="columnheader">Host</span>
                  <span role="columnheader">Resources</span>
                  <span role="columnheader">Endpoint</span>
                  <span role="columnheader">Actions</span>
                </div>

                {dashboardMicroVms.map((microVm) => (
                  <button
                    className={`dashboard-instance-row${selectedMicroVm.id === microVm.id ? ' is-selected' : ''}`}
                    type="button"
                    role="row"
                    aria-pressed={selectedMicroVm.id === microVm.id}
                    onClick={() => setSelectedMicroVmId(microVm.id)}
                    key={microVm.id}
                  >
                    <span role="cell">
                      <strong>{microVm.name}</strong>
                      <small>{microVm.ip}</small>
                    </span>
                    <span role="cell">{microVm.image}</span>
                    <span role="cell">
                      <i className={`dashboard-state state-${microVm.state}`}>{stateLabels[microVm.state]}</i>
                    </span>
                    <span role="cell">{microVm.host}</span>
                    <span role="cell">{microVm.cpu} / {microVm.memory}</span>
                    <span role="cell">
                      <code>{microVm.endpoint}</code>
                    </span>
                    <span className="dashboard-row-actions" role="cell">
                      <span aria-label={`${microVm.name} 콘솔 열기`} title="Console">
                        <TerminalSquare size={15} />
                      </span>
                      <span aria-label={`${microVm.name} 전원 제어`} title="Power">
                        <Power size={15} />
                      </span>
                      <span aria-label={`${microVm.name} 더보기`} title="More">
                        <MoreHorizontal size={15} />
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="dashboard-side-stack">
              <section className="dashboard-panel dashboard-detail-panel" aria-labelledby="selected-title">
                <div className="dashboard-panel-head compact">
                  <div>
                    <span>Inspector</span>
                    <h2 id="selected-title">{selectedMicroVm.name}</h2>
                  </div>
                  <i className={`dashboard-state state-${selectedMicroVm.state}`}>{stateLabels[selectedMicroVm.state]}</i>
                </div>
                <div className="dashboard-inspector-summary">
                  <div>
                    <span>vCPU</span>
                    <strong>{selectedMicroVm.cpu}</strong>
                  </div>
                  <div>
                    <span>Memory</span>
                    <strong>{selectedMicroVm.memory}</strong>
                  </div>
                  <div>
                    <span>Disk</span>
                    <strong>{selectedMicroVm.disk}</strong>
                  </div>
                </div>
                <dl className="dashboard-detail-list">
                  {selectedSpecRows.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="dashboard-inspector-actions">
                  <button className="dashboard-primary-button" type="button">
                    <TerminalSquare size={15} />
                    Open console
                  </button>
                  <button className="dashboard-secondary-button" type="button">
                    <Power size={15} />
                    Stop
                  </button>
                </div>
              </section>

              <section className="dashboard-panel dashboard-create-panel" id="dashboard-create" aria-labelledby="create-title">
                <div className="dashboard-panel-head compact">
                  <div>
                    <span>Launch</span>
                    <h2 id="create-title">MicroVM launch template</h2>
                  </div>
                </div>

                <div className="dashboard-template-picker" aria-label="이미지 템플릿 선택">
                  {dashboardTemplates.map((template, index) => {
                    const TemplateIcon = template.icon;
                    const templateBrandColor = template.brandIcon ? `#${template.brandIcon.hex}` : '#ff9900';

                    return (
                      <button className={index === 0 ? 'is-selected' : ''} type="button" key={template.title}>
                        <span
                          className="dashboard-template-icon"
                          style={{ '--template-brand': templateBrandColor } as CSSProperties}
                          aria-hidden="true"
                        >
                          {template.brandIcon ? <BrandIcon icon={template.brandIcon} /> : null}
                          {TemplateIcon ? <TemplateIcon size={19} /> : null}
                        </span>
                        <span>
                          <strong>{template.title}</strong>
                          <small>{template.meta}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <form className="dashboard-create-form" aria-label="MicroVM 생성 설정">
                  <label>
                    vCPU
                    <select defaultValue="2">
                      <option value="1">1 Core</option>
                      <option value="2">2 Core</option>
                      <option value="4">4 Core</option>
                    </select>
                  </label>
                  <label>
                    Memory
                    <select defaultValue="2048">
                      <option value="1024">1 GiB</option>
                      <option value="2048">2 GiB</option>
                      <option value="4096">4 GiB</option>
                    </select>
                  </label>
                  <label>
                    RootFS
                    <select defaultValue="20">
                      <option value="10">10 GiB</option>
                      <option value="20">20 GiB</option>
                      <option value="40">40 GiB</option>
                    </select>
                  </label>
                  <label>
                    Network
                    <select defaultValue="tap">
                      <option value="nat">NAT</option>
                      <option value="tap">TAP Bridge</option>
                      <option value="isolated">Isolated</option>
                    </select>
                  </label>
                </form>

                <button className="dashboard-primary-button full" type="button">
                  <Plus size={16} />
                  Launch MicroVM
                </button>
              </section>
            </aside>
          </div>

          <div className="dashboard-bottom-grid">
            <section className="dashboard-panel dashboard-log-panel" aria-labelledby="log-title">
              <div className="dashboard-panel-head">
                <div>
                  <span>Operations</span>
                  <h2 id="log-title">Event log</h2>
                </div>
                <button className="dashboard-icon-button" type="button" aria-label="로그 더보기">
                  <MoreHorizontal size={17} />
                </button>
              </div>
              <div className="dashboard-log-stream">
                {dashboardEvents.map((event) => (
                  <p className={`level-${event.level}`} key={`${event.time}-${event.message}`}>
                    <span>{event.time}</span>
                    <strong>{event.level}</strong>
                    {event.message}
                  </p>
                ))}
              </div>
            </section>

            <section className="dashboard-panel dashboard-console-panel" aria-labelledby="console-title">
              <div className="dashboard-panel-head">
                <div>
                  <span>Console</span>
                  <h2 id="console-title">Serial Console</h2>
                </div>
                <button className="dashboard-ghost-button" type="button">
                  <TerminalSquare size={15} />
                  Connect
                </button>
              </div>
              <pre aria-label="Serial Console preview">
                <code>{`firecrab@${selectedMicroVm.name}:~$ fc-control inspect ${selectedMicroVm.id}
state=${selectedMicroVm.state}
image="${selectedMicroVm.image}"
host="${selectedMicroVm.host}"
endpoint="${selectedMicroVm.endpoint}"`}</code>
              </pre>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function useCurrentPath() {
  const [path, setPath] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname.replace(/\/$/, '') || '/');

    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  return path;
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
