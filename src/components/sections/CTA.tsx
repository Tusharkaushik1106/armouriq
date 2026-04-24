'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';

const ambientMarks = [
  { text: ':: policy-check', top: '18%', left: '8%' },
  { text: ':: intent-verified', top: '32%', right: '10%' },
  { text: ':: scope-evaluated', top: '68%', left: '12%' },
  { text: ':: audit-logged', top: '78%', right: '8%' },
  { text: ':: signature-valid', top: '48%', left: '6%' },
];

export function CTA() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heading = ref.current.querySelector('.cta-heading');
    if (heading) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (reduced) {
            gsap.set(heading.querySelectorAll('.split-inner'), { y: 0 });
            gsap.set('.cta-underline', { scaleX: 1 });
            gsap.set('.cta-annotation', { opacity: 1, y: 0 });
            return;
          }
          gsap.to(heading.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.015,
            duration: 0.7,
            ease: 'power3.out',
          });
          gsap.fromTo(
            '.cta-underline',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 0.7 }
          );
          gsap.fromTo(
            '.cta-annotation',
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 1.1 }
          );
        },
      });
    }

    if (!reduced) {
      gsap.fromTo(
        ref.current.querySelector('.cta-sub'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        ref.current.querySelectorAll('.cta-btn'),
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.cta-trust',
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );
      gsap.fromTo(
        '.cta-rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.5,
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );
      // Pulse the primary button with outer glow
      const primary = ref.current.querySelector<HTMLElement>('.cta-primary');
      if (primary) {
        gsap.to(primary, {
          scale: 1.02,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to(primary, {
          boxShadow: '0 0 0 8px rgba(224,123,76,0.08), 0 8px 24px rgba(224,123,76,0.12)',
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Ambient marks fade in/out on individual cycles
      ref.current.querySelectorAll<HTMLElement>('.ambient-mark').forEach((m, i) => {
        gsap.set(m, { opacity: 0 });
        gsap.to(m, {
          opacity: 0.22,
          duration: 1.5,
          delay: i * 1.4,
          repeat: -1,
          yoyo: true,
          repeatDelay: gsap.utils.random(2, 5),
          ease: 'sine.inOut',
        });
      });
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="cta"
      className="py-32 md:py-44 bg-[var(--color-surface)] relative overflow-hidden"
    >
      {/* More-visible background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,45,45,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      {/* Warmer radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(224,123,76,0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient mono marks scattered */}
      {ambientMarks.map((m, i) => (
        <span
          key={i}
          className="ambient-mark absolute font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-light)] pointer-events-none"
          style={{
            top: m.top,
            ...(m.left ? { left: m.left } : { right: m.right }),
            opacity: 0,
          }}
          aria-hidden="true"
        >
          {m.text}
        </span>
      ))}

      <Container className="relative text-center">
        <h2
          className="cta-heading font-bold text-[var(--color-text-dark)] mx-auto max-w-[820px] mb-6 relative"
          style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          <SplitText splitBy="char">Ready to </SplitText>
          <span className="relative inline-block">
            <span
              className="cta-annotation absolute -top-6 md:-top-7 left-1/2 -translate-x-1/2 font-mono text-[10px] md:text-[11px] text-[var(--color-text-light)] whitespace-nowrap normal-case tracking-[0.1em]"
              style={{ opacity: 0, letterSpacing: '0.05em' }}
              aria-hidden="true"
            >
              (← the only word that matters)
            </span>
            <SplitText splitBy="char">control</SplitText>
            <span
              aria-hidden="true"
              className="cta-underline absolute left-0 right-0"
              style={{
                bottom: '0.04em',
                height: '0.08em',
                background: 'var(--color-primary)',
                transform: 'scaleX(0)',
                transformOrigin: 'left',
              }}
            />
          </span>
          <SplitText splitBy="char"> what your AI agents actually do?</SplitText>
        </h2>
        <p
          className="cta-sub text-[17px] md:text-[18px] font-light leading-[1.6] text-[var(--color-text-medium)] max-w-xl mx-auto mb-10"
          style={{ opacity: 0 }}
        >
          Join the teams building safer, compliant AI agent deployments.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="cta-btn cta-primary rounded-lg" style={{ opacity: 0 }}>
            <Button as="a" href="#" variant="primary" magnetic>
              Book a Demo
            </Button>
          </div>
          <div className="cta-btn" style={{ opacity: 0 }}>
            <Button as="a" href="#" variant="ghost">
              Read Docs <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>

        {/* Trust line */}
        <div
          className="cta-trust mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-light)]"
          style={{ opacity: 0 }}
        >
          No credit card <span className="mx-2 opacity-50">·</span>
          14-day trial <span className="mx-2 opacity-50">·</span>
          SOC2 certified
        </div>

        {/* Underline rule */}
        <div
          className="cta-rule mx-auto mt-8 h-[1px] bg-[var(--color-primary)]"
          style={{ width: '200px', transform: 'scaleX(0)', transformOrigin: 'center' }}
          aria-hidden="true"
        />
      </Container>
    </section>
  );
}
