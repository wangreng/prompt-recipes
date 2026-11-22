#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p site/assets site/specs .build
for plate in desktop mobile; do
  (cd kit && npx --no-install handdrawn-map render "../specs/$plate.yaml" -o "../.build/$plate.png" --diagnostics "../site/specs/$plate.diagnostics.json")
done
node scripts/package.cjs
printf 'Built site/index.html (open directly in your browser).\n'
