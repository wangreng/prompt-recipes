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

### Blocker
- Codex on svp was logged out (refresh token revoked). Device login is waiting for Reng in pane `judge-codex`. Codex scores are pending until then.

### Credits (Simular)
- Today's box usage at time of writing: ~360 credits (~200/hr), including the earlier crashed attempt.
