export type Language = 'ko' | 'en';

export interface ProductView {
  id: string;
  label: string;
  badge: { ko: string; en: string };
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  image: string;
  alt: { ko: string; en: string };
  icon: string;
  details: { ko: string[]; en: string[] };
  secondary: {
    label: string;
    title: { ko: string; en: string };
    description: { ko: string; en: string };
    image: string;
    alt: { ko: string; en: string };
    icon: string;
    imagePosition?: string;
  } | null;
}

export const productViews: ProductView[] = [
  {
    id: 'm2',
    label: 'M2 MicroMachine',
    badge: { ko: 'COMPUTE', en: 'COMPUTE' },
    title: { ko: '내 서버에 만드는 전용 M2', en: 'Your own M2, on your server' },
    description: {
      ko: 'M2는 FireCrab의 핵심 실행 단위인 MicroMachine입니다. M2Image, vCPU, 메모리, 디스크, MicroNetwork와 저장 위치를 조합해 완전히 격리된 Firecracker microVM을 생성하고 운영합니다.',
      en: 'M2 is FireCrab’s MicroMachine runtime unit. Combine an M2Image, vCPU, memory, disk, MicroNetwork, and storage location into an isolated Firecracker microVM.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab M2 생성 폼과 실행 중인 M2 목록', en: 'FireCrab M2 creation form and running M2 list' },
    icon: '/m2-icon.png',
    details: {
      ko: [
        '원클릭 생성 · 시작 · 일시중지 · 삭제 수명주기 관리',
        'vCPU 및 RAM 동적 할당과 실시간 게스트 텔레메트리',
        '브라우저 xterm 기반 저지연 시리얼 콘솔',
        '실시간 부팅 진단과 커널 메시지 스트리밍',
      ],
      en: [
        'One-click create, start, pause, and delete lifecycle',
        'Dynamic vCPU & RAM allocation with real-time guest telemetry',
        'Low-latency browser serial console via xterm',
        'Real-time kernel log streaming and boot diagnostics',
      ],
    },
    secondary: {
      label: 'TERMINAL',
      title: { ko: '실행 중인 M2에 브라우저로 즉시 접속', en: 'Connect directly to a running M2' },
      description: {
        ko: 'SSH 키 등록이나 포트 개방 없이 웹 브라우저 시리얼 콘솔에서 부팅 과정과 로그인 프롬프트를 실시간으로 확인하고 명령을 내립니다. 콘솔 로그 복사·다운로드와 사양 정보도 한 화면에서 제공합니다.',
        en: 'Inspect boot logs and login prompts directly in the browser serial console without SSH keys. Copy or download console logs alongside VM hardware specs on a single view.',
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
    badge: { ko: 'NETWORKING', en: 'NETWORKING' },
    title: { ko: '직접 설계하는 격리 네트워크', en: 'Isolated networks you define' },
    description: {
      ko: 'MicroNetwork는 Linux Bridge, Gateway, 내장 DHCP, NAT Egress와 방화벽 규칙을 하나의 명시적인 네트워크로 관리합니다. 서로 다른 네트워크의 M2는 기본적으로 완벽히 격리됩니다.',
      en: 'MicroNetwork manages a Linux bridge, gateway, built-in DHCP, NAT egress, and firewall rules as one explicit network. M2s on different networks are isolated by default.',
    },
    image: '/dashboard-networks.png',
    alt: { ko: 'FireCrab MicroNetwork 생성과 네트워크 목록', en: 'FireCrab MicroNetwork creation and network list' },
    icon: '/micronetwork-icon.png',
    details: {
      ko: [
        '사용자 정의 Subnet CIDR (예: 10.100.0.0/24)',
        '네트워크별 인터넷 NAT Egress 정책 제어',
        'M2별 고정 IPv4, MAC 주소 및 Hostname 매핑',
        '외부 트래픽 인입을 위한 포트 포워딩(Port Forwarding)',
      ],
      en: [
        'Custom subnet CIDRs (e.g., 10.100.0.0/24)',
        'Per-network internet NAT egress policies',
        'Persistent IPv4, MAC address, and hostname binding',
        'Inbound port forwarding rules for external access',
      ],
    },
    secondary: null,
  },
  {
    id: 'microstorage',
    label: 'MicroStorage',
    badge: { ko: 'STORAGE', en: 'STORAGE' },
    title: { ko: '워크로드에 맞춰 분산하는 스토리지 풀', en: 'Storage placement per workload' },
    description: {
      ko: 'MicroStorage는 호스트에 마운트된 디렉터리를 M2 스토리지 풀로 등록합니다. 초고속 NVMe, 대용량 SSD, 별도 드라이브 등 워크로드 특성에 맞춰 VM rootfs 디스크를 유연하게 분산할 수 있습니다.',
      en: 'MicroStorage registers host-mounted directories as M2 storage pools. Place VM root filesystems across high-speed NVMe, bulk SSDs, or dedicated drives.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab M2 생성 화면의 MicroStorage 저장 위치 선택', en: 'Selecting a MicroStorage location while creating an M2' },
    icon: '/microstorage-icon.png',
    details: {
      ko: [
        '호스트의 기존 마운트 경로를 스토리지 풀로 손쉽게 등록',
        'M2 생성 시 원하는 스토리지 풀 선택 및 용량 지정',
        'MicroVM 중지 및 호스트 재부팅 후에도 rootfs 영구 유지',
        '스토리지 사용량 및 디스크 I/O 상태 모니터링',
      ],
      en: [
        'Register existing host mounts as storage pools',
        'Select storage pools and set disk size per M2',
        'Persistent root filesystems across reboots and stops',
        'Storage usage metrics and disk health tracking',
      ],
    },
    secondary: null,
  },
  {
    id: 'm2image',
    label: 'M2Image & MicroBoot',
    badge: { ko: 'IMAGE BUILDER', en: 'IMAGE BUILDER' },
    title: { ko: '검증된 OS 이미지와 OCI 컨테이너 변환', en: 'Verified OS images and OCI imports' },
    description: {
      ko: 'M2Image는 커널, rootfs, initramfs와 부팅 파라미터를 담은 Firecracker 전용 이미지입니다. Alpine, Ubuntu, Rocky 공식 템플릿은 물론 Docker Hub 등 OCI 컨테이너를 microVM rootfs로 직접 변환합니다.',
      en: 'M2Image bundles the kernel, rootfs, initramfs, and boot parameters. Install curated Alpine, Ubuntu, or Rocky images, or convert container images (e.g. nginx:1.27) directly into microVM rootfs.',
    },
    image: '/dashboard-images.png',
    alt: { ko: 'FireCrab M2Image 목록과 설치 상태', en: 'FireCrab M2Image list and installation state' },
    icon: '/m2image-icon.png',
    details: {
      ko: [
        '공식 패키지 원클릭 다운로드 및 해시 무결성 검증',
        'OCI 컨테이너 이미지 inspect 및 microVM RootFS 자동 변환',
        'MicroBoot 임시 빌더 VM을 통한 안전한 부트스트랩',
        '빌더 콘솔 실시간 진행 상황 및 로그 추적',
      ],
      en: [
        'One-click official image downloads with checksum verification',
        'Direct OCI container inspect and RootFS conversion',
        'Safe bootstrap inside an isolated MicroBoot builder VM',
        'Live builder console output and step progression tracking',
      ],
    },
    secondary: {
      label: 'MICROBOOT',
      title: { ko: '임시 빌더 VM에서 안전하게 부트스트랩', en: 'Bootstrap distributions inside builder VMs' },
      description: {
        ko: 'MicroBoot는 임시 격리 builder VM을 기동하여 대상 OS를 설치하고 Firecracker용 이미지로 패키징합니다. 시스템 설치, 드라이버 구성, 커널 패키징 전 과정을 실시간 콘솔로 관찰할 수 있습니다.',
        en: 'MicroBoot spins up an ephemeral builder VM to install the OS and package it for Firecracker. Follow installation, driver configuration, and packaging live via console.',
      },
      image: '/dashboard-microboot.png',
      alt: { ko: 'MicroBoot builder VM의 이미지 설치 진행 과정과 실시간 콘솔', en: 'MicroBoot builder VM image installation progress and live console' },
      icon: '/microboot-icon.svg',
      imagePosition: 'center 72%',
    },
  },
];

export const featureHighlights = [
  {
    id: 'sub-second-boot',
    iconName: 'Zap',
    badge: '< 5ms',
    title: { ko: '밀리초 단위 초고속 부팅', en: 'Sub-second Instant Boot' },
    description: {
      ko: '수십 초가 걸리는 기존 가상머신과 달리, Firecracker의 미니멀 하이퍼바이저를 통해 수십 밀리초 만에 부팅하여 트래픽에 즉각 반응합니다.',
      en: 'Unlike traditional VMs taking dozens of seconds, FireCrab spins up microVMs in milliseconds using Firecracker’s ultra-minimal hypervisor.',
    },
  },
  {
    id: 'kernel-isolation',
    iconName: 'ShieldCheck',
    badge: 'KVM Level',
    title: { ko: '전용 커널 기반 하드웨어 격리', en: 'Hardware-Level Isolation' },
    description: {
      ko: '호스트 커널을 공유하는 컨테이너와 달리, 독립된 Linux 커널과 KVM 하드웨어 가상화 경계를 제공하여 완벽한 멀티테넌시 보안을 보장합니다.',
      en: 'Unlike containers sharing the host kernel, each microVM runs its own isolated Linux kernel backed by KVM virtualization for true multi-tenant security.',
    },
  },
  {
    id: 'micronetwork',
    iconName: 'Network',
    badge: 'Isolated',
    title: { ko: '선언적 격리 네트워크', en: 'Declarative MicroNetworks' },
    description: {
      ko: 'Bridge, DHCP, NAT egress, 포트 포워딩을 GUI에서 몇 번의 클릭으로 구성합니다. 네트워크 간 트래픽은 기본적으로 엄격히 분리됩니다.',
      en: 'Manage bridges, DHCP, NAT egress, and port forwarding with a few clicks. Workloads on separate networks are strictly isolated by default.',
    },
  },
  {
    id: 'microstorage',
    iconName: 'HardDrive',
    badge: 'Persistent',
    title: { ko: '호스트 스토리지 풀링', en: 'Flexible Host Storage Pooling' },
    description: {
      ko: '호스트에 연결된 다양한 디렉터리(NVMe, SSD 등)를 스토리지 풀로 등록하고 워크로드별로 최적의 저장 위치를 지정합니다.',
      en: 'Register host storage mounts (NVMe, SSDs) as flexible pools and assign appropriate storage targets per workload.',
    },
  },
  {
    id: 'oci-import',
    iconName: 'Box',
    badge: 'OCI Ready',
    title: { ko: 'OCI 컨테이너 이미지 Import', en: 'OCI Container Image Import' },
    description: {
      ko: 'Alpine, Ubuntu 등 공식 배포판 이미지뿐 아니라 Docker Hub 등 OCI 컨테이너를 microVM rootfs로 직접 변환하여 실행할 수 있습니다.',
      en: 'Convert standard container images (e.g., Docker Hub) into microVM root filesystems alongside curated Alpine, Ubuntu, and Rocky images.',
    },
  },
  {
    id: 'web-console',
    iconName: 'Terminal',
    badge: 'Web xterm',
    title: { ko: '브라우저 시리얼 콘솔 & REST API', en: 'Browser Console & REST API' },
    description: {
      ko: 'SSH 설정 없이도 브라우저에서 실시간 시리얼 콘솔로 즉시 접속하며, 강력한 Rust 코어 REST API로 모든 리소스를 자동화할 수 있습니다.',
      en: 'Direct interactive serial console in your browser without SSH keys, paired with a robust Rust-powered REST API for full automation.',
    },
  },
];

export const comparisonTable = [
  {
    dimension: { ko: '격리 방식', en: 'Isolation Model' },
    docker: { ko: '프로세스 격리 (호스트 커널 공유)', en: 'Process isolation (shared host kernel)' },
    traditionalVm: { ko: '하드웨어 에뮬레이션 (무거운 QEMU)', en: 'Full hardware emulation (heavy QEMU)' },
    firecrab: { ko: 'KVM 하드웨어 가상화 + 독립 게스트 커널', en: 'KVM hardware virtualization + dedicated guest kernel' },
    highlight: true,
  },
  {
    dimension: { ko: '부팅 속도', en: 'Boot Time' },
    docker: { ko: '수 초 (1 ~ 3s)', en: 'Few seconds (1 ~ 3s)' },
    traditionalVm: { ko: '느림 (30 ~ 120s)', en: 'Slow (30 ~ 120s)' },
    firecrab: { ko: '초고속 밀리초 (< 100ms)', en: 'Sub-second boot (< 100ms)' },
    highlight: true,
  },
  {
    dimension: { ko: '메모리 오버헤드', en: 'Memory Footprint' },
    docker: { ko: '최소 (~수 MB)', en: 'Minimal (~few MB)' },
    traditionalVm: { ko: '큼 (수백 MB ~ 수 GB per VM)', en: 'Heavy (hundreds of MB ~ GBs per VM)' },
    firecrab: { ko: '초경량 (< 5MB per microVM)', en: 'Ultra-light (< 5MB per microVM)' },
    highlight: true,
  },
  {
    dimension: { ko: '보안 및 취약점 표면', en: 'Attack Surface' },
    docker: { ko: '커널 공유로 인한 컨테이너 탈출 위험', en: 'Kernel escape risks via shared host kernel' },
    traditionalVm: { ko: '복잡한 가상 하드웨어 디바이스 표면', en: 'Large attack surface from legacy emulated devices' },
    firecrab: { ko: '최소 디바이스 모델 + 엄격한 Seccomp 필터', en: 'Minimal device model + strict seccomp jail' },
    highlight: true,
  },
  {
    dimension: { ko: '네트워크 & 스토리지', en: 'Network & Storage' },
    docker: { ko: '복잡한 도커 네트워크 드라이버', en: 'Complex docker network drivers & overlays' },
    traditionalVm: { ko: '수동 브릿지 및 디스크 마운트 설정', en: 'Manual bridge & virtual disk management' },
    firecrab: { ko: '선언적 MicroNetwork & MicroStorage 풀 내장', en: 'Built-in declarative MicroNetwork & MicroStorage pools' },
    highlight: true,
  },
  {
    dimension: { ko: '운영 환경', en: 'Deployment' },
    docker: { ko: 'Docker Engine 데몬', en: 'Docker Engine daemon' },
    traditionalVm: { ko: '무거운 하이퍼바이저 (Proxmox/ESXi)', en: 'Heavy hypervisors (Proxmox/ESXi)' },
    firecrab: { ko: '단일 Linux 호스트 원클릭 설치 및 실행', en: 'Single Linux host, one-line curl install & run' },
    highlight: true,
  },
];

export const workflow = [
  {
    number: '01',
    title: { ko: 'MicroNetwork 정의', en: 'Define MicroNetwork' },
    description: {
      ko: '서브넷 CIDR과 NAT Egress 정책을 설정합니다. 숨겨진 디폴트 네트워크 없이 명시적으로 관리됩니다.',
      en: 'Set custom subnet CIDR and NAT egress policy. Every network is explicit with zero hidden surprises.',
    },
  },
  {
    number: '02',
    title: { ko: '이미지와 하드웨어 사양 선택', en: 'Pick Image & Specs' },
    description: {
      ko: '검증된 OS 이미지(또는 OCI 컨테이너), vCPU, RAM 용량, 그리고 스토리지 풀을 선택해 M2를 만듭니다.',
      en: 'Choose an OS image (or OCI container), vCPU count, memory size, and storage pool for your M2.',
    },
  },
  {
    number: '03',
    title: { ko: '원클릭 시작 및 터미널 연결', en: 'Start & Connect' },
    description: {
      ko: '수십 밀리초 만에 부팅이 완료되면 웹 브라우저 xterm 콘솔에서 즉시 셸 명령을 실행할 수 있습니다.',
      en: 'In under a second, the VM is online and the browser xterm console is ready for interactive commands.',
    },
  },
];

export const architectureFlow = [
  { number: '01', title: { ko: 'Linux Host', en: 'Linux Host' }, description: { ko: 'KVM 및 FireCrab 바이너리', en: 'KVM & FireCrab binary' } },
  { number: '02', title: { ko: 'M2Image', en: 'M2Image' }, description: { ko: 'MicroBoot & OCI 변환', en: 'MicroBoot & OCI build' } },
  { number: '03', title: { ko: 'MicroNetwork', en: 'MicroNetwork' }, description: { ko: 'Bridge, DHCP, NAT Egress', en: 'Bridge, DHCP, NAT egress' } },
  { number: '04', title: { ko: 'MicroStorage', en: 'MicroStorage' }, description: { ko: 'NVMe/SSD 풀링 관리', en: 'NVMe/SSD storage pools' } },
  { number: '05', title: { ko: 'M2 MicroVM', en: 'M2 MicroVM' }, description: { ko: 'Firecracker 프로세스 기동', en: 'Firecracker VM spawn' } },
  { number: '06', title: { ko: '웹 대시보드', en: 'Web Dashboard' }, description: { ko: '브라우저 콘솔 & 모니터링', en: 'Web console & telemetry' } },
];
