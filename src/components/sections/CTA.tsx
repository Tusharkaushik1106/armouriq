'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';

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
      // pulse the primary button
      gsap.to(ref.current.querySelector('.cta-primary'), {
        scale: 1.02,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(224,123,76,0.06), transparent 70%)',
        }}
        aria-hidden="true"
      />
      <Container className="relative text-center">
        <h2
          className="cta-heading font-bold text-[var(--color-text-dark)] mx-auto max-w-[800px] mb-6"
          style={{ fontSize: 'clamp(34px, 4.5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          <SplitText splitBy="char">Ready to </SplitText>
          <span className="relative inline-block">
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
          <div className="cta-btn cta-primary" style={{ opacity: 0 }}>
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
      </Container>
    </section>
  );
}
