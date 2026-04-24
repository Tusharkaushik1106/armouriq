'use client';
import { type ReactNode, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
};

export function MagneticButton({
  children, className = '', strength = 0.3, onClick, href, ariaLabel,
}: Props) {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const getRef = (): HTMLElement | null => anchorRef.current ?? buttonRef.current;

  const handleMove = (e: React.MouseEvent) => {
    const el = getRef();
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out' });
  };

  const handleLeave = () => {
    const el = getRef();
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  if (href) {
    return (
      <a
        ref={anchorRef}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={`inline-block ${className}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={buttonRef}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`inline-block ${className}`}
    >
      {children}
    </button>
  );
}
