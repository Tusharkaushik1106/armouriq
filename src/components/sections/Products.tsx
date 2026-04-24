'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, Flip, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';

type Product = {
  key: string;
  number: string;
  title: string;
  tag: string;
  body: string;
  linkText: string;
  linkHref: string;
  version: string;
  status: 'OPERATIONAL' | 'BETA';
  stat: { label: string; value: string };
  githubStat?: { label: string; value: string };
  patternId: 'dots' | 'lines' | 'circuit' | 'grid' | 'scan' | 'bracket';
};

const products: Product[] = [
  {
    key: 'intent',
    number: '01',
    title: 'Intent Engine',
    tag: 'The Brain',
    body: 'Define what your agents can do. Set boundaries. Enforce them automatically.',
    linkText: 'Learn more',
    linkHref: '#',
    version: 'v2.4.1',
    status: 'OPERATIONAL',
    stat: { label: 'POLICIES', value: '2,341' },
    patternId: 'dots',
  },
  {
    key: 'sentry',
    number: '02',
    title: 'Sentry',
    tag: 'The Eyes',
    body: 'See every agent action in real time. Get alerts when agents approach their limits.',
    linkText: 'Learn more',
    linkHref: '#',
    version: 'v1.9.3',
    status: 'OPERATIONAL',
    stat: { label: 'EVENTS/SEC', value: '14K' },
    patternId: 'scan',
  },
  {
    key: 'gatekeeper',
    number: '03',
    title: 'Gatekeeper',
    tag: 'The Guard',
    body: 'Control which agents can access which resources. Like IAM, but for AI behavior.',
    linkText: 'Learn more',
    linkHref: '#',
    version: 'v3.1.0',
    status: 'OPERATIONAL',
    stat: { label: 'REQUESTS', value: '892M' },
    patternId: 'lines',
  },
  {
    key: 'registry',
    number: '04',
    title: 'Registry',
    tag: 'The Map',
    body: "One dashboard for all your agents. Know what's deployed, where, and what it can do.",
    linkText: 'Learn more',
    linkHref: '#',
    version: 'v2.0.7',
    status: 'OPERATIONAL',
    stat: { label: 'AGENTS', value: '12,847' },
    patternId: 'grid',
  },
  {
    key: 'auditor',
    number: '05',
    title: 'Auditor',
    tag: 'The Record',
    body: 'Automatic audit logs for every agent decision. SOC2, GDPR, and NIST ready.',
    linkText: 'Learn more',
    linkHref: '#',
    version: 'v1.6.2',
    status: 'OPERATIONAL',
    stat: { label: 'LOGS', value: '4.2TB' },
    patternId: 'circuit',
  },
  {
    key: 'armorclaw',
    number: '06',
    title: 'ArmorClaw',
    tag: 'Open Source',
    body: 'Intent Assurance for OpenClaw agents. Cryptographic verification at every step.',
    linkText: 'Explore on GitHub',
    linkHref: '#',
    version: 'v0.4.0',
    status: 'BETA',
    stat: { label: '★ STARS', value: '3.4K' },
    githubStat: { label: 'FORKS', value: '287' },
    patternId: 'bracket',
  },
];

function PatternBg({ id }: { id: Product['patternId'] }) {
  const common = 'absolute inset-0 pointer-events-none';
  if (id === 'dots') {
    return (
      <div
        className={common}
        style={{
          backgroundImage: 'radial-gradient(rgba(45,45,45,0.18) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          opacity: 0.08,
        }}
        aria-hidden="true"
      />
    );
  }
  if (id === 'lines') {
    return (
      <div
        className={common}
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, rgba(45,45,45,0.35) 0 1px, transparent 1px 10px)',
          opacity: 0.05,
        }}
        aria-hidden="true"
      />
    );
  }
  if (id === 'grid') {
    return (
      <div
        className={common}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,45,45,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.35) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.05,
        }}
        aria-hidden="true"
      />
    );
  }
  if (id === 'scan') {
    return (
      <div
        className={common}
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(45,45,45,0.35) 0 1px, transparent 1px 6px)',
          opacity: 0.05,
        }}
        aria-hidden="true"
      />
    );
  }
  if (id === 'circuit') {
    return (
      <svg className={common} viewBox="0 0 200 200" preserveAspectRatio="none" aria-hidden="true" style={{ opacity: 0.07 }}>
        <path d="M0 50 L40 50 L40 100 L100 100 L100 150 L200 150" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
        <path d="M0 120 L60 120 L60 170 L140 170" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
        <circle cx="40" cy="50" r="2" fill="var(--color-text-dark)" />
        <circle cx="100" cy="100" r="2" fill="var(--color-text-dark)" />
        <circle cx="60" cy="120" r="2" fill="var(--color-text-dark)" />
      </svg>
    );
  }
  return (
    <div className={common} style={{ opacity: 0.05 }} aria-hidden="true">
      <svg viewBox="0 0 200 200" preserveAspectRatio="none" className="w-full h-full">
        <text x="20" y="60" fontFamily="var(--font-mono)" fontSize="36" fill="var(--color-text-dark)">&lt;/&gt;</text>
        <text x="120" y="150" fontFamily="var(--font-mono)" fontSize="36" fill="var(--color-text-dark)">&lt;/&gt;</text>
      </svg>
    </div>
  );
}

function ProductIcon({ id }: { id: Product['key'] }) {
  // 'product-icon-parts' for hover animation targeting.
  if (id === 'intent') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
        {/* 5 connected nodes */}
        <line className="icon-part" x1="6" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.25" />
        <line className="icon-part" x1="22" y1="8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.25" />
        <line className="icon-part" x1="6" y1="20" x2="14" y2="14" stroke="currentColor" strokeWidth="1.25" />
        <line className="icon-part" x1="22" y1="20" x2="14" y2="14" stroke="currentColor" strokeWidth="1.25" />
        <circle className="icon-part" cx="6" cy="8" r="2" fill="currentColor" />
        <circle className="icon-part" cx="22" cy="8" r="2" fill="currentColor" />
        <circle className="icon-part" cx="6" cy="20" r="2" fill="currentColor" />
        <circle className="icon-part" cx="22" cy="20" r="2" fill="currentColor" />
        <circle className="icon-part" cx="14" cy="14" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (id === 'sentry') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
        <path d="M2 14s4-7 12-7 12 7 12 7-4 7-12 7-12-7-12-7z" stroke="currentColor" strokeWidth="1.25" />
        <g className="icon-crosshair">
          <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.25" fill="none" />
          <path d="M14 8v3M14 17v3M8 14h3M17 14h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        </g>
      </svg>
    );
  }
  if (id === 'gatekeeper') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
        <rect x="4" y="4" width="20" height="20" rx="1.5" stroke="currentColor" strokeWidth="1.25" fill="none" />
        <line className="icon-gate-left" x1="10" y1="4" x2="10" y2="24" stroke="currentColor" strokeWidth="1.25" />
        <line className="icon-gate-right" x1="18" y1="4" x2="18" y2="24" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (id === 'registry') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <circle
              key={`${r}-${c}`}
              className="icon-part"
              cx={6 + c * 8}
              cy={6 + r * 8}
              r="1.75"
              fill="currentColor"
            />
          ))
        )}
        <line x1="6" y1="6" x2="22" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        <line x1="22" y1="6" x2="6" y2="22" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </svg>
    );
  }
  if (id === 'auditor') {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
        <path d="M6 3h12l4 4v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.25" fill="none" />
        <path d="M17 3v5h5" stroke="currentColor" strokeWidth="1.25" />
        <line className="icon-part" x1="8" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line className="icon-part" x1="8" y1="17" x2="18" y2="17" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
        <line className="icon-part" x1="8" y1="21" x2="14" y2="21" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="product-icon">
      <path className="icon-left-bracket" d="M10 6L4 14l6 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path className="icon-right-bracket" d="M18 6l6 8-6 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="5" x2="12" y2="23" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

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

    // per-card unique hover animations
    const cards = gsap.utils.toArray<HTMLElement>('.product-card');
    cards.forEach((card) => {
      const key = card.dataset.product;
      const enter = () => {
        if (reduced) return;
        if (key === 'intent') {
          gsap.fromTo(
            card.querySelectorAll('.product-icon .icon-part'),
            { opacity: 0.5 },
            { opacity: 1, stagger: 0.06, duration: 0.4, ease: 'power2.out' }
          );
        } else if (key === 'sentry') {
          gsap.to(card.querySelector('.icon-crosshair'), {
            rotate: 90,
            transformOrigin: '14px 14px',
            duration: 0.5,
            ease: 'power3.out',
          });
        } else if (key === 'gatekeeper') {
          gsap.to(card.querySelector('.icon-gate-left'), { x: -3, duration: 0.3, ease: 'power2.out' });
          gsap.to(card.querySelector('.icon-gate-right'), { x: 3, duration: 0.3, ease: 'power2.out' });
        } else if (key === 'registry') {
          gsap.fromTo(
            card.querySelectorAll('.product-icon .icon-part'),
            { scale: 1 },
            { scale: 1.3, duration: 0.25, stagger: { from: 'center', amount: 0.4 }, yoyo: true, repeat: 1, transformOrigin: 'center' }
          );
        } else if (key === 'auditor') {
          gsap.fromTo(
            card.querySelectorAll('.product-icon .icon-part'),
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, stagger: 0.1, duration: 0.4, ease: 'power3.out' }
          );
        } else if (key === 'armorclaw') {
          gsap.fromTo(
            card.querySelector('.icon-left-bracket'),
            { x: 2 },
            { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
          );
          gsap.fromTo(
            card.querySelector('.icon-right-bracket'),
            { x: -2 },
            { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' }
          );
        }
      };
      const leave = () => {
        if (reduced) return;
        if (key === 'sentry') {
          gsap.to(card.querySelector('.icon-crosshair'), {
            rotate: 0,
            duration: 0.4,
            ease: 'power3.out',
          });
        } else if (key === 'gatekeeper') {
          gsap.to(card.querySelector('.icon-gate-left'), { x: 0, duration: 0.3, ease: 'power2.out' });
          gsap.to(card.querySelector('.icon-gate-right'), { x: 0, duration: 0.3, ease: 'power2.out' });
        }
      };
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
    });

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
      return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }

    const grid = container.current.querySelector<HTMLElement>('.product-grid');
    if (!grid) return;

    const finalState = Flip.getState(cards);

    grid.style.position = 'relative';
    grid.style.minHeight = '440px';
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
            {'// PLATFORM OVERVIEW //'} <span className="text-[var(--color-text-medium)]">ONE PLATFORM</span> {'// 05'}
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
              key={p.key}
              data-product={p.key}
              className="product-card group relative bg-white border border-[var(--color-border)] rounded-xl p-7 md:p-8 card-shadow hover:card-shadow-hover hover:-translate-y-1 hover:border-[var(--color-primary)] transition-all duration-300 flex flex-col min-h-[280px] overflow-hidden"
            >
              <PatternBg id={p.patternId} />
              <div className="relative flex flex-col flex-1">
                {/* top row: numbered prefix + version */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-bold text-[22px] text-[var(--color-text-dark)] tracking-[-0.02em] leading-none">
                      {p.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-light)]">
                      / {p.title.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[var(--color-text-light)]">{p.version}</span>
                </div>

                <div className="text-[var(--color-primary)] mb-5">
                  <ProductIcon id={p.key} />
                </div>

                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-2">
                  {p.tag}
                </div>
                <h3 className="text-[22px] font-medium text-[var(--color-text-dark)] tracking-[-0.01em] mb-3">
                  {p.title}
                </h3>
                <p className="text-[15px] font-light leading-[1.6] text-[var(--color-text-medium)] flex-1">
                  {p.body}
                </p>

                {/* stat + github stat if any */}
                <div className="mt-5 flex items-center gap-5 pt-4 border-t border-dashed border-[var(--color-border)]">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-light)]">
                      {p.stat.label}
                    </div>
                    <div className="font-mono text-[13px] text-[var(--color-text-dark)] tabular-nums">
                      {p.stat.value}
                    </div>
                  </div>
                  {p.githubStat && (
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-light)]">
                        {p.githubStat.label}
                      </div>
                      <div className="font-mono text-[13px] text-[var(--color-text-dark)] tabular-nums">
                        {p.githubStat.value}
                      </div>
                    </div>
                  )}
                </div>

                {/* bottom row: learn more + status */}
                <div className="mt-5 flex items-end justify-between">
                  <a
                    href={p.linkHref}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-dark)] underline-slide"
                  >
                    {p.linkText}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.status === 'OPERATIONAL' ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary)]'
                      }`}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-light)]">
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
