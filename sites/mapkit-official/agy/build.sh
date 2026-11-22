#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_DIR="${ROOT_DIR}/kit"
SPECS_DIR="${ROOT_DIR}/specs"
SRC_DIR="${ROOT_DIR}/src"
SITE_DIR="${ROOT_DIR}/site"
TMP_DIR="$(mktemp -d "${ROOT_DIR}/.build-tmp.XXXXXX")"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

mkdir -p "${SITE_DIR}/images" "${SITE_DIR}/fonts"

echo "==> Copying bundled Kevin Serif / Kevin Sans web fonts (read-only from ./kit)"
cp "${KIT_DIR}/engine/fonts/KevinSerif-Regular.woff2" "${SITE_DIR}/fonts/"
cp "${KIT_DIR}/engine/fonts/KevinSans-Regular.woff2"  "${SITE_DIR}/fonts/"
cp "${KIT_DIR}/engine/fonts/KevinSans-Bold.woff2"     "${SITE_DIR}/fonts/"

echo "==> Validating & rendering desktop archipelago map (specs/site-desktop.yaml)"
(
  cd "${KIT_DIR}"
  npx --no-install handdrawn-map render "${SPECS_DIR}/site-desktop.yaml" \
    -o "${TMP_DIR}/atlas-desktop.png" \
    --diagnostics "${TMP_DIR}/desktop.diag.json"
)

echo "==> Validating & rendering mobile portrait map (specs/site-mobile.yaml)"
(
  cd "${KIT_DIR}"
  npx --no-install handdrawn-map render "${SPECS_DIR}/site-mobile.yaml" \
    -o "${TMP_DIR}/atlas-mobile.png" \
    --diagnostics "${TMP_DIR}/mobile.diag.json"
)

echo "==> Rendering 4 visual style preset plates (examples/specs/italy.yaml)"
for preset in vintage-atlas blueprint nocturne ink-wash; do
  (
    cd "${KIT_DIR}"
    npx --no-install handdrawn-map render examples/specs/italy.yaml \
      --style "${preset}" \
      --fast \
      --auto-layout \
      -o "${TMP_DIR}/preset-${preset}.png"
  )
done

echo "==> Encoding renders to WebP via kit's @napi-rs/canvas (Node + kit only)"
node - "${KIT_DIR}" "${TMP_DIR}" "${SITE_DIR}/images" <<'EOF'
const fs = require('node:fs');
const path = require('node:path');

const [kitDir, tmpDir, outDir] = process.argv.slice(2);
const { createCanvas, loadImage } = require(path.join(kitDir, 'node_modules', '@napi-rs', 'canvas'));

const bases = [
  'atlas-desktop',
  'atlas-mobile',
  'preset-vintage-atlas',
  'preset-blueprint',
  'preset-nocturne',
  'preset-ink-wash',
];

(async () => {
  for (const base of bases) {
    const img = await loadImage(path.join(tmpDir, `${base}.png`));
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const buf = await canvas.encode('webp', 90);
    fs.writeFileSync(path.join(outDir, `${base}.webp`), buf);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
EOF

echo "==> Writing static site files (index.html, styles.css, app.js)"
cp "${SRC_DIR}/index.html" "${SITE_DIR}/index.html"
cp "${SRC_DIR}/styles.css" "${SITE_DIR}/styles.css"
cp "${SRC_DIR}/app.js"     "${SITE_DIR}/app.js"

echo "==> Build complete:"
du -ch "${SITE_DIR}/images"/*.webp | tail -n 1
ls -lh "${SITE_DIR}/images"
