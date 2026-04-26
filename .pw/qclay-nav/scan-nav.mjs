import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay-nav';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(`${OUT}/videos`, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${OUT}/videos`, size: { width: 1440, height: 900 } },
});
const page = await ctx.newPage();

await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForLoadState('load', { timeout: 30000 }).catch(() => {});
await page.waitForTimeout(4500);

// 0. Initial nav state
await page.screenshot({ path: `${OUT}/00-initial.png` });

// Locate the burger trigger
const burger = await page.locator('.burger, .button-burger, button:has-text("menu")').first();
const burgerBox = await burger.boundingBox().catch(() => null);
console.log('burger box:', burgerBox);

// 1. Hover burger
if (burgerBox) {
  await page.mouse.move(burgerBox.x + burgerBox.width / 2, burgerBox.y + burgerBox.height / 2);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/01-burger-hover.png` });
}

// 2. Click and capture frames during open
await burger.click();
const openFrames = [60, 150, 250, 400, 600, 900, 1300, 1800];
for (const ms of openFrames) {
  await page.waitForTimeout(ms === openFrames[0] ? ms : ms - openFrames[openFrames.indexOf(ms) - 1]);
  await page.screenshot({ path: `${OUT}/02-open-${String(ms).padStart(4, '0')}ms.png` });
}

// 3. Open menu — explore styles
const overlayInfo = await page.evaluate(() => {
  const candidates = Array.from(document.querySelectorAll('div, nav, aside, section'))
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return r.width >= window.innerWidth * 0.5 && r.height >= window.innerHeight * 0.5 &&
        cs.position !== 'static' && cs.display !== 'none' && r.top < 100;
    })
    .slice(0, 8);
  return candidates.map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName,
      classes: el.className.toString().slice(0, 200),
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      bg: cs.backgroundColor,
      color: cs.color,
      position: cs.position,
      zIndex: cs.zIndex,
      transform: cs.transform.slice(0, 200),
      backdropFilter: cs.backdropFilter,
    };
  });
});
fs.writeFileSync(`${OUT}/overlay-candidates.json`, JSON.stringify(overlayInfo, null, 2));

// 4. Hover menu items inside the open overlay — qclay rotates / colors them
const menuLinks = await page.locator('a, button').filter({ hasText: /About|What We Do|Our Works|Contact|Menu/i });
const linkCount = Math.min(await menuLinks.count(), 6);
for (let i = 0; i < linkCount; i++) {
  const lk = menuLinks.nth(i);
  const txt = (await lk.innerText().catch(() => '')).slice(0, 24).replace(/\s+/g, '_');
  const box = await lk.boundingBox().catch(() => null);
  if (!box) continue;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(450);
  await page.screenshot({ path: `${OUT}/03-link-${i}-${txt}-hover.png` });
}

// 5. Computed styles of menu links
const linkStyles = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('a, button')).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 60 && r.height > 24 && r.top > 80 && r.top < window.innerHeight - 80 && el.innerText && el.innerText.trim().length > 1 && el.innerText.trim().length < 40;
  });
  return links.slice(0, 14).map((el) => {
    const cs = getComputedStyle(el);
    return {
      text: el.innerText.slice(0, 40),
      tag: el.tagName,
      classes: el.className.toString().slice(0, 200),
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily,
      fontWeight: cs.fontWeight,
      color: cs.color,
      letterSpacing: cs.letterSpacing,
      lineHeight: cs.lineHeight,
      transform: cs.transform.slice(0, 200),
    };
  });
});
fs.writeFileSync(`${OUT}/link-styles.json`, JSON.stringify(linkStyles, null, 2));

// 6. Full open shot
await page.screenshot({ path: `${OUT}/04-open-final.png`, fullPage: false });

// 7. Close
const closeBtn = await page.locator('button:has-text("Close"), button:has-text("close"), .burger, .button-burger').first();
await closeBtn.click().catch(() => {});
const closeFrames = [80, 200, 400, 700];
for (const ms of closeFrames) {
  await page.waitForTimeout(ms === closeFrames[0] ? ms : ms - closeFrames[closeFrames.indexOf(ms) - 1]);
  await page.screenshot({ path: `${OUT}/05-close-${String(ms).padStart(4, '0')}ms.png` });
}

await ctx.close();
await browser.close();
console.log('done qclay-nav scan');
