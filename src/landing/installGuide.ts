import type { LocalizedText } from './i18n';
import type { Shell } from './CodeBlock';
import { repositoryUrl } from './landingData';

/**
 * Install / Run / Run-from-source guide.
 *
 * Text and commands are the ones in ~/firecrab README.md (Korean: README.ko.md), grouped per
 * platform. The English sentence is also the translation key for ja / zh / id / es, so keep it
 * identical to the README when it changes there.
 */
export type PlatformId = 'linux' | 'macos' | 'windows';

export type GuideBlock =
  | { kind: 'text'; text: LocalizedText }
  | { kind: 'note'; text: LocalizedText }
  | { kind: 'code'; shell: Shell; code: string };

export interface PlatformGuide {
  id: PlatformId;
  name: string;
  caption: string;
  preview: boolean;
  install: GuideBlock[];
  run: GuideBlock[];
  source: GuideBlock[];
}

const releaseDownload = `${repositoryUrl}/releases/latest/download`;

const lines = (...rows: string[]): string => rows.join('\n');
const text = (ko: string, en: string): GuideBlock => ({ kind: 'text', text: { ko, en } });
const note = (ko: string, en: string): GuideBlock => ({ kind: 'note', text: { ko, en } });
const sh = (code: string): GuideBlock => ({ kind: 'code', shell: 'sh', code });
const powershell = (code: string): GuideBlock => ({ kind: 'code', shell: 'powershell', code });

const verifiedCliInstall = sh(
  lines(
    `curl -fLO ${releaseDownload}/install-cli.sh`,
    `curl -fLO ${releaseDownload}/SHA256SUMS`,
    "grep ' install-cli.sh$' SHA256SUMS > install-cli.sh.sha256",
    'if command -v sha256sum >/dev/null; then',
    '  sha256sum -c install-cli.sh.sha256',
    'else',
    '  shasum -a 256 -c install-cli.sh.sha256',
    'fi && sh install-cli.sh',
  ),
);

const serviceDoctorInstall = lines('firecrab service doctor', 'firecrab service install');

const serviceLifecycle = lines(
  'firecrab service start',
  'firecrab service status',
  'firecrab service debug --logs --tail 100',
  'firecrab service stop',
);

const windowsLimitation = note(
  '**Windows 제약:** 현재 고정된 v0.2.2 게스트는 기본 WSL2에서 API·이미지·네트워크는 지원하지만 MicroVM을 시작하지 못합니다. net-helper 수정이 반영된 새 게스트 릴리스가 필요하며, 로컬 nginx VM 실행도 영향을 받습니다. Windows CLI로 지원되는 원격 Linux 호스트를 관리할 수는 있습니다.',
  '**Windows limitation:** the currently pinned v0.2.2 guest supports the API, images, and networks, but cannot start MicroVMs on stock WSL2. The net-helper fix needs a newer pinned guest release; local nginx VM execution is affected too. The Windows CLI can still manage a supported remote Linux host.',
);

const healthyDashboard = text(
  '정상 상태이면 `http://127.0.0.1:5523/`을 여세요. MicroNetwork를 만들고 설치된 이미지를 선택해 VM을 생성·시작한 뒤, `running` 상태에서 터미널을 엽니다. 원격 호스트는 [CLI 호스트 프로필](public-docs/firecrab-cli.md#host-profiles)을 설정하세요.',
  'When healthy, open `http://127.0.0.1:5523/`. Create a MicroNetwork, choose an installed image, create and start a VM, then open Terminal after `running`. For a remote host, configure a [CLI host profile](public-docs/firecrab-cli.md#host-profiles).',
);

const sourceRequirements = text(
  '저장소 루트에서 지정된 [Rust 도구 체인](rust-toolchain.toml), Node.js 22 이상, npm을 사용하세요. 실제 VM 실행에는 Linux KVM과 [호스트 준비 조건](public-docs/installation.md)이 필요합니다.',
  'From the repository root, use the pinned [Rust toolchain](rust-toolchain.toml), Node.js 22+, and npm. Full VM execution also needs Linux KVM and the [host prerequisites](public-docs/installation.md).',
);

const sourceCheckoutCaveat = text(
  'macOS·Windows의 위 명령은 소스에서 빌드한 CLI/helper와 설치된 게스트 API를 실행합니다. Debian 안에서 수정한 `firecrab-api` 소스를 **다시 빌드하지 않습니다**. 전체 API/net-helper 런타임 개발은 Linux에서 진행하고, 관리 서비스 개발은 위 플랫폼별 가이드를 참고하세요.',
  'On macOS and Windows, these commands run the checkout CLI/helper with the installed guest API. They do **not** rebuild edited `firecrab-api` source inside Debian. Develop the full API/net-helper runtime on Linux; see the platform guides above for managed-service development.',
);

export const platformGuides: PlatformGuide[] = [
  {
    id: 'linux',
    name: 'Linux',
    caption: 'install.sh · systemd',
    preview: false,
    install: [
      text(
        'Linux x86_64 또는 ARM64, 사용 가능한 `/dev/kvm`, 네트워크, `sudo` 권한이 있는 일반 사용자 계정이 필요합니다. **앞에 `sudo`를 붙이지 않고** 그 사용자로 설치기를 실행하세요. KVM이 없다면 하드웨어 가상화 또는 중첩 가상화를 먼저 활성화하세요.',
        'Requires Linux x86_64 or ARM64, usable `/dev/kvm`, network access, and a regular user with `sudo`. Run the installer as that user, **without a `sudo` prefix**. Enable hardware or nested virtualization first if KVM is unavailable.',
      ),
      sh(`curl -fsSL ${releaseDownload}/install.sh | bash`),
      text(
        '진단·제거 옵션은 [설치 가이드](public-docs/installation.md)에 있습니다. Linux에서 원격 CLI만 설치하려면 아래의 체크섬 검증을 포함한 `install-cli.sh` 절차를 사용하세요. GNU/musl을 자동 선택하며 기본 경로는 `~/.local/bin`입니다.',
        'Installer diagnostics and uninstall options are in the [installation guide](public-docs/installation.md). To install only the remote CLI on Linux, use the verified `install-cli.sh` procedure below; it selects GNU or musl and installs to `~/.local/bin`.',
      ),
      verifiedCliInstall,
    ],
    run: [
      text(
        '설치기는 두 systemd 서비스를 시작합니다. 이후 시작·상태 확인·중지는 다음 명령을 사용하세요.',
        'The installer starts both systemd services. To start, inspect, or stop them later:',
      ),
      sh(
        lines(
          'sudo systemctl start firecrab-net-helper firecrab-api',
          'systemctl status firecrab-net-helper firecrab-api',
          'sudo systemctl stop firecrab-api firecrab-net-helper',
        ),
      ),
      healthyDashboard,
    ],
    source: [
      sourceRequirements,
      text(
        '터미널 세 개를 사용합니다. helper는 특권으로, API는 일반 사용자로 실행합니다. 로컬 데이터 경로는 저장소 루트를 기준으로 합니다.',
        'Use three terminals. The helper runs privileged; the API runs as your regular user. Local data paths are relative to the repository root.',
      ),
      sh(
        lines(
          '# 1',
          'cargo build -p firecrab-net-helper --locked',
          'sudo -u root -g "$(id -gn)" FIRECRAB_NET_HELPER_ALLOWED_UID="$(id -u)" \\',
          '  ./target/debug/firecrab-net-helper',
          '',
          '# 2',
          'cargo run -p firecrab-api --locked',
          '',
          '# 3',
          'npm ci --prefix firecrab-frontend',
          'npm run dev --prefix firecrab-frontend',
          '# http://localhost:8080/',
        ),
      ),
      text(
        '빌드한 대시보드를 API가 제공하게 하려면 개발용 API를 종료하고 다음을 실행하세요.',
        'For a build served by the API, stop the development API and run:',
      ),
      sh(
        lines(
          'npm run build --prefix firecrab-frontend',
          'FIRECRAB_STATIC_ROOT="$PWD/firecrab-frontend/dist" cargo run -p firecrab-api --locked',
          '# http://127.0.0.1:5523/',
        ),
      ),
    ],
  },
  {
    id: 'macos',
    name: 'macOS',
    caption: 'Apple silicon · launchd',
    preview: false,
    install: [
      text(
        'Apple silicon, macOS 15 이상, 중첩 가상화를 지원하는 호스트가 필요합니다(M3 이상, 전체 검증은 M5/macOS 26.6.2). 먼저 설치기 체크섬을 확인하고 CLI와 helper를 설치하세요.',
        'Requires Apple silicon, macOS 15+, and runtime support for nested virtualization (M3 or later; full validation on M5/macOS 26.6.2). First install the CLI and helper, verifying the installer checksum:',
      ),
      verifiedCliInstall,
      text(
        '이어서 호스트 지원 여부를 확인하고 Debian 관리 환경을 설치합니다.',
        'Then check host capability and provision the managed Debian environment:',
      ),
      sh(serviceDoctorInstall),
      text(
        'CLI 설치만으로는 관리 VM이 설치되지 않습니다. microManager는 `Virtualization.framework`, 별도 영속 데이터 디스크, 상주 launchd 서비스를 사용합니다. [macOS 가이드](public-docs/micromanager-macos.md)를 참고하세요.',
        'The CLI installer alone does not install the VM. microManager uses `Virtualization.framework`, a separate persistent data disk, and a resident launchd service. See [microManager on macOS](public-docs/micromanager-macos.md).',
      ),
    ],
    run: [
      text(
        'microManager가 상주 관리 VM과 localhost API 터널을 시작합니다.',
        'microManager starts the resident management VM and localhost API tunnel:',
      ),
      sh(serviceLifecycle),
      healthyDashboard,
    ],
    source: [
      sourceRequirements,
      text(
        '체크아웃의 CLI와 서명된 네이티브 helper를 빌드한 뒤 관리 서비스를 설치합니다. 이미 설치되어 있다면 `service start`를 사용하세요.',
        'Build the checkout CLI and signed native helper, then install the managed service (use `service start` if already installed):',
      ),
      sh(
        lines(
          'cargo build -p firecrab-cli --locked',
          'scripts/build-micromanager-macos.sh target/debug/firecrab-micromanager-macos',
          './target/debug/firecrab service install',
          './target/debug/firecrab service status',
        ),
      ),
      sourceCheckoutCaveat,
    ],
  },
  {
    id: 'windows',
    name: 'Windows',
    caption: 'WSL2 · Preview',
    preview: true,
    install: [
      text(
        'x86_64 또는 ARM64 Windows, Microsoft Store WSL2, 중첩 KVM이 필요합니다. 일반 PowerShell에서 CLI 설치기를 내려받고 체크섬을 확인하세요.',
        'Requires x86_64 or ARM64 Windows, Microsoft Store WSL2, and nested KVM. In a regular PowerShell session, download and verify the CLI installer:',
      ),
      powershell(
        lines(
          `Invoke-WebRequest ${releaseDownload}/install-cli.ps1 -OutFile install-cli.ps1`,
          `Invoke-WebRequest ${releaseDownload}/SHA256SUMS -OutFile SHA256SUMS`,
          String.raw`$expected = ((Get-Content SHA256SUMS | Where-Object { $_ -match ' install-cli\.ps1$' }) -split '\s+')[0]`,
          "if ((Get-FileHash install-cli.ps1 -Algorithm SHA256).Hash -ne $expected) { throw 'installer checksum mismatch' }",
          '& ./install-cli.ps1',
        ),
      ),
      text(
        '`firecrab`이 아직 `PATH`에 없다면 새 PowerShell을 연 뒤 지원 여부 확인과 설치를 실행하세요. ARM64 설치는 아직 전체 검증되지 않았습니다. [Windows 가이드](public-docs/micromanager-windows.md)를 참고하세요.',
        'Open a new PowerShell session if `firecrab` is not yet on `PATH`, then run the capability check and install. ARM64 installation has not been validated end to end. See [microManager on Windows](public-docs/micromanager-windows.md).',
      ),
      powershell(serviceDoctorInstall),
      windowsLimitation,
    ],
    run: [
      text(
        'microManager가 사용자별 예약 작업으로 WSL2 관리 배포판을 유지합니다.',
        'microManager keeps the managed WSL2 distribution running through a per-user scheduled task:',
      ),
      powershell(serviceLifecycle),
      windowsLimitation,
      healthyDashboard,
    ],
    source: [
      sourceRequirements,
      text(
        'PowerShell에서 체크아웃의 CLI를 빌드하고 관리 서비스를 설치합니다. 이미 설치되어 있다면 `service start`를 사용하세요.',
        'Build the checkout CLI in PowerShell, then install the managed service (use `service start` if already installed):',
      ),
      powershell(
        lines(
          'cargo build -p firecrab-cli --locked',
          String.raw`.\target\debug\firecrab.exe service install`,
          String.raw`.\target\debug\firecrab.exe service status`,
        ),
      ),
      sourceCheckoutCaveat,
    ],
  },
];
