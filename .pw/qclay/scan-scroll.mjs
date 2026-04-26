import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/scroll`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

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
