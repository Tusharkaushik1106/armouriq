'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function PageCurtain() {
  const curtain = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!curtain.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.to(curtain.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          if (curtain.current) curtain.current.style.display = 'none';
        },
      });
      return;
    }
    const tl = gsap.timeline();
    tl.to('.curtain-letter', {
      y: 0,
      stagger: 0.04,
      duration: 0.6,
      ease: 'power3.out',
    })
      .to('.curtain-letter', {
        y: '-110%',
        stagger: 0.03,
        duration: 0.5,
        ease: 'power3.in',
        delay: 0.25,
      })
      .to(curtain.current,
        { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
        '-=0.2'
      )
      .set(curtain.current, { display: 'none' });
  }, { scope: curtain });

  const letters = 'ARMORIQ'.split('');

  return (
    <div
      ref={curtain}
      className="fixed inset-0 z-[100] bg-[var(--color-text-dark)] flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="flex overflow-hidden">
        {letters.map((l, i) => (
          <span
            key={i}
            className="curtain-letter inline-block text-white text-6xl md:text-8xl font-mono font-bold tracking-tight"
            style={{ transform: 'translateY(110%)' }}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}
