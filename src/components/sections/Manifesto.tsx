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

function ManifestoMobile({ lines }: { lines: Line[] }) {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = container.current.querySelectorAll<HTMLElement>('.manifesto-line-mobile');
    const underlines = container.current.querySelectorAll<HTMLElement>('.emphasis-underline');
    if (reduced) {
      gsap.set(els, { opacity: 1, y: 0, scale: 1 });
      gsap.set(underlines, { scaleX: 1 });
      return;
    }
    els.forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 30,
        scale: 0.96,
        duration: 0.8,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 95%', once: true, toggleActions: 'play none none none' },
      });
    });
    underlines.forEach((u) => {
      gsap.fromTo(
        u,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: u.parentElement, start: 'top 80%', once: true },
        }
      );
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  return (
    <section ref={container} className="py-20 md:py-48 bg-[var(--color-bg)] overflow-hidden">
      <Container>
        <div className="flex flex-col gap-16 max-w-3xl mx-auto">
          {lines.map((line, i) => (
            <p
              key={i}
              className="manifesto-line-mobile font-bold text-[var(--color-text-dark)] text-center will-change-transform"
              style={{
                fontSize: 'clamp(28px, 7vw, 56px)',
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

    const progressBar = container.current.querySelector<HTMLElement>('.manifesto-progress');
    const counter = container.current.querySelector<HTMLElement>('.manifesto-counter');
    const pips = container.current.querySelectorAll<HTMLElement>('.manifesto-pip');
    if (pips.length) gsap.set(pips[0], { backgroundColor: 'var(--color-text-dark)', height: 32 });

    // Pin + scrub timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progressBar) gsap.set(progressBar, { scaleX: self.progress });
          const idx = Math.min(lineEls.length - 1, Math.floor(self.progress * lineEls.length));
          if (counter) counter.textContent = String(idx + 1).padStart(2, '0');
          pips.forEach((p, i) => {
            gsap.set(p, {
              backgroundColor:
                i <= idx ? 'var(--color-text-dark)' : 'var(--color-border-strong)',
              height: i === idx ? 32 : 24,
            });
          });
        },
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

  // Mobile: stacked reveals with scroll-triggered fade + scale + emphasis underline
  if (isDesktop === false) {
    return (
      <ManifestoMobile lines={lines} />
    );
  }

  return (
    <section
      ref={container}
      className="relative h-screen bg-[var(--color-bg)] overflow-hidden"
    >
      {/* Decorative grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
        }}
      />

      {/* Top eyebrow */}
      <div className="absolute top-10 left-0 right-0 z-10">
        <Container>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-light)]">
            <span>― The Thesis</span>
            <span>Intent · Purpose · Action</span>
          </div>
        </Container>
      </div>

      {/* Giant ghost numeral behind */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-bold text-[var(--color-border)] leading-none"
          style={{
            fontSize: 'clamp(280px, 42vw, 720px)',
            letterSpacing: '-0.06em',
            opacity: 0.55,
          }}
        >
          IQ
        </span>
      </div>

      {/* Side rail tickers */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-light)]">
        <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
          ArmorIQ · Manifesto
        </span>
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 items-center">
        {lines.map((_, i) => (
          <span
            key={i}
            className="manifesto-pip block w-[2px] h-6 rounded-full bg-[var(--color-border-strong)]"
            data-i={i}
          />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <Container>
          <div className="relative w-full max-w-[1100px] mx-auto" style={{ minHeight: '280px' }}>
            {lines.map((line, i) => (
              <p
                key={i}
                className="manifesto-line font-bold text-[var(--color-text-dark)] text-center"
                style={{
                  fontSize: 'clamp(36px, 5vw, 88px)',
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

      {/* Bottom progress + counter */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <Container>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-light)]">
            <span className="manifesto-counter w-10 text-[var(--color-text-dark)]">01</span>
            <span className="opacity-60">/</span>
            <span>{String(lines.length).padStart(2, '0')}</span>
            <div className="flex-1 h-[2px] bg-[var(--color-border)] rounded-full overflow-hidden">
              <span
                className="manifesto-progress block h-full origin-left bg-[var(--color-primary)]"
                style={{ width: '100%', transform: 'scaleX(0)' }}
              />
            </div>
            <span>Scroll</span>
          </div>
        </Container>
      </div>
    </section>
  );
}
