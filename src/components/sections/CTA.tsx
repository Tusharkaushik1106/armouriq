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
            stagger: 0.012,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.fromTo(
            '.cta-underline',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: 'power3.out', delay: 0.9 }
          );
        },
      });
    }

    if (!reduced) {
      // Single scrollTrigger-driven timeline for sub + buttons + rule
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      });
      tl.fromTo(
        ref.current.querySelector('.cta-sub'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
        .fromTo(
          ref.current.querySelectorAll('.cta-btn'),
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, stagger: 0.1, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.cta-rule',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.3'
        );
    }
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="cta"
      className="min-h-screen flex items-center bg-[var(--color-surface)] py-32 md:py-48"
    >
      <Container className="relative text-center">
        <h2
          className="cta-heading font-bold text-[var(--color-text-dark)] mx-auto max-w-[1400px] mb-10"
          style={{ fontSize: 'clamp(56px, 12vw, 200px)', letterSpacing: '-0.04em', lineHeight: 0.95 }}
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
          className="cta-sub text-[22px] md:text-[24px] font-light leading-[1.45] text-[var(--color-text-medium)] max-w-[48ch] mx-auto mb-14"
          style={{ opacity: 0 }}
        >
          Join the teams building safer, compliant AI agent deployments.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="cta-btn" style={{ opacity: 0 }}>
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

        <div
          className="cta-rule mx-auto mt-14 h-[1px] bg-[var(--color-primary)]"
          style={{ width: '120px', transform: 'scaleX(0)', transformOrigin: 'center' }}
          aria-hidden="true"
        />
      </Container>
    </section>
  );
}
