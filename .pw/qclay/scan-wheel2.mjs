import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/wheel2`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

await page.mouse.move(720, 450);
await page.waitForTimeout(200);

await page.screenshot({ path: `${OUT}/w2-00.png` });

for (let i = 1; i <= 25; i++) {
  // Use keyboard for reliable advance
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${OUT}/w2-${String(i).padStart(2, '0')}.png` });
}

// Get all heading texts in DOM order
const headings = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('h1, h2, h3')).map((el, i) => ({
    i, tag: el.tagName,
    text: (el.innerText || '').slice(0, 120).replace(/\s+/g, ' '),
  }));
});
fs.writeFileSync(`${OUT}/headings.json`, JSON.stringify(headings, null, 2));

await ctx.close();
await browser.close();
console.log('done w2 scan');
