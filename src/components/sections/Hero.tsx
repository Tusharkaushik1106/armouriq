'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { HeroAnimation } from './HeroAnimation';

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
        { y: 0, stagger: 0.06, duration: 0.8, ease: 'power3.out' },
        0.2
      )
      .fromTo(
        '.rogue-underline',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: 'power3.out' },
        0.9
      )
      .fromTo(
        '.hero-sub',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        1.1
      )
      .fromTo(
        '.hero-cta',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' },
        1.3
      )
      .add('animStart', 1.5);
  }, { scope: container });

  return (
    <section ref={container} className="relative pt-12 pb-20 md:pt-20 md:pb-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-16 items-center">
          <div>
            <div
              className="hero-eyebrow font-mono text-[11px] md:text-[12px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-6"
              style={{ opacity: 0 }}
            >
              Control Fabric for Autonomous Agents
            </div>

            <h1
              className="hero-headline font-bold text-[var(--color-text-dark)] mb-7"
              style={{
                fontSize: 'clamp(44px, 7vw, 92px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
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
                      height: '0.08em',
                      background: 'var(--color-primary)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                </span>
              </span>
            </h1>

            <p
              className="hero-sub text-[17px] md:text-[18px] font-light leading-[1.6] text-[var(--color-text-medium)] max-w-[58ch] mb-9"
              style={{ opacity: 0 }}
            >
              ArmorIQ is the control fabric harness for autonomous agents — sitting between AI agents and governance domains, intercepting plans, routing to the safest mix of agents and tools, and enforcing policy before a single action runs.
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

          <div className="hero-anim w-full">
            <HeroAnimation />
          </div>
        </div>
      </Container>
    </section>
  );
}
