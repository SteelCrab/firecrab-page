export type Language = 'ko' | 'en';

export const repositoryUrl = 'https://github.com/SteelCrab/firecrab';
export const releaseVersion = 'v0.3.0';
export const installCommand = `curl -fsSL ${repositoryUrl}/releases/latest/download/install.sh | bash`;
export const gitCloneCommand = `git clone ${repositoryUrl}.git\ncd firecrab\n./scripts/ci-prepare-install-payload.sh\n./install.sh --bin-dir target/release`;

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
    id: 'microvm',
    label: 'MicroVM',
    badge: { ko: 'COMPUTE', en: 'COMPUTE' },
    title: { ko: '내 서버에 만드는 전용 MicroVM', en: 'Your own MicroVMs, on your server' },
    description: {
      ko: 'MicroVM은 FireCrab의 핵심 실행 단위입니다. M2Image, vCPU, 메모리, 디스크, MicroNetwork와 저장 위치를 골라 만들며, 실행 중인 MicroVM마다 Firecracker 프로세스가 하나씩 뜨고 각자 자기 커널로 부팅합니다.',
      en: 'A MicroVM is FireCrab’s runtime unit. Pick an M2Image, vCPU, memory, disk, MicroNetwork, and storage location; each running MicroVM gets its own Firecracker process and boots its own kernel.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab MicroVM 생성 폼과 실행 중인 MicroVM 목록', en: 'FireCrab MicroVM creation form and running MicroVM list' },
    icon: '/m2-icon.png',
    details: {
      ko: [
        '생성 · 시작 · 중지 · 삭제 수명주기와 단계별 시작 타임라인 · 로그',
        '게스트 CPU · 메모리 사용량 실시간 표시와 스파크라인 (Metrics Agent)',
        '브라우저 시리얼 Terminal과 키 기반 SSH 연결 패널',
        'Shell 스크립트를 VM에 고정해 네트워크 준비 후 자동 실행',
      ],
      en: [
        'Create, start, stop, and delete lifecycle with a step-by-step startup timeline and logs',
        'Live guest CPU and memory usage with sparklines via the Metrics Agent',
        'Browser serial Terminal and a key-based SSH connect panel',
        'Pin Shell scripts to a VM and run them once its network is ready',
      ],
    },
    secondary: {
      label: 'TERMINAL',
      title: { ko: '실행 중인 MicroVM에 브라우저로 즉시 접속', en: 'Connect directly to a running MicroVM' },
      description: {
        ko: '브라우저 시리얼 콘솔에서 부팅 과정과 로그인 프롬프트를 실시간으로 확인하고 명령을 내립니다. 콘솔 로그 복사·저장은 물론 VM 사양·네트워크·사용량 카드도 한 화면에서 볼 수 있고, 키 기반 SSH 접속이 필요하면 같은 화면의 SSH 탭에서 명령을 받을 수 있습니다.',
        en: 'Watch boot output and the login prompt live in the browser serial console, then run commands. Copy or save console logs, see specs, network, and usage cards on the same view, and grab key-based SSH commands from the SSH tab when you need them.',
      },
      image: '/dashboard-terminal.png',
      alt: { ko: '실행 중인 MicroVM의 브라우저 시리얼 Terminal', en: 'Browser serial Terminal connected to a running MicroVM' },
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
      ko: 'MicroNetwork는 이름 있는 서브넷 하나에 Linux Bridge, DHCP, 인터넷(NAT) 정책과 방화벽을 묶어 관리합니다. 모든 MicroVM은 반드시 하나의 MicroNetwork에 속하고 숨겨진 기본 네트워크는 없으며, 서로 다른 MicroNetwork는 기본적으로 격리됩니다.',
      en: 'A MicroNetwork bundles a named subnet with its Linux bridge, DHCP, internet (NAT) policy, and firewall. Every MicroVM belongs to exactly one network, there is no hidden default, and different MicroNetworks are isolated by default.',
    },
    image: '/dashboard-networks.png',
    alt: { ko: 'FireCrab MicroNetwork 생성과 네트워크 목록', en: 'FireCrab MicroNetwork creation and network list' },
    icon: '/micronetwork-icon.png',
    details: {
      ko: [
        '사용자 정의 IPv4 CIDR과 선택형 IPv6 /64 (SLAAC · DHCPv6)',
        '네트워크 NAT 정책과 VM별 egress(internet · isolated)를 함께 적용',
        'NAT 업링크 NIC 선택과 VM별 영구 IPv4 · MAC 리스',
        '호스트 포트 → 게스트 포트 포워딩 (nftables DNAT, TCP/UDP)',
      ],
      en: [
        'Custom IPv4 CIDR with optional IPv6 /64 (SLAAC or DHCPv6)',
        'Network NAT policy combined with per-VM egress (internet or isolated)',
        'Selectable NAT uplink NIC and persistent per-VM IPv4/MAC leases',
        'Host-to-guest port forwarding (nftables DNAT, TCP/UDP)',
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
      ko: 'MicroStorage는 이미 마운트된 호스트 디렉터리를 VM 디스크 저장 위치로 등록합니다. 초고속 NVMe, 대용량 SSD, 별도 드라이브 등 워크로드 특성에 맞춰 VM rootfs 디스크를 나눠 둘 수 있습니다. FireCrab은 디스크를 파티션 · 포맷 · 마운트하지 않습니다.',
      en: 'MicroStorage registers an already-mounted host directory as a place for VM disks. Spread VM root filesystems across fast NVMe, bulk SSDs, or dedicated drives. FireCrab never partitions, formats, or mounts disks.',
    },
    image: '/dashboard-microvm.png',
    alt: { ko: 'FireCrab MicroVM 생성 화면의 MicroStorage 저장 위치 선택', en: 'Selecting a MicroStorage location while creating a MicroVM' },
    icon: '/microstorage-icon.png',
    details: {
      ko: [
        '호스트에 마운트된 파일시스템과 여유 공간을 확인하고 디렉터리를 풀로 등록',
        'MicroVM 생성 시 저장 위치와 디스크 용량 지정 (디스크는 늘리기만 가능)',
        '디스크 준비 전 가용 공간을 검사하고 임의의 호스트 경로 지정은 차단',
        '중지 · 재시작과 호스트 재부팅 후에도 유지되는 rootfs 디스크',
      ],
      en: [
        'Browse mounted filesystems and free space, then register a directory as a pool',
        'Choose the storage location and disk size per MicroVM (disks can only grow)',
        'Free space is checked before the disk is prepared; arbitrary host paths are rejected',
        'Root filesystems persist across stops, restarts, and host reboots',
      ],
    },
    secondary: null,
  },
  {
    id: 'm2image',
    label: 'M2Image & MicroRegistry',
    badge: { ko: 'IMAGES', en: 'IMAGES' },
    title: { ko: '검증된 OS 이미지와 OCI 컨테이너 가져오기', en: 'Verified OS images and OCI imports' },
    description: {
      ko: 'M2Image는 커널과 rootfs(선택적으로 initramfs)를 담은 Firecracker용 템플릿이며, 설치된 이미지가 있어야 MicroVM을 만들 수 있습니다. MicroRegistry 카탈로그(Alpine, Ubuntu, Rocky)에서 내려받거나, Docker Hub 같은 OCI 컨테이너 이미지를 부팅 가능한 rootfs로 가져오거나, 직접 만든 로컬 이미지를 등록할 수 있습니다. 임시 빌더 VM으로 배포판을 부트스트랩하는 MicroBoot는 현재 API로만 제공됩니다.',
      en: 'An M2Image is a Firecracker template with a kernel and root filesystem (optionally an initramfs), and only installed images can create MicroVMs. Install from the MicroRegistry catalog (Alpine, Ubuntu, Rocky), import an OCI container image such as one from Docker Hub into a bootable rootfs, or register your own local image. MicroBoot, which bootstraps a distribution in a temporary builder VM, is currently API-only.',
    },
    image: '/dashboard-images.png',
    alt: { ko: 'FireCrab M2Image 목록과 설치 상태', en: 'FireCrab M2Image list and installation state' },
    icon: '/m2image-icon.png',
    details: {
      ko: [
        'MicroRegistry 패키지를 다이제스트 검증 후 설치 (호스트 아키텍처에 맞춰 선택)',
        'OCI 참조를 inspect한 뒤 백그라운드 작업으로 가져오고 SPDX SBOM 생성',
        '이미지의 네이티브 init을 보존하고, 지원하지 않을 때만 BusyBox로 폴백',
        '다이제스트로 고정된 커널을 따로 설치하고 이미지에 연결 (Kernels)',
      ],
      en: [
        'Install MicroRegistry packages after digest verification, matched to the host architecture',
        'Inspect an OCI reference, then import it as a background job with an SPDX SBOM',
        'Keeps the image’s native init and falls back to BusyBox only when none is supported',
        'Install digest-pinned kernels separately and pair them with an image (Kernels)',
      ],
    },
    secondary: null,
  },
];

export const featureHighlights = [
  {
    id: 'sub-second-boot',
    iconName: 'Zap',
    badge: '≤ 125ms',
    title: { ko: '밀리초 단위 초고속 부팅', en: 'Millisecond-class Boot' },
    description: {
      ko: 'Firecracker 사양 기준으로 최소 커널과 rootfs의 microVM은 시작 후 125ms 이내에 게스트 init에 도달합니다. FireCrab은 게스트가 네트워크 준비 완료를 알릴 때 running으로 표시하고, 단계별 시작 시간을 타임라인으로 보여줍니다.',
      en: 'By Firecracker’s published spec, a minimal-kernel microVM reaches guest init within 125 ms. FireCrab marks a VM running once the guest reports its network ready, and shows each startup step’s timing on a timeline.',
    },
  },
  {
    id: 'kernel-isolation',
    iconName: 'ShieldCheck',
    badge: 'KVM Level',
    title: { ko: '전용 커널 기반 하드웨어 격리', en: 'Hardware-Level Isolation' },
    description: {
      ko: '호스트 커널을 공유하는 컨테이너와 달리 MicroVM마다 독립된 Linux 커널과 KVM 하드웨어 가상화 경계를 가집니다. API는 비특권으로 실행되고, 권한이 필요한 네트워크 작업만 제한된 capability의 net-helper에 위임합니다.',
      en: 'Unlike containers that share the host kernel, every MicroVM runs its own Linux kernel behind a KVM boundary. The API runs unprivileged and delegates only privileged networking to a net-helper with bounded capabilities.',
    },
  },
  {
    id: 'micronetwork',
    iconName: 'Network',
    badge: 'Isolated',
    title: { ko: '선언적 격리 네트워크', en: 'Declarative MicroNetworks' },
    description: {
      ko: 'Bridge, DHCP, NAT 인터넷 정책, 포트 포워딩, 선택형 IPv6를 대시보드에서 몇 번의 클릭으로 구성합니다. 서로 다른 네트워크는 기본적으로 격리되고, VM의 출발지 MAC · IP는 anti-spoofing 규칙으로 보호됩니다.',
      en: 'Set up bridges, DHCP, NAT internet policy, port forwarding, and optional IPv6 in a few clicks. Separate networks are isolated by default, and per-VM anti-spoofing rules protect each VM’s source MAC and IP.',
    },
  },
  {
    id: 'microstorage',
    iconName: 'HardDrive',
    badge: 'Persistent',
    title: { ko: '호스트 스토리지 풀링', en: 'Flexible Host Storage Pooling' },
    description: {
      ko: '호스트에 이미 마운트된 디렉터리(NVMe, SSD 등)를 스토리지 풀로 등록하고 MicroVM마다 저장 위치를 지정합니다. 등록된 루트만 사용할 수 있어 VM 요청이 임의의 호스트 경로를 가리킬 수 없습니다.',
      en: 'Register already-mounted host directories (NVMe, SSDs) as storage pools and pick a location per MicroVM. Only registered roots are usable, so a VM request can never point at an arbitrary host path.',
    },
  },
  {
    id: 'oci-import',
    iconName: 'Box',
    badge: 'OCI Ready',
    title: { ko: 'OCI 컨테이너 이미지 가져오기', en: 'OCI Container Image Import' },
    description: {
      ko: 'Alpine, Ubuntu, Rocky 카탈로그 이미지뿐 아니라 Docker Hub 등의 OCI 컨테이너를 microVM rootfs로 변환합니다. 레이어 안전성 검사 후 병합하고 SPDX SBOM을 만들며, 이미지의 네이티브 init을 보존합니다.',
      en: 'Beyond curated Alpine, Ubuntu, and Rocky images, convert OCI container images (e.g., Docker Hub) into microVM root filesystems. Layers are safety-checked and merged, an SPDX SBOM is generated, and the native init is preserved.',
    },
  },
  {
    id: 'dashboard-cli-api',
    iconName: 'Terminal',
    badge: 'Web · CLI · API',
    title: { ko: '대시보드 · CLI · REST API', en: 'Dashboard, CLI & REST API' },
    description: {
      ko: '브라우저 시리얼 콘솔과 SSH 패널이 있는 웹 대시보드, 원격 호스트 프로필을 지원하는 firecrab CLI, REST · WebSocket API가 같은 리소스를 같은 검증으로 다룹니다.',
      en: 'A web dashboard with a serial console and SSH panel, a firecrab CLI with saved host profiles, and REST/WebSocket APIs all drive the same resources with the same validation.',
    },
  },
  {
    id: 'cross-platform',
    iconName: 'Monitor',
    badge: 'microManager',
    title: { ko: 'Linux · macOS · Windows', en: 'Linux, macOS & Windows' },
    description: {
      ko: 'Linux는 install.sh 한 번이면 됩니다. macOS(Apple silicon)와 Windows(Preview)에서는 firecrab service install이 관리용 Debian VM을 만들어 같은 FireCrab을 실행하고, 똑같이 localhost:5523 대시보드를 엽니다.',
      en: 'On Linux, one install.sh is enough. On macOS (Apple silicon) and Windows (Preview), firecrab service install creates a managed Debian VM that runs the same FireCrab and opens the same localhost:5523 dashboard.',
    },
  },
  {
    id: 'metrics-ssh',
    iconName: 'Activity',
    badge: 'Metrics · SSH',
    title: { ko: '게스트 사용량과 키 기반 SSH', en: 'Guest Metrics & Managed SSH' },
    description: {
      ko: 'Metrics Agent가 게스트 CPU · 메모리를 시리얼로 보고해 목록 · 상세 · 터미널에 스파크라인으로 보여줍니다. VM마다 ed25519 운영 키를 발급해 key-only SSH(프록시 점프, 포트 포워딩)를 지원합니다.',
      en: 'A Metrics Agent reports guest CPU and memory over serial and the dashboard charts them as sparklines. Each VM gets its own ed25519 operator key for key-only SSH, including proxy jump and port forwarding.',
    },
  },
  {
    id: 'host-ops',
    iconName: 'Wrench',
    badge: 'doctor · update',
    title: { ko: '호스트 점검과 안전한 업데이트', en: 'Host Checks & Safe Updates' },
    description: {
      ko: 'firecrab doctor가 KVM, nftables, dnsmasq, helper 소켓 등 13가지를 점검하고, firecrab update --apply는 SHA-256을 검증한 뒤 net-helper가 바이너리를 교체하고 두 서비스를 재시작합니다.',
      en: 'firecrab doctor runs 13 host checks covering KVM, nftables, dnsmasq, and the helper socket. firecrab update --apply verifies SHA-256, then the net-helper swaps the binaries and restarts both services.',
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
    firecrab: { ko: '밀리초 단위 (Firecracker 사양 ≤ 125ms)', en: 'Millisecond-class (Firecracker spec ≤ 125 ms)' },
    highlight: true,
  },
  {
    dimension: { ko: '메모리 오버헤드', en: 'Memory Footprint' },
    docker: { ko: '최소 (~수 MB)', en: 'Minimal (~few MB)' },
    traditionalVm: { ko: '큼 (수백 MB ~ 수 GB per VM)', en: 'Heavy (hundreds of MB ~ GBs per VM)' },
    firecrab: { ko: '초경량 (VMM 오버헤드 ≤ 5 MiB per microVM)', en: 'Ultra-light (VMM overhead ≤ 5 MiB per microVM)' },
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
    dimension: { ko: '관리 인터페이스', en: 'Management' },
    docker: { ko: 'Docker CLI · Engine API', en: 'Docker CLI & Engine API' },
    traditionalVm: { ko: '벤더 콘솔, libvirt 등 별도 도구', en: 'Vendor consoles, libvirt & separate tooling' },
    firecrab: { ko: '웹 대시보드 + firecrab CLI + REST/WebSocket API', en: 'Web dashboard + firecrab CLI + REST/WebSocket API' },
    highlight: true,
  },
  {
    dimension: { ko: '운영 환경', en: 'Deployment' },
    docker: { ko: 'Docker Engine 데몬', en: 'Docker Engine daemon' },
    traditionalVm: { ko: '무거운 하이퍼바이저 (Proxmox/ESXi)', en: 'Heavy hypervisors (Proxmox/ESXi)' },
    firecrab: {
      ko: 'Linux 호스트 한 대에 원클릭 설치, macOS · Windows는 microManager 관리 VM',
      en: 'One-line install on a single Linux host; macOS & Windows via a microManager VM',
    },
    highlight: true,
  },
];

export const workflow = [
  {
    number: '01',
    title: { ko: 'MicroNetwork 정의', en: 'Define MicroNetwork' },
    description: {
      ko: '서브넷 CIDR과 인터넷(NAT) 정책을 정합니다. 숨겨진 기본 네트워크 없이 명시적으로 관리됩니다.',
      en: 'Set the subnet CIDR and internet (NAT) policy. Every network is explicit with zero hidden surprises.',
    },
  },
  {
    number: '02',
    title: { ko: '이미지와 하드웨어 사양 선택', en: 'Pick Image & Specs' },
    description: {
      ko: '설치된 M2Image(또는 가져온 OCI 이미지), vCPU, RAM, 디스크와 저장 위치를 골라 MicroVM을 만듭니다.',
      en: 'Choose an installed M2Image (or imported OCI image), vCPU count, memory, disk, and storage location for your MicroVM.',
    },
  },
  {
    number: '03',
    title: { ko: '원클릭 시작 및 터미널 연결', en: 'Start & Connect' },
    description: {
      ko: '시작하면 Firecracker가 게스트를 부팅하고, 게스트가 네트워크 준비 완료를 알리면 running이 됩니다. 이어서 브라우저 Terminal이나 SSH로 접속합니다.',
      en: 'Start it and Firecracker boots the guest. Once the guest reports its network ready the VM is running, and you connect from the browser Terminal or over SSH.',
    },
  },
];

/** MicroVM 시작 흐름 (public-docs/architecture.md "VM start flow"를 6단계로 압축) */
export const architectureFlow = [
  { number: '01', title: { ko: '요청', en: 'Request' }, description: { ko: '대시보드 · CLI · REST → API', en: 'Dashboard, CLI, REST → API' } },
  { number: '02', title: { ko: '디스크 준비', en: 'Disk' }, description: { ko: 'M2Image → VM 전용 rootfs', en: 'M2Image → per-VM rootfs' } },
  { number: '03', title: { ko: '네트워크 구성', en: 'Network' }, description: { ko: 'net-helper: Bridge · TAP · DHCP', en: 'net-helper: bridge, TAP, DHCP' } },
  { number: '04', title: { ko: 'Firecracker 기동', en: 'Firecracker' }, description: { ko: 'VM당 프로세스 1개, KVM 부팅', en: 'One process per VM, KVM boot' } },
  { number: '05', title: { ko: '준비 확인', en: 'Ready' }, description: { ko: '게스트가 NETWORK_READY 신호 전송', en: 'Guest sends NETWORK_READY' } },
  { number: '06', title: { ko: 'running', en: 'Running' }, description: { ko: 'Terminal · SSH · 사용량 확인', en: 'Terminal, SSH, and usage' } },
];

export interface ArchitectureView {
  id: string;
  label: { ko: string; en: string };
  image: { ko: string; en: string };
  alt: { ko: string; en: string };
  /** 한글판 SVG가 없어 영문 라벨 그대로 보여주는 도식 */
  englishOnly?: boolean;
  steps?: { ko: string[]; en: string[] };
  note?: { ko: string; en: string };
}

/** 도식은 ~/firecrab/assets/architecture 의 SVG를 public/architecture 로 복사해 사용한다. */
export const architectureViews: ArchitectureView[] = [
  {
    id: 'glance',
    label: { ko: '한눈에 보기', en: 'At a glance' },
    image: {
      ko: '/architecture/firecrab-at-a-glance.ko.svg',
      en: '/architecture/firecrab-at-a-glance.en.svg',
    },
    alt: {
      ko: 'FireCrab 한눈에 보기: 브라우저와 CLI 요청이 FireCrab을 거쳐 MicroVM마다 Firecracker 프로세스 하나로 실행되는 흐름',
      en: 'FireCrab at a glance: browser and CLI requests flow through FireCrab into one Firecracker process per MicroVM',
    },
    steps: {
      ko: [
        '브라우저나 CLI로 요청합니다. M2Image, MicroNetwork, MicroStorage를 골라 MicroVM을 만듭니다.',
        'FireCrab이 M2Image를 확인하고 MicroNetwork를 준비한 뒤, MicroStorage에 VM 전용 디스크를 만듭니다.',
        'MicroVM마다 Firecracker 프로세스를 하나씩 띄웁니다. 각자 자기 커널로 부팅합니다.',
        '게스트가 네트워크 준비 완료를 알리면 MicroVM이 실행 중(running)이 됩니다.',
      ],
      en: [
        'Ask from the browser or the CLI. Pick an M2Image, a MicroNetwork, and a MicroStorage to create a MicroVM.',
        'FireCrab verifies the M2Image, prepares the MicroNetwork, and creates the VM’s own disk in the MicroStorage.',
        'It starts one Firecracker process per MicroVM, so each one boots its own kernel.',
        'When the guest reports that its network is ready, the MicroVM is running.',
      ],
    },
  },
  {
    id: 'platforms',
    label: { ko: '어디서든 실행', en: 'Runs anywhere' },
    image: {
      ko: '/architecture/firecrab-runs-anywhere.ko.svg',
      en: '/architecture/firecrab-runs-anywhere.en.svg',
    },
    alt: {
      ko: 'Linux는 직접, macOS와 Windows는 microManager의 관리용 Debian VM을 거쳐 같은 localhost:5523 대시보드로 열리는 구성',
      en: 'Linux runs directly, while macOS and Windows go through a microManager Debian VM to the same localhost:5523 dashboard',
    },
    note: {
      ko: 'Linux는 install.sh 한 번이면 됩니다. macOS와 Windows에서는 firecrab service install이 관리용 Debian VM을 만들어 같은 FireCrab을 실행하고, 똑같이 localhost:5523 대시보드로 열립니다. macOS는 Apple silicon M3 이상이 필요하며 Apple M5에서 검증했습니다. Windows는 WSL2에서 아직 microVM을 시작하지 못해 Preview로 표시했습니다.',
      en: 'On Linux, one install.sh is enough. On macOS and Windows, firecrab service install creates a managed Debian VM that runs the same FireCrab, and you open the same dashboard at localhost:5523. macOS needs Apple silicon M3 or later and is validated on an Apple M5. Windows is marked Preview because microVMs cannot start on WSL2 yet.',
    },
  },
  {
    id: 'system',
    label: { ko: '시스템 구성', en: 'System' },
    image: {
      ko: '/architecture/firecrab-system.en.svg',
      en: '/architecture/firecrab-system.en.svg',
    },
    alt: {
      ko: 'firecrab-api, net-helper, Firecracker, SQLite와 호스트 네트워크로 이루어진 FireCrab 시스템 구성도',
      en: 'FireCrab system components: firecrab-api, net-helper, Firecracker, SQLite, and host networking',
    },
    englishOnly: true,
    note: {
      ko: 'API가 리소스 상태와 VM 프로세스를 소유하고, 권한이 필요한 호스트 네트워킹은 Unix 소켓을 통해 net-helper에 위임합니다. 설치된 API는 빌드된 대시보드도 함께 제공하며, 상태는 SQLite와 파일시스템에 저장됩니다.',
      en: 'The API owns resource state and VM processes; privileged host networking is delegated to the net-helper over a Unix socket. The installed API also serves the built dashboard, and state lives in SQLite and the filesystem.',
    },
  },
  {
    id: 'images',
    label: { ko: '이미지 · 커널 공급', en: 'Image & kernel supply' },
    image: {
      ko: '/architecture/image-kernel-supply.en.svg',
      en: '/architecture/image-kernel-supply.en.svg',
    },
    alt: {
      ko: '카탈로그 설치, OCI 가져오기, MicroBoot 부트스트랩이 M2Image로 모이고 커널이 별도로 연결되는 이미지·커널 공급 흐름',
      en: 'Image and kernel supply: catalog install, OCI import, and MicroBoot bootstrap converge on M2Image while kernels pair separately',
    },
    englishOnly: true,
    note: {
      ko: '카탈로그 설치, OCI 가져오기, MicroBoot 부트스트랩(API 전용) 세 경로가 하나의 등록된 템플릿으로 모이고, 커널은 따로 설치해 이미지에 연결합니다. 설치된 M2Image만 MicroVM을 만들 수 있습니다.',
      en: 'Catalog install, OCI import, and MicroBoot bootstrap (API-only) converge on one registered template, while kernels are installed and paired separately. Only installed M2Images can create MicroVMs.',
    },
  },
];

export type InstallLine =
  | { kind: 'comment'; text: { ko: string; en: string } }
  | { kind: 'cmd'; text: string; prompt?: string }
  | { kind: 'url'; text: string }
  | { kind: 'blank' };

export interface InstallTab {
  id: string;
  label: { ko: string; en: string };
  lines: InstallLine[];
  /** 복사 버튼이 복사할 내용. 없으면 표시된 명령을 모두 이어 붙인다. */
  copy?: string;
}

const dashboardUrl = 'http://127.0.0.1:5523/';
const releaseDownloadUrl = `${repositoryUrl}/releases/latest/download`;

export const installTabs: InstallTab[] = [
  {
    id: 'linux',
    label: { ko: 'Linux', en: 'Linux' },
    lines: [
      { kind: 'comment', text: { ko: '일반 사용자 계정으로 실행 (sudo를 붙이지 마세요)', en: 'Run as regular user (do NOT prefix with sudo)' } },
      { kind: 'comment', text: { ko: '필요한 패키지 및 systemd 등록 시에만 sudo 암호를 요청합니다', en: 'The script calls sudo only when privilege is needed' } },
      { kind: 'cmd', text: installCommand },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '설치 완료 후 웹 브라우저에서 대시보드 열기:', en: 'Open dashboard after services start:' } },
      { kind: 'url', text: dashboardUrl },
    ],
  },
  {
    id: 'macos',
    label: { ko: 'macOS', en: 'macOS' },
    lines: [
      { kind: 'comment', text: { ko: 'Apple silicon · macOS 15+ · 중첩 가상화 필요 (M3 이상, 전체 검증은 M5)', en: 'Apple silicon, macOS 15+, nested virtualization (M3 or later; fully validated on M5)' } },
      { kind: 'comment', text: { ko: '1) 설치기 체크섬을 확인하고 CLI와 helper 설치', en: '1) Verify the installer checksum, then install the CLI and helper' } },
      { kind: 'cmd', text: `curl -fLO ${releaseDownloadUrl}/install-cli.sh` },
      { kind: 'cmd', text: `curl -fLO ${releaseDownloadUrl}/SHA256SUMS` },
      { kind: 'cmd', text: "grep ' install-cli.sh$' SHA256SUMS > install-cli.sh.sha256" },
      { kind: 'cmd', text: 'shasum -a 256 -c install-cli.sh.sha256 && sh install-cli.sh' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '2) 호스트 지원 여부를 확인하고 관리용 Debian VM 설치', en: '2) Check host capability, then provision the managed Debian VM' } },
      { kind: 'cmd', text: 'firecrab service doctor' },
      { kind: 'cmd', text: 'firecrab service install' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '설치가 끝나면 대시보드 열기:', en: 'Open dashboard once the service is healthy:' } },
      { kind: 'url', text: dashboardUrl },
    ],
  },
  {
    id: 'windows',
    label: { ko: 'Windows', en: 'Windows' },
    lines: [
      { kind: 'comment', text: { ko: 'x86_64 · ARM64 · Microsoft Store WSL2 · 중첩 KVM 필요 (Preview)', en: 'x86_64 or ARM64, Microsoft Store WSL2, nested KVM (Preview)' } },
      { kind: 'comment', text: { ko: '1) 일반 PowerShell에서 설치기를 내려받고 체크섬 확인', en: '1) In regular PowerShell, download and verify the CLI installer' } },
      { kind: 'cmd', prompt: 'PS> ', text: `Invoke-WebRequest ${releaseDownloadUrl}/install-cli.ps1 -OutFile install-cli.ps1` },
      { kind: 'cmd', prompt: 'PS> ', text: `Invoke-WebRequest ${releaseDownloadUrl}/SHA256SUMS -OutFile SHA256SUMS` },
      { kind: 'cmd', prompt: 'PS> ', text: "$expected = ((Get-Content SHA256SUMS | Where-Object { $_ -match ' install-cli\\.ps1$' }) -split '\\s+')[0]" },
      { kind: 'cmd', prompt: 'PS> ', text: "if ((Get-FileHash install-cli.ps1 -Algorithm SHA256).Hash -ne $expected) { throw 'installer checksum mismatch' }" },
      { kind: 'cmd', prompt: 'PS> ', text: '& ./install-cli.ps1' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '2) 새 PowerShell에서 지원 여부 확인과 설치', en: '2) In a new PowerShell session, check and install' } },
      { kind: 'cmd', prompt: 'PS> ', text: 'firecrab service doctor' },
      { kind: 'cmd', prompt: 'PS> ', text: 'firecrab service install' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: 'Preview: 고정된 v0.2.2 게스트는 WSL2에서 아직 MicroVM을 시작하지 못합니다', en: 'Preview: the pinned v0.2.2 guest cannot start MicroVMs on stock WSL2 yet' } },
      { kind: 'comment', text: { ko: '(API · 이미지 · 네트워크는 동작하고, CLI로 원격 Linux 호스트는 관리할 수 있습니다)', en: '(API, images, and networks work, and the CLI can still manage a remote Linux host)' } },
    ],
  },
  {
    id: 'options',
    label: { ko: '점검 · 제거', en: 'Check & Remove' },
    copy: './install.sh --check',
    lines: [
      { kind: 'comment', text: { ko: '사전 요구사항 및 설치 계획 점검 (Read-only)', en: 'Report prerequisites and planned changes (read-only)' } },
      { kind: 'cmd', text: './install.sh --check' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: 'KVM, 방화벽, 소켓 및 호스트 설정 진단', en: 'Diagnose KVM, firewall, socket, and host setup' } },
      { kind: 'cmd', text: './install.sh --doctor' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: 'libc 자동 감지 대신 수동 지정 (예: musl)', en: 'Pick a libc instead of autodetecting (e.g. musl)' } },
      { kind: 'cmd', text: './install.sh --libc musl' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '설치된 호스트: 점검과 새 릴리즈 확인 (Linux)', en: 'Installed host: run checks and look for a new release (Linux)' } },
      { kind: 'cmd', text: 'firecrab doctor' },
      { kind: 'cmd', text: 'firecrab update --check' },
      { kind: 'blank' },
      { kind: 'comment', text: { ko: '제거 (데이터 보존 / 완전 삭제)', en: 'Uninstall (retain data / purge all)' } },
      { kind: 'cmd', text: './install.sh --uninstall' },
      { kind: 'cmd', text: './install.sh --uninstall --purge' },
    ],
  },
  {
    id: 'git',
    label: { ko: '소스 빌드', en: 'From source' },
    copy: gitCloneCommand,
    lines: [
      { kind: 'comment', text: { ko: '저장소 체크아웃 후 공식 준비 스크립트로 로컬 빌드', en: 'Clone repository and build payload with repository script' } },
      { kind: 'cmd', text: `git clone ${repositoryUrl}.git` },
      { kind: 'cmd', text: 'cd firecrab' },
      { kind: 'cmd', text: './scripts/ci-prepare-install-payload.sh' },
      { kind: 'cmd', text: './install.sh --bin-dir target/release' },
    ],
  },
];

/** 복사 버튼용: 탭에 표시된 명령(프롬프트 제외)을 줄바꿈으로 잇는다. */
export const installTabCopyText = (tab: InstallTab): string =>
  tab.copy ??
  tab.lines
    .flatMap((line) => (line.kind === 'cmd' ? [line.text] : []))
    .join('\n');
