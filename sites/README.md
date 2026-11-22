# Round 2: 收藏 → Recipe → 复用 (live sites, 2026-11-21)

Method: `tools/r2/`. **01** full capture of the live site (`capture.mjs`: first screen, full page, hover, rendered DOM, visible text, computed-style summary). **02** agy (Gemini 4 Neon high) writes a design recipe: intent and rules only, no px/hex, no copied copy (`leak.py` checks). **03** agy builds sites from the recipe only, in an isolated dir, never seeing the original:
- **A** = recipe + neutral brief of the original page (re-creation, completeness gate)
- **B** = recipe + transfer brief (the real use)
- **C** = transfer brief only, no recipe (control)

Judge: Codex (GPT), with the full capture. A = absolute fidelity score. Style retention = pairwise B vs C, run in both orders. Requirement fulfillment = B and C each checked against the brief (code + screenshots). SSIM is a diagnostic only.

| Case | Transfer brief | Leak (px/hex/copied 5-grams) | A 还原 | B 风格保持 (pairwise ×2) | C 对照 | B 需求 | C 需求 | SSIM A |
|---|---|---|---|---|---|---|---|---|
| kidpickup.com | 拍作业 → todolist + 番茄钟 | 0 / 0 / 0 | 57 | **76 / 75**, wins both | 25 / 26 | 98 | 97 | 0.80 |
| memoh.ai | 多 Bot 干活的 agent | 0 / 0 / 0 | 63 | **74 / 71**, wins both | 16 / 14 | 97 | 98 | 0.51 |
| trazo.akoder.xyz | handdrawn-map-kit 官网 | 0 / 0 / 0 | 72 | **89 / 88**, wins both | 25 / 23 | 97 | 97 | 0.72 |

Briefs: `tools/r2/brief-*.md`. Recipes: `sites/<case>/recipe/`. Sites: `sites/<case>/gen/{A,B,C}`. Screens: `sites/<case>/shots/`. Scores: `sites/<case>/scores/`. Side-by-side: `sites/<case>/grid.png` (original · A / B · C).

## Findings
- **The recipe transfers.** In all 3 cases B beat the no-recipe control decisively, in both orders, by about 50–65 points. Without the recipe you get the same generic SaaS page every time.
- **Transfer is stronger than re-creation.** B's retention (71–89) is higher than A's fidelity (57–72). The recipe carries the design language. It does not carry the specific artwork.
- **Where it breaks: the art.** Every A miss is an asset: kidpickup's oversized wordmark with hand-drawn people, memoh's painted sunset scene, trazo's wax-crayon texture. Words can't reproduce these. Illustration-led sites need an image step: either a style reference for image generation, or real assets.
- **Style costs nothing on function.** Requirement scores for B and C are equal (97–98). So this judge isn't measuring much on the requirement axis. The briefs are too easy, or the checks need to be harder.
- **No leak.** 0 px, 0 colour codes and 0 copied phrases in ~900-word recipes, compared with the ~440-word, px-heavy prompts in round 1.
- **The judge was consistent.** Swapping the order never flipped the winner, and the scores moved by at most 3.

## Caveats
- One generation per condition, one judge (Codex), 3 cases, no human audit yet.
- Harness bug: the asset download in `capture.mjs` silently saved nothing, so no recipe got reference assets. The assets were fetched afterwards for the record, and the downloader is now fixed. The A scores therefore partly reflect missing art.
- kidpickup's cookie banner is in the original capture. The mobile 390 view was not scored.
- The transfer assets for handdrawn-map-kit are the two README images, fetched read-only. That repo was not touched.

## Round 2b: trazo + an image step (2026-11-21)

The trazo stickers are inline SVGs, so I rasterised 12 of them from the live page (`tools/r2/refs.mjs`) and used 4 as style references. The generator still never sees the original page. It gets the same recipe, the brief and one of two image sets:
- **raw:** the 4 original stickers, attached as-is.
- **gen:** 8 new stickers for the subject, made by Codex image_gen with the 4 refs as style reference (`r2b/img-A` sea set for re-creation, `r2b/img-B` map-kit set: compass, panda, pagoda, dumplings, mountain, junk boat, lantern, scroll). White backgrounds were turned transparent.

| | R2 (recipe only) | 2b raw | 2b gen |
|---|---|---|---|
| A 还原 (Codex) | 72 | 78 | 77 |
| SSIM A | 0.718 | 0.725 | 0.744 |
| B vs control C (both orders) | 89 / 88 | 88 / 87 | 90 / 88 |
| B 需求 | 97 | 97 | 95 |

Head-to-head (both orders, winner never flipped):
- **B-gen vs R2 B:** B-gen wins clearly, 84–73 and 89–78.
- **B-gen vs B-raw:** B-gen wins clearly, 86–74 and 85–70.

**Findings**
- **Adding images closes part of the art gap.** Re-creation went from 72 to 77–78. What's left is placement and sticker density.
- **Generating in-style images beats attaching the original art for transfer.** The raw sea stickers are off-topic, so the generator used them sparingly and the page lost the scattered-sticker feel. In-style stickers for the actual subject let it rebuild that composition.
- **Absolute "vs control" scores are saturated** (all ~88–90). Only direct pairwise comparisons between candidates separated them. Use pairwise as the main metric.
- **Small cost on requirements** (95): B-gen put the Korea map as the output of a Japan spec, and its "65 glyphs" catalog shows fewer.
- **Caveats:** one run each, and Codex is both the image maker and the judge (possible self-preference on the gen set). Recipe unchanged, so the leak check is unchanged (0/0/0).

Grid: `sites/trazo/r2b/grid-2b.png` (Original · R2 B / 2b B-raw · 2b B-gen).


## Round 2c: trazo, image step via agy generate_image (2026-11-22)

This round tests the same image step with a different image maker, so the stickers no longer come from the judge's model. The 8 map-kit stickers were made with agy's built-in image generation (`npx imagine-agy generate … --model gemini-4-neon-high`; the wrapper's default `gemini-3.1-pro-low` isn't valid on this account and fails silently). Each prompt pointed at the 4 trazo refs. Output is a JPEG on white. `tools/r2/matte.py` turns it into transparent PNG by flood-filling the near-white border, eroding 1px and feathering the edge; checked on a dark background with no halos. Page B was then rebuilt from the same recipe + agy stickers + brief. Codex judged as before. Script: `tools/r2/run-2c.sh`.

Sticker sheet: `sites/trazo/r2c/stickers-2c-vs-2b.png`. Grid: `sites/trazo/r2c/grid-2c.png` (Original · R2 B / 2b Codex stickers · 2c agy stickers).

**Head-to-head (both orders):**
- **2c agy vs R2 recipe-only:** agy wins clearly, 85–73 and 86–74. Same lift as the Codex stickers got (84–73, 89–78).
- **2c agy vs 2b Codex:** Codex wins both orders, 86–80 (slight) and 85–75 (clear).

**Requirements:** I added two checks to the brief: (a) every spec must be shown with its own render, and (b) no claimed number may be contradicted by the page. Results:
- **2c agy: 96.** The pairing is correct, and the catalog really has 65 entries. The only flagged claim is a nit: zoom says 150% and applies 155%.
- **2b Codex, re-checked: 86.** It shows the Japan spec with the Korea map, and its "65" catalog has only 16 entries.

**Read:**
- **The lift comes from the image step itself.** It doesn't depend on which model draws the stickers.
- **The Codex stickers are closer to the original's style, and the score favours them.** The Codex judge prefers its own model's stickers, but this time it isn't only self-preference: by eye the agy set is glossier and more detailed, with less crayon grain and fewer chunky cute faces.
- **Check the result after generating.** Once the images exist, compare each one against the refs for the original's texture before using it.

