# QClay Design — Reconnaissance Report

Scan date: 2026-04-25
Scanned URL: https://qclay.design/

## 0. Important scanning caveat (read first)

QClay is a **React SPA that hijacks scroll** — the `<body>` height stays locked at exactly `900px` (== viewport height). Programmatic `window.scrollTo()`, `mouse.wheel()`, and `PageDown` key events **do not advance the page** for an automation client; all 10 `home-NN-scroll-*.png`, all 40 `wheel-NN.png`, and all 25 `w2-NN.png` frames are therefore visually identical to `home-00-initial.png`. See `.pw/qclay/wheel-frames.json` — every entry reports `scrollY: 0, bodyHeight: 900`.

Real scroll-triggered content IS present in the DOM from page load (all 8 headings exist in `headings.json` from frame 1), but the site uses an internal virtual-scroll state machine (gated by real human wheel/touch events, likely pointer-ID-checked) to reveal it. Playwright cannot drive that state machine without a real user gesture. **The scroll-moment catalogue in §7 is therefore reconstructed from the DOM text and the static hero screenshot — not from observed frame-by-frame animation.** Videos you capture manually in the browser (or `.pw/qclay/videos/ctas/*.webm`, which DID capture the open/close menu transition) are the authoritative source for timing.

---

## 1. Tech stack detected

(from `.pw/qclay/libs-detected.json`, `.pw/qclay/stack.json`)

- **Animation library:** none detected on `window` (no `gsap`, `ScrollTrigger`, `Lenis`, `Barba`, `THREE`, `SplitType`). Everything is bundled into `main.ffaff9ec.js` (single webpack bundle) — animations are almost certainly GSAP + custom virtual scroller, just not exposed globally.
- **ScrollTrigger:** none on window — but behavior (locked body height, sequential section reveals, curtain transitions) strongly implies a custom scroll-hijacker (likely a `wheel`/`touchmove` listener feeding a state index into a GSAP timeline).
- **Smooth scroll:** custom. Body is fixed at viewport height; there is no native scroll. This is not Lenis / not Locomotive via globals.
- **Page transitions:** none observed — site behaves as a single-screen SPA (no `/about`, `/work` routes; `scan-transition.mjs` found **zero** internal `<a href="/...">` links — `navHref: null`). Navigation happens via the overlay menu, swapping content in place.
- **Font files (5):**
  1. `AtypDisplay-Medium.woff2` — hero H1 serif-feeling display
  2. `MazzardM-Medium.woff2` — body / utility sans
  3. `MazzardM-Bold.woff2` — emphasis
  4. `Plus Jakarta Sans` (400/500/700/800) from Google Fonts
  5. `arp-150.woff` — rare/custom (likely a stylized display face for large slab moments)
- **Render mode:** SPA, client-rendered. `__NEXT_DATA__` absent, `$nuxt` absent. `main.ffaff9ec.js` hydrates content. Bot/preview crawlers likely see minimal initial HTML.
- **Other infrastructure:** Cloudflare Turnstile (bot challenge), Cloudflare Insights beacon, GA4 (`G-JTJ0TT1S99`).

---

## 2. Typography system

(from `.pw/qclay/facts-home.json`)

| Element | Font family | Size (px) | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| h1 (hero) | `"Atyp Display", serif` | **45** | 400 | 54 | normal |
| h2 "What About QClay?" | (inherits Atyp/Mazzard) | **82** | 500 | — | — |
| h2 "EACH OF OUR DESIGNERS…" | — | **92** | 700 | — | — |
| h2 quote slab "Majority of people…" | — | **75** | 400 | — | — |
| h2 "Our studio is a safe space…" | — | **40** | 400 | — | — |
| h2 (empty / visual) | — | **96** | 700 | — | — |
| body | `"Times New Roman"` (fallback — actual `@font-face` hadn't applied at capture time) | 16 | 400 | — | — |

Hero headline ratio to body: **45 / 16 ≈ 2.8×** at 1440×900. This is unusually restrained — the hero reads as editorial, not maximalist. The real size drama is downstream (92px h2 weight-700 is **5.75× body**).

Signature typographic behavior: several h2s (e.g. `"Ourstudioisasafespacewherestartupsgrowandshine"`, `"Majorityofpeoplecan runa100meterdash"`) are rendered **without spaces in `innerText`** — implying the visible spacing is set via CSS `word-spacing`, `letter-spacing`, or SVG path layout rather than actual whitespace. This is likely what enables animated character splitting.

---

## 3. Color palette

From screenshots + `facts-home.json`:

- `#000000` — all body text, headlines, nav links (bg: `rgb(0,0,0)` on text)
- `#FFFFFF` — page background (`rgb(255, 255, 255)`)
- `#E8E8E8` — CTA pill fill ("Our Capabilities Deck", "Book a call") — a near-white neutral
- `#B4E800`-ish green dot — the "• Let's Talk!" pulsing indicator (visual estimate from `home-00-initial.png`)
- Yellow/orange — 5-star rating glyphs next to "Rating 5, 24 reviews" (visual estimate)
- Pale lilac/violet — the circular "SCROLL DOWN TO SEE THAT SHIT" label ring around the eye illustration (hero right side, visual estimate)
- Dark navy/purple block (`#2b2852`-ish) — menu video/image placeholder rectangle (visible in `click-0250ms.png`)

**Background primarily: white.** Hero is flat white with black type, no gradients.

**Accent count on first viewport:** roughly **3** — the green dot on "Let's Talk!", the yellow star row, the lilac ring around the eye. The eye illustration itself is a single accent motif. Everything else is monochrome black-on-white. The page is deliberately quiet chromatically so downstream animation/motion carries the personality.

---

## 4. Layout rhythm

Per the caveat in §0, we cannot observe scroll transitions. What we CAN observe:

- **Distinct DOM sections:** 10 (from `sectionCount` in `facts-home.json`).
- **Distinct heading moments in DOM order** (from `headings.json`): Hero H1 → "What About QClay?" H2 → three H3 pillars (shine online / research into solutions / team is very global) → "EACH OF OUR DESIGNERS…" H2 → quote slab "Majority of people…" H2 → "Our studio is a safe space…" H2 → one unnamed H2. That's **~8 scroll moments**.
- **Vertical spacing:** since the body is locked at 100vh, each "moment" == 1 viewport (100vh per moment). This is a pinned, section-swap layout, not a continuous scroll.
- **One dominant idea per snap:** yes — the hero alone confirms this pattern (white space ~65% of viewport, single headline left, single illustration right, single CTA pill bottom-right).
- **Whitespace density:** very high. The hero uses ~60% of the viewport as white space. No visible competing elements.

---

## 5. CTA button behavior

Scan captured 5 CTAs (see `.pw/qclay/ctas-found.json`). Measured media: `cta-0-*` through `cta-4-*`, plus `cta-N-hover-styles.json`.

### CTA-0: "menu" / "Close menu" (top-right burger)

- Default state: text label "menu" next to a two-bar burger icon, top-right. Class `burger button-burger`. Transparent bg.
- In the captured video `.pw/qclay/videos/ctas/*.webm` this toggles an **overlay curtain menu** — the white menu panel in `click-0250ms.png` / `click-0800ms.png` / `click-2500ms.png`.
- Menu content revealed: left column "Social: Dribbble / Behance / TikTok / Instagram / LinkedIn", center column "Menu: About Us / What We Do / Our Works / Contact Us" (large, ~45–50px type), plus a dark navy rectangular **video/illustration placeholder**. Footer: `info@qclay.design`, `Privacy Policy & Cookies`, `© QClay De[sign]`.
- Transition: the curtain is already open at 250ms and essentially static by 800ms → ~500ms open duration is a reasonable estimate (real timing should be verified from the webm).

### CTA-1: "Our Capabilities Deck" (primary pill, hero right)

**This is the signature CTA and the most interesting motion on the visible page.**

- Default (`cta-1-a-rest.png`): light-gray pill, `bg: rgb(232, 232, 232)`, `border-radius: 50px`, `padding: 5px 10px`, black text, no transform.
- 120ms hover (`cta-1-b-hover-120ms.png`): appears nearly identical to rest — the effect hasn't ramped yet.
- 500ms hover (`cta-1-c-hover-500ms.png`): **a solid black circle has appeared centered over the pill**, roughly 60–70px diameter, blocking the middle of the "Capabilities" word. The label letters visible around the circle's edge appear to be **multi-color** (a red "r", teal "D", orange "l" / "k" are visible) — suggesting the text is rendered per-character with individual color assignments during hover, OR the label has been split and replaced by a duplicate sliding in.
- Leave (`cta-1-d-leave.png`): snaps back to exact rest state. No lingering color.
- Computed hover style (`cta-1-hover-styles.json`): `transform: none`, `bg: rgb(232, 232, 232)`, `border-radius: 50px` — the pill itself doesn't transform. **The circle and colored characters are additional DOM layered on top**, not a CSS transform of the pill.

Plain-language description: on hover a **solid black disc scales in from the button's center** over ~400–500ms, and simultaneously the label characters cycle/reveal in **non-uniform accent colors** (each character appears independently tinted). On leave the disc vanishes and the text returns to black. The disc appears to act as a "cursor-follows-me" or "magnetic-attractor" blob rather than a fill.

### CTA-2: "Submit the request"

- Located at y=2005 (off-screen by default, in a form section accessed via menu nav — our scanner scrolled it into view via `scrollIntoView`).
- Hover captures (`cta-2-*.png`) came back as **plain white** — the element likely became hidden or its parent was untransformed during the virtual-scroll re-layout. No reliable hover read captured. Verify manually.

### CTA-3: "Our Capabilities Deck" (second instance, y=2410)

- Same pill as CTA-1 (identical styling per `ctas-found.json`). Second placement of the primary CTA further down the page. Same expected hover behavior.

### CTA-4: "Book a call" (floating bottom-right)

- Persistent floating CTA, always visible at bottom-right corner alongside Telegram / WhatsApp icon buttons.
- Default: light-gray pill with a calendar icon.
- 500ms hover (`cta-4-c-hover-500ms.png`): the WhatsApp circular icon above it has **scaled up noticeably** (its bounding box is visibly larger than rest — a proximity/magnetic expansion). The "Book a call" pill itself looks similar to rest in this clip.
- Suggests a **proximity-influenced icon stack** — hovering near the stack inflates neighbors, not just the hovered target.

### Nav links (Home / About / Works / Contact us)

- Class `animate-link`. `innerText` on each is **duplicated** (`"Home\nHome"`, `"About\nAbout"`, etc.). Classic **roll-over / stack-swap link trick**: the link contains two stacked copies of the label; on hover one translates out of view and the duplicate translates in from below/above. Transparent bg, 0px border, 0px radius — purely a text-swap effect.

---

## 6. Click / page-transition behavior

(from `click-0000ms.png` → `click-2500ms.png`, `click-timeline.json`)

**Note:** the script's "first nav CTA" fell through to the `menu` button (because there are no internal route links on this site). The recorded timeline is therefore the **overlay menu open/close**, not a route transition.

- **0ms (click):** frame shows the hero page with menu icon mid-morph — the `menu` label is transforming / an arrow `>` is already visible overlapping it. Hero headline region appears whitened-out already (the hero is being hidden behind the incoming curtain).
- **100ms:** (not a screenshot of a new state — essentially same as 250ms given capture timing drift — see `click-timeline.json`: 100ms frame actually captured at 247ms due to sync lag).
- **250ms:** menu curtain **fully open** — white background covering hero, left column of socials, center column of large nav items, dark navy rectangle placeholder in middle, floating icons still visible bottom-right.
- **500ms:** same as 250ms — curtain is already settled.
- **800ms, 1200ms, 1800ms, 2500ms:** identical to 500ms — no further animation. Menu is static once open.

**Summary of transition:**
- [ ] Simple navigation (instant)
- [x] **Curtain / wipe** — white panel wipes in from screen edge over ~200–300ms
- [ ] Fade-through
- [ ] Button-expands-into-page
- [ ] Panel slides over (possible — could also be a top-to-bottom slide; 250ms granularity too coarse to disambiguate)
- [ ] Zoom-into-target

**Estimated duration:** overlay is settled by ~300ms; conservative upper bound **~500ms**. The menu icon itself has its own micro-animation (bars → "X" / arrow). Real timing should be read from `.pw/qclay/videos/ctas/*.webm`.

Note: because there are no route links, QClay has **no page-to-page transitions in the traditional sense** — the "transition" is just the overlay menu wipe.

---

## 7. Scroll-triggered animation catalogue

**Heavy caveat (repeated from §0):** automated scroll didn't trigger section reveals. The following is reconstructed from DOM text (`headings.json`) and known agency-site patterns. **Timings and specific behaviors should be verified manually by watching the site.**

### Moment 0: Hero (observed)
- Location: y=0 (locked)
- What we see on load: H1 "Global design agency that creates holistic, well-balanced design solutions for inspiring brands" (left), circular "SCROLL DOWN TO SEE THAT SHIT" label with eye illustration (right), "Rating 5, 24 reviews" + Clutch logo + slash-separated service categories, "Our Capabilities Deck" pill, nav bar, green-dot "Let's Talk!".
- Likely intro: hero elements are probably staggered in on first paint (character-split headline, lifting from below, eye illustration scaling/fading).

### Moment 1: "What About QClay?" (DOM-only)
- H2 82px weight 500 — a quieter section header that introduces a pillar list.
- Three H3 bullets: "We help our clients to shine online" / "We translate research into solutions" / "Our team is very global". Very likely each H3 fades/slides in sequentially.

### Moment 2: "EACH OF OUR DESIGNERS WAS THE BEST AMONG SEVERAL THOUSAND OTHERS"
- H2 92px weight 700 — the page's largest-weight typographic shout.
- Text content spans 5 lines in `innerText`. Likely **per-line or per-word animated reveal**, very possibly split across multiple scroll beats (each line advancing on its own wheel tick).

### Moment 3: Quote slab — "Majority of people can run a 100 meter dash, but only a dozen can do it in under 9.8 seconds"
- H2 75px weight 400, prefixed with `,,` (opening quotes).
- Note the `innerText` has **no spaces** between words — strongly suggesting it's animated via per-character CSS transform (each letter in its own span).

### Moment 4: "Our studio is a safe space where startups grow and shine"
- H2 40px weight 400, also **space-stripped in innerText**.

### Moment 5: Team / Designer showcase
- From `stack.json` images: `/images/designers/avatars/1.png` — an avatars grid is loaded.
- The empty H2 at index 8 (96px weight 700) is likely a large numeric/statistical headline layered over avatars.

### Moment 6: Work / Portfolio
- From `stack.json`: `/video/portfolio/hand.webp` (poster for a video), `/images/whatCreate/*.webp` (interface mocks: grid, sidebar, tasks, prototype, desktop-header, mobile-header, logo, title, row). Sources indicate a **layered interface mockup animation** — interface parts likely assemble on scroll (video poster + overlay PNG layers).

### Moment 7: Create / Land
- `/video/create/land-poster.webp` — another video section.

### Moment 8: Contact / Character
- `/video/contact/character-poster.webp` — a character illustration (probably rigged video) anchoring the contact section.
- Form contains the "Submit the request" CTA (`cta-2`, y=2005 in the DOM).

### Globally present during all scroll moments
- Top nav: QCLAY logo, Home/About/Works/Contact us with hover-stack animation, "• Let's Talk!" pill, menu burger.
- Bottom-right stack: Telegram icon, WhatsApp icon, "Book a call" pill. These **persist across scroll** (floating).

---

## 8. Most striking / signature moments

1. **The "black disc over pill" CTA hover (CTA-1 / "Our Capabilities Deck").** Because (a) the pill itself doesn't transform, (b) the letters appear to split into independently-colored glyphs, and (c) the dark disc feels cursor-magnetic. This reads as deliberate personality in a place most sites treat as utilitarian. Highest impact, easiest to steal. Evidence: `.pw/qclay/cta-1-c-hover-500ms.png`.
2. **The "SCROLL DOWN TO SEE THAT SHIT" circular label + eye motif in the hero.** A single whimsical detail carries enormous brand voice. The ring rotates (visual comparison between `home-00-initial.png` and `home-full.png` — the word "SCROLLDOWN" has advanced around the circle). Cheap to replicate, disproportionately memorable. Evidence: compare the two hero shots.
3. **The locked-body + wheel-hijacked section swap model itself.** The entire navigation architecture is a single-screen state machine: no routes, no scrollbar, section changes gated on user gestures. It's what makes the site feel bespoke even when individual sections aren't extraordinary. High cost to implement, highest "can't-quite-put-my-finger-on-it" impact.

---

## 9. Raw data references

- Hero screenshot (initial viewport): `.pw/qclay/home-00-initial.png`
- "Full page" screenshot (identical to above due to virtual scroll): `.pw/qclay/home-full.png`
- Facts JSON: `.pw/qclay/facts-home.json`
- Stack JSON (scripts/styles/fonts/images): `.pw/qclay/stack.json`
- Libs detected: `.pw/qclay/libs-detected.json`
- All DOM headings in order: `.pw/qclay/headings.json`
- Wheel-scroll attempt log (proves scroll didn't advance): `.pw/qclay/wheel-frames.json`
- CTA catalogue: `.pw/qclay/ctas-found.json`
- CTA rest/hover/leave shots: `.pw/qclay/cta-{0..4}-{a-rest,b-hover-120ms,c-hover-500ms,d-leave}.png`
- CTA hover computed styles: `.pw/qclay/cta-{0..4}-hover-styles.json`
- Click/overlay timeline frames: `.pw/qclay/click-{0000,0100,0250,0500,0800,1200,1800,2500}ms.png`, timestamps in `.pw/qclay/click-timeline.json`
- Transition meta (no internal routes found): `.pw/qclay/transition-meta.json` (not written — `navHref` was null)
- Videos:
  - CTA interactions: `.pw/qclay/videos/ctas/*.webm`  ← **authoritative source for CTA hover + menu open timing**
  - Home scan: `.pw/qclay/videos/*.webm`
  - Scroll attempt: `.pw/qclay/videos/scroll/*.webm`
  - Wheel attempt: `.pw/qclay/videos/wheel/*.webm`, `.pw/qclay/videos/wheel2/*.webm`
  - Transition scan: `.pw/qclay/videos/transition/*.webm`

---

## 10. Observations that didn't fit above

- **The cursor-magnetic primary CTA is the single most replicable signature moment.** The hover isn't just a color change — it's a composed effect (disc + per-character color split + "roll-over" label duplication). If one element from QClay is worth copying, it's this pattern.
- **Every navigation link has duplicated `innerText`** (`"Home\nHome"`, etc.) — classic two-stacks-translate-Y hover. Cheap, effective, consistent across the whole nav.
- **The site is a single-screen SPA with NO internal routes.** There is no `/about`, `/work`, `/contact` page. Every "destination" is a section in the same virtual-scroll timeline. `scan-transition.mjs` confirmed zero qualifying `<a href="/...">`. Design implication: URL-level analytics / SEO for sub-content is weak by architecture.
- **Headings have `innerText` with stripped whitespace** (e.g. `"Majorityofpeoplecan runa100meterdash"`, `"Ourstudioisasafespacewhere..."`). This is unusual and is almost certainly intentional — the visible spacing is CSS-driven (letter/word-spacing or a manual span-per-glyph layout). It's the setup for character-level animation.
- **No custom cursor was observed in the 1440×900 hero capture.** The stack of floating bottom-right icons (Telegram, WhatsApp, Book a call) appears to expand/scale on proximity (see `cta-4-c-hover-500ms.png`) — a mild magnetic/proximity effect, not a full custom cursor.
- **Bundle-only animation stack.** No GSAP / ScrollTrigger / Lenis / Barba exposed on `window`, yet behavior strongly implies all four. Everything is tree-shaken into `main.ffaff9ec.js`. You cannot detect which animation library they use without source-mapping the bundle.
- **Body font fell back to `"Times New Roman"` at capture time** — implying the intended custom body face (Mazzard M based on the font load list) hadn't swapped in when `getComputedStyle(body)` fired. In production the site should render Mazzard M on body; this is a timing artifact of Playwright's snapshot, not the intended design.
- **Three tracking / compliance scripts** on page: GA4, Cloudflare Insights, Cloudflare Turnstile (the latter repeatedly spawning blob-URL workers — hence the long script list in `stack.json`).
- **Accessibility note:** virtual scroll hijacking typically breaks keyboard navigation and assistive-tech scrolling. Did not formally audit, but `PageDown` did not advance the site during the scan — a warning sign.

---

**Report path:** `c:\Users\anura\OneDrive\Desktop\aromouriq\qclay-report.md`
**Media folder:** `c:\Users\anura\OneDrive\Desktop\aromouriq\.pw\qclay\`
