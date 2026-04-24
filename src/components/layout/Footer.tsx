'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';

const platformLinks = ['Intent Engine', 'Sentry', 'Gatekeeper', 'Registry', 'Auditor'];
const companyLinks = ['About Us', 'Blogs', 'Events'];

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      ref.current.querySelectorAll('.footer-col'),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <footer
      ref={ref}
      className="bg-[var(--color-surface)] border-t border-[var(--color-border)] pt-20 pb-10"
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          <div className="footer-col md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
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
              <span className="font-bold tracking-[-0.02em] text-lg">ArmorIQ</span>
            </div>
            <p className="text-sm text-[var(--color-text-medium)] leading-relaxed max-w-[260px]">
              It&apos;s not about Identity,<br />
              It&apos;s about Intent
            </p>
          </div>

          <div className="footer-col">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((l) => (
                <li key={l}>
                  <a href="#products" className="underline-slide text-sm text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="underline-slide text-sm text-[var(--color-text-medium)] hover:text-[var(--color-text-dark)] transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="p-2 border border-[var(--color-border)] rounded-md hover:border-[var(--color-text-dark)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-text-medium)]" aria-hidden="true">
                  <path d="M3.5 5.5A1.5 1.5 0 1 1 3.5 2.5a1.5 1.5 0 0 1 0 3zM2 6.5h3v7H2v-7zm4.5 0H9v1.1c.4-.7 1.3-1.3 2.6-1.3 2 0 2.4 1.3 2.4 3v4.2h-2.5v-3.6c0-.9-.2-1.5-1-1.5-.9 0-1.1.6-1.1 1.5v3.6H6.5v-7z" />
                </svg>
              </a>
              <a href="#" aria-label="X (Twitter)" className="p-2 border border-[var(--color-border)] rounded-md hover:border-[var(--color-text-dark)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-text-medium)]" aria-hidden="true">
                  <path d="M12.5 2h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.5-4.6L3.6 15H1.4l5.1-5.9L1.1 2h4.5l3.2 4.2L12.5 2zm-.8 11.6h1.2L5.4 3.3H4.1l7.6 10.3z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="p-2 border border-[var(--color-border)] rounded-md hover:border-[var(--color-text-dark)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--color-text-medium)]" aria-hidden="true">
                  <path d="M8 1.3c-3.7 0-6.7 3-6.7 6.7 0 3 1.9 5.5 4.6 6.3.3.1.5-.1.5-.3v-1.2c-1.8.4-2.3-.9-2.3-.9-.3-.8-.8-1-.8-1-.6-.4.1-.4.1-.4.7.1 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6.1-.5.3-.8.5-1-1.5-.2-3-.7-3-3.3 0-.7.3-1.3.7-1.8-.1-.2-.3-.9.1-1.9 0 0 .6-.2 1.9.7.6-.2 1.2-.2 1.8-.2.6 0 1.2.1 1.8.2 1.3-.9 1.9-.7 1.9-.7.4 1 .1 1.7.1 1.9.4.5.7 1.1.7 1.8 0 2.6-1.6 3.1-3.1 3.3.2.2.5.6.5 1.3v1.9c0 .2.1.4.5.3 2.7-.9 4.6-3.4 4.6-6.3 0-3.7-3-6.7-6.7-6.7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-col mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[var(--color-text-light)] font-mono">
          <span>Copyright © 2026 ArmorIQ. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="underline-slide hover:text-[var(--color-text-dark)] transition-colors">Privacy Policy</a>
            <a href="#" className="underline-slide hover:text-[var(--color-text-dark)] transition-colors">Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
