# ArmorIQ Landing

Marketing site for ArmorIQ. Single-page Next.js app, GSAP-driven, light-theme only.

## Setup

```
npm install
npm run dev      # localhost:3000 (or 3001 if 3000 is busy)
npm run build
npm run lint
```

Node 18+, no env vars, no backend. Logos live in `public/images/logos/`.

## Notes

The loader zooms into a faint ArmorIQ shield in its background while the page itself scales in from behind — the shield then re-appears as the nav logo, so it reads as one continuous arrival instead of a curtain wipe. The hero uses a pinned scroll-scrub on desktop (headline hands off into the firewall illustration) but drops the pin on mobile and just stacks them, since pinning at small heights felt cramped. Animations are GSAP + Lenis throughout; every section has a reduced-motion fallback.

## Layout

```
src/app/         layout, page composition, globals.css (Tailwind v4 @theme tokens)
src/components/
  layout/        Nav, MobileDrawer, FullscreenMenu, Footer, FooterRevealWrapper, AnnouncementBar
  sections/      one file per landing section, in render order
  ui/            Button, QDiscButton, MagneticButton, SplitText, Marquee, Container, Badge, SectionEyebrow
  PageCurtain, SmoothScroll, CustomCursor, SafetyReveal
src/lib/         gsap.ts (plugin registration), useMediaQuery
```

Render order is in `src/app/page.tsx`. Section IDs (`#hero`, `#problem`, `#how-it-works`, `#products`, `#comparison`, `#faq`, `#cta`) are what the nav links target.
