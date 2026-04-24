'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { HeroAnimation } from './HeroAnimation';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SplitText } from '@/components/ui/SplitText';

export function HeroShowcase() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const heading = ref.current.querySelector('.showcase-heading');
    if (heading) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(heading.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.04,
            duration: 0.9,
            ease: 'power3.out',
          });
        },
      });
    }
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="hero-showcase"
      className="py-32 md:py-48 lg:py-56 bg-[var(--color-bg)]"
    >
      <Container>
        <div className="max-w-4xl mx-auto text-center mb-20 md:mb-24">
          <SectionEyebrow
            num="—"
            label="The firewall in action"
            className="mb-6 justify-center max-w-sm mx-auto"
          />
          <h2
            className="showcase-heading font-bold text-[var(--color-text-dark)]"
            style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">Every action, inspected.</SplitText>
          </h2>
        </div>

        <div className="mx-auto max-w-[900px]">
          <HeroAnimation />
        </div>
      </Container>
    </section>
  );
}
