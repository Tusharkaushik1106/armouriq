'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

const agents = [
  { id: 'AG-001', name: 'support-agent-1', pulse: 1.2 },
  { id: 'AG-002', name: 'analyst-agent', pulse: 1.5 },
  { id: 'AG-003', name: 'billing-bot', pulse: 1.8 },
];

type TargetGlyph = 'db' | 'mail' | 'card' | 'terminal';

const targets: { name: string; uptime: string; glyph: TargetGlyph }[] = [
  { name: 'CRM', uptime: '99.99%', glyph: 'db' },
  { name: 'Database', uptime: '99.97%', glyph: 'db' },
  { name: 'Email API', uptime: '99.92%', glyph: 'mail' },
  { name: 'Billing', uptime: 'OPERATIONAL', glyph: 'card' },
];

type Packet = { label: string; risky: boolean };

const safePackets: Packet[] = [
  { label: 'GET /customers', risky: false },
  { label: 'READ billing.summary', risky: false },
  { label: 'SUMMARIZE emails', risky: false },
  { label: 'QUERY public.stats', risky: false },
  { label: 'FETCH /mcp/tools', risky: false },
];

const riskyPackets: Packet[] = [
  { label: 'DELETE /users/42', risky: true },
  { label: 'POST /email/send', risky: true },
  { label: 'WRITE audit.override', risky: true },
  { label: 'QUERY pii.ssn', risky: true },
  { label: 'EXEC refund:approve', risky: true },
];

function TargetIcon({ glyph }: { glyph: TargetGlyph }) {
  if (glyph === 'db') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <ellipse cx="5" cy="2.5" rx="3.5" ry="1.2" stroke="currentColor" strokeWidth="0.8" />
        <path d="M1.5 2.5v5c0 .7 1.6 1.2 3.5 1.2s3.5-.5 3.5-1.2v-5" stroke="currentColor" strokeWidth="0.8" />
        <path d="M1.5 5c0 .7 1.6 1.2 3.5 1.2s3.5-.5 3.5-1.2" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }
  if (glyph === 'mail') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <rect x="1" y="2.5" width="8" height="5.5" rx="0.5" stroke="currentColor" strokeWidth="0.8" />
        <path d="M1 3l4 3 4-3" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
      </svg>
    );
  }
  if (glyph === 'card') {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <rect x="1" y="2" width="8" height="6" rx="0.8" stroke="currentColor" strokeWidth="0.8" />
        <path d="M1 4h8" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <rect x="1" y="1.5" width="8" height="7" rx="0.5" stroke="currentColor" strokeWidth="0.8" />
      <path d="M2.5 4l1.5 1L2.5 6M5 6.5h2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null);
  const allowedRef = useRef<HTMLSpanElement>(null);
  const blockedRef = useRef<HTMLSpanElement>(null);
  const blockRateRef = useRef<HTMLSpanElement>(null);
  const allowedTrendRef = useRef<HTMLSpanElement>(null);
  const blockedTrendRef = useRef<HTMLSpanElement>(null);
  const uptimeRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const root = container.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initial states
    gsap.set(root.querySelectorAll('.fw-tile'), { opacity: 0, scale: 0.9 });
    gsap.set(root.querySelector('.fw-line'), { scaleY: 0, transformOrigin: 'top center' });
    gsap.set(root.querySelectorAll('.fw-tick'), { opacity: 0 });
    gsap.set(root.querySelectorAll('.fw-timeline-label'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-dashboard'), { opacity: 0 });
    gsap.set(root.querySelector('.fw-scanner'), { opacity: 0 });
    gsap.set(root.querySelectorAll('.fw-label'), { opacity: 0 });
    gsap.set(root.querySelectorAll('.fw-corner'), { opacity: 0, scale: 0.6 });
    gsap.set(root.querySelector('.fw-ambient-scan'), { opacity: 0 });
    gsap.set(root.querySelectorAll('.activity-bar'), { scaleY: 0, transformOrigin: 'bottom center' });

    if (reduced) {
      gsap.set(
        root.querySelectorAll(
          '.fw-tile, .fw-line, .fw-tick, .fw-timeline-label, .fw-dashboard, .fw-label, .fw-corner, .activity-bar'
        ),
        { opacity: 1, scale: 1, scaleY: 1 }
      );
      const pkt = root.querySelector<HTMLElement>('.static-packet');
      if (pkt) gsap.set(pkt, { opacity: 1 });
      return;
    }

    const tl = gsap.timeline({ delay: 3.8 });

    tl.to('.fw-corner', { opacity: 1, scale: 1, stagger: 0.06, duration: 0.4, ease: 'power3.out' })
      .to('.fw-label', { opacity: 1, stagger: 0.08, duration: 0.4 }, '-=0.2')
      .to('.fw-line', { scaleY: 1, duration: 0.7, ease: 'power3.out' }, '-=0.2')
      .to('.fw-tick', { opacity: 1, stagger: 0.025, duration: 0.22 }, '-=0.4')
      .to('.fw-timeline-label', { opacity: 1, stagger: 0.04, duration: 0.3 }, '-=0.2')
      .to(
        '.fw-agent-tile',
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
        '-=0.2'
      )
      .to('.activity-bar', { scaleY: 1, stagger: 0.02, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      .to(
        '.fw-target-tile',
        { opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power3.out' },
        '-=0.4'
      )
      .to('.fw-dashboard', { opacity: 1, duration: 0.4 }, '-=0.2')
      .add('loopStart');

    // Ambient scan line — slow horizontal sweep every 8s
    gsap.to('.fw-ambient-scan', {
      opacity: 0.18,
      duration: 0.5,
      delay: 5,
      onComplete: () => {
        const panelEl = root.querySelector<HTMLElement>('.fw-panel-inner');
        const height = panelEl ? panelEl.clientHeight - 10 : 300;
        gsap.to('.fw-ambient-scan', {
          y: height,
          duration: 8,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
      },
    });

    // Firewall scanner
    gsap.to('.fw-scanner', {
      opacity: 0.6,
      duration: 0.5,
      delay: 4.3,
      onComplete: () => {
        const col = root.querySelector<HTMLElement>('.fw-firewall-col');
        const h = col ? col.clientHeight - 20 : 200;
        gsap.to('.fw-scanner', {
          y: h,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      },
    });

    // Data pulse — a brighter segment sweeps down the firewall line every ~2.5s
    const startDataPulse = () => {
      const line = root.querySelector<HTMLElement>('.fw-line');
      const pulse = root.querySelector<HTMLElement>('.fw-data-pulse');
      if (!line || !pulse) return;
      const h = line.clientHeight;
      gsap.set(pulse, { y: -30, opacity: 0 });
      gsap.timeline({ repeat: -1, repeatDelay: 2.2 })
        .to(pulse, { opacity: 1, duration: 0.15 })
        .to(pulse, { y: h + 30, duration: 1.2, ease: 'power1.in' })
        .to(pulse, { opacity: 0, duration: 0.15 }, '-=0.15');
    };
    gsap.delayedCall(5.2, startDataPulse);

    // Per-agent desynced pulses
    root.querySelectorAll<HTMLElement>('.agent-dot').forEach((dot, i) => {
      const dur = agents[i]?.pulse ?? 1.4;
      gsap.to(dot, {
        opacity: 0.3,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Activity bars — flicker at varied rates
    root.querySelectorAll<HTMLElement>('.activity-bar').forEach((bar, i) => {
      gsap.to(bar, {
        scaleY: gsap.utils.random(0.3, 1),
        duration: gsap.utils.random(0.5, 1.2),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.1,
      });
    });

    // Status dot (top-right) pulse
    gsap.to('.fw-status-dot', {
      opacity: 0.35,
      duration: 1.1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Live dashboard counter
    let allowed = 3812;
    let blocked = 247;
    const startMinutes = 72 * 60 + 14;
    const sessionStart = performance.now();
    const setAllowed = (v: number) => {
      if (allowedRef.current) allowedRef.current.textContent = v.toLocaleString();
    };
    const setBlocked = (v: number) => {
      if (blockedRef.current) blockedRef.current.textContent = v.toLocaleString();
    };
    const setBlockRate = () => {
      if (!blockRateRef.current) return;
      const total = allowed + blocked;
      const rate = total === 0 ? 0 : (blocked / total) * 100;
      blockRateRef.current.textContent = `${rate.toFixed(1)}%`;
    };
    const setUptime = () => {
      if (!uptimeRef.current) return;
      const totalMin = startMinutes + Math.floor((performance.now() - sessionStart) / 60000);
      const h = Math.floor(totalMin / 60);
      const m = totalMin % 60;
      uptimeRef.current.textContent = `${h}h ${String(m).padStart(2, '0')}m`;
    };
    setAllowed(allowed);
    setBlocked(blocked);
    setBlockRate();
    setUptime();

    // Trend flicker every 3–5s
    const cycleTrend = () => {
      if (!allowedTrendRef.current || !blockedTrendRef.current) return;
      const a = (0.2 + Math.random() * 0.6).toFixed(1);
      const b = (0.05 + Math.random() * 0.25).toFixed(2);
      allowedTrendRef.current.textContent = `▲ ${a}%/s`;
      blockedTrendRef.current.textContent = `▲ ${b}%/s`;
      gsap.delayedCall(gsap.utils.random(3, 5), cycleTrend);
    };
    gsap.delayedCall(5.5, cycleTrend);
    gsap.delayedCall(60, function uptimeTick() {
      setUptime();
      gsap.delayedCall(60, uptimeTick);
    });

    // Packet emission
    const emitPacket = () => {
      if (!root.isConnected) return;
      const safe = Math.random() < 0.58;
      const pool = safe ? safePackets : riskyPackets;
      const pkt = pool[Math.floor(Math.random() * pool.length)];
      const willAllow = safe ? Math.random() < 0.9 : Math.random() < 0.2;

      const agentIdx = Math.floor(Math.random() * agents.length);
      const targetIdx = Math.floor(Math.random() * targets.length);
      const agent = agents[agentIdx];

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

      // Glow agent tile briefly
      gsap.fromTo(
        agentTile,
        { boxShadow: '0 1px 2px rgba(45,45,45,0.04), 0 8px 24px rgba(45,45,45,0.06)' },
        {
          boxShadow: '0 0 0 1px rgba(224,123,76,0.45), 0 8px 24px rgba(224,123,76,0.15)',
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        }
      );

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
        'absolute z-30 bg-white border rounded pointer-events-none flex flex-col justify-center items-start';
      el.style.width = 'auto';
      el.style.minWidth = '120px';
      el.style.maxWidth = '170px';
      el.style.padding = '3px 7px';
      el.style.left = '0';
      el.style.top = '0';
      el.style.borderColor = pkt.risky
        ? 'rgba(198,61,61,0.35)'
        : 'var(--color-border-strong)';
      el.style.color = 'var(--color-text-dark)';
      el.style.transform = `translate(${startX}px, ${startY - 16}px) scale(0.8)`;
      el.style.opacity = '0';
      el.innerHTML = `
        <div class="font-mono text-[10px] md:text-[11px] leading-[1.15] whitespace-nowrap">${pkt.label}</div>
        <div class="font-mono text-[8px] md:text-[9px] leading-[1.15] whitespace-nowrap" style="color: var(--color-text-light)">from: ${agent.name}</div>
      `;
      root.appendChild(el);

      // Packet tail
      const tail = document.createElement('div');
      tail.className = 'absolute z-20 pointer-events-none';
      tail.style.left = '0';
      tail.style.top = '0';
      tail.style.height = '2px';
      tail.style.width = '40px';
      tail.style.background = 'linear-gradient(to right, transparent, rgba(224,123,76,0.25))';
      tail.style.transform = `translate(${startX - 40}px, ${startY - 1}px)`;
      tail.style.opacity = '0';
      root.appendChild(tail);

      const tl2 = gsap.timeline({
        onComplete: () => {
          el.remove();
          tail.remove();
        },
      });

      tl2.to(el, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out', transformOrigin: '50% 50%' });
      tl2.to(tail, { opacity: 1, duration: 0.2 }, '<');

      // Travel to firewall
      tl2.to(el, { x: firewallX - startX - 80, duration: 0.7, ease: 'power2.inOut' }, '>-0.05');
      tl2.to(
        tail,
        { x: firewallX - startX - 80, duration: 0.7, ease: 'power2.inOut' },
        '<'
      );

      // Inspection pause
      tl2.to(el, {
        scale: 1.05,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        onStart: () => {
          el.style.borderColor = 'var(--color-primary)';
          const sub = el.children[1] as HTMLElement;
          if (sub) sub.textContent = 'inspecting…';
        },
      });

      // Verdict
      if (willAllow) {
        tl2.to(el, {
          duration: 0.2,
          onStart: () => {
            el.style.borderColor = 'var(--color-success)';
            el.style.background = 'rgba(61,139,92,0.06)';
            const main = el.children[0] as HTMLElement;
            const sub = el.children[1] as HTMLElement;
            if (main) main.innerHTML = '<span style="color: var(--color-success)">✓ ALLOWED</span>';
            if (sub) sub.textContent = pkt.label;
          },
        });
        tl2.to(el, {
          x: endX - startX - 140,
          y: endY - startY,
          duration: 0.55,
          ease: 'power2.out',
          onStart: () => {
            // target ring flash
            const ring = document.createElement('div');
            ring.className = 'absolute pointer-events-none rounded-lg';
            const tr = targetTile.getBoundingClientRect();
            ring.style.left = `${tr.left - rootRect.left - 4}px`;
            ring.style.top = `${tr.top - rootRect.top - 4}px`;
            ring.style.width = `${tr.width + 8}px`;
            ring.style.height = `${tr.height + 8}px`;
            ring.style.border = '1px solid var(--color-primary)';
            ring.style.opacity = '0';
            root.appendChild(ring);
            gsap.to(ring, {
              opacity: 0.9,
              scale: 1.1,
              duration: 0.35,
              ease: 'power2.out',
              onComplete: () => {
                gsap.to(ring, {
                  opacity: 0,
                  duration: 0.35,
                  onComplete: () => ring.remove(),
                });
              },
            });
          },
        });
        tl2.to([el, tail], { opacity: 0, duration: 0.25, ease: 'power2.in' });
        tl2.call(() => {
          allowed += 1;
          setAllowed(allowed);
          setBlockRate();
        });
      } else {
        // shake
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
            el.style.background = 'var(--color-danger-bg)';
            const main = el.children[0] as HTMLElement;
            const sub = el.children[1] as HTMLElement;
            if (main) main.innerHTML = '<span style="color: var(--color-danger)">✕ BLOCKED</span>';
            if (sub) {
              sub.textContent = 'outside scope';
              sub.style.color = 'var(--color-danger)';
            }
          },
        });
        // firewall flash + shockwave
        const flash = document.createElement('div');
        flash.className = 'absolute pointer-events-none';
        flash.style.left = `${firewallX - 1}px`;
        flash.style.top = `${startY - 6}px`;
        flash.style.width = '3px';
        flash.style.height = '12px';
        flash.style.background = 'var(--color-danger)';
        flash.style.opacity = '0';
        root.appendChild(flash);
        gsap.to(flash, {
          opacity: 1,
          duration: 0.1,
          onComplete: () => {
            gsap.to(flash, {
              opacity: 0,
              scaleY: 1.8,
              duration: 0.5,
              onComplete: () => flash.remove(),
            });
          },
        });
        tl2.to([el, tail], { opacity: 0, duration: 0.35, ease: 'power2.in' });
        tl2.call(() => {
          blocked += 1;
          setBlocked(blocked);
          setBlockRate();
        });
      }
    };

    const scheduleNext = () => {
      const delay = gsap.utils.random(1.3, 1.8);
      gsap.delayedCall(delay, () => {
        emitPacket();
        scheduleNext();
      });
    };
    gsap.delayedCall(5, () => {
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
      style={{ aspectRatio: '1 / 1', minHeight: '400px' }}
    >
      {/* Blueprint grid + grain + radial warmth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(45,45,45,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,45,45,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grain pointer-events-none"
        style={{ opacity: 1.25 }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(224,123,76,0.04), transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Corner viewfinder marks */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => {
        const common = 'fw-corner absolute w-3 h-3 pointer-events-none';
        const posCls = {
          tl: 'top-3 left-3 border-t border-l',
          tr: 'top-3 right-3 border-t border-r',
          bl: 'bottom-3 left-3 border-b border-l',
          br: 'bottom-3 right-3 border-b border-r',
        }[pos];
        return (
          <span
            key={pos}
            className={`${common} ${posCls}`}
            style={{ borderColor: 'var(--color-text-light)' }}
            aria-hidden="true"
          />
        );
      })}

      {/* Top labels */}
      <div className="fw-label absolute top-2.5 left-5 md:left-7 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-light)] pointer-events-none">
        ArmorIQ / fw-v2.4
      </div>
      <div className="fw-label absolute top-2.5 right-5 md:right-7 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-light)] flex items-center gap-1.5 pointer-events-none">
        <span className="fw-status-dot w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
        STATUS: ACTIVE
      </div>

      {/* Ambient horizontal scan line */}
      <div
        className="fw-ambient-scan absolute left-0 right-0 pointer-events-none"
        style={{
          top: 0,
          height: '1px',
          background:
            'linear-gradient(to right, transparent, rgba(224,123,76,0.35), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Content grid */}
      <div className="fw-panel-inner relative h-full grid grid-cols-[1fr_1.3fr_1fr] gap-2 md:gap-4 px-5 md:px-7 pt-9 md:pt-10 pb-10 md:pb-12">
        {/* AGENTS */}
        <div className="fw-agents-col flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3">
            Agents
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {agents.map((a) => (
              <div
                key={a.id}
                className="fw-tile fw-agent-tile relative bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 card-shadow"
              >
                <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--color-text-light)] leading-none mb-1">
                  [{a.id}]
                </div>
                <div className="flex items-center gap-2">
                  <span className="agent-dot w-1.5 h-1.5 rounded-full bg-[var(--color-success)] flex-shrink-0" />
                  <span className="font-mono text-[10px] md:text-[11px] text-[var(--color-text-medium)] truncate flex-1">
                    {a.name}
                  </span>
                  {/* Activity bars */}
                  <div className="flex items-end gap-[2px] h-3">
                    {[5, 8, 4].map((h, i) => (
                      <span
                        key={i}
                        className="activity-bar w-[2px] bg-[var(--color-text-light)]"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FIREWALL */}
        <div className="fw-firewall-col relative flex flex-col items-center">
          <div className="fw-label font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-text-light)] mb-2">
            ArmorIQ
          </div>
          <div
            className="fw-label absolute left-0 top-1/2 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-light)] flex flex-col items-center gap-1"
            style={{ transform: 'translateY(-50%) rotate(-90deg)', transformOrigin: 'left center' }}
          >
            <span style={{ opacity: 0.55 }}>::ingress</span>
            <span>Firewall</span>
            <span style={{ opacity: 0.55 }}>::egress</span>
          </div>
          <div className="relative flex-1 w-full flex items-center justify-center">
            <div className="fw-line absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-[var(--color-text-dark)]" />
            {/* Data pulse - a brighter segment */}
            <div
              className="fw-data-pulse absolute left-1/2 -translate-x-1/2 w-[3px] rounded pointer-events-none"
              style={{
                height: '30px',
                top: 0,
                background:
                  'linear-gradient(to bottom, transparent, var(--color-primary), transparent)',
                opacity: 0,
              }}
              aria-hidden="true"
            />
            {/* tick marks with randomized lengths */}
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {Array.from({ length: 10 }).map((_, i) => {
                const lengths = [10, 6, 4, 8, 5, 10, 4, 7, 5, 9];
                const showLabel = i % 3 === 0;
                const labels = [':00', ':16', ':32', ':48', ':04'];
                return (
                  <div key={i} className="relative flex items-center justify-center">
                    <div
                      className="fw-tick h-[2px] bg-[var(--color-text-dark)]"
                      style={{
                        width: `${lengths[i] ?? 6}px`,
                        transform: `translateX(${i % 2 ? -8 : 8}px)`,
                      }}
                    />
                    {showLabel && (
                      <span
                        className="fw-timeline-label absolute left-[calc(50%+14px)] font-mono text-[8px] text-[var(--color-text-light)]"
                      >
                        {labels[Math.floor(i / 3)] ?? ':00'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {/* scanner with trailing gradient */}
            <div
              className="fw-scanner absolute left-[calc(50%-50px)] pointer-events-none"
              style={{
                top: 0,
                width: '100px',
                height: '2px',
                background:
                  'linear-gradient(to bottom, rgba(224,123,76,0.55), rgba(224,123,76,0.15) 70%, transparent)',
                opacity: 0,
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* TARGETS */}
        <div className="fw-targets-col flex flex-col">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-light)] mb-3 text-right">
            Resources
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {targets.map((t) => (
              <div
                key={t.name}
                className="fw-tile fw-target-tile relative bg-white border border-[var(--color-border)] rounded-lg px-3 py-2 card-shadow"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--color-text-light)]">
                    <TargetIcon glyph={t.glyph} />
                  </span>
                  <span className="font-mono text-[10px] md:text-[11px] text-[var(--color-text-medium)] truncate flex-1">
                    {t.name}
                  </span>
                </div>
                <div className="font-mono text-[8px] uppercase tracking-[0.1em] text-[var(--color-text-light)] leading-none mt-1">
                  {t.uptime}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live dashboard */}
      <div
        className="fw-dashboard absolute bottom-3 left-5 md:left-7 font-mono text-[9px] md:text-[10px] text-[var(--color-text-light)] leading-[1.45]"
      >
        <div className="uppercase tracking-[0.15em] mb-0.5">[ SESSION METRICS ]</div>
        <div className="flex items-baseline gap-3">
          <span className="text-[var(--color-success)] w-[64px]">ALLOWED</span>
          <span ref={allowedRef} className="text-[var(--color-text-medium)] tabular-nums w-[52px]">3,812</span>
          <span ref={allowedTrendRef} className="text-[var(--color-text-light)]">▲ 0.4%/s</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[var(--color-danger)] w-[64px]">BLOCKED</span>
          <span ref={blockedRef} className="text-[var(--color-text-medium)] tabular-nums w-[52px]">247</span>
          <span ref={blockedTrendRef} className="text-[var(--color-text-light)]">▲ 0.1%/s</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[var(--color-text-medium)] w-[64px]">BLK RATE</span>
          <span ref={blockRateRef} className="text-[var(--color-text-medium)] tabular-nums w-[52px]">6.1%</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[var(--color-text-medium)] w-[64px]">UPTIME</span>
          <span ref={uptimeRef} className="text-[var(--color-text-medium)] tabular-nums">72h 14m</span>
        </div>
      </div>

      {/* Static fallback packet for reduced motion */}
      <div className="static-packet absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] bg-white border border-[var(--color-success)] text-[var(--color-success)] rounded px-2 py-1 opacity-0 pointer-events-none">
        ✓ ALLOWED
      </div>
    </div>
  );
}
