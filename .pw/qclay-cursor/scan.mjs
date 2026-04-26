import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay-cursor';
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(4500);

// Move mouse to hover over body (no CTA) and inspect cursor candidates
await page.mouse.move(400, 400);
await page.waitForTimeout(800);

const findCursors = async (where) => page.evaluate(() => {
  const candidates = Array.from(document.querySelectorAll('*'))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // Cursor likely: small (≤80px), fixed/absolute position, very high z-index, pointer-events none
      return (
        (cs.position === 'fixed' || cs.position === 'absolute') &&
        r.width > 0 && r.width < 120 &&
        r.height > 0 && r.height < 120 &&
        (cs.pointerEvents === 'none' || parseInt(cs.zIndex || '0') > 100)
      );
    })
    .slice(0, 30);
  return candidates.map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      classes: el.className.toString().slice(0, 200),
      id: el.id,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      bg: cs.backgroundColor,
      border: cs.border,
      borderRadius: cs.borderRadius,
      mix: cs.mixBlendMode,
      filter: cs.filter,
      transform: cs.transform.slice(0, 200),
      transition: cs.transition,
      zIndex: cs.zIndex,
      opacity: cs.opacity,
      width: cs.width,
      height: cs.height,
      outerHTML: el.outerHTML.slice(0, 400),
    };
  });
});

const restingCursor = await findCursors('rest');
fs.writeFileSync(`${OUT}/cursor-rest.json`, JSON.stringify(restingCursor, null, 2));
await page.screenshot({ path: `${OUT}/00-rest-x400y400.png` });

// Move to a CTA and capture again
const cta = await page.locator('button, a').filter({ hasText: /Capabilities|Book a call|Let's Talk/ }).first();
const box = await cta.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(900);
  const overCta = await findCursors('cta');
  fs.writeFileSync(`${OUT}/cursor-over-cta.json`, JSON.stringify(overCta, null, 2));
  await page.screenshot({ path: `${OUT}/01-over-cta.png` });
}

// Capture html.cursor and body cursor styles
const docStyle = await page.evaluate(() => {
  const html = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  return {
    htmlCursor: html.cursor,
    bodyCursor: body.cursor,
    bodyClass: document.body.className,
    htmlClass: document.documentElement.className,
  };
});
fs.writeFileSync(`${OUT}/doc-style.json`, JSON.stringify(docStyle, null, 2));

await ctx.close();
await browser.close();
console.log('done');
