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

  useGSAP(() => {
    if (!container.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heading = container.current.querySelector('.faq-heading');
    if (heading && !reduced) {
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
    } else if (heading && reduced) {
      gsap.set(heading.querySelectorAll('.split-inner'), { y: 0 });
    }

    items.forEach((_, i) => {
      const panel = container.current!.querySelector<HTMLElement>(`#faq-panel-${i}`);
      const plus = container.current!.querySelector<HTMLElement>(`#faq-plus-${i}`);
      const leftBar = container.current!.querySelector<HTMLElement>(`#faq-bar-${i}`);
      const item = container.current!.querySelector<HTMLElement>(`#faq-item-${i}`);
      if (!panel || !plus || !leftBar || !item) return;
      if (openIndex === i) {
        if (reduced) {
          gsap.set(panel, { height: 'auto', opacity: 1 });
          gsap.set(plus, { rotate: 45 });
          gsap.set(leftBar, { scaleY: 1 });
          return;
        }
        gsap.to(panel, { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' });
        gsap.to(plus, { rotate: 45, duration: 0.35, ease: 'power3.out' });
        gsap.to(leftBar, { scaleY: 1, duration: 0.4, ease: 'power3.out' });
        gsap.to(item, { backgroundColor: 'var(--color-surface)', duration: 0.3 });
      } else {
        gsap.to(panel, {
          height: 0,
          opacity: 0,
          duration: reduced ? 0 : 0.3,
          ease: 'power2.in',
        });
        gsap.to(plus, { rotate: 0, duration: reduced ? 0 : 0.3, ease: 'power3.out' });
        gsap.to(leftBar, { scaleY: 0, duration: reduced ? 0 : 0.3, ease: 'power3.in' });
        gsap.to(item, { backgroundColor: 'transparent', duration: 0.3 });
      }
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { dependencies: [openIndex], scope: container });

  return (
    <section ref={container} id="faq" className="py-24 md:py-36 bg-[var(--color-bg)]">
      <Container className="max-w-4xl">
        <div className="text-center mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-5">
            {'// TECHNICAL FAQ //'} <span className="text-[var(--color-text-medium)]">QUESTIONS</span> {'// 07'}
          </div>
          <h2
            className="faq-heading font-bold text-[var(--color-text-dark)] mb-5"
            style={{ fontSize: 'clamp(36px, 4.5vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1.08 }}
          >
            <SplitText splitBy="word">Frequently Asked Questions</SplitText>
          </h2>
          <p className="text-[17px] font-light leading-[1.6] text-[var(--color-text-medium)]">
            Everything you need to know about ArmorIQ
          </p>
        </div>

        <div>
          {items.map((it, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                id={`faq-item-${i}`}
                className={`border-t border-[var(--color-border)] ${i === items.length - 1 ? 'border-b' : ''} group relative overflow-hidden`}
              >
                {/* Open-state primary bar */}
                <span
                  id={`faq-bar-${i}`}
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-primary)]"
                  style={{ transform: 'scaleY(0)', transformOrigin: 'top center' }}
                />
                {/* Hover hint bar */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-[60px] h-[2px] bg-[var(--color-primary)] transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-0 group-hover:opacity-30'}`}
                />
                <button
                  id={`faq-trigger-${i}`}
                  className="relative w-full flex items-start gap-4 md:gap-6 py-6 md:py-7 text-left px-4 md:px-6"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="flex-shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-light)] pt-1.5">
                    Q{i + 1}
                  </span>
                  <span
                    className={`flex-1 text-[18px] md:text-[22px] tracking-[-0.01em] leading-snug transition-[font-weight,color] duration-300 ${isOpen ? 'font-medium text-[var(--color-text-dark)]' : 'font-normal text-[var(--color-text-dark)]'}`}
                  >
                    {it.q}
                  </span>
                  <span
                    id={`faq-plus-${i}`}
                    className="flex-shrink-0 w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-medium)] mt-0.5"
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
                  <p className="pb-7 pl-12 md:pl-[66px] pr-14 text-[16px] md:text-[17px] font-light leading-[1.75] text-[var(--color-text-medium)] max-w-3xl">
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
