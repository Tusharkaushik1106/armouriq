import { chromium } from '@playwright/test';
import fs from 'fs';

const OUT = '.pw/qclay';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const requests = [];
page.on('request', (req) => requests.push({ url: req.url(), type: req.resourceType() }));
await page.goto('https://qclay.design/', { waitUntil: 'domcontentloaded', timeout: 60000 });
try { await page.waitForLoadState('networkidle', { timeout: 20000 }); } catch {}
await page.waitForTimeout(4000);

const scripts = requests.filter((r) => r.type === 'script').map((r) => r.url);
const styles = requests.filter((r) => r.type === 'stylesheet').map((r) => r.url);
const fonts = requests.filter((r) => r.type === 'font').map((r) => r.url);
const images = requests.filter((r) => r.type === 'image').map((r) => r.url).slice(0, 30);

fs.writeFileSync(`${OUT}/stack.json`, JSON.stringify({ scripts, styles, fonts, images }, null, 2));

const libs = await page.evaluate(() => ({
  gsap: typeof window.gsap !== 'undefined',
  ScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
  lenis: typeof window.Lenis !== 'undefined' || typeof window.lenis !== 'undefined',
  barba: typeof window.barba !== 'undefined',
  three: typeof window.THREE !== 'undefined',
  splitType: typeof window.SplitType !== 'undefined',
  next: typeof window.next !== 'undefined' || typeof window.__NEXT_DATA__ !== 'undefined',
  nuxt: typeof window.$nuxt !== 'undefined' || typeof window.__NUXT__ !== 'undefined',
}));
fs.writeFileSync(`${OUT}/libs-detected.json`, JSON.stringify(libs, null, 2));

await ctx.close();
await browser.close();
console.log('done stack scan');
