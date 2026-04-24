'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const sections: { id: string; label: string; num: string }[] = [
  { id: 'hero', label: 'HERO', num: '01' },
  { id: 'problem', label: 'PROBLEM', num: '02' },
  { id: 'how-it-works', label: 'HOW IT WORKS', num: '03' },
  { id: 'products', label: 'PLATFORM', num: '04' },
  { id: 'comparison', label: 'COMPARE', num: '05' },
  { id: 'faq', label: 'FAQ', num: '06' },
  { id: 'cta', label: 'DEMO', num: '07' },
];

export function ScrollProgress() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(sections[0]);

  useGSAP(() => {
    if (!trackRef.current || !fillRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    gsap.to(fillRef.current, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
      },
    });

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setCurrent(s);
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Initial mount-only guard so it doesn't pop on SSR
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div
      className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 items-center gap-3 pointer-events-none"
      aria-hidden="true"
    >
      <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-light)] flex flex-col items-end leading-[1.3]">
        <span className="text-[var(--color-text-medium)]">{current.num}</span>
        <span>{current.label}</span>
      </div>
      <div
        ref={trackRef}
        className="relative w-[1px] h-[120px] bg-[var(--color-border-strong)]"
      >
        <div
          ref={fillRef}
          className="absolute top-0 left-0 right-0 bg-[var(--color-primary)] origin-top"
          style={{ height: '100%', transform: 'scaleY(0)' }}
        />
      </div>
    </div>
  );
}
