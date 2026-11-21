// Rasterize the live site's inline SVG illustrations into PNG style references.
// usage: node refs.mjs <url> <outdir> [max=12]
import { chromium } from 'playwright-core'; import fs from 'fs';
const [url, out, max = '12'] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{}); await p.waitForTimeout(3000);
const els = await p.$$('svg'); let n = 0;
for (const e of els) { if (n >= +max) break; const bb = await e.boundingBox(); if (!bb || bb.width < 50 || bb.height < 50 || bb.y > 900) continue;
  await e.screenshot({ path: `${out}/ref${String(++n).padStart(2,'0')}.png`, omitBackground: true }).catch(()=>{}); }
await b.close(); console.log('refs', n);
