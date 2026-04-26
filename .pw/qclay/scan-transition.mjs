import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/transition`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

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
  const pathname = new URL(navHref.href).pathname;
  const clickPromise = page.click(`a[href="${pathname}"]`).catch((e) => console.log('click err:', e.message));
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
  fs.writeFileSync(`${OUT}/transition-meta.json`, JSON.stringify({ navHref, frames }, null, 2));
  console.log('captured transition frames:', frames.length);
}

await ctx.close();
await browser.close();
console.log('done transition scan');
