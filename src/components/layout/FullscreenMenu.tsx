'use client';
import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type MenuLink = { label: string; href: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: MenuLink[];
};

const social = [
  { label: 'LinkedIn', href: '#' },
  { label: 'X', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'YouTube', href: '#' },
];

const utility = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
];

export function FullscreenMenu({ open, onClose, links }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!overlayRef.current || !innerRef.current) return;
    const overlay = overlayRef.current;
    const inner = innerRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const linkEls = inner.querySelectorAll<HTMLElement>('.menu-link-inner');
    const sideEls = inner.querySelectorAll<HTMLElement>('.menu-side-item');
    const blockEl = inner.querySelector<HTMLElement>('.menu-block');
    const eyebrowEls = inner.querySelectorAll<HTMLElement>('.menu-eyebrow');
    const utilityEl = inner.querySelector<HTMLElement>('.menu-utility');

    if (open) {
      gsap.set(overlay, { display: 'block', pointerEvents: 'auto' });
      if (reduced) {
        gsap.set(overlay, { clipPath: 'circle(150% at 100% 0%)' });
        gsap.set(linkEls, { y: 0, opacity: 1 });
        gsap.set(sideEls, { x: 0, opacity: 1 });
        gsap.set(eyebrowEls, { opacity: 1 });
        if (blockEl) gsap.set(blockEl, { opacity: 1, scale: 1 });
        if (utilityEl) gsap.set(utilityEl, { opacity: 1, y: 0 });
        return;
      }

      // Initial state
      gsap.set(overlay, { clipPath: 'circle(0% at 100% 0%)' });
      gsap.set(linkEls, { y: '110%', opacity: 1 });
      gsap.set(sideEls, { x: -16, opacity: 0 });
      gsap.set(eyebrowEls, { opacity: 0 });
      if (blockEl) gsap.set(blockEl, { opacity: 0, scale: 0.9, transformOrigin: 'top left' });
      if (utilityEl) gsap.set(utilityEl, { opacity: 0, y: 16 });

      const tl = gsap.timeline();
      tl.to(overlay, {
        clipPath: 'circle(150% at 100% 0%)',
        duration: 0.85,
        ease: 'power4.inOut',
      });
      tl.to(eyebrowEls, { opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }, '-=0.45');
      tl.to(linkEls, {
        y: 0,
        duration: 0.85,
        stagger: 0.07,
        ease: 'power4.out',
      }, '-=0.4');
      tl.to(sideEls, { x: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, '-=0.7');
      if (blockEl)
        tl.to(blockEl, { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }, '-=0.65');
      if (utilityEl)
        tl.to(utilityEl, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');
    } else {
      if (reduced) {
        gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
        return;
      }
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: 'none', pointerEvents: 'none' });
        },
      });
      tl.to(linkEls, { y: '-110%', duration: 0.5, stagger: 0.03, ease: 'power3.in' });
      tl.to(overlay, {
        clipPath: 'circle(0% at 100% 0%)',
        duration: 0.6,
        ease: 'power4.inOut',
      }, '-=0.3');
    }
  }, { dependencies: [open] });

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Sticky/magnetic hover on each big menu link: the link translates toward
  // the cursor's offset from its center, eased smoothly. Cursor stays small
  // (links carry data-cursor="ignore").
  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleLinkMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reduced()) return;
    const a = e.currentTarget;
    const word = a.querySelector<HTMLElement>('.menu-link-word');
    if (!word) return;
    const r = a.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(word, {
      x: dx * 0.35,
      y: dy * 0.5,
      color: 'var(--color-primary)',
      duration: 0.5,
      ease: 'power3.out',
      overwrite: 'auto',
    });
  };

  const handleLinkLeave = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    if (reduced()) return;
    const word = e.currentTarget.querySelector<HTMLElement>('.menu-link-word');
    if (!word) return;
    gsap.to(word, {
      x: 0,
      y: 0,
      color: 'var(--color-text-dark)',
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-[var(--color-bg)]"
      style={{
        display: 'none',
        clipPath: 'circle(0% at 100% 0%)',
        WebkitClipPath: 'circle(0% at 100% 0%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
    >
      <div ref={innerRef} className="relative w-full h-full px-6 md:px-12 lg:px-20 py-8 md:py-10 flex flex-col">
        {/* Top bar — kept inside overlay so logo/close stay visible */}
        <div className="flex items-center justify-between">
          <a href="#" onClick={onClose} aria-label="ArmorIQ home" className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
            <span className="font-bold tracking-[-0.02em] text-[18px] text-[var(--color-text-dark)]">
              ArmorIQ
            </span>
          </a>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="#cta"
              onClick={onClose}
              data-cursor="hover"
              className="hidden md:inline-flex items-center gap-2 border border-[var(--color-border-strong)] rounded-full pl-3 pr-4 py-2 text-sm hover:border-[var(--color-text-dark)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
              <span>Book a Demo</span>
            </a>
            <div className="flex items-center gap-2.5">
              <span
                data-cursor="ignore"
                className="hidden sm:inline text-sm text-[var(--color-text-dark)] pointer-events-none select-none"
              >
                Close
              </span>
              <button
                onClick={onClose}
                data-cursor="hover"
                className="w-10 h-10 rounded-full bg-[var(--color-text-dark)] flex items-center justify-center text-white active:scale-95"
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Body — 4 zones: left rail, center block, center menu, bottom row */}
        <div className="flex-1 grid grid-cols-12 gap-8 md:gap-12 mt-12 md:mt-16">
          {/* Left rail: Social */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-2 flex flex-col">
            <div className="menu-eyebrow font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-light)] mb-5">
              Social
            </div>
            <ul className="space-y-2.5">
              {social.map((s) => (
                <li key={s.label} className="menu-side-item">
                  <a
                    href={s.href}
                    className="text-[15px] text-[var(--color-text-dark)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          {/* Center dark block (illustration / brand block) */}
          <div className="hidden md:block md:col-span-4 lg:col-span-4">
            <div
              className="menu-block relative w-full aspect-[4/5] max-h-[420px] rounded-md overflow-hidden bg-[var(--color-text-dark)]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <svg viewBox="0 0 260 260" className="w-24 h-24" fill="none" aria-hidden="true">
                  <circle cx="129.5" cy="129.5" r="118.5" stroke="var(--color-primary)" strokeWidth="22" />
                  <path
                    d="M61.5 152.5L90 111L116.5 149.5L143 111L169 149.5L197.5 108.5"
                    stroke="var(--color-primary)"
                    strokeWidth="22"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Intent · Policy · Audit
                </div>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                <span>STATUS · LIVE</span>
                <span>v.04</span>
              </div>
            </div>
          </div>

          {/* Right: Big menu links */}
          <nav className="col-span-12 md:col-span-5 lg:col-span-6 flex flex-col">
            <div className="menu-eyebrow font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-light)] mb-6">
              Menu
            </div>
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.label} className="overflow-visible">
                  <a
                    href={l.href}
                    onClick={onClose}
                    onMouseMove={handleLinkMove}
                    onMouseLeave={handleLinkLeave}
                    data-cursor="ignore"
                    className="menu-link-inner relative inline-flex items-center"
                  >
                    <span
                      className="menu-link-word font-bold text-[var(--color-text-dark)] inline-block will-change-transform"
                      style={{
                        fontSize: 'clamp(40px, 6.4vw, 92px)',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.05,
                      }}
                    >
                      {l.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom utility row */}
        <div className="menu-utility mt-auto pt-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-end border-t border-[var(--color-border)]">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-light)] mb-2">
              Get in touch
            </div>
            <a
              href="mailto:hello@armoriq.com"
              className="text-[18px] md:text-[20px] font-medium text-[var(--color-text-dark)] tracking-[-0.01em] underline-slide"
            >
              hello@armoriq.com
            </a>
          </div>
          <div className="md:text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-light)]">
            © 2026 ArmorIQ
          </div>
          <div className="flex md:justify-end items-center gap-6">
            {utility.map((u) => (
              <a
                key={u.label}
                href={u.href}
                className="text-[13px] text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)] transition-colors"
              >
                {u.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
