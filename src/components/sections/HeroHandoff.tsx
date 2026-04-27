'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { QDiscButton } from '@/components/ui/QDiscButton';
import { HeroAnimation } from './HeroAnimation';
import { useMediaQuery } from '@/lib/useMediaQuery';

export function HeroHandoff() {
  const container = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const showMobile = isDesktop === false;

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intro timeline — on mount (no scroll)
    if (!reduced) {
      const intro = gsap.timeline({ delay: 3.0 });
      intro
        .fromTo(
          '.hero-eyebrow',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        )
        .to(
          '.hero-headline .split-inner',
          { y: 0, stagger: 0.05, duration: 1.0, ease: 'power3.out' },
          0.2
        )
        .fromTo(
          '.rogue-underline',
          { scaleX: 1 },
          { scaleX: 0, duration: 0.6, ease: 'power3.out' },
          1.1
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          1.3
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
          1.5
        );
    } else {
      gsap.set(
        container.current.querySelectorAll('.hero-eyebrow, .hero-sub, .hero-cta, .split-inner'),
        { opacity: 1, y: 0 }
      );
      gsap.set('.rogue-underline', { scaleX: 0 });
    }

    if (reduced) return;

    // Scrubbed handoff timeline
    const isMobile = window.innerWidth < 768;
    if (isMobile) return; // mobile: no pin, two sections stacked naturally

    const handoff = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=120%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 0-40%: hold. User still reads hero.
    // 40-70%: headline scales up + fades, CTAs shrink, subhead fades
    handoff.to('.hero-text', {
      scale: 1.15,
      opacity: 0,
      y: -60,
      duration: 0.4,
      ease: 'power2.in',
    }, 0.4);

    // 40-100%: firewall panel grows from accent (right-side, ~340px) to large centered (~720px)
    handoff.fromTo(
      '.hero-firewall-wrap',
      {
        scale: 0.48,
        x: '20%',
        y: '10%',
        opacity: 0.4,
      },
      {
        scale: 1,
        x: '0%',
        y: '0%',
        opacity: 1,
        ease: 'power2.out',
        duration: 0.6,
      },
      0.4
    );

    // 70-100%: "Every action, inspected." label fades in beneath firewall
    handoff.fromTo(
      '.hero-handoff-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      0.85
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  return (
    <section
      ref={container}
      id="hero"
      className="relative min-h-[88vh] md:min-h-screen bg-[var(--color-bg)] overflow-hidden"
    >
      {/* Decorative full-bleed grid (radial mask so it fades at edges) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 30% 50%, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 30% 50%, black 25%, transparent 75%)',
        }}
      />

      {/* Faint corner brackets */}
      <span aria-hidden="true" className="hero-corner hidden md:block absolute top-24 left-6 md:left-10 w-12 h-12 border-t-2 border-l-2 border-[var(--color-border-strong)] opacity-50" />
      <span aria-hidden="true" className="hero-corner hidden md:block absolute top-24 right-6 md:right-10 w-12 h-12 border-t-2 border-r-2 border-[var(--color-border-strong)] opacity-50" />
      <span aria-hidden="true" className="hero-corner hidden md:block absolute bottom-10 left-6 md:left-10 w-12 h-12 border-b-2 border-l-2 border-[var(--color-border-strong)] opacity-50" />
      <span aria-hidden="true" className="hero-corner hidden md:block absolute bottom-10 right-6 md:right-10 w-12 h-12 border-b-2 border-r-2 border-[var(--color-border-strong)] opacity-50" />

      {/* Vertical orbit dots on the left edge — subtle motion ornament */}
      <div aria-hidden="true" className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col items-center gap-3 z-10">
        <span className="block w-px h-20 bg-[var(--color-border-strong)]" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-text-dark)]" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] hero-orbit-dot" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-text-dark)]" />
        <span className="block w-px h-20 bg-[var(--color-border-strong)]" />
      </div>

      {/* Live verdict marquee — runs along the bottom of the hero (desktop pin) */}
      <div
        className="hero-marquee hidden md:block absolute bottom-0 left-0 right-0 z-10 overflow-hidden border-t border-[var(--color-border)] py-3 md:py-4"
        style={{ background: 'var(--color-bg)', isolation: 'isolate' }}
      >
        <div className="hero-marquee-track flex items-center gap-8 md:gap-12 whitespace-nowrap will-change-transform font-mono text-[10px] md:text-[11px] uppercase tracking-[0.16em] md:tracking-[0.18em] text-[var(--color-text-medium)]">
          {Array.from({ length: 2 }).flatMap((_, dup) =>
            [
              { dot: 'var(--color-success)', label: 'ALLOWED · summarize inbox.recent' },
              { dot: 'var(--color-danger)', label: 'BLOCKED · delete /users/42 · outside task scope' },
              { dot: 'var(--color-primary)', label: 'DOWN-SCOPED · billing.* → billing.summary' },
              { dot: 'var(--color-success)', label: 'ALLOWED · query analytics.daily' },
              { dot: 'var(--color-danger)', label: 'BLOCKED · post /email/send · exceeds scope' },
              { dot: 'var(--color-primary)', label: 'DOWN-SCOPED · pii.email · masked' },
              { dot: 'var(--color-success)', label: 'ALLOWED · get schedule.today' },
              { dot: 'var(--color-danger)', label: 'BLOCKED · write audit.override · policy violation' },
            ].map((it, i) => (
              <span key={`${dup}-${i}`} className="inline-flex items-center gap-3 flex-shrink-0">
                <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ background: it.dot }} />
                <span>{it.label}</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Rotating circular badge — qclay signature, anchored bottom-left of viewport */}
      <a
        href="#problem"
        aria-label="Scroll down to see ArmorIQ in action"
        className="hero-badge hidden md:flex group absolute bottom-12 right-12 lg:right-20 w-32 h-32 lg:w-36 lg:h-36 items-center justify-center z-20"
      >
        <svg
          className="absolute inset-0 w-full h-full hero-badge-spin"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <path id="hero-badge-circle" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
          </defs>
          <text
            fontFamily="var(--font-mono)"
            fontSize="13"
            letterSpacing="6"
            fill="var(--color-text-medium)"
            textLength="490"
            lengthAdjust="spacing"
          >
            <textPath href="#hero-badge-circle">
              SCROLL · INTENT · POLICY · AUDIT ·
            </textPath>
          </text>
        </svg>
        <span className="relative w-12 h-12 rounded-full bg-[var(--color-text-dark)] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1V13M1 7L7 13L13 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>

      <div className="relative md:min-h-screen flex items-center pt-12 md:pt-20 pb-10 md:pb-28">
        <Container className="w-full">
          <div className="relative w-full">
            {/* Text layer */}
            <div className="hero-text relative z-10 max-w-[1400px]">
              <div
                className="hero-eyebrow flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mb-6 md:mb-8"
                style={{ opacity: 0 }}
              >
                <span>― 01</span>
                <span>Control Fabric for Autonomous Agents</span>
              </div>

              <h1
                className="hero-headline font-bold text-[var(--color-text-dark)] mb-8 md:mb-14"
                style={{
                  fontSize: 'clamp(44px, 12vw, 200px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                }}
              >
                {['Stop', 'AI', 'agents', 'from', 'going'].map((w, i) => (
                  <span key={i}>
                    <span className="split-mask">
                      <span
                        className="split-inner"
                        style={{ transform: 'translateY(130%)' }}
                      >
                        {w}
                      </span>
                    </span>
                    {' '}
                  </span>
                ))}
                <span className="rogue-wrap relative inline-block overflow-hidden align-bottom">
                  <span className="split-mask">
                    <span
                      className="split-inner inline-block"
                      style={{
                        transform: 'translateY(130%)',
                        textDecoration: 'underline',
                        textDecorationColor: 'var(--color-primary)',
                        textDecorationThickness: '0.06em',
                        textUnderlineOffset: '0.18em',
                        textDecorationSkipInk: 'auto',
                      }}
                    >
                      rogue.
                    </span>
                  </span>
                  {/* sweep mask — collapses from right→left to reveal the underlined text */}
                  <span
                    aria-hidden="true"
                    className="rogue-underline absolute inset-0 bg-[var(--color-bg)] pointer-events-none"
                    style={{
                      transform: 'scaleX(1)',
                      transformOrigin: 'right',
                    }}
                  />
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-10 md:mt-12">
                <div className="hero-cta" style={{ opacity: 0 }}>
                  <QDiscButton href="#cta">Book a Demo</QDiscButton>
                </div>
                <div className="hero-cta" style={{ opacity: 0 }}>
                  <Button as="a" href="#" variant="ghost">
                    View Docs <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Firewall layer — desktop only, absolute, grows over scroll */}
            {!showMobile && (
              <div
                className="hero-firewall-wrap absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: 'min(720px, 55vw)',
                  aspectRatio: '1 / 1',
                  transform: 'translate(-50%, -50%)',
                  transformOrigin: 'center center',
                }}
              >
                <div className="pointer-events-auto">
                  <HeroAnimation />
                </div>
                <div
                  className="hero-handoff-label absolute left-0 right-0 text-center mt-6 font-bold text-[var(--color-text-dark)]"
                  style={{
                    top: '100%',
                    fontSize: 'clamp(28px, 3.5vw, 56px)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    opacity: 0,
                  }}
                >
                  Every action, inspected.
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Mobile fallback — stack the firewall below the hero text */}
      {showMobile && (
        <div className="px-6 pb-16">
          <HeroAnimation />
          <p
            className="mt-8 text-center font-bold text-[var(--color-text-dark)]"
            style={{ fontSize: 'clamp(22px, 5.5vw, 32px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
          >
            Every action, inspected.
          </p>
        </div>
      )}

      {/* Mobile-only verdict marquee at the bottom of the hero (in-flow, no overlap) */}
      {showMobile && (
        <div
          className="overflow-hidden border-t border-[var(--color-border)] py-3"
          style={{ background: 'var(--color-bg)' }}
        >
          <div className="hero-marquee-track flex items-center gap-8 whitespace-nowrap will-change-transform font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-medium)]">
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              [
                { dot: 'var(--color-success)', label: 'ALLOWED · summarize inbox.recent' },
                { dot: 'var(--color-danger)', label: 'BLOCKED · delete /users/42' },
                { dot: 'var(--color-primary)', label: 'DOWN-SCOPED · billing.* → billing.summary' },
                { dot: 'var(--color-success)', label: 'ALLOWED · query analytics.daily' },
              ].map((it, i) => (
                <span key={`m-${dup}-${i}`} className="inline-flex items-center gap-3 flex-shrink-0">
                  <span className="block w-2 h-2 rounded-full flex-shrink-0" style={{ background: it.dot }} />
                  <span>{it.label}</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}
