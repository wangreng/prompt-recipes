/* ==========================================================================
   Trazo — 71 Hand-Drawn Wax-Crayon Sticker Specimens across 7 Neighborhoods
   4 featured marine creatures showcase site/art/ref*.png directly; all 71
   include handcrafted wax-pastel SVG markup for live recoloring & export.
   ========================================================================== */

window.TRAZO_ZONES = [
  { id: 'marine',     label: 'Marine life',       heading: 'marine life',       x: 0,    y: -378, rot: -1.5, count: 16 },
  { id: 'arrows',     label: 'Arrows & flow',     heading: 'arrows & flow',     x: -990, y: -265, rot: -2.2, count: 10 },
  { id: 'nature',     label: 'Weather & nature',  heading: 'weather & nature',  x: 0,    y: -555, rot: 1.4,  count: 10 },
  { id: 'sparks',     label: 'Hearts & sparks',   heading: 'hearts & sparks',   x: 1005, y: -275, rot: 2.0,  count: 12 },
  { id: 'editorial',  label: 'Editorial marks',   heading: 'editorial marks',   x: 0,    y: 488,  rot: -1.2, count: 10 },
  { id: 'felines',    label: 'Playful felines',   heading: 'playful felines',   x: 930,  y: 455,  rot: 2.4,  count: 8  },
  { id: 'characters', label: 'Character pals',    heading: 'character pals',    x: -930, y: 455,  rot: -2.0, count: 5  }
];

window.TRAZO_PALETTES = {
  original: { label: 'Original', swatch: 'original' },
  ink:      { label: 'Ink',      swatch: '#1c1b19', outline: '#1c1b19', fill: '#d4d2cd', shade: '#9e9b95', tint: '#efede9' },
  red:      { label: 'Red',      swatch: '#e5484d', outline: '#a6262c', fill: '#f9969b', shade: '#e5484d', tint: '#ffe1e3' },
  orange:   { label: 'Orange',   swatch: '#f76b15', outline: '#b4460a', fill: '#fdb37b', shade: '#f76b15', tint: '#ffebd9' },
  yellow:   { label: 'Yellow',   swatch: '#eab308', outline: '#a16207', fill: '#fde07a', shade: '#eab308', tint: '#fef7d1' },
  green:    { label: 'Green',    swatch: '#22a06b', outline: '#146c47', fill: '#86dfb5', shade: '#22a06b', tint: '#dcfce9' },
  sky:      { label: 'Sky',      swatch: '#0ea5e9', outline: '#0369a1', fill: '#8bd9fb', shade: '#0ea5e9', tint: '#e0f5fe' },
  cobalt:   { label: 'Cobalt',   swatch: '#3b5bdb', outline: '#253b9e', fill: '#9bb1f8', shade: '#3b5bdb', tint: '#e4ebff' },
  pink:     { label: 'Pink',     swatch: '#ec4899', outline: '#a82266', fill: '#faa5d0', shade: '#ec4899', tint: '#ffe3f1' }
};

/* Helper: wraps crayon SVG primitives in a clean 120x120 viewBox */
function mkSvg(inner) {
  return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

/* Cute crayon face helper */
function cuteFace(cx, cy, spread = 11, cheekY = 6, scale = 1) {
  const rx = 2.6 * scale, ry = 3.5 * scale;
  const crx = 6.2 * scale, cry = 3.4 * scale;
  return `
    <ellipse cx="${cx - spread}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2b201c"/>
    <ellipse cx="${cx + spread}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2b201c"/>
    <ellipse class="s-cheek" cx="${cx - spread - 6 * scale}" cy="${cy + cheekY * scale}" rx="${crx}" ry="${cry}" fill="#f59e95" opacity="0.72"/>
    <ellipse class="s-cheek" cx="${cx + spread + 6 * scale}" cy="${cy + cheekY * scale}" rx="${crx}" ry="${cry}" fill="#f59e95" opacity="0.72"/>
    <path d="M${cx - 2.6 * scale} ${cy + 4.4 * scale}q${2.6 * scale} ${2.5 * scale} ${5.2 * scale} 0" stroke="#2b201c" stroke-width="${2 * scale}" stroke-linecap="round"/>
  `;
}

window.TRAZO_STICKERS = [
  /* ========================================================================
     1. CENTER HALO — MARINE LIFE (16)
     ======================================================================== */
  {
    id: 'baby-squid', name: 'Baby squid', component: 'BabySquid', zone: 'marine',
    x: -365, y: -202, size: 128, rot: -5,
    art: 'art/ref01.png', clip: 'clip-ref01',
    tags: ['squid', 'purple', 'ocean', 'cute', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M52 16c18 1 32 22 30 37-1 8-7 13-13 15 11 4 21 1 25 8 4 6-3 15-12 16 4 6 0 13-8 11-5-1-10-5-12-8-1 8-6 15-13 13-5-1-7-7-7-12-5 7-13 13-19 10-6-3-4-11 1-17-9 4-17 1-17-5 0-6 8-11 14-14-4-10-5-22-1-32 4-11 13-22 24-22Z" fill="#d5bce0" stroke="#8f6b98" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-shade" d="M29 53c15 3 34-4 49-15-2 10-8 17-18 20-12 4-24 2-31-5Z" fill="#b48fbf" opacity="0.55"/>
      <ellipse cx="43" cy="36" rx="5" ry="12" transform="rotate(14 43 36)" fill="#ffffff" opacity="0.72"/>
      ${cuteFace(55, 65, 8, 5, 0.9)}
    `)
  },
  {
    id: 'conch-shell', name: 'Conch shell', component: 'ConchShell', zone: 'marine',
    x: -158, y: -278, size: 94, rot: -9,
    tags: ['shell', 'conch', 'beach', 'spiral', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M62 18c9 3 16 12 20 22 9 2 16 9 16 19 0 12-9 21-19 26-8 11-18 19-28 19-11 0-19-8-19-20 0-7 3-14 7-20-6-6-7-15-2-23 5-9 15-16 25-23Z" fill="#fbc59c" stroke="#c96f3b" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-shade" d="M35 61c16-4 36-11 54-20-1 9-5 17-12 23-14 6-28 10-44 10 0-5 1-9 2-13Z" fill="#f09764" opacity="0.65"/>
      <path class="s-outline" d="M40 43c12-1 26-6 37-13M34 65c16-2 35-8 50-17M40 84c14-1 27-6 37-14" stroke="#c96f3b" stroke-width="4.2" stroke-linecap="round"/>
      <ellipse cx="56" cy="34" rx="8" ry="3.5" transform="rotate(-24 56 34)" fill="#ffffff" opacity="0.75"/>
      <ellipse cx="49" cy="54" rx="10" ry="3.5" transform="rotate(-18 49 54)" fill="#ffffff" opacity="0.65"/>
    `)
  },
  {
    id: 'small-fish', name: 'Small fish', component: 'SmallFish', zone: 'marine',
    x: 8, y: -306, size: 92, rot: 4,
    tags: ['fish', 'blue', 'swim', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M84 58c10-12 20-18 24-12 4 6-2 15-8 18 7 4 12 12 7 18-5 5-15-2-23-12Z" fill="#63b3ed" stroke="#2c6ea3" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M48 33c7-11 19-12 24-3-8 4-16 6-24 3Z" fill="#63b3ed" stroke="#2c6ea3" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M18 62c4-18 22-30 43-29 19 1 32 13 32 28s-14 27-33 27c-21 0-40-10-42-26Z" fill="#9fd7fa" stroke="#2c6ea3" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-tint" d="M32 69c10 10 28 14 45 9-7 6-18 9-30 7-8-1-13-7-15-16Z" fill="#dff3ff" opacity="0.85"/>
      <ellipse cx="48" cy="46" rx="12" ry="4.5" transform="rotate(-12 48 46)" fill="#ffffff" opacity="0.75"/>
      <ellipse cx="34" cy="57" rx="3" ry="3.8" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="41" cy="64" rx="5.5" ry="3.2" fill="#f59e95" opacity="0.72"/>
      <path class="s-outline" d="M57 54c-4 5-4 11 0 16" stroke="#2c6ea3" stroke-width="4.2" stroke-linecap="round"/>
    `)
  },
  {
    id: 'seahorse', name: 'Seahorse', component: 'Seahorse', zone: 'marine',
    x: 178, y: -268, size: 132, rot: 5,
    art: 'art/ref04.png', clip: 'clip-ref04',
    tags: ['seahorse', 'yellow', 'orange', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M58 17c15 2 27 15 27 32 0 11-5 19-9 25 5 4 7 12 2 18-6 10-16 14-27 11-11-3-16-14-10-22 4-5 12-5 14 1 1 4-2 7-5 7" fill="#f39c4b" stroke="#c96a1c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M53 26c15-2 25 9 24 23-1 10-7 16-7 25 0 9 3 18-5 24-9 7-22 4-23-6-1-7 6-11 11-7-1 4-1 7 3 8 6 1 9-5 7-11-4-8-14-13-16-24-2-9 3-17 8-22-9 2-18-1-20-7-2-6 4-10 11-9 2-4 5-6 7-7Z" fill="#fce18a" stroke="#d4812a" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-tint" d="M47 56c-4 6-4 14 2 21 5-4 7-12 5-19-2-2-5-3-7-2Z" fill="#fff7d6"/>
      <ellipse cx="52" cy="36" rx="2.8" ry="3.5" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="58" cy="42" rx="5" ry="3" fill="#f4978e" opacity="0.72"/>
    `)
  },
  {
    id: 'sea-turtle', name: 'Sea turtle', component: 'SeaTurtle', zone: 'marine',
    x: 412, y: -206, size: 108, rot: -8,
    tags: ['turtle', 'green', 'shell', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M30 48c-12-8-18-17-12-22 6-5 18 1 25 11M78 44c12-9 22-14 26-7 4 7-5 18-16 21M36 82c-8 10-14 17-7 21 6 4 16-3 20-12M74 82c8 10 15 16 21 11 5-5-2-15-10-20" fill="#8ad89a" stroke="#3c8a52" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="s-fill s-outline" cx="60" cy="24" r="14" fill="#9ce5ab" stroke="#3c8a52" stroke-width="5"/>
      <ellipse class="s-shade s-outline" cx="60" cy="64" rx="27" ry="31" fill="#6cc482" stroke="#3c8a52" stroke-width="5.5"/>
      <path class="s-tint" d="M60 41l13 10-4 18H51l-4-18 13-10Z" fill="#a8edb6" opacity="0.75"/>
      <path class="s-outline" d="M60 41l13 10-4 18H51l-4-18 13-10ZM60 33v8M73 51l12-2M47 51l-12-2M69 69l10 11M51 69l-10 11" stroke="#3c8a52" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="52" cy="48" rx="6" ry="3" transform="rotate(-30 52 48)" fill="#ffffff" opacity="0.65"/>
      <circle cx="55" cy="21" r="2.2" fill="#2b201c"/>
      <circle cx="65" cy="21" r="2.2" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="51" cy="26" rx="3.4" ry="2" fill="#f59e95" opacity="0.7"/>
      <ellipse class="s-cheek" cx="69" cy="26" rx="3.4" ry="2" fill="#f59e95" opacity="0.7"/>
    `)
  },
  {
    id: 'water-bubble', name: 'Water bubbles', component: 'WaterBubble', zone: 'marine',
    x: 568, y: -102, size: 80, rot: 4,
    tags: ['bubble', 'water', 'air', 'ocean', 'sea'],
    svg: mkSvg(`
      <circle class="s-fill s-outline" cx="54" cy="68" r="28" fill="#c7ecff" stroke="#4ba3d9" stroke-width="5.2"/>
      <circle class="s-tint" cx="46" cy="59" r="14" fill="#eef9ff" opacity="0.7"/>
      <ellipse cx="42" cy="55" rx="7" ry="4" transform="rotate(-36 42 55)" fill="#ffffff" opacity="0.9"/>
      <circle cx="38" cy="67" r="2.4" fill="#ffffff" opacity="0.85"/>
      <circle class="s-fill s-outline" cx="84" cy="34" r="14" fill="#d7f2ff" stroke="#4ba3d9" stroke-width="4.5"/>
      <ellipse cx="79" cy="29" rx="4" ry="2.2" transform="rotate(-35 79 29)" fill="#ffffff" opacity="0.92"/>
      <circle class="s-fill s-outline" cx="34" cy="30" r="8" fill="#d7f2ff" stroke="#4ba3d9" stroke-width="4"/>
    `)
  },
  {
    id: 'jellyfish', name: 'Jellyfish', component: 'Jellyfish', zone: 'marine',
    x: 400, y: 12, size: 130, rot: 6,
    art: 'art/ref12.png', clip: 'clip-ref12',
    tags: ['jellyfish', 'pink', 'ocean', 'cute', 'sea'],
    svg: mkSvg(`
      <path class="s-outline" d="M36 62c-6 12-10 24-5 35M49 65c-4 13-3 26 2 37M63 66c-2 13 2 26 7 35M77 63c4 12 7 24 4 36" stroke="#d9726c" stroke-width="7.5" stroke-linecap="round"/>
      <path class="s-fill" d="M36 62c-6 12-10 24-5 35M49 65c-4 13-3 26 2 37M63 66c-2 13 2 26 7 35M77 63c4 12 7 24 4 36" stroke="#fbc0bb" stroke-width="3.5" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M24 52c2-22 18-36 37-35 20 1 35 16 35 37 0 11-11 16-23 15-9-1-16-2-27-1-13 1-23-4-22-16Z" fill="#fbc0bb" stroke="#d9726c" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse class="s-tint" cx="72" cy="34" rx="12" ry="6.5" transform="rotate(14 72 34)" fill="#e8d0e4" opacity="0.85"/>
      <ellipse cx="40" cy="34" rx="10" ry="4.5" transform="rotate(-24 40 34)" fill="#ffffff" opacity="0.72"/>
      ${cuteFace(58, 49, 8, 4.5, 0.85)}
    `)
  },
  {
    id: 'dolphin', name: 'Dolphin', component: 'Dolphin', zone: 'marine',
    x: 562, y: 132, size: 112, rot: -7,
    tags: ['dolphin', 'blue', 'jump', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M54 27c2-9 11-12 16-6-2 6-6 10-12 11Z" fill="#6faee0" stroke="#366c9c" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M22 65c2-19 19-35 42-35 22 0 38 14 40 33 1 8-2 16-8 23 8 2 14 7 11 12-3 4-12 3-19-2-6 5-13 9-16 4-3-4 1-10 6-14-8-5-19-7-31-5-11 2-18 8-26 6-6-1-9-6-6-10 3-4 8-5 11-7-3-1-5-3-4-5Z" fill="#a2d2f4" stroke="#366c9c" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-tint" d="M35 72c12-6 27-6 41 1-9 5-22 6-34 3-3-1-6-2-7-4Z" fill="#e6f5ff"/>
      <ellipse cx="56" cy="42" rx="14" ry="4.5" transform="rotate(-8 56 42)" fill="#ffffff" opacity="0.7"/>
      <ellipse cx="38" cy="56" rx="2.6" ry="3.2" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="45" cy="62" rx="5" ry="2.8" fill="#f59e95" opacity="0.7"/>
    `)
  },
  {
    id: 'striped-fish', name: 'Striped fish', component: 'StripedFish', zone: 'marine',
    x: 374, y: 222, size: 96, rot: 7,
    tags: ['clownfish', 'orange', 'fish', 'stripes', 'sea'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M84 56c10-10 19-14 23-8 4 6-1 14-7 17 6 4 10 12 6 17-5 5-14 0-22-10Z" fill="#f9844a" stroke="#ba4a1a" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M18 62c4-19 22-30 43-29 19 1 32 12 32 27s-14 27-33 27c-21 0-39-10-42-25Z" fill="#ffad70" stroke="#ba4a1a" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-tint s-outline" d="M48 34c5 16 5 35 0 53 7 0 13-1 18-3 4-16 4-33 0-48-6-1-12-2-18-2Z" fill="#fff7ed" stroke="#ba4a1a" stroke-width="4"/>
      <path class="s-tint s-outline" d="M74 39c3 13 3 28 0 42 5-3 9-7 12-12 2-7 2-14 0-20-3-4-7-8-12-10Z" fill="#fff7ed" stroke="#ba4a1a" stroke-width="4"/>
      <ellipse cx="34" cy="56" rx="2.9" ry="3.5" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="40" cy="63" rx="4.8" ry="2.8" fill="#f46f6f" opacity="0.65"/>
      <ellipse cx="39" cy="44" rx="7" ry="3" transform="rotate(-20 39 44)" fill="#ffffff" opacity="0.72"/>
    `)
  },
  {
    id: 'pearl-clam', name: 'Pearl clam', component: 'PearlClam', zone: 'marine',
    x: 162, y: 262, size: 94, rot: -5,
    tags: ['clam', 'pearl', 'shell', 'oyster', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M22 64c-2-23 15-42 38-42s40 19 38 42c-16 8-60 8-76 0Z" fill="#d9c4f2" stroke="#7d5ca8" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M24 64c2 20 17 34 36 34s34-14 36-34c-14 10-58 10-72 0Z" fill="#be9ee8" stroke="#7d5ca8" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-outline" d="M40 31l5 22M60 24v26M80 31l-5 22" stroke="#7d5ca8" stroke-width="3.6" stroke-linecap="round" opacity="0.6"/>
      <circle class="s-tint s-outline" cx="60" cy="65" r="14" fill="#fffaf0" stroke="#7d5ca8" stroke-width="4.5"/>
      <ellipse cx="55" cy="59" rx="4.5" ry="2.6" transform="rotate(-30 55 59)" fill="#ffffff" opacity="0.95"/>
    `)
  },
  {
    id: 'starfish', name: 'Starfish', component: 'Starfish', zone: 'marine',
    x: -10, y: 282, size: 98, rot: 10,
    tags: ['starfish', 'star', 'coral', 'beach', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 15c5 0 11 19 16 24 6 4 26 2 28 8 2 6-14 17-16 24-2 7 7 25 2 29-5 4-21-8-29-8-8 0-24 12-29 8-5-4 4-22 2-29-2-7-18-18-16-24 2-6 22-4 28-8 5-5 10-24 14-24Z" fill="#ffb59e" stroke="#cc5a42" stroke-width="5.5" stroke-linejoin="round"/>
      <circle class="s-shade" cx="60" cy="31" r="2.5" fill="#cc5a42" opacity="0.5"/>
      <circle class="s-shade" cx="85" cy="51" r="2.5" fill="#cc5a42" opacity="0.5"/>
      <circle class="s-shade" cx="35" cy="51" r="2.5" fill="#cc5a42" opacity="0.5"/>
      <circle class="s-shade" cx="44" cy="83" r="2.5" fill="#cc5a42" opacity="0.5"/>
      <circle class="s-shade" cx="76" cy="83" r="2.5" fill="#cc5a42" opacity="0.5"/>
      <ellipse cx="55" cy="40" rx="5" ry="2.5" transform="rotate(-24 55 40)" fill="#ffffff" opacity="0.72"/>
      ${cuteFace(60, 58, 7.5, 4.5, 0.85)}
    `)
  },
  {
    id: 'scallop-shell', name: 'Scallop shell', component: 'ScallopShell', zone: 'marine',
    x: -168, y: 258, size: 92, rot: -9,
    tags: ['scallop', 'shell', 'pink', 'beach', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M22 60c-3-20 13-39 38-39s41 19 38 39c-3 14-14 23-24 28l3 10H43l3-10c-10-5-21-14-24-28Z" fill="#ffd2dc" stroke="#c9617c" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-outline" d="M60 88V24M52 88L37 31M68 88l15-57M45 86L26 50M75 86l19-36" stroke="#c9617c" stroke-width="3.6" stroke-linecap="round" opacity="0.65"/>
      <ellipse cx="48" cy="36" rx="8" ry="3.5" transform="rotate(-18 48 36)" fill="#ffffff" opacity="0.75"/>
    `)
  },
  {
    id: 'flapjack-octopus', name: 'Flapjack octopus', component: 'FlapjackOctopus', zone: 'marine',
    x: -380, y: 196, size: 126, rot: -4,
    art: 'art/ref08.png', clip: 'clip-ref08',
    tags: ['octopus', 'flapjack', 'coral', 'red', 'cute', 'sea'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M24 64c-1-25 16-43 37-43 22 0 38 17 38 41 8 4 10 13 3 18-6 4-13 3-17 1-2 9-11 13-18 8-3-2-5-4-7-4-2 0-4 2-7 4-7 5-16 1-18-8-4 2-12 3-18-1-7-5-5-14 7-16Z" fill="#f37e6d" stroke="#b33923" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="42" cy="39" rx="11" ry="5" transform="rotate(-34 42 39)" fill="#ffffff" opacity="0.75"/>
      <ellipse cx="52" cy="57" rx="3" ry="3.8" fill="#2b201c"/>
      <ellipse cx="69" cy="57" rx="3" ry="3.8" fill="#2b201c"/>
      <circle class="s-shade s-outline" cx="60.5" cy="66" r="8" fill="#ea6a58" stroke="#b33923" stroke-width="3.4"/>
      <circle cx="60.5" cy="66" r="2.6" fill="#2b201c"/>
    `)
  },
  {
    id: 'crab', name: 'Happy crab', component: 'HappyCrab', zone: 'marine',
    x: -552, y: 98, size: 104, rot: 6,
    tags: ['crab', 'red', 'claws', 'beach', 'sea'],
    svg: mkSvg(`
      <path class="s-outline" d="M30 78l-13 11M35 86l-10 13M90 78l13 11M85 86l10 13" stroke="#b8382a" stroke-width="5" stroke-linecap="round"/>
      <path class="s-shade s-outline" d="M31 54c-11-6-18-18-13-28 4-7 13-6 14 2 1 4-2 7-4 8 4 2 9-1 10-5 2 9-1 18-7 23Z" fill="#f26b5b" stroke="#b8382a" stroke-width="4.8" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M89 54c11-6 18-18 13-28-4-7-13-6-14 2-1 4 2 7 4 8-4 2-9-1-10-5-2 9 1 18 7 23Z" fill="#f26b5b" stroke="#b8382a" stroke-width="4.8" stroke-linejoin="round"/>
      <ellipse class="s-fill s-outline" cx="60" cy="68" rx="31" ry="23" fill="#ff8e7e" stroke="#b8382a" stroke-width="5.5"/>
      <ellipse cx="47" cy="55" rx="9" ry="3.8" transform="rotate(-18 47 55)" fill="#ffffff" opacity="0.7"/>
      ${cuteFace(60, 66, 9, 4.5, 0.9)}
    `)
  },
  {
    id: 'shrimp', name: 'Little shrimp', component: 'LittleShrimp', zone: 'marine',
    x: -412, y: -18, size: 96, rot: -8,
    tags: ['shrimp', 'prawn', 'peach', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-outline" d="M40 32c-10-9-18-10-25-6M44 37c-11-4-19-2-26 3" stroke="#c95b3c" stroke-width="3.6" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M44 30c22-8 48 6 49 28 1 18-12 34-29 36-9 1-17-3-20-9-3-6 2-12 8-11 6 1 9 4 14 2 8-3 10-14 5-21-5-7-16-8-25-4-8 3-14-3-12-10 1-5 5-9 10-11Z" fill="#ffb899" stroke="#c95b3c" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M46 84c-8 4-15 11-11 16 4 5 14 2 20-5" fill="#f7926b" stroke="#c95b3c" stroke-width="4.5" stroke-linejoin="round"/>
      <path class="s-outline" d="M69 36l-4 13M83 51l-12 4M80 71l-11-4" stroke="#c95b3c" stroke-width="3.6" stroke-linecap="round" opacity="0.65"/>
      <circle cx="48" cy="39" r="2.8" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="55" cy="43" rx="4.2" ry="2.4" fill="#f2726f" opacity="0.72"/>
    `)
  },
  {
    id: 'octopus', name: 'Chubby octopus', component: 'ChubbyOctopus', zone: 'marine',
    x: -568, y: -136, size: 106, rot: 7,
    tags: ['octopus', 'lavender', 'tentacles', 'ocean', 'sea'],
    svg: mkSvg(`
      <path class="s-outline" d="M37 74c-11 8-16 17-10 23 5 5 14 0 18-8M52 79c-2 11-1 22 6 23 6 1 10-8 9-17M68 79c3 11 8 22 15 19 6-3 5-13 0-20M82 73c11 6 20 11 22 4 2-6-6-13-14-14" stroke="#6f539e" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M27 52c0-21 15-35 33-35s33 14 33 35c0 16-12 27-33 27S27 68 27 52Z" fill="#c7b5f2" stroke="#6f539e" stroke-width="5.5"/>
      <ellipse cx="45" cy="34" rx="10" ry="4.8" transform="rotate(-28 45 34)" fill="#ffffff" opacity="0.72"/>
      ${cuteFace(60, 56, 9, 4.5, 0.9)}
    `)
  },

  /* ========================================================================
     2. WEST — DIRECTIONAL ARROWS AND FLOW (10)
     ======================================================================== */
  {
    id: 'curved-arrow', name: 'Curved arrow', component: 'CurvedArrow', zone: 'arrows',
    x: -1205, y: -165, size: 96, rot: -6,
    tags: ['arrow', 'curve', 'flow', 'direction'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 86c8-34 32-52 68-49" stroke="#2d6a9f" stroke-width="11" stroke-linecap="round"/>
      <path class="s-fill" d="M22 86c8-34 32-52 68-49" stroke="#7cc2f8" stroke-width="5" stroke-linecap="round"/>
      <path class="s-outline" d="M74 22l22 15-19 19" stroke="#2d6a9f" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M74 22l22 15-19 19" stroke="#7cc2f8" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'loop-arrow', name: 'Loop arrow', component: 'LoopArrow', zone: 'arrows',
    x: -1020, y: -175, size: 100, rot: 4,
    tags: ['arrow', 'loop', 'swirl', 'direction'],
    svg: mkSvg(`
      <path class="s-outline" d="M18 82c18 6 44-4 49-24 4-15-8-26-19-21-10 4-9 19 3 25 14 7 32 4 46-7" stroke="#b94c24" stroke-width="10" stroke-linecap="round"/>
      <path class="s-fill" d="M18 82c18 6 44-4 49-24 4-15-8-26-19-21-10 4-9 19 3 25 14 7 32 4 46-7" stroke="#fca277" stroke-width="4.5" stroke-linecap="round"/>
      <path class="s-outline" d="M84 44l17 9-8 18" stroke="#b94c24" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M84 44l17 9-8 18" stroke="#fca277" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'spiral-swirl', name: 'Spiral swirl', component: 'SpiralSwirl', zone: 'arrows',
    x: -825, y: -155, size: 94, rot: -8,
    tags: ['spiral', 'swirl', 'flow', 'doodle'],
    svg: mkSvg(`
      <path class="s-outline" d="M60 60c4-4 10-2 10 4 0 9-10 14-18 11-12-4-16-18-11-29 7-15 26-20 40-12 18 10 23 34 12 51-12 19-39 24-58 12" stroke="#7c4ea3" stroke-width="9.5" stroke-linecap="round"/>
      <path class="s-fill" d="M60 60c4-4 10-2 10 4 0 9-10 14-18 11-12-4-16-18-11-29 7-15 26-20 40-12 18 10 23 34 12 51-12 19-39 24-58 12" stroke="#d1adf0" stroke-width="4.2" stroke-linecap="round"/>
    `)
  },
  {
    id: 'ribbon-swoosh', name: 'Ribbon swoosh', component: 'RibbonSwoosh', zone: 'arrows',
    x: -1255, y: -15, size: 102, rot: 5,
    tags: ['ribbon', 'wave', 'flow', 'swoosh'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M16 74c18-32 40-36 58-16 14 15 25 11 32-8-3 24-18 36-35 22-17-14-34-12-55 2Z" fill="#9ee5b4" stroke="#2c844c" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-outline" d="M24 58c16-14 31-14 45-2" stroke="#2c844c" stroke-width="3.6" stroke-linecap="round" opacity="0.5"/>
    `)
  },
  {
    id: 'zigzag-bolt', name: 'Zigzag flow', component: 'ZigzagFlow', zone: 'arrows',
    x: -1055, y: -12, size: 96, rot: -4,
    tags: ['zigzag', 'flow', 'line', 'arrow'],
    svg: mkSvg(`
      <path class="s-outline" d="M18 78L42 40l18 34 22-36 18 22" stroke="#c48a10" stroke-width="10.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M18 78L42 40l18 34 22-36 18 22" stroke="#fde068" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'double-arrow', name: 'Double arrow', component: 'DoubleArrow', zone: 'arrows',
    x: -855, y: -8, size: 96, rot: 7,
    tags: ['arrow', 'swap', 'both', 'direction'],
    svg: mkSvg(`
      <path class="s-outline" d="M26 42h68M78 26l16 16-16 16" stroke="#2f7a68" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M26 42h68M78 26l16 16-16 16" stroke="#7dd8c2" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-outline" d="M94 78H26M42 62L26 78l16 16" stroke="#2f7a68" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M94 78H26M42 62L26 78l16 16" stroke="#7dd8c2" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'u-turn-arrow', name: 'U-turn arrow', component: 'UTurnArrow', zone: 'arrows',
    x: -1205, y: 148, size: 92, rot: -5,
    tags: ['arrow', 'return', 'uturn', 'direction'],
    svg: mkSvg(`
      <path class="s-outline" d="M32 34h36c17 0 28 11 28 26S85 86 68 86H34" stroke="#bf4168" stroke-width="10.5" stroke-linecap="round"/>
      <path class="s-fill" d="M32 34h36c17 0 28 11 28 26S85 86 68 86H34" stroke="#f89eb9" stroke-width="4.8" stroke-linecap="round"/>
      <path class="s-outline" d="M46 70L28 86l18 15" stroke="#bf4168" stroke-width="10.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M46 70L28 86l18 15" stroke="#f89eb9" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'squiggly-arrow', name: 'Squiggly arrow', component: 'SquigglyArrow', zone: 'arrows',
    x: -1020, y: 158, size: 96, rot: 3,
    tags: ['arrow', 'wavy', 'squiggle', 'direction'],
    svg: mkSvg(`
      <path class="s-outline" d="M18 68c10-16 18-16 24 0s14 16 22-2 16-16 32-6" stroke="#3952a8" stroke-width="10" stroke-linecap="round"/>
      <path class="s-fill" d="M18 68c10-16 18-16 24 0s14 16 22-2 16-16 32-6" stroke="#96aff9" stroke-width="4.5" stroke-linecap="round"/>
      <path class="s-outline" d="M84 44l16 16-19 13" stroke="#3952a8" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M84 44l16 16-19 13" stroke="#96aff9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'dotted-arc', name: 'Dotted arc', component: 'DottedArc', zone: 'arrows',
    x: -835, y: 155, size: 92, rot: -7,
    tags: ['dotted', 'arc', 'path', 'arrow'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 80c12-34 40-46 68-30" stroke="#c75d2c" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 16"/>
      <path class="s-fill s-outline" d="M78 36l22 14-18 18 4-16-8-16Z" fill="#ffb894" stroke="#c75d2c" stroke-width="4.8" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'pointing-arrow', name: 'Chunky arrow', component: 'ChunkyArrow', zone: 'arrows',
    x: -1115, y: 270, size: 96, rot: 8,
    tags: ['arrow', 'right', 'pointer', 'direction'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M20 48c14-1 28-1 42-1 0-8 0-15 2-20 12 9 27 21 38 33-12 12-26 24-38 32-2-6-2-13-2-20-14 0-28 0-42-1-2-7-2-16 0-23Z" fill="#a5e39e" stroke="#34823b" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="48" cy="54" rx="14" ry="3.5" fill="#ffffff" opacity="0.7"/>
    `)
  },

  /* ========================================================================
     3. NORTH — WEATHER AND NATURE (10)
     ======================================================================== */
  {
    id: 'fluffy-cloud', name: 'Fluffy cloud', component: 'FluffyCloud', zone: 'nature',
    x: -380, y: -685, size: 108, rot: -4,
    tags: ['cloud', 'sky', 'weather', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M28 84c-11 0-18-8-17-19 1-9 8-15 17-15 2-14 14-24 29-23 12 1 22 8 25 19 10-2 21 5 22 16 1 12-8 22-20 22H28Z" fill="#d9f0ff" stroke="#538bb8" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="48" cy="43" rx="11" ry="4.5" transform="rotate(-14 48 43)" fill="#ffffff" opacity="0.88"/>
      ${cuteFace(58, 63, 9, 4.5, 0.88)}
    `)
  },
  {
    id: 'sun-rays', name: 'Happy sun', component: 'HappySun', zone: 'nature',
    x: -185, y: -715, size: 108, rot: 6,
    tags: ['sun', 'sunny', 'yellow', 'weather'],
    svg: mkSvg(`
      <path class="s-outline" d="M60 12v12M60 96v12M12 60h12M96 60h12M25 25l9 9M86 86l9 9M95 25l-9 9M34 86l-9 9" stroke="#d48806" stroke-width="6.5" stroke-linecap="round"/>
      <circle class="s-fill s-outline" cx="60" cy="60" r="27" fill="#ffe066" stroke="#d48806" stroke-width="5.5"/>
      <ellipse cx="48" cy="45" rx="8" ry="3.8" transform="rotate(-28 48 45)" fill="#ffffff" opacity="0.78"/>
      ${cuteFace(60, 61, 8, 4.5, 0.88)}
    `)
  },
  {
    id: 'white-daisy', name: 'Spring daisy', component: 'SpringDaisy', zone: 'nature',
    x: 15, y: -735, size: 100, rot: -7,
    tags: ['daisy', 'flower', 'nature', 'petal'],
    svg: mkSvg(`
      <g class="s-tint s-outline" fill="#fffdf7" stroke="#c28e34" stroke-width="4.8">
        <ellipse cx="60" cy="27" rx="11" ry="16"/>
        <ellipse cx="60" cy="93" rx="11" ry="16"/>
        <ellipse cx="27" cy="60" rx="16" ry="11"/>
        <ellipse cx="93" cy="60" rx="16" ry="11"/>
        <ellipse cx="37" cy="37" rx="11" ry="15" transform="rotate(-45 37 37)"/>
        <ellipse cx="83" cy="83" rx="11" ry="15" transform="rotate(-45 83 83)"/>
        <ellipse cx="83" cy="37" rx="11" ry="15" transform="rotate(45 83 37)"/>
        <ellipse cx="37" cy="83" rx="11" ry="15" transform="rotate(45 37 83)"/>
      </g>
      <circle class="s-fill s-outline" cx="60" cy="60" r="18" fill="#ffd859" stroke="#c28e34" stroke-width="5"/>
      ${cuteFace(60, 60, 5.5, 3.5, 0.65)}
    `)
  },
  {
    id: 'ocean-wave', name: 'Ocean wave', component: 'OceanWave', zone: 'nature',
    x: 210, y: -705, size: 104, rot: 4,
    tags: ['wave', 'water', 'ocean', 'nature'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M16 88c6-34 26-58 53-57 17 1 28 11 26 23-2 9-12 13-18 7-5-5-1-12 4-12-9-6-21-1-24 11-3 12 8 22 22 21 10-1 19-6 25-11v18H16Z" fill="#82cdfa" stroke="#246da8" stroke-width="5.5" stroke-linejoin="round"/>
      <path class="s-tint" d="M40 50c8-10 19-14 31-12-9 4-17 11-22 21-4-3-7-6-9-9Z" fill="#e6f7ff" opacity="0.85"/>
    `)
  },
  {
    id: 'water-splash', name: 'Water splash', component: 'WaterSplash', zone: 'nature',
    x: 395, y: -675, size: 96, rot: -5,
    tags: ['splash', 'drops', 'water', 'nature'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 22c11 19 20 34 20 48 0 13-9 22-20 22s-20-9-20-22c0-14 9-29 20-48Z" fill="#99dcfb" stroke="#2c7ab3" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M27 56c5 8 9 15 8 21-1 6-6 9-11 7-6-2-8-8-6-14 2-6 5-9 9-14Z" fill="#99dcfb" stroke="#2c7ab3" stroke-width="4.5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M93 56c-5 8-9 15-8 21 1 6 6 9 11 7 6-2 8-8 6-14-2-6-5-9-9-14Z" fill="#99dcfb" stroke="#2c7ab3" stroke-width="4.5" stroke-linejoin="round"/>
      <ellipse cx="52" cy="60" rx="4.5" ry="9" transform="rotate(14 52 60)" fill="#ffffff" opacity="0.8"/>
    `)
  },
  {
    id: 'grass-tuft', name: 'Grass tuft', component: 'GrassTuft', zone: 'nature',
    x: -365, y: -865, size: 96, rot: 5,
    tags: ['grass', 'green', 'plant', 'nature'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M26 94c-2-20-8-38-12-49 12 7 20 18 24 31 0-21 4-42 12-56 6 16 9 34 9 50 7-15 16-28 28-37-4 17-6 33-5 47 7-9 14-15 22-18-5 12-10 23-14 32H26Z" fill="#8ce09b" stroke="#2b7a40" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-shade" d="M46 88c1-18 3-34 5-46 3 14 5 29 5 46H46Z" fill="#52b868" opacity="0.45"/>
    `)
  },
  {
    id: 'little-globe', name: 'Little globe', component: 'LittleGlobe', zone: 'nature',
    x: -175, y: -888, size: 102, rot: -6,
    tags: ['globe', 'earth', 'world', 'planet', 'nature'],
    svg: mkSvg(`
      <circle class="s-fill s-outline" cx="60" cy="60" r="38" fill="#8fd3fb" stroke="#2c6ea3" stroke-width="5.5"/>
      <path class="s-shade" d="M35 42c8-8 20-10 24-2 3 6-4 13-1 20 3 6 11 8 8 16-3 8-14 10-22 3-10-8-16-26-9-37Z" fill="#7ad991"/>
      <path class="s-shade" d="M74 36c9 4 17 15 16 26-1 8-8 14-14 10-6-4-4-13-7-19-3-6-3-14 5-17Z" fill="#7ad991"/>
      <circle class="s-outline" cx="60" cy="60" r="38" stroke="#2c6ea3" stroke-width="5.5"/>
      <ellipse cx="45" cy="40" rx="10" ry="4.5" transform="rotate(-32 45 40)" fill="#ffffff" opacity="0.72"/>
    `)
  },
  {
    id: 'rainbow-arc', name: 'Rainbow arc', component: 'RainbowArc', zone: 'nature',
    x: 20, y: -905, size: 108, rot: 3,
    tags: ['rainbow', 'color', 'sky', 'weather'],
    svg: mkSvg(`
      <path d="M18 82a42 42 0 0 1 84 0" stroke="#f26b6b" stroke-width="11" stroke-linecap="round"/>
      <path d="M28 82a32 32 0 0 1 64 0" stroke="#fbbf24" stroke-width="11" stroke-linecap="round"/>
      <path d="M38 82a22 22 0 0 1 44 0" stroke="#5cc489" stroke-width="11" stroke-linecap="round"/>
      <path d="M48 82a12 12 0 0 1 24 0" stroke="#60a5fa" stroke-width="10" stroke-linecap="round"/>
      <path class="s-outline" d="M13 82a47 47 0 0 1 94 0" stroke="#b94242" stroke-width="3.2" stroke-linecap="round" opacity="0.45"/>
      <circle class="s-tint s-outline" cx="22" cy="84" r="10" fill="#ffffff" stroke="#859eb5" stroke-width="4.2"/>
      <circle class="s-tint s-outline" cx="98" cy="84" r="10" fill="#ffffff" stroke="#859eb5" stroke-width="4.2"/>
    `)
  },
  {
    id: 'rain-cloud', name: 'Rainy cloud', component: 'RainyCloud', zone: 'nature',
    x: 215, y: -885, size: 102, rot: -4,
    tags: ['rain', 'cloud', 'drops', 'weather'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M28 66c-10 0-16-7-15-16 1-8 7-13 15-13 3-13 14-21 28-20 11 1 19 8 22 17 9-1 18 5 19 15 1 10-7 17-17 17H28Z" fill="#cddcf0" stroke="#4f6d94" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-outline" d="M38 78l-4 13M58 78l-4 15M78 78l-4 13" stroke="#3b82c4" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="48" cy="34" rx="9" ry="3.8" transform="rotate(-14 48 34)" fill="#ffffff" opacity="0.8"/>
    `)
  },
  {
    id: 'leaf-sprig', name: 'Leaf sprig', component: 'LeafSprig', zone: 'nature',
    x: 392, y: -862, size: 96, rot: 8,
    tags: ['leaf', 'botanical', 'green', 'nature'],
    svg: mkSvg(`
      <path class="s-outline" d="M28 96c14-24 32-48 58-68" stroke="#2c7a46" stroke-width="5.5" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M58 52c-2-18 10-31 28-31 2 18-10 31-28 31Z" fill="#9ae6a8" stroke="#2c7a46" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M44 74c-16-2-27-13-26-29 16 1 27 12 26 29Z" fill="#9ae6a8" stroke="#2c7a46" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M56 76c16-2 29 5 33 20-16 2-29-5-33-20Z" fill="#82d995" stroke="#2c7a46" stroke-width="5" stroke-linejoin="round"/>
    `)
  },

  /* ========================================================================
     4. EAST — HEARTS AND CELEBRATORY SPARKS (12)
     ======================================================================== */
  {
    id: 'heart-burst', name: 'Heart burst', component: 'HeartBurst', zone: 'sparks',
    x: 825, y: -175, size: 102, rot: -6,
    tags: ['heart', 'love', 'pink', 'spark'],
    svg: mkSvg(`
      <path class="s-outline" d="M60 12v10M21 26l7 7M99 26l-7 7M14 62h10M96 62h10" stroke="#d9487b" stroke-width="4.8" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M60 95C36 80 26 65 26 51c0-11 8-19 18-19 7 0 13 4 16 10 3-6 9-10 16-10 10 0 18 8 18 19 0 14-10 29-34 44Z" fill="#ffa3c4" stroke="#c9386b" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="44" cy="47" rx="7" ry="3.8" transform="rotate(-32 44 47)" fill="#ffffff" opacity="0.78"/>
    `)
  },
  {
    id: 'four-point-sparkle', name: 'Four-point sparkle', component: 'FourPointSparkle', zone: 'sparks',
    x: 1010, y: -185, size: 96, rot: 7,
    tags: ['sparkle', 'glitter', 'star', 'magic'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 14c4 24 14 38 42 46-28 8-38 22-42 46-4-24-14-38-42-46 28-8 38-22 42-46Z" fill="#ffe678" stroke="#c98a12" stroke-width="5.5" stroke-linejoin="round"/>
      <circle class="s-tint" cx="60" cy="60" r="8" fill="#fffdf2"/>
    `)
  },
  {
    id: 'chubby-star', name: 'Chubby star', component: 'ChubbyStar', zone: 'sparks',
    x: 1195, y: -165, size: 102, rot: -5,
    tags: ['star', 'yellow', 'cute', 'spark'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 15c6 0 12 20 17 24 6 4 26 3 28 9 2 6-14 18-16 24-2 7 6 25 1 29-5 4-21-7-30-7s-25 11-30 7c-5-4 3-22 1-29-2-6-18-18-16-24 2-6 22-5 28-9 5-4 11-24 17-24Z" fill="#ffe066" stroke="#c98810" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="52" cy="40" rx="6" ry="3" transform="rotate(-24 52 40)" fill="#ffffff" opacity="0.8"/>
      ${cuteFace(60, 61, 7.5, 4.5, 0.85)}
    `)
  },
  {
    id: 'royal-crown', name: 'Royal crown', component: 'RoyalCrown', zone: 'sparks',
    x: 815, y: -15, size: 100, rot: 5,
    tags: ['crown', 'king', 'gold', 'celebration'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M22 86L16 38l24 20 20-28 20 28 24-20-6 48H22Z" fill="#ffd95e" stroke="#bd7d11" stroke-width="5.5" stroke-linejoin="round"/>
      <rect class="s-shade s-outline" x="22" y="84" width="76" height="12" rx="6" fill="#f5b82e" stroke="#bd7d11" stroke-width="4.8"/>
      <circle class="s-tint" cx="42" cy="70" r="4.5" fill="#f87171"/>
      <circle class="s-tint" cx="60" cy="68" r="5.2" fill="#38bdf8"/>
      <circle class="s-tint" cx="78" cy="70" r="4.5" fill="#4ade80"/>
    `)
  },
  {
    id: 'party-loop', name: 'Party streamer', component: 'PartyStreamer', zone: 'sparks',
    x: 1005, y: -12, size: 96, rot: -7,
    tags: ['party', 'streamer', 'celebrate', 'loop'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 88c12-10 26-26 22-40-3-10-14-10-16-1-3 10 9 20 24 14 17-7 22-27 42-35" stroke="#8548b5" stroke-width="10" stroke-linecap="round"/>
      <path class="s-fill" d="M22 88c12-10 26-26 22-40-3-10-14-10-16-1-3 10 9 20 24 14 17-7 22-27 42-35" stroke="#d5a6fa" stroke-width="4.5" stroke-linecap="round"/>
      <circle class="s-shade" cx="94" cy="48" r="5" fill="#f59e0b"/>
      <circle class="s-shade" cx="38" cy="24" r="4.5" fill="#f43f5e"/>
      <circle class="s-shade" cx="74" cy="78" r="5" fill="#38bdf8"/>
    `)
  },
  {
    id: 'lightning-zap', name: 'Lightning zap', component: 'LightningZap', zone: 'sparks',
    x: 1195, y: -10, size: 96, rot: 8,
    tags: ['lightning', 'bolt', 'energy', 'spark'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M68 14L28 62h27L46 106l46-52H64l4-40Z" fill="#ffe156" stroke="#c47e0a" stroke-width="5.5" stroke-linejoin="round"/>
      <path d="M55 36L42 54" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    `)
  },
  {
    id: 'double-hearts', name: 'Double hearts', component: 'DoubleHearts', zone: 'sparks',
    x: 820, y: 152, size: 98, rot: -5,
    tags: ['hearts', 'love', 'coral', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M46 86C29 75 21 63 21 53c0-8 6-14 13-14 5 0 9 3 12 7 3-4 7-7 12-7 7 0 13 6 13 14 0 10-8 22-25 33Z" fill="#ff9494" stroke="#bf3636" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M84 68c-12-8-18-16-18-24 0-6 4-10 10-10 4 0 7 2 8 5 1-3 4-5 8-5 6 0 10 4 10 10 0 8-6 16-18 24Z" fill="#ffbad6" stroke="#bf3672" stroke-width="4.8" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'confetti-pop', name: 'Confetti pop', component: 'ConfettiPop', zone: 'sparks',
    x: 1005, y: 156, size: 100, rot: 6,
    tags: ['confetti', 'party', 'popper', 'celebrate'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M24 96l17-51 34 34-51 17Z" fill="#ffb86c" stroke="#b85a14" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-outline" d="M35 66l19 19M43 52l25 25" stroke="#b85a14" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
      <path class="s-outline" d="M68 42c6-10 16-16 27-16M79 56c10-4 19-2 26 4M55 32c-2-9 1-17 7-22" stroke="#e5484d" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="88" cy="39" r="4.5" fill="#38bdf8"/>
      <circle cx="72" cy="21" r="4.5" fill="#facc15"/>
      <circle cx="96" cy="70" r="4.5" fill="#4ade80"/>
    `)
  },
  {
    id: 'twinkle-cluster', name: 'Twinkle cluster', component: 'TwinkleCluster', zone: 'sparks',
    x: 1192, y: 152, size: 94, rot: -4,
    tags: ['twinkle', 'sparkles', 'stars', 'magic'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M48 20c3 15 10 24 26 28-16 4-23 13-26 28-3-15-10-24-26-28 16-4 23-13 26-28Z" fill="#fde073" stroke="#bf840f" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-shade s-outline" d="M84 56c2 9 6 14 16 17-10 3-14 8-16 17-2-9-6-14-16-17 10-3 14-8 16-17Z" fill="#b4d9ff" stroke="#346fa8" stroke-width="4.5" stroke-linejoin="round"/>
      <circle class="s-fill s-outline" cx="84" cy="28" r="5" fill="#ffb3d1" stroke="#b83e71" stroke-width="3.5"/>
    `)
  },
  {
    id: 'shooting-star', name: 'Shooting star', component: 'ShootingStar', zone: 'sparks',
    x: 865, y: 278, size: 100, rot: -8,
    tags: ['star', 'shooting', 'comet', 'magic'],
    svg: mkSvg(`
      <path class="s-outline" d="M18 82c14-2 27-8 38-18M26 96c14-4 26-10 36-20" stroke="#e09f1f" stroke-width="6" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M78 22l7 17 18 2-14 12 4 18-15-9-16 9 4-18-14-12 18-2 8-17Z" fill="#ffe169" stroke="#bf800d" stroke-width="5" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'magic-wand', name: 'Magic wand', component: 'MagicWand', zone: 'sparks',
    x: 1045, y: 282, size: 96, rot: 7,
    tags: ['wand', 'magic', 'star', 'spark'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 98l44-44" stroke="#6f4e99" stroke-width="10" stroke-linecap="round"/>
      <path class="s-shade" d="M22 98l44-44" stroke="#c3a4f0" stroke-width="4.5" stroke-linecap="round"/>
      <path class="s-fill s-outline" d="M76 16l6 15 16 2-12 11 3 16-13-8-14 8 3-16-12-11 16-2 7-15Z" fill="#ffe066" stroke="#c4820c" stroke-width="4.8" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'happy-burst', name: 'Joy burst', component: 'JoyBurst', zone: 'sparks',
    x: 1218, y: 274, size: 92, rot: -5,
    tags: ['burst', 'celebrate', 'rays', 'spark'],
    svg: mkSvg(`
      <path class="s-outline" d="M60 16v18M60 86v18M16 60h18M86 60h18M28 28l13 13M79 79l13 13M92 28L79 41M41 79L28 92" stroke="#d95830" stroke-width="7.5" stroke-linecap="round"/>
      <path class="s-fill" d="M60 16v18M60 86v18M16 60h18M86 60h18M28 28l13 13M79 79l13 13M92 28L79 41M41 79L28 92" stroke="#ffac78" stroke-width="3" stroke-linecap="round"/>
      <circle class="s-fill s-outline" cx="60" cy="60" r="10" fill="#ffe066" stroke="#d95830" stroke-width="4.8"/>
    `)
  },

  /* ========================================================================
     5. SOUTH — EDITORIAL SYMBOLS AND MARKS (10)
     ======================================================================== */
  {
    id: 'question-mark', name: 'Question mark', component: 'QuestionMark', zone: 'editorial',
    x: -365, y: 615, size: 94, rot: -8,
    tags: ['question', 'punctuation', 'ask', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M38 42c2-15 14-22 25-21 13 1 21 9 20 20-1 11-11 16-19 21-4 3-5 7-5 12" stroke="#3c5ea8" stroke-width="13" stroke-linecap="round"/>
      <path class="s-fill" d="M38 42c2-15 14-22 25-21 13 1 21 9 20 20-1 11-11 16-19 21-4 3-5 7-5 12" stroke="#99b8fa" stroke-width="5.8" stroke-linecap="round"/>
      <circle class="s-fill s-outline" cx="59" cy="96" r="7.5" fill="#99b8fa" stroke="#3c5ea8" stroke-width="5"/>
    `)
  },
  {
    id: 'exclamation-pop', name: 'Exclamation pop', component: 'ExclamationPop', zone: 'editorial',
    x: -185, y: 625, size: 94, rot: 7,
    tags: ['exclamation', 'alert', 'bang', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M60 22l-2 50" stroke="#c93636" stroke-width="14" stroke-linecap="round"/>
      <path class="s-fill" d="M60 22l-2 50" stroke="#ff9999" stroke-width="6.5" stroke-linecap="round"/>
      <circle class="s-fill s-outline" cx="58" cy="94" r="8" fill="#ff9999" stroke="#c93636" stroke-width="5"/>
    `)
  },
  {
    id: 'emphasis-lines', name: 'Emphasis pop', component: 'EmphasisPop', zone: 'editorial',
    x: 0, y: 612, size: 94, rot: -4,
    tags: ['emphasis', 'accent', 'lines', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M26 78L44 26M56 84l14-56M82 92l20-34" stroke="#d47a14" stroke-width="11" stroke-linecap="round"/>
      <path class="s-fill" d="M26 78L44 26M56 84l14-56M82 92l20-34" stroke="#ffd27d" stroke-width="4.8" stroke-linecap="round"/>
    `)
  },
  {
    id: 'sketch-ring', name: 'Sketch ring', component: 'SketchRing', zone: 'editorial',
    x: 185, y: 625, size: 96, rot: 5,
    tags: ['circle', 'ring', 'highlight', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M62 24c24-2 40 16 38 38-2 22-21 36-44 34-22-2-38-18-35-40 3-20 22-34 45-30 14 2 26 9 31 18" stroke="#2d8a68" stroke-width="8.5" stroke-linecap="round"/>
      <path class="s-fill" d="M62 24c24-2 40 16 38 38-2 22-21 36-44 34-22-2-38-18-35-40 3-20 22-34 45-30 14 2 26 9 31 18" stroke="#8be0be" stroke-width="3.6" stroke-linecap="round"/>
    `)
  },
  {
    id: 'hashtag-doodle', name: 'Hashtag doodle', component: 'HashtagDoodle', zone: 'editorial',
    x: 365, y: 615, size: 94, rot: -6,
    tags: ['hashtag', 'pound', 'tag', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M46 20L36 100M82 20L72 100M20 46h80M18 76h80" stroke="#7c4ca8" stroke-width="10.5" stroke-linecap="round"/>
      <path class="s-fill" d="M46 20L36 100M82 20L72 100M20 46h80M18 76h80" stroke="#d4b0f5" stroke-width="4.6" stroke-linecap="round"/>
    `)
  },
  {
    id: 'pastel-triangle', name: 'Pastel triangle', component: 'PastelTriangle', zone: 'editorial',
    x: -355, y: 795, size: 92, rot: 6,
    tags: ['triangle', 'shape', 'geometric', 'editorial'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 22c5 0 36 56 38 66 1 5-4 8-10 8H32c-6 0-11-3-10-8 2-10 33-66 38-66Z" fill="#ffd485" stroke="#c47e14" stroke-width="5.5" stroke-linejoin="round"/>
      <path d="M56 42L40 74" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.72"/>
    `)
  },
  {
    id: 'soft-diamond', name: 'Soft diamond', component: 'SoftDiamond', zone: 'editorial',
    x: -175, y: 808, size: 92, rot: -5,
    tags: ['diamond', 'gem', 'shape', 'editorial'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M60 16c9 14 23 29 38 44-15 15-29 30-38 44-9-14-23-29-38-44 15-15 29-30 38-44Z" fill="#a8d8ff" stroke="#316ca6" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="52" cy="46" rx="7" ry="3.5" transform="rotate(-42 52 46)" fill="#ffffff" opacity="0.78"/>
    `)
  },
  {
    id: 'diagonal-hatch', name: 'Diagonal hatch', component: 'DiagonalHatch', zone: 'editorial',
    x: 8, y: 802, size: 94, rot: 4,
    tags: ['hatch', 'stripes', 'sketch', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 46L46 22M20 74L74 20M26 96L96 26M54 98L98 54M80 96L96 80" stroke="#c9567d" stroke-width="8.5" stroke-linecap="round"/>
      <path class="s-fill" d="M22 46L46 22M20 74L74 20M26 96L96 26M54 98L98 54M80 96L96 80" stroke="#fcaec8" stroke-width="3.5" stroke-linecap="round"/>
    `)
  },
  {
    id: 'check-scribble', name: 'Check scribble', component: 'CheckScribble', zone: 'editorial',
    x: 185, y: 808, size: 92, rot: -6,
    tags: ['check', 'done', 'yes', 'editorial'],
    svg: mkSvg(`
      <path class="s-outline" d="M22 64l24 24 52-58" stroke="#22824c" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill" d="M22 64l24 24 52-58" stroke="#85e0a8" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'speech-bubble', name: 'Speech bubble', component: 'SpeechBubble', zone: 'editorial',
    x: 360, y: 795, size: 98, rot: 5,
    tags: ['speech', 'chat', 'bubble', 'editorial'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M22 54c0-18 17-31 38-31s38 13 38 31-17 31-38 31c-5 0-10-1-15-2L28 96l4-18c-6-6-10-14-10-24Z" fill="#fff0b8" stroke="#bd8615" stroke-width="5.5" stroke-linejoin="round"/>
      <circle class="s-outline-fill" cx="44" cy="54" r="4" fill="#bd8615"/>
      <circle class="s-outline-fill" cx="60" cy="54" r="4" fill="#bd8615"/>
      <circle class="s-outline-fill" cx="76" cy="54" r="4" fill="#bd8615"/>
    `)
  },

  /* ========================================================================
     6. SOUTHEAST — PLAYFUL FELINES (8)
     ======================================================================== */
  {
    id: 'heart-cat', name: 'Heart cat', component: 'HeartCat', zone: 'felines',
    x: 725, y: 585, size: 108, rot: -5,
    tags: ['cat', 'kitten', 'heart', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M30 48L26 22l21 13c8-2 18-2 26 0l21-13-4 26c6 8 8 18 6 28-4 17-18 24-36 24S28 93 24 76c-2-10 0-20 6-28Z" fill="#ffd9b3" stroke="#b87139" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-shade" d="M32 32l2 12 9-6-11-6ZM88 32l-2 12-9-6 11-6Z" fill="#f7a8a8"/>
      ${cuteFace(60, 58, 10, 4, 0.85)}
      <path d="M60 88c-9-6-13-11-13-16 0-4 3-7 7-7 3 0 5 2 6 4 1-2 3-4 6-4 4 0 7 3 7 7 0 5-4 10-13 16Z" fill="#f87171" stroke="#b82c2c" stroke-width="3.2" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'sleepy-cat', name: 'Sleepy cat', component: 'SleepyCat', zone: 'felines',
    x: 915, y: 575, size: 108, rot: 4,
    tags: ['cat', 'sleep', 'nap', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M24 74c0-20 15-34 36-34s36 14 36 34c0 12-10 20-36 20S24 86 24 74Z" fill="#e5d4f7" stroke="#7957a3" stroke-width="5.2"/>
      <path class="s-fill s-outline" d="M32 48l-4-20 18 11M88 48l4-20-18 11" fill="#e5d4f7" stroke="#7957a3" stroke-width="5.2" stroke-linejoin="round"/>
      <path d="M44 66q5 5 10 0M66 66q5 5 10 0" stroke="#2b201c" stroke-width="3.2" stroke-linecap="round"/>
      <ellipse class="s-cheek" cx="40" cy="72" rx="5.5" ry="3" fill="#f4978e" opacity="0.7"/>
      <ellipse class="s-cheek" cx="80" cy="72" rx="5.5" ry="3" fill="#f4978e" opacity="0.7"/>
      <path class="s-outline" d="M84 26h11l-11 11h11" stroke="#7957a3" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>
    `)
  },
  {
    id: 'crown-cat', name: 'Crown cat', component: 'CrownCat', zone: 'felines',
    x: 1110, y: 590, size: 108, rot: -6,
    tags: ['cat', 'crown', 'royal', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M30 56l-2-22 18 12c9-2 19-2 28 0l18-12-2 22c6 8 7 19 3 28-6 12-18 16-33 16s-27-4-33-16c-4-9-3-20 3-28Z" fill="#fff0c9" stroke="#b58328" stroke-width="5.2" stroke-linejoin="round"/>
      <path d="M44 38l-3-16 11 8 8-12 8 12 11-8-3 16H44Z" fill="#ffd95e" stroke="#b87a12" stroke-width="3.8" stroke-linejoin="round"/>
      ${cuteFace(60, 68, 10, 4.5, 0.88)}
    `)
  },
  {
    id: 'wave-cat', name: 'Waving cat', component: 'WavingCat', zone: 'felines',
    x: 1275, y: 635, size: 106, rot: 7,
    tags: ['cat', 'wave', 'hello', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M88 64c9-10 15-22 10-28-4-5-12 0-15 10" fill="#ffd0d9" stroke="#b8546d" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M30 50l-2-22 18 11c9-2 19-2 28 0l18-11-2 22c5 9 6 22 2 34-5 10-16 14-32 14s-27-4-32-14c-4-12-3-25 2-34Z" fill="#ffe1e8" stroke="#b8546d" stroke-width="5.2" stroke-linejoin="round"/>
      ${cuteFace(58, 60, 10, 4.5, 0.85)}
    `)
  },
  {
    id: 'bowtie-cat', name: 'Bowtie cat', component: 'BowtieCat', zone: 'felines',
    x: 745, y: 765, size: 106, rot: 5,
    tags: ['cat', 'bowtie', 'dapper', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M30 48l-2-22 19 11c8-2 18-2 26 0l19-11-2 22c6 8 7 18 4 27-5 13-17 19-34 19s-29-6-34-19c-3-9-2-19 4-27Z" fill="#d9e6f5" stroke="#4d6d94" stroke-width="5.2" stroke-linejoin="round"/>
      ${cuteFace(60, 58, 10, 4.5, 0.85)}
      <path d="M44 82l16 8 16-8v16l-16-8-16 8V82Z" fill="#f87171" stroke="#b82c2c" stroke-width="3.6" stroke-linejoin="round"/>
      <circle cx="60" cy="90" r="4" fill="#fca5a5" stroke="#b82c2c" stroke-width="3"/>
    `)
  },
  {
    id: 'loaf-cat', name: 'Loaf cat', component: 'LoafCat', zone: 'felines',
    x: 935, y: 775, size: 108, rot: -4,
    tags: ['cat', 'loaf', 'chubby', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M22 72c2-24 17-36 38-36s36 12 38 36c1 12-9 20-38 20S21 84 22 72Z" fill="#f7c89e" stroke="#b36c32" stroke-width="5.5"/>
      <path class="s-fill s-outline" d="M33 44l-4-18 16 10M87 44l4-18-16 10" fill="#f7c89e" stroke="#b36c32" stroke-width="5" stroke-linejoin="round"/>
      <path class="s-outline" d="M52 38v8M60 36v10M68 38v8" stroke="#b36c32" stroke-width="3.8" stroke-linecap="round"/>
      ${cuteFace(60, 66, 10, 4.5, 0.88)}
    `)
  },
  {
    id: 'yarn-cat', name: 'Yarn ball cat', component: 'YarnCat', zone: 'felines',
    x: 1125, y: 780, size: 106, rot: 6,
    tags: ['cat', 'yarn', 'play', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M28 46l-2-20 17 10c8-2 16-2 24 0l17-10-2 20c5 8 6 18 2 27-5 11-16 15-29 15s-24-4-29-15c-4-9-3-19 2-27Z" fill="#e6f5d6" stroke="#53853c" stroke-width="5" stroke-linejoin="round"/>
      ${cuteFace(55, 55, 9, 4, 0.8)}
      <circle class="s-shade s-outline" cx="86" cy="84" r="15" fill="#f9a8d4" stroke="#b83b79" stroke-width="4.5"/>
      <path d="M75 79c7 2 14 7 18 14M77 92c5-6 11-11 19-12" stroke="#b83b79" stroke-width="3" stroke-linecap="round"/>
    `)
  },
  {
    id: 'peek-cat', name: 'Peeking cat', component: 'PeekingCat', zone: 'felines',
    x: 1295, y: 805, size: 104, rot: -5,
    tags: ['cat', 'peek', 'shy', 'feline', 'cute'],
    svg: mkSvg(`
      <path class="s-fill s-outline" d="M24 88c2-20 6-34 10-42l-2-20 17 11c7-2 15-2 22 0l17-11-2 20c4 8 8 22 10 42H24Z" fill="#d9d6cf" stroke="#57534e" stroke-width="5.2" stroke-linejoin="round"/>
      <ellipse class="s-tint s-outline" cx="38" cy="88" rx="9" ry="7" fill="#ffffff" stroke="#57534e" stroke-width="4.5"/>
      <ellipse class="s-tint s-outline" cx="82" cy="88" rx="9" ry="7" fill="#ffffff" stroke="#57534e" stroke-width="4.5"/>
      ${cuteFace(60, 58, 10, 4.5, 0.86)}
    `)
  },

  /* ========================================================================
     7. SOUTHWEST — CHARACTER FIGURES (5)
     ======================================================================== */
  {
    id: 'astro-kid', name: 'Astro buddy', component: 'AstroBuddy', zone: 'characters',
    x: -1120, y: 600, size: 112, rot: -6,
    tags: ['astronaut', 'space', 'character', 'buddy'],
    svg: mkSvg(`
      <rect class="s-fill s-outline" x="34" y="68" width="52" height="34" rx="16" fill="#e8eef7" stroke="#475c82" stroke-width="5.2"/>
      <circle class="s-tint s-outline" cx="60" cy="46" r="28" fill="#ffffff" stroke="#475c82" stroke-width="5.5"/>
      <rect class="s-shade s-outline" x="39" y="34" width="42" height="26" rx="13" fill="#82b8f5" stroke="#475c82" stroke-width="4.2"/>
      <ellipse cx="48" cy="41" rx="5" ry="2.5" transform="rotate(-24 48 41)" fill="#ffffff" opacity="0.82"/>
      <circle cx="52" cy="48" r="2.4" fill="#1e293b"/>
      <circle cx="68" cy="48" r="2.4" fill="#1e293b"/>
      <circle class="s-shade" cx="60" cy="84" r="5" fill="#f87171"/>
    `)
  },
  {
    id: 'frog-wizard', name: 'Frog wizard', component: 'FrogWizard', zone: 'characters',
    x: -925, y: 585, size: 112, rot: 5,
    tags: ['frog', 'wizard', 'hat', 'character'],
    svg: mkSvg(`
      <ellipse class="s-fill s-outline" cx="60" cy="76" rx="34" ry="24" fill="#9ee59b" stroke="#2f7a3e" stroke-width="5.5"/>
      <circle class="s-fill s-outline" cx="42" cy="54" r="10" fill="#9ee59b" stroke="#2f7a3e" stroke-width="4.8"/>
      <circle class="s-fill s-outline" cx="78" cy="54" r="10" fill="#9ee59b" stroke="#2f7a3e" stroke-width="4.8"/>
      <circle cx="42" cy="54" r="3" fill="#2b201c"/>
      <circle cx="78" cy="54" r="3" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="38" cy="74" rx="6" ry="3.2" fill="#f4978e" opacity="0.72"/>
      <ellipse class="s-cheek" cx="82" cy="74" rx="6" ry="3.2" fill="#f4978e" opacity="0.72"/>
      <path d="M52 76q8 6 16 0" stroke="#2b201c" stroke-width="2.6" stroke-linecap="round"/>
      <path class="s-shade s-outline" d="M35 46h50L60 12 35 46Z" fill="#9e87e8" stroke="#4f3b96" stroke-width="4.8" stroke-linejoin="round"/>
      <path d="M58 29l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1 2-4Z" fill="#ffe066"/>
    `)
  },
  {
    id: 'ghost-buddy', name: 'Ghost buddy', component: 'GhostBuddy', zone: 'characters',
    x: -735, y: 605, size: 108, rot: -5,
    tags: ['ghost', 'spooky', 'cute', 'character'],
    svg: mkSvg(`
      <path class="s-tint s-outline" d="M28 56c0-22 14-36 32-36s32 14 32 36v38c-6-5-11-5-16 0-6 5-11 5-16 0-5-5-10-5-16 0-6 5-11 5-16 0V56Z" fill="#f5f3ff" stroke="#6f6694" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse cx="45" cy="36" rx="8" ry="3.8" transform="rotate(-26 45 36)" fill="#ffffff" opacity="0.95"/>
      ${cuteFace(60, 56, 9, 4.5, 0.9)}
    `)
  },
  {
    id: 'dino-pal', name: 'Dino pal', component: 'DinoPal', zone: 'characters',
    x: -1025, y: 780, size: 112, rot: 4,
    tags: ['dino', 'dinosaur', 'green', 'character'],
    svg: mkSvg(`
      <path class="s-shade s-outline" d="M78 34l10-6 1 12M82 52l11-4-1 12M82 70l11-2-3 11" fill="#f7b955" stroke="#b57016" stroke-width="4" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M32 42c0-14 12-24 27-24 14 0 23 10 23 24v38c10 2 16 8 14 14-2 6-14 8-26 8H42c-10 0-16-6-16-16 0-8 4-14 10-18-3-6-4-16-4-26Z" fill="#8ce0b2" stroke="#2c7a56" stroke-width="5.5" stroke-linejoin="round"/>
      <ellipse class="s-tint" cx="47" cy="78" rx="12" ry="15" fill="#dffce9"/>
      <ellipse cx="47" cy="38" rx="2.8" ry="3.6" fill="#2b201c"/>
      <ellipse class="s-cheek" cx="56" cy="44" rx="5" ry="2.8" fill="#f4978e" opacity="0.72"/>
      <path d="M35 48q6 4 12 0" stroke="#2b201c" stroke-width="2.4" stroke-linecap="round"/>
    `)
  },
  {
    id: 'mushroom-sprite', name: 'Mushroom sprite', component: 'MushroomSprite', zone: 'characters',
    x: -820, y: 785, size: 108, rot: -6,
    tags: ['mushroom', 'toadstool', 'forest', 'character'],
    svg: mkSvg(`
      <path class="s-tint s-outline" d="M40 58h40v28c0 10-8 16-20 16s-20-6-20-16V58Z" fill="#fff3e0" stroke="#9e6d48" stroke-width="5.2" stroke-linejoin="round"/>
      <path class="s-fill s-outline" d="M18 60c2-24 19-40 42-40s40 16 42 40c-14 7-70 7-84 0Z" fill="#f57a70" stroke="#b03a32" stroke-width="5.5" stroke-linejoin="round"/>
      <circle cx="42" cy="40" r="6.5" fill="#fff7ed" opacity="0.9"/>
      <circle cx="72" cy="34" r="5" fill="#fff7ed" opacity="0.9"/>
      <circle cx="82" cy="50" r="4.5" fill="#fff7ed" opacity="0.9"/>
      ${cuteFace(60, 77, 8, 4, 0.82)}
    `)
  }
];
