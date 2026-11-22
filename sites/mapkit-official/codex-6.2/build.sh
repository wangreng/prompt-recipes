#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

process.chdir(__dirname);
const { renderSpec } = require('./kit');
const fromKit = createRequire(path.resolve('kit/package.json'));
const { createCanvas, loadImage } = fromKit('@napi-rs/canvas');

async function build() {
  const staging = fs.mkdtempSync(path.resolve('.atlas-build-'));
  try {
    for (const name of ['japan', 'japan-pocket']) {
      const plate = renderSpec(path.resolve('specs', name + '.yaml'));
      const temporary = path.join(staging, name + '.png');
      await plate.save(temporary);
      const image = await loadImage(temporary);
      const canvas = createCanvas(image.width, image.height);
      canvas.getContext('2d').drawImage(image, 0, 0);
      fs.writeFileSync(path.join(staging, name + '.webp'), await canvas.encode('webp', 88));
      fs.unlinkSync(temporary);
      console.log(name, plate.diagnostics.summary);
    }
    const prompt = fs.readFileSync('AGENT-PROMPT.md', 'utf8');
    const escapedPrompt = prompt.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const template = fs.readFileSync('src/index.html', 'utf8');
    fs.writeFileSync(path.join(staging, 'index.html'), template.replace('{{AGENT_PROMPT}}', () => escapedPrompt));
    fs.copyFileSync('src/style.css', path.join(staging, 'style.css'));
    // Local-file viewers can block sibling font requests. Embed the same
    // WOFF2 bytes in the stylesheet so the atlas also opens offline.
    const fontRules = fs.readFileSync('src/fonts.css', 'utf8');
    const offlineRules = fontRules.replace(/url\('([^']+\.woff2)'\)/g, (_, file) => {
      const bytes = fs.readFileSync(path.join('src/fonts', file));
      return `url('data:font/woff2;base64,${bytes.toString('base64')}')`;
    });
    fs.writeFileSync(path.join(staging, 'fonts.css'), offlineRules);
    for (const file of fs.readdirSync('src/fonts')) {
      const destination = file === 'LICENSE.txt' ? 'FONT-LICENSE.txt' : file;
      fs.copyFileSync(path.join('src/fonts', file), path.join(staging, destination));
    }
    fs.copyFileSync('kit/SKILL.md', path.join(staging, 'SKILL.md'));
    fs.copyFileSync('specs/japan.yaml', path.join(staging, 'japan.yaml'));
    fs.mkdirSync('site', { recursive: true });
    for (const file of fs.readdirSync(staging)) {
      fs.renameSync(path.join(staging, file), path.join('site', file));
    }
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}
build().catch(error => { console.error(error); process.exitCode = 1; });
