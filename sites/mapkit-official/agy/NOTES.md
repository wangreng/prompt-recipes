# NOTES — Official Website for `handdrawn-map-kit`

## Concept
The entire landing page is built directly on an illustrated archipelago sheet rendered by `handdrawn-map-kit` itself: five sculpted warm-parchment islands linked by dashed maritime routes across a watercolor sea, framed by the kit's zebra neatline border, curved graticules, compass rose, and opening cartouche. Each island holds one chapter of the story—Hero & one-command self-build (`./build.sh`) alongside a live Natural Earth Japan inset, Six-Layer Capabilities, the AI Agent Authoring Loop (`inspect` → YAML/JSON → `render --diagnostics` → `--hd`), an interactive Four Visual Presets plate (`vintage-atlas`, `blueprint`, `nocturne`, `ink-wash`), and Quick Start / JS API. Desktop (`300 × 740 mm`) and mobile (`130 × 1550 mm`) each render their own bespoke YAML spec so typography stays readable inside dedicated open parchment clearings at both `1440×900` and `390×844`.

## Kit-Rendered vs. Hand-Coded Breakdown
Roughly **~80–85% of the visible page area** (100% of the visual backdrop, framing, and cartographic artwork, with ~15–20% covered by opaque/high-contrast code blocks and text glyphs over semi-transparent parchment) is rendered directly by `handdrawn-map-kit`:

- **Rendered by `handdrawn-map-kit` (`./build.sh`):**
  - Full-page desktop archipelago (`specs/site-desktop.yaml`, `300 × 740 mm @ 7 ppm`, 53 layout items, `overlaps=0, oob=0`) and mobile portrait atlas (`specs/site-mobile.yaml`, `130 × 1550 mm @ 6 ppm`, 20 layout items, `overlaps=0, oob=0`).
  - Hotpress paper texture, cerulean watercolor ocean, concentric coastal waterlines, zebra neatline border, curved latitude/longitude graticules & degree edge ticks.
  - Opening parchment cartouche (with scale bar & legend), rotatable compass rose with rhumb lines, and a live **Natural Earth Japan inset map** (`insets[].geo`).
  - Mountain range, river, waves, dashed maritime routes, 25+ built-in cultural/landmark/maritime icons (`pagoda`, `torii`, `panda`, `cathedral`, `windmill`, `greatWall`, `romanArch`, `vineyard`, `pavilion`, `europeanCastle`, `shinkansen`, `turtleShip`, `lighthouse`, `whale`, `person`, etc.), custom **inline dry-media SVGs** (`el-svg-yaml-scroll`, `el-svg-diag-loupe`), and bilingual section headings / sea labels rendered in bundled `Kevin Serif` and `ZCOOL XiaoWei`.
  - All 4 interactive style preset specimen plates (`examples/specs/italy.yaml` rendered with `--style vintage-atlas|blueprint|nocturne|ink-wash --fast --auto-layout`).
- **Hand-coded (`src/index.html`, `src/styles.css`, `src/app.js`):**
  - Semantic HTML text blocks, feature cards, CLI/YAML/JSON/JS code blocks, and minimal CSS (`aspect-ratio` + `cqw` coordinate stage) for positioning readable copy over the islands' parchment clearings.
  - Tiny vanilla JS (`app.js`) for the offline-safe style-preset tab switcher and copy-command button.
  - Bundled `Kevin Serif` / `Kevin Sans` `.woff2` fonts copied read-only from `./kit/engine/fonts/` into `site/fonts/`.

## Hero Demo & Rebuild Verification
- **Command shown in hero:** `./build.sh`
- **Verification run:**
  1. Performed a clean build (`rm -rf site && ./build.sh`) and recorded SHA-256 checksums of all 6 generated `.webp` renders and static files in `site/`.
  2. Deleted all generated renders (`rm -f site/images/*.webp`) and re-ran `./build.sh`.
  3. Diffed SHA-256 checksums across both builds: **byte-for-byte identical** across all 6 WebP images (`1.4 MB` total, well under the `8 MB` budget) and HTML/CSS/JS files.
  4. Re-captured desktop (`1440×900` first + full) and mobile (`390×844` first + full) screenshots into `shots/` via Playwright + Chromium (`overflowX: false` on every zone, `overlaps=0, oob=0` on every spec, interactive preset switch to `blueprint` verified).
  5. Verified `./kit` remained untouched (read-only).

## Known Issues & Trade-offs
- **Intermediate viewport widths (`769px–980px`):** Because text sits inside fixed aspect-ratio coordinates of the desktop map (`300:740`), very narrow desktop windows just above the `768px` mobile breakpoint scale type down to its `clamp()` floor (`10–13px`), tightening vertical margins slightly compared to the `1440px` target width.
- **Horizontal scroll inside narrow mobile code blocks:** On `390px` mobile, long single-line CLI commands and YAML/JSON lines scroll horizontally inside their `<pre>` container (`overflow-x: auto`) rather than hard-wrapping mid-token, keeping code copyable without breaking island bounds.
- **WebP conversion tool:** `./build.sh` uses ImageMagick `convert` (`-quality 90`) to keep total `site/images/` at `1.4 MB` (vs. ~15 MB uncompressed PNGs); environments without `convert` installed would need a quick fallback to raw PNGs or `cwebp`.
