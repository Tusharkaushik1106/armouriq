'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(container.current.querySelectorAll('.hero-reveal, .split-inner'), { opacity: 1, y: 0 });
      gsap.set('.rogue-underline', { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 2.3 });
    tl.fromTo(
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
      )
      .fromTo(
        '.hero-scroll-hint',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        1.7
      );
  }, { scope: container });

  return (
    <section
      ref={container}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center py-20 md:py-32"
    >
      <Container>
        <div className="max-w-[1400px]">
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
      </Container>

      {/* Scroll hint at bottom */}
      <div
        className="hero-scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-light)] pointer-events-none flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        <span>Scroll</span>
        <span className="block w-px h-8 bg-[var(--color-text-light)]" />
      </div>
    </section>
  );
}
