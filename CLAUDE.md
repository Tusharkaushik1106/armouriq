# CLAUDE.md — ArmorIQ Landing

Guide for Claude Code working in this repo. Reflects the codebase as it exists, not aspiration.

## Project

ArmorIQ marketing landing page. Single-page Next.js app pitching a "control fabric for autonomous AI agents" — intent enforcement, policy, audit. Tagline: **Stop AI agents from going rogue.**

## Stack

- **Framework:** Next.js `14.2.35` (App Router), React 18, TypeScript 5.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`). Theme tokens declared in `@theme` block in [src/app/globals.css](src/app/globals.css).
- **Animation:** GSAP `3.14` (`ScrollTrigger`, `Flip`) + `@gsap/react` (`useGSAP`). Lenis `1.3` for smooth scroll.
- **Fonts:** `Sunflower` (300/500/700) as primary sans, `JetBrains_Mono` as mono — both via `next/font/google` in [src/app/layout.tsx](src/app/layout.tsx).
- **No CSS-in-JS, no UI library, no state library.** Plain Tailwind + CSS vars + inline styles for clamp() values.

## Scripts

```
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # next lint
```

No test runner is wired up. Playwright is in `devDependencies` but there is no test suite.

## Architecture

```
src/
  app/
    layout.tsx       # fonts, PageCurtain, SmoothScroll, body grain overlay
    page.tsx         # full landing — composes every section in order
    globals.css      # @theme tokens, base styles, helper classes
  lib/
    gsap.ts          # registers ScrollTrigger + Flip + useGSAP plugins (one place)
    useMediaQuery.ts # SSR-safe matchMedia hook (returns null until mounted)
  components/
    PageCurtain.tsx     # ARMORIQ letter-stagger intro curtain (~2s)
    SmoothScroll.tsx    # Lenis init, drives ScrollTrigger.update via gsap.ticker
    layout/
      AnnouncementBar.tsx
      Nav.tsx              # sticky, blurs on scroll>40, opens MobileDrawer below lg
      MobileDrawer.tsx
      Footer.tsx           # giant marquee + 4-col grid
    sections/   # one file per landing section, in render order:
      HeroHandoff.tsx       # pinned scrub: hero text → firewall scales up
      HeroAnimation.tsx     # the firewall illustration component
      TrustBar.tsx          # logo grid (desktop) / marquee (mobile)
      Problem.tsx           # text + ProblemIllustration
      ProblemIllustration.tsx
      HowItWorks.tsx        # 3 steps; pinned horizontal track on desktop, stacked on mobile
      Products.tsx          # 6 cards; Flip stack→grid on first scroll-in
      Comparison.tsx        # pinned scrub: competitor cols drop, then ArmorIQ slides in
      Manifesto.tsx         # pinned scrub: 5 lines crossfade through one slot
      FAQ.tsx               # accordion, single-open, height auto animation
      CTA.tsx               # closing headline + buttons
    ui/
      Button.tsx          # primary | secondary | ghost; can wrap MagneticButton
      QDiscButton.tsx     # signature CTA — black disc tracks cursor under text
      MagneticButton.tsx
      Badge.tsx           # default | danger | success — mono 11px pill
      Container.tsx       # max-w-7xl mx-auto px-6 lg:px-8
      Marquee.tsx
      MarqueeDivider.tsx  # full-bleed marquee between sections
      SectionEyebrow.tsx  # `― 04   THE PLATFORM`
      SplitText.tsx       # word/char split → .split-mask + .split-inner
```

### Render order (page.tsx)

`AnnouncementBar → Nav → HeroHandoff → TrustBar → Problem → MarqueeDivider("INTENT · POLICY · AUDIT") → HowItWorks → Products → MarqueeDivider("STOP AI AGENTS FROM GOING ROGUE", reverse) → Comparison → Manifesto → FAQ → CTA → Footer`

## Conventions to follow

### Animation

- **Always import GSAP from `@/lib/gsap`** — never directly. That module registers plugins exactly once.
- **Wrap effects in `useGSAP({ scope: ref })`.** Pass `dependencies` only when reactive state should re-trigger.
- **Always honor `prefers-reduced-motion`.** Pattern used everywhere:
  ```ts
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { gsap.set(els, { opacity: 1, y: 0 }); return; }
  ```
- **ScrollTrigger cleanup:** return `() => ScrollTrigger.getAll().forEach((t) => t.kill())` from useGSAP when the section creates triggers.
- **Pinned scrub timelines** (`HeroHandoff`, `HowItWorks`, `Comparison`, `Manifesto`) must use `pin: true, anticipatePin: 1, scrub: 1` and a percentage `end` (e.g. `+=120%`).
- **Desktop-only pins:** gate with `useMediaQuery` or `gsap.matchMedia()` and provide a stacked mobile fallback. See `HowItWorks` (`mm.add('(min-width: 768px) ...')`) and `Manifesto` (`isDesktop === false` early return).
- **Initial hidden state must be set in JSX with inline `style={{ opacity: 0 }}` or `transform: translateY(100%)`** — not via CSS classes — so SSR markup matches and there's no flash before GSAP boots.

### Responsive / SSR

- `useMediaQuery` returns `null` until mounted. Treat `null` as desktop-default; only switch to mobile when explicitly `false`. Pattern: `const showMobile = isDesktop === false;`.
- This avoids hydration mismatches and the wrong layout flashing on first paint.
- The mobile drawer is mount-gated: only rendered when below `lg` OR after the user has opened it once (see `Nav.tsx` — prevents duplicate DOM).

### Styling

- **Theme tokens are CSS vars defined in `@theme {}`** (Tailwind v4 syntax). Reference them as `bg-[var(--color-primary)]`, `text-[var(--color-text-medium)]`, etc.
- **Never use raw hex** in components — go through a token. If a new token is needed, add it to `globals.css`.
- **Typography uses `clamp()` inline styles** for fluid scale headlines (e.g. `fontSize: 'clamp(64px, 12vw, 200px)'`). Do not convert these to Tailwind utilities.
- **Helper classes** in globals.css: `.bg-grid`, `.bg-grain`, `.split-mask` / `.split-inner`, `.underline-slide`, `.card-shadow`, `.card-shadow-hover`, `.font-mono`.
- A site-wide grain overlay is painted via `body::before` (multiply blend, fixed). Don't duplicate it inside sections.

### Section structure

Most sections follow this skeleton:

```tsx
<section ref={container} id="..." className="py-32 md:py-48 lg:py-56 bg-[var(--color-bg)]">
  <Container>
    <SectionEyebrow num="0X" label="The ..." className="mb-6" />
    <h2 style={{ fontSize: 'clamp(48px, 7vw, 112px)', letterSpacing: '-0.03em', lineHeight: 1.02 }}>
      <SplitText splitBy="word">...</SplitText>
    </h2>
    {/* body */}
  </Container>
</section>
```

Section IDs in use: `hero`, `problem`, `how-it-works`, `products`, `comparison`, `faq`, `cta`. Nav links target these.

### Components

- **`Button`** — discriminated union (`as: 'a' | 'button'`). Variants: `primary` (orange), `secondary` (outlined), `ghost` (underline-slide). Optional `magnetic`/`trail` route through `MagneticButton`.
- **`QDiscButton`** — the signature CTA. Used at hero, nav, and CTA. Black disc grows from cursor X on enter, follows cursor, and characters tint with random accents (orange/green/blue/red) on enter. Reverse on leave.
- **`Badge`** — variants `default | danger | success`. Always 11px mono uppercase with leading dot.
- **`SplitText`** — wraps each word/char in `.split-mask > .split-inner`. Hidden state is `translateY(100%)`. Animations target `.split-inner`.

### Imports

- Use the `@/` alias (configured in `tsconfig.json`) for everything under `src/`.
- Sections that animate must be `'use client'`. Pure presentational UI (Container, Badge, SectionEyebrow) stays server-rendered.

## Things to avoid

- Don't add new animation libraries. GSAP covers everything here.
- Don't introduce dark mode — site is light-only by design.
- Don't render the firewall illustration twice. `HeroHandoff` mount-gates it via `useMediaQuery` (mobile fallback below the hero text). A previous bug duplicated it; preserve that gating.
- Don't change `html { scroll-behavior: auto }` — Lenis owns scrolling.
- Don't strip the `prefers-reduced-motion` paths to "simplify" — every animation must have one.

## Where things live (quick lookups)

| Need | File |
| --- | --- |
| Add a color/spacing token | [src/app/globals.css](src/app/globals.css) `@theme` block |
| Tweak intro curtain | [src/components/PageCurtain.tsx](src/components/PageCurtain.tsx) |
| Hero copy / scroll handoff | [src/components/sections/HeroHandoff.tsx](src/components/sections/HeroHandoff.tsx) |
| Section ordering | [src/app/page.tsx](src/app/page.tsx) |
| Manifesto lines | [src/components/sections/Manifesto.tsx](src/components/sections/Manifesto.tsx) `lines` array |
| Comparison table | [src/components/sections/Comparison.tsx](src/components/sections/Comparison.tsx) `columns` + `rows` |
| Product cards | [src/components/sections/Products.tsx](src/components/sections/Products.tsx) `products` array |
| FAQ items | [src/components/sections/FAQ.tsx](src/components/sections/FAQ.tsx) `items` array |
| CTA / button styles | [src/components/ui/Button.tsx](src/components/ui/Button.tsx), [src/components/ui/QDiscButton.tsx](src/components/ui/QDiscButton.tsx) |
