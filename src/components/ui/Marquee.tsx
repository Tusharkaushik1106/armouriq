'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
  velocityResponsive?: boolean;
};

// Track recent scroll velocity globally (shared across marquees).
let scrollVelocity = 0;
let lastScrollY = 0;
let lastScrollTime = 0;
let velocityListenerAttached = false;

function attachVelocityListener() {
  if (typeof window === 'undefined' || velocityListenerAttached) return;
  velocityListenerAttached = true;
  lastScrollY = window.scrollY;
  lastScrollTime = performance.now();
  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastScrollTime);
      const dy = Math.abs(window.scrollY - lastScrollY);
      // pixels per ms → 0..1 mapping
      const inst = Math.min(1, dy / dt / 3);
      // exponential smoothing
      scrollVelocity = scrollVelocity * 0.6 + inst * 0.4;
      lastScrollY = window.scrollY;
      lastScrollTime = now;
    },
    { passive: true }
  );
  // decay over time
  setInterval(() => {
    scrollVelocity *= 0.85;
  }, 100);
}

export function Marquee({
  children,
  speed = 60,
  reverse = false,
  className = '',
  velocityResponsive = true,
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const track = container.current?.querySelector<HTMLDivElement>('.marquee-track');
    if (!track) return;
    const width = track.scrollWidth / 2;
    if (width <= 0) return;
    const duration = width / speed;
    const tween = gsap.fromTo(
      track,
      { x: reverse ? -width : 0 },
      {
        x: reverse ? 0 : -width,
        duration,
        ease: 'none',
        repeat: -1,
      }
    );

    if (!velocityResponsive) return;
    attachVelocityListener();

    // Adjust tween timeScale based on velocity
    const tick = gsap.ticker.add(() => {
      const target = 1 + scrollVelocity * 1.5; // 1x .. ~2.5x
      tween.timeScale(gsap.utils.interpolate(tween.timeScale(), target, 0.08));
    });
    return () => {
      gsap.ticker.remove(tick);
    };
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
