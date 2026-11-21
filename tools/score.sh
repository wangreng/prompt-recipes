#!/usr/bin/env bash
# Runs on svp in herdr pane judge-codex. Independent judge (Codex/GPT) + objective metrics for every finished round.
# usage: tools/score.sh [demo...]
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
ROOT="$HOME/prompt-recipes"; cd "$ROOT/demos"
DEMOS="${*:-gemini_95 flashcard_maker gemini_co_drawing}"
for D in $DEMOS; do
  for S in $D/shots/regen-r*.png; do
    r=$(basename "$S" .png); r=${r#regen-r}
    python3 "$ROOT/tools/metrics.py" "$D/shots/original.png" "$S" > "$D/rounds/metrics.r$r.json" && cat "$D/rounds/metrics.r$r.json"
    [ -s "$D/rounds/score-codex.r$r.json" ] && continue
    echo "▶ codex judge $D r$r"
    codex exec --skip-git-repo-check -s read-only -o "/tmp/cj-$D-$r.txt" "You are an independent visual judge. Image 1 = target app screenshot, image 2 = regeneration, same 1440x900 viewport. Score visual similarity 0-100 = layout (0-40) + color/typography (0-30) + components & content (0-30). Be strict: same concept but different look should be under 50; a blank page is 0. Reply with ONLY one line of JSON: {\"score\":int,\"layout\":int,\"style\":int,\"components\":int,\"notes\":\"3-6 concrete differences, most important first\"}" -i "$D/shots/original.png" -i "$S" >/tmp/cj-$D-$r.log 2>&1
    python3 -c "import json,re,sys;t=open('/tmp/cj-$D-$r.txt').read();j=json.loads(re.search(r'\{.*\}',t,re.S).group(0));json.dump(j,open('$D/rounds/score-codex.r$r.json','w'),ensure_ascii=False,indent=1);print(j['score'])" || echo "✗ codex parse failed $D r$r"
  done
done
echo "━━ scoring done"
