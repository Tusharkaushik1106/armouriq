'use client';
import { useRef } from 'react';
import { gsap } from '@/lib/gsap';

type Props = {
  children: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
};

// Pill CTA with a qclay-style **magnetic** hover: when the cursor is inside
// the button bounds, the pill translates ~25% of the cursor's offset from
// its center, creating the feeling that the button is being pulled by the
// cursor. Releases smoothly on leave.
//
// The expanding circle effect is provided globally by `<CustomCursor />`
// (10px → 60px black disc on any interactive element). This component only
// owns the magnetic translate + click feedback.
export function QDiscButton({
  children, href, onClick, className = '', ariaLabel,
}: Props) {
  const root = useRef<HTMLAnchorElement | HTMLButtonElement | null>(null);

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e: React.MouseEvent) => {
    if (!root.current || reduced()) return;
    const r = root.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(root.current, {
      x: dx * 0.25,
      y: dy * 0.35,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleLeave = () => {
    if (!root.current || reduced()) return;
    gsap.to(root.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  };

  const handleClick = () => {
    if (!root.current) return;
    if (reduced()) {
      onClick?.();
      return;
    }
    gsap.fromTo(
      root.current,
      { scale: 1 },
      { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
    onClick?.();
  };

  const sharedClass = `relative inline-flex items-center px-7 py-3.5 rounded-full text-sm font-medium tracking-[-0.005em] bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-dark)] transition-colors duration-300 hover:bg-[var(--color-text-dark)] hover:text-white hover:border-[var(--color-text-dark)] ${className}`;

  if (href) {
    return (
      <a
        ref={root as React.RefObject<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        data-cursor="hover"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={handleClick}
        className={sharedClass}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={root as React.RefObject<HTMLButtonElement>}
      aria-label={ariaLabel}
      data-cursor="hover"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={sharedClass}
    >
      {children}
    </button>
  );
}
