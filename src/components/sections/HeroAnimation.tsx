'use client';
import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

const agents = ['support-agent', 'analyst-agent', 'summary-agent'];
const targets = ['Customer Data', 'Email', 'Calendar', 'Billing'];

type Packet = { label: string; kind: 'allow' | 'block' | 'downscope'; reason?: string };

// Allowed = action belongs to declared intent
const allowedPackets: Packet[] = [
  { label: 'SUMMARIZE inbox.recent', kind: 'allow' },
  { label: 'READ customer.query', kind: 'allow' },
  { label: 'QUERY analytics.daily', kind: 'allow' },
  { label: 'GET schedule.today', kind: 'allow' },
  { label: 'FETCH /mcp/tools', kind: 'allow' },
];

// Blocked = exceeds delegated scope
const blockedPackets: Packet[] = [
  { label: 'DELETE /users/42', kind: 'block', reason: 'exceeds delegated scope' },
  { label: 'POST /email/send', kind: 'block', reason: 'outside task scope' },
  { label: 'WRITE audit.override', kind: 'block', reason: 'policy violation' },
  { label: 'READ billing.records', kind: 'block', reason: 'outside task scope' },
  { label: 'EXEC refund:approve', kind: 'block', reason: 'exceeds delegated scope' },
];

// Down-scoped = allowed but narrowed
const downscopePackets: Packet[] = [
  { label: 'READ pii.email', kind: 'downscope', reason: 'masked' },
  { label: 'QUERY billing.*', kind: 'downscope', reason: '→ billing.summary' },
  { label: 'LIST contacts', kind: 'downscope', reason: '→ first 25' },
];

export function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const allowedRef = useRef<HTMLSpanElement>(null);
  const blockedRef = useRef<HTMLSpanElement>(null);
  const downscopedRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const root = container.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.set(root.querySelectorAll('.fw-tile'), { opacity: 0, scale: 0.94 });
    gsap.set(root.querySelector('.fw-line'), { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(root.querySelectorAll('.fw-tick'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-counter'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-scanner'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-label-top'), { opacity: 0 });

    if (reduced) {
      gsap.set(
        root.querySelectorAll('.fw-tile, .fw-line, .fw-tick, .fw-counter, .fw-label-top'),
        { opacity: 1, scale: 1, scaleY: 1 }
      );
      const pkt = root.querySelector<HTMLElement>('.static-packet');
      if (pkt) gsap.set(pkt, { opacity: 1 });
      return;
    }

    // Build the entrance timeline but hold it paused until the section enters view
    const tl = gsap.timeline({ paused: true });
    tl.to('.fw-label-top', { opacity: 1, duration: 0.4 })
      .to('.fw-line', { scaleY: 1, duration: 0.8, ease: 'power3.out' }, '-=0.1')
      .to('.fw-tick', { opacity: 1, stagger: 0.03, duration: 0.25 }, '-=0.4')
      .to(
        '.fw-agent-tile',
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
        '-=0.2'
      )
      .to(
        '.fw-target-tile',
        { opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .to('.fw-counter', { opacity: 1, duration: 0.5 }, '-=0.2')
      .call(() => {
        // Start scanner & packet loop after entrance completes
        gsap.to('.fw-scanner', {
          opacity: 0.5,
          duration: 0.5,
          onComplete: () => {
            const col = root.querySelector<HTMLElement>('.fw-firewall-col');
            const h = col ? col.clientHeight - 20 : 220;
            gsap.to('.fw-scanner', {
              y: h,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
            });
          },
        });
        startPacketLoop();
      });

    ScrollTrigger.create({
      trigger: root,
      start: 'top 75%',
      once: true,
      onEnter: () => tl.play(),
    });

    // Pulsing dots on agent tiles — single, desynced
    root.querySelectorAll<HTMLElement>('.agent-dot').forEach((dot, i) => {
      gsap.to(dot, {
        opacity: 0.3,
        duration: 1.2 + i * 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Counter
    let allowed = 3812;
    let blocked = 247;
    let downscoped = 412;
    const setAllowed = (v: number) => {
      if (allowedRef.current) allowedRef.current.textContent = v.toLocaleString();
    };
    const setBlocked = (v: number) => {
      if (blockedRef.current) blockedRef.current.textContent = v.toLocaleString();
    };
    const setDownscoped = (v: number) => {
      if (downscopedRef.current) downscopedRef.current.textContent = v.toLocaleString();
    };
    setAllowed(allowed);
    setBlocked(blocked);
    setDownscoped(downscoped);

    // Packet loop — pick a verdict mix that mirrors ArmorIQ's three outcomes
    const emitPacket = () => {
      if (!root.isConnected) return;
      const r = Math.random();
      let pkt: Packet;
      if (r < 0.55) {
        pkt = allowedPackets[Math.floor(Math.random() * allowedPackets.length)];
      } else if (r < 0.85) {
        pkt = blockedPackets[Math.floor(Math.random() * blockedPackets.length)];
      } else {
        pkt = downscopePackets[Math.floor(Math.random() * downscopePackets.length)];
      }

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
        'absolute z-30 bg-white border rounded px-2 py-1 pointer-events-none font-mono text-[10px] md:text-[11px] whitespace-nowrap';
      el.style.left = '0';
      el.style.top = '0';
      el.style.borderColor = 'var(--color-border-strong)';
      el.style.color = 'var(--color-text-dark)';
      el.style.transform = `translate(${startX}px, ${startY - 12}px) scale(0.85)`;
      el.style.opacity = '0';
      el.textContent = pkt.label;
      root.appendChild(el);

      const tl2 = gsap.timeline({ onComplete: () => el.remove() });
      tl2.to(el, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', transformOrigin: '50% 50%' });
      tl2.to(el, { x: firewallX - startX - 60, duration: 0.7, ease: 'power2.inOut' });
      tl2.to(el, { duration: 0.3 });

      if (pkt.kind === 'allow') {
        tl2.to(el, {
          duration: 0.2,
          onStart: () => {
            el.style.borderColor = 'var(--color-success)';
            el.style.color = 'var(--color-success)';
            el.textContent = '✓ ALLOWED';
          },
        });
        tl2.to(el, {
          x: endX - startX - 80,
          y: endY - startY,
          duration: 0.55,
          ease: 'power2.out',
          onStart: () => {
            const ring = document.createElement('div');
            ring.className = 'absolute pointer-events-none rounded-full';
            const firewallInteract = el.getBoundingClientRect();
            ring.style.left = `${firewallInteract.left - rootRect.left - 8}px`;
            ring.style.top = `${firewallInteract.top - rootRect.top - 8}px`;
            ring.style.width = `${firewallInteract.width + 16}px`;
            ring.style.height = `${firewallInteract.height + 16}px`;
            ring.style.border = '1px solid var(--color-primary)';
            ring.style.opacity = '0';
            root.appendChild(ring);
            gsap.to(ring, {
              opacity: 0.8,
              scale: 1.3,
              duration: 0.45,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(ring, { opacity: 0, duration: 0.3, onComplete: () => ring.remove() });
              },
            });
          },
        });
        tl2.to(el, { opacity: 0, duration: 0.25, ease: 'power2.in' });
        tl2.call(() => {
          allowed += 1;
          setAllowed(allowed);
        });
      } else if (pkt.kind === 'downscope') {
        const reason = pkt.reason ?? 'narrowed';
        tl2.to(el, {
          duration: 0.25,
          onStart: () => {
            el.style.borderColor = 'var(--color-primary)';
            el.style.color = 'var(--color-primary)';
            el.textContent = `↘ DOWN-SCOPED · ${reason}`;
          },
        });
        tl2.to(el, {
          x: endX - startX - 80,
          y: endY - startY,
          duration: 0.6,
          ease: 'power2.out',
        });
        tl2.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in' });
        tl2.call(() => {
          downscoped += 1;
          setDownscoped(downscoped);
        });
      } else {
        const reason = pkt.reason ?? 'outside task scope';
        tl2.to(el, {
          duration: 0.3,
          keyframes: [
            { x: '+=3', duration: 0.05 },
            { x: '-=6', duration: 0.05 },
            { x: '+=4', duration: 0.05 },
            { x: '-=1', duration: 0.05 },
          ],
          onStart: () => {
            el.style.borderColor = 'var(--color-danger)';
            el.style.color = 'var(--color-danger)';
            el.style.background = 'var(--color-danger-bg)';
            el.textContent = `✕ BLOCKED · ${reason}`;
          },
        });
        tl2.to(el, { opacity: 0, duration: 0.45, ease: 'power2.in' });
        tl2.call(() => {
          blocked += 1;
          setBlocked(blocked);
        });
      }
    };

    const scheduleNext = () => {
      const delay = gsap.utils.random(1.4, 1.9);
      gsap.delayedCall(delay, () => {
        emitPacket();
        scheduleNext();
      });
    };

    function startPacketLoop() {
      emitPacket();
      scheduleNext();
    }
  }, { scope: container });

  return (
    <div
      ref={container}
      role="img"
      aria-label="ArmorIQ intent check sitting between AI agents and governance domains — allowing actions inside declared intent, blocking actions outside task scope, down-scoping where policy permits"
      className="relative w-full border border-[var(--color-border-strong)] rounded-[14px] bg-[var(--color-surface)] overflow-hidden card-shadow"
      style={{ aspectRatio: '1 / 1', minHeight: '320px' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,45,45,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.045) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Top label — declared intent in flight */}
      <div className="fw-label-top absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.16em] md:tracking-[0.2em] text-[var(--color-text-light)] pointer-events-none whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden">
        <span>Intent</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span className="text-[var(--color-text-medium)]">summarize-emails</span>
        <span aria-hidden="true" className="opacity-50">·</span>
        <span>ArmorIQ</span>
      </div>

      {/* 3 columns */}
      <div className="fw-panel-inner relative h-full grid grid-cols-[1fr_1.2fr_1fr] gap-4 md:gap-6 px-6 md:px-8 pt-10 pb-10">
        {/* Agents */}
        <div className="fw-agents-col flex flex-col justify-center gap-3">
          {agents.map((a) => (
            <div
              key={a}
              className="fw-tile fw-agent-tile flex items-center gap-2.5 bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 card-shadow"
            >
              <span className="agent-dot w-1.5 h-1.5 rounded-full bg-[var(--color-success)] flex-shrink-0" />
              <span className="font-mono text-[11px] text-[var(--color-text-medium)] truncate">
                {a}
              </span>
            </div>
          ))}
        </div>

        {/* Firewall */}
        <div className="fw-firewall-col relative flex items-center justify-center">
          <div className="fw-line absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--color-text-dark)]" />
          <div className="absolute inset-0 flex flex-col justify-between py-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="fw-tick h-[2px] w-[8px] bg-[var(--color-text-dark)] mx-auto"
                style={{ transform: `translateX(${i % 2 ? -6 : 6}px)` }}
              />
            ))}
          </div>
          <div
            className="fw-scanner absolute left-[calc(50%-40px)] w-[80px] pointer-events-none"
            style={{
              top: 0,
              height: '1px',
              background:
                'linear-gradient(to right, transparent, var(--color-primary), transparent)',
              opacity: 0,
            }}
            aria-hidden="true"
          />
        </div>

        {/* Targets */}
        <div className="fw-targets-col flex flex-col justify-center gap-3">
          {targets.map((t) => (
            <div
              key={t}
              className="fw-tile fw-target-tile flex items-center bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 card-shadow"
            >
              <span className="font-mono text-[11px] text-[var(--color-text-medium)] truncate">
                {t}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Counter — three verdicts, ArmorIQ vocab */}
      <div className="fw-counter absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[11px] text-[var(--color-text-light)] whitespace-nowrap max-w-[calc(100%-1rem)] overflow-hidden text-ellipsis">
        <span className="text-[var(--color-success)]">●</span>{' '}
        <span className="text-[var(--color-text-medium)]">ALLOWED</span>{' '}
        <span ref={allowedRef} className="tabular-nums">3,812</span>
        <span className="mx-2 opacity-40">·</span>
        <span className="text-[var(--color-danger)]">●</span>{' '}
        <span className="text-[var(--color-text-medium)]">BLOCKED</span>{' '}
        <span ref={blockedRef} className="tabular-nums">247</span>
        <span className="mx-2 opacity-40">·</span>
        <span className="text-[var(--color-primary)]">●</span>{' '}
        <span className="text-[var(--color-text-medium)]">DOWN-SCOPED</span>{' '}
        <span ref={downscopedRef} className="tabular-nums">412</span>
      </div>

      <div className="static-packet absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] bg-white border border-[var(--color-success)] text-[var(--color-success)] rounded px-2 py-1 opacity-0 pointer-events-none">
        ✓ ALLOWED · matches intent
      </div>
    </div>
  );
}
