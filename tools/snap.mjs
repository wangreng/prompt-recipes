// Screenshot with Playwright-core driving the system Chromium; waits for network idle + 2s,
// and prints page console errors so a blank render is diagnosable.
import { chromium } from 'playwright-core';
const [url, out, w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('console', m => { if (m.type() === 'error') console.log('  console.error:', m.text().slice(0, 200)); });
p.on('pageerror', e => console.log('  pageerror:', String(e).slice(0, 200)));
await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log('  goto:', e.message));
await p.waitForTimeout(2500);
await p.screenshot({ path: out });
await b.close();
