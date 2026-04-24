# ArmorIQ Animation Deep-Dive — New Components + Signature Motion

The site is live at https://armouriq-psi.vercel.app/. Looking at the deployed DOM, the Pass 1 bug fixes from the last prompt did NOT land. Fix that first, then build the new signature animation components.

Execute in 4 phases. Commit after each. Verify in the browser, not just the terminal.

---

## HOW TO WORK

1. Read this entire document.
2. Do Phase 0 FIRST — the bug fixes that didn't land last time. Don't skip this. Open the deployed site's view-source and count occurrences before and after.
3. Do Phases 1–3 in order. Each phase builds one signature animation component + applies it to 1–2 sections.
4. Never violate original constraints: TypeScript strict (no `any`), Tailwind v4 @theme only, GSAP with `useGSAP` hook, no component libraries, inline SVG, Sunflower + Geist Mono.
5. Between phases, run `npm run build` and grep for `: any` in `src/`. Commit with clear messages.

---

## PHASE 0 — FIX THE BUGS THAT DIDN'T GET FIXED LAST TIME

Do not start Phase 1 until this is verified in the running DOM.

### 0.1 Verify the bug list

Open `curl -s https://armouriq-psi.vercel.app/ | grep -c "support-agent-1"` — if result is >1, HowItWorks is duplicated.

Same checks:
- `grep -c "Compared to"` should be 0 on desktop, >0 only in the mobile-only card stack
- `grep -c "verily logo"` should be 1 on desktop (or 2 if marquee-doubled, but only on mobile path)
- `grep -c "Book a Demo"` should be 2 (hero CTA + final CTA) or 3 (+ nav), not 6

### 0.2 Root cause — use `gsap.matchMedia` + Tailwind responsive utilities, NOT duplicate markup

The correct pattern:

```tsx
// ONE markup tree per component
<section>
  <div className="track md:flex md:w-[300vw] md:flex-row flex-col w-full">
    <div className="panel md:w-screen w-full">...step 01...</div>
    <div className="panel md:w-screen w-full">...step 02...</div>
    <div className="panel md:w-screen w-full">...step 03...</div>
  </div>
</section>
```

```ts
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 768px)', () => {
    // desktop: pin + horizontal scroll
    const tween = gsap.to('.track', { /* ... */ });
    return () => tween.kill();
  });
  mm.add('(max-width: 767px)', () => {
    // mobile: reveal each panel as it scrolls into view
    gsap.utils.toArray<HTMLElement>('.panel').forEach(p => {
      gsap.from(p, { 
        opacity: 0, y: 40,
        scrollTrigger: { trigger: p, start: 'top 70%' }
      });
    });
  });
  return () => mm.revert();
}, { scope: container });
```

Apply this pattern to HowItWorks (3 steps), Comparison (table vs card stack), TrustBar (static grid vs marquee), and Nav (desktop links vs hamburger drawer).

### 0.3 Specific fixes

**HowItWorks**: ONE set of 3 panels. Desktop horizontal scroll, mobile stacked. Never render duplicates.

**Comparison**: ONE data source (array of rows). On desktop, render it as `<table>`. On mobile, render as stacked cards using the same array. Use Tailwind `hidden md:block` on the table wrapper, `block md:hidden` on the card stack wrapper.

**TrustBar**: desktop uses a static 6-column grid. Mobile uses the Marquee component. Conditional rendering via responsive classes — BOTH can exist in DOM, hidden appropriately, because the content is small (6 logos). The marquee component should NOT run its animation on desktop (guard the GSAP call with a media query check using `gsap.matchMedia`).

**Nav**: ONE `<nav>` element. Desktop links use `hidden lg:flex`, hamburger uses `lg:hidden`. Mobile drawer is always in DOM but hidden with `translate-x-full` by default.

### 0.4 Verify again after fixes

Count occurrences in the built HTML. No duplicates. Commit: `fix(dom): eliminate duplicate rendering using matchMedia + responsive utils`.

---

## PHASE 1 — BUILD NEW SIGNATURE COMPONENTS

These are 6 new reusable components. Create each one, then apply to specific sections in Phase 2.

### 1.1 `src/components/ui/SectionReveal.tsx` — The QClay curtain reveal

Wraps any section. When the section enters viewport, a clip-path mask sweeps across to reveal the content, while the content itself scales from 0.94 to 1.

```tsx
'use client';
import { ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
};

export function SectionReveal({ children, direction = 'up', className = '' }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const clipFrom = {
      up: 'inset(100% 0 0 0)',
      down: 'inset(0 0 100% 0)',
      left: 'inset(0 100% 0 0)',
      right: 'inset(0 0 0 100%)',
    }[direction];

    gsap.set(container.current, { clipPath: clipFrom });
    gsap.set(container.current.querySelector('.reveal-inner'), { scale: 0.94 });

    gsap.to(container.current, {
      clipPath: 'inset(0 0 0 0)',
      duration: 1.2,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        once: true,
      },
    });
    gsap.to(container.current.querySelector('.reveal-inner'), {
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className={className}>
      <div className="reveal-inner">{children}</div>
    </div>
  );
}
```

### 1.2 `src/components/ui/VelocityMarquee.tsx` — Marquee that reacts to scroll velocity

Replaces the existing Marquee for dividers. Reads Lenis velocity (or manual scroll delta) and speeds up proportionally.

```tsx
'use client';
import { ReactNode, useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  baseSpeed?: number; // px/sec at rest
  velocityMultiplier?: number;
  reverse?: boolean;
  className?: string;
};

export function VelocityMarquee({
  children,
  baseSpeed = 60,
  velocityMultiplier = 4,
  reverse = false,
  className = '',
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = container.current?.querySelector<HTMLDivElement>('.v-marquee-track');
    if (!track) return;
    const width = track.scrollWidth / 2;
    const direction = reverse ? 1 : -1;
    let currentSpeed = baseSpeed;
    let x = 0;

    const tick = (deltaMs: number) => {
      x += (currentSpeed * direction * deltaMs) / 1000;
      if (direction === -1 && x <= -width) x += width;
      if (direction === 1 && x >= width) x -= width;
      gsap.set(track, { x });
    };

    gsap.ticker.add((_, deltaMs) => tick(deltaMs));

    // Velocity read from ScrollTrigger (which reflects Lenis if hooked up)
    let lastScroll = window.scrollY;
    let velocityResetTimer: number | null = null;
    const onScroll = () => {
      const now = window.scrollY;
      const delta = Math.abs(now - lastScroll);
      lastScroll = now;
      const boost = Math.min(delta * velocityMultiplier, 400);
      currentSpeed = baseSpeed + boost;
      if (velocityResetTimer) window.clearTimeout(velocityResetTimer);
      velocityResetTimer = window.setTimeout(() => {
        gsap.to({ s: currentSpeed }, {
          s: baseSpeed,
          duration: 0.6,
          ease: 'power2.out',
          onUpdate() { currentSpeed = this.targets()[0].s; },
        });
      }, 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, { scope: container });

  return (
    <div ref={container} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="v-marquee-track inline-flex">
        <div className="inline-flex items-center">{children}</div>
        <div className="inline-flex items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
```

### 1.3 `src/components/ui/ScrambleText.tsx` — Replace paid GSAP ScrambleText

Characters randomize through a character set before resolving to the target text. Triggers on hover or on-scroll.

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

type Props = {
  text: string;
  trigger?: 'hover' | 'view' | 'mount';
  duration?: number; // ms
  charset?: string;
  className?: string;
};

const DEFAULT_CHARSET = '!<>-_\\/[]{}—=+*^?#_0123456789';

export function ScrambleText({
  text,
  trigger = 'view',
  duration = 900,
  charset = DEFAULT_CHARSET,
  className = '',
}: Props) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const frameId = useRef<number>(0);
  const running = useRef(false);

  const run = () => {
    if (running.current) return;
    running.current = true;
    const start = performance.now();
    const target = text;
    const step = () => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const revealedChars = Math.floor(progress * target.length);
      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < revealedChars) out += target[i];
        else if (target[i] === ' ') out += ' ';
        else out += charset[Math.floor(Math.random() * charset.length)];
      }
      setDisplay(out);
      if (progress < 1) {
        frameId.current = requestAnimationFrame(step);
      } else {
        setDisplay(target);
        running.current = false;
      }
    };
    frameId.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (trigger === 'mount') run();
    if (trigger === 'view' && ref.current) {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { run(); obs.disconnect(); } },
        { threshold: 0.5 }
      );
      obs.observe(ref.current);
      return () => obs.disconnect();
    }
    return () => { if (frameId.current) cancelAnimationFrame(frameId.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger]);

  const handleHover = () => { if (trigger === 'hover') run(); };

  return (
    <span ref={ref} onMouseEnter={handleHover} className={className}>
      {display}
    </span>
  );
}
```

### 1.4 `src/components/ui/DigitRoulette.tsx` — Slot-machine number counter

For stats. Digits slide into place vertically, like a slot machine or split-flap display.

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';

type Props = {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
  triggerOnView?: boolean;
};

export function DigitRoulette({
  value,
  format = (n) => n.toLocaleString(),
  duration = 1.6,
  className = '',
  triggerOnView = true,
}: Props) {
  const container = useRef<HTMLSpanElement>(null);
  const valRef = useRef({ v: 0 });
  const [text, setText] = (() => {
    const ref = useRef(format(0));
    const set = (s: string) => { ref.current = s; if (container.current) container.current.textContent = s; };
    return [ref, set] as const;
  })();

  useGSAP(() => {
    if (!container.current) return;
    const animate = () => {
      gsap.to(valRef.current, {
        v: value,
        duration,
        ease: 'power2.out',
        onUpdate: () => setText(format(Math.floor(valRef.current.v))),
      });
    };
    if (triggerOnView) {
      ScrollTrigger.create({
        trigger: container.current,
        start: 'top 80%',
        once: true,
        onEnter: animate,
      });
    } else {
      animate();
    }
  }, { scope: container, dependencies: [value] });

  return <span ref={container} className={`font-mono tabular-nums ${className}`}>{text.current}</span>;
}
```

For a richer split-flap visual, you can make each digit its own rotating element. If time-constrained, the above smooth-count version is acceptable — just ensure the tabular-nums + mono font makes it feel mechanical.

### 1.5 `src/components/ui/SpotlightReveal.tsx` — Circular spotlight that follows cursor

A section where content looks different inside the spotlight. Used once, sparingly.

```tsx
'use client';
import { ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

type Props = {
  baseContent: ReactNode;
  spotlightContent: ReactNode;
  radius?: number;
  className?: string;
};

export function SpotlightReveal({
  baseContent,
  spotlightContent,
  radius = 180,
  className = '',
}: Props) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!container.current) return;
    const spotlightLayer = container.current.querySelector<HTMLDivElement>('.spotlight-layer');
    if (!spotlightLayer) return;

    gsap.set(spotlightLayer, {
      clipPath: `circle(0px at 50% 50%)`,
    });

    const handleMove = (e: MouseEvent) => {
      if (!container.current) return;
      const rect = container.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(spotlightLayer, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.4,
        ease: 'power2.out',
      });
    };
    const handleLeave = () => {
      gsap.to(spotlightLayer, {
        clipPath: `circle(0px at 50% 50%)`,
        duration: 0.5,
        ease: 'power2.out',
      });
    };
    container.current.addEventListener('mousemove', handleMove);
    container.current.addEventListener('mouseleave', handleLeave);
    return () => {
      container.current?.removeEventListener('mousemove', handleMove);
      container.current?.removeEventListener('mouseleave', handleLeave);
    };
  }, { scope: container });

  return (
    <div ref={container} className={`relative ${className}`}>
      <div className="base-layer">{baseContent}</div>
      <div className="spotlight-layer absolute inset-0 pointer-events-none">{spotlightContent}</div>
    </div>
  );
}
```

### 1.6 `src/components/ui/PerspectiveCard.tsx` — 3D tilt card

Tilts toward cursor. Used on the product grid cards to add subtle depth.

```tsx
'use client';
import { ReactNode, useRef } from 'react';
import { gsap } from '@/lib/gsap';

type Props = {
  children: ReactNode;
  intensity?: number;
  className?: string;
};

export function PerspectiveCard({ children, intensity = 8, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateX: -y * intensity,
      rotateY: x * intensity,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </div>
  );
}
```

### 1.7 Verify Phase 1

Build: `npm run build`. Grep: `grep -rn ": any" src/` returns nothing. No runtime errors when navigating to the page.

Commit: `feat(components): add SectionReveal, VelocityMarquee, ScrambleText, DigitRoulette, SpotlightReveal, PerspectiveCard`

---

## PHASE 2 — APPLY NEW COMPONENTS TO SECTIONS

Now use these components in specific places where they'll have the most impact. Don't overuse — each one should feel like a moment.

### 2.1 Hero — apply SpotlightReveal to the firewall viz

In the hero animation panel, wrap the entire firewall viz with `SpotlightReveal`.

**Base content (default view):**
- The normal firewall viz — agents, firewall line, resources, packets flowing

**Spotlight content (inside the cursor spotlight):**
- The SAME viz but with EXTRA detail visible:
  - Action payload JSON fragments floating near each packet (mono, 8px, `{scope: "read"}`)
  - Cryptographic signatures visible on each block event (`sig: sha256:a3f9…`)
  - Policy rule IDs next to the firewall (`policy-id: cust-agent-v3`)
  - A thin "inspection data stream" running down the firewall with hex values (`0x7F4A 0x0012…`)
  - The agent tile labels show FULL names (`customer-support-agent-1-prod` instead of truncated)

The spotlight acts as a "magnifying glass into the firewall's policy layer." This is editorial — you can literally narrate in the README that the user can "peek behind the firewall" by hovering.

Spotlight radius: 200px on desktop, disable on mobile (no cursor).

### 2.2 Hero — replace the hero counter with DigitRoulette

The "ALLOWED 3,812 · BLOCKED 247" counter should use DigitRoulette so numbers roll in on view, not appear statically. Set values to the target (3812 / 247). Use Geist Mono, tabular-nums.

Also upgrade so the numbers continue to tick up slightly as packets resolve — pass the current count via state and let DigitRoulette animate between values.

### 2.3 Wrap each major section in SectionReveal

Apply `SectionReveal` to the container of each of these sections:
- TrustBar → `direction="up"`
- Problem → `direction="up"`
- HowItWorks → `direction="up"` (wrap the outer section, not the pinned wrap)
- Products → `direction="up"`
- Comparison → `direction="left"` (content sweeps in from right)
- FAQ → `direction="up"`
- CTA → `direction="up"`

Each section now enters with a clip-path curtain sweep + subtle scale-up of the interior. Don't apply to Hero (it has its own entrance) or Footer (fade is fine).

### 2.4 Swap all Marquee dividers for VelocityMarquee

Replace every instance of the current Marquee/MarqueeDivider used for between-section dividers with `VelocityMarquee`. Pass `baseSpeed={40}` and `velocityMultiplier={6}`. Alternate `reverse` prop between dividers for visual rhythm.

Test by scrolling fast — marquees should visibly accelerate and then settle back.

### 2.5 Apply ScrambleText to section eyebrows

Every section has an eyebrow like "THE PROBLEM", "THE PLATFORM", "FAQ". Wrap each eyebrow text in `<ScrambleText text="THE PROBLEM" trigger="view" duration={700} />`.

Use the default charset (symbols + numbers). The scramble should feel technical, not chaotic.

Also apply to the main announcement bar text on mount: `<ScrambleText text="Just Launched — Introducing ArmorClaw Intent Assurance" trigger="mount" />`.

### 2.6 Apply DigitRoulette to product card stats

Each product card has a stat from the last refinement (`POLICIES: 2,341`, `EVENTS/SEC: 14K`, etc.). Wrap the number in DigitRoulette. When the card enters view (from the Flip animation), the number rolls in.

### 2.7 Apply PerspectiveCard to product grid cards

Wrap each product card's content with `PerspectiveCard` (intensity: 6). Cards subtly tilt toward cursor. This replaces the simple hover lift with something that feels more premium.

Note: on mobile, PerspectiveCard should no-op (already guarded by the reduced-motion check; add a mobile check too by reading window width).

### 2.8 Apply ScrambleText to comparison table column headers

Column headers ("ArmorIQ", "Guardrails", "IAM / RBAC", etc.) should use ScrambleText with `trigger="view"`. When the column-drop animation completes (timing around 1.2s in), trigger the scramble. The ArmorIQ column scrambles last for emphasis.

To sync timings: use a ScrollTrigger with `onEnter` that fires at the right moment, setting a piece of state that flips each header's `ScrambleText` to mounted.

### 2.9 Verify Phase 2

- Curtain reveal sweep on each section entrance
- Marquees accelerate on scroll velocity
- Numbers roll in on stats
- Scramble happens on eyebrows, announcement bar, comparison headers
- Hero spotlight reveals extra detail on hover
- Product cards tilt subtly on hover
- Nothing feels over-animated — motion serves the content

Commit: `feat(motion): apply signature components - spotlight hero, velocity marquees, scramble eyebrows, perspective cards, digit counters`

---

## PHASE 3 — TWO MORE QCLAY-LEVEL SIGNATURE MOMENTS

Two big additions. Each adds a wow-moment to the page.

### 3.1 Problem section — scroll-scrubbed SVG morph

The Problem section has a diagram showing an attempted action getting blocked. Make the diagram MORPH as the user scrolls through the Problem section — not just reveal, but actively transform.

**Stage 1 (section enters viewport at ~80%):**
- Agent node appears
- A dashed line starts drawing from agent to resource (straight horizontal)
- Label: "intended: READ.customers"

**Stage 2 (section is at ~50%):**
- A vertical firewall bar grows up from the bottom, intersecting the dashed line
- The line splits: the left half stays as the "attempted" path, the right half grays out
- At the firewall intersection, a red × symbol grows
- A "blocked" label fades in near the ×

**Stage 3 (section is at ~20%):**
- The resource dims (fill opacity drops)
- A lock icon overlay rotates into place on the resource
- Annotations type out in mono: `attempted: WRITE.billing`, `outside declared scope`, `policy: cust-agent-v3`
- The agent node gets a red "VIOLATION RECORDED" tag

Build this as a scrubbed timeline using a single ScrollTrigger tied to the section:
```ts
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: problemSection,
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1,
  },
});
tl.to('.stage-1-agent', { opacity: 1, duration: 0.2 })
  .to('.stage-1-line', { strokeDashoffset: 0, duration: 0.3 })
  .to('.stage-2-firewall', { scaleY: 1, duration: 0.2 })
  .to('.stage-2-x', { scale: 1, opacity: 1, duration: 0.1 })
  .to('.stage-3-lock', { rotate: 360, opacity: 1, duration: 0.2 })
  .to('.stage-3-annotations', { opacity: 1, stagger: 0.05, duration: 0.3 });
```

The idea: scrolling feels like watching an incident play out in slow motion. The user has agency — scrubbing back and forth replays it.

### 3.2 Pre-FAQ moment — a pinned "confession" text scroll

Between Comparison and FAQ, add a new micro-section (`py-32 md:py-48`) with a pinned scroll sequence.

A single sentence is pinned in the viewport, and as the user scrolls, words swap/update to build a manifesto-like sequence. Like a confession typed out one fragment at a time.

Content: 5 lines that cycle in, building meaning. Start with a base sentence, then swap words as user scrolls.

```
[pin start] "Most AI failures are not model failures."
[scroll 20%] "Most AI failures are not model failures — they are INTENT failures."
[scroll 40%] "The model did what you asked. The AGENT did something you did not."
[scroll 60%] "Guardrails check words. Sandboxes check containers."
[scroll 80%] "ArmorIQ checks PURPOSE."
[scroll end, unpin] "That is the only check that matters."
```

Implementation: pin the section for ~300vh of scroll space. Each sentence fades + translates up to replace the previous, scrubbed to scroll position. The EMPHASIS words (INTENT, AGENT, PURPOSE) are in primary orange, larger, and get an underline that draws in.

This is a signature editorial moment. It forces the user to slow down and read the argument. Works because the content is genuinely the product's philosophy.

Spec:
- Center the text, max-width 900px, Sunflower 700, `clamp(28px, 3.5vw, 56px)`, line-height 1.2
- Each line swap: previous line fades + translateY -20, next line fades in from translateY 20
- Emphasis words: primary color, underline draws via scaleX
- ScrollTrigger pins the section for the duration of the 5 transitions
- On mobile: unpin, render as a vertically stacked list of 5 statements, each revealing on scroll enter

Create as `src/components/sections/Manifesto.tsx`. Add to `page.tsx` between Comparison and FAQ, with a VelocityMarquee divider on each side.

### 3.3 Verify Phase 3

- Problem section: scrubbing through the section plays the incident narrative smoothly
- Manifesto section: pinned, text swaps cleanly on scroll, emphasis words highlighted, unpins smoothly at end
- No jank or layout shift

Commit: `feat(signature): scrubbed problem narrative, pinned manifesto sequence`

---

## FINAL VERIFICATION

1. `npm run build` — no errors
2. `grep -rn ": any" src/` — empty
3. Deploy preview to Vercel, then fetch the HTML and count duplicates:
   ```bash
   curl -s https://<preview-url>/ | grep -c "support-agent-1"   # should be 1
   curl -s https://<preview-url>/ | grep -c "Compared to"        # 0 desktop, 4 mobile
   curl -s https://<preview-url>/ | grep -c "verily logo"        # small, not 3+
   ```
4. Desktop walk-through (1440px):
   - Curtain plays once
   - Hero spotlight works: hover over firewall viz reveals extra technical layer
   - Scroll: every section curtain-sweeps in
   - Marquees accelerate when scrolling fast
   - Problem diagram scrubs with scroll
   - Products cards tilt, stats roll in
   - Comparison columns drop, headers scramble
   - Manifesto pins, text cycles, unpins at end
   - FAQ, CTA, Footer clean
5. Mobile (390px): all of the above gracefully degrades, spotlight disabled, manifesto stacks
6. Reduced-motion test: animations stop; content readable
7. Lighthouse: 85+ perf, 100 a11y

## PRIORITIES IF TIME-CONSTRAINED

If only two phases can ship:
- **Phase 0 (bug fixes)** — mandatory, everything else builds on this
- **Phase 2 (apply new components)** — biggest visual impact per hour

If three phases:
- Add **Phase 3.2 (Manifesto)** — single signature moment that elevates the whole site

Phase 3.1 (problem morph) is the deepest to build — skip if short on time.

---

Read this, make your plan, start with Phase 0. Show me the verification commands output for Phase 0 before moving to Phase 1.