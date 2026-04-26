'use client';
import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SplitText } from '@/components/ui/SplitText';

const items = [
  {
    q: 'What is "intent" in AI systems?',
    a: 'Intent is the "job description" for your AI agent. If a user asks an agent to "summarize my emails," the intent is email summarization, not accessing your calendar, not sending messages, not reading billing data. ArmorIQ enforces that boundary.',
  },
  {
    q: 'How is ArmorIQ different from IAM or access control?',
    a: 'IAM controls who can access a resource. ArmorIQ controls what an agent does once it has access. An agent might have permission to read customer data, but should it read billing data when it was only asked for the customer\'s name? IAM says yes. ArmorIQ says no.',
  },
  {
    q: 'What happens when an action is blocked?',
    a: 'The action doesn\'t execute. The agent receives a clear explanation: "Action blocked: exceeds delegated authority." An audit log is created with full context. Your security team gets notified if you\'ve configured alerts.',
  },
  {
    q: 'Where does ArmorIQ fit in an existing stack?',
    a: 'ArmorIQ sits between AI reasoning and execution. Agents plan and adapt freely, but before any action runs, ArmorIQ checks that it aligns with the approved task. It complements existing IAM, Zero Trust, and monitoring. It doesn\'t replace them.',
  },
  {
    q: 'Who is ArmorIQ built for?',
    a: 'Security teams, platform engineers, and compliance officers at companies running AI agents in production. If your agents can access data, call APIs, or trigger workflows autonomously, you need intent enforcement.',
  },
];

export function FAQ() {
  const container = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Section appearing animation: eyebrow, heading, subtitle, then rows in sequence.
  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const eyebrow = container.current.querySelector<HTMLElement>('.faq-eyebrow');
    const heading = container.current.querySelector<HTMLElement>('.faq-heading');
    const subtitle = container.current.querySelector<HTMLElement>('.faq-subtitle');
    const rule = container.current.querySelector<HTMLElement>('.faq-rule');
    const rows = container.current.querySelectorAll<HTMLElement>('.faq-row');

    if (reduced) {
      if (heading) gsap.set(heading.querySelectorAll('.split-inner'), { y: 0 });
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0 });
      if (rule) gsap.set(rule, { scaleX: 1 });
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }

    if (heading) gsap.set(heading.querySelectorAll('.split-inner'), { y: '100%' });
    if (eyebrow) gsap.set(eyebrow, { opacity: 0, y: 12 });
    if (subtitle) gsap.set(subtitle, { opacity: 0, y: 14 });
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left' });
    // Falling-down entry: each row drops from above with skew + rotate, lands with a small bounce
    gsap.set(rows, {
      opacity: 0,
      y: -120,
      rotate: -1.5,
      skewY: 2,
      transformOrigin: 'top center',
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: container.current, start: 'top 75%', once: true },
    });

    if (eyebrow) tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    if (heading)
      tl.to(
        heading.querySelectorAll('.split-inner'),
        { y: 0, stagger: 0.05, duration: 0.7, ease: 'power3.out' },
        '-=0.25'
      );
    if (subtitle)
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');
    if (rule)
      tl.to(rule, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    tl.to(
      rows,
      {
        opacity: 1,
        y: 0,
        rotate: 0,
        skewY: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'bounce.out',
      },
      '-=0.3'
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: container });

  // Open / close behavior — clean height + answer fade, plus icon morph.
  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    items.forEach((_, i) => {
      const panel = container.current!.querySelector<HTMLElement>(`#faq-panel-${i}`);
      const plus = container.current!.querySelector<HTMLElement>(`#faq-plus-${i}`);
      const leftBar = container.current!.querySelector<HTMLElement>(`#faq-bar-${i}`);
      const item = container.current!.querySelector<HTMLElement>(`#faq-item-${i}`);
      const answer = container.current!.querySelector<HTMLElement>(`#faq-answer-${i}`);
      const num = container.current!.querySelector<HTMLElement>(`#faq-num-${i}`);
      const question = container.current!.querySelector<HTMLElement>(`#faq-q-${i}`);
      if (!panel || !plus || !leftBar || !item) return;

      if (openIndex === i) {
        if (reduced) {
          gsap.set(panel, { height: 'auto', opacity: 1 });
          gsap.set(plus, { rotate: 45 });
          gsap.set(leftBar, { scaleY: 1 });
          if (answer) gsap.set(answer, { opacity: 1, y: 0 });
          return;
        }
        gsap.to(panel, { height: 'auto', duration: 0.5, ease: 'power3.out' });
        gsap.to(plus, {
          rotate: 45,
          backgroundColor: 'var(--color-text-dark)',
          color: '#ffffff',
          borderColor: 'var(--color-text-dark)',
          duration: 0.4,
          ease: 'power3.out',
        });
        gsap.to(leftBar, { scaleY: 1, duration: 0.45, ease: 'power3.out' });
        gsap.to(item, { backgroundColor: 'var(--color-surface)', duration: 0.35 });
        if (num) gsap.to(num, { color: 'var(--color-primary)', duration: 0.3 });
        if (question)
          gsap.to(question, { x: 6, color: 'var(--color-text-dark)', duration: 0.4, ease: 'power3.out' });
        if (answer)
          gsap.fromTo(
            answer,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.1 }
          );
        gsap.set(panel, { opacity: 1 });
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: reduced ? 0 : 0.35,
          ease: 'power2.in',
        });
        gsap.to(plus, {
          rotate: 0,
          backgroundColor: '#ffffff',
          color: 'var(--color-text-medium)',
          borderColor: 'var(--color-border)',
          duration: reduced ? 0 : 0.35,
          ease: 'power3.out',
        });
        gsap.to(leftBar, { scaleY: 0, duration: reduced ? 0 : 0.3, ease: 'power3.in' });
        gsap.to(item, { backgroundColor: 'transparent', duration: 0.3 });
        if (num) gsap.to(num, { color: 'var(--color-text-light)', duration: 0.3 });
        if (question) gsap.to(question, { x: 0, duration: 0.35, ease: 'power3.out' });
      }
    });
  }, { dependencies: [openIndex], scope: container });

  return (
    <section ref={container} id="faq" className="py-20 md:py-48 lg:py-56 bg-[var(--color-bg)]">
      <Container className="max-w-4xl">
        <div className="text-center mb-12 md:mb-24">
          <div className="faq-eyebrow flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-medium)] mb-6">
            <span>― 07</span>
            <span aria-hidden="true" className="opacity-50">·</span>
            <span>FAQ</span>
          </div>
          <h2
            className="faq-heading font-bold text-[var(--color-text-dark)] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">Frequently Asked Questions</SplitText>
          </h2>
          <p className="faq-subtitle text-[18px] md:text-[20px] font-light leading-[1.55] text-[var(--color-text-medium)]">
            Everything you need to know about ArmorIQ
          </p>
          <span
            aria-hidden="true"
            className="faq-rule block mx-auto mt-10 h-[2px] w-24 bg-[var(--color-primary)]"
          />
        </div>

        <div>
          {items.map((it, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                id={`faq-item-${i}`}
                className={`faq-row border-t border-[var(--color-border)] ${i === items.length - 1 ? 'border-b' : ''} relative`}
              >
                <span
                  id={`faq-bar-${i}`}
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-primary)]"
                  style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
                />
                <button
                  id={`faq-trigger-${i}`}
                  className="relative w-full flex items-start gap-4 md:gap-6 py-6 md:py-7 text-left px-4 md:px-6 hover:bg-[var(--color-surface)]/60 transition-colors duration-300"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span
                    id={`faq-num-${i}`}
                    className="flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)] pt-1.5 w-8"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    id={`faq-q-${i}`}
                    className={`flex-1 text-[18px] md:text-[22px] tracking-[-0.01em] leading-snug ${isOpen ? 'font-medium' : 'font-normal'} text-[var(--color-text-dark)]`}
                  >
                    {it.q}
                  </span>
                  <span
                    id={`faq-plus-${i}`}
                    className="flex-shrink-0 w-9 h-9 rounded-full border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-text-medium)] mt-0.5"
                    aria-hidden="true"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="overflow-hidden"
                  style={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    id={`faq-answer-${i}`}
                    className="pb-7 pl-16 md:pl-[78px] pr-14 text-[16px] md:text-[17px] font-light leading-[1.75] text-[var(--color-text-medium)] max-w-3xl"
                  >
                    {it.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
