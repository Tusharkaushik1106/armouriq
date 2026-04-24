'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Button } from '@/components/ui/Button';
import { MobileDrawer } from './MobileDrawer';

const links = [
  { label: 'Platform', href: '#products' },
  { label: 'Resources', href: '#faq' },
  { label: 'Manifesto', href: '#problem' },
  { label: 'About', href: '#cta' },
];

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useGSAP(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 2.2 }
    );
  }, { scope: ref });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-md border-b border-[var(--color-border)]'
            : 'bg-transparent border-b border-transparent'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2.5 logo-glitch"
            aria-label="ArmorIQ home"
            onMouseEnter={(e) => {
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
              const el = e.currentTarget;
              gsap.timeline()
                .to(el, { x: -2, duration: 0.04, ease: 'none' })
                .to(el, { x: 2, duration: 0.04, ease: 'none' })
                .to(el, { x: 0, duration: 0.04, ease: 'none' });
            }}
          >
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

          <nav className="hidden lg:flex items-center gap-9">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="underline-slide text-sm text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="#"
              className="hidden md:inline-block text-sm text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)] underline-slide px-3 py-2 transition-colors"
            >
              Login
            </a>
            <Button as="a" href="#cta" variant="primary" magnetic className="hidden md:inline-flex">
              Book a Demo
            </Button>
            <button
              className="lg:hidden p-2 text-[var(--color-text-dark)]"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M3 6H19M3 11H19M3 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} links={links} />
    </>
  );
}
