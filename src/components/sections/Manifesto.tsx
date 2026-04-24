'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { useMediaQuery } from '@/lib/useMediaQuery';

type Line = {
  prefix: string;
  emphasis?: string;
  emphasisSuffix?: string;
};

const lines: Line[] = [
  { prefix: 'Most AI failures are not model failures.' },
  { prefix: 'Most AI failures are ', emphasis: 'INTENT', emphasisSuffix: ' failures.' },
  { prefix: 'The model did what you asked.' },
  { prefix: 'The ', emphasis: 'AGENT', emphasisSuffix: " did something you didn't." },
  { prefix: 'ArmorIQ checks ', emphasis: 'PURPOSE', emphasisSuffix: '.' },
];

function LineRender({ line }: { line: Line }) {
  return (
    <>
      {line.prefix}
      {line.emphasis && (
        <span className="relative inline-block">
          <span className="text-[var(--color-primary)]">{line.emphasis}</span>
          <span
            aria-hidden="true"
            className="emphasis-underline absolute left-0 right-0"
            style={{
              bottom: '0.04em',
              height: '0.06em',
              background: 'var(--color-primary)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
            }}
          />
        </span>
      )}
      {line.emphasisSuffix}
    </>
  );
}

export function Manifesto() {
  const container = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || isDesktop === false) return;
    if (isDesktop === null) return;

    const lineEls = container.current.querySelectorAll<HTMLElement>('.manifesto-line');
    if (lineEls.length === 0) return;

    // Initial state: all lines hidden except the first
    lineEls.forEach((el, i) => {
      gsap.set(el, {
        opacity: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 40,
        filter: i === 0 ? 'blur(0px)' : 'blur(8px)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        width: '100%',
      });
    });

    // Pin + scrub timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // For each line after the first, fade previous out, fade current in
    for (let i = 1; i < lineEls.length; i++) {
      const prev = lineEls[i - 1];
      const curr = lineEls[i];
      tl.to(prev, {
        opacity: 0,
        y: -40,
        filter: 'blur(8px)',
        duration: 0.4,
        ease: 'power2.inOut',
      }, i - 1);
      tl.to(curr, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.4,
        ease: 'power2.inOut',
      }, i - 1 + 0.1);
      // Emphasis underline draw if present
      const underline = curr.querySelector<HTMLElement>('.emphasis-underline');
      if (underline) {
        tl.fromTo(
          underline,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.3, ease: 'power3.out' },
          i - 1 + 0.4
        );
      }
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container, dependencies: [isDesktop] });

  // Mobile: stacked reveals
  if (isDesktop === false) {
    return (
      <section
        ref={container}
        className="py-32 md:py-48 bg-[var(--color-bg)] overflow-hidden"
      >
        <Container>
          <div className="flex flex-col gap-20 max-w-3xl mx-auto">
            {lines.map((line, i) => (
              <p
                key={i}
                className="manifesto-line-mobile font-bold text-[var(--color-text-dark)] text-center"
                style={{
                  fontSize: 'clamp(32px, 6vw, 56px)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                }}
              >
                <LineRender line={{ ...line }} />
              </p>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={container}
      className="relative h-screen bg-[var(--color-bg)] overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Container>
          <div className="relative w-full max-w-[900px] mx-auto" style={{ minHeight: '280px' }}>
            {lines.map((line, i) => (
              <p
                key={i}
                className="manifesto-line font-bold text-[var(--color-text-dark)] text-center"
                style={{
                  fontSize: 'clamp(40px, 6vw, 104px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  willChange: 'transform, opacity, filter',
                }}
              >
                <LineRender line={line} />
              </p>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
