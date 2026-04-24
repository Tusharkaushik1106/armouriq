'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export function ProblemIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const paths = ref.current.querySelectorAll<SVGPathElement>('path.draw');
    paths.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });

    tl.to(paths, {
      strokeDashoffset: 0,
      stagger: 0.1,
      duration: 1.1,
      ease: 'power2.inOut',
    })
      .fromTo(
        ref.current.querySelectorAll('.node, .label'),
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
        '-=0.8'
      )
      .fromTo(
        ref.current.querySelectorAll('.blocker'),
        { scale: 0, rotate: -45, transformOrigin: '50% 50%' },
        { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(2)' },
        '-=0.3'
      );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <div ref={ref} className="relative w-full aspect-[4/3] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 card-shadow">
      <div className="absolute inset-0 bg-grain opacity-60 rounded-xl pointer-events-none" aria-hidden="true" />
      <svg viewBox="0 0 400 300" className="relative w-full h-full" aria-hidden="true">
        {/* Agent node (left) */}
        <g className="node">
          <rect x="30" y="120" width="80" height="60" rx="8" fill="#fff" stroke="var(--color-border-strong)" strokeWidth="1.5" />
          <circle cx="70" cy="145" r="10" fill="none" stroke="var(--color-text-dark)" strokeWidth="1.5" />
          <path d="M55 170 Q70 160 85 170" stroke="var(--color-text-dark)" strokeWidth="1.5" fill="none" />
        </g>
        <text x="70" y="200" textAnchor="middle" className="label" style={{ opacity: 0 }} fontSize="10" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.1em">AGENT</text>

        {/* Arrow attempting action */}
        <path className="draw" d="M115 150 L250 150" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <text x="180" y="138" textAnchor="middle" className="label" style={{ opacity: 0 }} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-primary)" letterSpacing="0.08em">INTENDED</text>

        {/* Blocker X at middle */}
        <g className="blocker" transform="translate(200 150)">
          <circle r="18" fill="var(--color-danger-bg)" stroke="var(--color-danger)" strokeWidth="1.5" />
          <path d="M-7 -7 L7 7 M7 -7 L-7 7" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <text x="200" y="195" textAnchor="middle" className="label" style={{ opacity: 0 }} fontSize="9" fontFamily="var(--font-mono)" fill="var(--color-danger)" letterSpacing="0.08em">BLOCKED</text>

        {/* Target (right) */}
        <g className="node" opacity="0.6">
          <rect x="290" y="120" width="80" height="60" rx="8" fill="#fff" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M310 145 L330 150 L310 155 Z M340 140 L340 160 M350 140 L350 160" stroke="var(--color-text-medium)" strokeWidth="1.5" fill="none" />
        </g>
        <text x="330" y="200" textAnchor="middle" className="label" style={{ opacity: 0 }} fontSize="10" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.1em">RESOURCE</text>

        {/* Small inspection brackets around blocker */}
        <path className="draw" d="M170 135 L170 130 L180 130" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
        <path className="draw" d="M230 135 L230 130 L220 130" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
        <path className="draw" d="M170 165 L170 170 L180 170" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
        <path className="draw" d="M230 165 L230 170 L220 170" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}
