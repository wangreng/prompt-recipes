#!/usr/bin/env bash
# Codex judge for round 2. usage: tools/r2/judge.sh <case>
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
C="$1"; ROOT="$HOME/prompt-recipes"; T="$ROOT/tools/r2"; D="$ROOT/sites/$C"; S="$D/shots"; O="$D/scores"
cx(){ local name="$1"; shift; local prompt="$1"; shift; [ -s "$O/$name.json" ] && { echo "skip $name"; return; }
  for i in 1 2 3; do (cd "$D" && codex exec --skip-git-repo-check -s read-only -o "/tmp/r2j-$C-$name.txt" "$prompt" "$@" >"/tmp/r2j-$C-$name.log" 2>&1)
    python3 -c "import json,re;t=open('/tmp/r2j-$C-$name.txt').read();j=json.loads(re.search(r'\{.*\}',t,re.S).group(0));json.dump(j,open('$O/$name.json','w'),ensure_ascii=False,indent=1);print('$name',json.dumps(j,ensure_ascii=False)[:300])" && return; echo "retry $name $i"; done; }
python3 "$ROOT/tools/metrics.py" "$S/orig-first.png" "$S/A-first.png" > "$O/ssim-A.json" 2>/dev/null; cat "$O/ssim-A.json"
# A: re-creation fidelity (completeness gate)
cx A-fidelity "You judge a website re-creation. Images 1-2 = ORIGINAL site (first screen 1440x900, full page). Images 3-4 = a re-creation built only from a written design recipe plus a content brief, without seeing the original (first screen, full page). The original's full capture (dom.html, styles.json, text.txt) is in ./capture; the re-creation code is in ./gen/A. Wording will differ by design; ignore exact copy. Score 0-100 = layout & section structure (0-35) + typography & color (0-35) + components, imagery & details (0-30). Be strict: same genre but a different look is under 50. Reply ONLY one line of JSON: {\"score\":int,\"layout\":int,\"style\":int,\"components\":int,\"missed\":\"the 3-5 most important design traits the recipe failed to carry, plain words\"}" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/A-first.png" -i "$S/A-full.png"
# B vs C pairwise style retention, both orders
PW="Images 1-2 = ORIGINAL site (first screen, full page). Then two NEW sites for a different product with different content: images 3-4 = site X (first, full), images 5-6 = site Y (first, full). Ignore content and product entirely. Which of X or Y carries the original's DESIGN LANGUAGE better: typography logic, color logic, layout rhythm and density, component vocabulary, imagery style, overall mood? Also rate each 0-100 for design-language retention (a generic modern landing page that merely shares the genre scores under 30). Reply ONLY one line of JSON: {\"winner\":\"X|Y\",\"margin\":\"slight|clear|decisive\",\"x\":int,\"y\":int,\"why\":\"one or two sentences\"}"
cx pair-BC "$PW" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/B-first.png" -i "$S/B-full.png" -i "$S/C-first.png" -i "$S/C-full.png"
cx pair-CB "$PW" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/C-first.png" -i "$S/C-full.png" -i "$S/B-first.png" -i "$S/B-full.png"
# requirement fulfillment for B and C (same brief, code + screenshots)
for V in B C; do
cx req-$V "You check a website against its product brief. Brief: $T/brief-$C.md (read it). Site code: ./gen/$V (read it, check that interactions really work in the code). Images = the site's first screen and full page at 1440 wide. Score requirement fulfillment 0-100: every required section present and about THIS product (50), required interactions actually implemented (30), acceptance criteria and quality (20). Do not judge visual taste. Reply ONLY one line of JSON: {\"score\":int,\"sections\":int,\"interactions\":int,\"quality\":int,\"gaps\":\"missing or broken items, plain words\"}" -i "$S/$V-first.png" -i "$S/$V-full.png"
done
echo "━━ $C judged"
