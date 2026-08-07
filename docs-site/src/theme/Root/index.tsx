import {useEffect, type ReactNode} from 'react';

export default function Root({children}: {children: ReactNode}) {
  useEffect(() => {
    const keepTitle = () => {
      if (document.title !== 'FireCrab') document.title = 'FireCrab';
    };

    keepTitle();
    const observer = new MutationObserver(keepTitle);
    observer.observe(document.head, {childList: true, subtree: true, characterData: true});
    return () => observer.disconnect();
  }, []);

  return children;
}
