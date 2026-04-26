'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { useMediaQuery } from '@/lib/useMediaQuery';

type Cell = { text: string; type: 'yes' | 'no' | 'dash' | 'text' };

const columns = ['ArmorIQ', 'Guardrails', 'IAM / RBAC', 'Sandbox / Isolation', 'Observability / Logs'];

const rows: { label: string; cells: string[] }[] = [
  {
    label: 'Core question',
    cells: [
      'Why is this action happening?',
      'Is the output safe?',
      'Who is allowed?',
      'Is it contained?',
      'What happened?',
    ],
  },
  {
    label: 'What it checks',
    cells: ['Every action & decision', 'Output text', 'Access permissions', 'Execution environment', 'Events, logs, traces'],
  },
  {
    label: 'When it acts',
    cells: ['Before execution', 'After execution', 'At login / auth', 'During execution', 'After execution'],
  },
  {
    label: 'What goes wrong',
    cells: ['—', 'Harmful output slips', 'Unauthorized access', 'Escape / breakout', 'Too late / alert fatigue'],
  },
  {
    label: 'What it verifies',
    cells: ['Intent validity', 'Content safety', 'Identity', 'Isolation boundaries', 'System behavior'],
  },
  {
    label: 'Stops rogue actions',
    cells: ['Yes', 'No', 'No', 'Contains, not prevents', 'No'],
  },
];

function classifyCell(text: string): Cell {
  if (text === 'Yes') return { text, type: 'yes' };
  if (text === 'No') return { text, type: 'no' };
  if (text === '—') return { text, type: 'dash' };
  return { text, type: 'text' };
}

function CellRender({ cell }: { cell: Cell }) {
  if (cell.type === 'yes') {
    return (
      <div className="flex items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path className="check-draw" d="M2.5 6l2.5 2.5 5-5" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[13px] text-[var(--color-success)]">Yes</span>
      </div>
    );
  }
  if (cell.type === 'no') {
    return (
      <div className="flex items-center gap-2">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M2 2l6 6M8 2l-6 6" stroke="var(--color-text-light)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="font-mono text-[13px] text-[var(--color-text-medium)]">No</span>
      </div>
    );
  }
  if (cell.type === 'dash') {
    return <span className="font-mono text-[13px] text-[var(--color-text-light)]">—</span>;
  }
  if (cell.text === 'Contains, not prevents') {
    return <span className="italic text-[13px] text-[var(--color-text-light)]">{cell.text}</span>;
  }
  return <span className="text-[13px] text-[var(--color-text-medium)]">{cell.text}</span>;
}

export function Comparison() {
  const container = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const showMobile = isDesktop === false;

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const closing = container.current.querySelector('.cmp-closing');
    if (closing) {
      gsap.set(closing.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: closing,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (reduced) {
            gsap.set(closing.querySelectorAll('.split-inner'), { y: 0 });
            gsap.set('.cmp-closing-underline', { scaleX: 1 });
            return;
          }
          gsap.to(closing.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.fromTo(
            '.cmp-closing-underline',
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: 'power3.out', delay: 0.8 }
          );
        },
      });
    }

    if (reduced) return;

    const heading = container.current.querySelector('.cmp-heading');
    if (heading) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
      ScrollTrigger.create({
        trigger: heading,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(heading.querySelectorAll('.split-inner'), {
            y: 0,
            stagger: 0.05,
            duration: 0.7,
            ease: 'power3.out',
          });
        },
      });
    }

    // Pinned scrubbed drop — desktop only
    if (showMobile) {
      const cards = container.current.querySelectorAll<HTMLElement>('.cmp-mobile-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cards[0].parentElement,
              start: 'top 80%',
            },
          }
        );
      }
      return;
    }

    const pinRoot = container.current.querySelector<HTMLElement>('.cmp-pin-root');
    if (!pinRoot) return;

    const compCols = pinRoot.querySelectorAll<HTMLElement>('.cmp-col-comp');
    const armorCol = pinRoot.querySelector<HTMLElement>('.cmp-col-armor');
    const finalLabel = pinRoot.querySelector<HTMLElement>('.cmp-final');
    const interimLabel = pinRoot.querySelector<HTMLElement>('.cmp-interim');
    if (interimLabel) interimLabel.style.display = 'none';

    gsap.set(compCols, { y: -160, opacity: 0 });
    gsap.set(armorCol, { x: -160, opacity: 0, scale: 1 });
    gsap.set(finalLabel, { opacity: 0, y: 12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRoot,
        start: 'top 70%',
        once: true,
      },
    });

    compCols.forEach((col, i) => {
      tl.to(
        col,
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
        i * 0.12
      );
    });

    tl.to(
      armorCol,
      { x: 0, opacity: 1, duration: 0.7, ease: 'power4.out' },
      '+=0.1'
    );
    tl.to(armorCol, { scale: 1.05, duration: 0.18, ease: 'power2.out' }, '-=0.05');
    tl.to(armorCol, { scale: 1, duration: 0.25, ease: 'power2.inOut' });
    tl.to(finalLabel, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }, '-=0.1');
  }, { scope: container, dependencies: [isDesktop] });

  return (
    <section ref={container} id="comparison" className="py-20 md:py-48 lg:py-56 bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-4xl mx-auto mb-12 md:mb-24 text-center">
          <SectionEyebrow num="05" label="The Comparison" align="center" className="mb-6" />
          <h2
            className="cmp-heading font-bold text-[var(--color-text-dark)] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">Why not just use guardrails or IAM?</SplitText>
          </h2>
          <p className="text-[18px] md:text-[20px] font-light leading-[1.55] text-[var(--color-text-medium)] max-w-2xl mx-auto">
            They solve different problems. ArmorIQ fills the gap none of them cover.
          </p>
        </div>

        {!showMobile && (
          <div className="cmp-pin-root relative">
            <div className="cmp-table bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 w-full">
              <div className="flex gap-5 items-stretch">
                {/* Row labels column */}
                <div className="w-[220px] flex-shrink-0 flex flex-col pt-[72px]">
                  {rows.map((r) => (
                    <div
                      key={r.label}
                      className="py-4 pr-3 font-medium text-[14px] text-[var(--color-text-dark)] border-t border-[var(--color-border)]"
                    >
                      {r.label}
                    </div>
                  ))}
                </div>

                {/* ArmorIQ column */}
                <div className="cmp-col-armor flex-1 min-w-0 relative origin-center" style={{ transform: 'scale(1.08)' }}>
                  <div className="relative py-4 mb-0">
                    <div className="absolute -top-8 left-0 right-0 h-[2px] bg-[var(--color-primary)] rounded" />
                    <div className="font-bold text-[18px] text-[var(--color-text-dark)]">ArmorIQ</div>
                  </div>
                  {rows.map((r) => {
                    const c = classifyCell(r.cells[0]);
                    return (
                      <div
                        key={r.label}
                        className="py-4 pr-3 border-t border-[var(--color-border)]"
                      >
                        <CellRender cell={c} />
                      </div>
                    );
                  })}
                </div>

                {/* Competitor columns */}
                {columns.slice(1).map((comp, compIdx) => (
                  <div key={comp} className="cmp-col-comp flex-1 min-w-0">
                    <div className="py-4 mb-0">
                      <div className="font-medium text-[15px] text-[var(--color-text-medium)]">{comp}</div>
                    </div>
                    {rows.map((r) => {
                      const c = classifyCell(r.cells[compIdx + 1]);
                      return (
                        <div
                          key={r.label}
                          className="py-4 pr-3 border-t border-[var(--color-border)]"
                        >
                          <CellRender cell={c} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Interim + final labels, positioned absolutely over the table area */}
              <div
                className="cmp-interim absolute left-1/2 -translate-x-1/2 bottom-8 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-text-light)] pointer-events-none"
                aria-hidden="true"
              >
                4 tools. 0 prevent rogue actions.
              </div>
              <div
                className="cmp-final absolute left-1/2 -translate-x-1/2 bottom-8 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--color-primary)] pointer-events-none"
                aria-hidden="true"
              >
                ArmorIQ. Prevention, not observation.
              </div>
            </div>
          </div>
        )}

        {showMobile && (
          <div className="space-y-6">
            {columns.slice(1).map((comp, compIdx) => (
              <div key={comp} className="cmp-mobile-card bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-[var(--color-border)]">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-1">Compared to</div>
                    <div className="font-medium text-[16px] text-[var(--color-text-dark)]">{comp}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-primary)] mb-1">ArmorIQ</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {rows.map((r) => {
                    const armorCell = classifyCell(r.cells[0]);
                    const compCell = classifyCell(r.cells[compIdx + 1]);
                    return (
                      <div key={r.label} className="grid grid-cols-[1fr_1fr] gap-3 py-2 border-b border-[var(--color-border)] last:border-b-0 text-[13px]">
                        <div className="col-span-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--color-text-light)]">
                          {r.label}
                        </div>
                        <div><CellRender cell={armorCell} /></div>
                        <div><CellRender cell={compCell} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cmp-closing mt-20 md:mt-40 text-center">
          <p
            className="font-bold text-[var(--color-text-dark)] mx-auto max-w-5xl"
            style={{ fontSize: 'clamp(24px, 4.5vw, 64px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            <SplitText splitBy="char">Guardrails stop bad responses. </SplitText>
            <span className="relative inline-block">
              <SplitText splitBy="char">ArmorIQ stops bad actions.</SplitText>
              <span
                aria-hidden="true"
                className="cmp-closing-underline absolute left-0 right-0"
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
        </div>
      </Container>
    </section>
  );
}
