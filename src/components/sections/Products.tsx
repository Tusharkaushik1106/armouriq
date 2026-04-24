'use client';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap, ScrollTrigger, Flip, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';

type Product = {
  title: string;
  tag: string;
  body: string;
  linkText: string;
  linkHref: string;
  icon: ReactNode;
};

const products: Product[] = [
  {
    title: 'Intent Engine',
    tag: 'The Brain',
    body: 'Define what your agents can do. Set boundaries. Enforce them automatically.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 2C6.5 2 4.5 4 4.5 6.5c-1 .5-1.5 1.5-1.5 2.5 0 1 .5 2 1.5 2.5 0 2.5 2 4.5 4.5 4.5h0V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 2c2.5 0 4.5 2 4.5 4.5 1 .5 1.5 1.5 1.5 2.5 0 1-.5 2-1.5 2.5 0 2.5-2 4.5-4.5 4.5h0V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Sentry',
    tag: 'The Eyes',
    body: 'See every agent action in real time. Get alerts when agents approach their limits.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Gatekeeper',
    tag: 'The Guard',
    body: 'Control which agents can access which resources. Like IAM, but for AI behavior.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2L4 5v7c0 4.5 3.5 8.5 8 10 4.5-1.5 8-5.5 8-10V5l-8-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Registry',
    tag: 'The Map',
    body: "One dashboard for all your agents. Know what's deployed, where, and what it can do.",
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="6" cy="6" r="1.25" fill="currentColor" />
        <circle cx="10" cy="12" r="1.25" fill="currentColor" />
        <circle cx="14" cy="18" r="1.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Auditor',
    tag: 'The Record',
    body: 'Automatic audit logs for every agent decision. SOC2, GDPR, and NIST ready.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'ArmorClaw',
    tag: 'Open Source',
    body: 'Intent Assurance for OpenClaw agents. Cryptographic verification at every step.',
    linkText: 'Explore on GitHub',
    linkHref: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M8 3L3 8l5 5M16 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 3l-4 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Products() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // heading reveal
    const heading = container.current.querySelector('.products-heading');
    if (heading) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (reduced) {
            gsap.set(heading.querySelectorAll('.split-inner'), { y: 0 });
            return;
          }
          gsap.to(heading.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.05,
            duration: 0.7,
            ease: 'power3.out',
          });
        },
      });
    }

    if (reduced || isMobile) {
      // simple stagger fade for mobile/reduced
      gsap.fromTo(
        container.current.querySelectorAll('.product-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: container.current.querySelector('.grid'), start: 'top 80%' },
        }
      );
      return;
    }

    const grid = container.current.querySelector<HTMLElement>('.product-grid');
    if (!grid) return;
    const cards = gsap.utils.toArray<HTMLElement>('.product-card');

    // Capture grid final state
    const finalState = Flip.getState(cards);

    // Apply stacked state
    grid.style.position = 'relative';
    grid.style.minHeight = '420px';
    cards.forEach((c, i) => {
      c.style.position = 'absolute';
      c.style.top = '0';
      c.style.left = '50%';
      c.style.width = 'min(420px, 80%)';
      c.style.transform = `translate(-50%, ${i * 6}px) rotate(${(i - 2.5) * 1.5}deg)`;
      c.style.zIndex = String(10 - i);
      c.style.opacity = i === 0 ? '1' : '0.7';
    });

    ScrollTrigger.create({
      trigger: grid,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        cards.forEach((c) => {
          c.style.cssText = '';
        });
        grid.style.minHeight = '';
        Flip.from(finalState, {
          duration: 1.1,
          stagger: 0.07,
          ease: 'power3.inOut',
          absolute: true,
          onEnter: (els) => gsap.to(els, { opacity: 1, duration: 0.4 }),
        });
      },
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  return (
    <section ref={container} id="products" className="py-24 md:py-36 bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
            The Platform
          </div>
          <h2
            className="products-heading font-bold text-[var(--color-text-dark)] mb-5"
            style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.08 }}
          >
            <SplitText splitBy="word">One platform. Full control.</SplitText>
          </h2>
          <p className="text-[17px] font-light leading-[1.6] text-[var(--color-text-medium)] max-w-xl">
            Everything you need to safely run AI agents in production.
          </p>
        </div>

        <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((p) => (
            <div
              key={p.title}
              className="product-card group bg-white border border-[var(--color-border)] rounded-xl p-7 md:p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1 hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col min-h-[260px]"
            >
              <div className="text-[var(--color-primary)] mb-6">{p.icon}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3">
                {p.tag}
              </div>
              <h3 className="text-[22px] font-medium text-[var(--color-text-dark)] tracking-[-0.01em] mb-3">
                {p.title}
              </h3>
              <p className="text-[15px] font-light leading-[1.6] text-[var(--color-text-medium)] flex-1">
                {p.body}
              </p>
              <a
                href={p.linkHref}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-dark)] underline-slide self-start"
              >
                {p.linkText}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
