'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

export function ProblemIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(ref.current.querySelectorAll('.pi-draw'), { strokeDashoffset: 0 });
      gsap.set(ref.current.querySelectorAll('.pi-fade'), { opacity: 1 });
      gsap.set(ref.current.querySelectorAll('.pi-x'), { scale: 1, rotate: 0 });
      gsap.set(ref.current.querySelectorAll('.pi-lock'), { rotate: 0, scale: 1 });
      return;
    }

    const paths = ref.current.querySelectorAll<SVGPathElement>('.pi-draw');
    paths.forEach((p) => {
      try {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      } catch {
        // ignore non-path elements
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: ref.current, start: 'top 75%' },
    });

    // Left column: intended flow
    tl.fromTo(
      ref.current.querySelectorAll('.pi-left .pi-fade'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
    );
    tl.to(ref.current.querySelectorAll('.pi-left .pi-draw'), {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      stagger: 0.06,
    }, '-=0.2');

    // Animate the dashed-arrow flow on the left
    tl.to('.pi-intended-arrow', {
      strokeDashoffset: '-=24',
      duration: 1.5,
      ease: 'none',
      repeat: -1,
    }, '<');

    // Right column: blocked flow
    tl.fromTo(
      ref.current.querySelectorAll('.pi-right .pi-fade'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
      '+=0.15'
    );
    tl.fromTo(
      '.pi-firewall-bar',
      { scaleY: 0, transformOrigin: 'bottom center' },
      { scaleY: 1, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    );
    tl.to(ref.current.querySelectorAll('.pi-right .pi-draw'), {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      stagger: 0.06,
    }, '-=0.3');
    tl.fromTo(
      '.pi-x',
      { scale: 0, rotate: -45, transformOrigin: '50% 50%' },
      { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
    );
    // shake
    tl.to('.pi-x', {
      keyframes: [
        { x: -2, duration: 0.05 },
        { x: 2, duration: 0.05 },
        { x: 0, duration: 0.05 },
      ],
      ease: 'none',
    });
    tl.fromTo(
      '.pi-lock',
      { scale: 0, rotate: -90, transformOrigin: '50% 50%' },
      { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.6)' },
      '-=0.2'
    );

    // Annotations
    tl.fromTo(
      ref.current.querySelectorAll('.pi-annotation'),
      { opacity: 0, x: 6 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' },
      '+=0.1'
    );

    // ─── Continuous ambient loops ──────────────────────────────────────

    // Pulsing dot indicators on both agents
    ref.current.querySelectorAll<SVGCircleElement>('.pi-agent-dot').forEach((dot, i) => {
      gsap.to(dot, {
        opacity: 0.3,
        r: 2.5,
        duration: 1.2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Packet tokens flying along the intended arrow (left side, repeating)
    const leftArrow = ref.current.querySelector<SVGPathElement>('.pi-arrow-path-left');
    if (leftArrow) {
      const total = leftArrow.getTotalLength();
      ref.current.querySelectorAll<SVGCircleElement>('.pi-packet-left').forEach((p, i) => {
        const dummy = { t: 0 };
        gsap.to(dummy, {
          t: 1,
          duration: 2.2,
          delay: i * 0.7,
          repeat: -1,
          ease: 'none',
          onUpdate: () => {
            const u = dummy.t;
            const pt = leftArrow.getPointAtLength(u * total);
            p.setAttribute('cx', String(pt.x));
            p.setAttribute('cy', String(pt.y));
            p.setAttribute('opacity', String(u < 0.04 || u > 0.96 ? 0 : 0.9));
          },
        });
      });
    }

    // Right side: blocked packet that crashes into the firewall on a loop
    const rightCrashPath = ref.current.querySelector<SVGPathElement>('.pi-arrow-path-right');
    const blockedPkt = ref.current.querySelector<SVGCircleElement>('.pi-packet-right');
    if (rightCrashPath && blockedPkt) {
      const len = rightCrashPath.getTotalLength();
      const dummy = { t: 0 };
      const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
      loop.set(blockedPkt, { opacity: 0 });
      loop.set(dummy, { t: 0 });
      loop.to(dummy, {
        t: 1,
        duration: 1.1,
        ease: 'power2.in',
        onUpdate: () => {
          const pt = rightCrashPath.getPointAtLength(dummy.t * len);
          blockedPkt.setAttribute('cx', String(pt.x));
          blockedPkt.setAttribute('cy', String(pt.y));
          blockedPkt.setAttribute('opacity', '1');
        },
      });
      // impact flash + jitter
      loop.to('.pi-x', {
        keyframes: [
          { scale: 1.25, duration: 0.08 },
          { scale: 1, duration: 0.18 },
        ],
        ease: 'power2.out',
        transformOrigin: '50% 50%',
      }, '-=0.05');
      loop.to(blockedPkt, { opacity: 0, duration: 0.3 });
    }

    // Pulsing red lock
    gsap.to('.pi-lock', {
      scale: 1.08,
      duration: 1.6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      transformOrigin: '50% 50%',
    });

    // Firewall bar glow (subtle stroke pulse)
    gsap.to('.pi-firewall-bar', {
      attr: { opacity: 0.55 },
      duration: 1.4,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    // Full-card horizontal scanner sweep
    const scanner = ref.current.querySelector<HTMLElement>('.pi-scanner');
    if (scanner) {
      gsap.fromTo(
        scanner,
        { x: '-20%', opacity: 0 },
        {
          x: '120%',
          opacity: 0.6,
          duration: 4.5,
          ease: 'none',
          repeat: -1,
          repeatDelay: 1.2,
          keyframes: [
            { x: '-20%', opacity: 0, duration: 0 },
            { opacity: 0.6, duration: 0.8 },
            { x: '120%', opacity: 0.6, duration: 3.2 },
            { opacity: 0, duration: 0.5 },
          ],
        }
      );
    }

    // Live timer text
    const timerEl = ref.current.querySelector<SVGTextElement>('.pi-timer');
    if (timerEl) {
      let t = 42;
      const tick = () => {
        if (!timerEl.isConnected) return;
        t = (t + 17) % 9999;
        timerEl.textContent = `[t=${(t / 100).toFixed(2)}s]`;
      };
      const id = window.setInterval(tick, 380);
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => clearInterval(id),
        onLeaveBack: () => clearInterval(id),
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 card-shadow overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-60 rounded-xl pointer-events-none" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,45,45,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      {/* Horizontal scanner line — sweeps left to right continuously */}
      <div
        className="pi-scanner absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: '70px',
          left: 0,
          background:
            'linear-gradient(90deg, transparent, rgba(224,123,76,0.18), transparent)',
          opacity: 0,
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      <div className="relative h-full flex flex-col">
        {/* title strip */}
        <div className="flex items-center justify-between mb-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-light)] pi-fade" style={{ opacity: 0 }}>
          <span>policy:customer-support-v3</span>
          <span>scope: read-only</span>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* LEFT — intended */}
          <div className="pi-left relative flex flex-col">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-2 pi-fade" style={{ opacity: 0 }}>
              Intended
            </div>
            <div className="flex-1 relative">
              <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                {/* Agent node */}
                <g className="pi-fade" style={{ opacity: 0 }}>
                  <rect x="15" y="80" width="40" height="40" rx="6" fill="#fff" stroke="var(--color-border-strong)" strokeWidth="1.25" />
                  <circle cx="35" cy="95" r="5" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
                  <path d="M28 110 Q35 104 42 110" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
                  <circle className="pi-agent-dot" cx="52" cy="85" r="1.5" fill="var(--color-success)" />
                </g>
                <text x="35" y="138" textAnchor="middle" className="pi-fade" style={{ opacity: 0 }} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.08em">agent-07</text>

                {/* Hidden path used to drive packet motion */}
                <path
                  className="pi-arrow-path-left"
                  d="M58 100 L140 100"
                  stroke="none"
                  fill="none"
                />
                {/* Visible dashed flow */}
                <path
                  className="pi-intended-arrow"
                  d="M58 100 L140 100"
                  stroke="var(--color-primary)"
                  strokeWidth="1.25"
                  fill="none"
                  strokeDasharray="6 4"
                />
                <path
                  className="pi-draw"
                  d="M135 95 L142 100 L135 105"
                  stroke="var(--color-text-dark)"
                  strokeWidth="1.25"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Flying packets */}
                <circle className="pi-packet-left" cx="58" cy="100" r="3" fill="var(--color-primary)" opacity="0" />
                <circle className="pi-packet-left" cx="58" cy="100" r="2.5" fill="var(--color-primary)" opacity="0" />
                <circle className="pi-packet-left" cx="58" cy="100" r="2" fill="var(--color-primary)" opacity="0" />

                <text x="100" y="88" textAnchor="middle" className="pi-fade" style={{ opacity: 0 }} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-text-medium)" letterSpacing="0.06em">intended: READ.customers</text>
                <text className="pi-timer pi-fade" x="100" y="116" textAnchor="middle" style={{ opacity: 0 }} fontSize="7" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.08em">[t=0.42s]</text>

                {/* Database cylinder */}
                <g className="pi-fade" style={{ opacity: 0 }}>
                  <ellipse cx="165" cy="86" rx="14" ry="4" stroke="var(--color-text-dark)" strokeWidth="1" fill="#fff" />
                  <path d="M151 86 v22 a14 4 0 0 0 28 0 v-22" stroke="var(--color-text-dark)" strokeWidth="1" fill="#fff" />
                  <path d="M151 94 a14 4 0 0 0 28 0 M151 102 a14 4 0 0 0 28 0" stroke="var(--color-text-dark)" strokeWidth="0.8" fill="none" />
                </g>
                <text x="165" y="138" textAnchor="middle" className="pi-fade" style={{ opacity: 0 }} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.08em">Customers</text>
              </svg>
            </div>
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--color-text-light)] pi-annotation mt-2" style={{ opacity: 0 }}>
              within scope · verdict: allow
            </div>
          </div>

          {/* RIGHT — blocked */}
          <div className="pi-right relative flex flex-col border-l border-[var(--color-border)] pl-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--color-danger)] mb-2 pi-fade" style={{ opacity: 0 }}>
              Intercepted
            </div>
            <div className="flex-1 relative">
              <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
                {/* Agent node */}
                <g className="pi-fade" style={{ opacity: 0 }}>
                  <rect x="8" y="80" width="40" height="40" rx="6" fill="#fff" stroke="var(--color-border-strong)" strokeWidth="1.25" />
                  <circle cx="28" cy="95" r="5" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
                  <path d="M21 110 Q28 104 35 110" stroke="var(--color-text-dark)" strokeWidth="1" fill="none" />
                  <circle className="pi-agent-dot" cx="45" cy="85" r="1.5" fill="var(--color-danger)" />
                </g>

                {/* Hidden path the blocked packet rides */}
                <path className="pi-arrow-path-right" d="M52 100 L100 100" stroke="none" fill="none" />

                {/* Arrow from agent toward firewall */}
                <path
                  className="pi-draw"
                  d="M52 100 L100 100"
                  stroke="var(--color-text-dark)"
                  strokeWidth="1.25"
                  fill="none"
                />

                {/* The packet that gets crashed into the firewall */}
                <circle className="pi-packet-right" cx="52" cy="100" r="3" fill="var(--color-danger)" opacity="0" />

                {/* Firewall vertical bar */}
                <rect
                  className="pi-firewall-bar"
                  x="102"
                  y="60"
                  width="3"
                  height="80"
                  fill="var(--color-text-dark)"
                />
                <g className="pi-fade" style={{ opacity: 0 }}>
                  <rect x="95" y="58" width="17" height="2" fill="var(--color-text-dark)" />
                  <rect x="95" y="140" width="17" height="2" fill="var(--color-text-dark)" />
                </g>

                {/* Red X at impact */}
                <g className="pi-x" transform="translate(103 100)" style={{ transform: 'translate(103px,100px)' }}>
                  <circle r="10" fill="var(--color-danger-bg)" stroke="var(--color-danger)" strokeWidth="1.25" />
                  <path d="M-4 -4 L4 4 M4 -4 L-4 4" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" />
                </g>

                {/* Target with lock overlay - muted because not reached */}
                <g className="pi-fade" style={{ opacity: 0 }}>
                  <rect x="145" y="80" width="40" height="40" rx="6" fill="#fff" stroke="var(--color-border-strong)" strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M155 96 h20 M155 102 h20 M155 108 h16" stroke="var(--color-text-light)" strokeWidth="1" />
                </g>
                <g className="pi-lock" style={{ transform: 'translate(170px, 78px)' }}>
                  <circle cx="0" cy="0" r="8" fill="#fff" stroke="var(--color-danger)" strokeWidth="1" />
                  <path d="M-3 -1 v-2 a3 3 0 0 1 6 0 v2" stroke="var(--color-danger)" strokeWidth="0.9" fill="none" />
                  <rect x="-3.5" y="-1" width="7" height="5" rx="0.5" fill="var(--color-danger)" />
                </g>
                <text x="165" y="138" textAnchor="middle" className="pi-fade" style={{ opacity: 0 }} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-text-light)" letterSpacing="0.08em">Billing</text>

                {/* BLOCKED label */}
                <text x="103" y="160" textAnchor="middle" className="pi-fade" style={{ opacity: 0 }} fontSize="8" fontFamily="var(--font-mono)" fill="var(--color-danger)" letterSpacing="0.1em" fontWeight="700">BLOCKED</text>
              </svg>
            </div>
            <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--color-text-light)] pi-annotation mt-2 leading-[1.4]" style={{ opacity: 0 }}>
              attempted: WRITE.billing<br />
              <span className="text-[var(--color-danger)]">outside declared scope</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
