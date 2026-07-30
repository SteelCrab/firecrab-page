import { useEffect, useRef, useState, type MouseEvent } from 'react';
import {
  Blocks,
  Check,
  Copy,
  Menu,
  Settings,
  ShieldCheck,
  TerminalSquare,
  X,
  Zap,
} from 'lucide-react';
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

const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
const firecrackerMetricsUrl = 'https://github.com/firecracker-microvm/firecracker/blob/main/FAQ.md';
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
    icon: Zap,
    background: '#fff3de',
    color: '#9f3217',
    title: 'REST API 기반',
    description: '현재 제공되는 POST /api/vms로 VM 구성 레코드를 로컬 JSON 데이터에 저장합니다.',
  },
  {
    icon: ShieldCheck,
    background: '#eaf2ea',
    color: '#2f6f42',
    title: 'Firecracker 연동 로드맵',
    description: '실제 microVM 실행과 하드웨어 격리 수명주기 연동은 다음 단계로 확장 중입니다.',
  },
  {
    icon: Blocks,
    background: '#edeef7',
    color: '#4f568f',
    title: '오픈소스 · 셀프호스팅',
    description: 'Apache 2.0 라이선스로 소스코드를 확인하고, 여러분의 Linux/KVM 환경에서 직접 운영하세요.',
  },
  {
    icon: TerminalSquare,
    background: '#fbeae4',
    color: '#9f3217',
    title: '웹 대시보드',
    description: 'React 기반 UI에서 VM 구성을 다루는 운영 경험을 단계적으로 확장하고 있습니다.',
  },
];

const comparisonRows = [
  ['현재 제공 범위', 'VM 구성 레코드 API', 'VM 실행·관리', '컨테이너 실행·관리'],
  ['실행 엔진', 'Firecracker 연동 예정', 'QEMU/KVM 등', '컨테이너 런타임'],
  ['격리 모델', '하드웨어 가상화 목표', '하드웨어 가상화', '커널 네임스페이스 공유'],
  ['셀프호스팅', '✓ 완전 지원', '벤더별 상이', '✓ 지원'],
  ['라이선스', 'Apache 2.0', '제품별 상이', '제품별 상이'],
];

const bootChart = [
  { label: 'Firecracker', value: '<125ms', width: 8, color: accent, labelColor: '#8a5a16' },
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

const firstCommand = 'cd firecrab-api && cargo run';
const secondCommand = "curl -X POST http://localhost:3000/api/vms -H 'Content-Type: application/json' -d @vm.json";
const firstTypingEnd = firstCommand.length * 35;
const firstOutputAt = firstTypingEnd + 250;
const secondTypingStart = firstOutputAt + 900;
const secondTypingEnd = secondTypingStart + secondCommand.length * 35;
const secondOutputAt = secondTypingEnd + 250;
const footerAt = secondOutputAt + 300;
const terminalCycle = footerAt + 2200;

function useTerminalDemo(isActive: boolean) {
  const [elapsed, setElapsed] = useState(footerAt);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let interval: number | undefined;

    const stop = () => {
      if (interval === undefined) return;
      window.clearInterval(interval);
      interval = undefined;
    };

    const syncMotion = () => {
      stop();
      if (reducedMotion.matches || !isActive) {
        setElapsed(footerAt);
        return;
      }

      const startedAt = performance.now();
      setElapsed(0);
      interval = window.setInterval(() => {
        setElapsed((performance.now() - startedAt) % terminalCycle);
      }, 90);
    };

    syncMotion();
    reducedMotion.addEventListener('change', syncMotion);

    return () => {
      stop();
      reducedMotion.removeEventListener('change', syncMotion);
    };
  }, [isActive]);

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

function getTemplateApiCommand(template: StackItem, version: string, spec: VmSpec) {
  const memory = Number.parseInt(spec.memory, 10);
  const payload = JSON.stringify({
    name: `${template.slug}-vm`,
    template: `${template.slug}-${version}`,
    cpu: spec.vcpu,
    ram: memory,
  });

  return `curl -X POST http://localhost:3000/api/vms -H 'Content-Type: application/json' -d '${payload}'`;
}

async function copyText(text: string, fallbackRoot: HTMLElement) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const activeElement = document.activeElement;
    const fallback = document.createElement('textarea');
    fallback.value = text;
    fallback.setAttribute('readonly', '');
    fallback.style.position = 'fixed';
    fallback.style.inset = '0 auto auto -9999px';
    fallbackRoot.appendChild(fallback);

    try {
      fallback.focus();
      fallback.select();
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      fallback.remove();
      if (activeElement instanceof HTMLElement) activeElement.focus();
    }
  }
}

function HeroTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const terminal = useTerminalDemo(isVisible);

  useEffect(() => {
    const terminalElement = terminalRef.current;
    if (!terminalElement || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(terminalElement);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="fc-terminal"
      ref={terminalRef}
      role="img"
      aria-label="FireCrab API를 실행하고 REST API로 Ubuntu VM 구성 레코드를 생성하는 예시"
    >
      <div className="fc-terminal-dots" aria-hidden="true"><span /><span /><span /></div>
      <div className="fc-terminal-body" aria-hidden="true">
        <div><span className="fc-terminal-prompt">$</span> {terminal.firstText}<i className={terminal.firstCursorVisible ? 'is-visible' : ''}>▋</i></div>
        {terminal.showFirstOutput ? (
          <div className="fc-terminal-output">
            <span>✓ FireCrab API listening on 0.0.0.0:3000</span>
            <span>✓ local data store ready</span>
          </div>
        ) : null}
        {terminal.showSecondCommand ? (
          <div className="fc-terminal-command"><span className="fc-terminal-prompt">$</span> {terminal.secondText}<i className={terminal.secondCursorVisible ? 'is-visible' : ''}>▋</i></div>
        ) : null}
        {terminal.showSecondOutput ? <div className="fc-terminal-shell">→ 201 Created · state: Created</div> : null}
        {terminal.showFooter ? (
          <div className="fc-terminal-footer">instance: ubuntu-vm · cpu: 2 · ram: 1024MB · state: <strong>Created</strong></div>
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
  const [copyStatus, setCopyStatus] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const copyResetTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (copyResetTimerRef.current !== undefined) {
      window.clearTimeout(copyResetTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const desktop = window.matchMedia('(min-width: 641px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };

    desktop.addEventListener('change', closeOnDesktop);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileMenuOpen]);

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
    setCopyStatus('');
  };

  const closeTemplate = () => setSelectedTemplate(null);

  const copyCommand = async () => {
    if (!selectedTemplate) return;
    const version = selectedTemplate.versions[versionIndex];
    const spec = selectedTemplate.specs[specIndex];
    const dialog = modalRef.current;
    if (!dialog) return;
    const copied = await copyText(getTemplateApiCommand(selectedTemplate, version, spec), dialog);

    setCopyLabel(copied ? '복사됨 ✓' : '복사 실패');
    setCopyStatus(copied ? 'REST API 요청을 클립보드에 복사했습니다.' : '복사하지 못했습니다. 요청을 직접 선택해 주세요.');
    if (copyResetTimerRef.current !== undefined) window.clearTimeout(copyResetTimerRef.current);
    copyResetTimerRef.current = window.setTimeout(() => {
      setCopyLabel('복사');
      copyResetTimerRef.current = undefined;
    }, 1600);
  };

  const selectedVersion = selectedTemplate?.versions[versionIndex];
  const selectedSpec = selectedTemplate?.specs[specIndex];
  const selectedCommand = selectedTemplate && selectedVersion && selectedSpec
    ? getTemplateApiCommand(selectedTemplate, selectedVersion, selectedSpec)
    : '';

  return (
    <div className="fc-landing">
      <a className="fc-skip-link" href="#main-content">본문으로 건너뛰기</a>
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
            <a href="/docs">문서</a>
            <a href="/blog">블로그</a>
          </nav>
          <div className="fc-nav-actions">
            <a className="fc-nav-github" href={repositoryUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="fc-nav-cta" href={repositoryUrl} target="_blank" rel="noreferrer">
              현재 구현 보기
            </a>
          </div>
          <button
            className="fc-mobile-menu-button"
            type="button"
            aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-controls="fc-mobile-menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav
          className="fc-mobile-menu"
          id="fc-mobile-menu"
          aria-label="모바일 주요 메뉴"
          hidden={!mobileMenuOpen}
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)}>기능</a>
          <a href="#stack" onClick={() => setMobileMenuOpen(false)}>호환성</a>
          <a href="#compare" onClick={() => setMobileMenuOpen(false)}>비교</a>
          <a href="/docs" onClick={() => setMobileMenuOpen(false)}>문서</a>
          <a href="/blog" onClick={() => setMobileMenuOpen(false)}>블로그</a>
          <a href={repositoryUrl} target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)}>GitHub ↗</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="fc-hero" id="top" aria-labelledby="fc-hero-title">
          <div className="fc-hero-copy">
            <p className="fc-eyebrow">Open Source MicroVM Platform</p>
            <h1 id="fc-hero-title">MicroVM 운영을 위한<br />오픈소스 기반</h1>
            <p className="fc-hero-description">
              FireCrab은 Firecracker 기반 운영 도구를 목표로 하는 오픈소스 웹 대시보드입니다.
              현재는 VM 구성 레코드를 로컬 REST API로 생성하며, 실제 microVM 실행 연동은 확장 중입니다.
            </p>
            <div className="fc-hero-actions">
              <a className="fc-primary-action" href={repositoryUrl} target="_blank" rel="noreferrer">
                GitHub에서 코드 보기 <span aria-hidden="true">→</span>
              </a>
              <a className="fc-secondary-action" href="#stack">구성 예시 살펴보기</a>
            </div>
            <dl className="fc-hero-stats" aria-label="FireCrab 주요 수치">
              <div><dt>&lt;125ms</dt><dd>Firecracker 공식 시작 지표</dd></div>
              <div><dt>Apache 2.0</dt><dd>오픈소스 라이선스</dd></div>
              <div><dt>Self-hosted</dt><dd>직접 운영 가능</dd></div>
            </dl>
          </div>

          <HeroTerminal />
        </section>

        <section className="fc-stack-section" id="stack" aria-labelledby="fc-stack-title">
          <div className="fc-section-inner">
            <div className="fc-section-heading">
              <span>Configuration Examples</span>
              <h2 id="fc-stack-title">지원 예정 스택을 구성 예시로 확인</h2>
              <p>현재 API에 저장할 VM 구성 값을 미리 살펴보세요. 이미지 빌드와 검증은 로드맵에 포함됩니다.</p>
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
                  <span className="fc-stack-link">구성 · API 보기 <span aria-hidden="true">→</span></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="fc-features" id="features" aria-labelledby="fc-features-title">
          <div className="fc-section-heading">
            <span>Core Values</span>
              <h2 id="fc-features-title">현재 기반부터 다음 단계까지</h2>
              <p>지금 사용할 수 있는 범위와 Firecracker 연동 로드맵을 구분했습니다.</p>
          </div>
          <div className="fc-feature-grid">
            {featureItems.map((feature) => {
              const FeatureIcon = feature.icon;
              return (
                <article className="fc-feature-card" key={feature.title}>
                  <span className="fc-feature-icon" style={{ background: feature.background, color: feature.color }} aria-hidden="true">
                    <FeatureIcon size={21} strokeWidth={1.9} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
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
              <h3>시작 시간 참고 (로그 스케일)</h3>
              <div className="fc-chart-rows" role="img" aria-label="Firecracker 공식 지표 125밀리초 미만, 컨테이너와 전통 VM의 일반적인 예시를 비교한 차트">
                {bootChart.map((item, index) => (
                  <div className="fc-chart-row" key={item.label}>
                    <strong style={{ color: item.labelColor }}>{item.label}</strong>
                    <span className="fc-chart-track"><i style={{ width: chartVisible ? `${item.width}%` : 0, background: item.color, transitionDelay: `${index * 150}ms` }} /></span>
                    <b>{item.value}</b>
                  </div>
                ))}
              </div>
              <p className="fc-chart-source">
                <a href={firecrackerMetricsUrl} target="_blank" rel="noreferrer">Firecracker 공식 FAQ</a>의 시작 지표를 인용했습니다.
                나머지 값은 일반적인 예시이며 환경에 따라 달라집니다.
              </p>
            </div>
          </div>
        </section>

        <section className="fc-deploy-section" id="deploy" aria-labelledby="fc-deploy-title">
          <div className="fc-section-heading">
            <span>Deployment Blueprint</span>
            <h2 id="fc-deploy-title">Git에서 마이크로VM까지, 한눈에 보는 운영 흐름</h2>
            <p>저장소 연결부터 RootFS 빌드와 배포까지, FireCrab이 확장해 갈 운영 흐름입니다. 현재 구현 범위는 GitHub에서 확인하세요.</p>
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
          <h2 id="fc-final-title">현재 구현을 직접 확인하세요</h2>
          <p>REST API와 웹 대시보드 코드를 로컬에서 실행하고, 다음 단계에 함께 기여할 수 있습니다.</p>
          <div>
            <a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub에서 코드 보기 <span aria-hidden="true">→</span></a>
            <code>git clone https://github.com/SteelCrab/firecrab.git</code>
          </div>
        </section>
      </main>

      <footer className="fc-footer">
        <div className="fc-footer-grid">
          <div className="fc-footer-brand">
            <div><img src="/firecrab-icon.png" alt="" aria-hidden="true" /><strong>FireCrab</strong></div>
            <p>Firecracker 운영 도구를 향해 확장 중인 오픈소스 프로젝트.</p>
          </div>
          <nav aria-label="제품 링크"><strong>제품</strong><a href="#features">기능</a><a href="#stack">호환성</a><a href="/docs">문서</a><a href="/blog">블로그</a><a href={repositoryUrl} target="_blank" rel="noreferrer">GitHub</a></nav>
          <nav aria-label="리소스 링크"><strong>리소스</strong><a href={`${repositoryUrl}/blob/main/docs/api.md`} target="_blank" rel="noreferrer">API 문서</a><a href={`${repositoryUrl}/issues`} target="_blank" rel="noreferrer">커뮤니티</a></nav>
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

            <section aria-labelledby="fc-modal-features"><h3 id="fc-modal-features">예시 구성 (로드맵)</h3><ul>{selectedTemplate.features.map((feature) => <li key={feature}><i style={{ background: selectedTemplate.brandColor }} /><span>{feature}</span></li>)}</ul></section>

            <section aria-labelledby="fc-modal-version"><h3 id="fc-modal-version">버전</h3><div className="fc-option-list">{selectedTemplate.versions.map((version, index) => <button type="button" className={versionIndex === index ? 'is-active' : ''} style={versionIndex === index ? { borderColor: selectedTemplate.brandColor, background: selectedTemplate.iconBackground, color: '#2a241d' } : undefined} aria-pressed={versionIndex === index} onClick={() => setVersionIndex(index)} key={version}>{version}</button>)}</div></section>

            <section aria-labelledby="fc-modal-spec"><h3 id="fc-modal-spec">스펙</h3><div className="fc-spec-list">{selectedTemplate.specs.map((spec, index) => <button type="button" className={specIndex === index ? 'is-active' : ''} style={specIndex === index ? { borderColor: selectedTemplate.brandColor, background: selectedTemplate.iconBackground, color: '#2a241d' } : undefined} aria-pressed={specIndex === index} onClick={() => setSpecIndex(index)} key={spec.label}><strong>{spec.label}</strong><small>{spec.vcpu} vCPU · {spec.memory}</small></button>)}</div></section>

            <section aria-labelledby="fc-modal-api"><h3 id="fc-modal-api">VM 구성 레코드 생성</h3><div className="fc-dialog-command"><code>{selectedCommand}</code><button type="button" onClick={copyCommand}>{copyLabel === '복사됨 ✓' ? <Check size={13} /> : <Copy size={13} />}{copyLabel}</button></div></section>
            <span className="fc-sr-only" role="status" aria-live="polite">{copyStatus}</span>

            <button className="fc-dialog-close" type="button" onClick={closeTemplate}>닫기</button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
