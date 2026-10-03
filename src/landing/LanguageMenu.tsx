import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import siteHeader from '../shared/siteHeader.json';
import { languageInfo, languages, pick, type Language } from './i18n';

/**
 * Language dropdown of the shared site header.
 * Class names (fc-language-*) are styled in src/shared/site-header.css; the docs/blog header
 * renders the same markup with links instead of buttons.
 */
export function LanguageMenu({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const current = languageInfo(language);

  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };

    document.addEventListener('pointerdown', closeOnOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div className="fc-language-menu" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="fc-language-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${pick(siteHeader.labels.languageSelector, language)}: ${current.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Languages size={13} aria-hidden="true" />
        <span>{current.short}</span>
        <ChevronDown size={12} aria-hidden="true" />
      </button>

      {open && (
        <ul className="fc-language-list" id={listId}>
          {languages.map((entry) => (
            <li key={entry.code}>
              <button
                type="button"
                lang={entry.htmlLang}
                aria-current={entry.code === language ? 'true' : undefined}
                onClick={() => {
                  onChange(entry.code);
                  setOpen(false);
                }}
              >
                <span>{entry.label}</span>
                <span className="fc-language-code">{entry.short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
