'use client';
import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { QDiscButton } from '@/components/ui/QDiscButton';

type Link = { label: string; href: string };

export function MobileDrawer({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: Link[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!panelRef.current || !overlayRef.current) return;
    if (open) {
      gsap.set(overlayRef.current, { display: 'block', opacity: 0 });
      gsap.set(panelRef.current, { xPercent: 100 });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.5, ease: 'power3.inOut' });
      gsap.fromTo(
        '.drawer-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.05, delay: 0.15, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(panelRef.current, { xPercent: 100, duration: 0.4, ease: 'power3.inOut' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.display = 'none';
        },
      });
    }
  }, { dependencies: [open] });

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90]"
      style={{ display: 'none' }}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 bg-[var(--color-text-dark)]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute top-0 right-0 h-full w-full sm:w-[380px] bg-[var(--color-bg)] shadow-xl flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <span className="font-bold tracking-[-0.02em] text-[17px]">ArmorIQ</span>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)]"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 flex flex-col px-6 py-8 gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="drawer-item py-4 text-2xl font-medium text-[var(--color-text-dark)] border-b border-[var(--color-border)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="p-6 flex flex-col gap-3">
          <div className="drawer-item w-full"><QDiscButton href="#cta" className="w-full justify-center">Book a Demo</QDiscButton></div>
          <a
            href="#"
            className="drawer-item text-center py-3 text-sm text-[var(--color-text-medium)] underline-slide"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
