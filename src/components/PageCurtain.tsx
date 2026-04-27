'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

export function PageCurtain() {
  const curtain = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!curtain.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.to(curtain.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          if (curtain.current) curtain.current.style.display = 'none';
        },
      });
      return;
    }

    // GPU hints — promote everything that animates to its own layer up front
    // so the first frame doesn't have to compose new layers (the source of
    // the "laggy first second" feel).
    gsap.set(
      [
        curtain.current,
        '.curtain-bg-shield',
        '.curtain-content',
        '.curtain-shield',
        '.curtain-letter',
        '.curtain-tag',
        '.curtain-progress-wrap',
        '.curtain-status-row',
        '.curtain-top',
        '.curtain-bottom',
      ],
      { willChange: 'transform, opacity', force3D: true }
    );

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // ── ENTRANCE ──────────────────────────────────────────────────
    // One unified breath: bg shield breathes in, then content rises.
    tl.fromTo(
      '.curtain-bg-shield',
      { opacity: 0, scale: 1.15 },
      { opacity: 0.07, scale: 1, duration: 1.4, ease: 'power3.out' },
      0
    )
      .fromTo(
        '.curtain-shield',
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 0.9 },
        0.2
      )
      .fromTo(
        '.curtain-shield-check',
        { strokeDashoffset: 28 },
        { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
        0.4
      )
      .to(
        '.curtain-letter',
        { y: 0, stagger: 0.04, duration: 0.95, ease: 'power3.out' },
        0.35
      )
      .fromTo(
        '.curtain-tag',
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.7
      )
      .fromTo(
        '.curtain-rule',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9 },
        0.75
      )
      .fromTo(
        '.curtain-progress',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'power1.inOut' },
        0.75
      )
      .fromTo(
        '.curtain-status',
        { opacity: 0 },
        { opacity: 1, duration: 0.55, stagger: 0.1 },
        0.95
      )
      .fromTo(
        ['.curtain-top', '.curtain-bottom'],
        { opacity: 0, y: (i) => (i === 0 ? -10 : 10) },
        { opacity: 1, y: 0, duration: 0.7 },
        0.5
      )
      // Settle hold
      .to({}, { duration: 0.45 });

    // ── EXIT — ZOOM INTO THE LOGO ─────────────────────────────────
    // Both the giant background shield and the small foreground shield
    // grow toward the camera, content fades, the dark panel itself fades
    // to the page background. The illusion: the user is "diving through"
    // the ArmorIQ shield and landing on the page, where the same shield
    // re-appears as the nav logo.
    // Landing page reveal — runs in parallel with the curtain's exit so
    // the user "lands on" the page mid-zoom. The page starts slightly
    // scaled-up + transparent, settles to identity as the curtain dissolves.
    const main = document.querySelector<HTMLElement>('main');
    if (main) {
      gsap.set(main, {
        opacity: 0,
        scale: 1.06,
        transformOrigin: '50% 40%',
        willChange: 'transform, opacity',
      });
    }

    const exit = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    exit
      // Foreground content thins out while the bg shield blooms forward
      .to(
        '.curtain-letter, .curtain-tag, .curtain-rule, .curtain-progress-wrap, .curtain-status-row, .curtain-top, .curtain-bottom',
        { opacity: 0, duration: 0.55, ease: 'power2.in' },
        0
      )
      // Foreground shield grows + fades — gives the camera-dive feel
      .to(
        '.curtain-shield',
        { scale: 6, opacity: 0, duration: 1.3, ease: 'power3.in' },
        0
      )
      // Background shield grows hugely — this is the "landing target"
      .to(
        '.curtain-bg-shield',
        { scale: 8, opacity: 0, duration: 1.3, ease: 'power3.in' },
        0
      )
      // Curtain bg dark → page bg as we punch through
      .to(
        curtain.current,
        { backgroundColor: 'var(--color-bg)', duration: 0.9, ease: 'power2.inOut' },
        0.25
      )
      // Page rises up from inside the logo, opposite of the curtain dive.
      .to(
        main,
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          onComplete: () => {
            if (main) {
              main.style.willChange = '';
              main.style.transform = '';
              main.style.opacity = '';
            }
          },
        },
        0.35
      )
      // Final fade-out of the curtain layer
      .to(curtain.current, { opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.95)
      .set(curtain.current, { display: 'none' });

    tl.add(exit);
  }, { scope: curtain });

  const letters = 'ARMORIQ'.split('');

  return (
    <div
      ref={curtain}
      className="curtain-root fixed inset-0 z-[100] bg-[var(--color-text-dark)] flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 25%, transparent 75%)',
        }}
      />

      {/* Giant background shield watermark — the zoom target */}
      <svg
        className="curtain-bg-shield absolute pointer-events-none"
        style={{
          width: 'min(140vmin, 1100px)',
          height: 'min(140vmin, 1100px)',
          opacity: 0,
          transformOrigin: '50% 50%',
        }}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 2L3 6V12C3 17 7 21.5 12 22C17 21.5 21 17 21 12V6L12 2Z"
          stroke="white"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 12L11 14.5L15.5 10"
          stroke="var(--color-primary)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Top ticker */}
      <div
        className="curtain-top absolute top-6 left-0 right-0 px-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40"
        style={{ opacity: 0 }}
      >
        <span>Booting · ArmorIQ</span>
        <span className="hidden sm:inline">Intent · Policy · Audit</span>
        <span>v0.1</span>
      </div>

      <div className="curtain-content relative flex flex-col items-center gap-6">
        {/* Foreground shield with check */}
        <div className="curtain-shield relative" style={{ opacity: 0 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2L3 6V12C3 17 7 21.5 12 22C17 21.5 21 17 21 12V6L12 2Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              className="curtain-shield-check"
              d="M8.5 12L11 14.5L15.5 10"
              stroke="var(--color-primary)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="28"
              strokeDashoffset="28"
            />
          </svg>
        </div>

        {/* Wordmark */}
        <div className="flex overflow-hidden">
          {letters.map((l, i) => (
            <span
              key={i}
              className="curtain-letter inline-block text-white font-mono font-bold tracking-tight"
              style={{
                transform: 'translateY(110%)',
                fontSize: 'clamp(56px, 12vw, 120px)',
                lineHeight: 1,
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <div
          className="curtain-tag font-mono text-[11px] uppercase tracking-[0.32em] text-white/55"
          style={{ opacity: 0 }}
        >
          Stop AI Agents from Going Rogue
        </div>

        {/* Progress rule */}
        <div className="curtain-progress-wrap relative w-[220px] md:w-[320px] mt-2">
          <span
            className="curtain-rule block h-[1px] w-full bg-white/20 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
          <span
            className="curtain-progress absolute top-0 left-0 h-[1px] w-full bg-[var(--color-primary)] origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Status checklist */}
        <div className="curtain-status-row mt-1 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          <span className="curtain-status flex items-center gap-1.5" style={{ opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            policy loaded
          </span>
          <span className="curtain-status flex items-center gap-1.5" style={{ opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            registry synced
          </span>
          <span className="curtain-status hidden sm:flex items-center gap-1.5" style={{ opacity: 0 }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            audit ready
          </span>
        </div>
      </div>

      {/* Bottom ticker */}
      <div
        className="curtain-bottom absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-white/40"
        style={{ opacity: 0 }}
      >
        <span className="flex items-center gap-2">
          <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          Initializing control fabric
        </span>
        <span className="hidden sm:inline">© 2026 ArmorIQ</span>
      </div>
    </div>
  );
}
