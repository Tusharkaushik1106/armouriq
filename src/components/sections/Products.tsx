'use client';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
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
  features: string[];
  stat: { label: string; value: string };
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
    features: ['Policy DSL', 'Scope checks', 'Auto-enforce'],
    stat: { label: 'Decision latency', value: '<10ms' },
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
    features: ['Live trace', 'Anomaly alerts', 'Drift detection'],
    stat: { label: 'Visibility', value: '100% of calls' },
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
    features: ['RBAC', 'Token vault', 'Just-in-time'],
    stat: { label: 'Block rate', value: '99.98%' },
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
    features: ['Discovery', 'Ownership', 'Inventory'],
    stat: { label: 'Coverage', value: 'Every agent' },
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
    features: ['SOC2', 'GDPR', 'NIST AI RMF'],
    stat: { label: 'Audit format', value: 'Tamper-evident' },
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
    features: ['MIT license', 'OpenClaw SDK', 'Self-host'],
    stat: { label: 'Source', value: 'github.com/armoriq' },
  },
];

export function Products() {
  const container = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useGSAP(() => {
    if (!container.current) return;
    const heading = container.current.querySelector('.products-heading');
    if (heading) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    // Pre-hide product cards so the click-to-expand can fade them in cleanly.
    // Only do this on viewports/contexts where the trigger overlay is meaningful
    // (motion-allowed + wide enough to overlay the grid). On mobile or reduced motion,
    // skip the trigger flow and show the grid directly.
    const reducedP = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileP = window.innerWidth < 768;
    if (reducedP || isMobileP) {
      setExpanded(true);
      if (gridRef.current) {
        gsap.set(gridRef.current.querySelectorAll('.product-card'), {
          opacity: 1,
          y: 0,
          scale: 1,
        });
      }
    } else if (gridRef.current) {
      gsap.set(gridRef.current.querySelectorAll('.product-card'), {
        opacity: 0,
        y: 30,
        scale: 0.96,
      });
    }
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  // Cursor-following internal disc removed — the global custom cursor
  // (10px → 60px, mix-blend-difference) handles the hover affordance.
  // Keeping no-op handlers so the JSX bindings below still compile.
  const handleEnter = () => {};
  const handleMove = () => {};
  const handleLeave = () => {};

  const handleExpand = () => {
    if (expanded || !triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const cx = triggerRect.left + triggerRect.width / 2;
    const cy = triggerRect.top + triggerRect.height / 2;

    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.product-card');
    const cardData: { el: HTMLElement; dx: number; dy: number; rot: number }[] = [];
    if (cards) {
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const dx = cx - (r.left + r.width / 2);
        const dy = cy - (r.top + r.height / 2);
        const rot = gsap.utils.random(-25, 25);
        cardData.push({ el: card, dx, dy, rot });
      });
    }

    const tl = gsap.timeline({
      onComplete: () => setExpanded(true),
    });

    tl.to(triggerRef.current, {
      scale: 1.06,
      duration: 0.18,
      ease: 'power2.out',
    })
      .to(triggerRef.current, {
        opacity: 0,
        scale: 0.6,
        duration: 0.25,
        ease: 'power3.in',
      });

    cardData.forEach((c, i) => {
      tl.fromTo(
        c.el,
        {
          x: c.dx,
          y: c.dy,
          scale: 0.25,
          rotate: c.rot,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 1.05,
          ease: 'back.out(1.6)',
        },
        0.25 + i * 0.045
      );
    });
  };

  return (
    <section ref={container} id="products" className="py-20 md:py-48 lg:py-56 bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-4xl mx-auto mb-12 md:mb-24 text-center">
          <SectionEyebrow num="04" label="The Platform" align="center" className="mb-6" />
          <h2
            className="products-heading font-bold text-[var(--color-text-dark)] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">One platform. Full control.</SplitText>
          </h2>
          <p className="text-[18px] md:text-[20px] font-light leading-[1.55] text-[var(--color-text-medium)] max-w-xl mx-auto">
            Everything you need to safely run AI agents in production.
          </p>
        </div>

        <div className="relative">
          <div
            className="trigger-wrap absolute inset-0 z-10 flex items-start justify-center pointer-events-none"
            style={{ display: expanded ? 'none' : 'flex' }}
          >
            <button
              style={{ pointerEvents: 'auto' }}
              ref={triggerRef}
              type="button"
              onMouseEnter={handleEnter}
              onMouseMove={handleMove}
              onMouseLeave={handleLeave}
              onClick={handleExpand}
              className="products-trigger group relative overflow-hidden rounded-2xl card-shadow hover:card-shadow-hover text-left p-10 md:p-14 max-w-2xl w-full cursor-pointer isolate border bg-white border-[var(--color-border)] hover:bg-[var(--color-text-dark)] hover:border-[var(--color-text-dark)] transition-colors duration-500"
              aria-label="Expand the platform — view all six products"
            >
              <div className="relative z-[1]">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] mb-4 text-[var(--color-text-light)] group-hover:text-white/60 transition-colors duration-500">
                  The Platform · 6 products
                </div>
                <h3
                  className="font-bold tracking-[-0.02em] mb-6 text-[var(--color-text-dark)] group-hover:text-white transition-colors duration-500"
                  style={{ fontSize: 'clamp(32px, 4.2vw, 56px)', lineHeight: 1.05 }}
                >
                  Explore the platform
                </h3>
                <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 mb-8">
                  {products.map((p) => (
                    <li
                      key={p.key}
                      className="flex items-center gap-2.5 text-[15px] text-[var(--color-text-medium)] group-hover:text-white/85 transition-colors duration-500"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--color-primary)' }}
                      />
                      <span className="font-medium">{p.title}</span>
                      <span className="opacity-60 text-[12px] ml-1">{p.tag}</span>
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-2 font-medium text-[15px] text-[var(--color-text-dark)] group-hover:text-white transition-colors duration-500">
                  Click to expand <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          </div>

        <div
          ref={gridRef}
          className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {products.map((p) => (
            <div
              key={p.key}
              className="product-card group relative bg-white border border-[var(--color-border)] rounded-xl p-8 md:p-10 card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[380px] overflow-hidden"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                style={{ background: 'var(--color-primary)' }}
              />
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="text-[var(--color-text-dark)]">{p.icon}</div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)] border border-[var(--color-border)] rounded-full px-2.5 py-1">
                    {p.tag}
                  </span>
                </div>
                <h3 className="text-[26px] font-medium text-[var(--color-text-dark)] tracking-[-0.01em] mb-3">
                  {p.title}
                </h3>
                <p className="text-[16px] font-light leading-[1.6] text-[var(--color-text-medium)] mb-5">
                  {p.body}
                </p>
                <ul className="flex flex-wrap gap-1.5 mb-5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-medium)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-2 py-1"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-5 border-t border-[var(--color-border)]">
                <div className="flex items-baseline justify-between gap-3 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)]">
                    {p.stat.label}
                  </span>
                  <span className="font-mono text-[12px] text-[var(--color-text-dark)] tracking-[-0.01em]">
                    {p.stat.value}
                  </span>
                </div>
                <a
                  href={p.linkHref}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-dark)] underline-slide self-start"
                >
                  {p.linkText}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}
