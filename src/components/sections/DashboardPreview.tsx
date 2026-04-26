'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SplitText } from '@/components/ui/SplitText';

export function DashboardPreview() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heading = ref.current.querySelector<HTMLElement>('.dp-heading');
    const sub = ref.current.querySelector<HTMLElement>('.dp-sub');
    const frame = ref.current.querySelector<HTMLElement>('.dp-frame');
    const stats = ref.current.querySelectorAll<HTMLElement>('.dp-stat');

    if (reduced) {
      if (heading) gsap.set(heading.querySelectorAll('.split-inner'), { y: 0 });
      if (sub) gsap.set(sub, { opacity: 1, y: 0 });
      if (frame) gsap.set(frame, { opacity: 1, y: 0, scale: 1 });
      gsap.set(stats, { opacity: 1, y: 0 });
      return;
    }

    if (heading) gsap.set(heading.querySelectorAll('.split-inner'), { y: '130%' });
    if (sub) gsap.set(sub, { opacity: 0, y: 16 });
    if (frame) gsap.set(frame, { opacity: 0, y: 60, scale: 0.96, transformOrigin: 'center top' });
    gsap.set(stats, { opacity: 0, y: 18 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 70%', once: true },
    });
    if (heading)
      tl.to(heading.querySelectorAll('.split-inner'), {
        y: 0,
        stagger: 0.05,
        duration: 0.7,
        ease: 'power3.out',
      });
    if (sub)
      tl.to(sub, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.4');
    if (frame)
      tl.to(
        frame,
        { opacity: 1, y: 0, scale: 1, duration: 0.95, ease: 'power3.out' },
        '-=0.3'
      );
    tl.to(stats, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.5');

    // Subtle parallax on the frame as the user scrolls past
    if (frame) {
      gsap.to(frame, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <section
      ref={ref}
      id="dashboard"
      className="relative py-32 md:py-40 lg:py-48 bg-[var(--color-bg)] overflow-hidden"
    >
      {/* Decorative grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 75%)',
        }}
      />

      <Container className="relative">
        <div className="max-w-4xl mx-auto mb-16 md:mb-20 text-center">
          <SectionEyebrow num="05" label="The Dashboard" align="center" className="mb-6" />
          <h2
            className="dp-heading font-bold text-[var(--color-text-dark)] mb-6"
            style={{ fontSize: 'clamp(36px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}
          >
            <SplitText splitBy="word">One pane of glass for every agent.</SplitText>
          </h2>
          <p className="dp-sub text-[18px] md:text-[20px] font-light leading-[1.55] text-[var(--color-text-medium)] max-w-2xl mx-auto">
            Live MCP servers, intent verdicts, compliance score, and audit trail — surfaced in real time so security teams act before incidents land.
          </p>
        </div>

        {/* Browser-frame mockup */}
        <div
          className="dp-frame relative max-w-6xl mx-auto rounded-2xl overflow-hidden border border-[var(--color-border-strong)] bg-white card-shadow"
          style={{ boxShadow: '0 30px 80px -20px rgba(45,45,45,0.18), 0 8px 24px rgba(45,45,45,0.06)' }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
            <span className="block w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="block w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="block w-3 h-3 rounded-full bg-[#28C840]" />
            <div className="ml-4 flex-1 flex justify-center">
              <span className="font-mono text-[11px] text-[var(--color-text-light)] tracking-[0.1em]">
                app.armoriq.ai/dashboard
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-success)]">
              ● Live
            </span>
          </div>
          {/* Screenshot */}
          <div className="relative">
            <Image
              src="/tab-about.webp"
              alt="ArmorIQ security dashboard — active MCP endpoints, agents, policy violations, compliance score, and recent alerts"
              width={2400}
              height={1500}
              priority={false}
              className="block w-full h-auto"
            />
            {/* Subtle gradient at bottom edge so the screenshot feels embedded */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.7))',
              }}
            />
          </div>
        </div>

        {/* Stats strip below the frame */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto mt-14">
          {[
            { k: 'MCP endpoints', v: '2,456' },
            { k: 'Active agents', v: '2,100' },
            { k: 'Policy violations / 24h', v: '12' },
            { k: 'Compliance score', v: '92%' },
          ].map((s) => (
            <div key={s.k} className="dp-stat text-center md:text-left">
              <div
                className="font-bold text-[var(--color-text-dark)]"
                style={{ fontSize: 'clamp(28px, 3vw, 40px)', letterSpacing: '-0.02em' }}
              >
                {s.v}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-light)] mt-1.5 leading-snug">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
