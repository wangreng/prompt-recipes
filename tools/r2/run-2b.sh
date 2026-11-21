#!/usr/bin/env bash
# Round 2b (trazo): add an image step. raw = original art as reference/assets; gen = new in-style images made by Codex image_gen from the refs.
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
C=trazo; ROOT="$HOME/prompt-recipes"; T="$ROOT/tools/r2"; D="$ROOT/sites/$C"; E="$D/r2b"
MODEL="${MODEL:-gemini-4-neon-high}"
mkdir -p "$E"/{refs,img-A,img-B,gen,shots,scores}
cp "$D/capture/refs/"ref{01,04,08,12}.png "$E/refs/"
alpha(){ python3 - "$1" <<'P'
import sys,glob
from PIL import Image
for f in glob.glob(sys.argv[1]+'/*.png'):
    im=Image.open(f).convert('RGBA'); px=im.load(); w,h=im.size
    from collections import deque
    q=deque([(0,0),(w-1,0),(0,h-1),(w-1,h-1)]); seen=set(q)
    while q:
        x,y=q.popleft(); r,g,b,a=px[x,y]
        if min(r,g,b)<232: continue
        px[x,y]=(r,g,b,0)
        for nx,ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0<=nx<w and 0<=ny<h and (nx,ny) not in seen: seen.add((nx,ny)); q.append((nx,ny))
    im.thumbnail((512,512)); im.save(f)
P
}
imgs(){ local set="$1" list="$2"; [ "$(ls "$E/img-$set" | wc -l)" -ge 6 ] && return
  (cd "$E/img-$set" && codex exec --skip-git-repo-check --dangerously-bypass-approvals-and-sandbox "Using your image generation tool, create 8 separate sticker images, one subject each: $list. Every image must match the chunky wax-crayon sticker style of the reference images exactly (thick soft crayon outline, flat pastel fills with crayon grain, small highlights, cute and simple), single subject centered on a plain white background, no text. Save them as PNG files in $(pwd) named s01.png ... s08.png. Reply DONE." -i "$E/refs/ref01.png" -i "$E/refs/ref04.png" -i "$E/refs/ref08.png" -i "$E/refs/ref12.png" 2>&1 | tail -3)
  alpha "$E/img-$set"; }
imgs A "a clownfish, a whale, a coral branch, a sea urchin, an anchor, a seagull, a lighthouse, a little boat" &
imgs B "a compass rose, a giant panda, a pagoda, a plate of dumplings, a snowy mountain peak, a sailing junk boat, a red paper lantern, a rolled paper map" &
wait; ls "$E"/img-A "$E"/img-B
agy_in(){ local dir="$1" label="$2" prompt="$3"; echo "▶ agy: $label"; (cd "$dir" && timeout 1800 agy --dangerously-skip-permissions --model "$MODEL" -p "$prompt" 2>&1 | tail -n 4); }
STACK="Build a static website: index.html + style.css (+ script.js if needed). No build step; Google Fonts and plain JS are fine. Everything must render opened as a local file. To check your work you may screenshot it: node $T/shot.mjs <path-to-index.html> <out-prefix> and look at the PNGs; fix what looks wrong (at most 2 self-check passes)."
gen(){ local V="$1" brief="$2" imgdir="$3" how="$4"; local G=/tmp/r2b/gen-$V; [ -f "$E/gen/$V/index.html" ] && return 0
  rm -rf "$G"; mkdir -p "$G/site/art"; cp "$brief" "$G/brief.md"; cp "$D/recipe/recipe.md" "$G/recipe.md"; cp "$imgdir"/*.png "$G/site/art/"
  [[ "$V" == B* ]] && cp -r "$T/assets-$C" "$G/site/assets"
  agy_in "$G" "gen $V" "Only read and write inside $G. Do not open, list or search anything else on this machine, and do not search the web for any existing site. Follow the design recipe in $G/recipe.md (design language). $how Build the website described in the product brief $G/brief.md into $G/site/. $STACK"
  mkdir -p "$E/gen/$V"; cp -r "$G/site/." "$E/gen/$V/"; }
gen A-raw "$D/recipe/brief-original.md" "$E/refs" "site/art/ holds illustration images in the target style; use them as the page's illustrations as the recipe describes." &
gen A-gen "$D/recipe/brief-original.md" "$E/img-A" "site/art/ holds illustration images made in the target style; use them as the page's illustrations as the recipe describes." &
gen B-raw "$T/brief-$C.md" "$E/refs" "site/art/ holds sticker illustrations that define the visual style (they are sea creatures, not this product's subject); use them sparingly as decoration as the recipe describes." &
gen B-gen "$T/brief-$C.md" "$E/img-B" "site/art/ holds sticker illustrations made in the target style for this product; use them as the page's illustrations as the recipe describes." &
wait
for V in A-raw A-gen B-raw B-gen; do [ -f "$E/gen/$V/index.html" ] && (cd "$T" && node shot.mjs "$E/gen/$V/index.html" "$E/shots/$V"); done
cp "$D/shots/"{orig-first,orig-full,C-first,C-full,B-first,B-full,A-first,A-full}.png "$E/shots/" 2>/dev/null
for f in A B C; do for k in first full; do [ -f "$E/shots/$f-$k.png" ] && mv "$E/shots/$f-$k.png" "$E/shots/r2$f-$k.png"; done; done
echo "━━ 2b generated"; ls "$E/shots"
