# ArmorIQ Refinement Sprint — Claude Code Prompt

You've already built the ArmorIQ landing page. The deployed version is at https://armouriq-psi.vercel.app/. It has real bugs and is visually bland. This prompt is a refinement sprint with specific fixes and elevations.

Work through this in 5 passes. Commit after each pass. Verify visually in the browser between passes (don't just trust the code compiled — open the page, scroll, check the hero, check mobile).

---

## HOW TO WORK

1. Read this entire document first. Make a plan.
2. Execute Pass 1 (bug fixes) FIRST. Nothing else matters if the layout is broken.
3. Execute Passes 2–5 in order. Each has concrete specs.
4. **Never violate original constraints**: TypeScript strict no `any`, no component libraries, Tailwind v4 @theme only, GSAP with useGSAP hook only, inline SVG for icons, Sunflower + Geist Mono only, warm editorial not dark mode.
5. After every pass, run `npm run build` to catch TS errors. Run `grep -rn ": any" src/` — must return nothing.
6. Commit between passes with clear messages.

---

## PASS 1 — BUG FIXES (do this first, no exceptions)

The deployed site has duplicate DOM content. Fix these:

### 1.1 HowItWorks renders twice
The 3 steps (01 Registry / 02 Intent / 03 Audit) appear duplicated in the DOM. The cause is almost certainly that the desktop pinned horizontal scroll and the mobile stacked version are both rendering instead of being conditional.

Fix: use a single responsive component with CSS-driven visibility, NOT two separate JSX trees rendered conditionally via JavaScript (which would cause hydration mismatches). Use Tailwind's `hidden md:block` / `block md:hidden` utilities, or better: use a single markup structure that responds to media queries.

If you're using `window.innerWidth` checks inside `useGSAP` to enable/disable the horizontal scroll, that's fine — but do not render the content twice. The mobile path should reuse the SAME panel markup, just stacked via CSS on small screens and placed in a track on large screens.

Recommended approach: render 3 `.panel` divs once inside `.track`. On desktop, JavaScript pins them and translates the track horizontally. On mobile, CSS changes `.track` from `flex-row w-[300vw]` to `flex-col w-full`, and the pin ScrollTrigger is not created. Use `ScrollTrigger.matchMedia()` or `gsap.matchMedia()` for the conditional animation setup.

### 1.2 Comparison table + mobile cards both render
Same class of bug. Desktop table (`<table>`) and mobile card stack are both in DOM. Fix: hide each with Tailwind responsive utilities — `<div className="hidden lg:block">...table...</div>` and `<div className="block lg:hidden">...cards...</div>`. Or use a single layout strategy that reflows.

### 1.3 TrustBar logos rendered 3×
Marquee is running on desktop. It should be a static grid on desktop, marquee on mobile only.

Fix:
```tsx
<div className="hidden md:grid grid-cols-6 gap-8 items-center">
  {/* static logos here, 6 entries */}
</div>
<div className="md:hidden">
  <Marquee>{/* logos here */}</Marquee>
</div>
```

Or keep the Marquee component but pass a `enabled` prop that no-ops the GSAP animation on desktop and renders as a simple flex row.

### 1.4 Nav renders twice
Desktop nav and mobile nav both in DOM. Use responsive classes, not duplicate JSX blocks. Single `<nav>` with items hidden/shown via CSS. Mobile hamburger should only be visible <lg.

### 1.5 Other duplicates to check
Open the deployed site, view page source, search for any other duplicated content. Common culprits: cloned elements for animations that were never cleaned up, or `useEffect` running twice in React strict mode creating stale duplicates. Fix any you find.

### 1.6 Verify Pass 1
- `view-source:` on the running dev site
- Ctrl+F for "Step 01" — should appear ONCE
- Ctrl+F for "support-agent-1 registered" — should appear ONCE
- Ctrl+F for "Verily" logos — should appear max 2× (the marquee doubles content for seamless looping, that's fine on mobile only)
- Nav: "Book a Demo" should appear max once in desktop nav + once in mobile drawer (drawer hidden by default)

Commit: `fix(bugs): eliminate duplicate DOM rendering in HowItWorks, Comparison, TrustBar, Nav`

---

## PASS 2 — HERO ANIMATION ELEVATION

The hero is the centerpiece. Right now it's probably reading as "boxes on a panel." Make it feel like a real security monitoring dashboard.

### 2.1 Add depth to the panel
The firewall viz panel should feel like a piece of infrastructure, not a marketing illustration. Add:
- **Blueprint grid** inside the panel at 6% opacity (NOT 4% — turn it up)
- **Grain texture** overlay at 5%
- **Scan line** that moves horizontally across the ENTIRE panel very slowly (every 8 seconds), 1px thickness, primary-color at 15% opacity. This is ambient, separate from the firewall's scanning line.
- **Subtle radial gradient** from center — `radial-gradient(circle at 50% 50%, rgba(224,123,76,0.03), transparent 60%)` — adds warmth without obvious color
- **Corner technical marks** — small L-shaped corner indicators (like camera viewfinders) in the 4 corners of the panel, 12px, 1px stroke, text-light color. Adds blueprint/targeting feel.
- **Top-left label**: small mono text `ArmorIQ/fw-v2.4` (text-light, 10px, tracked)
- **Top-right label**: small mono text `STATUS: ACTIVE` with a tiny green pulsing dot

### 2.2 Make the firewall feel alive
Currently the vertical line is static with tick marks. Upgrade:
- **Data pulse**: every 2-3 seconds, a vertical gradient pulse sweeps DOWN the firewall line (like data flowing through it). 1px line becomes briefly 3px with primary-color fade, then recovers.
- **Tick marks**: randomize the tick lengths slightly (3px / 5px / 2px pattern). Add tiny mono numbers next to every 4th tick (`:00`, `:16`, `:32`, `:48`) — makes it feel like a timeline.
- **Scanning line**: the existing horizontal scanner should leave a subtle trailing fade behind it (2px gradient trail)
- **FIREWALL label** on the side: add small annotation marks above/below it — `::ingress` above, `::egress` below, mono 9px muted
- **Impact flash**: when a packet gets BLOCKED, the firewall not only highlights at that point but also has a brief "shockwave" ripple along the line (subtle scale of that segment)

### 2.3 Make the agents more alive
Each agent tile currently has a pulsing dot. Add:
- **Activity indicator**: a tiny horizontal bar chart (3 bars, different heights) in the corner of each agent tile, mono-colored, pulsing at different rates. Makes them feel like they have telemetry.
- **When an agent emits a packet**: the agent tile briefly glows with a subtle outline, and a 1px line flashes from the agent tile to where the packet spawns.
- **ID badges**: add a tiny mono ID like `[AG-001]` above each agent's name
- **Status dot**: keep it but make it pulse at different rates per agent (randomized 1.2s / 1.5s / 1.8s cycles) so it doesn't look synchronized

### 2.4 Make the packets richer
Currently packets are pills with text. Upgrade:
- **Two-line pills**: top line shows the action (e.g., `DELETE /users/42`), bottom line shows a tiny "origin" tag (`from: billing-bot`). Mono, text-light, 9px.
- **Packet tail**: the packet leaves a 2px fading tail behind it as it moves, giving sense of direction
- **At inspection pause**: alongside the scanning line, show the packet expanding slightly (scale 1.0 → 1.05) and a small `inspecting...` text appearing underneath it briefly
- **Verdict indicator**: when resolved, a small symbol appears next to the packet:
  - ALLOWED: ✓ in a small circle, primary color, scales in
  - BLOCKED: × in a small circle, danger color, scales in with shake
- **Packet variety**: add a visual weight indicator — risky packets get a subtle red tint on their border BEFORE inspection (like a threat score indicator). This foreshadows the verdict and adds narrative depth.

### 2.5 Upgrade the targets
- Each target tile gets a small "health" indicator — a tiny mono uptime percentage like `99.99%` or a status line like `OPERATIONAL`
- When a target receives an allowed packet, it flashes with a subtle primary-color ring expanding outward
- Targets slightly differ visually — CRM has a tiny database-like icon, Email API has an envelope stroke, etc. Don't overdo it — 10×10 monochrome strokes in the corner of each tile.

### 2.6 Upgrade the counter
Currently reads `ALLOWED 3,812 · BLOCKED 247`. Upgrade to a multi-line live dashboard:
```
[ SESSION METRICS ]
ALLOWED    3,812   ▲ 0.4%/s
BLOCKED    247     ▲ 0.1%/s
BLOCK RATE 6.1%    ▼ 0.2%
UPTIME     72h 14m
```
Keep it tiny (10-11px mono) but make it feel like a real monitoring readout. The percentages should animate subtly with small GSAP random updates every few seconds.

### 2.7 Performance
Ensure everything still uses only `transform` and `opacity`. The additions should be lightweight. If FPS drops, reduce ambient effects on lower-end devices via `window.matchMedia('(prefers-reduced-motion: reduce)').matches` fallbacks.

Commit: `feat(hero): add depth, telemetry, and narrative to firewall animation`

---

## PASS 3 — REBUILD BLAND SECTIONS

### 3.1 Problem section illustration — redesign from scratch

Current: "AGENT INTENDED BLOCKED RESOURCE" as flat labels. Boring.

Replace with a proper SVG diagram. Two-column layout inside the illustration:

**Left side — Attempted flow:**
- Agent node: a rounded square (40×40) with mono label `agent-07` underneath, a tiny pulsing dot inside
- Dashed arrow pointing right labeled `intended: READ.customers` (mono, 11px, text-light) — the dashed arrow animates a flowing dash pattern
- Resource icon: a cylinder/database shape labeled `Customers`

**Right side — What ArmorIQ intercepts:**
- Same agent node
- Solid arrow starting, but partway through it hits a vertical firewall bar (similar to hero but simpler)
- At the bar: a red × symbol with `BLOCKED` label
- Behind the bar: the resource is there but has a small lock icon overlay
- Below: annotation line reading `attempted: WRITE.billing · outside declared scope`

Both halves should be annotated with tiny technical details:
- Timestamp labels: `[t=0.42s]`
- Policy IDs: `policy:customer-support-v3`
- Scope declarations: `scope: read-only`

Animation on ScrollTrigger enter:
- Left column draws in first (agent fade, dashed arrow animates flow, resource appears)
- Right column draws in second with more weight (firewall bar grows from bottom, red × snaps in with a shake, lock icon rotates into place)
- Annotations type in after (cursor blinking briefly on each)

Style: monochromatic + one primary-orange accent on the "intended" label in left, one danger-red on the BLOCKED element in right. Editorial, like a technical paper diagram. 1px strokes, not filled shapes.

### 3.2 Products section — give each card personality

Every card looks identical right now. Differentiate them:

**Shared card upgrades (apply to all 6):**
- Add a tiny mono "version" badge top-right: `v2.4.1` (or similar) — text-light, 9px
- Add a tiny "status" line bottom: small green dot + `OPERATIONAL` OR primary dot + `BETA` for ArmorClaw (the open-source one), text-light, 10px mono
- Add a numbered prefix in top-left: `01 / INTENT ENGINE` where the number is in Sunflower 700 and slightly larger, "INTENT ENGINE" is mono uppercase tracked (text-light). This creates a "catalog entry" feel.
- Behind each card, at 3% opacity, a unique subtle pattern — dots, diagonal lines, circuit-like — so each card has unique texture
- On hover: primary-color border (fade in over 0.3s), subtle lift, AND the icon should animate in a way unique to that product

**Per-card unique elements:**

1. **Intent Engine (The Brain)** — 
   - Icon: abstract neural-connection dots, 5 connected nodes
   - Hover animation: connections light up one by one
   - Unique stat: `POLICIES: 2,341`

2. **Sentry (The Eyes)** — 
   - Icon: eye-like with crosshair
   - Hover animation: crosshair rotates and locks in
   - Unique stat: `EVENTS/SEC: 14K`

3. **Gatekeeper (The Guard)** —
   - Icon: vertical gate/turnstile
   - Hover animation: gate opens and closes
   - Unique stat: `REQUESTS: 892M`

4. **Registry (The Map)** —
   - Icon: grid of 9 dots with connections
   - Hover animation: pulse across the grid
   - Unique stat: `AGENTS: 12,847`

5. **Auditor (The Record)** —
   - Icon: scroll/document lines with signature mark
   - Hover animation: lines draw from left to right
   - Unique stat: `LOGS: 4.2TB`

6. **ArmorClaw (open source)** —
   - Icon: claw bracket `〈〉` shape
   - Hover animation: brackets scale in
   - Unique stat: `★ 3.4K` and `FORKS: 287` (GitHub-style)

Stats should feel real — monospace, text-light, small.

### 3.3 Comparison table — give ArmorIQ column real dominance

The ArmorIQ column should visibly win, not just "have checks."

**Table refinements:**
- ArmorIQ column background: very subtle gradient — `linear-gradient(180deg, rgba(224,123,76,0.06), rgba(224,123,76,0.02))`. Almost invisible but adds dimension.
- ArmorIQ column top border: 3px primary color (not 2px)
- ArmorIQ column header: add a tiny "WINNER" badge or a more subtle `RECOMMENDED` mono uppercase label above the column name in primary color
- Row hover: the entire row gets a subtle `var(--color-surface)` background fill + a 2px primary-color indicator slides in from left of the ArmorIQ cell
- Checkmarks: animate a small circular halo when they draw in — subtle primary pulse ring that expands once and fades

**Column drop animation — make it more dramatic:**
- Competitor columns fall from above (y:-150) with stagger 0.1s, power3.in (fast, decisive)
- ArmorIQ column drops LAST from higher (y:-250), slower (0.9s), power4.out (big settle), and has a slight overshoot (y: -10 → 0)
- When ArmorIQ settles, a horizontal "scan" line sweeps across the entire column header glowing primary
- 0.3s after ArmorIQ lands, the "RECOMMENDED" label fades in above its header

**Add side-annotations:**
Just outside the table on the right edge, stack small mono annotations pointing to key rows with leader lines:
- Next to "Core question" row: `the ONLY question that matters`
- Next to "When it acts" row: `pre-execution = prevention`
- Next to "Stops rogue actions" row: `the only 'Yes' in this column`
These should be super subtle — text-light 10px, 1px leader lines, don't clutter.

### 3.4 FAQ — add number + structure

Current: plain list. Upgrade:

- **Numbered prefixes**: `Q1` / `Q2` / `Q3` / `Q4` / `Q5` in mono, text-light, next to each question
- **Icon replacement**: replace the chevron with a `+` that rotates to become `×` on open (45deg rotation = × visually)
- **Open state**: when an item is open:
  - Left edge of the item gets a 2px primary-color bar that grows from top to bottom (scaleY animation)
  - Background very subtly shifts to `var(--color-surface)` with a 0.3s transition
  - The question text gets slightly bolder (weight 500 vs 400)
- **Between-items divider**: thin 1px border in `var(--color-border)` (not strong), making each question its own row with breathing room
- **Interaction detail**: hovering a closed item shows a very subtle primary-color bar sliding in at 20% width from the left, indicating it's interactive

### 3.5 CTA — elevate from basic

Current: headline + buttons. Add atmosphere.

- **Background grid** covering the whole section at 5% opacity, MORE visible than elsewhere
- **Animated ambient marks** — 4-5 small mono labels scattered in the section background at ~20% opacity: `:: policy-check`, `:: intent-verified`, `:: scope-evaluated`, `:: audit-logged`. They slowly fade in and out on different cycles (6-12s loops). Creates sense of live activity behind the headline.
- **Radial gradient** behind headline: `radial-gradient(ellipse at 50% 40%, rgba(224,123,76,0.08), transparent 70%)`. Slightly bigger and warmer than before.
- **Headline treatment**:
  - Use character-level SplitText reveal
  - The word "control" gets a very deliberate primary-color underline AND a small mono annotation above it that fades in after: `(← the only word that matters)` — small, text-light, 12px
- **Buttons**:
  - Primary button: add a very subtle outer glow pulse (box-shadow expanding and contracting over 2.4s, sine.inOut, primary color at 10% opacity)
  - Add a tiny mono label under the button row: `NO CREDIT CARD · 14-DAY TRIAL · SOC2 CERTIFIED` (text-light, 10px, tracked, with `·` separators)
- **Post-CTA detail**: below the buttons, a thin 1px primary-color horizontal rule that animates its width from 0 to ~200px (scaleX) when the section enters viewport, centered under the CTAs

Commit: `feat(sections): rebuild problem illustration, personalize product cards, dramatize comparison, polish faq + cta`

---

## PASS 4 — SITE-WIDE ATMOSPHERE & DETAILS

Small things that make everything feel premium.

### 4.1 Universal grain texture
Body-level very subtle grain overlay at 2-3% opacity covering the entire page (already have `.bg-grain` utility — apply to body or a fixed pseudo-element).

### 4.2 Cursor-proximity hover indicators
On desktop only: when the cursor approaches ANY card (products cards, comparison column headers, FAQ items), the element gains a subtle primary-color 1px border glow proportional to cursor proximity (closer = more glow). This requires a mouse-move listener on the card that calculates distance from its center. Keep it restrained — max 30% primary opacity glow.

Implementation sketch:
```ts
// inside useGSAP for a card
element.addEventListener('mousemove', (e) => {
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
  const maxDist = 200;
  const proximity = Math.max(0, 1 - dist / maxDist);
  gsap.to(element, { 
    borderColor: `rgba(224, 123, 76, ${proximity * 0.4})`,
    duration: 0.3
  });
});
```

This creates a subtle "awareness" effect as you move the mouse around.

### 4.3 Scroll progress indicator
Fixed to the right edge of the viewport (16px from right, vertically centered), a small vertical progress track:
- 1px wide, ~120px tall, `var(--color-border-strong)` background
- A filled portion in primary color that grows as you scroll (scaleY controlled by scroll position)
- Small mono label beside it showing current section: `01 / HERO`, `02 / TRUST`, etc. Updates on scroll using ScrollTrigger for each section with `onEnter`.
- Only visible on md+ screens
- Skip on mobile

### 4.4 Micro-timestamps in hero
Add a small fixed mono timestamp in the top-right of the hero section that updates in real time: `[14:32:08 UTC]`. Tiny, text-light, unobtrusive. Makes the whole page feel live and operational.

### 4.5 Section eyebrow consistency
Every major section should have a consistent eyebrow pattern:
```
// TECHNICAL REFERENCE //   SECTION NAME   // 04
```
Three parts separated by `//`: a technical tag (varies per section), the section name, and a numeric ID. Mono, uppercase, tracked 0.12em, text-light, 11px. Example for Products:
```
// PLATFORM OVERVIEW //   ONE PLATFORM. FULL CONTROL.   // 05
```

This adds a documentary/technical feel.

### 4.6 Between-section "gap markers"
Between major sections (not the marquees — small indicators IN addition), add tiny mono text like `:: end section :: begin section ::` in the 20-30px gap between sections. Super muted, 9px, text-light at 40% opacity. Adds a code-file vibe.

### 4.7 Footer upgrade
- Add a full-width line of marquee text at the TOP of the footer (where section meets footer): `STOP AI AGENTS FROM GOING ROGUE · ARMORIQ · STOP AI AGENTS FROM GOING ROGUE · ARMORIQ ·` at a LARGE size (clamp(64px, 10vw, 128px)), Sunflower 700, text-light at 15% opacity — decorative giant brand text. Marquee moves very slowly.
- Below that: the actual footer content (columns, copyright) — keep clean
- Add a tiny "built with GSAP · Tailwind · Next.js" acknowledgment in the bottom row

### 4.8 Loading state for interactions
- Any button click that should feel responsive: add a subtle `scale(0.98)` on active state, 0.1s transition
- Primary buttons on click: brief loading-dot animation replacing the text for 0.4s even though nothing loads. Makes it feel interactive.

Commit: `feat(atmosphere): site-wide grain, proximity hover, scroll indicator, technical details`

---

## PASS 5 — MORE ANIMATIONS

Add these if time allows. Each should be purposeful, not decorative.

### 5.1 Hero parallax
As user scrolls past hero, the firewall viz panel translates upward slightly slower than the scroll (parallax). Subtle — max 40px offset. Creates depth between text and viz.

### 5.2 Number-scrub counters
Across the page, numbers (counter in hero, stats on product cards, etc.) should ALL tick upward slightly as the user scrolls through the page — small realistic increments. E.g., every 500ms the ALLOWED counter goes up by a random small amount (1-3), BLOCKED less often. Feels live.

### 5.3 Marquee speed variance
When the user scrolls fast, the marquees should temporarily speed up (e.g., from 60 to 120 speed), then return to normal. Uses ScrollTrigger + lenis velocity. Creates a sense that the whole page responds to user input.

Implementation:
```ts
// Access lenis velocity if available
// Or compute scroll velocity manually
// Map velocity to marquee speed multiplier
```

### 5.4 "Word cycle" in hero
In the hero subhead, ONE word cycles through variants to show the breadth of the product. Specifically, in "intercepting plans, routing to the safest mix of agents and tools, and enforcing policy", the word "policy" could cycle through `policy` → `intent` → `scope` → `rules` on a 2s loop with a smooth type/untype effect.

This is optional — if it feels gimmicky in context, skip it. Security products should be restrained.

### 5.5 Logo hover in nav
Hovering the ArmorIQ logo in the nav: the logo briefly "glitches" — not a chaotic glitch, just two 1-frame horizontal offsets that recover immediately. Adds personality without being unserious.

### 5.6 Comparison table row-hover callout
When hovering a row in the comparison table, a small mono callout appears in the margin explaining the row in one line — e.g., hovering "When it acts" reveals `→ timing determines effectiveness`. Small, 10px mono, fades in quickly.

### 5.7 Between-section "handshake" animation
As the user scrolls from one section into the next, the previous section's closing element (e.g., the closing line of HowItWorks) briefly ghosts into the incoming section with a fade + translate. This creates visual continuity.

### 5.8 CTA button "magnetic trail"
When hovering the primary CTA (already magnetic), add a tiny trail of primary-color dots that follow the button's offset from center (the delta from cursor position). 3-4 dots, fading out, very small. Gives the magnetism a visual echo.

Commit: `feat(motion): parallax, live counters, adaptive marquee, micro-motion polish`

---

## FINAL VERIFICATION

Before declaring complete:

1. `npm run build` — zero errors
2. `grep -rn ": any" src/` — empty
3. View deployed/dev site source: no duplicate DOM content
4. Scroll from top to bottom on desktop (1440px) — every section reads premium, no jank
5. Mobile (390px) — nav drawer works, HowItWorks unpinned and stacked, Comparison is card stack, no horizontal overflow
6. Reduced motion test (DevTools → Rendering → Emulate prefers-reduced-motion: reduce) — animations stop, content still readable
7. Lighthouse on production build — 85+ perf, 100 a11y
8. Commit everything, push to deployed branch

Report final bundle size, Lighthouse scores, and a checklist of which pass items got done vs skipped (and why).

---

## PRIORITIES IF TIME-CONSTRAINED

If you can only ship 2 passes:
- **Pass 1 (bugs)** — non-negotiable, site is broken without it
- **Pass 2 (hero)** — the showcase piece, make it unforgettable

If you can ship 3:
- Add **Pass 3** — rebuilds the bland sections

If 4:
- Add **Pass 4 atmosphere items 4.1, 4.3, 4.5** — biggest perceptual impact per line of code

Pass 5 is polish — nice to have, not blocking.

Start with Pass 1. Present your plan, then execute.