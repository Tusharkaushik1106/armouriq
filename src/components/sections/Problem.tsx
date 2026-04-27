'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { SplitText } from '@/components/ui/SplitText';
import { ProblemIllustration } from './ProblemIllustration';

export function Problem() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(
        ref.current.querySelectorAll(
          '.split-inner, .problem-reveal, .problem-badge, .problem-eyebrow, .problem-body'
        ),
        { opacity: 1, y: 0, scale: 1, x: 0 }
      );
      return;
    }
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 70%' },
    });
    tl.fromTo(
      ref.current.querySelector('.problem-eyebrow'),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    )
      .to('.problem-headline .split-inner', {
        y: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.2')
      .fromTo(
        ref.current.querySelector('.problem-body'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(
        ref.current.querySelector('.problem-badge'),
        { opacity: 0, scale: 0.85, x: -6 },
        { opacity: 1, scale: 1, x: 0, duration: 0.5, ease: 'back.out(1.6)' },
        '-=0.2'
      );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <section ref={ref} id="problem" className="py-20 md:py-48 lg:py-56 bg-[var(--color-bg)]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14 lg:gap-20 items-center">
          <div>
            <div
              className="problem-eyebrow flex items-center justify-between gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mb-6"
              style={{ opacity: 0 }}
            >
              <span>― 02</span>
              <span>The Problem</span>
            </div>
            <h2
              className="problem-headline text-[var(--color-text-dark)] mb-7"
              style={{
                fontSize: 'clamp(36px, 7vw, 112px)',
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
              }}
            >
              <SplitText splitBy="word">{"AI agents don't just"}</SplitText>{' '}
              <span
                className="line-through text-[var(--color-text-light)]"
                style={{
                  textDecorationColor: 'var(--color-primary)',
                  textDecorationThickness: '0.06em',
                }}
              >
                <SplitText splitBy="word">generate text.</SplitText>
              </span>{' '}
              <SplitText splitBy="word">They take</SplitText>{' '}
              <span className="text-[var(--color-primary)]">
                <SplitText splitBy="word">actions.</SplitText>
              </span>
            </h2>
            <p
              className="problem-body text-[17px] font-light leading-[1.7] text-[var(--color-text-medium)] max-w-[60ch] mb-7"
              style={{ opacity: 0 }}
            >
              Authenticated doesn&apos;t mean aligned. Your agents can have valid credentials and still act outside the task they were given. ArmorIQ sits between your Agents and Governance Domains, intercepting intent, enforcing policy, and ensuring every action belongs to an approved purpose.
            </p>
            <div className="problem-badge mb-10" style={{ opacity: 0 }}>
              <Badge variant="danger">Action Blocked — Outside task scope</Badge>
            </div>
            <div className="problem-stats grid grid-cols-3 gap-6 max-w-xl pt-8 border-t border-[var(--color-border)]">
              <div>
                <div className="font-bold text-[var(--color-text-dark)]" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em' }}>73%</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mt-2 leading-snug">Agent actions touch sensitive data</div>
              </div>
              <div>
                <div className="font-bold text-[var(--color-text-dark)]" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em' }}>1 in 6</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mt-2 leading-snug">Plans drift outside intent</div>
              </div>
              <div>
                <div className="font-bold text-[var(--color-primary)]" style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em' }}>0</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mt-2 leading-snug">Enforcement at runtime today</div>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center h-full">
            <ProblemIllustration />
          </div>
        </div>
      </Container>
    </section>
  );
}
