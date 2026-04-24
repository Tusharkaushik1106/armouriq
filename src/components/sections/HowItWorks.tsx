'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';

const steps = [
  {
    num: '01',
    title: 'Add Agents to your registry & policy',
    body: 'Discover every agent and MCP server in your enterprise. Assign ownership. Define org-level policy. ArmorIQ gives you a complete, live system of record so governance starts before a single action runs.',
  },
  {
    num: '02',
    title: 'Define and enforce Intent',
    body: 'Before any API call, data access, or workflow trigger executes, ArmorIQ checks it against declared intent and active policy. Within scope: allowed. Outside scope: blocked or down-scoped, instantly.',
  },
  {
    num: '03',
    title: 'Generate Audit trails',
    body: 'Automatically captures a continuous, tamper-evident record of who did what, on whose behalf, and why. Compliance evidence is produced in real time, not assembled after an incident.',
  },
];

function StepIllustration({ n }: { n: number }) {
  if (n === 0) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-2 max-w-md">
        {['support-agent-1', 'analyst-agent', 'billing-bot', 'docs-agent'].map((a, i) => (
          <div
            key={a}
            className="flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 card-shadow"
            style={{ opacity: 0.85, transform: `translateX(${i * 4}px)` }}
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="font-mono text-xs text-[var(--color-text-medium)]">{a}</span>
            <span className="ml-auto font-mono text-[10px] text-[var(--color-text-light)] uppercase tracking-[0.1em]">
              registered
            </span>
          </div>
        ))}
      </div>
    );
  }
  if (n === 1) {
    return (
      <div className="mt-8 max-w-md bg-white border border-[var(--color-border)] rounded-lg p-5 card-shadow">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3">
          Intent Check
        </div>
        <div className="flex items-center gap-3 text-[12px] font-mono">
          <span className="px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)]">DELETE /users/42</span>
          <span className="text-[var(--color-text-light)]">→</span>
          <span className="px-2 py-1 rounded bg-[var(--color-danger-bg)] border border-[rgba(198,61,61,0.3)] text-[var(--color-danger)]">BLOCKED</span>
        </div>
        <div className="mt-3 text-[11px] text-[var(--color-text-light)] font-mono">
          Reason: exceeds delegated scope
        </div>
      </div>
    );
  }
  return (
    <div className="mt-8 max-w-md bg-[var(--color-text-dark)] rounded-lg p-5 font-mono text-[11px] leading-[1.8]">
      <div className="text-[rgba(255,255,255,0.5)]">[14:32:08] agent=support-1 action=READ.customers verdict=ALLOW</div>
      <div className="text-[rgba(255,255,255,0.5)]">[14:32:09] agent=analyst action=QUERY.stats verdict=ALLOW</div>
      <div className="text-[var(--color-danger)]">[14:32:11] agent=billing-bot action=WRITE.audit verdict=BLOCK</div>
      <div className="text-[rgba(255,255,255,0.5)]">[14:32:12] sig=sha256:a3f9…</div>
    </div>
  );
}

export function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const mm = gsap.matchMedia();

    // Closing line — universal
    const closing = container.current.querySelector('.hiw-closing');
    if (closing) {
      gsap.set(closing.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: closing,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          if (reduced) {
            gsap.set(closing.querySelectorAll('.split-inner'), { y: 0 });
            gsap.set('.hiw-closing-underline', { scaleX: 1 });
            return;
          }
          gsap.to(closing.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.fromTo(
            '.hiw-closing-underline',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 }
          );
        },
      });
    }

    // Desktop only: pinned horizontal
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = container.current!.querySelector<HTMLDivElement>('.track');
      const panels = gsap.utils.toArray<HTMLElement>('.panel', container.current!);
      if (!track || panels.length === 0) return;

      const totalScroll = (panels.length - 1) * window.innerWidth;

      const horizontalTween = gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: '.pin-wrap',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel) => {
        const content = panel.querySelector<HTMLElement>('.panel-content');
        if (!content) return;
        gsap.fromTo(
          content,
          { opacity: 0.3, y: 40 },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalTween,
              start: 'left center',
              end: 'right center',
              scrub: true,
            },
          }
        );
      });
    });

    // Mobile only: per-panel fade on scroll
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = container.current!.querySelectorAll<HTMLElement>('.panel');
      panels.forEach((p) => {
        gsap.fromTo(
          p.querySelectorAll('.panel-content > *'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 70%' },
          }
        );
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section ref={container} id="how-it-works" className="relative">
      {/* Single panel tree — CSS changes the layout axis between desktop (pinned horizontal) and mobile (stacked). */}
      <div className="pin-wrap md:h-screen md:overflow-hidden bg-[var(--color-bg)]">
        <div className="track flex flex-col md:flex-row md:h-full" style={{}}>
          {steps.map((s, i) => (
            <div
              key={s.num}
              className="panel flex-shrink-0 w-full md:w-screen md:h-full py-20 md:py-0"
            >
              <div className="md:h-full flex md:items-center">
                <Container className="w-full">
                  <div className="panel-content grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 lg:gap-16 md:items-center">
                    <div className="relative md:pl-6">
                      <div className="hidden md:block absolute left-0 top-6 bottom-6 w-[2px] bg-[var(--color-border-strong)] rounded-full" />
                      <div
                        className="font-bold leading-none text-[var(--color-text-light)]"
                        style={{
                          fontSize: 'clamp(100px, 20vw, 260px)',
                          letterSpacing: '-0.04em',
                        }}
                      >
                        {s.num}
                      </div>
                    </div>
                    <div className="max-w-xl">
                      <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-4">
                        Step {s.num}
                      </div>
                      <h3
                        className="font-bold text-[var(--color-text-dark)] mb-5"
                        style={{
                          fontSize: 'clamp(26px, 3.2vw, 44px)',
                          letterSpacing: '-0.02em',
                          lineHeight: 1.1,
                        }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-[16px] font-light leading-[1.7] text-[var(--color-text-medium)]">
                        {s.body}
                      </p>
                      <StepIllustration n={i} />
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing line */}
      <div className="hiw-closing py-24 md:py-32 bg-[var(--color-bg)] text-center">
        <Container>
          <p
            className="font-bold text-[var(--color-text-dark)] mx-auto max-w-4xl"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            <SplitText splitBy="char">IAM controls access. </SplitText>
            <span className="relative inline-block">
              <SplitText splitBy="char">ArmorIQ controls behavior.</SplitText>
              <span
                aria-hidden="true"
                className="hiw-closing-underline absolute left-0 right-0"
                style={{
                  bottom: '0.04em',
                  height: '0.06em',
                  background: 'var(--color-primary)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                }}
              />
            </span>
          </p>
        </Container>
      </div>
    </section>
  );
}
