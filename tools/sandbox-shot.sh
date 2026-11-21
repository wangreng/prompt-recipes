#!/usr/bin/env bash
# Runs on svp. Ships an app dir into an Instabox sandbox, screenshots it there, pulls the PNG back.
# usage: sandbox-shot.sh <sandbox> <local-app-dir> <local-out.png>
set -euo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
SB="$1"; SRC="$2"; OUT="$3"
TOOLS="$(cd "$(dirname "$0")" && pwd)"
TAG="$(basename "$(dirname "$SRC")")-$(basename "$SRC")-$RANDOM"
echo "━━ $SB ← $SRC"
tar -C "$SRC" -czf - . | instabox exec "$SB" --stdin -- "mkdir -p ~/work/$TAG && tar -xzf - -C ~/work/$TAG"
tar -C "$TOOLS" -czf - shoot.sh snap.mjs | instabox exec "$SB" --stdin -- "mkdir -p ~/tools && tar -xzf - -C ~/tools && chmod +x ~/tools/shoot.sh"
instabox exec "$SB" --stream --timeout 300 -- "~/tools/shoot.sh ~/work/$TAG ~/work/$TAG.png"
mkdir -p "$(dirname "$OUT")"
instabox exec "$SB" -- "base64 -w0 ~/work/$TAG.png" | base64 -d > "$OUT"
echo "━━ saved $OUT ($(stat -c %s "$OUT") bytes)"
