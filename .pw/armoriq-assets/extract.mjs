import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const OUT = '.pw/armoriq-assets';
const PUBLIC_OUT = 'public/armoriq';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(`${PUBLIC_OUT}/images`, { recursive: true });

const PAGES = [
  'https://armoriq.ai/',
  'https://armoriq.ai/about',
  'https://armoriq.ai/products',
  'https://armoriq.ai/platform',
  'https://armoriq.ai/blog',
  'https://armoriq.ai/contact',
];

const downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'user-agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadFile(new URL(res.headers.location, url).toString(), dest).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`status ${res.statusCode} for ${url}`));
          return;
        }
        const f = fs.createWriteStream(dest);
        res.pipe(f);
        f.on('finish', () => f.close(() => resolve(dest)));
        f.on('error', reject);
      })
      .on('error', reject);
  });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const allAssets = new Set();
const pageInfo = [];

for (const url of PAGES) {
  console.log('visiting', url);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('load', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(3000);
    const slug = new URL(url).pathname === '/' ? 'home' : new URL(url).pathname.replace(/\/+/g, '_').replace(/^_/, '');
    await page.screenshot({ path: `${OUT}/page-${slug}.png`, fullPage: true }).catch(() => {});
    const data = await page.evaluate(() => {
      const abs = (u) => new URL(u, location.href).toString();
      const imgs = Array.from(document.querySelectorAll('img'))
        .map((i) => ({
          src: i.currentSrc || i.src,
          alt: i.alt || '',
          w: i.naturalWidth,
          h: i.naturalHeight,
        }))
        .filter((i) => i.src);
      const svgs = Array.from(document.querySelectorAll('svg'))
        .filter((s) => s.getBoundingClientRect().width > 16)
        .map((s, i) => ({
          idx: i,
          outer: s.outerHTML.slice(0, 4000),
          aria: s.getAttribute('aria-label') || '',
          role: s.getAttribute('role') || '',
          rect: (() => {
            const r = s.getBoundingClientRect();
            return { w: r.width, h: r.height, x: r.x, y: r.y };
          })(),
        }));
      const bgImages = Array.from(document.querySelectorAll('*'))
        .map((el) => {
          const cs = getComputedStyle(el);
          const bg = cs.backgroundImage;
          if (!bg || bg === 'none') return null;
          const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (!m) return null;
          return abs(m[1]);
        })
        .filter(Boolean);
      const heroH1 = document.querySelector('h1')?.innerText?.slice(0, 200) ?? '';
      return { imgs, svgs, bgImages: Array.from(new Set(bgImages)), heroH1, title: document.title };
    });
    pageInfo.push({ url, ...data });
    data.imgs.forEach((i) => allAssets.add(i.src));
    data.bgImages.forEach((u) => allAssets.add(u));
    fs.writeFileSync(`${OUT}/svgs-${slug}.json`, JSON.stringify(data.svgs, null, 2));
  } catch (e) {
    console.warn('failed', url, e.message);
  }
}

fs.writeFileSync(`${OUT}/pages.json`, JSON.stringify(pageInfo, null, 2));

// Download every unique image asset
let i = 0;
for (const u of allAssets) {
  i += 1;
  try {
    const parsed = new URL(u);
    const ext = (path.extname(parsed.pathname) || '.bin').split('?')[0];
    if (!['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'].includes(ext.toLowerCase())) continue;
    const base = path.basename(parsed.pathname).replace(/[^a-z0-9._-]/gi, '_').slice(0, 80) || `asset-${i}${ext}`;
    const dest = `${PUBLIC_OUT}/images/${base}`;
    if (fs.existsSync(dest)) continue;
    await downloadFile(u, dest);
    console.log('saved', base);
  } catch (e) {
    console.warn('skip', u, e.message);
  }
}

await ctx.close();
await browser.close();
console.log('done — assets in', PUBLIC_OUT);
