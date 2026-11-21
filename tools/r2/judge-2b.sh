#!/usr/bin/env bash
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
C=trazo; ROOT="$HOME/prompt-recipes"; T="$ROOT/tools/r2"; D="$ROOT/sites/$C"; E="$D/r2b"; S="$E/shots"; O="$E/scores"
cx(){ local name="$1"; shift; local prompt="$1"; shift; [ -s "$O/$name.json" ] && { echo "skip $name"; return; }
  for i in 1 2 3; do (cd "$E" && codex exec --skip-git-repo-check -s read-only -o "/tmp/r2bj-$name.txt" "$prompt" "$@" >"/tmp/r2bj-$name.log" 2>&1)
    python3 -c "import json,re;t=open('/tmp/r2bj-$name.txt').read();j=json.loads(re.search(r'\{.*\}',t,re.S).group(0));json.dump(j,open('$O/$name.json','w'),ensure_ascii=False,indent=1);print('$name',json.dumps(j,ensure_ascii=False)[:250])" && return; echo "retry $name $i"; done; }
for V in A-raw A-gen; do
python3 "$ROOT/tools/metrics.py" "$S/orig-first.png" "$S/$V-first.png" > "$O/ssim-$V.json"; cat "$O/ssim-$V.json"
cx fid-$V "You judge a website re-creation. Images 1-2 = ORIGINAL site (first screen 1440x900, full page). Images 3-4 = a re-creation built only from a written design recipe, a content brief and some illustration images, without seeing the original (first screen, full page). Wording will differ by design; ignore exact copy. Score 0-100 = layout & section structure (0-35) + typography & color (0-35) + components, imagery & details (0-30). Be strict: same genre but a different look is under 50. Reply ONLY one line of JSON: {\"score\":int,\"layout\":int,\"style\":int,\"components\":int,\"missed\":\"the 3-5 most important remaining differences, plain words\"}" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/$V-first.png" -i "$S/$V-full.png"
done
PW="Images 1-2 = ORIGINAL site (first screen, full page). Then two NEW sites for a different product with different content: images 3-4 = site X (first, full), images 5-6 = site Y (first, full). Ignore content and product entirely. Which of X or Y carries the original's DESIGN LANGUAGE better: typography logic, color logic, layout rhythm and density, component vocabulary, imagery and illustration style, overall mood? Also rate each 0-100 for design-language retention (a generic modern landing page that merely shares the genre scores under 30). Reply ONLY one line of JSON: {\"winner\":\"X|Y\",\"margin\":\"slight|clear|decisive\",\"x\":int,\"y\":int,\"why\":\"one or two sentences\"}"
pair(){ cx "pair-$1-vs-$2" "$PW" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/$1-first.png" -i "$S/$1-full.png" -i "$S/$2-first.png" -i "$S/$2-full.png"; }
for V in B-raw B-gen; do pair $V r2C; pair r2C $V; done
pair B-gen r2B; pair r2B B-gen; pair B-gen B-raw; pair B-raw B-gen
for V in B-raw B-gen; do
cx req-$V "You check a website against its product brief. Brief: $T/brief-$C.md (read it). Site code: ./gen/$V (read it, check that interactions really work in the code). Images = the site's first screen and full page at 1440 wide. Score requirement fulfillment 0-100: every required section present and about THIS product (50), required interactions actually implemented (30), acceptance criteria and quality (20). Do not judge visual taste. Reply ONLY one line of JSON: {\"score\":int,\"sections\":int,\"interactions\":int,\"quality\":int,\"gaps\":\"missing or broken items, plain words\"}" -i "$S/$V-first.png" -i "$S/$V-full.png"
done
echo "━━ 2b judged"
