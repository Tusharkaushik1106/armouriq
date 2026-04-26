import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/ctas`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

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

for (const cta of ctas) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, cta.id);
  await page.waitForTimeout(800);

  const box = await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, cta.id);
  if (!box) continue;

  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-a-rest.png`,
    clip: { x: Math.max(0, box.x - 250), y: Math.max(0, box.y - 80), width: 500, height: 160 },
  });

  await page.mouse.move(box.x, box.y);
  await page.waitForTimeout(120);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-b-hover-120ms.png`,
    clip: { x: Math.max(0, box.x - 250), y: Math.max(0, box.y - 80), width: 500, height: 160 },
  });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-c-hover-500ms.png`,
    clip: { x: Math.max(0, box.x - 250), y: Math.max(0, box.y - 80), width: 500, height: 160 },
  });

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

  await page.mouse.move(50, 50);
  await page.waitForTimeout(600);
  await page.screenshot({
    path: `${OUT}/cta-${cta.id}-d-leave.png`,
    clip: { x: Math.max(0, box.x - 250), y: Math.max(0, box.y - 80), width: 500, height: 160 },
  });
}

const firstNavCta = ctas.find((c) => /work|view|about|contact|case/i.test(c.text)) || ctas[0];
if (firstNavCta) {
  await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (el) el.scrollIntoView({ block: 'center' });
  }, firstNavCta.id);
  await page.waitForTimeout(500);

  const box = await page.evaluate((id) => {
    const el = document.querySelector(`[data-cta-id="${id}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  }, firstNavCta.id);

  const startTime = Date.now();
  const clickTimes = [];
  const captureAt = async (ms, label) => {
    const diff = ms - (Date.now() - startTime);
    if (diff > 0) await page.waitForTimeout(diff);
    clickTimes.push({ ms: Date.now() - startTime, label });
    try { await page.screenshot({ path: `${OUT}/click-${String(ms).padStart(4, '0')}ms.png` }); } catch {}
  };

  if (box) page.mouse.click(box.x, box.y).catch(() => {});
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
