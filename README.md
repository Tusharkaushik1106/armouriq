# ArmorIQ Landing — Redesign

A redesigned, animated landing page for ArmorIQ, an AI agent security platform. ArmorIQ is a firewall for AI agent actions — it enforces agent intent cryptographically and blocks unauthorized tool calls before they execute.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Tech stack

- Next.js 14 (App Router) + TypeScript strict (no `any`)
- Tailwind CSS v4 with `@theme` tokens in `globals.css`
- GSAP 3.14.2 + @gsap/react (`useGSAP` hook) + Flip plugin
- Lenis smooth scroll
- Google Fonts via `next/font`: Sunflower (display + body) + JetBrains Mono (technical labels — `Geist Mono` isn't available in Next 14's font-data manifest, so JetBrains Mono is used as a close-match monospace via the `--font-geist-mono` CSS variable)

## Design & animation decisions

The design brief specified a warm editorial palette (terracotta orange on white) with Sunflower and Geist Mono, and tasked redesigning + animating a landing page for an AI-agent security product. My core insight was that the product concept *is* the animation — ArmorIQ is a firewall that inspects AI agent actions, so the hero visualization shows agents emitting tool calls (packets), a central firewall inspecting each with a pause + scanning line, and verdicts played out with allowed/blocked outcomes (mutating labels, counter increments, target flashes on allow, shake + flash on block). Every section carries intentional motion that serves meaning: character-level headline reveals via a custom SplitText component (replacing the paid GSAP plugin), a pinned horizontal scroll for the 3-stage "How It Works" flow, GSAP Flip for the products grid to animate cards from a stacked deck to a grid on entry, and a column-drop comparison table where the ArmorIQ column lands last with emphasis. Marquee dividers run uppercase technical vocabulary ("INTENT · POLICY · AUDIT") between sections for pace and rhythm. Smooth scroll via Lenis ties the page together. All animations respect `prefers-reduced-motion`: the hero falls back to a static composed snapshot, scroll triggers disable, Lenis is skipped, and marquees pause. No component libraries — every primitive (Button, Badge, Container, Marquee, MagneticButton, SplitText, PageCurtain, MobileDrawer) is hand-built. Zero `any` types. Orange is used as an accent only — primary CTA fill, one-word emphasis on closing lines ("rogue.", "control", "ArmorIQ controls behavior."), and allowed-state indicators; the page reads warm-white with orange highlights, never orange-heavy.

## Video walkthrough script (for recording)

> **0–6s** Land on page. Curtain pulls up, hero characters reveal, firewall animation starts.
> **6–18s** Scroll past the marquee divider, through the trust bar and problem section.
> **18–30s** Enter HowItWorks — show the horizontal scroll in action.
> **30–42s** Continue to Products (Flip reveal) and Comparison (column drop).
> **42–55s** Open mobile view. Open the nav drawer. Scroll through mobile layout.
> **55–60s** Wrap.
