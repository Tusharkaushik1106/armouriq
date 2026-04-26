import { chromium } from '@playwright/test';
import fs from 'fs';

fs.mkdirSync('.pw/ours/cta', { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: '.pw/ours/cta', size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3500);

const cta = page.locator('a:has-text("Book a Demo")').first();
await cta.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const box = await cta.boundingBox();
console.log('cta box:', box);

await page.screenshot({ path: '.pw/ours/cta/00-rest.png', clip: box ? { x: Math.max(0, box.x - 100), y: Math.max(0, box.y - 60), width: Math.min(1440, box.width + 200), height: box.height + 120 } : undefined });

if (box) {
  await page.mouse.move(box.x + 20, box.y + box.height / 2);
  await page.waitForTimeout(150);
  await page.screenshot({ path: '.pw/ours/cta/01-enter-150ms.png', clip: { x: Math.max(0, box.x - 100), y: Math.max(0, box.y - 60), width: Math.min(1440, box.width + 200), height: box.height + 120 } });

  for (let i = 20; i <= box.width - 20; i += 10) {
    await page.mouse.move(box.x + i, box.y + box.height / 2);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: '.pw/ours/cta/02-hover-settled.png', clip: { x: Math.max(0, box.x - 100), y: Math.max(0, box.y - 60), width: Math.min(1440, box.width + 200), height: box.height + 120 } });

  await page.mouse.move(100, 100);
  await page.waitForTimeout(200);
  await page.screenshot({ path: '.pw/ours/cta/03-leaving-200ms.png', clip: { x: Math.max(0, box.x - 100), y: Math.max(0, box.y - 60), width: Math.min(1440, box.width + 200), height: box.height + 120 } });
  await page.waitForTimeout(600);
  await page.screenshot({ path: '.pw/ours/cta/04-left-800ms.png', clip: { x: Math.max(0, box.x - 100), y: Math.max(0, box.y - 60), width: Math.min(1440, box.width + 200), height: box.height + 120 } });
}

await ctx.close();
await browser.close();
console.log('done');
