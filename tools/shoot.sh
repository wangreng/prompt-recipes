#!/usr/bin/env bash
# Runs INSIDE an Instabox sandbox. Builds an AI Studio-style app (index.html + importmap + index.ts/tsx)
# with esbuild (local code bundled, bare imports left to the importmap), serves it, and screenshots it
# with headless Chromium.
# usage: shoot.sh <app-dir> <out.png> [port] [width] [height]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$1"; OUT="$2"; PORT="${3:-8000}"; W="${4:-1440}"; H="${5:-900}"
BUILD="$(mktemp -d)"
cp -r "$APP"/. "$BUILD"/
cd "$BUILD"
ENTRY=""
for f in index.tsx index.ts main.tsx main.ts; do [ -f "$f" ] && ENTRY="$f" && break; done
if [ -n "$ENTRY" ]; then
  echo "▶ esbuild $ENTRY"
  npx -y esbuild@0.24.0 "$ENTRY" --bundle --format=esm --packages=external --jsx=automatic \
    --loader:.js=jsx --loader:.jsx=jsx --define:process.env.API_KEY='"screenshot-dummy-key"' --define:process.env.GEMINI_API_KEY='"screenshot-dummy-key"' \
    --outfile=__app.js --log-level=warning
  # importmaps that only map bare "react" break the automatic JSX runtime import; add it
  python3 - <<'PY'
import re
h=open('index.html').read()
m=re.search(r'"react"\s*:\s*"([^"]+)"',h)
if m and '"react/"' not in h and 'react/jsx-runtime' not in h:
    h=h.replace(m.group(0),m.group(0)+',\n      "react/jsx-runtime": "'+m.group(1).rstrip('/')+'/jsx-runtime"',1)
    open('index.html','w').write(h)
PY
  # point the html at the built bundle
  sed -i -E "s#src=\"(\./|/)?${ENTRY}\"#src=\"./__app.js\"#g" index.html
  grep -q '__app.js' index.html || echo '<script type="module" src="./__app.js"></script>' >> index.html
fi
# AI Studio injects the stylesheet itself; add it when the html doesn't link it
if [ -f index.css ] && ! grep -q 'index.css' index.html; then sed -i '1i <link rel="stylesheet" href="./index.css">' index.html; fi
echo "▶ serve :$PORT"
python3 -m http.server "$PORT" >/tmp/serve-$PORT.log 2>&1 &
SP=$!
sleep 1
echo "▶ chromium screenshot ${W}x${H}"
( cd "$HERE" && [ -d node_modules/playwright-core ] || npm i -s playwright-core@1.49 >/dev/null 2>&1 ); node "$HERE/snap.mjs" "http://127.0.0.1:$PORT/" "$OUT" "$W" "$H" || true
kill $SP 2>/dev/null || true
ls -la "$OUT"
