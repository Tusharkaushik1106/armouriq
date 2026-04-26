import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos/wheel`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

// Site uses virtual scroll — body height is viewport height. Use wheel events.
await page.screenshot({ path: `${OUT}/wheel-00-initial.png` });

const frames = [];
const totalWheels = 40;
for (let i = 1; i <= totalWheels; i++) {
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(900);
  const shot = `${OUT}/wheel-${String(i).padStart(2, '0')}.png`;
  await page.screenshot({ path: shot });
  const info = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section, [class*="section"], [class*="slide"]'));
    const visibleText = document.body.innerText.slice(0, 300).replace(/\s+/g, ' ');
    return {
      scrollY: window.scrollY,
      bodyHeight: document.body.scrollHeight,
      innerHeight: window.innerHeight,
      visibleText,
    };
  });
  frames.push({ i, ...info });
}

fs.writeFileSync(`${OUT}/wheel-frames.json`, JSON.stringify(frames, null, 2));

await ctx.close();
await browser.close();
console.log('done wheel scan');
