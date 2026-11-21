// Full capture of a live site: screenshots (first screen, full page, mobile), rendered DOM, text, computed style summary, assets.
// usage: node capture.mjs <url> <outdir>
import { chromium } from 'playwright-core';
import fs from 'fs'; import path from 'path';
const [url, out] = process.argv.slice(2);
fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto:', e.message));
await p.waitForTimeout(3000);
await p.screenshot({ path: path.join(out, 'first.png') });
// scroll through to trigger lazy/reveal animations
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(250); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1500);
await p.screenshot({ path: path.join(out, 'full.png'), fullPage: true });
fs.writeFileSync(path.join(out, 'dom.html'), await p.content());
fs.writeFileSync(path.join(out, 'text.txt'), await p.evaluate(() => document.body.innerText));
const info = await p.evaluate(() => {
  const pick = ['h1','h2','h3','p','a','button','nav','header','footer','section','li','input'];
  const st = {};
  for (const t of pick) { const el = document.querySelector(t); if (!el) continue; const c = getComputedStyle(el);
    st[t] = { font: c.fontFamily, size: c.fontSize, weight: c.fontWeight, lh: c.lineHeight, ls: c.letterSpacing, color: c.color, bg: c.backgroundColor, radius: c.borderRadius, border: c.border, shadow: c.boxShadow, transform: c.textTransform }; }
  const colors = {}, fonts = {};
  for (const el of document.querySelectorAll('body *')) { const c = getComputedStyle(el);
    if (el.offsetWidth * el.offsetHeight < 4) continue;
    for (const v of [c.color, c.backgroundColor, c.borderTopColor]) if (v && v !== 'rgba(0, 0, 0, 0)') colors[v] = (colors[v] || 0) + 1;
    fonts[c.fontFamily] = (fonts[c.fontFamily] || 0) + 1; }
  const imgs = [...document.images].map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt }));
  const bgs = [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).filter(v => v && v.startsWith('url'));
  const anims = [...document.querySelectorAll('*')].filter(e => { const c = getComputedStyle(e); return c.animationName !== 'none' || (c.transitionDuration && c.transitionDuration !== '0s'); }).length;
  return { styles: st, colors: Object.entries(colors).sort((a,b)=>b[1]-a[1]).slice(0,25), fonts: Object.entries(fonts).sort((a,b)=>b[1]-a[1]).slice(0,8), images: imgs, bgImages: [...new Set(bgs)].slice(0,20), svgCount: document.querySelectorAll('svg').length, canvas: document.querySelectorAll('canvas').length, video: document.querySelectorAll('video').length, animatedEls: anims, height: document.documentElement.scrollHeight, title: document.title };
});
fs.writeFileSync(path.join(out, 'styles.json'), JSON.stringify(info, null, 1));
// first interactive state: hover the first CTA-like element
const cta = await p.$('header a, nav a, a[class*=btn], button, a[href]');
if (cta) { await cta.hover().catch(()=>{}); await p.waitForTimeout(600); await p.screenshot({ path: path.join(out, 'hover.png') }); }
// save assets
let n = 0;
for (const im of info.images.concat(info.bgImages.map(u => ({ src: u.replace(/^url\("?|"?\)$/g, '') })))) {
  if (n >= 25 || !im.src || im.src.startsWith('data:')) continue;
  try { const r = await fetch(im.src, { signal: AbortSignal.timeout(15000) }); if (!r.ok) continue; const buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 3e6 || buf.length < 200) continue;
    const ext = (im.src.split('?')[0].match(/\.(png|jpe?g|svg|webp|gif|avif)$/i) || ['', 'bin'])[1];
    fs.writeFileSync(path.join(out, 'assets', `a${String(++n).padStart(2,'0')}.${ext}`), buf); } catch {}
}
const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
const mp = await m.newPage(); await mp.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{}); await mp.waitForTimeout(2500);
await mp.screenshot({ path: path.join(out, 'mobile.png') });
await b.close(); console.log('captured', url, 'height', info.height, 'assets', n);
