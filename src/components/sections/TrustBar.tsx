'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Marquee } from '@/components/ui/Marquee';

const logos = ['verily', 'carid', 'google', 'paypal', 'intuit', 'hbc'];

export function TrustBar() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      ref.current.querySelectorAll('.logo-item'),
      { opacity: 0, y: 12 },
      {
        opacity: 0.6,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      }
    );
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <section
      ref={ref}
      className="py-16 md:py-20 border-y border-[var(--color-border)] bg-white"
    >
      <Container>
        <p className="text-center text-[13px] font-mono uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-10">
          Trusted by security leaders from teams at
        </p>

        {/* Desktop: static grid */}
        <div className="hidden md:grid grid-cols-6 gap-10 items-center">
          {logos.map((l) => (
            <div key={l} className="logo-item flex items-center justify-center" style={{ opacity: 0 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/images/logos/${l}.svg`}
                alt={`${l} logo`}
                className="max-h-7 w-auto transition-all duration-300 hover:opacity-100 hover:[filter:none]"
                style={{ filter: 'grayscale(1) brightness(0.4)' }}
              />
            </div>
          ))}
        </div>

        {/* Mobile: marquee */}
        <div className="md:hidden">
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
        </div>
      </Container>
    </section>
  );
}
