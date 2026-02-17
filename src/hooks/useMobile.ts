import { useSyncExternalStore } from 'react';

const query = '(max-height: 600px)';
const mql = typeof window !== 'undefined' ? window.matchMedia(query) : null;

function subscribe(cb: () => void) {
  mql?.addEventListener('change', cb);
  return () => mql?.removeEventListener('change', cb);
}

function getSnapshot() {
  return mql?.matches ?? false;
}

export function useMobile(): { compact: boolean } {
  const compact = useSyncExternalStore(subscribe, getSnapshot);
  return { compact };
}
