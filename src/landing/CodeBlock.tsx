import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useI18n } from './i18n/context';

export type Shell = 'sh' | 'powershell';

/** A README command block: shell label, copy button, and the commands exactly as written. */
export function CodeBlock({ code, shell }: { code: string; shell: Shell }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fc-code-block">
      <div className="fc-code-block-bar">
        <span className="fc-code-shell">{shell === 'sh' ? 'sh' : 'PowerShell'}</span>
        <button type="button" className={`fc-term-copy ${copied ? 'is-copied' : ''}`} onClick={copy}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? t('복사됨', 'Copied') : t('복사', 'Copy')}</span>
        </button>
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
