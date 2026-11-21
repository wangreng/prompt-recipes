#!/usr/bin/env bash
# Blind mode: the generator sees ONLY the original screenshot (no source).
# Codex judges with source + both screenshots (fidelity incl. likely behaviour) and its notes drive refinement.
# usage: tools/blind.sh <demo> <sandbox> [rounds=3]
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
D="$1"; SB="$2"; R="${3:-3}"
ROOT="$HOME/prompt-recipes"; SRC="$ROOT/demos/$D"; OUT="$ROOT/blind/$D"; T="$ROOT/tools"
MODEL="${MODEL:-gemini-4-neon-high}"
# the generator works in an isolated dir holding only the screenshot (+ later its own regen shots and feedback)
W="/tmp/blind-work/$D"; mkdir -p "$W" "$OUT/rounds" "$OUT/shots"
cp "$SRC/shots/original.png" "$W/target.png"; cp "$SRC/shots/original.png" "$OUT/shots/original.png"
okpng(){ python3 -c "import os,sys;p=sys.argv[1];b=open(p,'rb').read(8);sys.exit(0 if os.path.getsize(p)>1024 and (b.startswith(b'\x89PNG') or b[:3]==b'\xff\xd8\xff') else 1)" "$1" 2>/dev/null; }
shot(){ for i in 1 2; do "$T/sandbox-shot.sh" "$SB" "$1" "$2" && okpng "$2" && return 0; rm -f "$2"; done; return 1; }
agy_run(){ echo "▶ agy: $1"; (cd "$W" && agy --dangerously-skip-permissions --model "$MODEL" -p "$2" 2>&1 | tail -n 8); }
RULE="You may ONLY look at files inside $W. Do not open, list or search anything else on this machine (no other directories, no git history, no web search for the app's source)."
STACK="Target format (same as a Google AI Studio build app): index.html with an importmap pulling packages from https://esm.sh, index.css, and index.tsx (or index.ts) as entry; no package.json. Any Gemini API key comes from process.env.API_KEY and is empty in screenshots, so the first screen must render fully without any API call."

[ -s "$OUT/rounds/prompt.r1.md" ] || { agy_run "blind reverse" "$RULE
$W/target.png is a screenshot (1440x900) of an app built in Google AI Studio's Build mode. Look at it carefully and infer what the app does from its visible UI. Write the single most likely natural-language prompt a person typed into AI Studio to get this app in one shot: purpose, features and behaviour you can reasonably infer, layout, visual style. Write it as a user would, English, 150-400 words. Save ONLY the prompt to $W/prompt.r1.md."; cp "$W/prompt.r1.md" "$OUT/rounds/prompt.r1.md"; }

for r in $(seq 1 "$R"); do
  P="$OUT/rounds/prompt.r$r.md"; G="$OUT/rounds/regen-r$r"
  [ -s "$P" ] || { echo "missing $P"; break; }
  if [ ! -f "$G/index.html" ]; then
    mkdir -p "$G"
    echo "▶ agy: regen r$r"; (cd "$G" && agy --dangerously-skip-permissions --model "$MODEL" -p "Build a web app from scratch in the empty directory $G. Only work inside $G; do not read anything else. $STACK

The user's request:
$(cat "$P")" 2>&1 | tail -n 5)
  fi
  shot "$G" "$OUT/shots/regen-r$r.png" || { echo "screenshot failed r$r"; continue; }
  python3 "$T/metrics.py" "$OUT/shots/original.png" "$OUT/shots/regen-r$r.png" > "$OUT/rounds/metrics.r$r.json"; cat "$OUT/rounds/metrics.r$r.json"
  echo "▶ codex judge r$r"
  for i in 1 2 3; do
    (cd "$ROOT" && codex exec --skip-git-repo-check -s read-only -o "/tmp/bj-$D-$r.txt" "You are an independent fidelity judge. Image 1 = target app screenshot, image 2 = an app regenerated from a prompt (same 1440x900 viewport). The target's full source code is in $SRC/original (read it); the regenerated app's code is in $G (read it). Score fidelity 0-100 = visual layout (0-30) + color/typography (0-20) + components & copy (0-20) + behaviour (0-30: does the regenerated code implement the same features, interactions, states and Gemini calls as the target source?). Be strict. Reply with ONLY one line of JSON: {\"score\":int,\"layout\":int,\"style\":int,\"components\":int,\"behavior\":int,\"notes\":\"4-8 concrete differences, most important first, described in plain words as visible or behavioural differences a user would notice. NEVER quote code, identifiers, CSS values, file names or exact strings from the source.\"}" -i "$OUT/shots/original.png" -i "$OUT/shots/regen-r$r.png" > "/tmp/bj-$D-$r.log" 2>&1)
    python3 -c "import json,re;t=open('/tmp/bj-$D-$r.txt').read();j=json.loads(re.search(r'\{.*\}',t,re.S).group(0));json.dump(j,open('$OUT/rounds/score-codex.r$r.json','w'),ensure_ascii=False,indent=1);print('codex',j['score'])" && break
    echo "✗ empty codex reply, retry $i"
  done
  if [ "$r" -lt "$R" ] && [ -s "$OUT/rounds/score-codex.r$r.json" ]; then
    cp "$OUT/shots/regen-r$r.png" "$W/regen-r$r.png"; cp "$P" "$W/prompt.r$r.md"
    python3 -c "import json;print(json.load(open('$OUT/rounds/score-codex.r$r.json'))['notes'])" > "$W/feedback.r$r.txt"
    agy_run "refine r$r" "$RULE
Improve an AI Studio prompt. Target screenshot: $W/target.png. Current prompt: $W/prompt.r$r.md. What it produced: $W/regen-r$r.png. A reviewer who knows the real app listed the differences (visual and behavioural) in $W/feedback.r$r.txt. Rewrite the prompt so a fresh one-shot build gets closer, in words a user would plausibly type (no code; under 450 words). Save ONLY the new prompt to $W/prompt.r$((r+1)).md."
    cp "$W/prompt.r$((r+1)).md" "$OUT/rounds/prompt.r$((r+1)).md"
  fi
done
echo "━━ blind $D done"
