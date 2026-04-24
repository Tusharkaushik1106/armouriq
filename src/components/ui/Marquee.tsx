'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
};

export function Marquee({ children, speed = 60, reverse = false, className = '' }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const track = container.current?.querySelector<HTMLDivElement>('.marquee-track');
    if (!track) return;
    const width = track.scrollWidth / 2;
    if (width <= 0) return;
    const duration = width / speed;
    gsap.fromTo(
      track,
      { x: reverse ? -width : 0 },
      {
        x: reverse ? 0 : -width,
        duration,
        ease: 'none',
        repeat: -1,
      }
    );
  }, { scope: container });

  return (
    <div ref={container} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track inline-flex">
        <div className="inline-flex items-center">{children}</div>
        <div className="inline-flex items-center" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
