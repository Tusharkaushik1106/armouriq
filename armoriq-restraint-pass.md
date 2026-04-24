# ArmorIQ — Restraint + Signature Moments Pass

Reality check: the site currently reads as AI-generated because we've been **adding details instead of designing moments**. Top-tier agency sites like QClay do FEWER, BIGGER, SLOWER things with massive typography and huge whitespace. We're doing many small things competing for attention.

This pass is primarily about **SUBTRACTION and AMPLIFICATION**, not addition. Do not add new animations until the existing ones are dialed in. Strip first, then amplify what remains.

---

## THE AI-SLOP SYMPTOMS WE'RE FIXING

Read these honestly before touching code:

1. **Typography is too small.** Hero headline probably caps at ~80-92px. QClay-tier sites run hero text at 180-280px. The ratio of hero-size to body-size on our site is ~5×. On premium sites it's 15-20×. This is the #1 visual problem.

2. **Too many small details per element.** Every agent tile has: a pulsing dot + mini bar chart + ID badge + status label + 3 pieces of text. That's 6 things fighting on one 120px tile. Real premium design: 1-2 things per element. The rest is whitespace.

3. **Sections are cramped.** Sections stack with ~100-150px gaps. Premium sites use 300-500px gaps between big moments. Space is how you convey confidence.

4. **Scroll animations are subtle and numerous.** We have ~20 small reveals. Top-tier sites do ~6-8 signature scroll moments that are HUGE. Each takes an entire screen.

5. **Orange shows up everywhere.** In restrained design, the accent color appears 2-4 times total on the entire page. Right now we likely have 15+ orange appearances.

6. **Three competing "voices" per section.** Headline + body + badge + stat + annotation + button. Should be: headline. Period. Maybe 1 supporting element.

7. **Micro-annotations are clutter.** `[AG-001]`, `v2.4.1`, `::ingress`, `policy: cust-v3`, uptime percentages — we convinced ourselves these add "credibility." They add visual noise. Top security product sites (Cloudflare, Vercel, Linear marketing) use almost none of this.

Resist the instinct to prove the site is "technical" by decorating it with fake technical details. Prove it by being precise, restrained, and confident.

---

## HOW TO WORK

1. Read the entire document.
2. Phase 1 first: STRIP. Remove things. Commit.
3. Phase 2: AMPLIFY typography and space. Commit.
4. Phase 3: Build 3 signature scroll moments. Commit.
5. Phase 4: Verify restraint — count orange instances, measure typography ratios, audit section gaps.

Constraints unchanged: TS strict no `any`, Tailwind v4 @theme, GSAP useGSAP hook, no component libraries, inline SVG, Sunflower + Geist Mono.

---

## PHASE 1 — STRIP (remove, don't add)

### 1.1 Hero firewall panel — remove these
From the firewall visualization, delete:

- All agent ID badges (`[AG-001]`, `[AG-002]`, etc.)
- Mini bar chart telemetry inside agent tiles
- Uptime percentages on target tiles
- Target corner icons (CRM's database icon, Email API's envelope, etc.)
- Health/status labels on target tiles (`OPERATIONAL`, `99.99%`)
- Version labels in the panel (`ArmorIQ/fw-v2.4`)
- `STATUS: ACTIVE` top-right indicator with pulse dot
- Corner viewfinder L-marks
- `::ingress` / `::egress` annotations on the firewall
- Tick-mark numbers (`:00`, `:16`, `:32`, `:48`)
- The multi-line counter dashboard with rates and uptime

Keep only:
- 3 agent tiles with just: name in mono, one pulsing dot. Nothing else.
- The firewall: single vertical line, 8-10 tick marks (no numbers), ArmorIQ label at top (small).
- 4 target tiles: just the name, nothing else.
- The scanning line on the firewall.
- Simple counter at bottom: `ALLOWED 3,812  ·  BLOCKED 247` — one line, mono, text-light. Nothing else.
- Packets in flight with their label. Verdict indicators when resolved.

**The firewall viz should feel like a blueprint, not a dashboard.** Negative space inside the panel is the feature.

### 1.2 Product cards — remove these
From each product card, delete:
- Version badge top-right (`v2.4.1` etc.)
- Status lines (`OPERATIONAL`, `BETA`)
- Numbered catalog prefix (`01 / INTENT ENGINE`)
- Unique background patterns at 3% opacity
- The stats at the bottom (`POLICIES: 2,341`, `EVENTS/SEC: 14K`, etc.)

Keep only:
- One unique icon per card (simpler, 32px, 1.5px stroke)
- Tag in mono uppercase (just "THE BRAIN", etc.)
- Title in Sunflower 700
- One line of body copy
- Hover state only

Each card should have 4 elements: icon, tag, title, body. That's it.

### 1.3 Comparison table — remove these
- "RECOMMENDED" / "WINNER" badge above ArmorIQ column
- Side-annotations with leader lines next to rows
- The gradient fill on ArmorIQ column background
- The halo pulse on check icons

Keep:
- Simple bordered table
- ArmorIQ column has a 2px primary-color top border and very slightly elevated — that's it
- Checks, X's, dashes — clean, no halos

### 1.4 Scroll progress indicator (right edge)
Remove it entirely. It's decorative, not functional. Real premium sites don't have them.

### 1.5 Cursor-proximity glow on cards
Remove. It's a gimmick that adds visual noise without purpose.

### 1.6 Ambient "technical" annotations scattered in CTA background
Remove all of `:: policy-check`, `:: intent-verified`, etc. floating in the CTA background. They read as fake-technical garnish.

### 1.7 Mono annotation label over "control" in CTA headline
Remove the `(← the only word that matters)` annotation. Too cute.

### 1.8 Marquee giant brand text above footer
Keep this one — but check the size. If it's smaller than 120px, increase it to clamp(96px, 14vw, 240px). It should be dramatic or not exist at all.

### 1.9 Section eyebrows
Standardize format across every section. Just two parts separated by a line:
```
― 04                    THE PLATFORM
```
That's it. No "TECHNICAL REFERENCE" tags, no triple-slash wrappers, no dual-line numbering. One number dash at left, one label at right, both mono, both 11px, text-light.

### 1.10 Commit
`refactor: strip decorative micro-details, reduce visual noise across sections`

Verify: view the site. Each section should feel emptier, lighter, more deliberate. If it feels empty, good — Phase 2 fills that space with scale, not stuff.

---

## PHASE 2 — AMPLIFY (scale up what matters)

### 2.1 Hero headline — much larger
Current: probably `clamp(44px, 7vw, 92px)`.
Change to: `clamp(64px, 12vw, 200px)`.
Line-height: `0.95`.
Letter-spacing: `-0.04em`.

On a 1440px viewport, the headline should render around 170px. On mobile (390px), around 64px. If this breaks the two-column hero layout, switch hero to a single column on desktop: headline dominates the top 60% of viewport, firewall viz sits below or to the side at smaller scale.

**Serious consideration: make the hero a SINGLE column.** Huge headline top, subhead + CTAs centered below, firewall viz appears on second scroll screen. This is the QClay pattern — one idea per screen.

### 2.2 Section headlines
Current: `clamp(36px, 4.5vw, 56px)`.
Change to: `clamp(48px, 7vw, 112px)`.

All h2 elements. Comparison, Products, How It Works, FAQ, CTA — every section headline gets massive.

### 2.3 Section vertical spacing
Current: `py-28 md:py-36`.
Change to: `py-32 md:py-48 lg:py-56`.

Between any section and the next, there should be 400-500px of clear space on desktop. This is the single biggest upgrade to perceived premium-ness.

### 2.4 Marquee divider sizes
Current: `clamp(32px, 5vw, 64px)`.
Change to: `clamp(64px, 10vw, 160px)`.

Marquees should be BIG. They're ambient, but they should be visible enough to actually function as a rhythm device.

### 2.5 CTA section — total rebuild for scale
The final CTA should command its own ~100vh of space. Headline alone fills ~40% of viewport height:
- Headline: `clamp(72px, 12vw, 200px)`, line-height `0.95`
- Subhead: 24px, text-medium, max-width 48ch, centered
- Buttons: side by side, primary slightly larger than before
- Below buttons: optional 1px primary rule at 120px width, centered

No ambient marks. No annotations. Just big headline, sub, buttons, space.

### 2.6 Orange discipline — audit and reduce
Search the codebase for `--color-primary` usages. Target state:
- Primary CTA fills in Hero (1) and final CTA (2) = 2 uses
- Orange underline under ONE word in hero headline = 1 use
- Orange column top-border on ArmorIQ comparison column = 1 use
- Orange emphasis underline on one word in CTA headline = 1 use
- Orange pulse ring in hero firewall animation (on ALLOWED packets) = 1 use
- Orange dots/accents in badges, hover states, focus rings = minimal

Total visible-on-page-load orange elements: **6 or fewer**.

Remove any other orange appearances (random orange borders on cards, orange dots scattered through UI, orange text emphasis on random words). Replace those with `var(--color-text-dark)` or `var(--color-border-strong)`.

### 2.7 Hero firewall panel — scale implications
With the hero headline now occupying more vertical space, reposition the firewall viz:

**Option A (preferred): Single column hero**
- Headline + subhead + CTAs fill the first viewport
- The firewall viz is its own section, occupies its own 80-90vh after the hero
- It gets its own section headline: "The firewall in action." — big, editorial
- The viz itself is LARGER (previously ~500px wide, make it 800-900px on desktop)
- More room for the animation to breathe

**Option B (keep two-column but dramatic):**
- Hero headline wraps across the whole hero width (not constrained to left column)
- Firewall viz below-right, smaller
- Risk: headline feels disconnected from the visualization

Prefer Option A. It's more QClay.

### 2.8 Commit
`feat(scale): amplify typography, spacing, and hero composition; restrain orange to 6 uses`

Verify: on a 1440px viewport, a single screenful should typically contain at most ONE major idea (headline, or image, or section). If you can see 3 ideas on one screen, typography or spacing needs more scale.

---

## PHASE 3 — THREE SIGNATURE SCROLL MOMENTS

Replace the current "many small reveals" with THREE big moments. Each owns its own screen-plus worth of scroll space.

### 3.1 Moment 1: "Hero handoff" — headline to firewall

Currently: user lands, curtain lifts, hero animates in. If they scroll, they just hit TrustBar.

Change: after hero entrance, when user scrolls, the headline zooms/exits upward and the firewall panel grows from below as its own full-screen moment.

Implementation:
- Hero section has a ScrollTrigger pinning it for ~150vh of scroll
- Inside the pin, a scrubbed timeline:
  - Progress 0-30%: idle (user sees hero)
  - Progress 30-60%: headline scales up and fades (`scale: 1 → 1.4, opacity: 1 → 0`), subhead fades, CTAs shrink
  - Progress 30-60%: firewall panel transitions from small accent to full-viewport (grows from 40% size to 90% of viewport), simultaneously
  - Progress 60-100%: firewall at full scale, a large editorial label fades in below it: "Every action, inspected." (Sunflower 700, 48-72px)
- Section unpins, user continues scrolling, TrustBar appears

This is a WOW moment. The firewall literally takes over the page. Scrub is tied to scroll so the user has control.

### 3.2 Moment 2: The manifesto (pin + word swap)

From the previous prompt — KEEP this but dial up the scale.

Section between Comparison and FAQ:
- Pinned for 300vh scroll
- A single sentence on screen, center-aligned, HUGE: `clamp(40px, 6vw, 104px)`
- As user scrolls, the sentence swaps through these 5 states:

```
Progress 0-20%:   "Most AI failures are not model failures."
Progress 20-40%:  "Most AI failures are INTENT failures."
Progress 40-60%:  "The model did what you asked."
Progress 60-80%:  "The AGENT did something you didn't."
Progress 80-100%: "ArmorIQ checks PURPOSE."
```

Transitions:
- Previous sentence: fades + translates up (-40px) with blur filter increasing from 0 to 8px
- Next sentence: fades in from translate +40px, blur from 8px to 0px
- Emphasis word (INTENT, AGENT, PURPOSE): color `var(--color-primary)`, gets an underline that draws via scaleX after the word settles

The effect is dreamlike and definitive. The user is FORCED to slow down and read the argument because their scroll is driving the text.

On mobile: unpin, render as 5 stacked large statements, each scroll-revealed. Keep the emphasis word styling.

### 3.3 Moment 3: "Control comparison" — the ArmorIQ column comes last

The current comparison table drops columns from above. Replace with a more dramatic moment:

- Section pins for ~200vh
- Scrub timeline:
  - Progress 0-20%: section headline fully visible, table empty
  - Progress 20-60%: competitor columns drop in one at a time (Guardrails, IAM, Sandbox, Observability). Each takes ~10% of scroll. They drop heavily, fast, `power3.in`, slight dust-settle shake.
  - Progress 60-70%: pause. Table sits with 4 columns. A mono label appears below: `4 tools. 0 prevent rogue actions.`
  - Progress 70-100%: ArmorIQ column slides in from LEFT (not from top like the others). It's bigger (1.15×), heavier. Takes ~30% of the scroll. When it settles, it pulses once in primary color. A mono label appears: `ArmorIQ. Prevention, not observation.`

The ArmorIQ column arriving DIFFERENTLY and LAST makes it feel singular. Different motion = different category.

On mobile: unpin, the card stack reveals one card at a time with scroll, ArmorIQ card revealing last with primary-color border emphasis.

### 3.4 Commit
`feat(signature): three signature scroll moments - hero handoff, manifesto, comparison drop`

---

## PHASE 4 — VERIFICATION AUDIT

Run these checks and report results. If any fail, fix before declaring done.

### 4.1 Orange count
```bash
grep -rn "color-primary" src/ | grep -v "// " | wc -l
```
Should be under 20. If higher, audit each usage — most should be for hover states, focus rings, or the 6 approved visible usages.

### 4.2 Typography scale
Inspect rendered hero on 1440px viewport. Headline computed font-size should be 160px or larger. If smaller, the clamp isn't generous enough.

### 4.3 Section spacing
Inspect the gap between any two sections in devtools. Top/bottom padding combined should be 300px+ on desktop.

### 4.4 "One idea per screen" test
Scroll through the site at 1440×900 viewport. At each pause point, count distinct major elements on screen:
- Hero: headline OR firewall OR CTAs — if all three visible in one screen, need more scale
- Section headlines should dominate when first revealed
- Comparison: when entering the section, should see the headline alone first, then scroll to see the table
- CTA: headline alone should fill first viewport

### 4.5 Animation count
Count all ScrollTrigger instances in the codebase:
```bash
grep -rn "scrollTrigger\|ScrollTrigger.create\|useGSAP.*scroll" src/ | wc -l
```
Should be 10-15, not 30+. If 30+, too many small reveals are competing.

### 4.6 Duplicate DOM check (still!)
```bash
curl -s https://<preview-url>/ | grep -c "support-agent-1"
```
Should be 1. (Earlier prompts have mentioned this — verify once more.)

### 4.7 Reduce, don't replace
If in doubt, REMOVE. Don't replace an animation with a "better" one. The best animation is often no animation in its place — just clean typography with generous space.

### 4.8 Commit
`chore: audit verification - typography scale, spacing, orange discipline, animation count`

---

## THE PHILOSOPHY (re-read this before declaring done)

Premium design is CONFIDENCE. Confidence looks like:

- One idea at a time
- Big type, huge space
- Two colors, one accent used rarely
- Slow, deliberate motion — not "snappy"
- Nothing decorative. Everything purposeful.

It does NOT look like:
- Many small animations running simultaneously
- Fake technical labels decorating every tile
- Accent color sprinkled for "visual interest"
- Typography that stays modest so "nothing dominates"
- Micro-stats and version numbers to prove we're a technical product

Security products especially benefit from confidence. Cloudflare, Vercel infrastructure pages, Fly.io — they use MASSIVE restraint. One huge headline, one animation, a sentence of copy, space. Then the next thing.

If you find yourself wanting to add something, don't. Remove something adjacent to it instead.

---

## FINAL CHECK

Before declaring complete:
- [ ] Hero headline visually dominant on desktop (170px+ on 1440 viewport)
- [ ] Orange visible in 6 places or fewer on page load
- [ ] No agent ID badges, version labels, mini bar charts, or corner viewfinders on hero panel
- [ ] No scroll progress indicator on right edge
- [ ] No cursor-proximity border glow on cards
- [ ] Product cards have 4 elements each (icon, tag, title, body)
- [ ] Section spacing is 300px+ between sections
- [ ] 3 signature scroll moments implemented (hero handoff, manifesto, comparison drop)
- [ ] Total ScrollTrigger instances 10-15
- [ ] No DOM duplicates
- [ ] `npm run build` passes
- [ ] `grep -rn ": any" src/` empty

Report the audit results.

Start with Phase 1 — STRIP. Then amplify. Then add signature moments. Not the other way around.