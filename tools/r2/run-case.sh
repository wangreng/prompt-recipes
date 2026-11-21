#!/usr/bin/env bash
# Round 2: collect -> recipe -> generate from recipe only -> judge. Runs on svp in a herdr pane.
# usage: tools/r2/run-case.sh <case> <url>
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
C="$1"; URL="$2"
ROOT="$HOME/prompt-recipes"; T="$ROOT/tools/r2"; D="$ROOT/sites/$C"
MODEL="${MODEL:-gemini-4-neon-high}"
mkdir -p "$D"/{capture,recipe,gen,shots,scores}
okpng(){ python3 -c "import os,sys;p=sys.argv[1];b=open(p,'rb').read(8);sys.exit(0 if os.path.getsize(p)>1024 and b.startswith(b'\x89PNG') else 1)" "$1" 2>/dev/null; }
agy_in(){ local dir="$1" label="$2" prompt="$3"; echo "▶ agy: $label"; (cd "$dir" && timeout 1800 agy --dangerously-skip-permissions --model "$MODEL" -p "$prompt" 2>&1 | tail -n 6); }

# 01 capture (everything we can get)
[ -s "$D/capture/first.png" ] || (cd "$T" && node capture.mjs "$URL" "$D/capture")
okpng "$D/capture/first.png" || { echo "capture failed"; exit 1; }

# 02 extract recipe (sees the full capture)
X=/tmp/r2/$C/extract; rm -rf "$X"; mkdir -p "$X"; cp -r "$D/capture" "$X/capture"
if [ ! -s "$D/recipe/recipe.md" ]; then
agy_in "$X" "extract recipe" "Only work inside $X. $X/capture holds a full capture of a website: first.png (first screen 1440x900), full.png (whole page), hover.png, mobile.png, dom.html (rendered DOM), text.txt (visible copy), styles.json (computed styles, palette, fonts), assets/ (downloaded images). Look at the images and read the files.

Write a design RECIPE that lets someone who never sees this site build a NEW site for a DIFFERENT product with the same design language and feel. Write intent and rules, not measurements:
- the mood and the one-sentence design idea behind it; who it seems made for
- typography logic (kinds of typefaces by name only if it is a well-known free font; hierarchy, contrast, casing, how text is set), color logic (roles and relationships, e.g. 'one warm accent on near-white, used only for actions'), spacing/density rhythm, grid and layout moves, component vocabulary (buttons, cards, nav, sections), imagery/illustration style, motion and interaction feel, what this site deliberately does NOT do
- page skeleton as a sequence of section TYPES (not this product's content)
HARD RULES: no absolute numbers in px/rem/pt, no hex/rgb/hsl codes, do not quote or paraphrase the site's copy, product name or brand. Relative words are fine (e.g. 'headline about three times body size', 'very generous whitespace').
If something cannot be described in words (a distinctive illustration, texture, icon set, logo-like mark), copy at most 4 such files from capture/assets into $X/recipe-assets/ and say in the recipe how to use them (style reference vs. reusable texture). Skip brand logos.
Save the recipe (English, 400-900 words) to $X/recipe.md. Also write $X/brief-original.md: a neutral brief (in your own words, no copied copy) of what the ORIGINAL page is about and which sections it has, in the same format as a product brief, so the original could be rebuilt from recipe + brief."
cp "$X/recipe.md" "$D/recipe/recipe.md"; cp "$X/brief-original.md" "$D/recipe/brief-original.md" 2>/dev/null; mkdir -p "$D/recipe/assets"; cp -r "$X/recipe-assets/." "$D/recipe/assets/" 2>/dev/null
fi
python3 "$T/leak.py" "$D/recipe/recipe.md" "$D/capture/text.txt" > "$D/scores/leak.json"; cat "$D/scores/leak.json"

# 03 generate from recipe only. A = recipe + original brief (re-creation), B = recipe + transfer brief, C = transfer brief only (control)
STACK="Build a static website: index.html + style.css (+ script.js if needed). No build step, no frameworks requiring a build; Google Fonts and plain JS are fine. Everything must render opened as a local file. To check your work you may screenshot it: node $T/shot.mjs <path-to-index.html> <out-prefix> and look at the PNGs; fix what looks wrong (do at most 2 self-check passes)."
gen(){ local V="$1" brief="$2" withrecipe="$3"; local G=/tmp/r2/$C/gen-$V; [ -f "$D/gen/$V/index.html" ] && return 0
  rm -rf "$G"; mkdir -p "$G/site"; cp "$brief" "$G/brief.md"; [ -d "$T/assets-$C" ] && [ "$V" != A ] && cp -r "$T/assets-$C" "$G/site/assets"
  local R=""; if [ "$withrecipe" = 1 ]; then cp "$D/recipe/recipe.md" "$G/recipe.md"; mkdir -p "$G/site/recipe-assets"; cp -r "$D/recipe/assets/." "$G/site/recipe-assets/" 2>/dev/null; R="Follow the design recipe in $G/recipe.md (design language only; recipe-assets/ are referenced there)."; fi
  agy_in "$G" "gen $V" "Only read and write inside $G. Do not open, list or search anything else on this machine, and do not search the web for any existing site. $R
Build the website described in the product brief $G/brief.md into $G/site/. $STACK"
  mkdir -p "$D/gen/$V"; cp -r "$G/site/." "$D/gen/$V/"; }
gen A "$D/recipe/brief-original.md" 1 &
gen B "$T/brief-$C.md" 1 &
gen C "$T/brief-$C.md" 0 &
wait
for V in A B C; do [ -f "$D/gen/$V/index.html" ] && (cd "$T" && node shot.mjs "$D/gen/$V/index.html" "$D/shots/$V"); done
cp "$D/capture/first.png" "$D/shots/orig-first.png"; cp "$D/capture/full.png" "$D/shots/orig-full.png"
echo "━━ $C generated"; ls "$D/shots"
