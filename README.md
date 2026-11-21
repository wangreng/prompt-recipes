# prompt-recipes

Reverse-engineering the prompts behind good AI Studio demos, then checking the prompt for real by regenerating the app from it and comparing.

```
demo code ─► agy writes "most likely prompt" ─► agy rebuilds the app from that prompt alone (fresh dir)
    │                                                     │
    └──── both served + screenshotted in an Instabox sandbox (1440×900) ────┘
                              │
          judges: Gemini self-score · Codex (GPT) independent score · SSIM / pixel diff
                              │
                 refine prompt from the notes (2 rounds) ─► RECIPE.md
```

## Round 2: live sites, recipe → transfer

See [sites/README.md](sites/README.md): 3 live sites, design recipe with no px or copy, generation from the recipe only, Codex judge with original. In all 3 cases the recipe beat the no-recipe control decisively on design-language retention.

## Recipes (first pass, 2026-11-21)

| Demo | What it is | Recipe |
|---|---|---|
| Gemini 95 | Retro Win95 desktop with AI apps | [RECIPE](demos/gemini_95/RECIPE.md) |
| Flashcard Maker | Topic → flashcards | [RECIPE](demos/flashcard_maker/RECIPE.md) |
| Gemini Co-Drawing | Sketch + prompt, Gemini redraws | [RECIPE](demos/gemini_co_drawing/RECIPE.md) |

Scores for every round: [RESULTS.md](RESULTS.md). Run diary: [LOG.md](LOG.md).

## Layout

- `demos/<demo>/original/`: source from [google-gemini/aistudio-showcase](https://github.com/google-gemini/aistudio-showcase) (Apache-2.0)
- `demos/<demo>/rounds/`: `prompt.rN.md`, `regen-rN/` (generated code), `score.rN.json` (Gemini), `score-codex.rN.json` (Codex), `metrics.rN.json` (SSIM)
- `demos/<demo>/shots/`: `original.png`, `regen-rN.png`
- `tools/pipeline.sh <demo> <sandbox> [rounds]`: the whole loop for one demo (runs on svp in a herdr pane)
- `tools/sandbox-shot.sh`, `tools/shoot.sh`, `tools/snap.mjs`: ship an app into an Instabox sandbox, build with esbuild + importmap, screenshot with Chromium, pull the PNG back
- `tools/score.sh`: Codex judge + SSIM for every finished round · `tools/metrics.py`: SSIM / pixel diff · `tools/cards.py`: builds the RECIPE cards and RESULTS

## Run it

On svp, inside the foreground herdr session (one pane per demo):

```bash
instabox create --name pr-<demo> --template agent-browser
tools/pipeline.sh <demo> pr-<demo> 3 | tee demos/<demo>/run.log
tools/score.sh <demo>        # Codex judge + SSIM
python3 tools/cards.py       # RECIPE.md + RESULTS.md
instabox rm pr-<demo>        # sandboxes are disposable, never snapshot
```
