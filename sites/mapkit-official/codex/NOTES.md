# handdrawn-map-kit website

## Concept
A continuous field atlas introduces the engine by being its own working demonstration.
Real Natural Earth Italy anchors the hero; fictional editorial islands hold the features and quick start.
A red expedition route follows the agent’s inspect → spec → render → diagnostics → refine loop.
Sea-green paper, olive land, pencil illustrations and restrained red annotations carry the visual identity.
Mobile uses its own portrait composition, with live, selectable prose over the rendered sheet.

## Deliverables and build
- Open `site/index.html` directly; no server, network, JavaScript or viewing build is needed.
- Run **`./build.sh`** from this folder to render both YAML specs and reconstruct the complete `site/` output.
- Source: `specs/desktop.yaml`, `specs/mobile.yaml`, `source/index.html`, `source/style.css`, and `scripts/package.cjs`.
- Build requirements: Bash, Node.js >=20, and the supplied installed `kit/`. The build uses its CLI and its existing `@napi-rs/canvas` dependency to encode WebP. No additional dependency installation is needed here.
- `site/specs/` includes downloadable YAML and actual renderer diagnostics; `site/SKILL.md` is the kit’s agent guide.
- The kit was not changed. Only the expressly permitted `kit/out/` was used to verify the displayed quick-start command. No git commit, branch or push was performed; “commit the specs” was interpreted as deliver the source files, respecting the explicit prohibition on git operations.

## Kit-rendered versus hand-coded
The kit renders the **entire continuous background**, all geography, fictional island coastlines, paper texture, border, compass, cartouche, scale, illustrations, route, map labels, main headline and section titles. Approximately **95% of the visible page area** is kit-rendered; this is a visual estimate, counting the underlying atlas surface.
HTML supplies accessible heading equivalents, selectable body copy, code, links and navigation. CSS mainly positions those overlays and styles the single dark command block. Secondary HTML headings use the kit’s bundled Kevin Serif font. There are no CSS illustrations, stock images or externally generated assets.
Desktop is 1800×2820 pixels; portrait is 1000×9000. The two final WebPs total **684,880 bytes**, well below the 8 MB image budget. The source PNGs in `.build/` are intermediate render output and are not needed to view or distribute the site.

## Verification performed
Verified locally in headless Google Chrome through Playwright on 2026-11-22, using `file://`:
- **Pass 1:** inspected first-screen and full-page captures at 1440×900 and 390×844. Found caption-cartouche crowding, unwanted default legend, rotated sea-label overflow, mobile line-break spacing, and footer/coastline proximity. Captures retained in `shots/before-fixes/`.
- **Pass 2:** rerendered corrected specs and inspected all four captures. Both maps reported **0 overlaps and 0 out-of-bounds items**. Corrected the mobile caption’s proximity to the next coastline.
- **Final rebuild pass:** recorded SHA-256 hashes, deleted `site/assets/desktop.webp`, `site/assets/mobile.webp`, `site/index.html`, and `site/style.css`, then ran the exact hero command **`./build.sh`**. Took all four screenshots again. **All 15 compared files (11 complete site files + 4 screenshots) were byte-identical.** See `shots/reproducibility.log` and the before/after manifests. Final screenshots were visually inspected again.
- Browser checks: images load, all internal anchors and local linked files exist, hero command link reaches the quick start, one semantic H1, no JavaScript errors, and no horizontal page overflow at either requested size. Page heights are 2256 px desktop and 3510 px mobile.
- Ran the displayed Italy quick-start CLI command verbatim from `kit/`; it completed with **0 overlaps, 0 out-of-bounds items**. See `shots/quick-start.log`.

Final captures: `shots/desktop-first.png`, `shots/desktop-full.png`, `shots/mobile-first.png`, `shots/mobile-full.png`.
Browser verification script: `scripts/check.mjs`; install/provide Playwright separately for QA only, or set `PLAYWRIGHT_MODULE` to an existing module path. This session used `/home/user/count11/node_modules/playwright/index.mjs` and `/usr/bin/google-chrome`. `scripts/rebuild-check.cjs record` records hashes; running it without arguments compares them. Neither test dependency is needed by `./build.sh`.

## Known limitations
- This is an illustrated editorial map, not a navigation tool. Landmark placement is illustrative; lower islands are fictional. The scale applies to the Italy projection, not the editorial islands.
- Map lettering is rasterized; equivalent semantic headings and image alternative text are present. Prose and commands remain selectable. The composition is art-directed and scales with viewport width, rather than reflowing its drawn geography.
- External GitHub navigation and installing from GitHub require internet access. The site and its build in the supplied environment do not.
- Verified in Chrome at the two requested sizes; other browser engines and extreme text-zoom settings were not tested.
