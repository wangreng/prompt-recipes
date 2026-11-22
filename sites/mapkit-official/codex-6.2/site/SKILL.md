---
name: handdrawn-map-kit
description: Generate Mizielinski-style hand-drawn illustrated cultural maps from declarative JSON/YAML specs using Natural Earth multi-layer data, inline SVG dry-media rendering, CJK/bilingual typography, auto-layout, and structured layout diagnostics.
---

# Hand-Drawn Cultural Map Authoring Skill (`handdrawn-map-kit`)

Use this skill to author, inspect, diagnose, and render hand-drawn illustrated cultural maps with `handdrawn-map-kit`.

## Coordinate System

- All layout, drawing, and diagnostic coordinates are in **millimetres (mm)** with top-left origin `(0, 0)`, `+x` right, `+y` down.
- Default sheet: `300 × 200 mm`, `pad = 4.8 mm`, `inner = 8.0 mm`, safe drawable frame `[8, 8, 292, 192]`.
- Geographic coordinates use `[lon, lat]` (degrees) and are projected automatically when `geo.fit` or `geo.projection` is specified.
- Hard resolution cap: `Math.round(w * ppm) * Math.round(h * ppm) <= 18.5e6` pixels (`--fast` is `ppm = 5`, `--hd` is `ppm = 10`).

## CLI Commands

### 1. Discover Built-in Data & Assets (`inspect`)

Always query real country/province codes, cities, rivers, elements, flags, and fonts before drafting a spec so you never hallucinate coordinates or asset names:

```bash
# Search Natural Earth countries (id, iso2, name, continent, mainBBox)
handdrawn-map inspect countries italy --json

# Search Natural Earth admin-1 states/provinces (by country name/ISO or province name/zh/ISO-3166-2)
handdrawn-map inspect admin1 China --json

# Search Natural Earth populated places (by country or city name/zh/ja/ko)
handdrawn-map inspect places China --json

# Search Natural Earth major rivers
handdrawn-map inspect rivers Yangtze --json

# List all 65 built-in illustrated elements (with bounds & metadata) and 10 person poses
handdrawn-map inspect elements --json

# List built-in waving flag codes for cartouches
handdrawn-map inspect flags --json

# List registered Latin & CJK fonts (including bundled ZCOOL XiaoWei)
handdrawn-map inspect fonts --json

# List built-in visual style presets (vintage-atlas, blueprint, nocturne, ink-wash)
handdrawn-map inspect styles --json

# Validate & plan a spec without rasterizing (fast projection + auto-layout diagnostics)
handdrawn-map inspect spec my-map.yaml --json
```

### 2. Render & Collect Diagnostics (`render`)

```bash
# Fast preview with auto-layout and structured diagnostics piped to stdout
handdrawn-map render my-map.yaml -o out/my-map-fast.png --fast --auto-layout --diagnostics -

# Render the same spec in an alternate visual style preset
handdrawn-map render my-map.yaml --style blueprint -o out/my-map-blueprint.png --fast
handdrawn-map render my-map.yaml --style nocturne -o out/my-map-nocturne.png --fast
handdrawn-map render my-map.yaml --style ink-wash -o out/my-map-inkwash.png --fast

# Write diagnostics JSON to a file
handdrawn-map render my-map.yaml -o out/my-map-fast.png --fast --diagnostics out/my-map.diag.json

# Final high-definition render (3000×2000 px at default 300×200 mm)
handdrawn-map render my-map.yaml -o out/my-map-hd.png --hd
```

Supported flags for `render`:
- `-o, --out <file>`: output PNG path (defaults to `out/<meta.id-or-stem>.png`).
- `--style <preset>`: override visual style preset (`vintage-atlas` | `blueprint` | `nocturne` | `ink-wash`).
- `--fast`: `ppm = 5` (`1500 × 1000 px` on default sheet).
- `--hd`: `ppm = 10` (`3000 × 2000 px` on default sheet).
- `--ppm <n>`: explicit pixels-per-mm override.
- `--diagnostics <file.json|->`: emit layout diagnostics JSON (`-` writes pure JSON to `stdout` and summary to `stderr`).
- `--seed <str>`: deterministic RNG seed override.
- `--no-border`: omit the border frame (expands safe frame to full sheet).
- `--auto-layout`: activate both automatic empty-space placement (`autoPlace`) and collision avoidance (`avoidOverlap`).

## Declarative Spec Schema (`schemaVersion: 1`)

Specs can be written in **YAML** (`.yaml`/`.yml`) or **JSON** (`.json`). `schemaVersion: 1` is required. Top-level aliases `page` → `canvas`, `region` → `geo`, and `theme` → `style` are automatically normalized.

```yaml
schemaVersion: 1

meta:
  id: sichuan-cultural
  title: 四川省 · SICHUAN
  lang: zh                # en | zh | ja | ko (used by cartouche & auto-cities)
  seed: sichuan-1

canvas:
  w: 300
  h: 200
  ppm: 10
  paper: hotpress         # optional when style.preset is set; cartridge | cream | hotpress | navy | black | ...
  border: true

style:
  preset: vintage-atlas   # vintage-atlas | blueprint | nocturne | ink-wash
  palette:
    land: '#efe2c3'
    neighborLand: '#e2dac6'
    ocean: '#c9dfea'
    river: '#4f8cb0'
  # Optional custom font registration:
  # fonts:
  #   - { name: MyHandFont, path: ./fonts/MyHandFont.ttf, scripts: [han] }

geo:
  fit:
    # Target can be country name/ISO, [w, s, e, n] bbox, or { country, admin1 }
    target: { country: China, admin1: Sichuan }
    margin: 12
    rotDeg: 0
  focus: [China]
  neighbors: true         # true (auto), false, or explicit list
  admin1:
    country: China
    highlight: [Sichuan]  # optional highlight list; omit for borders-only overlay
  waterlines: true

layers:
  graticule: true
  rivers:
    auto: true            # Natural Earth rivers inside map extent (or manual array)
    maxRank: 6
  lakes:
    auto: true            # Natural Earth lakes (or manual array)
  mountains:
    auto: true            # Natural Earth peaks & ranges (or manual array)
    scale: 0.85
  cities:
    auto: true            # Natural Earth populated places (or manual array)
    max: 6
    bilingual: true
  routes:
    - pts: [[104.06, 30.67], [106.55, 29.56]]   # [lon, lat] auto-detected when proj exists
  waves:
    - { x: 45, y: 120, scale: 1.0, count: 2 }
  riceFields:
    - { x: 120, y: 90, w: 12, h: 6 }

elements:
  # 65 built-in icons (including China/Europe/world icons: panda, pavilion, greatWall,
  # archBridge, lantern, dumplings, teapot, cathedral, europeanCastle, windmill,
  # romanArch, vineyard, oliveTree, cheeseWine, palmTree, volcano, waterfall, train,
  # ship, hotAirBalloon, fish, yurt, plus Japan/Korea icons & parameterized person)
  - id: el-panda
    type: panda
    lon: 103.42           # (lon, lat), (x, y), place: "Chengdu", or placement: "auto"
    lat: 31.15
    scale: 0.95
    priority: 65

  # Inline SVG rendered through the dry-media pencil/wash/hatch engine
  - id: el-sanxingdui
    type: svg
    lon: 104.22
    lat: 31.00
    options:
      width: 14           # target mm width (or height / scale)
      fillStyle: pencil   # pencil | wash | hatch
    svg: '<svg viewBox="0 0 32 24"><path d="M4,4 L28,4 L26,20 L16,23 L6,20 Z" fill="#8fa889" stroke="#2c3e2e" stroke-width="1.5"/></svg>'
    priority: 62

labels:
  # Bilingual CJK + Latin label
  - id: lbl-chengdu
    text: 成都
    subtext: Chengdu      # renders stacked/inline bilingual label
    lon: 104.06
    lat: 30.67
    size: 4.0
    priority: 85
    fixed: false

  # Rotated region label
  - id: lbl-basin
    kind: region          # label | sea | region
    text: 四川盆地
    angle: -10
    lon: 105.35
    lat: 30.85

  # Curved label along a mm path
  - id: lbl-sea
    kind: sea
    text: 日本海
    path: [[55, 65], [85, 50], [115, 42]]

callouts:
  - from: el-panda        # item ID, [x, y], or { lon, lat }
    to: lbl-chengdu
    bendY: -2.0

compass:
  placement: auto         # auto-places in empty sea (falling back to any free space)
  r: 7.5

cartouche:
  placement: auto         # auto-places in empty sea (falling back to any free space)
  w: 78
  h: 42
  country: 四川省
  subtitle: SICHUAN · 天府之国
  flag: CHN
  lang: zh
  capital: 成都 Chengdu
  language: 中文
  facts:
    - "名胜: 三星堆 · 乐山大佛"

insets:
  - id: inset-1
    x: 222
    y: 130
    w: 62
    h: 50
    title: Detail Inset

layout:
  autoPlace: true         # place `placement: auto` items in empty regions
  avoidOverlap: true      # nudge movable labels & elements by descending priority
  padding: 1.5            # minimum mm clearance between resolved items
```

## Iterative AI Authoring Loop (`--fast --auto-layout --diagnostics`)

Follow this tight feedback loop when generating any new map:

1. **Inspect**: Run `inspect countries`, `inspect admin1`, `inspect places`, `inspect rivers`, `inspect elements`, `inspect flags`, and `inspect fonts` with `--json` to ground real geography and asset names.
2. **Draft Spec**: Write `<map>.yaml` using `placement: auto` for `cartouche`/`compass`, `layout: { autoPlace: true, avoidOverlap: true }`, real Natural Earth layers (`auto: true`), built-in icons, and inline `type: svg` for custom local landmarks.
3. **Plan (Zero-Raster Check)**: Run `handdrawn-map inspect spec <map>.yaml --json` to verify schema validity, projection, and initial layout diagnostics.
4. **Fast Render + Diagnostics**: Run `handdrawn-map render <map>.yaml -o out/<map>-fast.png --fast --auto-layout --diagnostics -`.
5. **Diagnose & Refine**: Inspect the diagnostics JSON:
   - `overlaps`: Check `overlapCount` (target `0`). If any `fixed: true` items collide, adjust coordinates or set `fixed: false` with appropriate `priority` (higher priority stays anchored).
   - `outOfBounds`: Check `outOfBoundsCount` (target `0`).
   - `emptyRegions`: Inspect open `sea` rectangles if you want to manually place insets or sea labels.
6. **Final HD Render**: Once `overlapCount === 0` and `outOfBoundsCount === 0` and the fast preview looks balanced, render the final plate with `--hd`.

## Private Local SVG Asset Library (`assets`)

Inline `type: svg` illustrations can be saved locally for reuse across future maps **without ever modifying the repository or syncing to anyone else**:

```bash
# Save inline SVGs from a spec into your private local folder (~/.handdrawn-map/elements/)
handdrawn-map render my-map.yaml -o out/my-map.png --hd --save-assets
# Or extract without rendering:
handdrawn-map assets save my-map.yaml

# List available local private + repo built-in SVG assets
handdrawn-map assets list --json
handdrawn-map assets path
```

- Saved SVGs live strictly in your local machine's `~/.handdrawn-map/elements/<name>.svg` (override with `HANDDRAWN_MAP_ASSETS_DIR` or `--asset-dir <dir>`).
- Once saved, any future spec can reference the asset directly by name (e.g. `type: baobab`) instead of repeating the inline `<svg>`.
- The repository's `assets/elements/` folder is read-only by default; only a maintainer explicitly passing `--to-repo` writes into it.

