'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';
import { SplitText } from '@/components/ui/SplitText';
import { useMediaQuery } from '@/lib/useMediaQuery';

const logos = ['verily', 'carid', 'google', 'paypal', 'intuit', 'hbc'];

export function TrustBar() {
  const ref = useRef<HTMLElement>(null);
  // null during SSR → assume desktop (grid). After mount switches if below md.
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const showMobile = isDesktop === false;

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = ref.current.querySelectorAll('.logo-item');
    const eyebrowChars = ref.current.querySelectorAll('.tb-eyebrow .split-inner');
    const rule = ref.current.querySelector('.tb-rule');
    const scanner = ref.current.querySelector('.tb-scanner');

    if (reduced) {
      gsap.set(items, { opacity: 0.6, y: 0, scale: 1 });
      gsap.set(eyebrowChars, { y: 0 });
      if (rule) gsap.set(rule, { scaleX: 1 });
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    });

    if (eyebrowChars.length) {
      tl.to(eyebrowChars, {
        y: 0,
        stagger: 0.012,
        duration: 0.4,
        ease: 'power3.out',
      });
    }

    if (rule) {
      tl.fromTo(
        rule,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.6, ease: 'power3.out', force3D: true },
        '-=0.2'
      );
    }

    if (items.length) {
      tl.fromTo(
        items,
        { opacity: 0, y: 12, scale: 0.94 },
        {
          opacity: 0.6,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.5,
          ease: 'power3.out',
          force3D: true,
        },
        '-=0.4'
      );
    }

    if (scanner) {
      const parent = (scanner as HTMLElement).parentElement;
      const max = parent ? parent.offsetWidth : 0;
      gsap.set(scanner, { x: 0 });
      tl.to(
        scanner,
        {
          x: max,
          duration: 2.6,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          force3D: true,
        },
        '-=0.3'
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref, dependencies: [isDesktop] });

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 bg-white"
    >
      <Container>
        <p className="tb-eyebrow text-center text-[13px] font-mono uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-10">
          <SplitText splitBy="char">Trusted by security leaders from teams at</SplitText>
        </p>

        {!showMobile && (
          <div className="relative">
            <div className="grid grid-cols-6 gap-10 items-center">
              {logos.map((l) => (
                <div
                  key={l}
                  className="logo-item flex items-center justify-center"
                  style={{ opacity: 0, willChange: 'transform, opacity' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/logos/${l}.svg`}
                    alt={`${l} logo`}
                    className="max-h-7 w-auto transition-all duration-300 hover:opacity-100 hover:[filter:none] hover:scale-110"
                    style={{ filter: 'grayscale(1) brightness(0.4)' }}
                  />
                </div>
              ))}
            </div>
            <div className="relative mt-10 h-px">
              <div
                className="tb-rule absolute inset-0 bg-[var(--color-border)]"
                style={{ transform: 'scaleX(0)', willChange: 'transform' }}
                aria-hidden="true"
              />
              <div
                className="tb-scanner absolute top-1/2"
                style={{
                  left: 0,
                  width: '60px',
                  height: '2px',
                  marginLeft: '-30px',
                  transform: 'translateY(-50%)',
                  background:
                    'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                  opacity: 0.6,
                  pointerEvents: 'none',
                  willChange: 'transform',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {showMobile && (
          <Marquee speed={40}>
            {logos.map((l) => (
              <div key={l} className="flex items-center justify-center px-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/logos/${l}.svg`}
                  alt={`${l} logo`}
                  className="max-h-5 w-auto"
                  style={{ filter: 'grayscale(1) brightness(0.4)', opacity: 0.6 }}
                />
              </div>
            ))}
          </Marquee>
        )}
      </Container>
    </section>
  );
}
