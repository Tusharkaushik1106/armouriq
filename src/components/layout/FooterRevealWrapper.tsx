'use client';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

export function FooterRevealWrapper({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const footerHeight = el.offsetHeight;
      const viewportHeight = window.innerHeight;
      setBottomOffset(Math.min(0, viewportHeight - footerHeight));
    };
    update();
    // Re-measure after fonts/images settle so the reveal is correct on mobile.
    const t1 = window.setTimeout(update, 600);
    const t2 = window.setTimeout(update, 2000);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`sticky z-0 ${className ?? ''}`}
      style={{ bottom: `${bottomOffset}px` }}
    >
      {children}
    </div>
  );
}
