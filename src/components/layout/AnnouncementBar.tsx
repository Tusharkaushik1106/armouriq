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
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 2.4 }
    );
  }, { scope: ref });

  const dismiss = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      height: 0,
      opacity: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => setDismissed(true),
    });
  };

  if (dismissed) return null;

  return (
    <div
      ref={ref}
      className="bg-[var(--color-text-dark)] text-white text-xs md:text-sm py-2.5 px-4 flex items-center justify-center gap-3 font-mono tracking-wide relative overflow-hidden"
      style={{ opacity: 0 }}
    >
      <span className="hidden sm:inline text-white/70">
        Just Launched —
      </span>
      <span className="text-white/90">
        Introducing ArmorClaw Intent Assurance for OpenClaw Agents
      </span>
      <a
        href="#products"
        className="hidden md:inline-flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
      >
        Explore ArmorClaw
        <span aria-hidden="true">→</span>
      </a>
      <button
        onClick={dismiss}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Dismiss announcement"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
