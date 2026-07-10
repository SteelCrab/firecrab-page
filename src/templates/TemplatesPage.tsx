import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  ArrowRight,
  Box,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Command,
  Copy,
  Cpu,
  Database,
  GitBranch,
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
  Sparkles,
  TerminalSquare,
  Timer,
  Users,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import './TemplatesPage.css';

type Category = 'API' | 'Web' | 'Data' | 'Base';

type Template = {
  id: string;
  name: string;
  category: Category;
  version: string;
  eyebrow: string;
  description: string;
  icon: LucideIcon;
  tone: 'blue' | 'orange' | 'violet' | 'green' | 'cyan' | 'slate';
  owner: string;
  ownership: string;
  runtime: string;
  architecture: string;
  cpu: string;
  memory: string;
  disk: string;
  ready: string;
  deployments: string;
  updated: string;
  tags: string[];
  featured?: boolean;
};

type TeamMember = {
  initials: string;
  name: string;
  title: string;
  responsibility: string;
  tags: string[];
  tone: 'ink' | 'blue' | 'violet';
};

const templates: Template[] = [
  {
    id: 'go-api',
    name: 'Go API Service',
    category: 'API',
    version: 'v2.4.0',
    eyebrow: 'Firecrab official',
    description: 'Go 기반 HTTP API를 위한 최소 RootFS, 헬스 체크, 비공개 네트워크가 준비된 서비스 템플릿입니다.',
    icon: Braces,
    tone: 'blue',
    owner: 'Leader · 정현',
    ownership: 'Go API 공동 설계 · Backend implementation',
    runtime: 'Go runtime',
    architecture: 'amd64 / arm64',
    cpu: '2 vCPU',
    memory: '1 GiB',
    disk: '8 GiB',
    ready: '~14 sec',
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
    icon: Code2,
    tone: 'violet',
    owner: 'astronaut',
    ownership: 'Frontend Dashboard',
    runtime: 'Node runtime',
    architecture: 'amd64 / arm64',
    cpu: '2 vCPU',
    memory: '2 GiB',
    disk: '10 GiB',
    ready: '~18 sec',
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
    icon: Database,
    tone: 'cyan',
    owner: 'Firecrab Core',
    ownership: 'Data workload',
    runtime: 'PostgreSQL 16',
    architecture: 'amd64',
    cpu: '4 vCPU',
    memory: '8 GiB',
    disk: '80 GiB',
    ready: '~26 sec',
    deployments: '42 launches',
    updated: 'Updated 1 week ago',
    tags: ['Persistent volume', 'Daily backup', 'Private only'],
  },
  {
    id: 'ubuntu-minimal',
    name: 'Ubuntu Minimal',
    category: 'Base',
    version: '24.04.3',
    eyebrow: 'Base image',
    description: 'cloud-init과 Firecracker 커널 구성이 검증된 범용 최소 이미지입니다.',
    icon: Server,
    tone: 'slate',
    owner: 'Firecrab Core',
    ownership: 'Base image',
    runtime: 'Ubuntu 24.04 LTS',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    ready: '~9 sec',
    deployments: '316 launches',
    updated: 'Updated 3 days ago',
    tags: ['cloud-init', 'Minimal RootFS', 'Signed'],
  },
  {
    id: 'nginx-edge',
    name: 'Nginx Edge',
    category: 'Web',
    version: 'v2.2.4',
    eyebrow: 'Verified image',
    description: '정적 자산, 리버스 프록시, 엣지 TLS 종료에 맞춘 작은 웹 서버 템플릿입니다.',
    icon: Globe2,
    tone: 'green',
    owner: 'Firecrab Core',
    ownership: 'Edge runtime',
    runtime: 'Nginx stable',
    architecture: 'amd64 / arm64',
    cpu: '1 vCPU',
    memory: '512 MiB',
    disk: '4 GiB',
    ready: '~11 sec',
    deployments: '203 launches',
    updated: 'Updated 4 days ago',
    tags: ['Reverse proxy', 'TLS', 'Static assets'],
  },
];

const team: TeamMember[] = [
  {
    initials: 'LD',
    name: 'Leader',
    title: 'Maintainer',
    responsibility: '제품 방향, Go API 설계, Rust CLI와 릴리스를 책임집니다.',
    tags: ['Go API Design', 'Rust CLI', 'Releases'],
    tone: 'ink',
  },
  {
    initials: 'JH',
    name: '정현',
    title: 'Backend Developer',
    responsibility: 'Go API를 공동 설계하고 백엔드 구현과 계약을 다듬습니다.',
    tags: ['Go Backend', 'API Co-design', 'Contracts'],
    tone: 'blue',
  },
  {
    initials: 'AS',
    name: 'astronaut',
    title: 'Frontend Developer',
    responsibility: '템플릿 경험과 Firecrab 프론트엔드 대시보드를 구현합니다.',
    tags: ['Frontend Dashboard', 'Interaction', 'React'],
    tone: 'violet',
  },
];

const principles: Array<{ icon: LucideIcon; label: string; title: string; description: string }> = [
  {
    icon: Layers3,
    label: 'REPEATABLE',
    title: '한 번 정의하고, 같은 방식으로 실행',
    description: '커널, RootFS, 자원, 네트워크 정책을 하나의 버전으로 묶어 환경 차이를 줄입니다.',
  },
  {
    icon: LockKeyhole,
    label: 'ISOLATED',
    title: '컨테이너의 속도에 가까운 VM 격리',
    description: 'Firecracker의 작은 실행 단위로 독립 커널과 명확한 보안 경계를 제공합니다.',
  },
  {
    icon: Workflow,
    label: 'AUTOMATABLE',
    title: 'UI, Go API, Rust CLI가 같은 계약을 사용',
    description: '사람의 클릭과 자동화가 동일한 템플릿 스펙을 공유해 운영 흐름이 어긋나지 않습니다.',
  },
];

const categories: Array<'All' | Category> = ['All', 'API', 'Web', 'Data', 'Base'];
const repositoryUrl = 'https://github.com/SteelCrab/firecrab';

export default function TemplatesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | Category>('All');
  const [query, setQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

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

  const filteredTemplates = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return templates.filter((template) => {
      const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
      const matchesQuery =
        !normalized ||
        [template.name, template.description, template.runtime, template.owner, ...template.tags]
          .join(' ')
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const SelectedTemplateIcon = selectedTemplate?.icon;

  const copyCommand = async (template: Template) => {
    const command = `firecrab template deploy ${template.id} --region ap-northeast-2`;
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
          <a className="tm-brand" href="/templates" aria-label="Firecrab templates home">
            <span className="tm-brand-mark"><img src="/firecrab-icon.png" alt="" /></span>
            <span><strong>Firecrab</strong><small>Templates</small></span>
          </a>

          <nav className="tm-desktop-nav" aria-label="Templates page navigation">
            <a className="is-active" href="#catalog">Templates</a>
            <a href="#workflow">How it works</a>
            <a href="#architecture">Architecture</a>
            <a href="#team">Team</a>
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
            <a href="#team" onClick={() => setMobileMenuOpen(false)}>Team</a>
            <a href={repositoryUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub ↗</a>
          </nav>
        ) : null}
      </header>

      <main>
        <section className="tm-hero" aria-labelledby="templates-hero-title">
          <div className="tm-hero-copy">
            <div className="tm-eyebrow"><Sparkles size={14} />Firecracker-native workload templates</div>
            <h1 id="templates-hero-title">격리된 실행 환경을,<br /><span>템플릿 하나로.</span></h1>
            <p>
              Go API 서비스부터 데이터 워크로드까지. 검증된 이미지와 운영 정책을 하나로 묶어
              어디서든 같은 MicroVM을 시작하세요.
            </p>
            <div className="tm-hero-actions">
              <a className="tm-primary-cta" href="#catalog">템플릿 둘러보기 <ArrowRight size={16} /></a>
              <a className="tm-secondary-cta" href="#workflow"><Play size={15} fill="currentColor" />작동 방식 보기</a>
            </div>
            <div className="tm-hero-proof" aria-label="Firecrab template benefits">
              <span><Check size={13} />Versioned RootFS</span>
              <span><Check size={13} />Signed manifests</span>
              <span><Check size={13} />Closed-network ready</span>
            </div>
          </div>

          <div className="tm-product-stage" aria-label="Go API template product preview">
            <div className="tm-stage-glow" aria-hidden="true" />
            <div className="tm-product-window">
              <div className="tm-window-bar">
                <span className="tm-window-dots"><i /><i /><i /></span>
                <span className="tm-window-title"><Box size={13} />firecrab / templates</span>
                <span className="tm-registry-state"><i />Registry synced</span>
              </div>
              <div className="tm-window-body">
                <aside className="tm-template-rail">
                  <span className="tm-rail-label">Featured</span>
                  {templates.slice(0, 3).map((template, index) => {
                    const TemplateIcon = template.icon;
                    return (
                      <button className={index === 0 ? 'is-selected' : ''} type="button" onClick={() => setSelectedTemplate(template)} key={template.id}>
                        <span className={`tm-template-icon is-small ${template.tone}`}><TemplateIcon size={14} /></span>
                        <span><strong>{template.name}</strong><small>{template.version}</small></span>
                        {index === 0 ? <CheckCircle2 size={13} /> : null}
                      </button>
                    );
                  })}
                  <span className="tm-rail-count">+ 9 private templates</span>
                </aside>

                <div className="tm-template-spec">
                  <div className="tm-spec-head">
                    <span className="tm-template-icon is-large blue"><Braces size={20} /></span>
                    <span><small>OFFICIAL TEMPLATE</small><strong>Go API Service</strong></span>
                    <span className="tm-verified"><ShieldCheck size={13} />Verified</span>
                  </div>
                  <p>Production-ready Go service with health checks, private networking, and a minimal RootFS.</p>
                  <div className="tm-spec-grid">
                    <div><Cpu size={14} /><span><small>Compute</small><strong>2 vCPU</strong></span></div>
                    <div><HardDrive size={14} /><span><small>Memory</small><strong>1 GiB</strong></span></div>
                    <div><Network size={14} /><span><small>Network</small><strong>Private</strong></span></div>
                    <div><Globe2 size={14} /><span><small>Arch</small><strong>Multi-arch</strong></span></div>
                  </div>
                  <div className="tm-launch-flow">
                    <div className="is-done"><span><Check size={11} /></span><strong>Manifest</strong><small>Validated</small></div>
                    <i />
                    <div className="is-done"><span><Check size={11} /></span><strong>RootFS</strong><small>Mounted</small></div>
                    <i />
                    <div className="is-live"><span><Zap size={11} /></span><strong>MicroVM</strong><small>Ready</small></div>
                  </div>
                  <button className="tm-window-action" type="button" onClick={() => setSelectedTemplate(templates[0])}>Open template <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
            <div className="tm-stage-note tm-stage-note-top"><Timer size={14} /><span><strong>186 ms</strong><small>MicroVM boot</small></span></div>
            <div className="tm-stage-note tm-stage-note-bottom"><GitBranch size={14} /><span><strong>v2.4.0</strong><small>signed release</small></span></div>
          </div>
        </section>

        <section className="tm-technology-strip" aria-label="Firecrab technology overview">
          <span>Built for modern private cloud</span>
          <div><strong>Firecracker</strong><i /></div>
          <div><strong>Go Control API</strong><i /></div>
          <div><strong>Rust CLI</strong><i /></div>
          <div><strong>React Interface</strong></div>
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
              <input id="template-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="이름, 런타임, 소유자 검색" />
              <kbd>/</kbd>
            </label>
          </div>

          {filteredTemplates.length ? (
            <div className="tm-template-grid">
              {filteredTemplates.map((template) => {
                const TemplateIcon = template.icon;
                return (
                  <article className={`tm-template-card${template.featured ? ' is-featured' : ''}`} style={{ '--template-accent': `var(--tm-${template.tone})` } as CSSProperties} key={template.id}>
                    <div className="tm-card-topline"><span>{template.eyebrow}</span><span>{template.version}</span></div>
                    <div className="tm-card-heading">
                      <span className={`tm-template-icon is-large ${template.tone}`}><TemplateIcon size={20} /></span>
                      <span><small>{template.category}</small><h3>{template.name}</h3></span>
                    </div>
                    <p>{template.description}</p>
                    <div className="tm-card-facts">
                      <span><Package size={14} /><small>Runtime</small><strong>{template.runtime}</strong></span>
                      <span><Globe2 size={14} /><small>Architecture</small><strong>{template.architecture}</strong></span>
                      <span><Timer size={14} /><small>Ready</small><strong>{template.ready}</strong></span>
                    </div>
                    <div className="tm-card-footer">
                      <span><span className="tm-owner-avatar">{template.owner === 'Leader · 정현' ? 'LJ' : template.owner === 'astronaut' ? 'AS' : 'FC'}</span><small>Maintained by</small><strong>{template.owner}</strong></span>
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
            <span>ONE CONTRACT, THREE SURFACES</span>
            <h2 id="architecture-title">사람과 자동화가<br />같은 언어로 실행합니다.</h2>
            <p>
              React 인터페이스, Go Control API, Rust CLI가 하나의 템플릿 명세를 공유합니다.
              클릭으로 시작해도, 파이프라인에서 호출해도 같은 MicroVM이 만들어집니다.
            </p>
            <div className="tm-architecture-layers">
              <div><span><Braces size={16} /></span><p><strong>Go Control API</strong><small>Leader + 정현 · 공동 설계와 백엔드 구현</small></p></div>
              <div><span><TerminalSquare size={16} /></span><p><strong>Rust CLI</strong><small>Leader · 자동화와 운영 도구</small></p></div>
              <div><span><Code2 size={16} /></span><p><strong>React Interface</strong><small>astronaut · 템플릿 경험과 프론트엔드</small></p></div>
            </div>
          </div>

          <div className="tm-terminal-card" aria-label="Firecrab CLI deployment example">
            <div className="tm-terminal-head"><span><i /><i /><i /></span><strong>firecrab — deploy</strong><small>Rust CLI</small></div>
            <pre><code><span className="tm-prompt">$</span> firecrab template deploy go-api \
  --region ap-northeast-2 \
  --memory 1024 \
  --network private

<span className="tm-muted">→</span> resolving template <span className="tm-cyan">go-api@v2.4.0</span>
<span className="tm-muted">→</span> validating signed manifest
<span className="tm-muted">→</span> attaching rootfs and tap device
<span className="tm-green">✓</span> microVM ready in <span className="tm-cyan">186ms</span></code></pre>
            <div className="tm-terminal-result">
              <div><span>INSTANCE</span><strong>fc-go-api-07</strong></div>
              <div><span>PRIVATE IP</span><strong>10.42.8.14</strong></div>
              <div><span>STATE</span><strong><i />running</strong></div>
            </div>
          </div>
        </section>

        <section className="tm-team-section" id="team" aria-labelledby="team-title">
          <div className="tm-team-intro">
            <span>SMALL TEAM, CLEAR OWNERSHIP</span>
            <h2 id="team-title">세 명이 만들고,<br />책임은 선명하게.</h2>
            <p>Firecrab은 작은 팀의 빠른 의사결정과 명확한 기술 소유권을 제품 구조에 그대로 반영합니다.</p>
            <div className="tm-team-total"><Users size={17} /><span><strong>3 core contributors</strong><small>Product, Go backend, Rust CLI, Frontend</small></span></div>
          </div>
          <div className="tm-team-list">
            {team.map((member, index) => (
              <article key={member.name}>
                <span className="tm-team-index">0{index + 1}</span>
                <span className={`tm-team-avatar ${member.tone}`}>{member.initials}</span>
                <span className="tm-team-name"><small>{member.title}</small><strong>{member.name}</strong></span>
                <p>{member.responsibility}</p>
                <div>{member.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="tm-final-cta" aria-labelledby="final-cta-title">
          <span className="tm-final-mark"><img src="/firecrab-icon.png" alt="" /></span>
          <span className="tm-final-kicker">FIRECRAB TEMPLATES</span>
          <h2 id="final-cta-title">매번 새로 만들지 말고,<br />좋은 시작점을 공유하세요.</h2>
          <p>검증된 템플릿에서 첫 MicroVM을 시작하고, 팀의 실행 방식을 하나의 버전으로 관리하세요.</p>
          <div><a className="tm-final-primary" href="#catalog">템플릿 선택하기 <ArrowRight size={15} /></a><a className="tm-final-secondary" href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={14} />GitHub에서 보기</a></div>
        </section>
      </main>

      <footer className="tm-footer">
        <div>
          <a className="tm-brand" href="/templates"><span className="tm-brand-mark"><img src="/firecrab-icon.png" alt="" /></span><span><strong>Firecrab</strong><small>MicroVM Templates</small></span></a>
          <p>Firecracker 기반 MicroVM을 템플릿으로 정의하고, Go API와 Rust CLI로 실행합니다.</p>
        </div>
        <nav aria-label="Footer navigation"><a href="#catalog">Templates</a><a href="#workflow">Workflow</a><a href="#architecture">Architecture</a><a href="#team">Team</a><a href={repositoryUrl} target="_blank" rel="noreferrer"><Github size={13} />GitHub</a></nav>
        <span>© 2026 Firecrab Core</span>
      </footer>

      {selectedTemplate ? (
        <div className="tm-modal-layer" role="presentation" onMouseDown={() => setSelectedTemplate(null)}>
          <section className="tm-template-modal" role="dialog" aria-modal="true" aria-labelledby="template-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="tm-modal-head">
              <span className={`tm-template-icon is-large ${selectedTemplate.tone}`}>{SelectedTemplateIcon ? <SelectedTemplateIcon size={20} /> : null}</span>
              <span><small>{selectedTemplate.eyebrow} · {selectedTemplate.version}</small><h2 id="template-modal-title">{selectedTemplate.name}</h2></span>
              <button type="button" aria-label="Close template details" onClick={() => setSelectedTemplate(null)}><X size={18} /></button>
            </div>
            <div className="tm-modal-body">
              <div className="tm-modal-main">
                <p>{selectedTemplate.description}</p>
                <div className="tm-modal-tags">{selectedTemplate.tags.map((tag) => <span key={tag}><Check size={11} />{tag}</span>)}</div>
                <h3>Default configuration</h3>
                <dl className="tm-modal-specs">
                  <div><dt><Cpu size={14} />Compute</dt><dd>{selectedTemplate.cpu}</dd></div>
                  <div><dt><Server size={14} />Memory</dt><dd>{selectedTemplate.memory}</dd></div>
                  <div><dt><HardDrive size={14} />RootFS</dt><dd>{selectedTemplate.disk}</dd></div>
                  <div><dt><Timer size={14} />Ready</dt><dd>{selectedTemplate.ready}</dd></div>
                  <div><dt><Package size={14} />Runtime</dt><dd>{selectedTemplate.runtime}</dd></div>
                  <div><dt><Globe2 size={14} />Architecture</dt><dd>{selectedTemplate.architecture}</dd></div>
                </dl>
                <div className="tm-modal-command"><code><span>$</span> firecrab template deploy {selectedTemplate.id} --region ap-northeast-2</code><button type="button" onClick={() => copyCommand(selectedTemplate)}>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
              </div>
              <aside className="tm-modal-side">
                <span>OWNERSHIP</span>
                <div className="tm-modal-owner"><span className="tm-owner-avatar">{selectedTemplate.owner === 'Leader · 정현' ? 'LJ' : selectedTemplate.owner === 'astronaut' ? 'AS' : selectedTemplate.owner === 'Leader' ? 'LD' : 'FC'}</span><p><strong>{selectedTemplate.owner}</strong><small>{selectedTemplate.ownership}</small></p></div>
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
