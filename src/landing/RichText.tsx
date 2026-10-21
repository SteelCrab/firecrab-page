import type { ReactNode } from 'react';
import { ExternalLink } from './ExternalLink';
import { repositoryUrl } from './landingData';

/**
 * Renders the small markdown subset used by the README-derived copy:
 * `code`, **bold**, and [label](link). Relative links point into the firecrab repository.
 */
const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;

const resolveHref = (href: string): string =>
  /^(https?:)?\/\//.test(href) ? href : `${repositoryUrl}/blob/main/${href}`;

export function RichText({ text }: { text: string }): ReactNode {
  return (
    <>
      {text
        .split(inlinePattern)
        .filter(Boolean)
        .map((part, index) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={index}>{part.slice(1, -1)}</code>;
          }
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
          }
          const link = linkPattern.exec(part);
          if (link) {
            return (
              <ExternalLink key={index} href={resolveHref(link[2])}>
                {link[1]}
              </ExternalLink>
            );
          }
          return part;
        })}
    </>
  );
}
