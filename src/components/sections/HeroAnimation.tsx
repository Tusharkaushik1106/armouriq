'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const agents = ['support-agent-1', 'analyst-agent', 'billing-bot'];
const targets = ['CRM', 'Database', 'Email API', 'Billing'];

type Packet = {
  label: string;
  risky: boolean;
  verdictLabel: string;
};

const safePackets: Packet[] = [
  { label: 'GET /customers', risky: false, verdictLabel: 'ALLOWED' },
  { label: 'READ billing.summary', risky: false, verdictLabel: 'ALLOWED' },
  { label: 'SUMMARIZE emails', risky: false, verdictLabel: 'ALLOWED' },
  { label: 'QUERY public.stats', risky: false, verdictLabel: 'ALLOWED' },
  { label: 'FETCH /mcp/tools', risky: false, verdictLabel: 'ALLOWED' },
];

const riskyPackets: Packet[] = [
  { label: 'DELETE /users/42', risky: true, verdictLabel: 'BLOCKED' },
  { label: 'POST /email/send', risky: true, verdictLabel: 'BLOCKED' },
  { label: 'WRITE audit.override', risky: true, verdictLabel: 'BLOCKED' },
  { label: 'QUERY pii.ssn', risky: true, verdictLabel: 'BLOCKED' },
  { label: 'EXEC refund:approve', risky: true, verdictLabel: 'BLOCKED' },
];

export function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const allowedRef = useRef<HTMLSpanElement>(null);
  const blockedRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const root = container.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial states
    gsap.set(root.querySelectorAll('.fw-tile'), { opacity: 0, scale: 0.9 });
    gsap.set(root.querySelector('.fw-line'), { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(root.querySelectorAll('.fw-tick'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-counter'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-scanner'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-label-top'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-label-side'), { opacity: 0 });

    if (reduced) {
      gsap.set(root.querySelectorAll('.fw-tile, .fw-line, .fw-tick, .fw-counter, .fw-label-top, .fw-label-side'), {
        opacity: 1,
        scale: 1,
        scaleY: 1,
      });
      // show one static allowed packet
      const pkt = root.querySelector<HTMLElement>('.static-packet');
      if (pkt) gsap.set(pkt, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 3.8 });

    tl.to('.fw-line', { scaleY: 1, duration: 0.7, ease: 'power3.out' })
      .to('.fw-tick', { opacity: 1, stagger: 0.03, duration: 0.25 }, '-=0.3')
      .to('.fw-label-top', { opacity: 1, duration: 0.4 }, '-=0.3')
      .to('.fw-label-side', { opacity: 1, duration: 0.4 }, '-=0.3')
      .to('.fw-agent-tile', { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.2')
      .to('.fw-target-tile', { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .to('.fw-counter', { opacity: 1, duration: 0.4 })
      .add('loopStart');

    // Scanner (horizontal line sweeping up and down the firewall)
    gsap.to('.fw-scanner', {
      opacity: 0.6,
      duration: 0.5,
      delay: 4.3,
      onComplete: () => {
        gsap.to('.fw-scanner', {
          y: () => {
            const panel = root.querySelector<HTMLElement>('.fw-firewall-col');
            return panel ? panel.clientHeight - 20 : 200;
          },
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      },
    });

    // Pulsing dot on agent tiles
    gsap.to('.agent-dot', {
      opacity: 0.3,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    });

    // Packet loop
    let allowed = 3812;
    let blocked = 247;
    const setAllowed = (v: number) => {
      if (allowedRef.current) allowedRef.current.textContent = v.toLocaleString();
    };
    const setBlocked = (v: number) => {
      if (blockedRef.current) blockedRef.current.textContent = v.toLocaleString();
    };
    setAllowed(allowed);
    setBlocked(blocked);

    const emitPacket = () => {
      if (!root.isConnected) return;
      const safe = Math.random() < 0.58;
      const pool = safe ? safePackets : riskyPackets;
      const pkt = pool[Math.floor(Math.random() * pool.length)];
      // ~80% of risky = BLOCK, ~20% fallthrough ALLOW; ~90% of safe = ALLOW, ~10% flagged BLOCK
      const willAllow = safe ? Math.random() < 0.9 : Math.random() < 0.2;

      const agentIdx = Math.floor(Math.random() * agents.length);
      const targetIdx = Math.floor(Math.random() * targets.length);

      const agentsCol = root.querySelector<HTMLElement>('.fw-agents-col');
      const targetsCol = root.querySelector<HTMLElement>('.fw-targets-col');
      const firewallCol = root.querySelector<HTMLElement>('.fw-firewall-col');
      const rootRect = root.getBoundingClientRect();
      if (!agentsCol || !targetsCol || !firewallCol) return;

      const agentTiles = agentsCol.querySelectorAll<HTMLElement>('.fw-agent-tile');
      const targetTiles = targetsCol.querySelectorAll<HTMLElement>('.fw-target-tile');
      const agentTile = agentTiles[agentIdx];
      const targetTile = targetTiles[targetIdx];
      if (!agentTile || !targetTile) return;

      const agentRect = agentTile.getBoundingClientRect();
      const targetRect = targetTile.getBoundingClientRect();
      const firewallRect = firewallCol.getBoundingClientRect();

      const startX = agentRect.right - rootRect.left - 4;
      const startY = agentRect.top + agentRect.height / 2 - rootRect.top;
      const firewallX = firewallRect.left + firewallRect.width / 2 - rootRect.left;
      const endX = targetRect.left - rootRect.left + 4;
      const endY = targetRect.top + targetRect.height / 2 - rootRect.top;

      const el = document.createElement('div');
      el.className =
        'absolute z-30 flex items-center justify-center font-mono text-[10px] md:text-[11px] bg-white border rounded px-2 py-1 whitespace-nowrap pointer-events-none';
      el.style.width = 'auto';
      el.style.minWidth = '100px';
      el.style.maxWidth = '140px';
      el.style.height = '22px';
      el.style.left = '0';
      el.style.top = '0';
      el.style.borderColor = 'var(--color-border-strong)';
      el.style.color = 'var(--color-text-dark)';
      el.style.transform = `translate(${startX}px, ${startY - 11}px) scale(0.8)`;
      el.style.opacity = '0';
      el.textContent = pkt.label;
      root.appendChild(el);

      const tl2 = gsap.timeline({
        onComplete: () => {
          el.remove();
        },
      });

      // spawn
      tl2.to(el, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', transformOrigin: '50% 50%' });
      // travel to firewall
      tl2.to(el, {
        x: firewallX - 60,
        duration: 0.7,
        ease: 'power2.inOut',
        onUpdate: function () {
          // keep y close to agent y (slight drift)
        },
      });
      // inspection pause - color flash + scan
      tl2.to(el, {
        duration: 0.3,
        onStart: () => {
          el.style.borderColor = 'var(--color-primary)';
          el.textContent = 'check: intent…';
        },
      });
      // verdict
      if (willAllow) {
        tl2.to(el, {
          duration: 0.25,
          onStart: () => {
            el.style.borderColor = 'var(--color-success)';
            el.style.color = 'var(--color-success)';
            el.textContent = 'ALLOWED';
          },
        });
        // travel to target
        tl2.to(el, {
          x: endX - startX - 100,
          y: endY - startY,
          duration: 0.55,
          ease: 'power2.out',
          onStart: () => {
            // target flash
            gsap.fromTo(
              targetTile,
              { backgroundColor: '#ffffff' },
              { backgroundColor: 'var(--color-surface)', duration: 0.2, yoyo: true, repeat: 1 }
            );
          },
        });
        tl2.to(el, { opacity: 0, duration: 0.25, ease: 'power2.in' });
        tl2.call(() => {
          allowed += 1;
          setAllowed(allowed);
        });
      } else {
        // shake
        tl2.to(el, {
          duration: 0.3,
          keyframes: [
            { x: `+=3`, duration: 0.05 },
            { x: `-=6`, duration: 0.05 },
            { x: `+=4`, duration: 0.05 },
            { x: `-=1`, duration: 0.05 },
          ],
          onStart: () => {
            el.style.borderColor = 'var(--color-danger)';
            el.style.color = 'var(--color-danger)';
            el.style.background = 'var(--color-danger-bg)';
            el.textContent = 'BLOCKED';
          },
        });
        // firewall flash at impact y
        const flash = document.createElement('div');
        flash.className = 'absolute pointer-events-none';
        flash.style.left = `${firewallX - 1}px`;
        flash.style.top = `${startY - 4}px`;
        flash.style.width = '3px';
        flash.style.height = '8px';
        flash.style.background = 'var(--color-danger)';
        flash.style.opacity = '0';
        root.appendChild(flash);
        gsap.to(flash, {
          opacity: 1,
          duration: 0.1,
          onComplete: () => {
            gsap.to(flash, {
              opacity: 0,
              duration: 0.4,
              onComplete: () => flash.remove(),
            });
          },
        });
        tl2.to(el, { opacity: 0, duration: 0.35, ease: 'power2.in' });
        tl2.call(() => {
          blocked += 1;
          setBlocked(blocked);
        });
      }
    };

    // Schedule emissions with randomized cadence
    const scheduleNext = () => {
      const delay = gsap.utils.random(1.3, 1.8);
      gsap.delayedCall(delay, () => {
        emitPacket();
        scheduleNext();
      });
    };
    gsap.delayedCall(4.5, () => {
      emitPacket();
      scheduleNext();
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      role="img"
      aria-label="Animation demonstrating the ArmorIQ firewall inspecting AI agent tool calls and either allowing safe actions or blocking unauthorized ones"
      className="relative w-full border border-[var(--color-border-strong)] rounded-[14px] bg-[var(--color-surface)] overflow-hidden card-shadow"
      style={{ aspectRatio: '1 / 1', minHeight: '380px' }}
    >
      {/* grid + grain */}
      <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-grain pointer-events-none" aria-hidden="true" />

      {/* 3 columns grid */}
      <div className="relative h-full grid grid-cols-[1fr_1.3fr_1fr] gap-2 md:gap-4 p-5 md:p-7">
        {/* AGENTS */}
        <div className="fw-agents-col flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3">
            Agents
          </div>
          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {agents.map((a) => (
              <div
                key={a}
                className="fw-tile fw-agent-tile flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 card-shadow"
              >
                <span className="agent-dot w-1.5 h-1.5 rounded-full bg-[var(--color-success)] flex-shrink-0" />
                <span className="font-mono text-[10px] md:text-[11px] text-[var(--color-text-medium)] truncate">
                  {a}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FIREWALL */}
        <div className="fw-firewall-col relative flex flex-col items-center">
          <div className="fw-label-top font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-light)] mb-2">
            ArmorIQ
          </div>
          <div
            className="fw-label-side absolute -left-1 top-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-light)]"
            style={{ transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center' }}
          >
            Firewall
          </div>
          <div className="relative flex-1 w-full flex items-center justify-center">
            {/* vertical firewall line */}
            <div
              className="fw-line absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--color-text-dark)]"
            />
            {/* tick marks */}
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="fw-tick h-[2px] w-[10px] bg-[var(--color-text-dark)] mx-auto"
                  style={{ transform: `translateX(${i % 2 ? -8 : 8}px)` }}
                />
              ))}
            </div>
            {/* scanner */}
            <div
              className="fw-scanner absolute left-[calc(50%-40px)] w-[80px] h-[1px] bg-[var(--color-primary)] pointer-events-none"
              style={{ top: 0, opacity: 0 }}
            />
          </div>
        </div>

        {/* TARGETS */}
        <div className="fw-targets-col flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3 text-right">
            Resources
          </div>
          <div className="flex flex-col gap-2.5 flex-1 justify-center">
            {targets.map((t) => (
              <div
                key={t}
                className="fw-tile fw-target-tile flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 card-shadow"
              >
                <span className="font-mono text-[10px] md:text-[11px] text-[var(--color-text-medium)] truncate">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Counter bar */}
      <div className="fw-counter absolute bottom-3 left-5 md:left-7 font-mono text-[10px] md:text-[11px] text-[var(--color-text-light)] flex items-center gap-2">
        <span className="text-[var(--color-success)]">ALLOWED</span>
        <span ref={allowedRef} className="text-[var(--color-text-medium)] tabular-nums">3,812</span>
        <span className="opacity-50 mx-1">·</span>
        <span className="text-[var(--color-danger)]">BLOCKED</span>
        <span ref={blockedRef} className="text-[var(--color-text-medium)] tabular-nums">247</span>
      </div>

      {/* static fallback packet for reduced motion */}
      <div
        className="static-packet absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] bg-white border border-[var(--color-success)] text-[var(--color-success)] rounded px-2 py-1 opacity-0 pointer-events-none"
      >
        ALLOWED
      </div>
    </div>
  );
}
