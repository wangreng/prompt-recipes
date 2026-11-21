# LOG

## 2026-11-21 · first pass

### Setup (svp)
- Picked up a crashed earlier attempt. It had already cloned 3 demos from `google-gemini/aistudio-showcase` into `demos/*/original`, written `tools/shoot.sh` / `sandbox-shot.sh` / `snap.mjs`, and created the sandbox `pr-gemini95`. It had made no commits. I kept all of it and continued.
- herdr runs in the **foreground** in a maximized xfce4-terminal titled `herdr · prompt-recipes` on the svp desktop, so the box live view or `herdr --remote user@svp` shows it. Panes: `demo1-gemini95`, `demo2-flashcard`, `demo3-codraw`, `judge-codex`.
- Instabox (free plan): `pr-gemini95`, `pr-flashcard`, `pr-codraw`, all from the `agent-browser` template. Free plan rejects `--max-run-minutes`, so I used the default. No herdr in the sandboxes, no tailnet (checked `tailscale status`).
- Generator, first judge and refiner: `agy --model gemini-4-neon-high`. Independent judge: Codex CLI (GPT) via `codex exec -i`.
- Installed `pip --user` with scikit-image, pillow and numpy on svp for SSIM.

### Decisions
- **Demos:** Gemini 95 (complex, pixel-art retro desktop), Flashcard Maker (simple Material form) and Gemini Co-Drawing (React + Tailwind canvas tool). They span three difficulty levels and two stacks, and all are official AI Studio apps whose source is public.
- **Regen isolation:** the regen step builds in an empty `rounds/regen-rN/` and is told not to read `original/`, `shots/` or other rounds.
- **Rounds:** reverse prompt (r1), then two refines (r2, r3). Every round's prompt, code and screenshot are kept.
- **Screenshot guard:** a PNG/JPEG magic-byte check plus size > 1 KB before anything reads it. Up to 2 retries.
- **Scores:** Gemini self-score (rubric: layout 40 / style 30 / components 30). On Reng's call, Codex (GPT) re-scores every round with the same images and rubric. I also added SSIM and pixel diff as an objective metric. Flags: model ≥ 85 with SSIM < 0.93, and the two judges ≥ 15 apart.

### Harness bugs found by looking at the screenshots
1. Flashcard original rendered unstyled and Co-Drawing original was blank. AI Studio's `index.html` has no `<head>`/`<body>` and no script/CSS tags, because AI Studio injects them. Fix: append the bundle script and prepend the CSS link.
2. `new GoogleGenAI({apiKey: ""})` throws on load. Fix: define a dummy key for screenshots. No API calls are made on the first screen.
3. Co-Drawing r3 was blank: the importmap only mapped bare `react`, so `react/jsx-runtime` failed to resolve. Gemini had scored this blank page 0. Fix: the harness adds a `react/jsx-runtime` entry. Reshot, and Gemini re-judged it at 98. The stale score is kept as `score.r3.blank-harness-bug.json`.
4. Codex `-i` takes several values and swallowed the prompt. Fix: the prompt now goes before `-i`.

### Codex judge
- Codex on svp was logged out (refresh token revoked). Reng signed in again with a device code at 22:06. `tools/score.sh` then scored all 9 rounds. 3 calls came back empty (intermittent, no error in the log) and passed on retry, because the script skips rounds that already have a score.

### Results
| Demo | r1 Gemini/Codex/SSIM | r2 | r3 (final) |
|---|---|---|---|
| Gemini 95 | 68 / 77 / 0.963 | 75 / 80 / 0.962 | 86 / 86 / 0.978 |
| Flashcard Maker | 85 / 84 / 0.932 | 92 / 93 / 0.929 ⚑ | 95 / 96 / 0.972 |
| Gemini Co-Drawing | 87 / 88 / 0.909 ⚑ | 96 / 96 / 0.951 | 98 / 99 / 0.997 |

⚑ = model score ≥ 85 but SSIM < 0.93 (the judges forgave pixel offsets in layout and spacing that SSIM counts).

**Takeaways**
- **Self-grading bias is small here.** Gemini and Codex agree within ±1 on 7 of 9 rounds. The one real gap is Gemini 95 r1/r2, where Gemini was *harsher* (−9, −5). So the worry is less "Gemini flatters itself" and more "both judges are lenient on simple, flat UIs".
- **Refining works:** every demo improved each round on both judges and on SSIM (except one flat SSIM step).
- **The hard part is pixel art.** Gemini 95 stays at 86 because all 7 icons are redrawn differently. Words can't pin down pixel art. A real recipe there needs the assets, not a better prompt.
- **Source leak is real.** The final prompts are ~430–445 words with exact px values, handles and copy. Co-Drawing r3 is nearly pixel-identical (SSIM 0.997). That shows the prompt reproduces the app, but no user typed it. Next pass: reverse from screenshots only (no source) and compare.

### Cleanup
- Deleted sandboxes `pr-gemini95`, `pr-flashcard`, `pr-codraw` (no snapshots). Left Reng's older `box-ba0565` and `cosp` alone.
- Hibernated svp. herdr session panes are kept on the box.

### Credits (Simular)
- Today's box usage at time of writing: ~360 credits at 21:40; ~470 by hibernate (~200/hr), including the earlier crashed attempt. Codex/agy calls run on Reng's ChatGPT / Google AI Pro plans, not Simular credits.
