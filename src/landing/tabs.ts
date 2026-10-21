import type { KeyboardEvent } from 'react';

/**
 * Keyboard support for a WAI-ARIA tablist (automatic activation): arrow keys move to the
 * previous or next tab, Home and End to the first or last, and the focused tab is selected.
 * Only the selected tab is in the Tab order (tabIndex 0); the others get -1.
 */
export function tabKeyDown(
  event: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  select: (index: number) => void,
  tabId: (index: number) => string,
) {
  let next: number;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      next = (index + 1) % count;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      next = (index - 1 + count) % count;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = count - 1;
      break;
    default:
      return;
  }
  event.preventDefault();
  select(next);
  document.getElementById(tabId(next))?.focus();
}
