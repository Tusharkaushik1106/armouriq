'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';

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
      className="bg-[var(--color-text-dark)] text-white relative overflow-hidden flex flex-col"
    >
      {/* Top brand marquee */}
      <div className="relative py-8 md:py-10 border-b border-white/10">
        <Marquee speed={30}>
          <span
            className="font-bold text-white/15 pr-12"
            style={{
              fontSize: 'clamp(96px, 14vw, 240px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            STOP AI AGENTS FROM GOING ROGUE
          </span>
          <span
            className="font-bold text-[var(--color-primary)] pr-12"
            style={{
              fontSize: 'clamp(96px, 14vw, 240px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              opacity: 0.4,
            }}
          >
            · ARMORIQ
          </span>
          <span
            className="font-bold text-white/15 pr-12"
            style={{
              fontSize: 'clamp(96px, 14vw, 240px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            · STOP AI AGENTS FROM GOING ROGUE
          </span>
          <span
            className="font-bold text-[var(--color-primary)] pr-12"
            style={{
              fontSize: 'clamp(96px, 14vw, 240px)',
              letterSpacing: '-0.04em',
              lineHeight: 1,
              opacity: 0.4,
            }}
          >
            · ARMORIQ
          </span>
        </Marquee>
      </div>

      <div className="pt-20 pb-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
            <div className="footer-col col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2L3 6V12C3 17 7 21.5 12 22C17 21.5 21 17 21 12V6L12 2Z"
                    stroke="#ffffff"
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
                <span className="font-bold tracking-[-0.02em] text-lg text-white">ArmorIQ</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-[260px]">
                It&apos;s not about Identity,<br />
                It&apos;s about Intent
              </p>
            </div>

            <div className="footer-col">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 mb-5">
                Platform
              </h4>
              <ul className="space-y-3">
                {platformLinks.map((l) => (
                  <li key={l}>
                    <a
                      href="#products"
                      className="inline-block text-sm text-white/70 hover:text-white origin-left hover:scale-105 transition-all duration-300"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 mb-5">
                Company
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="inline-block text-sm text-white/70 hover:text-white origin-left hover:scale-105 transition-all duration-300"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 mb-5">
                Connect
              </h4>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 flex items-center justify-center border border-white/30 rounded-lg hover:border-white/60 hover:scale-110 active:scale-95 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white/80" aria-hidden="true">
                    <path d="M3.5 5.5A1.5 1.5 0 1 1 3.5 2.5a1.5 1.5 0 0 1 0 3zM2 6.5h3v7H2v-7zm4.5 0H9v1.1c.4-.7 1.3-1.3 2.6-1.3 2 0 2.4 1.3 2.4 3v4.2h-2.5v-3.6c0-.9-.2-1.5-1-1.5-.9 0-1.1.6-1.1 1.5v3.6H6.5v-7z" />
                  </svg>
                </a>
                <a href="#" aria-label="X (Twitter)" className="w-10 h-10 flex items-center justify-center border border-white/30 rounded-lg hover:border-white/60 hover:scale-110 active:scale-95 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white/80" aria-hidden="true">
                    <path d="M12.5 2h2.2l-4.8 5.5 5.6 7.5h-4.4l-3.5-4.6L3.6 15H1.4l5.1-5.9L1.1 2h4.5l3.2 4.2L12.5 2zm-.8 11.6h1.2L5.4 3.3H4.1l7.6 10.3z" />
                  </svg>
                </a>
                <a href="#" aria-label="GitHub" className="w-10 h-10 flex items-center justify-center border border-white/30 rounded-lg hover:border-white/60 hover:scale-110 active:scale-95 transition-all duration-300">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white/80" aria-hidden="true">
                    <path d="M8 1.3c-3.7 0-6.7 3-6.7 6.7 0 3 1.9 5.5 4.6 6.3.3.1.5-.1.5-.3v-1.2c-1.8.4-2.3-.9-2.3-.9-.3-.8-.8-1-.8-1-.6-.4.1-.4.1-.4.7.1 1.1.7 1.1.7.6 1.1 1.7.8 2.1.6.1-.5.3-.8.5-1-1.5-.2-3-.7-3-3.3 0-.7.3-1.3.7-1.8-.1-.2-.3-.9.1-1.9 0 0 .6-.2 1.9.7.6-.2 1.2-.2 1.8-.2.6 0 1.2.1 1.8.2 1.3-.9 1.9-.7 1.9-.7.4 1 .1 1.7.1 1.9.4.5.7 1.1.7 1.8 0 2.6-1.6 3.1-3.1 3.3.2.2.5.6.5 1.3v1.9c0 .2.1.4.5.3 2.7-.9 4.6-3.4 4.6-6.3 0-3.7-3-6.7-6.7-6.7z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-col mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-white/50 font-mono">
            <span>Copyright © 2026 ArmorIQ. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>

          <div className="footer-col mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 text-center md:text-left">
            built with GSAP · Tailwind · Next.js
          </div>
        </Container>
      </div>

      {/* Watermark — the payoff that scrolls in last. SVG so it always fits the viewport width. */}
      <div className="footer-col relative w-full pointer-events-none select-none mt-auto px-4 pb-6">
        <svg
          viewBox="0 0 1000 200"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-auto"
          aria-hidden="true"
        >
          <text
            x="500"
            y="170"
            textAnchor="middle"
            fontWeight="700"
            fontSize="240"
            fill="rgba(255,255,255,0.07)"
            style={{ letterSpacing: '-12px' }}
          >
            ARMORIQ
          </text>
        </svg>
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 block h-[3px] w-[36%] rounded-full"
          style={{ background: 'var(--color-primary)', opacity: 0.55 }}
        />
      </div>
    </footer>
  );
}
