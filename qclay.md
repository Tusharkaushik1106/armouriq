# QClay Animation Reconnaissance — Playwright Scan + Report

You have Playwright available. This task is NOT about building anything. Your job is to SCAN https://qclay.design/ with Playwright and produce a structured report describing the animations, interactions, typography, and layout patterns used on the site. The user will then hand that report to me for analysis.

Do not write implementation code. Do not modify any project files. Do not touch the ArmorIQ codebase. This is pure observation.

---

## OUTPUT

Produce ONE file: `qclay-report.md` at the project root. Follow the exact structure below. Be specific and numeric wherever possible — "the button stretches 1.4× wider over ~500ms" is useful; "the button animates" is not.

Include screenshots and videos referenced by relative path. Save media into `.pw/qclay/`.

---

## HOW TO WORK

1. Install Playwright if not installed: `npx playwright install chromium`
2. Create `.pw/qclay/` for output media
3. Run the inspection scripts below in order
4. Fill in the report template as you go
5. When done, hand the user `qclay-report.md` + the media folder

Keep sessions under 30 seconds per page. QClay uses heavy JavaScript; wait for `networkidle` plus a 2-second buffer after navigation.

---

## INSPECTION SCRIPTS

### Script 1: Home page snapshots across the scroll

Create `.pw/qclay/scan-home.mjs`:

```js
import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();

await page.goto('https://qclay.design/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000); // allow any intro / curtain animations

// Initial viewport
await page.screenshot({ path: `${OUT}/home-00-initial.png` });

// Scroll in 10 increments, screenshot at each
const height = await page.evaluate(() => document.body.scrollHeight);
console.log('page height:', height);

for (let i = 1; i <= 10; i++) {
  const y = Math.round((height / 10) * i);
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(1200); // let animations settle
  await page.screenshot({ path: `${OUT}/home-${String(i).padStart(2, '0')}-scroll-${y}px.png` });
}

// Full page screenshot
await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

// Dump some style & DOM facts
const facts = await page.evaluate(() => {
  const byTag = (tag) => Array.from(document.querySelectorAll(tag));
  const font = (el) => getComputedStyle(el);
  return {
    h1s: byTag('h1').slice(0, 3).map((el) => ({
      text: el.innerText.slice(0, 120),
      fontSize: font(el).fontSize,
      fontFamily: font(el).fontFamily,
      fontWeight: font(el).fontWeight,
      lineHeight: font(el).lineHeight,
      letterSpacing: font(el).letterSpacing,
      color: font(el).color,
    })),
    h2s: byTag('h2').slice(0, 5).map((el) => ({
      text: el.innerText.slice(0, 120),
      fontSize: font(el).fontSize,
      fontWeight: font(el).fontWeight,
    })),
    bodyFont: {
      family: font(document.body).fontFamily,
      size: font(document.body).fontSize,
      weight: font(document.body).fontWeight,
      color: font(document.body).color,
      bg: font(document.body).backgroundColor,
    },
    buttons: byTag('a, button').slice(0, 20).map((el) => ({
      text: el.innerText.slice(0, 60),
      tag: el.tagName,
      classes: el.className.slice(0, 200),
      bg: font(el).backgroundColor,
      color: font(el).color,
      border: font(el).border,
      borderRadius: font(el).borderRadius,
      padding: font(el).padding,
    })).filter(b => b.text.length > 0 && b.text.length < 40),
    sectionCount: byTag('section').length + byTag('main > div').length,
  };
});

fs.writeFileSync(`${OUT}/facts-home.json`, JSON.stringify(facts, null, 2));

await ctx.close();
await browser.close();
console.log('done home scan');
```

Run: `node .pw/qclay/scan-home.mjs`

### Script 2: CTA hover + click interactions

Find the primary CTAs on the page and record their behavior on hover and click.

Create `.pw/qclay/scan-ctas.mjs`:

```js
import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/ctas`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Find candidate CTAs — likely button-like <a> or <button> with short text
const ctas = await page.evaluate(() => {
  const els = Array.from(document.querySelectorAll('a, button'));
  return els
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const t = (el.innerText || '').trim();
      return r.width > 80 && r.width < 400 && r.height > 30 && r.height < 120 && t.length > 0 && t.length < 40;
    })
    .slice(0, 6)
    .map((el, i) => {
      const r = el.getBoundingClientRect();
      el.setAttribute('data-cta-id', String(i));
      return {
        id: i,
        text: el.innerText.trim(),
        x: r.x + r.width / 2,
        y: r.y + r.height / 2,
        w: r.width,
        h: r.height,
      };
    });
});
fs.writeFileSync(`${OUT}/ctas-found.json`, JSON.stringify(ctas, null, 2));

// For each CTA: hover, wait, capture state, then leave
for (const cta of ctas) {
  // Scroll into view
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, cta.id);
  await page.waitForTimeout(800);

  // Pre-hover snapshot
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-a-rest.png`,
    clip: { x: Math.max(0, cta.x - 250), y: Math.max(0, cta.y - 80), width: 500, height: 160 },
  });

  // Hover
  await page.mouse.move(cta.x, cta.y);
  await page.waitForTimeout(120);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-b-hover-120ms.png`,
    clip: { x: Math.max(0, cta.x - 250), y: Math.max(0, cta.y - 80), width: 500, height: 160 },
  });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-c-hover-500ms.png`,
    clip: { x: Math.max(0, cta.x - 250), y: Math.max(0, cta.y - 80), width: 500, height: 160 },
  });

  // Capture computed styles in hover state
  const hoverStyles = await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor, color: s.color, border: s.border,
      borderRadius: s.borderRadius, transform: s.transform,
      width: s.width, height: s.height, padding: s.padding,
    };
  }, cta.id);
  fs.writeFileSync(`${OUT}/cta-${cta.id}-hover-styles.json`, JSON.stringify(hoverStyles, null, 2));

  // Leave
  await page.mouse.move(50, 50);
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-d-leave.png`,
    clip: { x: Math.max(0, cta.x - 250), y: Math.max(0, cta.y - 80), width: 500, height: 160 },
  });
}

// Click behavior — pick the first obvious nav CTA and click; record the transition
const firstNavCta = ctas.find((c) => /work|view|about|contact|case/i.test(c.text)) || ctas[0];
if (firstNavCta) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, firstNavCta.id);
  await page.waitForTimeout(500);

  // Start recording the click sequence rapidly
  const startTime = Date.now();
  const clickTimes = [];
  const captureAt = async (ms, label) => {
    const diff = ms - (Date.now() - startTime);
    if (diff > 0) await page.waitForTimeout(diff);
    clickTimes.push({ ms: Date.now() - startTime, label });
    await page.screenshot({ path: `${OUT}/click-${String(ms).padStart(4, '0')}ms.png` });
  };

  page.mouse.click(firstNavCta.x, firstNavCta.y).catch(() => {});
  // Capture rapid-fire frames after click
  await captureAt(0, 'click');
  await captureAt(100, '100ms');
  await captureAt(250, '250ms');
  await captureAt(500, '500ms');
  await captureAt(800, '800ms');
  await captureAt(1200, '1200ms');
  await captureAt(1800, '1800ms');
  await captureAt(2500, '2500ms');

  fs.writeFileSync(`${OUT}/click-timeline.json`, JSON.stringify({ cta: firstNavCta, frames: clickTimes }, null, 2));
}

await ctx.close();
await browser.close();
console.log('done CTA scan');
```

Run: `node .pw/qclay/scan-ctas.mjs`

### Script 3: Scroll-triggered animations — slow scroll with frame sampling

Create `.pw/qclay/scan-scroll.mjs`:

```js
import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/scroll`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Slow scroll: step size 80px, wait 400ms per step, screenshot every 3 steps
const height = await page.evaluate(() => document.body.scrollHeight);
const stepSize = 80;
const totalSteps = Math.ceil(height / stepSize);
console.log(`scrolling through ${totalSteps} steps (${height}px)`);

let shotIdx = 0;
for (let step = 0; step <= totalSteps; step++) {
  const y = step * stepSize;
  await page.evaluate((yy) => window.scrollTo({ top: yy }), y);
  await page.waitForTimeout(250);
  if (step % 3 === 0) {
    await page.screenshot({ path: `${OUT}/scroll-${String(shotIdx).padStart(3, '0')}-y${y}.png` });
    shotIdx++;
  }
}

await ctx.close();
await browser.close();
console.log('done scroll scan');
```

Run: `node .pw/qclay/scan-scroll.mjs`

### Script 4: Page transition on navigation

If the home page has a clear nav link to a sub-page (e.g., /work, /about, /cases), capture the page-to-page transition.

Create `.pw/qclay/scan-transition.mjs`:

```js
import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/transition`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Find a likely internal nav link
const navHref = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a'));
  const internal = links.find((a) => {
    const h = a.getAttribute('href') || '';
    return h.startsWith('/') && h !== '/' && a.innerText.trim().length > 0 && a.innerText.length < 40;
  });
  return internal ? { href: internal.href, text: internal.innerText.trim() } : null;
});
console.log('nav target:', navHref);

if (navHref) {
  // Capture transition
  const clickPromise = page.click(`a[href="${new URL(navHref.href).pathname}"]`).catch((e) => console.log('click err:', e.message));
  const start = Date.now();
  
  const frames = [];
  while (Date.now() - start < 3500) {
    const t = Date.now() - start;
    try {
      await page.screenshot({ path: `${OUT}/transition-${String(t).padStart(4, '0')}.png` });
      frames.push(t);
    } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  await clickPromise;
  console.log('captured transition frames:', frames.length);
}

await ctx.close();
await browser.close();
console.log('done transition scan');
```

Run: `node .pw/qclay/scan-transition.mjs`

### Script 5: Page source + asset inventory

Quickly catalogue the tech stack.

```js
// .pw/qclay/scan-stack.mjs
import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const requests = [];
page.on('request', (req) => requests.push({ url: req.url(), type: req.resourceType() }));
await page.goto('https://qclay.design/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const scripts = requests.filter((r) => r.type === 'script').map((r) => r.url);
const styles = requests.filter((r) => r.type === 'stylesheet').map((r) => r.url);
const fonts = requests.filter((r) => r.type === 'font').map((r) => r.url);
const images = requests.filter((r) => r.type === 'image').map((r) => r.url).slice(0, 30);

fs.writeFileSync(`${OUT}/stack.json`, JSON.stringify({ scripts, styles, fonts, images }, null, 2));

// Detect libraries in global scope
const libs = await page.evaluate(() => ({
  gsap: typeof window.gsap !== 'undefined',
  ScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
  lenis: typeof window.Lenis !== 'undefined' || typeof window.lenis !== 'undefined',
  barba: typeof window.barba !== 'undefined',
  three: typeof window.THREE !== 'undefined',
  splitType: typeof window.SplitType !== 'undefined',
}));
fs.writeFileSync(`${OUT}/libs-detected.json`, JSON.stringify(libs, null, 2));

await ctx.close();
await browser.close();
```

Run: `node .pw/qclay/scan-stack.mjs`

---

## REPORT TEMPLATE

After running all scripts, fill in `qclay-report.md` at the project root using this exact structure. Reference media by relative path.

```markdown
# QClay Design — Reconnaissance Report

Scan date: YYYY-MM-DD
Scanned URL: https://qclay.design/

## 1. Tech stack detected

(from .pw/qclay/libs-detected.json and stack.json)
- Animation library: e.g. "GSAP detected on window" / "GSAP via bundled module"
- ScrollTrigger: yes/no
- Smooth scroll: Lenis / Locomotive / none
- Page transitions: Barba / custom / Next.js
- Font files: list them (up to 5 most relevant)
- Render mode: SPA / SSR (note whether initial HTML is meaningful or entirely JS-rendered)

## 2. Typography system

(from .pw/qclay/facts-home.json)

| Element | Font family | Size (px) | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| h1 | | | | | |
| h2 | | | | | |
| body | | | | | |

Hero headline ratio to body: e.g. "260px / 16px = 16.25×"

## 3. Color palette

Primary / accent colors observed (from CTAs, highlights, borders):
- `#XXXXXX` — used for X
- `#XXXXXX` — used for Y

Background primarily: white / dark / other.

Accent visible-on-load count: estimate how many times the accent color appears on first viewport.

## 4. Layout rhythm

Observations from home-00 through home-10 screenshots:
- Number of distinct full-screen scroll "moments": N
- Typical vertical spacing between major sections: ~N vh
- Does each scroll snap present ~1 dominant idea? yes/no
- Whitespace density: low / medium / high

## 5. CTA button behavior

For each CTA scanned (cta-0 through cta-5):

### CTA-0: "{text}"

- Default state (see cta-0-a-rest.png): bg, color, border-radius, padding
- Hover behavior (see cta-0-b-hover-120ms.png vs cta-0-c-hover-500ms.png):
  - What changed visually in first 120ms: ...
  - What changed between 120ms and 500ms: ...
  - Computed hover styles: (from cta-0-hover-styles.json)
- Leave behavior (cta-0-d-leave.png): snap back / slow return / stays

Describe the animation in plain language. Example: "On hover, the background fills from left to right over ~400ms while the label translates up and is replaced by a duplicate sliding up from below."

### CTA-1: ...
(repeat for each)

## 6. Click / page-transition behavior

(from click-0000ms.png through click-2500ms.png, click-timeline.json)

Describe the sequence:
- 0ms (click moment): ...
- 100ms: ...
- 250ms: ...
- 500ms: ...
- 800ms: ...
- 1200ms: ...
- 1800ms: ...
- 2500ms: ...

Summary: what kind of transition is this?
- [ ] Simple navigation (instant)
- [ ] Fade-through
- [ ] Curtain / wipe
- [ ] Button-expands-into-page (element grows to fill viewport)
- [ ] Panel slides over
- [ ] Zoom-into-target
- [ ] Other: describe

Duration of full transition: N ms

## 7. Scroll-triggered animation catalogue

Walking through scroll-000.png to scroll-NNN.png, list each distinct animation moment observed (likely 5-12 total):

### Moment 1: Hero entrance
- Location: top of page, y=0 to y=~600
- What happens: describe in plain language
- Duration: ~N seconds
- Elements animating: headline, CTA, bg, etc.

### Moment 2: [name it]
- Location: y=X to y=Y
- Behavior: ...

(repeat for all distinct scroll moments)

## 8. Most striking / signature moments

The 3 moments most worth trying to replicate, ranked by impact:

1. [Name] — because ...
2. [Name] — because ...
3. [Name] — because ...

## 9. Raw data references

- Full-page screenshot: .pw/qclay/home-full.png
- Facts JSON: .pw/qclay/facts-home.json
- Stack JSON: .pw/qclay/stack.json
- Libs detected: .pw/qclay/libs-detected.json
- CTA shots: .pw/qclay/cta-*-*.png
- CTA hover styles: .pw/qclay/cta-*-hover-styles.json
- Click timeline: .pw/qclay/click-timeline.json
- Scroll shots: .pw/qclay/scroll-*.png
- Transition shots: .pw/qclay/transition-*.png
- Videos: .pw/qclay/videos/

## 10. Observations that didn't fit above

Free-form notes. Anything interesting — unusual cursor behavior, custom scrollbars, easing curves that felt distinctive, any sound, accessibility notes, etc.
```

---

## RULES

1. Do NOT modify any ArmorIQ project files. This is read-only recon.
2. Do NOT write implementation code. Only observation.
3. Be honest when something is ambiguous. "The fill appears to sweep from left to right but the motion is very fast and could also be a solid swap — videos at .pw/qclay/videos/ctas/ may clarify" is a good answer. Guessing a precise value when uncertain is bad.
4. Include at least one numeric measurement per section (px, ms, count).
5. If a script fails (site blocks automation, network issue, etc.), report the failure in the relevant report section rather than faking data.
6. Keep the total scan under 10 minutes of execution time.

Produce the report. Hand the markdown file path to the user.