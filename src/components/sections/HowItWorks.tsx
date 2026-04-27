'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';

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
      <div className="step-illu step-illu-1 mt-8 grid grid-cols-1 gap-2 max-w-md">
        {['support-agent-1', 'analyst-agent', 'billing-bot', 'docs-agent'].map((a, i) => (
          <div
            key={a}
            className="s1-row relative flex items-center gap-3 bg-white border border-[var(--color-border)] rounded-lg px-4 py-3 card-shadow overflow-hidden"
            style={{ opacity: 0, transform: `translateX(40px)`, willChange: 'transform, opacity' }}
            data-i={i}
          >
            <span className="s1-dot w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="font-mono text-xs text-[var(--color-text-medium)]">{a}</span>
            <span className="ml-auto font-mono text-[10px] text-[var(--color-text-light)] uppercase tracking-[0.1em]">
              registered
            </span>
            <span className="s1-scan absolute inset-y-0 left-0 w-1/3 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(216,98,46,0.12), transparent)',
                transform: 'translateX(-100%)',
                willChange: 'transform',
              }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    );
  }
  if (n === 1) {
    return (
      <div
        className="step-illu step-illu-2 mt-8 max-w-md bg-white border border-[var(--color-border)] rounded-lg p-5 card-shadow"
        style={{ opacity: 0, transform: 'translateY(20px) scale(0.97)', willChange: 'transform, opacity' }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3">
          Intent Check
        </div>
        <div className="flex items-center gap-3 text-[12px] font-mono">
          <span className="s2-input px-2 py-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)]" style={{ opacity: 0 }}>DELETE /users/42</span>
          <span className="s2-arrow text-[var(--color-text-light)]" style={{ opacity: 0 }}>→</span>
          <span className="s2-blocked px-2 py-1 rounded bg-[var(--color-danger-bg)] border border-[rgba(198,61,61,0.3)] text-[var(--color-danger)]" style={{ opacity: 0, transform: 'scale(0.6)' }}>BLOCKED</span>
        </div>
        <div className="s2-reason mt-3 text-[11px] text-[var(--color-text-light)] font-mono" style={{ opacity: 0 }}>
          Reason: exceeds delegated scope
        </div>
      </div>
    );
  }
  return (
    <div
      className="step-illu step-illu-3 mt-8 max-w-md bg-[var(--color-text-dark)] rounded-lg p-5 font-mono text-[11px] leading-[1.8] overflow-hidden"
      style={{ opacity: 0, transform: 'translateY(20px)', willChange: 'transform, opacity' }}
    >
      <div className="s3-line text-[rgba(255,255,255,0.85)]" style={{ opacity: 0 }}>[14:32:08] agent=support-1 action=READ.customers verdict=ALLOW</div>
      <div className="s3-line text-[rgba(255,255,255,0.85)]" style={{ opacity: 0 }}>[14:32:09] agent=analyst action=QUERY.stats verdict=ALLOW</div>
      <div className="s3-line s3-block text-[#FF7A7A]" style={{ opacity: 0 }}>[14:32:11] agent=billing-bot action=WRITE.audit verdict=BLOCK</div>
      <div className="s3-line text-[rgba(255,255,255,0.85)]" style={{ opacity: 0 }}>[14:32:12] sig=sha256:a3f9…</div>
    </div>
  );
}

export function HowItWorks() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Show all step illustrations in their final state — no scroll animation.
      gsap.set(
        container.current.querySelectorAll(
          '.s1-row, .step-illu-2, .step-illu-3, .s2-input, .s2-arrow, .s2-blocked, .s2-reason, .s3-line'
        ),
        { opacity: 1, x: 0, y: 0, scale: 1 }
      );
      return;
    }
    const mm = gsap.matchMedia();

    const playStepAnimation = (panel: HTMLElement) => {
      // Step 1
      const rows = panel.querySelectorAll<HTMLElement>('.s1-row');
      if (rows.length) {
        gsap.to(rows, {
          opacity: 1,
          x: (i) => i * 6,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power3.out',
        });
        // continuous scan sweep
        rows.forEach((row, i) => {
          const scan = row.querySelector<HTMLElement>('.s1-scan');
          if (!scan) return;
          gsap.to(scan, {
            x: '350%',
            duration: 1.6,
            ease: 'sine.inOut',
            repeat: -1,
            repeatDelay: 2.4,
            delay: 0.8 + i * 0.25,
          });
        });
      }

      // Step 2
      const card2 = panel.querySelector<HTMLElement>('.step-illu-2');
      if (card2) {
        const tl = gsap.timeline();
        tl.to(card2, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' })
          .to(card2.querySelector('.s2-input'), { opacity: 1, duration: 0.3, ease: 'power2.out' }, '-=0.2')
          .to(card2.querySelector('.s2-arrow'), { opacity: 1, duration: 0.25, ease: 'power2.out' })
          .to(card2.querySelector('.s2-blocked'), { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' })
          .to(card2.querySelector('.s2-blocked'), {
            keyframes: [
              { x: -3, duration: 0.05 },
              { x: 3, duration: 0.05 },
              { x: 0, duration: 0.05 },
            ],
          })
          .to(card2.querySelector('.s2-reason'), { opacity: 1, duration: 0.3 }, '-=0.05');
        // pulse the BLOCKED pill continuously
        gsap.to(card2.querySelector('.s2-blocked'), {
          boxShadow: '0 0 0 6px rgba(198,61,61,0.0)',
          duration: 1.4,
          ease: 'sine.out',
          repeat: -1,
          delay: 1.6,
          startAt: { boxShadow: '0 0 0 0 rgba(198,61,61,0.35)' },
        });
      }

      // Step 3
      const card3 = panel.querySelector<HTMLElement>('.step-illu-3');
      if (card3) {
        const lines = card3.querySelectorAll<HTMLElement>('.s3-line');
        const tl = gsap.timeline();
        tl.to(card3, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        lines.forEach((line) => {
          tl.fromTo(
            line,
            { opacity: 0, x: -8 },
            { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' },
            '+=0.05'
          );
        });
        // flash the BLOCK line
        const blockLine = card3.querySelector<HTMLElement>('.s3-block');
        if (blockLine) {
          gsap.to(blockLine, {
            opacity: 0.55,
            duration: 0.7,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 1.5,
          });
        }
      }
    };


    // Safety net: if any illustration is still invisible 4s after first paint
    // (e.g. ScrollTrigger never fires under non-standard scroll harnesses),
    // reveal it so the layout never reads as broken.
    gsap.delayedCall(4, () => {
      if (!container.current) return;
      container.current
        .querySelectorAll<HTMLElement>(
          '.s1-row, .step-illu-2, .step-illu-3, .s2-input, .s2-arrow, .s2-blocked, .s2-reason, .s3-line'
        )
        .forEach((el) => {
          const cs = window.getComputedStyle(el);
          if (parseFloat(cs.opacity) < 0.05) {
            gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
          }
        });
    });

    // Desktop only: pinned horizontal
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const track = container.current!.querySelector<HTMLDivElement>('.track');
      const panels = gsap.utils.toArray<HTMLElement>('.panel', container.current!);
      if (!track || panels.length === 0) return;

      const getTotalScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(track, {
        x: () => -getTotalScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: () => `+=${getTotalScroll()}`,
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

        // Panel-specific illustration intro — fires when panel center crosses viewport center
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: horizontalTween,
          start: 'left 60%',
          once: true,
          onEnter: () => playStepAnimation(panel),
        });
      });
    });

    // Mobile only: per-panel fade on scroll. Use gsap.from so initial state is
    // applied only by ScrollTrigger — if ST never fires (Lenis quirks), the
    // elements remain at their natural visible state.
    mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = container.current!.querySelectorAll<HTMLElement>('.panel');
      panels.forEach((p) => {
        gsap.from(p.querySelectorAll('.panel-content > *'), {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: { trigger: p, start: 'top 90%', toggleActions: 'play none none none' },
        });
        ScrollTrigger.create({
          trigger: p,
          start: 'top 80%',
          once: true,
          onEnter: () => playStepAnimation(p),
        });
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
              className="panel flex-shrink-0 w-full md:w-screen md:h-full py-14 md:py-0 border-t md:border-t-0 border-[var(--color-border)] first:border-t-0"
            >
              <div className="md:h-full flex md:items-center">
                <Container className="w-full">
                  <div className="panel-content grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 lg:gap-16 md:items-center">
                    <div className="relative md:pl-6">
                      <div className="hidden md:block absolute left-0 top-6 bottom-6 w-[2px] bg-[var(--color-border-strong)] rounded-full" />
                      <div
                        className="font-bold leading-none text-[var(--color-text-light)]"
                        style={{
                          fontSize: 'clamp(72px, 20vw, 260px)',
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

    </section>
  );
}
