// usage: node shot.mjs <url-or-file> <out-prefix>   -> <prefix>-first.png, <prefix>-full.png
import { chromium } from 'playwright-core';
let [u, out] = process.argv.slice(2); if (!/^https?:|^file:/.test(u)) u = 'file://' + u;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox','--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => console.log('pageerror:', String(e).slice(0, 200)));
await p.goto(u, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('goto:', e.message));
await p.waitForTimeout(2500);
await p.screenshot({ path: out + '-first.png' });
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 600) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(200); }
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1200);
await p.screenshot({ path: out + '-full.png', fullPage: true });
await b.close();
