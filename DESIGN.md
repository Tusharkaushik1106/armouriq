# DESIGN.md — ArmorIQ Design System

The actual design system as implemented. Tokens live in [src/app/globals.css](src/app/globals.css) under `@theme`.

## Brand voice

- **Title:** ArmorIQ — Stop AI agents from going rogue
- **Tagline:** It's not about Identity, It's about Intent
- **Mode:** light only. Editorial, warm-neutral. Restrained orange accent. Fine grain texture site-wide. Uppercase mono labels. Oversized fluid display type.

## Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| `--color-primary` | `#E07B4C` | accent only — underlines, "rogue" emphasis, primary button fill, single-line dividers |
| `--color-primary-hover` | `#D06A3B` | primary button hover |
| `--color-text-dark` | `#2D2D2D` | headlines, body emphasis, logo |
| `--color-text-medium` | `#4A4A4A` | body copy |
| `--color-text-light` | `#6B6B6B` | mono labels, eyebrows, secondary metadata |
| `--color-bg` | `#ffffff` | page background |
| `--color-surface` | `#FAFAF8` | warm-tinted card / section variant background |
| `--color-border` | `#E8E4DE` | hairlines, dividers, card borders |
| `--color-border-strong` | `#D4CEC4` | secondary button border, badge border |
| `--color-danger` | `#C63D3D` | "Action Blocked" state, log BLOCK lines |
| `--color-danger-bg` | `#FBEDEC` | danger badge fill |
| `--color-success` | `#3D8B5C` | "Yes" check marks, ALLOW logs, registered status dots |

QDiscButton accent palette (random per-character on hover): primary orange, success green, `#3F6FFF` blue, danger red.

## Typography

- **Sans (body + display):** `Sunflower` (300 / 500 / 700) loaded via `next/font/google`, exposed as `--font-sunflower` and the `--font-sans` CSS var.
- **Mono:** `JetBrains_Mono` via `next/font/google`, exposed as `--font-geist-mono` and `--font-mono`.
- **Body default:** 300 weight, antialiased, optimizeLegibility.
- **Headings:** `h1/h2/h3` 700, letter-spacing `-0.02em`, line-height `1.05`. `h4–h6` 500, `-0.01em`.

### Fluid scale (clamp values used in the codebase)

| Role | clamp() | Where |
| --- | --- | --- |
| Hero / CTA mega headline | `clamp(64px, 12vw, 200px)` / `clamp(56px, 12vw, 200px)` | HeroHandoff, CTA |
| Section H2 | `clamp(48px, 7vw, 112px)` | Problem, Products, Comparison, FAQ |
| Manifesto lines (desktop) | `clamp(40px, 6vw, 104px)` | Manifesto |
| Hero handoff label | `clamp(28px, 3.5vw, 56px)` | HeroHandoff "Every action, inspected." |
| HowItWorks step number | `clamp(100px, 20vw, 260px)` | HowItWorks |
| HowItWorks step title | `clamp(26px, 3.2vw, 44px)` | HowItWorks |
| Section closing line | `clamp(28px, 4vw, 48px)` / `clamp(32px, 4.5vw, 64px)` | HowItWorks, Comparison |
| Footer brand marquee | `clamp(96px, 14vw, 240px)` | Footer |
| MarqueeDivider text | `clamp(64px, 10vw, 160px)` | MarqueeDivider |

Headline letter-spacing convention: `-0.03em` for section H2, `-0.04em` for hero/CTA mega.

### Mono labels (the eyebrow system)

Every section opens with a mono eyebrow row:

```
― 04                                       The Platform
```

Style: `font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-light)]`. Implemented as [SectionEyebrow](src/components/ui/SectionEyebrow.tsx). Numbering observed in code: `01` Hero, `02` Problem, `04` Products, `05` Comparison, `07` FAQ. (No `03`/`06` — sections without eyebrows: HowItWorks, Manifesto, CTA.)

Smaller mono labels (`10–11px`, tracking `0.10–0.14em`) are used inside cards as taglines (e.g. "The Brain" above each product card).

## Spacing

- **Container:** `max-w-7xl mx-auto px-6 lg:px-8` — single source via [Container.tsx](src/components/ui/Container.tsx).
- **Section vertical rhythm:** `py-32 md:py-48 lg:py-56` is the standard. Hero is `min-h-screen`. CTA is `min-h-screen` with `py-32 md:py-48`.
- **Divider sections:** `py-14 md:py-20` for marquee dividers.
- **Heading-to-body within a section:** `mb-20 md:mb-24` between intro block and the section's content grid.

## Borders, radius, shadow

- Hairline `1px` borders use `--color-border`. Stronger borders (buttons, badges) use `--color-border-strong`.
- Radii: `rounded-md` (8px) for badges and small icon buttons, `rounded-lg` (10px) for buttons, `rounded-xl` (14px) for product cards, `rounded-2xl` (18px) for the comparison table panel, `rounded-full` for QDiscButton and FAQ plus icon.
- Shadows are utility classes in globals.css:
  ```
  .card-shadow        → 0 1px 2px rgba(45,45,45,.04), 0 8px 24px rgba(45,45,45,.06)
  .card-shadow-hover  → 0 4px 8px rgba(45,45,45,.04), 0 12px 32px rgba(45,45,45,.08)
  ```

## Texture

- **Grain overlay:** painted on `body::before` — fixed, full-bleed SVG fractal noise at `0.025` opacity, `mix-blend-mode: multiply`, `opacity: 0.7`. Always on, never per-section.
- **Grid background:** opt-in `.bg-grid` class — 32px grid, lines at `rgba(45,45,45,0.04)`.

## Buttons

### `<Button>` — [Button.tsx](src/components/ui/Button.tsx)

Three variants, all with `inline-flex gap-2 rounded-lg text-sm font-medium tracking-[-0.005em]`:

| Variant | Style |
| --- | --- |
| `primary` | `bg-[--color-primary] text-white hover:bg-[--color-primary-hover]`, `px-6 py-3.5` |
| `secondary` | `border border-[--color-border-strong] text-[--color-text-dark] hover:border-[--color-text-dark]`, `px-6 py-3.5` |
| `ghost` | `text-[--color-text-dark] underline-slide`, `px-4 py-3` |

Optional `magnetic` and `trail` flags route through `MagneticButton`. Active state (`button:active`, `a:active`): scale `0.985`, transition `0.08s`.

### `<QDiscButton>` — [QDiscButton.tsx](src/components/ui/QDiscButton.tsx)

The signature CTA used at Nav, Hero, and CTA. Pill (`rounded-full`), surface fill, strong-border, `px-7 py-3.5`. On hover:

1. A 36px black disc appears at the cursor's X position and scales from 0 → 1 (`power3.out`, 0.45s).
2. Disc tracks the cursor on `mousemove` (`power3.out`, 0.4s).
3. Each character tints to a random accent color (orange / green / blue / red) with a 0.04s per-character stagger.
4. On leave: disc scales back to 0; characters fade back to dark in reverse order.
5. Click: `0.96 → 1` yoyo scale (0.1s).

All cursor effects are gated behind `prefers-reduced-motion: reduce`.

## Badges — [Badge.tsx](src/components/ui/Badge.tsx)

`inline-flex gap-2 px-3 py-1.5 rounded-md border font-mono text-[11px] uppercase tracking-[0.08em]` with a `1.5px` leading dot.

| Variant | bg | border | text + dot |
| --- | --- | --- | --- |
| `default` | surface | border-strong | text-light |
| `danger` | `--color-danger-bg` | `rgba(198,61,61,0.25)` | `--color-danger` |
| `success` | `rgba(61,139,92,0.08)` | `rgba(61,139,92,0.25)` | `--color-success` |

Used in `Problem` to display "Action Blocked — Outside task scope" (danger variant).

## Section-by-section behavior

### PageCurtain ([PageCurtain.tsx](src/components/PageCurtain.tsx))
Full-screen `--color-text-dark` overlay at `z-100`. Letters `A R M O R I Q` rise from translateY(110%) staggered (0.04s, `power3.out`), hold ~0.25s, exit upward staggered (0.03s, `power3.in`), then the entire curtain slides up `yPercent: -100` over 0.9s `expo.inOut`. Reduced-motion: simple opacity fade.

### Nav ([Nav.tsx](src/components/layout/Nav.tsx))
Sticky, `z-50`. Transparent over hero; on `scrollY > 40` switches to `bg-white/70 backdrop-blur-md` with bottom border. Logo on hover plays a 3-frame x-shake (-2 / +2 / 0, 0.04s each — "glitch"). Intro: from `y:-40, opacity:0` to rest, delay `2.2s` (after curtain). CTA in nav is the QDiscButton ("Book a Demo"). Below `lg`, hamburger opens MobileDrawer (mount-gated to avoid duplicate DOM).

### AnnouncementBar ([AnnouncementBar.tsx](src/components/layout/AnnouncementBar.tsx))
Dark bar (`--color-text-dark` bg, white text), mono. Copy: "Just Launched — Introducing ArmorClaw Intent Assurance for OpenClaw Agents" + "Explore ArmorClaw →". Dismissible (height + opacity collapse, 0.35s). Intro at `delay: 2.4s`.

### HeroHandoff ([HeroHandoff.tsx](src/components/sections/HeroHandoff.tsx))
**Intro (no scroll, on mount, `delay: 2.3s`):**
- Eyebrow `― 01   Control Fabric for Autonomous Agents` fades up.
- Headline `Stop AI agents from going rogue.` — five word-masks slide up (`stagger 0.05`, `power3.out`).
- The "rogue" word has an orange underline that draws `scaleX 0 → 1` at offset 1.1s.
- Subhead and CTAs fade up after.

**Scrubbed handoff (desktop only, pinned `+=120%`):**
- 0–40%: hold.
- 40–70%: hero text scales to 1.15, fades, lifts -60px.
- 40–100%: firewall illustration grows from `scale 0.48, x:20%, y:10%, opacity:0.4` → centered full size.
- 85–100%: bold label `Every action, inspected.` fades in below firewall.

Mobile: no pin. Hero text → firewall stacked → label.

### TrustBar ([TrustBar.tsx](src/components/sections/TrustBar.tsx))
"Trusted by security leaders from teams at" mono label. Logos: `verily, carid, google, paypal, intuit, hbc` at 60% opacity, grayscaled (`grayscale(1) brightness(0.4)`). Desktop: 6-col grid, fade-up stagger on enter. Mobile: marquee at speed 40.

### Problem ([Problem.tsx](src/components/sections/Problem.tsx))
Two-column `1.3fr / 1fr`. Eyebrow `― 02   The Problem`. Headline (word-split): "AI agents don't just generate text. They take actions." Body copy + danger Badge. Right column: `ProblemIllustration`. Reveal cascade on `top 70%`.

### MarqueeDivider ([MarqueeDivider.tsx](src/components/ui/MarqueeDivider.tsx))
Two used: `INTENT · POLICY · AUDIT` after Problem, and `STOP AI AGENTS FROM GOING ROGUE` (reverse direction) after Products. Mono uppercase, `clamp(64px, 10vw, 160px)`, color `--color-text-light`, separator dot in `--color-border-strong`. Speed 60.

### HowItWorks ([HowItWorks.tsx](src/components/sections/HowItWorks.tsx))
Three steps: **01 Add Agents to your registry & policy**, **02 Define and enforce Intent**, **03 Generate Audit trails**. Each step has an inline illustration:
- Step 01: list of 4 registered agent rows (success dot + mono name + "registered" pill).
- Step 02: intent-check card showing `DELETE /users/42 → BLOCKED`, reason "exceeds delegated scope".
- Step 03: dark log block with three ALLOW lines (white/50%) and one BLOCK line (`--color-danger`), plus `sig=sha256:...`.

**Desktop:** pinned horizontal track. Total scroll = `(panels - 1) * window.innerWidth`. Each panel content fades-and-rises within its viewport via `containerAnimation`. **Mobile:** stacked, per-panel fade.

Closing line (universal): "IAM controls access. **ArmorIQ controls behavior.**" with orange underline draw on the second sentence (char-split).

### Products ([Products.tsx](src/components/sections/Products.tsx))
Eyebrow `― 04   The Platform`. Heading: "One platform. Full control." Six cards in `1 / 2 / 3` columns, each `min-h-280px`, `rounded-xl`, white, with custom 32×32 stroke icon and `tag → title → body → "Learn more →"`.

| key | tag | title |
| --- | --- | --- |
| intent | The Brain | Intent Engine |
| sentry | The Eyes | Sentry |
| gatekeeper | The Guard | Gatekeeper |
| registry | The Map | Registry |
| auditor | The Record | Auditor |
| armorclaw | Open Source | ArmorClaw |

**Animation:** uses GSAP `Flip`. Cards begin stacked at center (z-ordered, slight rotation `(i - 2.5) * 1.5°`, slight `y` offset `i*6px`). On first scroll-in (`top 65%`), they Flip to their final grid positions over 1.1s `power3.inOut` with 0.07 stagger. Reduced-motion / mobile: simple fade-up grid reveal.

### Comparison ([Comparison.tsx](src/components/sections/Comparison.tsx))
Eyebrow `― 05   The Comparison`. Heading (word-split): "Why not just use guardrails or IAM?" Subcopy: "They solve different problems. ArmorIQ fills the gap none of them cover."

Table compares **ArmorIQ** vs **Guardrails / IAM·RBAC / Sandbox·Isolation / Observability·Logs** across 6 rows (Core question, What it checks, When it acts, What goes wrong, What it verifies, Stops rogue actions).

**Desktop pinned scrub (`+=180%`):**
- 0–55%: 4 competitor columns drop in from `y:-200, opacity:0` sequentially.
- 55–70%: interim mono label fades in: `4 tools. 0 prevent rogue actions.`
- 70–100%: that label exits, ArmorIQ column slides in from `x:-200`, scales 1.04 pulse, then settles. Final mono label fades in (orange): `ArmorIQ. Prevention, not observation.`
- ArmorIQ column has an orange `2px` accent bar above its header; cell is shown at `scale: 1.08`.

**Mobile:** stacked cards, one per competitor, each showing a 2-col side-by-side grid for every row. Fade-up on enter.

**Cell types:** `Yes` (green check + "Yes"), `No` (gray x + "No"), `—` (dash), italic text "Contains, not prevents", or plain text. The check `path` has class `check-draw` reserved for future SVG path-draw.

Closing line: "Guardrails stop bad responses. **ArmorIQ stops bad actions.**" — char-split, orange underline draws on the second clause.

### Manifesto ([Manifesto.tsx](src/components/sections/Manifesto.tsx))
Five lines that resolve the central thesis:

1. Most AI failures are not model failures.
2. Most AI failures are **INTENT** failures.
3. The model did what you asked.
4. The **AGENT** did something you didn't.
5. ArmorIQ checks **PURPOSE**.

**Desktop:** pinned `h-screen`, scrub `+=300%`. Lines stack absolutely at 50/50 (single slot). Each line cross-fades (`opacity`, `y: 40`, `filter: blur(8px)`) into the next at duration 0.4 each. Emphasis words have an orange underline that draws on arrival. Mobile: 5 lines stacked vertically with `gap-20`.

### FAQ ([FAQ.tsx](src/components/sections/FAQ.tsx))
Eyebrow `― 07   FAQ`. Heading: "Frequently Asked Questions". Subcopy: "Everything you need to know about ArmorIQ".

5 single-open accordion items. Layout per item:
- `Q1` mono label (left, 11px tracking 0.12em light)
- Question text 18–22px, `font-normal` closed → `font-medium` open
- Plus icon in 32px circular border button — rotates `+45°` to become an X when open

Open animation: `height: 0 → auto`, `opacity: 0 → 1` (0.4s power3.out), plus rotates, an orange `2px` left bar (`scaleY 0 → 1`) appears, item bg transitions to `--color-surface`. Hover hint: a 60px orange bar at left center fades to 30% opacity on hover when closed.

Items cover: definition of intent, vs IAM, what happens when blocked, where ArmorIQ fits, who it's for. First item (`Q1`) is open by default.

### CTA ([CTA.tsx](src/components/sections/CTA.tsx))
Full-bleed `min-h-screen`, surface bg. Centered. Headline (char-split, `clamp(56px, 12vw, 200px)`):

> Ready to **control** what your AI agents actually do?

The word "control" has the orange underline draw (`scaleX 0 → 1` over 0.7s after the headline finishes). Subcopy + two CTAs (QDiscButton "Book a Demo" + ghost "Read Docs →"). Below: a 120px orange horizontal rule that draws from center.

### Footer ([Footer.tsx](src/components/layout/Footer.tsx))
Surface bg with top hairline. **Top:** giant marquee (`clamp(96px, 14vw, 240px)`) alternating `STOP AI AGENTS FROM GOING ROGUE` (light, 15% opacity) and `· ARMORIQ` (orange, 25% opacity), speed 30. **Body:** 4-col grid: brand block + tagline ("It's not about Identity, It's about Intent") · Platform links · Company links · Connect (LinkedIn / X / GitHub icon buttons in 8px-padded bordered squares). Bottom row: copyright + privacy/terms. Final line: mono micro-label "built with GSAP · Tailwind · Next.js" at 60% opacity.

## Motion principles

- **One animation library** (GSAP). One smooth-scroll provider (Lenis), driven by `gsap.ticker`.
- **Easing vocabulary:** `power3.out` for entrances, `power2.in` / `power2.inOut` for exits and crossfades, `power4.out` for the comparison ArmorIQ slide-in (snappy), `expo.inOut` for the curtain rise, `back.out(1.6)` for badge pop, `power3.inOut` for Flip choreography.
- **Stagger range:** char-splits `0.012–0.05`, word-splits `0.05`, card grids `0.07–0.12`.
- **Reveal threshold:** `top 70%` to `top 85%` for ScrollTrigger entrances. Pinned scrubs use `top top` + percentage end.
- **Always cleanup ScrollTriggers** in useGSAP return.
- **Site intro choreography (sequenced delays after page load):**
  - 0s: PageCurtain begins
  - ~2.2s: Nav fade-up
  - ~2.3s: Hero intro timeline
  - ~2.4s: AnnouncementBar fade-down

## Accessibility

- `:focus-visible` outline: 2px primary, 2px offset, 2px radius — set globally in globals.css.
- `prefers-reduced-motion`: site-wide CSS override forces `0.01ms` durations; every JS animation also branches on the media query and sets resting state.
- Decorative SVGs marked `aria-hidden="true"`. Decorative spans (underline draws, disc) marked `aria-hidden`.
- FAQ uses `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`.
- AnnouncementBar dismiss button has `aria-label`.
- Logo link has `aria-label="ArmorIQ home"`.

## Adding a new section — checklist

1. Create `src/components/sections/Foo.tsx` with `'use client'` (if it animates).
2. Use the section skeleton (Container + SectionEyebrow + clamp() H2 + body).
3. Use only theme tokens for color. Use `clamp()` inline styles for display type.
4. Wrap GSAP work in `useGSAP({ scope: ref })` and import GSAP from `@/lib/gsap` only.
5. Branch on `prefers-reduced-motion` for every animation; provide a resting state.
6. If pinning: gate with `useMediaQuery('(min-width: 768px)')` (or `gsap.matchMedia`) and ship a stacked mobile fallback.
7. Set initial hidden states via inline `style` (or `gsap.set` inside useGSAP) — never via CSS that runs before hydration.
8. Add the section to [src/app/page.tsx](src/app/page.tsx) in the appropriate slot. Insert a `MarqueeDivider` only when the rhythm needs a hard reset.
9. If it has an eyebrow, pick the next number in sequence. Skipping numbers is OK (existing flow does).
