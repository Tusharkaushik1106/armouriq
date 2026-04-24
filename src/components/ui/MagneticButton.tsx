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
  trail?: boolean;
};

export function MagneticButton({
  children, className = '', strength = 0.3, onClick, href, ariaLabel, trail = false,
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
    if (trail) {
      // spawn a small trailing dot at the button's center origin showing displacement direction
      const host = el.parentElement;
      if (!host) return;
      const dot = document.createElement('span');
      dot.setAttribute('aria-hidden', 'true');
      dot.style.position = 'absolute';
      dot.style.width = '4px';
      dot.style.height = '4px';
      dot.style.borderRadius = '9999px';
      dot.style.background = 'var(--color-primary)';
      dot.style.pointerEvents = 'none';
      dot.style.left = `${rect.width / 2}px`;
      dot.style.top = `${rect.height / 2}px`;
      dot.style.opacity = '0.7';
      dot.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      host.style.position = host.style.position || 'relative';
      host.appendChild(dot);
      gsap.to(dot, {
        x: x * 0.6,
        y: y * 0.6,
        opacity: 0,
        scale: 0.4,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      });
    }
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
