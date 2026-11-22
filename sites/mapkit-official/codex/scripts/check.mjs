const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
assert.ok(fs.existsSync('site/index.html'), 'Build must create site/index.html');
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const results=[];
for (const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve('site/index.html')); await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:`shots/${name}-first.png`});
 await page.screenshot({path:`shots/${name}-full.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width,'No horizontal overflow');
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(errors.length,0);
 assert.ok(await page.locator('.plate img').evaluate(e=>e.complete && e.naturalWidth>0),'Map image loaded');
 for (const a of await page.locator('a[href]').all()) {
  const href=await a.getAttribute('href');
  if(!href.startsWith('#')&&!href.startsWith('https:'))assert.ok(fs.existsSync(path.join('site',href)), 'Local link exists: '+href);
 }
 await page.locator('.command').click();
 await page.waitForTimeout(400);
 assert.equal(new URL(page.url()).hash,'#start');
 await page.goto('file://'+path.resolve('site/index.html'));
 for(const link of await page.locator('a[href^="#"]').all()){
  const target=await link.getAttribute('href'); assert.equal(await page.locator(target).count(),1);
 }
 results.push({name,width,height,pageHeight:await page.locator('body').evaluate(e=>e.scrollHeight),errors});
 await page.close();
}
await browser.close();
fs.writeFileSync('shots/checks.json',JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));
