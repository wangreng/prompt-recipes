import React from 'react';
import { AppId } from '../types';

interface RunRect {
  x: number;
  y: number;
  w: number;
  color: string;
}

function gridToRuns(grid: string[], palette: Record<string, string>): RunRect[] {
  const rects: RunRect[] = [];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      const color = palette[ch];
      if (!color) {
        x++;
        continue;
      }
      let end = x + 1;
      while (end < row.length && row[end] === ch) {
        end++;
      }
      rects.push({ x, y, w: end - x, color });
      x = end;
    }
  }
  return rects;
}

function renderPixelSvg(
  width: number,
  height: number,
  rects: RunRect[],
  size: number | { w: number; h: number },
  className?: string
) {
  const w = typeof size === 'number' ? size : size.w;
  const h = typeof size === 'number' ? size : size.h;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
      style={{ display: 'block', imageRendering: 'pixelated' }}
    >
      {rects.map((r, idx) => (
        <rect key={idx} x={r.x} y={r.y} width={r.w} height={1} fill={r.color} />
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// 1. MY GEMTOP: Gray CRT monitor on wider desktop base, dark-green screen with colorful pixelated globe
// ---------------------------------------------------------------------------
const MY_GEMTOP_GRID = [
  '................................',
  '................................',
  '......KKKKKKKKKKKKKKKKKKKK......',
  '.....KLLLLLLLLLLLLLLLLLLLDK.....',
  '.....KLDDDDDDDDDDDDDDDDDDDK.....',
  '.....KLDGGGGGGGGGGGGGGGGDDK.....',
  '.....KLDGGGGGKKKKKKGGGGGDDK.....',
  '.....KLDGGGGKBBEEBBKGGGGDDK.....',
  '.....KLDGGGKBBEEEEBBKGGGDDK.....',
  '.....KLDGGGKBBBBYEEBKGGGDDK.....',
  '.....KLDGGGKBEBBYYBBKGGGDDK.....',
  '.....KLDGGGKBBEEBBBBKGGGDDK.....',
  '.....KLDGGGGKBBEEBBKGGGGDDK.....',
  '.....KLDGGGGGKKKKKKGGGGGDDK.....',
  '.....KLDGGGGGGGGGGGGGGGGDDK.....',
  '.....KLDggggggggggggggggDDK.....',
  '.....KLMMMMMMMMMMMMMMMMMMDK.....',
  '.....KLMDDDDDDDDDDDDDDDDMDK.....',
  '......KKKKKKKKKKKKKKKKKKKK......',
  '..........KKDDDDDDDDKK..........',
  '.........KMMDDDDDDDDMMK.........',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '..KLLLLLLLLLLLLLLLLLLLLLLLLLDK..',
  '..KLMMMMMMMMMMMMMMMMMMMMMMMMDK..',
  '..KLMDDKKKKKKKKDDDDDDMMGGMMMDK..',
  '..KLMDDDDDDDDDDDDDDDDMMMMMMMDK..',
  '..KLMMMMMMMMMMMMMMMMDKDMDKDMDK..',
  '..KLDDDDDDDDDDDDDDDDDDDDDDDDDK..',
  '...KKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '................................',
  '................................',
  '................................',
];

const MY_GEMTOP_PALETTE: Record<string, string> = {
  K: '#1e1e1e',
  L: '#deded6',
  M: '#bdbdb5',
  D: '#84847c',
  G: '#194a2d',
  g: '#123821',
  B: '#3b78ab',
  E: '#5ba254',
  Y: '#c7b052',
};

const MY_GEMTOP_RUNS = gridToRuns(MY_GEMTOP_GRID, MY_GEMTOP_PALETTE);

// ---------------------------------------------------------------------------
// 2. CHROME: Muted four-color Chrome wheel, dark outlines (computed cleanly on 32x32 grid)
// ---------------------------------------------------------------------------
function buildChromeRuns(): RunRect[] {
  const N = 32;
  const cx = 15.5;
  const cy = 15.5;
  const rOuter = 13.3;
  const rWhite = 6.7;
  const rBlue = 4.5;

  // Classify interior pixel zone
  const zone: string[][] = Array.from({ length: N }, () => Array(N).fill('.'));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > rOuter) continue;

      if (dist <= rBlue) {
        zone[y][x] = dx + dy < -1.5 ? 'b' : 'B';
      } else if (dist <= rWhite) {
        zone[y][x] = 'W';
      } else {
        // Compute tangent-shifted polar angle for classic 3-arm Chrome wheel
        const ang = Math.atan2(dy, dx);
        const shift = Math.asin(Math.min(0.95, 4.4 / dist));
        let eff = ang + shift;
        while (eff < -Math.PI) eff += Math.PI * 2;
        while (eff >= Math.PI) eff -= Math.PI * 2;

        const deg = (eff * 180) / Math.PI;
        let color = 'G';
        if (deg >= -140 && deg < -20) {
          color = dist > 11.4 ? 'r' : 'R';
        } else if (deg >= -20 && deg < 100) {
          color = dist > 11.4 ? 'y' : 'Y';
        } else {
          color = dist > 11.4 ? 'g' : 'G';
        }
        zone[y][x] = color;
      }
    }
  }

  // Add crisp 1px dark outlines on outer rim, inner rings, and wedge seams
  const out: string[][] = zone.map((r) => [...r]);
  const baseGroup = (ch: string) => ch.toUpperCase();

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const c = zone[y][x];
      if (c === '.') continue;
      const g = baseGroup(c);
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];
      let isBorder = false;
      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= N || ny < 0 || ny >= N) {
          isBorder = true;
          break;
        }
        const nc = zone[ny][nx];
        if (nc === '.') {
          isBorder = true;
          break;
        }
        const ng = baseGroup(nc);
        if (ng !== g) {
          // Draw dark outline on the outer/darker side of transitions
          if (g === 'W' || ng === 'W') {
            if (g === 'W') isBorder = true;
          } else if (
            (g === 'R' && ng === 'Y') ||
            (g === 'Y' && ng === 'G') ||
            (g === 'G' && ng === 'R')
          ) {
            isBorder = true;
          }
        }
      }
      if (isBorder) {
        out[y][x] = 'K';
      }
    }
  }

  // Ensure crisp white ring remains cleanly visible between outer K and inner K
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const dist = Math.hypot(x - cx, y - cy);
      if (dist > 4.9 && dist <= 6.2) {
        out[y][x] = 'W';
      } else if (dist > 4.0 && dist <= 4.9) {
        out[y][x] = 'K';
      } else if (dist > 6.2 && dist <= 7.1) {
        out[y][x] = 'K';
      }
    }
  }

  const palette: Record<string, string> = {
    K: '#1f1f1f',
    R: '#b84b42',
    r: '#983a32',
    Y: '#cca542',
    y: '#ab8730',
    G: '#4d8d57',
    g: '#3a7143',
    B: '#4476a8',
    b: '#6999c7',
    W: '#e5e3da',
  };

  return gridToRuns(out.map((r) => r.join('')), palette);
}

const CHROME_RUNS = buildChromeRuns();

// ---------------------------------------------------------------------------
// 3. GEMNOTES: Muted-gray notepad window (gray title bar + tiny colored dots),
//    spiral edge, lined paper, blue sparkle, GRAY (not yellow) diagonal pencil
// ---------------------------------------------------------------------------
const GEMNOTES_GRID_FIXED = [
  '................................',
  '................................',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTTK...',
  '..KT1T2T3TTTTTTTTTTTTTTTTTTTK...',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTTK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '.KKPKKPKKPKKPKKPKKPKKPKKPKKPKKK.',
  '..KPPPPPPPPPPPPPPPPPPPPPPPPKEEK.',
  '.KKPPPPPPPPPPPPPPPPPPPPPPPKGGGK.',
  '..KPPPLLLLLLLLLLLLLLLLLLLKGGGHK.',
  '.KKPPPPPPPBPPPPPPPPPPPPPKGGGHK..',
  '..KPPPPPPBJBPPPPPPPPPPPKGGGHK...',
  '.KKPPPLLBJJJBLPPPPPPPPKGGGHKK...',
  '..KPPPPPPBJBPPPPPPPPPKGGGHKPK...',
  '.KKPPPPPPPBPPPPPPPPPKGGGHKPPK...',
  '..KPPPLLLLLLLLLLLLLKGGGHKLLPK...',
  '.KKPPPPPPPPPPPPPPPKGGGHKPPPPK...',
  '..KPPPPPPPPPPPPPPKGGGHKPPPPPK...',
  '.KKPPPLLLLLLLLLLKGGGHKLLLLLPK...',
  '..KPPPPPPPPPPPPKWWWHKPPPPPPPK...',
  '.KKPPPPPPPPPPPKWWWKPPPPPPPPPK...',
  '..KPPPLLLLLLLKWWWKPLLLLLLLLPK...',
  '.KKPPPPPPPPPKKKWKPPPPPPPPPPPK...',
  '..KPPPPPPPPPKKKPPPPPPPPPPPPPK...',
  '.KKPPPLLLLLLLLLLLLLLLLLLLLLPK...',
  '..KPPPPPPPPPPPPPPPPPPPPPPPPPK...',
  '..KDDDDDDDDDDDDDDDDDDDDDDDDDK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKK...',
  '................................',
  '................................',
  '................................',
];

const GEMNOTES_PALETTE: Record<string, string> = {
  K: '#1f1f1f',
  T: '#929292', // Gray title bar (NOT blue!)
  '1': '#b55650', // Tiny muted red dot
  '2': '#bfa24a', // Tiny muted yellow dot
  '3': '#5a8c5c', // Tiny muted green dot
  P: '#e8e7df', // Lined paper off-white
  L: '#b4bac2', // Ruled lines
  D: '#b4b4ac', // Bottom window shadow
  B: '#3e76c4', // Blue sparkle outer
  J: '#7fb2f0', // Blue sparkle highlight
  G: '#9e9e9e', // Gray pencil body (NOT yellow!)
  H: '#727272', // Gray pencil shadow
  E: '#beb6b6', // Muted gray-pink eraser cap
  W: '#cfc6b2', // Wood tip
};

const GEMNOTES_RUNS = gridToRuns(GEMNOTES_GRID_FIXED, GEMNOTES_PALETTE);

// ---------------------------------------------------------------------------
// 4. GEMPAINT: Muted-gray paint window (gray title bar + tiny colored dots),
//    gray tool strip, olive-green canvas with rainbow stroke, dark diagonal brush
// ---------------------------------------------------------------------------
const GEMPAINT_GRID = [
  '................................',
  '................................',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKK....',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTK....',
  '..KT1T2T3TTTTTTTTTTTTTTTTTTK....',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTK....',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKK....',
  '..KSSSSSKDDDDDDDDDDDDDDDDDDK....',
  '..KSssSSKDOOOOOOOOOOOOOOOODK....',
  '..KSssSSKDOOOOOOOOOOOOOOOODK....',
  '..KSSSSSKDOOORROOOOOOOOOOODK....',
  '..KSssSSKDOORRRROOOOOOOOOODK....',
  '..KSssSSKDOORRYYROOOOOOOOODK....',
  '..KSSSSSKDOOOYYEEYOOOOOOOODK....',
  '..KSssSSKDOOOOEEBBEOOOOOOODK....',
  '..KSssSSKDOOOOOOBBKKOOOOOODK....',
  '..KSSSSSKDOOOOOOKBBKOOOOOODK....',
  '..KSssSSKDOOOOOOKKKCKOOOOODK....',
  '..KSssSSKDOOOOOOOOKCCKOOOODK....',
  '..KSSSSSKDOOOOOOOOOKCCKOOODK....',
  '..KSssSSKDOOOOOOOOOOKMMKOODK....',
  '..KSssSSKDOOOOOOOOOOOKMMKODK....',
  '..KSSSSSKDOOOOOOOOOOOOKHHKDK....',
  '..KSssSSKDOOOOOOOOOOOOOKHHKK....',
  '..KSSSSSKDDDDDDDDDDDDDDKHHHKK...',
  '..KKKKKKKKKKKKKKKKKKKKKKKHHHK...',
  '.........................KHHHK..',
  '..........................KHHK..',
  '...........................KK...',
  '................................',
  '................................',
  '................................',
];

const GEMPAINT_PALETTE: Record<string, string> = {
  K: '#1d1d1d',
  T: '#929292', // Gray title bar (NOT blue!)
  '1': '#b55650',
  '2': '#bfa24a',
  '3': '#5a8c5c',
  S: '#a8a8a8', // Gray tool strip
  s: '#747474', // Tiny tool squares
  D: '#525e38', // Sunken olive border
  O: '#697845', // Olive-green canvas
  R: '#b84b42', // Rainbow red/orange
  Y: '#cbb046', // Rainbow yellow
  E: '#559250', // Rainbow green
  B: '#4476aa', // Rainbow blue
  C: '#424248', // Brush bristles dark
  M: '#9c9ca2', // Metal ferrule
  H: '#2f2f34', // Dark diagonal brush handle
};

const GEMPAINT_RUNS = gridToRuns(GEMPAINT_GRID, GEMPAINT_PALETTE);

// ---------------------------------------------------------------------------
// 5. DOOM II: Compact dark-red pixel Cacodemon (~2/3 other icons' size),
//    tiny white horns, one eye, dark-blue mouth
// ---------------------------------------------------------------------------
const DOOM_GRID = [
  '.....KK........KK.....',
  '....KWWK..KK..KWWK....',
  '....KWK.KRRRRK.KWK....',
  '...KKRKRRRRRRRRKRKK...',
  '..KRRRRRRRRRRRRRRRRK..',
  '.KWWKRRRrrrrrrRRRKWWK.',
  '..KKRRRRrRRRRrRRRRKK..',
  '.KRRRRRRKGGGGKRRRRRRK.',
  '.KRRRRRKGGKKGGKRRRRRK.',
  '.KRRRRRKGGKKGGKRRRRRK.',
  '.KRRRRRRKGGGGKRRRRRRK.',
  '.KRRRRRRRKKKKRRRRRRRK.',
  '.KRRRRRRRRRRRRRRRRRRK.',
  '.KRRRKWWWWWWWWWWKRRRK.',
  '.KRRKBBBBBBBBBBBBKRRK.',
  '..KRKBBWBBBBBBWBBKRK..',
  '..KRRKBBBBBBBBBBKRRK..',
  '...KRRKWWBBBBWWKRRK...',
  '...KrrrrKKKKKKKKrrK...',
  '....KrrrrRRRRrrrrK....',
  '.....KKKKKKKKKKKK.....',
  '......................',
];

const DOOM_PALETTE: Record<string, string> = {
  K: '#190b0b',
  R: '#8c2323', // Dark-red body
  r: '#631515', // Deeper crimson shade
  W: '#e4e0d8', // Tiny white horns & fangs
  G: '#86b842', // Single green eye
  B: '#1d2f63', // Dark-blue mouth
};

const DOOM_RUNS = gridToRuns(DOOM_GRID, DOOM_PALETTE);

// ---------------------------------------------------------------------------
// 6. GEMINI CHAT: Off-white/ivory (NOT pure white) rounded-square tile,
//    dark border, centered blue-purple four-point star
// ---------------------------------------------------------------------------
const GEMINI_CHAT_GRID = [
  '................................',
  '................................',
  '................................',
  '......KKKKKKKKKKKKKKKKKKKK......',
  '....KKHHHHHHHHHHHHHHHHHHHHKK....',
  '...KHHIIIIIIIIIIIIIIIIIIIIHHK...',
  '...KHIIIIIIIIIIIIIIIIIIIIIIHK...',
  '..KHIIIIIIIIIIIIIIIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIIKKIIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIKPPKIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIKPPKIIIIIIIIIIHK..',
  '..KHIIIIIIIIIKPPPPKIIIIIIIIIHK..',
  '..KHIIIIIIIIKPPVVPPKIIIIIIIIHK..',
  '..KHIIIIIIIKPPVVVVPPKIIIIIIIHK..',
  '..KHIIIIKKKPVVVBBVVVPKKKIIIIHK..',
  '..KHIIIKPPVVVBBBBBBVVVPPKIIIHK..',
  '..KHIIIKPPVVVBBBBBBVVVPPKIIIHK..',
  '..KHIIIIKKKPVVVBBVVVPKKKIIIIHK..',
  '..KHIIIIIIIKPPVVVVPPKIIIIIIIHK..',
  '..KHIIIIIIIIKPPVVPPKIIIIIIIIHK..',
  '..KHIIIIIIIIIKPPPPKIIIIIIIIIHK..',
  '..KHIIIIIIIIIIKBBKIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIKBBKIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIIKKIIIIIIIIIIIHK..',
  '..KHIIIIIIIIIIIIIIIIIIIIIIIISK..',
  '...KHIIIIIIIIIIIIIIIIIIIIIISK...',
  '...KSSIIIIIIIIIIIIIIIIIIIIISK...',
  '....KKSSSSSSSSSSSSSSSSSSSSKK....',
  '......KKKKKKKKKKKKKKKKKKKK......',
  '................................',
  '................................',
  '................................',
];

const GEMINI_CHAT_PALETTE: Record<string, string> = {
  K: '#232328', // Dark border
  I: '#eae4d3', // Off-white / warm ivory (NOT pure white!)
  H: '#f2ede0', // Subtle ivory bevel highlight
  S: '#d2cab6', // Subtle ivory bevel shadow
  P: '#745cc8', // Purple outer star
  V: '#5d6fd2', // Blue-purple mid star
  B: '#4682dc', // Blue inner star
};

const GEMINI_CHAT_RUNS = gridToRuns(GEMINI_CHAT_GRID, GEMINI_CHAT_PALETTE);

// ---------------------------------------------------------------------------
// 7. GEMSWEEPER: Muted-gray window (gray title bar + tiny colored dots),
//    gray grid with monochrome black digits on left, spiky black mine on right (NO orange explosion)
// ---------------------------------------------------------------------------
const GEMSWEEPER_GRID = [
  '................................',
  '................................',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTTTK..',
  '..KT1T2T3TTTTTTTTTTTTTTTTTTTTK..',
  '..KTTTTTTTTTTTTTTTTTTTTTTTTTTK..',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '..KGGGGGGDGGGGGGDGGGGGGDGGGGGK..',
  '..KGHHGGGDGHHGGGDGGGGGGDGGGGGK..',
  '..KGGKGGGDGKKKGGDGGGGGGDGGGGGK..',
  '..KGGKGGGDGGGKGGDGGGGKGDGGGGGK..',
  '..KGGKGGGDGKKKGGDGGKGGKGGKGGGK..',
  '..KGGKGGGDGKGGGGDGGGKGGKGGKGGK..',
  '..KGGKGGGDGKKKGGDGGGKKKKKKGGGK..',
  '..KDDDDDDDDDDDDDDGGKKWWKKKKGGK..',
  '..KGGGGGGDGGGGGGDGKKKKKKKKKKGK..',
  '..KGGKKGGDGKKKGGDGKKKKKKKKKKGK..',
  '..KGKGGKGDGGGKGGDGGKKKKKKKKGGK..',
  '..KGGGGKGDGKKKGGDGGGKKKKKKGGGK..',
  '..KGGKKGGDGGGKGGDGGGKGGKGGKGGK..',
  '..KGGGGGGDGKKKGGDGGKGGKGGKGGGK..',
  '..KDDDDDDDDDDDDDDGGGGKGDGGGGGK..',
  '..KGGGGGGDGGGGGGDGGGGGGDGGGGGK..',
  '..KGGKGGGDGKKKGGDGGGGGGDGGGGGK..',
  '..KGGKGGGDGKGGGGDGGGGGGDGGGGGK..',
  '..KGGKGGGDGKKKGGDGGGGGGDGGGGGK..',
  '..KGGGGGGDGGGGGGDGGGGGGDGGGGGK..',
  '..KDDDDDDDDDDDDDDDDDDDDDDDDDDK..',
  '..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..',
  '................................',
  '................................',
  '................................',
];

const GEMSWEEPER_PALETTE: Record<string, string> = {
  K: '#181818', // Monochrome black digits + spiky black mine + dark outline
  T: '#929292', // Gray title bar (NOT blue!)
  '1': '#b55650',
  '2': '#bfa24a',
  '3': '#5a8c5c',
  G: '#b8b8b8', // Muted gray grid cells
  H: '#cccccc', // Subtle cell bevel highlight
  D: '#828282', // Grid dividers
  W: '#e0e0e0', // Specular glint on black mine
};

const GEMSWEEPER_RUNS = gridToRuns(GEMSWEEPER_GRID, GEMSWEEPER_PALETTE);

// ---------------------------------------------------------------------------
// Image Viewer tiny icon
// ---------------------------------------------------------------------------
const IMAGE_VIEWER_GRID = [
  '................',
  '.KKKKKKKKKKKKKK.',
  '.KTTTTTTTTTTTTK.',
  '.KKKKKKKKKKKKKK.',
  '.KBBBBBBBBBBBBK.',
  '.KBBYYBBBBBBBBK.',
  '.KBBYYBBBBBBBBK.',
  '.KBBBBBBGGBBBBK.',
  '.KBBBGGBGGGBBBK.',
  '.KBBGGGGGGGGBBK.',
  '.KGGGGGGGGGGGGK.',
  '.KGGGGGGGGGGGGK.',
  '.KKKKKKKKKKKKKK.',
  '................',
  '................',
  '................',
];

const IMAGE_VIEWER_PALETTE: Record<string, string> = {
  K: '#1e1e1e',
  T: '#929292',
  B: '#7ea8cf',
  Y: '#d9c45b',
  G: '#538a4c',
};

const IMAGE_VIEWER_RUNS = gridToRuns(IMAGE_VIEWER_GRID, IMAGE_VIEWER_PALETTE);

// ---------------------------------------------------------------------------
// START BUTTON: Tall, upright pixelated purple-to-blue "Gemini" wordmark (black outline)
// + black-outlined blue four-point star centered on top
// ---------------------------------------------------------------------------
const GEMINI_WORDMARK_MASK = [
  '.....................................................',
  '..######.........................###............###..',
  '.########........................###............###..',
  '.###..###........................###............###..',
  '.###.................................................',
  '.###........######...####.####...###..#######...###..',
  '.###.......########..#########...###..########..###..',
  '.###.......###..###..###.##.##...###..###..###..###..',
  '.###.####..########..###.##.##...###..###..###..###..',
  '.###.####..########..###.##.##...###..###..###..###..',
  '.###..###..###.......###.##.##...###..###..###..###..',
  '.###..###..###..###..###.##.##...###..###..###..###..',
  '.########..########..###.##.##...###..###..###..###..',
  '..######....######...###.##.##...###..###..###..###..',
  '.....................................................',
];

function buildGeminiWordmarkRuns(): { w: number; h: number; rects: RunRect[] } {
  const h = GEMINI_WORDMARK_MASK.length;
  const w = GEMINI_WORDMARK_MASK[0].length;
  const rects: RunRect[] = [];

  // Purple (#9a4ee8) on left/top to retro blue (#2d8cf0) on right/bottom
  const stops = [
    '#a34be8',
    '#9154ea',
    '#7e5eec',
    '#6a69ee',
    '#5576f0',
    '#4284f2',
    '#3092f4',
  ];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const isFill = GEMINI_WORDMARK_MASK[y][x] === '#';
      if (isFill) {
        const t = Math.min(0.999, Math.max(0, (x / w) * 0.72 + (y / h) * 0.28));
        const color = stops[Math.floor(t * stops.length)];
        rects.push({ x, y, w: 1, color });
      } else {
        // 8-neighbor check for crisp 1px black outline
        let touches = false;
        for (let dy = -1; dy <= 1 && !touches; dy++) {
          for (let dx = -1; dx <= 1 && !touches; dx++) {
            if (dx === 0 && dy === 0) continue;
            const ny = y + dy;
            const nx = x + dx;
            if (ny >= 0 && ny < h && nx >= 0 && nx < w && GEMINI_WORDMARK_MASK[ny][nx] === '#') {
              touches = true;
            }
          }
        }
        if (touches) {
          rects.push({ x, y, w: 1, color: '#000000' });
        }
      }
    }
  }
  return { w, h, rects };
}

const GEMINI_WORDMARK_DATA = buildGeminiWordmarkRuns();

// Black-outlined blue four-point star sitting centered on top of Start button
const START_STAR_GRID = [
  '.......K.......',
  '......KBK......',
  '......KBK......',
  '.....KBBBK.....',
  '.....KBLBK.....',
  '....KBLLLBK....',
  '.KKKBBLLLBBKKK.',
  'KBBBBLLLLLBBBBK',
  '.KKKBBLLLBBKKK.',
  '....KBLLLBK....',
  '.....KBLBK.....',
  '.....KBBBK.....',
  '......KBK......',
  '......KBK......',
  '.......K.......',
];

const START_STAR_PALETTE: Record<string, string> = {
  K: '#000000',
  B: '#367ae8',
  L: '#6cb0ff',
};

const START_STAR_RUNS = gridToRuns(START_STAR_GRID, START_STAR_PALETTE);

// ---------------------------------------------------------------------------
// Exported Components
// ---------------------------------------------------------------------------

export const GeminiWordmark: React.FC = () =>
  renderPixelSvg(
    GEMINI_WORDMARK_DATA.w,
    GEMINI_WORDMARK_DATA.h,
    GEMINI_WORDMARK_DATA.rects,
    { w: 72, h: 24 }
  );

export const StartBlueStar: React.FC = () =>
  renderPixelSvg(15, 15, START_STAR_RUNS, 16);

export const AppPixelIcon: React.FC<{
  appId: AppId;
  size?: number;
  isDesktop?: boolean;
}> = ({ appId, size = 52, isDesktop = false }) => {
  switch (appId) {
    case 'my-gemtop':
      return renderPixelSvg(32, 32, MY_GEMTOP_RUNS, size);
    case 'chrome':
      return renderPixelSvg(32, 32, CHROME_RUNS, size);
    case 'gemnotes':
      return renderPixelSvg(32, 32, GEMNOTES_RUNS, size);
    case 'gempaint':
      return renderPixelSvg(32, 32, GEMPAINT_RUNS, size);
    case 'doom-ii': {
      // On desktop, Cacodemon is compact (~2/3 the size of the other icons)
      const cacoSize = isDesktop ? Math.round(size * 0.67) : size;
      return renderPixelSvg(22, 22, DOOM_RUNS, cacoSize);
    }
    case 'gemini-chat':
      return renderPixelSvg(32, 32, GEMINI_CHAT_RUNS, size);
    case 'gemsweeper':
      return renderPixelSvg(32, 32, GEMSWEEPER_RUNS, size);
    case 'image-viewer':
      return renderPixelSvg(16, 16, IMAGE_VIEWER_RUNS, size);
  }
};

// Extra retro pixel sprites for File Explorer, Minesweeper, and GemPaint Robot
const DRIVE_C_GRID = [
  '........................',
  '........................',
  '........................',
  '........................',
  '....KKKKKKKKKKKKKKKK....',
  '...KLLLLLLLLLLLLLLLLK...',
  '..KLLLLLLLLLLLLLLLLLLK..',
  '.KKKKKKKKKKKKKKKKKKKKKK.',
  '.KMMMMMMMMMMMMMMMMMMMMK.',
  '.KMMDDDDDDDDDDDDDDGGMMK.',
  '.KMMMMMMMMMMMMMMMMMMMMK.',
  '.KDDDDDDDDDDDDDDDDDDDDK.',
  '.KKKKKKKKKKKKKKKKKKKKKK.',
  '........................',
  '........................',
  '........................',
];

const DRIVE_C_RUNS = gridToRuns(DRIVE_C_GRID, {
  K: '#1f1f1f',
  L: '#dcdcd4',
  M: '#b4b4ac',
  D: '#6c6c66',
  G: '#4ea84e',
});

export const DriveCIcon: React.FC<{ size?: number }> = ({ size = 44 }) =>
  renderPixelSvg(24, 16, DRIVE_C_RUNS, { w: size, h: Math.round((size * 16) / 24) });

const JPG_FILE_GRID = [
  '..KKKKKKKKKKK.....',
  '..KWWWWWWWWWKK....',
  '..KWWWWWWWWWKWK...',
  '..KWWWWWWWWWKKKK..',
  '..KWBBBBBBBBWWWK..',
  '..KWBYYBBBBBWWWK..',
  '..KWBBBBGGBBWWWK..',
  '..KWBBGGGGGBWWWK..',
  '..KWGGGGGGGGWWWK..',
  '..KWWWWWWWWWWWWK..',
  '..KWDDDWDDDWDDWK..',
  '..KWWWWWWWWWWWWK..',
  '..KKKKKKKKKKKKKK..',
  '..................',
];

const JPG_FILE_RUNS = gridToRuns(JPG_FILE_GRID, {
  K: '#1f1f1f',
  W: '#f4f4ee',
  B: '#6a9fd0',
  Y: '#d9c04e',
  G: '#4e8a4a',
  D: '#808080',
});

export const JpgFileIcon: React.FC<{ size?: number }> = ({ size = 42 }) =>
  renderPixelSvg(18, 14, JPG_FILE_RUNS, { w: size, h: Math.round((size * 14) / 18) });

// Minesweeper spiky black mine & red flag
const MINE_CELL_GRID = [
  '.......K.......',
  '.......K.......',
  '..K....K....K..',
  '...K..KKK..K...',
  '....KKKKKKK....',
  '...KKWWKKKKK...',
  '...KKWWKKKKK...',
  'KKKKKKKKKKKKKKK',
  '...KKKKKKKKK...',
  '...KKKKKKKKK...',
  '....KKKKKKK....',
  '...K..KKK..K...',
  '..K....K....K..',
  '.......K.......',
  '.......K.......',
];

const MINE_CELL_RUNS = gridToRuns(MINE_CELL_GRID, { K: '#111111', W: '#ffffff' });

export const PixelMineIcon: React.FC<{ size?: number }> = ({ size = 16 }) =>
  renderPixelSvg(15, 15, MINE_CELL_RUNS, size);

const FLAG_CELL_GRID = [
  '.......K.......',
  '.....RRK.......',
  '...RRRRK.......',
  '..RRRRRK.......',
  '....RRRK.......',
  '.......K.......',
  '.......K.......',
  '.......K.......',
  '......KKK......',
  '....KKKKKKK....',
  '...KKKKKKKKK...',
  '...............',
];

const FLAG_CELL_RUNS = gridToRuns(FLAG_CELL_GRID, { K: '#111111', R: '#dd1a1a' });

export const PixelFlagIcon: React.FC<{ size?: number }> = ({ size = 16 }) =>
  renderPixelSvg(15, 12, FLAG_CELL_RUNS, { w: size, h: Math.round((size * 12) / 15) });

// GemPaint Clippy-style retro robot sprite
const CLIPPY_ROBOT_GRID = [
  '..........KK..........',
  '.........KBBK.........',
  '..........KK..........',
  '..........KK..........',
  '....KKKKKKKKKKKKKK....',
  '...KLLLLLLLLLLLLLLK...',
  '..KLDDDDDDDDDDDDDDLK..',
  '..KLDSSSSSSSSSSSSDLK..',
  '..KLDSWWKKSSWWKKSDLK..',
  '..KLDSWWKKSSWWKKSDLK..',
  '..KLDSSSSSSSSSSSSDLK..',
  '..KLDSKSSSSSSSSKSDLK..',
  '..KLDSSKKKKKKKKSSDLK..',
  '..KLDDDDDDDDDDDDDDLK..',
  '...KMMMMMMMMMMMMMMK...',
  '....KKKKKKKKKKKKKK....',
  '......KMMKKKKMMK......',
  '....KKMMMMMMMMMMKK....',
  '...KMMKMMBMMBMMKMMK...',
  '...KMMKMMMMMMMMKMMK...',
  '....KKKMMMMMMMMKKK....',
  '......KKKKKKKKKK......',
];

const CLIPPY_ROBOT_RUNS = gridToRuns(CLIPPY_ROBOT_GRID, {
  K: '#1a1a1a',
  L: '#dcdcd4',
  M: '#a8a8a2',
  D: '#6c6c68',
  S: '#254a42',
  W: '#ffffff',
  B: '#4a88e8',
});

export const ClippyRobotSprite: React.FC<{ size?: number }> = ({ size = 58 }) =>
  renderPixelSvg(22, 22, CLIPPY_ROBOT_RUNS, size);
