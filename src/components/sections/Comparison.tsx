'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';
import { useMediaQuery } from '@/lib/useMediaQuery';

type Cell = { text: string; type: 'yes' | 'no' | 'dash' | 'text' };

const columns = ['ArmorIQ', 'Guardrails', 'IAM / RBAC', 'Sandbox / Isolation', 'Observability / Logs'];

const rows: { label: string; annotation?: string; cells: string[] }[] = [
  {
    label: 'Core question',
    annotation: 'the ONLY question that matters',
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
    annotation: 'pre-execution = prevention',
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
    annotation: "the only 'Yes' in this column",
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
      <div className="flex items-center gap-2 relative">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[rgba(61,139,92,0.12)] relative">
          <span className="check-halo absolute inset-0 rounded-full" style={{ border: '1px solid var(--color-primary)', opacity: 0, transform: 'scale(1)' }} aria-hidden="true" />
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path className="check-draw" d="M2 5l2 2 4-4" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-mono text-[13px] text-[var(--color-success)]">Yes</span>
      </div>
    );
  }
  if (cell.type === 'no') {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-danger-bg)]">
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1.5 1.5l6 6M7.5 1.5l-6 6" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
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
  // default-desktop during SSR; swaps to mobile cards after hydration below lg
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

    const table = container.current.querySelector<HTMLElement>('.cmp-table');
    if (!table) return;

    const compHeaders = table.querySelectorAll<HTMLElement>('.cmp-header-comp');
    const armorHeader = table.querySelector<HTMLElement>('.cmp-header-armor');
    const sep = table.querySelector<HTMLElement>('.cmp-sep');
    const rowsEls = table.querySelectorAll<HTMLElement>('.cmp-row');
    const recommended = table.querySelector<HTMLElement>('.cmp-recommended');
    const armorScan = table.querySelector<HTMLElement>('.cmp-armor-scan');

    gsap.set(compHeaders, { y: -150, opacity: 0 });
    gsap.set(armorHeader, { y: -250, opacity: 0 });
    gsap.set(sep, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(rowsEls, { opacity: 0 });
    gsap.set(recommended, { opacity: 0, y: -6 });
    gsap.set(armorScan, { opacity: 0, scaleX: 0, transformOrigin: 'left center' });

    ScrollTrigger.create({
      trigger: table,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(compHeaders, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.in',
        });
        tl.to(armorHeader, {
          y: 10,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
        }, '-=0.1');
        tl.to(armorHeader, { y: 0, duration: 0.35, ease: 'power2.out' });
        tl.to(armorScan, {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          ease: 'power2.out',
        }, '<');
        tl.to(armorScan, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '>-0.1');
        tl.to(recommended, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.4');
        tl.to(sep, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, '-=0.2');

        rowsEls.forEach((row, rIdx) => {
          const cells = row.querySelectorAll<HTMLElement>('.cmp-cell');
          tl.fromTo(
            cells,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.04,
              duration: 0.5,
              ease: 'power2.out',
              onStart: () => {
                gsap.set(row, { opacity: 1 });
              },
            },
            rIdx === 0 ? '>' : '>-0.35'
          );
          const checks = row.querySelectorAll<SVGPathElement>('.check-draw');
          checks.forEach((c) => {
            const len = c.getTotalLength ? c.getTotalLength() : 20;
            gsap.set(c, { strokeDasharray: len, strokeDashoffset: len });
            tl.to(c, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, '<');
          });
          // Halo pulse for check marks
          const halos = row.querySelectorAll<HTMLElement>('.check-halo');
          halos.forEach((h) => {
            tl.fromTo(
              h,
              { opacity: 0.6, scale: 1 },
              { opacity: 0, scale: 2, duration: 0.6, ease: 'power2.out' },
              '<+0.1'
            );
          });
        });

        tl.fromTo(
          '.cmp-armor-border',
          { opacity: 1 },
          { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 1, ease: 'sine.inOut' },
          '>-0.1'
        );

        // fade in side annotations
        tl.fromTo(
          '.cmp-annotation',
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
          '-=0.4'
        );
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  return (
    <section ref={container} id="comparison" className="py-24 md:py-36 bg-[var(--color-bg)]">
      <Container>
        <div className="max-w-3xl mb-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
            {'// COMPETITIVE ANALYSIS //'} <span className="text-[var(--color-text-medium)]">THE GAP</span> {'// 06'}
          </div>
          <h2
            className="cmp-heading font-bold text-[var(--color-text-dark)] mb-5"
            style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.08 }}
          >
            <SplitText splitBy="word">Why not just use guardrails or IAM?</SplitText>
          </h2>
          <p className="text-[17px] font-light leading-[1.6] text-[var(--color-text-medium)]">
            They solve different problems. ArmorIQ fills the gap none of them cover.
          </p>
        </div>

        {/* Desktop table */}
        {!showMobile && (
        <div className="relative">
          <div className="cmp-table bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 relative overflow-hidden">
            <div
              className="grid gap-x-5 gap-y-0 relative"
              style={{ gridTemplateColumns: '1.2fr 1.15fr 1fr 1fr 1fr 1fr' }}
            >
              {/* ArmorIQ column background gradient (spans all rows via absolute positioning) */}
              <div
                aria-hidden="true"
                className="absolute top-0 bottom-0 pointer-events-none rounded-lg"
                style={{
                  left: 'calc((1.2fr / 6.35fr) * 100%)',
                  gridColumn: '2 / 3',
                  background:
                    'linear-gradient(180deg, rgba(224,123,76,0.06), rgba(224,123,76,0.02))',
                }}
              />

              {/* header row */}
              <div className="cmp-header" />
              <div className="cmp-header-armor relative py-4">
                <div className="cmp-armor-border absolute -top-8 left-0 right-0 h-[3px] bg-[var(--color-primary)] rounded" />
                <div
                  className="cmp-recommended absolute -top-5 left-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-primary)]"
                >
                  ◆ Recommended
                </div>
                <div className="font-bold text-[18px] text-[var(--color-text-dark)]">ArmorIQ</div>
                <div
                  className="cmp-armor-scan absolute left-0 right-0 bottom-0 h-[1px]"
                  style={{
                    background:
                      'linear-gradient(to right, transparent, var(--color-primary), transparent)',
                  }}
                  aria-hidden="true"
                />
              </div>
              {columns.slice(1).map((c) => (
                <div key={c} className="cmp-header-comp">
                  <div className="font-medium text-[15px] text-[var(--color-text-medium)] py-4">{c}</div>
                </div>
              ))}

              <div className="cmp-sep col-span-6 h-[1px] bg-[var(--color-border)] mb-3" />

              {rows.map((r, rIdx) => (
                <div key={r.label} className="cmp-row contents">
                  <div
                    className="cmp-cell py-4 pr-3 font-medium text-[14px] text-[var(--color-text-dark)] border-t border-[var(--color-border)]"
                    style={{ opacity: 0 }}
                  >
                    {r.label}
                  </div>
                  {r.cells.map((cell, cIdx) => {
                    const c = classifyCell(cell);
                    const isArmor = cIdx === 0;
                    return (
                      <div
                        key={cIdx}
                        className={`cmp-cell py-4 pr-3 border-t ${isArmor ? 'border-[rgba(224,123,76,0.25)]' : 'border-[var(--color-border)]'}`}
                        style={{ opacity: 0 }}
                      >
                        <CellRender cell={c} />
                      </div>
                    );
                  })}
                  {/* spacer for contents */}
                  <div className="contents" aria-hidden="true" key={`spacer-${rIdx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Side annotations */}
          <div className="absolute top-0 -right-4 xl:-right-12 w-44 pt-20 hidden xl:block">
            {rows.map((r, i) => r.annotation ? (
              <div
                key={r.label}
                className="cmp-annotation font-mono text-[10px] text-[var(--color-text-light)] leading-[1.4] flex items-start gap-2 mb-5"
                style={{ opacity: 0, marginTop: i === 0 ? '0' : `${i * 48}px` }}
              >
                <span className="inline-block w-4 h-[1px] bg-[var(--color-text-light)] mt-1.5 flex-shrink-0" aria-hidden="true" />
                <span>{r.annotation}</span>
              </div>
            ) : null)}
          </div>
        </div>
        )}

        {/* Mobile cards */}
        {showMobile && (
        <div className="space-y-6">
          {columns.slice(1).map((comp, compIdx) => (
            <div key={comp} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
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

        <div className="cmp-closing mt-20 md:mt-28 text-center">
          <p
            className="font-bold text-[var(--color-text-dark)] mx-auto max-w-4xl"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', letterSpacing: '-0.02em', lineHeight: 1.2 }}
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
