import type { ReactNode } from 'react';
import { useI18n } from './i18n/context';

/** A link that opens in a new tab and says so to screen readers. */
export function ExternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const { t } = useI18n();

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
      <span className="fc-visually-hidden"> ({t('새 탭에서 열림', 'opens in a new tab')})</span>
    </a>
  );
}
