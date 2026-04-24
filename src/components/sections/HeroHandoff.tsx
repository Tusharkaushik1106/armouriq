'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroAnimation } from './HeroAnimation';

export function HeroHandoff() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Intro timeline — on mount (no scroll)
    if (!reduced) {
      const intro = gsap.timeline({ delay: 2.3 });
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
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power3.out' },
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
      gsap.set('.rogue-underline', { scaleX: 1 });
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
      className="relative min-h-screen bg-[var(--color-bg)]"
    >
      <div className="relative h-screen flex items-center">
        <Container className="w-full">
          <div className="relative w-full">
            {/* Text layer */}
            <div className="hero-text relative z-10 max-w-[1400px]">
              <div
                className="hero-eyebrow flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mb-10 md:mb-14"
                style={{ opacity: 0 }}
              >
                <span>― 01</span>
                <span>Control Fabric for Autonomous Agents</span>
              </div>

              <h1
                className="hero-headline font-bold text-[var(--color-text-dark)] mb-12 md:mb-14"
                style={{
                  fontSize: 'clamp(64px, 12vw, 200px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                }}
              >
                {['Stop', 'AI', 'agents', 'from', 'going'].map((w, i) => (
                  <span key={i} className="split-mask">
                    <span
                      className="split-inner"
                      style={{ transform: 'translateY(100%)' }}
                    >
                      {w}
                      {' '}
                    </span>
                  </span>
                ))}
                <span className="split-mask">
                  <span
                    className="split-inner relative inline-block"
                    style={{ transform: 'translateY(100%)' }}
                  >
                    rogue.
                    <span
                      aria-hidden="true"
                      className="rogue-underline absolute left-0 right-0"
                      style={{
                        bottom: '0.08em',
                        height: '0.06em',
                        background: 'var(--color-primary)',
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                      }}
                    />
                  </span>
                </span>
              </h1>

              <p
                className="hero-sub text-[20px] md:text-[24px] font-light leading-[1.5] text-[var(--color-text-medium)] max-w-[54ch] mb-12"
                style={{ opacity: 0 }}
              >
                ArmorIQ is the control fabric for autonomous agents — sitting between AI agents and governance domains, intercepting plans and enforcing policy before a single action runs.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="hero-cta" style={{ opacity: 0 }}>
                  <Button as="a" href="#cta" variant="primary" magnetic>
                    Book a Demo
                  </Button>
                </div>
                <div className="hero-cta" style={{ opacity: 0 }}>
                  <Button as="a" href="#" variant="ghost">
                    View Docs <span aria-hidden="true">→</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Firewall layer — absolute, grows over scroll */}
            <div
              className="hero-firewall-wrap hidden md:block absolute top-1/2 left-1/2 pointer-events-none"
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
          </div>
        </Container>
      </div>

      {/* Mobile fallback — stack the firewall below the hero text */}
      <div className="md:hidden px-6 pb-20">
        <HeroAnimation />
        <p
          className="mt-6 text-center font-bold text-[var(--color-text-dark)]"
          style={{ fontSize: 'clamp(24px, 6vw, 36px)', letterSpacing: '-0.02em', lineHeight: 1.15 }}
        >
          Every action, inspected.
        </p>
      </div>
    </section>
  );
}
