import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from './i18n/context';

export type Shell = 'sh' | 'powershell';

/**
 * Copy button with visible "Copied" feedback. The status line repeats it for screen readers,
 * because a button's own text change is not announced.
 */
export function CopyButton({ text, className, label }: { text: string; className: string; label?: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button type="button" className={`${className} ${copied ? 'is-copied' : ''}`} onClick={copy} aria-label={label}>
        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        <span>{copied ? t('복사됨', 'Copied') : t('복사', 'Copy')}</span>
      </button>
      <span className="fc-visually-hidden" role="status">
        {copied ? t('복사됨', 'Copied') : ''}
      </span>
    </>
  );
}

/** A README command block: shell label, copy button, and the commands exactly as written. */
export function CodeBlock({ code, shell }: { code: string; shell: Shell }) {
  return (
    <div className="fc-code-block">
      <div className="fc-code-block-bar">
        <span className="fc-code-shell">{shell === 'sh' ? 'sh' : 'PowerShell'}</span>
        <CopyButton text={code} className="fc-term-copy" />
      </div>
      <pre>
        <code>
          {code.split('\n').map((line, index) => (
            <span key={index}>
              {line.trimStart().startsWith('#') ? (
                <span className="fc-code-comment">{line}</span>
              ) : (
                <span className="fc-code-cmd">{line}</span>
              )}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
