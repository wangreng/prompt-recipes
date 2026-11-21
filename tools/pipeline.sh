#!/usr/bin/env bash
# Runs on svp inside a herdr pane. One demo end to end:
# reverse prompt -> regenerate -> screenshot (in its Instabox sandbox) -> judge -> refine. 
# usage: tools/pipeline.sh <demo-dir-name> <sandbox> [rounds=3]
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
D="$1"; SB="$2"; R="${3:-3}"
ROOT="$HOME/prompt-recipes"; DIR="$ROOT/demos/$D"; T="$ROOT/tools"
MODEL="${MODEL:-gemini-4-neon-high}"
cd "$DIR"; mkdir -p shots rounds
agy_run(){ echo "▶ agy: $1"; agy --dangerously-skip-permissions --model "$MODEL" -p "$2" 2>&1 | tail -n 15; }
okpng(){ python3 - "$1" <<'P'
import sys,os
p=sys.argv[1]
try: b=open(p,'rb').read(8)
except: sys.exit(1)
sys.exit(0 if os.path.getsize(p)>1024 and (b.startswith(b'\x89PNG') or b[:3]==b'\xff\xd8\xff') else 1)
P
}
shot(){ for i in 1 2; do "$T/sandbox-shot.sh" "$SB" "$1" "$2" && okpng "$2" && return 0; echo "✗ bad screenshot, retry $i"; rm -f "$2"; done; return 1; }

STACK="Target format (same as a Google AI Studio build app): index.html with an importmap pulling packages from https://esm.sh, index.css, and index.tsx (or index.ts) as entry; plain TypeScript/React, no build config, no package.json. The Gemini API key comes from process.env.API_KEY and will be empty in screenshots, so the first screen must render fully without any API call."

[ -f shots/original.png ] && okpng shots/original.png || shot "$DIR/original" "$DIR/shots/original.png" || { echo "original screenshot failed"; exit 1; }

if [ ! -s rounds/prompt.r1.md ]; then
agy_run "reverse prompt" "You are reverse-engineering a Google AI Studio showcase app. Read every file in $DIR/original and look at the screenshot $DIR/shots/original.png. Write the single most likely natural-language prompt a person typed into AI Studio's Build mode to get this app in one shot: product idea, features, layout, visual style (colors, fonts, spacing, components), and behaviour. Write it as the user would, 150-400 words, English. Do NOT paste code or exact CSS values beyond what a designer would say. Save ONLY the prompt text to $DIR/rounds/prompt.r1.md."
fi

for r in $(seq 1 "$R"); do
  P="rounds/prompt.r$r.md"; G="$DIR/rounds/regen-r$r"
  [ -s "$P" ] || { echo "missing $P"; break; }
  if [ ! -f "$G/index.html" ]; then
    mkdir -p "$G"
    agy_run "regen r$r" "Build a web app from scratch in the empty directory $G. Do not read or look at anything outside $G (in particular nothing under $DIR/original, $DIR/shots or other rounds). $STACK

The user's request:
$(cat "$P")"
  fi
  shot "$G" "$DIR/shots/regen-r$r.png" || { echo "regen r$r screenshot failed"; continue; }
  agy_run "judge r$r" "Compare two screenshots of web apps: A=$DIR/shots/original.png (target) and B=$DIR/shots/regen-r$r.png (regeneration). Open and look at both images. Score visual similarity 0-100 (layout 40, color/typography 30, components & content 30). Be strict: same concept but different look should be under 50. Write JSON to $DIR/rounds/score.r$r.json: {\"score\":int,\"layout\":int,\"style\":int,\"components\":int,\"notes\":\"3-6 concrete differences, most important first\"}. Output nothing else into the file."
  cat "rounds/score.r$r.json" 2>/dev/null; echo
  if [ "$r" -lt "$R" ]; then
    agy_run "refine r$r" "Improve a reverse-engineered AI Studio prompt. Current prompt: $DIR/$P. Judge feedback comparing the target screenshot and the regeneration: $DIR/rounds/score.r$r.json. Look at $DIR/shots/original.png and $DIR/shots/regen-r$r.png and the original source in $DIR/original. Rewrite the prompt so a fresh one-shot build gets closer to the target, fixing the listed differences in words a user would plausibly type (no code dumps; keep under 450 words). Save ONLY the new prompt to $DIR/rounds/prompt.r$((r+1)).md."
  fi
done
echo "━━ $D done"
