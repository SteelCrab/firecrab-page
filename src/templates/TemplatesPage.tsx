import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  Copy,
  Cpu,
  Github,
  Globe2,
  HardDrive,
  Layers3,
  LockKeyhole,
  Menu,
  Network,
  Package,
  Play,
  Search,
  Server,
  ShieldCheck,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  siFedora,
  siGo,
  siMongodb,
  siMysql,
  siNginx,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siUbuntu,
  type SimpleIcon,
} from 'simple-icons';
import './TemplatesPage.css';

type Category = 'API' | 'Web' | 'Data' | 'Base';

type Template = {
  id: string;
  name: string;
  category: Category;
  version: string;
  eyebrow: string;
  description: string;
  brandIcon: SimpleIcon;
  tone: 'blue' | 'orange' | 'violet' | 'green' | 'cyan' | 'slate';
  runtime: string;
  architecture: string;
  cpu: string;
  memory: string;
  disk: string;
  network: string;
  deployments: string;
  updated: string;
  tags: string[];
  featured?: boolean;
};

const templates: Template[] = [
  {
    id: 'go-api',
    name: 'Go API Service',
    category: 'API',
    version: 'v2.4.0',
    eyebrow: 'Firecrab official',
    description: 'Go 기반 HTTP API를 위한 최소 RootFS, 헬스 체크, 비공개 네트워크가 준비된 서비스 템플릿입니다.',
    brandIcon: siGo,
    tone: 'blue',
    runtime: 'Go runtime',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    network: 'private-net',
    deployments: '128 launches',
    updated: 'Updated 2 days ago',
    tags: ['REST API', 'Health check', 'Private network'],
    featured: true,
  },
  {
    id: 'frontend-preview',
    name: 'Frontend Preview',
    category: 'Web',
    version: 'v1.6.0',
    eyebrow: 'Team template',
    description: '브랜치별 프론트엔드 프리뷰를 빠르게 격리하고 검수할 수 있는 경량 웹 런타임입니다.',
    brandIcon: siReact,
    tone: 'violet',
    runtime: 'Node runtime',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    network: 'preview-net',
    deployments: '96 launches',
    updated: 'Updated yesterday',
    tags: ['Preview URL', 'Branch deploy', 'TLS ready'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL 16',
    category: 'Data',
    version: 'v3.1.1',
    eyebrow: 'Verified image',
    description: '지속 볼륨, 백업 정책, 내부 전용 엔드포인트를 포함하는 데이터베이스 템플릿입니다.',
    brandIcon: siPostgresql,
    tone: 'cyan',
    runtime: 'PostgreSQL 16',
    architecture: 'amd64',
    cpu: '2 vCPU',
    memory: '4 GiB',
    disk: '40 GiB',
    network: 'data-net',
    deployments: '42 launches',
    updated: 'Updated 1 week ago',
    tags: ['Persistent volume', 'Daily backup', 'Private only'],
  },
  {
    id: 'mysql',
    name: 'MySQL 8.4',
    category: 'Data',
    version: 'v1.0.0',
    eyebrow: 'Verified image',
    description: '영구 볼륨, 자동 백업, 내부 전용 접속 구성을 포함한 MySQL LTS 데이터베이스 템플릿입니다.',
    brandIcon: siMysql,
    tone: 'blue',
    runtime: 'MySQL 8.4 LTS',
    architecture: 'amd64 / arm64',
    cpu: '2 vCPU',
    memory: '4 GiB',
    disk: '40 GiB',
    network: 'data-net',
    deployments: '37 launches',
    updated: 'Updated 2 days ago',
    tags: ['Persistent volume', 'Point-in-time backup', 'Private only'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB 8.0',
    category: 'Data',
    version: 'v1.0.0',
    eyebrow: 'Verified image',
    description: '문서형 워크로드를 위한 영구 스토리지, 백업 정책, 내부 네트워크가 준비된 MongoDB 템플릿입니다.',
    brandIcon: siMongodb,
    tone: 'green',
    runtime: 'MongoDB 8.0',
    architecture: 'amd64 / arm64',
    cpu: '2 vCPU',
    memory: '4 GiB',
    disk: '40 GiB',
    network: 'data-net',
    deployments: '29 launches',
    updated: 'Updated yesterday',
    tags: ['Persistent volume', 'Replica ready', 'Private only'],
  },
  {
    id: 'ubuntu-minimal',
    name: 'Ubuntu Minimal',
    category: 'Base',
    version: '24.04.3',
    eyebrow: 'Base image',
    description: 'cloud-init과 Firecracker 커널 구성이 검증된 범용 최소 이미지입니다.',
    brandIcon: siUbuntu,
    tone: 'slate',
    runtime: 'Ubuntu 24.04 LTS',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    network: 'default-net',
    deployments: '316 launches',
    updated: 'Updated 3 days ago',
    tags: ['cloud-init', 'Minimal RootFS', 'Signed'],
  },
  {
    id: 'fedora-minimal',
    name: 'Fedora Minimal',
    category: 'Base',
    version: 'v1.0.0',
    eyebrow: 'Base image',
    description: '작은 RootFS와 cloud-init 구성을 갖춘 범용 Fedora 기반 MicroVM 이미지입니다.',
    brandIcon: siFedora,
    tone: 'blue',
    runtime: 'Fedora minimal',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    network: 'default-net',
    deployments: '24 launches',
    updated: 'Updated today',
    tags: ['cloud-init', 'dnf', 'Minimal RootFS'],
  },
  {
    id: 'nginx-edge',
    name: 'Nginx Edge',
    category: 'Web',
    version: 'v2.2.4',
    eyebrow: 'Verified image',
    description: '정적 자산, 리버스 프록시, 엣지 TLS 종료에 맞춘 작은 웹 서버 템플릿입니다.',
    brandIcon: siNginx,
    tone: 'green',
    runtime: 'Nginx stable',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '256 MiB',
    disk: '2 GiB',
    network: 'edge-net',
    deployments: '203 launches',
    updated: 'Updated 4 days ago',
    tags: ['Reverse proxy', 'TLS', 'Static assets'],
  },
  {
    id: 'spring-api',
    name: 'Spring Boot API',
    category: 'API',
    version: 'v1.2.0',
    eyebrow: 'Verified image',
    description: 'Spring Boot 애플리케이션을 위한 경량 JRE, 헬스 체크, 기본 네트워크 구성이 포함된 템플릿입니다.',
    brandIcon: siSpringboot,
    tone: 'green',
    runtime: 'Java / Spring Boot',
    architecture: 'amd64 / arm64',
    cpu: '2 vCPU',
    memory: '2 GiB',
    disk: '8 GiB',
    network: 'private-net',
    deployments: '61 launches',
    updated: 'Updated 3 days ago',
    tags: ['Spring Boot', 'Actuator', 'Private network'],
  },
  {
    id: 'python-service',
    name: 'Python Service',
    category: 'API',
    version: 'v1.4.0',
    eyebrow: 'Verified image',
    description: 'Python 웹 서비스와 배치 작업을 빠르게 시작할 수 있도록 런타임과 기본 실행 구성을 묶은 템플릿입니다.',
    brandIcon: siPython,
    tone: 'blue',
    runtime: 'Python runtime',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    network: 'private-net',
    deployments: '89 launches',
    updated: 'Updated yesterday',
    tags: ['ASGI / WSGI', 'Batch ready', 'Health check'],
  },
];

const computeTopology = [
  {
    name: 'compute-01',
    status: 'Available',
    subnet: 'subnet-app',
    cidr: '10.42.8.0/24',
    workloads: [
      { name: 'api-01', address: '10.42.8.14' },
      { name: 'api-02', address: '10.42.8.18' },
    ],
  },
  {
    name: 'compute-02',
    status: 'Available',
    subnet: 'subnet-worker',
    cidr: '10.42.12.0/24',
    workloads: [
      { name: 'worker-01', address: '10.42.12.7' },
      { name: 'worker-02', address: '10.42.12.11' },
    ],
  },
  {
    name: 'compute-03',
    status: 'Scale ready',
    subnet: 'subnet-edge',
    cidr: '10.42.16.0/24',
    workloads: [
      { name: 'edge-01', address: '10.42.16.5' },
      { name: 'preview-01', address: '10.42.16.9' },
    ],
  },
];

const principles: Array<{ icon: LucideIcon; label: string; title: string; description: string }> = [
  {
    icon: Layers3,
    label: 'REPEATABLE',
    title: '한 번 정의하고, 어디서든 동일하게 실행',
    description: '이미지, 자원, 네트워크 설정을 버전으로 관리해 환경마다 달라지는 실행 조건을 줄입니다.',
  },
  {
    icon: LockKeyhole,
    label: 'ISOLATED',
    title: '작고 명확한 MicroVM 격리',
    description: '워크로드마다 독립된 커널과 최소한의 실행 구성을 제공해 격리 경계를 분명하게 유지합니다.',
  },
  {
    icon: Workflow,
    label: 'AUTOMATABLE',
    title: '반복 배포를 명령으로 연결',
    description: '템플릿 ID와 실행 옵션을 CLI에서 그대로 사용해 반복 작업과 배포 파이프라인을 간결하게 구성합니다.',
  },
];

const categories: Array<'All' | Category> = ['All', 'API', 'Web', 'Data', 'Base'];
const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const cliCommand = `firecrab template deploy go-api \\
  --network private-net \\
  --memory 512 \\
  --vcpus 1`;

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

export default function TemplatesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [query, setQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalResetting, setTerminalResetting] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [terminalStage, setTerminalStage] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setSelectedTemplate(null);
      }

      if (event.key === '/' && !(event.target instanceof HTMLInputElement)) {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('#template-search')?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const terminal = terminalRef.current;
    if (!terminal) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      setTypedCommand(cliCommand);
      setTerminalStage(5);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setTerminalVisible(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.35 },
    );

    observer.observe(terminal);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!terminalVisible) return undefined;

    const controller = new AbortController();

    const wait = (duration: number) => new Promise<boolean>((resolve) => {
      let timer = 0;
      const onAbort = () => {
        window.clearTimeout(timer);
        resolve(false);
      };

      timer = window.setTimeout(() => {
        controller.signal.removeEventListener('abort', onAbort);
        resolve(true);
      }, duration);
      controller.signal.addEventListener('abort', onAbort, { once: true });
    });

    const playTerminal = async () => {
      while (!controller.signal.aborted) {
        setTerminalResetting(false);
        setTypedCommand('');
        setTerminalStage(0);

        if (!(await wait(420))) return;

        for (let index = 1; index <= cliCommand.length; index += 1) {
          setTypedCommand(cliCommand.slice(0, index));
          const currentCharacter = cliCommand[index - 1];
          if (!(await wait(currentCharacter === '\n' ? 130 : 28))) return;
        }

        for (let stage = 1; stage <= 5; stage += 1) {
          if (!(await wait(320))) return;
          setTerminalStage(stage);
        }

        if (!(await wait(1600))) return;
        setTerminalResetting(true);
        if (!(await wait(180))) return;
        setTypedCommand('');
        setTerminalStage(0);
        setTerminalResetting(false);
      }
    };

    void playTerminal();
    return () => controller.abort();
  }, [terminalVisible]);

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
      const matchesQuery =
        !normalized ||
        [template.name, template.description, template.runtime, ...template.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const copyCommand = async (template: Template) => {
    const command = `firecrab template deploy ${template.id} --network private-net`;
    try {
      await navigator.clipboard.writeText(command);
    } catch {
      // Clipboard can be unavailable in local preview or non-secure contexts.
    }
    setCopied(true);
    setToast('CLI 명령어를 복사했습니다');
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="tm-page">
      <header className="tm-header">
        <div className="tm-header-inner">
          <a className="tm-brand" href="/template" aria-label="Firecrab templates home">
            <span className="tm-brand-mark"><img src="/firecrab-icon.png" alt="" /></span>
            <span><strong>Firecrab</strong><small>Templates</small></span>
          </a>

          <nav className="tm-desktop-nav" aria-label="Templates page navigation">
            <a className="is-active" href="#catalog">Templates</a>
            <a href="#workflow">How it works</a>
            <a href="#architecture">Architecture</a>
          </nav>

          <div className="tm-header-actions">
            <a className="tm-text-link" href="#architecture">기술 구성</a>
            <a className="tm-github-link" href={repositoryUrl} target="_blank" rel="noreferrer" aria-label="Open SteelCrab Firecrab repository on GitHub">
              <Github size={15} /><span>GitHub</span>
            </a>
            <a className="tm-small-cta" href="#catalog">템플릿 보기 <ArrowRight size={14} /></a>
            <button className="tm-menu-button" type="button" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav className="tm-mobile-nav" aria-label="Mobile navigation">
            <a href="#catalog" onClick={() => setMobileMenuOpen(false)}>Templates</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)}>How it works</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)}>Architecture</a>
            <a href={repositoryUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub ↗</a>
          </nav>
        ) : null}
      </header>

      <main>
        <section className="tm-hero" aria-labelledby="templates-hero-title">
          <div className="tm-hero-copy">
            <h1 id="templates-hero-title">격리된 실행 환경을,<br /><span>템플릿 하나로.</span></h1>
            <p>
              Firecrab은 커널, RootFS, 자원, 네트워크 정책을 하나의 템플릿으로 정의해
              어디서든 동일한 MicroVM 환경을 빠르고 일관되게 실행합니다.
            </p>
            <div className="tm-hero-actions">
              <a className="tm-primary-cta" href="#catalog">템플릿 둘러보기 <ArrowRight size={16} /></a>
              <a className="tm-secondary-cta" href="#workflow"><Play size={15} fill="currentColor" />작동 방식 보기</a>
            </div>
            <div className="tm-hero-proof" aria-label="Firecrab template benefits">
              <span><Check size={13} />Versioned RootFS</span>
              <span><Check size={13} />Closed-network ready</span>
            </div>
          </div>

          <div className="tm-ha-stage" aria-label="High availability compute and network architecture">
            <div className="tm-ha-canvas">
              <section className="tm-ha-tree" aria-label="Connected compute topology">
                <div className="tm-ha-tree-root"><span><img src="/firecrab-icon.png" alt="" /></span><p><strong>Compute fabric</strong><small>3 connected nodes · subnet aware</small></p></div>
                <span className="tm-ha-tree-trunk" aria-hidden="true"><i /></span>
                <div className="tm-ha-tree-branches">
                  {computeTopology.map((compute, index) => (
                    <article className="tm-ha-tree-node" style={{ '--packet-delay': `${index * 0.7}s` } as CSSProperties} key={compute.name}>
                      <span className="tm-ha-tree-branch" aria-hidden="true"><i /></span>
                      <header><span>{index === 2 ? <Zap size={15} /> : <Server size={15} />}</span><p><strong>{compute.name}</strong><small><i />{compute.status}</small></p></header>
                      <ul>
                        <li className="is-subnet"><Network size={13} /><span><strong>{compute.subnet}</strong><small>{compute.cidr}</small></span></li>
                        {compute.workloads.map((workload) => <li key={workload.name}><Box size={13} /><span><strong>{workload.name}</strong><small>Running · {workload.address}</small></span></li>)}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>

        </section>

        <section className="tm-principles" id="workflow" aria-labelledby="principles-title">
          <div className="tm-section-heading tm-centered-heading">
            <span>WHY TEMPLATES</span>
            <h2 id="principles-title">이미지가 아니라, 실행 방식을 저장합니다.</h2>
            <p>운영에 필요한 기본값과 정책까지 버전으로 관리해 누구나 같은 결과를 얻습니다.</p>
          </div>
          <div className="tm-principle-grid">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return (
                <article key={principle.title}>
                  <div className="tm-principle-icon"><Icon size={19} /></div>
                  <span>{principle.label}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="tm-catalog-section" id="catalog" aria-labelledby="catalog-title">
          <div className="tm-section-heading tm-catalog-heading">
            <div>
              <span>TEMPLATE LIBRARY</span>
              <h2 id="catalog-title">목적에 맞는 시작점을 선택하세요.</h2>
            </div>
            <p>공식 이미지부터 팀 전용 워크로드까지, 배포 전에 구성을 확인하고 바로 사용할 수 있습니다.</p>
          </div>

          <div className="tm-catalog-toolbar">
            <div className="tm-category-tabs" aria-label="Template categories">
              {categories.map((category) => (
                <button className={activeCategory === category ? 'is-active' : ''} type="button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)} key={category}>
                  {category}
                </button>
              ))}
            </div>
            <label className="tm-search-box">
              <Search size={16} />
              <span className="tm-sr-only">Search templates</span>
              <input id="template-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름 또는 런타임 검색" />
              <kbd>/</kbd>
            </label>
          </div>

          {filteredTemplates.length ? (
            <div className="tm-template-grid">
              {filteredTemplates.map((template) => {
                return (
                  <article className="tm-template-card" style={{ '--template-accent': `#${template.brandIcon.hex}` } as CSSProperties} key={template.id}>
                    <div className="tm-card-topline"><span>{template.eyebrow}</span><span>{template.version}</span></div>
                    <div className="tm-card-heading">
                      <span className="tm-template-icon is-large" style={{ '--glyph-color': `#${template.brandIcon.hex}` } as CSSProperties}><BrandIcon icon={template.brandIcon} /></span>
                      <span><small>{template.category}</small><h3>{template.name}</h3></span>
                    </div>
                    <p>{template.description}</p>
                    <div className="tm-card-facts">
                      <span><Package size={14} /><small>Runtime</small><strong>{template.runtime}</strong></span>
                      <span><Globe2 size={14} /><small>Architecture</small><strong>{template.architecture}</strong></span>
                      <span><Network size={14} /><small>Network</small><strong>{template.network}</strong></span>
                    </div>
                    <div className="tm-card-footer">
                      <button className="tm-card-primary" type="button" onClick={() => setSelectedTemplate(template)}>자세히 보기 <ArrowRight size={14} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="tm-empty-state">
              <Search size={24} />
              <strong>일치하는 템플릿이 없습니다.</strong>
              <p>검색어를 바꾸거나 전체 카테고리에서 다시 찾아보세요.</p>
              <button type="button" onClick={() => { setQuery(''); setActiveCategory('All'); }}>필터 초기화</button>
            </div>
          )}
        </section>

        <section className="tm-architecture-section" id="architecture" aria-labelledby="architecture-title">
          <div className="tm-architecture-copy">
            <span>DEPLOY FROM THE CLI</span>
            <h2 id="architecture-title">웹에서 고른 템플릿을,<br />CLI에서도 그대로.</h2>
            <p>
              Firecrab 템플릿은 웹뿐 아니라 CLI에서도 동일한 ID와 옵션으로 배포할 수 있습니다.
              반복 작업은 명령어로 연결하고 실행 결과는 터미널에서 바로 확인합니다.
            </p>
            <div className="tm-architecture-layers">
              <div><span>01</span><p><strong>Template</strong><small>웹과 CLI에서 동일한 템플릿 ID를 사용합니다.</small></p></div>
              <div><span>02</span><p><strong>Options</strong><small>네트워크 이름과 자원 값을 명령에서 지정합니다.</small></p></div>
              <div><span>03</span><p><strong>Result</strong><small>생성된 인스턴스, IP, 상태를 CLI에서 확인합니다.</small></p></div>
            </div>
          </div>

          <div className={`tm-terminal-card${terminalResetting ? ' is-resetting' : ''}`} ref={terminalRef} aria-label="Firecrab CLI deployment example">
            <div className="tm-terminal-head"><span><i /><i /><i /></span><strong>firecrab — deploy</strong><small>CLI</small></div>
            <pre aria-label={`${cliCommand}. Template resolves, manifest validates, root filesystem attaches, and the MicroVM becomes ready in 186 milliseconds.`}><code aria-hidden="true"><span className="tm-prompt">$</span>{' '}<span className="tm-typed-command">{typedCommand}</span><span className={`tm-terminal-cursor${terminalStage > 0 ? ' is-complete' : ''}`} />
{terminalStage >= 1 ? <span className="tm-terminal-line"><span className="tm-muted">→</span> resolving template <span className="tm-cyan">go-api@v2.4.0</span></span> : null}
{terminalStage >= 2 ? <span className="tm-terminal-line"><span className="tm-muted">→</span> validating signed manifest</span> : null}
{terminalStage >= 3 ? <span className="tm-terminal-line"><span className="tm-muted">→</span> attaching rootfs and tap device</span> : null}
{terminalStage >= 4 ? <span className="tm-terminal-line"><span className="tm-green">✓</span> microVM ready in <span className="tm-cyan">186ms</span></span> : null}
{terminalStage >= 5 ? <span className="tm-cli-result"><span className="tm-cli-result-complete"><span className="tm-green">✓</span> deployment complete</span><span className="tm-cli-result-line"><span>INSTANCE</span><strong>fc-go-api-07</strong></span><span className="tm-cli-result-line"><span>PRIVATE IP</span><strong>10.42.8.14</strong></span><span className="tm-cli-result-line"><span>STATE</span><strong className="tm-cli-state">running</strong></span></span> : null}</code></pre>
          </div>
        </section>

        <section className="tm-final-cta" aria-labelledby="final-cta-title">
          <span className="tm-final-mark"><img src="/firecrab-icon.png" alt="" /></span>
          <span className="tm-final-kicker">BUILD FIRECRAB TOGETHER</span>
          <h2 id="final-cta-title">함께 만드는 Firecrab,<br />새로운 기여자를 기다립니다.</h2>
          <p>아이디어, 코드, 문서, 피드백까지 어떤 형태의 기여도 환영합니다. 저장소에서 프로젝트를 살펴보고 함께 다음 버전을 만들어 주세요.</p>
          <div><a className="tm-final-primary" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={14} />기여하러 가기</a><a className="tm-final-secondary" href="/">메인 페이지 <ArrowRight size={15} /></a></div>
        </section>
      </main>

      {selectedTemplate ? (
        <div className="tm-modal-layer" role="presentation" onMouseDown={() => setSelectedTemplate(null)}>
          <section className="tm-template-modal" role="dialog" aria-modal="true" aria-labelledby="template-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="tm-modal-head">
              <span className="tm-template-icon is-large" style={{ '--glyph-color': `#${selectedTemplate.brandIcon.hex}` } as CSSProperties}><BrandIcon icon={selectedTemplate.brandIcon} /></span>
              <span><small>{selectedTemplate.eyebrow} · {selectedTemplate.version}</small><h2 id="template-modal-title">{selectedTemplate.name}</h2></span>
              <button type="button" aria-label="Close template details" onClick={() => setSelectedTemplate(null)}><X size={18} /></button>
            </div>
            <div className="tm-modal-body">
              <div className="tm-modal-main">
                <p>{selectedTemplate.description}</p>
                <div className="tm-modal-tags">{selectedTemplate.tags.map((tag) => <span key={tag}><Check size={11} />{tag}</span>)}</div>
                <h3>Minimum production configuration</h3>
                <dl className="tm-modal-specs">
                  <div><dt><Cpu size={14} />Compute</dt><dd>{selectedTemplate.cpu}</dd></div>
                  <div><dt><Server size={14} />Memory</dt><dd>{selectedTemplate.memory}</dd></div>
                  <div><dt><HardDrive size={14} />RootFS</dt><dd>{selectedTemplate.disk}</dd></div>
                  <div><dt><Network size={14} />Network</dt><dd>{selectedTemplate.network}</dd></div>
                  <div><dt><Package size={14} />Runtime</dt><dd>{selectedTemplate.runtime}</dd></div>
                  <div><dt><Globe2 size={14} />Architecture</dt><dd>{selectedTemplate.architecture}</dd></div>
                </dl>
                <div className="tm-modal-command"><code><span>$</span> firecrab template deploy {selectedTemplate.id} --network private-net</code><button type="button" onClick={() => copyCommand(selectedTemplate)}>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
              </div>
              <aside className="tm-modal-side">
                <span>RELEASE STATUS</span>
                <dl><div><dt>Usage</dt><dd>{selectedTemplate.deployments}</dd></div><div><dt>Release</dt><dd>{selectedTemplate.updated}</dd></div><div><dt>Verification</dt><dd><ShieldCheck size={13} />Signed</dd></div></dl>
              </aside>
            </div>
            <div className="tm-modal-actions"><button type="button" onClick={() => setSelectedTemplate(null)}>닫기</button><button type="button" onClick={() => { setSelectedTemplate(null); setToast(`${selectedTemplate.name} 배포 구성을 열었습니다`); }}>이 템플릿으로 시작 <ArrowRight size={14} /></button></div>
          </section>
        </div>
      ) : null}

      {toast ? <div className="tm-toast" role="status"><CheckCircle2 size={16} />{toast}</div> : null}
    </div>
  );
}
