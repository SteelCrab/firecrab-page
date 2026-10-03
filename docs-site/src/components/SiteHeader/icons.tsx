import type {ReactNode} from 'react';

// 랜딩 헤더가 쓰는 lucide-react(ISC) 아이콘과 같은 path 다. docs-site 에 의존성을 더하지 않으려고
// 헤더에 쓰는 다섯 개만 옮겨 왔다. 아이콘을 바꾸면 랜딩(src/landing/SiteHeader.tsx)과 함께 고칠 것.
function Icon({name, size = 24, children}: {name: string; size?: number; children: ReactNode}): ReactNode {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-${name}`}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type IconProps = {size?: number};

export function GithubIcon({size}: IconProps): ReactNode {
  return (
    <Icon name="github" size={size}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </Icon>
  );
}

export function MenuIcon({size}: IconProps): ReactNode {
  return (
    <Icon name="menu" size={size}>
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </Icon>
  );
}

export function CloseIcon({size}: IconProps): ReactNode {
  return (
    <Icon name="x" size={size}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Icon>
  );
}

export function LanguagesIcon({size}: IconProps): ReactNode {
  return (
    <Icon name="languages" size={size}>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </Icon>
  );
}

export function ChevronDownIcon({size}: IconProps): ReactNode {
  return (
    <Icon name="chevron-down" size={size}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}
