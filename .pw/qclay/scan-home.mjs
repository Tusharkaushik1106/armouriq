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

await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

await page.screenshot({ path: `${OUT}/home-00-initial.png` });

const height = await page.evaluate(() => document.body.scrollHeight);
console.log('page height:', height);

for (let i = 1; i <= 10; i++) {
  const y = Math.round((height / 10) * i);
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/home-${String(i).padStart(2, '0')}-scroll-${y}px.png` });
}

await page.evaluate(() => window.scrollTo({ top: 0 }));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/home-full.png`, fullPage: true });

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
