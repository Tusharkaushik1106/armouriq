'use client';
import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap, ScrollTrigger, Flip, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type Product = {
  key: string;
  title: string;
  tag: string;
  body: string;
  linkText: string;
  linkHref: string;
  icon: ReactNode;
};

const products: Product[] = [
  {
    key: 'intent',
    title: 'Intent Engine',
    tag: 'The Brain',
    body: 'Define what your agents can do. Set boundaries. Enforce them automatically.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="8" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="22" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10.5" y1="11.5" x2="13.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="21.5" y1="11.5" x2="18.5" y2="14.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10.5" y1="20.5" x2="13.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" />
        <line x1="21.5" y1="20.5" x2="18.5" y2="17.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'sentry',
    title: 'Sentry',
    tag: 'The Eyes',
    body: 'See every agent action in real time. Get alerts when agents approach their limits.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9-14-9-14-9z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    key: 'gatekeeper',
    title: 'Gatekeeper',
    tag: 'The Guard',
    body: 'Control which agents can access which resources. Like IAM, but for AI behavior.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 3L5 7v9c0 6 4.5 11 11 13 6.5-2 11-7 11-13V7L16 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11 16l3.5 3.5L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'registry',
    title: 'Registry',
    tag: 'The Map',
    body: "One dashboard for all your agents. Know what's deployed, where, and what it can do.",
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 8h24M4 16h24M4 24h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="14" cy="16" r="1.5" fill="currentColor" />
        <circle cx="20" cy="24" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'auditor',
    title: 'Auditor',
    tag: 'The Record',
    body: 'Automatic audit logs for every agent decision. SOC2, GDPR, and NIST ready.',
    linkText: 'Learn more',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M8 3h13l6 6v17a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M20 3v7h7M11 16h12M11 21h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'armorclaw',
    title: 'ArmorClaw',
    tag: 'Open Source',
    body: 'Intent Assurance for OpenClaw agents. Cryptographic verification at every step.',
    linkText: 'Explore on GitHub',
    linkHref: '#',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M11 7L4 16l7 9M21 7l7 9-7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="6" x2="14" y2="26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      gsap.fromTo(
        container.current.querySelectorAll('.product-card'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: container.current.querySelector('.product-grid'), start: 'top 80%' },
        }
      );
      return;
    }

    const grid = container.current.querySelector<HTMLElement>('.product-grid');
    if (!grid) return;
    const cards = gsap.utils.toArray<HTMLElement>('.product-card');

    const finalState = Flip.getState(cards);

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
  }, { scope: container });

  return (
    <section ref={container} id="products" className="py-32 md:py-48 lg:py-56 bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-3xl mb-20 md:mb-24">
          <SectionEyebrow num="04" label="The Platform" className="mb-6" />
          <h2
            className="products-heading font-bold text-[var(--color-text-dark)] mb-6"
            style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">One platform. Full control.</SplitText>
          </h2>
          <p className="text-[18px] md:text-[20px] font-light leading-[1.55] text-[var(--color-text-medium)] max-w-xl">
            Everything you need to safely run AI agents in production.
          </p>
        </div>

        <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((p) => (
            <div
              key={p.key}
              className="product-card group relative bg-white border border-[var(--color-border)] rounded-xl p-8 md:p-10 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[280px]"
            >
              <div className="text-[var(--color-text-dark)] mb-8">{p.icon}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)] mb-3">
                {p.tag}
              </div>
              <h3 className="text-[26px] font-medium text-[var(--color-text-dark)] tracking-[-0.01em] mb-4">
                {p.title}
              </h3>
              <p className="text-[16px] font-light leading-[1.6] text-[var(--color-text-medium)] flex-1">
                {p.body}
              </p>
              <a
                href={p.linkHref}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-dark)] underline-slide self-start"
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
