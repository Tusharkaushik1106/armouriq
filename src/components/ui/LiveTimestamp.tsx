'use client';
import { useEffect, useState } from 'react';

function formatUTC(d: Date) {
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function LiveTimestamp({ className = '' }: { className?: string }) {
  const [t, setT] = useState<string>('--:--:--');

  useEffect(() => {
    setT(formatUTC(new Date()));
    const id = window.setInterval(() => setT(formatUTC(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`font-mono text-[10px] tracking-[0.12em] text-[var(--color-text-light)] tabular-nums ${className}`}>
      [{t} UTC]
    </span>
  );
}
