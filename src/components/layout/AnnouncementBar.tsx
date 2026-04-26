'use client';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function AnnouncementBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 30, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out', delay: 3.2 }
    );
  }, { scope: ref });

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: 20,
      opacity: 0,
      scale: 0.94,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => setDismissed(true),
    });
  };

  if (dismissed) return null;

  return (
    <div
      ref={ref}
      className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 max-w-[calc(100vw-2rem)] md:max-w-md"
      style={{ opacity: 0 }}
      role="status"
    >
      <div className="group relative flex items-center gap-3 bg-[var(--color-text-dark)] text-white pl-4 pr-3 py-2.5 rounded-full shadow-lg shadow-black/10 border border-white/5 backdrop-blur-sm">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-60 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 hidden sm:inline">
          Just Launched
        </span>
        <span aria-hidden="true" className="hidden sm:inline text-white/20">·</span>
        <a
          href="#products"
          className="text-[12px] sm:text-[13px] text-white/95 hover:text-white truncate"
          onClick={dismiss}
        >
          <span className="sm:hidden">ArmorClaw launched</span>
          <span className="hidden sm:inline">ArmorClaw — Intent Assurance for OpenClaw</span>
        </a>
        <button
          onClick={dismiss}
          className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Dismiss announcement"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
