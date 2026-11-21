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
