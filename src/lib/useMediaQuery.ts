'use client';
import { useEffect, useState } from 'react';

// Returns null during SSR + first client render so the caller can decide
// whether to render nothing, render both (then swap once mounted), or
// render a sensible default. After mount it returns the current match.
export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);

  return matches;
}
