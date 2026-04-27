'use client';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { QDiscButton } from '@/components/ui/QDiscButton';
import { FullscreenMenu } from './FullscreenMenu';

const links = [
  { label: 'Platform', href: '#products' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Manifesto', href: '#problem' },
  { label: 'FAQ', href: '#faq' },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onEnter = (e: ReactMouseEvent) => {
    if (!ref.current || !dotRef.current || reduced()) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    gsap.set(dotRef.current, { x, xPercent: -50, scale: 0, opacity: 1 });
    gsap.to(dotRef.current, { scale: 1, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' });
    if (wordRef.current)
      gsap.to(wordRef.current, {
        y: -2,
        color: 'var(--color-text-dark)',
        duration: 0.25,
        ease: 'power3.out',
        overwrite: 'auto',
      });
  };
  const onMove = (e: ReactMouseEvent) => {
    if (!ref.current || !dotRef.current || reduced()) return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(dotRef.current, {
      x: e.clientX - r.left,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };
  const onLeave = () => {
    if (!dotRef.current) return;
    gsap.to(dotRef.current, { scale: 0, duration: 0.25, ease: 'power3.in', overwrite: 'auto' });
    if (wordRef.current)
      gsap.to(wordRef.current, {
        y: 0,
        color: 'var(--color-text-medium)',
        duration: 0.3,
        ease: 'power3.out',
        overwrite: 'auto',
      });
  };

  return (
    <a
      ref={ref}
      href={href}
      data-cursor="ignore"
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative inline-block py-1.5 px-1 text-[15px] text-[var(--color-text-medium)]"
    >
      <span ref={wordRef} className="relative inline-block will-change-transform">
        {label}
      </span>
      <span
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full"
        style={{
          background: 'var(--color-primary)',
          transform: 'translate(-50%, 0) scale(0)',
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </a>
  );
}

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleBurgerMove = (e: ReactMouseEvent) => {
    if (!burgerRef.current || reduced()) return;
    const r = burgerRef.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(burgerRef.current, {
      x: dx * 0.25,
      y: dy * 0.35,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };
  const handleBurgerLeave = () => {
    if (!burgerRef.current || reduced()) return;
    gsap.to(burgerRef.current, {
      x: 0,
      y: 0,
      duration: 0.55,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto',
    });
  };

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 2.7 }
    );
  }, { scope: ref });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 80 && !menuOpen);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  return (
    <>
      <header
        ref={ref}
        className={`sticky top-0 z-[55] transition-all duration-300 ${
          scrolled && !menuOpen
            ? 'bg-white/70 backdrop-blur-md border-b border-[var(--color-border)]'
            : 'bg-transparent border-b border-transparent'
        } ${hidden ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5" aria-label="ArmorIQ home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2L3 6V12C3 17 7 21.5 12 22C17 21.5 21 17 21 12V6L12 2Z"
                stroke="var(--color-text-dark)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 12L11 14.5L15.5 10"
                stroke="var(--color-primary)"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-bold tracking-[-0.02em] text-[17px] text-[var(--color-text-dark)]">
              ArmorIQ
            </span>
          </a>

          {/* Center mini-links — cursor-tracking dot under each */}
          <nav className="hidden lg:flex items-center gap-10">
            {links.slice(0, 4).map((l) => (
              <NavLink key={l.label} href={l.href} label={l.label} />
            ))}
          </nav>

          {/* Right: status pill + burger */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:inline-flex items-center gap-2 border border-[var(--color-border-strong)] rounded-full pl-3 pr-4 py-1.5 text-[13px] text-[var(--color-text-dark)] bg-white">
              <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              Live
            </div>
            <QDiscButton href="#cta" className="hidden md:inline-flex">
              Book a Demo
            </QDiscButton>
            <div className="flex items-center gap-2.5">
              <span
                data-cursor="ignore"
                className="hidden sm:inline text-sm text-[var(--color-text-dark)] pointer-events-none select-none"
              >
                menu
              </span>
              <button
                ref={burgerRef}
                type="button"
                onClick={() => setMenuOpen(true)}
                onMouseMove={handleBurgerMove}
                onMouseLeave={handleBurgerLeave}
                data-cursor="hover"
                className="relative w-10 h-10 rounded-full border border-[var(--color-border-strong)] bg-white flex items-center justify-center text-[var(--color-text-dark)] active:scale-95"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path d="M1 1H13M1 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} />
    </>
  );
}
