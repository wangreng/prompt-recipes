#!/usr/bin/env bash
# Round 2c (trazo): image step via agy generate_image (imagine-agy) so generator != judge.
set -uo pipefail
export PATH=$HOME/.local/bin:$HOME/.npm-global/bin:$PATH
C=trazo; ROOT="$HOME/prompt-recipes"; T="$ROOT/tools/r2"; D="$ROOT/sites/$C"; E="$D/r2c"; R="$D/r2b/refs"
MODEL="${MODEL:-gemini-4-neon-high}"
mkdir -p "$E"/{raw,img,gen,shots,scores}
STYLE="First look at these four reference sticker images: $R/ref01.png $R/ref04.png $R/ref08.png $R/ref12.png . Then generate ONE sticker in exactly the same chunky wax-crayon sticker style (thick soft crayon outline, flat pastel fills with visible crayon grain, small highlights, cute and simple). Single subject centered, flat pure white background, no shadow, no text. Subject:"
i=0
for s in "a compass rose" "a cute giant panda" "a pagoda" "a plate of dumplings" "a snowy mountain peak" "a sailing junk boat" "a red paper lantern" "a rolled paper map"; do
  i=$((i+1)); f="$E/raw/s0$i.jpg"; [ -s "$f" ] && continue
  for t in 1 2; do (cd "$E" && npx -y imagine-agy generate "$STYLE $s." -o "$f" --ratio 1:1 --model "$MODEL" 2>&1 | tail -n 2); [ -s "$f" ] && break; done
done
python3 "$T/matte.py" "$E/raw" "$E/img"; ls "$E/img"
# page B from recipe + agy stickers + brief
G=/tmp/r2c/gen-B; if [ ! -f "$E/gen/B/index.html" ]; then
rm -rf "$G"; mkdir -p "$G/site/art"; cp "$T/brief-$C.md" "$G/brief.md"; cp "$D/recipe/recipe.md" "$G/recipe.md"; cp "$E/img/"*.png "$G/site/art/"; cp -r "$T/assets-$C" "$G/site/assets"
echo "▶ agy: gen B"; (cd "$G" && timeout 1800 agy --dangerously-skip-permissions --model "$MODEL" -p "Only read and write inside $G. Do not open, list or search anything else on this machine, and do not search the web for any existing site. Follow the design recipe in $G/recipe.md (design language). site/art/ holds sticker illustrations made in the target style for this product; use them as the page's illustrations as the recipe describes. Build the website described in the product brief $G/brief.md into $G/site/. Build a static website: index.html + style.css (+ script.js if needed). No build step; Google Fonts and plain JS are fine. Everything must render opened as a local file. To check your work you may screenshot it: node $T/shot.mjs <path-to-index.html> <out-prefix> and look at the PNGs; fix what looks wrong (at most 2 self-check passes)." 2>&1 | tail -n 4)
mkdir -p "$E/gen/B"; cp -r "$G/site/." "$E/gen/B/"; fi
(cd "$T" && node shot.mjs "$E/gen/B/index.html" "$E/shots/B-agy")
cp "$D/shots/orig-first.png" "$D/shots/orig-full.png" "$E/shots/"
cp "$D/r2b/shots/B-gen-first.png" "$E/shots/B-codex-first.png"; cp "$D/r2b/shots/B-gen-full.png" "$E/shots/B-codex-full.png"
cp "$D/shots/B-first.png" "$E/shots/r2B-first.png"; cp "$D/shots/B-full.png" "$E/shots/r2B-full.png"
echo "━━ 2c generated"
# judge (Codex)
S="$E/shots"; O="$E/scores"
cx(){ local name="$1"; shift; local prompt="$1"; shift; [ -s "$O/$name.json" ] && return
  for k in 1 2 3; do (cd "$D" && codex exec --skip-git-repo-check -s read-only -o "/tmp/r2cj-$name.txt" "$prompt" "$@" >"/tmp/r2cj-$name.log" 2>&1)
    python3 -c "import json,re;t=open('/tmp/r2cj-$name.txt').read();j=json.loads(re.search(r'\{.*\}',t,re.S).group(0));json.dump(j,open('$O/$name.json','w'),ensure_ascii=False,indent=1);print('$name',json.dumps(j,ensure_ascii=False)[:250])" && return; echo "retry $name $k"; done; }
PW="Images 1-2 = ORIGINAL site (first screen, full page). Then two NEW sites for a different product with different content: images 3-4 = site X (first, full), images 5-6 = site Y (first, full). Ignore content and product entirely. Which of X or Y carries the original's DESIGN LANGUAGE better: typography logic, color logic, layout rhythm and density, component vocabulary, imagery and illustration style, overall mood? Also rate each 0-100 for design-language retention (a generic modern landing page that merely shares the genre scores under 30). Reply ONLY one line of JSON: {\"winner\":\"X|Y\",\"margin\":\"slight|clear|decisive\",\"x\":int,\"y\":int,\"why\":\"one or two sentences\"}"
pair(){ cx "pair-$1-vs-$2" "$PW" -i "$S/orig-first.png" -i "$S/orig-full.png" -i "$S/$1-first.png" -i "$S/$1-full.png" -i "$S/$2-first.png" -i "$S/$2-full.png"; }
pair B-agy B-codex; pair B-codex B-agy; pair B-agy r2B; pair r2B B-agy
REQ="Extra acceptance checks (fail them explicitly if violated): (a) any example that shows a spec and its rendered output must pair them correctly, e.g. a Japan spec must show the Japan map, not Korea; (b) any number the page claims (e.g. 65 illustrations/glyphs) must not be contradicted by a catalog that visibly shows fewer while presenting itself as complete."
req(){ cx "req-$1" "You check a website against its product brief. Brief: $T/brief-$C.md (read it). $REQ Site code: $2 (read it, check that interactions really work in the code). Images = the site's first screen and full page at 1440 wide. Score requirement fulfillment 0-100: every required section present and about THIS product (50), required interactions actually implemented (30), acceptance criteria and quality incl. the extra checks (20). Do not judge visual taste. Reply ONLY one line of JSON: {\"score\":int,\"sections\":int,\"interactions\":int,\"quality\":int,\"pairing_ok\":bool,\"claims_ok\":bool,\"gaps\":\"missing or broken items, plain words\"}" -i "$S/$1-first.png" -i "$S/$1-full.png"; }
req B-agy ./r2c/gen/B; req B-codex ./r2b/gen/B-gen
echo "━━ 2c judged"
