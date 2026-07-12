import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Check, Copy, Settings, X } from 'lucide-react';
import {
  siDebian,
  siGithub,
  siGitlab,
  siMysql,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPython,
  siRedis,
  siSpringboot,
  siUbuntu,
  type SimpleIcon,
} from 'simple-icons';
import './LandingPage.css';

type VmSpec = {
  label: string;
  vcpu: number;
  memory: string;
};

type StackItem = {
  slug: string;
  name: string;
  category: 'Base' | 'API' | 'Web' | 'Data';
  categoryColor: string;
  iconBackground: string;
  brandColor: string;
  icon: SimpleIcon;
  description: string;
  features: string[];
  versions: string[];
  specs: VmSpec[];
};

type RepositoryCard = {
  name: string;
  host: string;
  branch: string;
  icon: SimpleIcon;
  color: string;
};

const repositoryUrl = 'https://github.com/SteelCrab/firecrab-page';
const accent = '#c74724';

const osSpecs: VmSpec[] = [
  { label: 'Small', vcpu: 1, memory: '512MB' },
  { label: 'Medium', vcpu: 2, memory: '1024MB' },
  { label: 'Large', vcpu: 4, memory: '2048MB' },
];

const runtimeSpecs: VmSpec[] = [
  { label: 'Small', vcpu: 1, memory: '1024MB' },
  { label: 'Medium', vcpu: 2, memory: '2048MB' },
  { label: 'Large', vcpu: 4, memory: '4096MB' },
];

const stackItems: StackItem[] = [
  {
    slug: 'ubuntu',
    name: 'Ubuntu',
    category: 'Base',
    categoryColor: '#c2410c',
    iconBackground: '#fff0e6',
    brandColor: '#e95420',
    icon: siUbuntu,
    description: 'cloud-init이 검증된 범용 최소 이미지.',
    features: ['cloud-init 기본 지원', '자동 보안 업데이트', 'systemd 기반 부팅'],
    versions: ['24.04', '22.04', '20.04'],
    specs: osSpecs,
  },
  {
    slug: 'debian',
    name: 'Debian',
    category: 'Base',
    categoryColor: '#c2410c',
    iconBackground: '#fff0e6',
    brandColor: '#a81d33',
    icon: siDebian,
    description: '안정성 중심의 경량 베이스 이미지.',
    features: ['최소 RootFS', '장기 지원(LTS)', 'APT 패키지 관리'],
    versions: ['12', '11'],
    specs: osSpecs,
  },
  {
    slug: 'python',
    name: 'Python',
    category: 'API',
    categoryColor: '#315fc5',
    iconBackground: '#eaf0fe',
    brandColor: '#3776ab',
    icon: siPython,
    description: '웹 서비스와 배치 작업용 런타임.',
    features: ['pip / venv 사전 구성', 'gunicorn 기본 포함', '헬스체크 엔드포인트'],
    versions: ['3.12', '3.11', '3.10'],
    specs: runtimeSpecs,
  },
  {
    slug: 'node',
    name: 'Node.js',
    category: 'API',
    categoryColor: '#315fc5',
    iconBackground: '#eaf0fe',
    brandColor: '#339933',
    icon: siNodedotjs,
    description: '빠른 API 서버 구동을 위한 런타임.',
    features: ['npm / pnpm 사전 설치', 'PM2 프로세스 매니저', '헬스체크 엔드포인트'],
    versions: ['20', '18'],
    specs: runtimeSpecs,
  },
  {
    slug: 'nginx',
    name: 'Nginx',
    category: 'Web',
    categoryColor: '#087ea4',
    iconBackground: '#e6f7fd',
    brandColor: '#009639',
    icon: siNginx,
    description: '정적 자산과 리버스 프록시용 웹 서버.',
    features: ['리버스 프록시 사전 구성', 'TLS 종료 지원', 'gzip / brotli 압축'],
    versions: ['1.25', '1.24'],
    specs: osSpecs,
  },
  {
    slug: 'redis',
    name: 'Redis',
    category: 'Data',
    categoryColor: '#7340c8',
    iconBackground: '#f1ebfe',
    brandColor: '#dc382d',
    icon: siRedis,
    description: '캐시와 큐잉을 위한 인메모리 스토어.',
    features: ['영구 볼륨 옵션', 'AOF / RDB 백업', '내부 전용 엔드포인트'],
    versions: ['7.2', '6.2'],
    specs: runtimeSpecs,
  },
  {
    slug: 'mysql',
    name: 'MySQL',
    category: 'Data',
    categoryColor: '#7340c8',
    iconBackground: '#f1ebfe',
    brandColor: '#4479a1',
    icon: siMysql,
    description: '영구 볼륨과 백업이 포함된 관계형 DB.',
    features: ['영구 볼륨 기본 구성', '자동 일일 백업', '내부 전용 엔드포인트'],
    versions: ['8.0', '5.7'],
    specs: runtimeSpecs,
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    category: 'Data',
    categoryColor: '#7340c8',
    iconBackground: '#f1ebfe',
    brandColor: '#336791',
    icon: siPostgresql,
    description: '내부 전용 엔드포인트를 갖춘 데이터베이스.',
    features: ['영구 볼륨 기본 구성', '자동 일일 백업', 'pgvector 확장 지원'],
    versions: ['16', '15', '14'],
    specs: runtimeSpecs,
  },
  {
    slug: 'spring-boot',
    name: 'Spring',
    category: 'API',
    categoryColor: '#315fc5',
    iconBackground: '#eaf0fe',
    brandColor: '#6db33f',
    icon: siSpringboot,
    description: '헬스체크가 기본 구성된 Java API 템플릿.',
    features: ['JRE 사전 설치', 'Actuator 헬스체크', '자동 재시작 정책'],
    versions: ['3.2', '2.7'],
    specs: runtimeSpecs,
  },
];

const featureItems = [
  {
    icon: '⚡',
    background: '#fff3de',
    title: '번개처럼 빠른 부팅',
    description: 'Firecracker 기반으로 125ms 안에 완전한 VM이 부팅됩니다.',
  },
  {
    icon: '🔒',
    background: '#eaf2ea',
    title: '완전한 격리',
    description: '커널 수준 하드웨어 가상화로 컨테이너보다 강력한 보안 경계를 제공합니다.',
  },
  {
    icon: '🧩',
    background: '#edeef7',
    title: '오픈소스 · 셀프호스팅',
    description: '벤더 종속 없이 직접 인프라에 배포하고, 소스코드까지 전부 확인하세요.',
  },
  {
    icon: '🛠️',
    background: '#fbeae4',
    title: '익숙한 개발 경험',
    description: 'CLI, API, 웹 대시보드까지 — 기존 워크플로우를 그대로 사용합니다.',
  },
];

const comparisonRows = [
  ['부팅 시간', '< 125ms', '수십 초', '~1초'],
  ['격리 수준', '하드웨어 가상화', '하드웨어 가상화', '커널 네임스페이스 공유'],
  ['리소스 오버헤드', '매우 낮음', '높음', '낮음'],
  ['셀프호스팅', '✓ 완전 지원', '벤더별 상이', '✓ 지원'],
  ['소스 공개', '✓ GitHub', '벤더별 상이', '✓ 대부분'],
];

const bootChart = [
  { label: 'FireCrab', value: '125ms', width: 8, color: accent, labelColor: '#8a5a16' },
  { label: '컨테이너', value: '~1초', width: 43, color: '#9aa1ac', labelColor: '#4a4038' },
  { label: '전통 VM', value: '~30초', width: 100, color: '#9aa1ac', labelColor: '#4a4038' },
];

const repositoryCards: RepositoryCard[] = [
  { name: 'web-frontend', host: 'GitHub', branch: 'main', icon: siGithub, color: '#24292f' },
  { name: 'api-server', host: 'GitHub', branch: 'main', icon: siGithub, color: '#24292f' },
  { name: 'data-worker', host: 'GitLab', branch: 'main', icon: siGitlab, color: '#fc6d26' },
];

const deployedVms = [
  { name: 'web-01', image: 'web-frontend:latest', spec: '1 vCPU · 512MB' },
  { name: 'api-01', image: 'api-server:latest', spec: '2 vCPU · 1GB' },
  { name: 'worker-01', image: 'data-worker:latest', spec: '1 vCPU · 512MB' },
];

const firstCommand = 'firecrab up --image ubuntu-22.04';
const secondCommand = 'firecrab ssh web-01';
const firstTypingEnd = firstCommand.length * 35;
const firstOutputAt = firstTypingEnd + 250;
const secondTypingStart = firstOutputAt + 900;
const secondTypingEnd = secondTypingStart + secondCommand.length * 35;
const secondOutputAt = secondTypingEnd + 250;
const footerAt = secondOutputAt + 300;
const terminalCycle = footerAt + 2200;

function useTerminalDemo() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      setElapsed(footerAt);
      return undefined;
    }

    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setElapsed((performance.now() - startedAt) % terminalCycle);
    }, 90);

    return () => window.clearInterval(interval);
  }, []);

  const firstLength = Math.min(firstCommand.length, Math.floor(elapsed / 35));
  const isTypingFirst = elapsed < firstTypingEnd;
  const isTypingSecond = elapsed >= secondTypingStart && elapsed < secondTypingEnd;
  const secondLength = isTypingSecond
    ? Math.min(secondCommand.length, Math.floor((elapsed - secondTypingStart) / 35))
    : elapsed >= secondTypingStart
      ? secondCommand.length
      : 0;
  const cursorVisible = Math.floor(elapsed / 450) % 2 === 0;

  return {
    firstText: firstCommand.slice(0, firstLength),
    firstCursorVisible: isTypingFirst && cursorVisible,
    showFirstOutput: elapsed >= firstOutputAt,
    showSecondCommand: elapsed >= secondTypingStart,
    secondText: secondCommand.slice(0, secondLength),
    secondCursorVisible: isTypingSecond && cursorVisible,
    showSecondOutput: elapsed >= secondOutputAt,
    showFooter: elapsed >= footerAt,
  };
}

function BrandIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}

function HeroTerminal() {
  const terminal = useTerminalDemo();

  return (
    <div
      className="fc-terminal"
      role="img"
      aria-label="FireCrab CLI로 Ubuntu MicroVM을 생성하고 접속하는 예시"
    >
      <div className="fc-terminal-dots" aria-hidden="true"><span /><span /><span /></div>
      <div className="fc-terminal-body" aria-hidden="true">
        <div><span className="fc-terminal-prompt">$</span> {terminal.firstText}<i className={terminal.firstCursorVisible ? 'is-visible' : ''}>▋</i></div>
        {terminal.showFirstOutput ? (
          <div className="fc-terminal-output">
            <span>✓ 마이크로VM 프로비저닝 완료 (118ms)</span>
            <span>✓ 네트워크 네임스페이스 연결됨</span>
            <span>✓ vcpu=2 mem=2048MB 할당 완료</span>
          </div>
        ) : null}
        {terminal.showSecondCommand ? (
          <div className="fc-terminal-command"><span className="fc-terminal-prompt">$</span> {terminal.secondText}<i className={terminal.secondCursorVisible ? 'is-visible' : ''}>▋</i></div>
        ) : null}
        {terminal.showSecondOutput ? <div className="fc-terminal-shell">→ root@web-01:~# _</div> : null}
        {terminal.showFooter ? (
          <div className="fc-terminal-footer">instance: web-01 · region: local · status: <strong>running</strong></div>
        ) : null}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<StackItem | null>(null);
  const [versionIndex, setVersionIndex] = useState(0);
  const [specIndex, setSpecIndex] = useState(1);
  const [copyLabel, setCopyLabel] = useState('복사');
  const [chartVisible, setChartVisible] = useState(false);
  const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      setChartVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setChartVisible(true);
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(chart);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return undefined;

    const measure = () => {
      if (window.matchMedia('(max-width: 900px)').matches) {
        setConnectorPaths([]);
        return;
      }

      const diagramRect = diagram.getBoundingClientRect();
      const buildNode = diagram.querySelector<HTMLElement>('[data-fc-node="build"]');
      const deployPanel = diagram.querySelector<HTMLElement>('[data-fc-node="panel"]');
      const repositories = diagram.querySelectorAll<HTMLElement>('[data-fc-node="repo"]');
      if (!buildNode || !deployPanel || !repositories.length) return;

      const buildRect = buildNode.getBoundingClientRect();
      const panelRect = deployPanel.getBoundingClientRect();
      const buildY = buildRect.top + buildRect.height / 2 - diagramRect.top;
      const nextPaths: string[] = [];

      repositories.forEach((repository) => {
        const repositoryRect = repository.getBoundingClientRect();
        const x1 = repositoryRect.right - diagramRect.left;
        const y1 = repositoryRect.top + repositoryRect.height / 2 - diagramRect.top;
        const x2 = buildRect.left - diagramRect.left - 3;
        const middleX = (x1 + x2) / 2;
        nextPaths.push(`M${x1},${y1} C${middleX},${y1} ${middleX},${buildY} ${x2},${buildY}`);
      });

      const x1 = buildRect.right - diagramRect.left + 3;
      const x2 = panelRect.left - diagramRect.left - 3;
      const panelY = panelRect.top + panelRect.height / 2 - diagramRect.top;
      const middleX = (x1 + x2) / 2;
      nextPaths.push(`M${x1},${buildY} C${middleX},${buildY} ${middleX},${panelY} ${x2},${panelY}`);

      setConnectorPaths((current) =>
        current.join('|') === nextPaths.join('|') ? current : nextPaths,
      );
    };

    const frame = window.requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    resizeObserver?.observe(diagram);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', measure);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedTemplate) return undefined;

    const dialog = modalRef.current;
    if (!dialog) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      lastTriggerRef.current?.focus();
    };
  }, [selectedTemplate]);

  const openTemplate = (template: StackItem, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setSelectedTemplate(template);
    setVersionIndex(0);
    setSpecIndex(Math.min(1, template.specs.length - 1));
    setCopyLabel('복사');
  };

  const closeTemplate = () => setSelectedTemplate(null);

  const copyCommand = async () => {
    if (!selectedTemplate) return;
    const version = selectedTemplate.versions[versionIndex];
    const spec = selectedTemplate.specs[specIndex];
    const command = `firecrab up --image ${selectedTemplate.slug}-${version} --vcpu ${spec.vcpu} --mem ${spec.memory}`;

    let copied = false;
    try {
      await navigator.clipboard.writeText(command);
      copied = true;
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = command;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.appendChild(fallback);
      fallback.select();
      copied = document.execCommand('copy');
      fallback.remove();
    }

    setCopyLabel(copied ? '복사됨 ✓' : '복사 실패');

    window.setTimeout(() => setCopyLabel('복사'), 1600);
  };

  const selectedVersion = selectedTemplate?.versions[versionIndex];
  const selectedSpec = selectedTemplate?.specs[specIndex];
  const selectedCommand = selectedTemplate && selectedVersion && selectedSpec
    ? `firecrab up --image ${selectedTemplate.slug}-${selectedVersion} --vcpu ${selectedSpec.vcpu} --mem ${selectedSpec.memory}`
    : '';

  return (
    <div className="fc-landing">
      <header className="fc-header">
        <div className="fc-nav-wrap">
          <a className="fc-brand" href="#top" aria-label="FireCrab 홈">
            <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
            <span>FireCrab</span>
          </a>
          <nav className="fc-nav-links" aria-label="주요 섹션">
            <a href="#features">기능</a>
            <a href="#stack">호환성</a>
            <a href="#compare">비교</a>
            <a href="#stack">템플릿</a>
          </nav>
          <div className="fc-nav-actions">
            <a className="fc-nav-github" href={repositoryUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="fc-nav-cta" href={repositoryUrl} target="_blank" rel="noreferrer">
              셀프호스팅 시작
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="fc-hero" id="top" aria-labelledby="fc-hero-title">
          <div className="fc-hero-copy">
            <p className="fc-eyebrow">Open Source MicroVM Platform</p>
            <h1 id="fc-hero-title">컨테이너의 속도로<br />진짜 VM을 띄우세요</h1>
            <p className="fc-hero-description">
              FireCrab은 Firecracker 마이크로VM 기술을 기반으로 한 오픈소스 플랫폼입니다.
              125ms 안에 부팅되는 완전히 격리된 VM을, 여러분의 인프라에 직접 셀프호스팅하세요.
            </p>
            <div className="fc-hero-actions">
              <a className="fc-primary-action" href={repositoryUrl} target="_blank" rel="noreferrer">
                GitHub에서 시작하기 <span aria-hidden="true">→</span>
              </a>
              <a className="fc-secondary-action" href="#stack">템플릿 살펴보기</a>
            </div>
            <dl className="fc-hero-stats" aria-label="FireCrab 주요 수치">
              <div><dt>&lt;125ms</dt><dd>평균 부팅 시간</dd></div>
              <div><dt>GitHub</dt><dd>소스 공개</dd></div>
              <div><dt>100%</dt><dd>셀프호스팅 가능</dd></div>
            </dl>
          </div>

          <HeroTerminal />
        </section>

        <section className="fc-stack-section" id="stack" aria-labelledby="fc-stack-title">
          <div className="fc-section-inner">
            <div className="fc-section-heading">
              <span>Compatibility</span>
              <h2 id="fc-stack-title">쓰던 스택 그대로, 템플릿으로 바로 실행</h2>
              <p>클릭하면 스펙과 복사 가능한 CLI 명령어를 확인할 수 있습니다.</p>
            </div>
            <div className="fc-stack-grid">
              {stackItems.map((item) => (
                <button
                  className="fc-stack-card"
                  type="button"
                  onClick={(event) => openTemplate(item, event.currentTarget)}
                  key={item.slug}
                >
                  <span className="fc-stack-icon" style={{ background: item.iconBackground, color: item.brandColor }}>
                    <BrandIcon icon={item.icon} />
                  </span>
                  <span className="fc-stack-category" style={{ color: item.categoryColor }}>{item.category}</span>
                  <strong>{item.name}</strong>
                  <span className="fc-stack-description">{item.description}</span>
                  <span className="fc-stack-link">스펙 · CLI 보기 <span aria-hidden="true">→</span></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="fc-features" id="features" aria-labelledby="fc-features-title">
          <div className="fc-section-heading">
            <span>Core Values</span>
            <h2 id="fc-features-title">개발자를 위해 설계했습니다</h2>
            <p>가볍고, 안전하고, 여러분이 완전히 소유할 수 있는 인프라.</p>
          </div>
          <div className="fc-feature-grid">
            {featureItems.map((feature) => (
              <article className="fc-feature-card" key={feature.title}>
                <span className="fc-feature-icon" style={{ background: feature.background }} aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fc-comparison-section" id="compare" aria-labelledby="fc-compare-title">
          <div className="fc-section-inner">
            <div className="fc-section-heading">
              <span>Comparison</span>
              <h2 id="fc-compare-title">기존 VM·컨테이너와 무엇이 다를까요</h2>
            </div>

            <div className="fc-comparison-scroll">
              <table className="fc-comparison-table">
                <thead>
                  <tr><th scope="col">구분</th><th scope="col">FireCrab</th><th scope="col">Traditional VM</th><th scope="col">Container</th></tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([label, firecrab, vm, container]) => (
                    <tr key={label}><th scope="row">{label}</th><td>{firecrab}</td><td>{vm}</td><td>{container}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="fc-chart" ref={chartRef}>
              <h3>부팅 시간 비교 (로그 스케일)</h3>
              <div className="fc-chart-rows" role="img" aria-label="FireCrab 125밀리초, 컨테이너 약 1초, 전통 VM 약 30초의 부팅 시간 비교">
                {bootChart.map((item, index) => (
                  <div className="fc-chart-row" key={item.label}>
                    <strong style={{ color: item.labelColor }}>{item.label}</strong>
                    <span className="fc-chart-track"><i style={{ width: chartVisible ? `${item.width}%` : 0, background: item.color, transitionDelay: `${index * 150}ms` }} /></span>
                    <b>{item.value}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="fc-deploy-section" id="deploy" aria-labelledby="fc-deploy-title">
          <div className="fc-section-heading">
            <span>Deploy from Git</span>
            <h2 id="fc-deploy-title">여러 저장소를 빌드해서, FireCrab 한 곳에서 배포</h2>
            <p>GitHub · GitLab 저장소들을 연결하면 자동으로 빌드되어 각각의 마이크로VM으로 배포됩니다.</p>
          </div>

          <div className="fc-deploy-diagram" ref={diagramRef}>
            <svg className="fc-connectors" aria-hidden="true">
              {connectorPaths.map((path, index) => (
                <g key={path}>
                  <path className="fc-connector-base" d={path} />
                  <path className="fc-connector-flow" d={path} style={{ animationDelay: `${index * 0.3}s` }} />
                </g>
              ))}
            </svg>

            <div className="fc-repository-list">
              {repositoryCards.map((repository) => (
                <article className="fc-repository-card" data-fc-node="repo" key={repository.name}>
                  <span style={{ color: repository.color }}><BrandIcon icon={repository.icon} /></span>
                  <div><strong>{repository.name}</strong><small>{repository.host} · {repository.branch}</small></div>
                </article>
              ))}
            </div>

            <span className="fc-vertical-connector" aria-hidden="true" />

            <div className="fc-build-node">
              <span className="fc-build-icon" data-fc-node="build" aria-hidden="true"><Settings size={30} /></span>
              <strong>자동 빌드</strong>
              <small>Dockerfile · Buildpack<br />RootFS 이미지 생성</small>
            </div>

            <span className="fc-vertical-connector" aria-hidden="true" />

            <article className="fc-deploy-panel" data-fc-node="panel">
              <header>
                <img src="/firecrab-icon.png" alt="" aria-hidden="true" />
                <div><strong>FireCrab</strong><small>마이크로VM 배포</small></div>
              </header>
              <div className="fc-deployed-vms">
                {deployedVms.map((vm) => (
                  <div className="fc-vm-card" key={vm.name}>
                    <div><span aria-hidden="true"><i /></span><strong>{vm.name}</strong><em>● running</em></div>
                    <p><span>{vm.image}</span><span>{vm.spec}</span></p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="fc-final-cta" aria-labelledby="fc-final-title">
          <h2 id="fc-final-title">지금 바로 셀프호스팅을 시작하세요</h2>
          <p>별도 벤더 계약 없이, 여러분의 서버에서 5분 안에 실행할 수 있습니다.</p>
          <div>
            <a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub에서 시작하기 <span aria-hidden="true">→</span></a>
            <code>git clone https://github.com/SteelCrab/firecrab-page.git</code>
          </div>
        </section>
      </main>

      <footer className="fc-footer">
        <div className="fc-footer-grid">
          <div className="fc-footer-brand">
            <div><img src="/firecrab-icon.png" alt="" aria-hidden="true" /><strong>FireCrab</strong></div>
            <p>개발자를 위한 오픈소스 마이크로VM 셀프호스팅 플랫폼.</p>
          </div>
          <nav aria-label="제품 링크"><strong>제품</strong><a href="#features">기능</a><a href="#stack">템플릿</a><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a></nav>
          <nav aria-label="리소스 링크"><strong>리소스</strong><a href={`${repositoryUrl}#readme`} target="_blank" rel="noreferrer">문서</a><a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">커뮤니티</a></nav>
        </div>
        <div className="fc-footer-bottom">© 2026 FireCrab.</div>
      </footer>

      {selectedTemplate ? (
        <dialog
          className="fc-template-dialog"
          ref={modalRef}
          aria-labelledby="fc-modal-title"
          onCancel={(event) => { event.preventDefault(); closeTemplate(); }}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            closeTemplate();
          }}
          onMouseDown={(event: MouseEvent<HTMLDialogElement>) => {
            if (event.target === event.currentTarget) closeTemplate();
          }}
        >
          <div className="fc-dialog-content">
            <header>
              <span style={{ background: selectedTemplate.iconBackground, color: selectedTemplate.brandColor }}><BrandIcon icon={selectedTemplate.icon} /></span>
              <div><small style={{ color: selectedTemplate.categoryColor }}>{selectedTemplate.category}</small><h2 id="fc-modal-title">{selectedTemplate.name} 템플릿</h2></div>
              <button ref={closeButtonRef} type="button" aria-label="템플릿 상세 닫기" onClick={closeTemplate}><X size={19} /></button>
            </header>
            <p className="fc-dialog-description">{selectedTemplate.description}</p>

            <section aria-labelledby="fc-modal-features"><h3 id="fc-modal-features">주요 특징</h3><ul>{selectedTemplate.features.map((feature) => <li key={feature}><i style={{ background: selectedTemplate.brandColor }} /><span>{feature}</span></li>)}</ul></section>

            <section aria-labelledby="fc-modal-version"><h3 id="fc-modal-version">버전</h3><div className="fc-option-list">{selectedTemplate.versions.map((version, index) => <button type="button" className={versionIndex === index ? 'is-active' : ''} style={versionIndex === index ? { borderColor: selectedTemplate.brandColor, background: selectedTemplate.iconBackground, color: selectedTemplate.brandColor } : undefined} aria-pressed={versionIndex === index} onClick={() => setVersionIndex(index)} key={version}>{version}</button>)}</div></section>

            <section aria-labelledby="fc-modal-spec"><h3 id="fc-modal-spec">스펙</h3><div className="fc-spec-list">{selectedTemplate.specs.map((spec, index) => <button type="button" className={specIndex === index ? 'is-active' : ''} style={specIndex === index ? { borderColor: selectedTemplate.brandColor, background: selectedTemplate.iconBackground, color: selectedTemplate.brandColor } : undefined} aria-pressed={specIndex === index} onClick={() => setSpecIndex(index)} key={spec.label}><strong>{spec.label}</strong><small>{spec.vcpu} vCPU · {spec.memory}</small></button>)}</div></section>

            <section aria-labelledby="fc-modal-cli"><h3 id="fc-modal-cli">CLI로 바로 실행</h3><div className="fc-dialog-command"><code>{selectedCommand}</code><button type="button" onClick={copyCommand}>{copyLabel === '복사됨 ✓' ? <Check size={13} /> : <Copy size={13} />}{copyLabel}</button></div></section>

            <button className="fc-dialog-close" type="button" onClick={closeTemplate}>닫기</button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
