/* ==========================================================================
   Trazo — 71 Hand-Drawn Wax-Crayon Sticker Specimens
   7 spatial neighborhoods:
     1. marine     (16) — Center halo (uses all 8 art/s01..s08.png + 8 crayon SVGs)
     2. arrows     (10) — West
     3. nature     (10) — North
     4. sparks     (12) — East
     5. editorial  (10) — South
     6. felines     (8) — Southeast
     7. characters  (5) — Southwest
   ========================================================================== */

window.TRAZO_DATA = (function () {
  const PALETTES = [
    { id: 'original', name: 'Original', wheel: true, stroke: '#1c1b19', fill: '#f4f3f0', swatch: null },
    { id: 'ink',      name: 'Ink',      swatch: '#1f1e1b', stroke: '#262522', fill: '#e7e5e0', fillAlt: '#f4f3f0', cheek: '#b5b1a8', eye: '#1a1917' },
    { id: 'red',      name: 'Red',      swatch: '#e5484d', stroke: '#c72f37', fill: '#ffd2d4', fillAlt: '#ffeaeb', cheek: '#f58a90', eye: '#7a171c' },
    { id: 'orange',   name: 'Orange',   swatch: '#f76b15', stroke: '#d4550d', fill: '#ffd8bd', fillAlt: '#ffefe2', cheek: '#f79b60', eye: '#7c2e04' },
    { id: 'yellow',   name: 'Yellow',   swatch: '#eab308', stroke: '#ba8306', fill: '#fef0b2', fillAlt: '#fff9dc', cheek: '#f2c64d', eye: '#694802' },
    { id: 'green',    name: 'Green',    swatch: '#2b9a66', stroke: '#1f7d52', fill: '#c6f0d9', fillAlt: '#e6faef', cheek: '#78cc9f', eye: '#0f472d' },
    { id: 'sky',      name: 'Sky',      swatch: '#0ea5e9', stroke: '#077cb5', fill: '#c7ecff', fillAlt: '#e8f7ff', cheek: '#79ccf5', eye: '#054466' },
    { id: 'cobalt',   name: 'Cobalt',   swatch: '#2563eb', stroke: '#1d4ed8', fill: '#cddcff', fillAlt: '#e8efff', cheek: '#86a7f7', eye: '#122c7a' },
    { id: 'pink',     name: 'Pink',     swatch: '#e93d82', stroke: '#c7286b', fill: '#ffd0e4', fillAlt: '#ffebf4', cheek: '#f48bb7', eye: '#73113b' }
  ];

  const CATEGORIES = [
    { id: 'all',        label: 'All 71' },
    { id: 'marine',     label: 'Marine life',       zone: { x: 0,     y: -415, rot: -1.5 } },
    { id: 'arrows',     label: 'Arrows & flow',     zone: { x: -1020, y: -255, rot: -2.5 } },
    { id: 'nature',     label: 'Weather & nature',  zone: { x: 0,     y: -965, rot: 1.8 } },
    { id: 'sparks',     label: 'Hearts & sparks',   zone: { x: 1025,  y: -265, rot: 2.2 } },
    { id: 'editorial',  label: 'Editorial marks',   zone: { x: 0,     y: 525,  rot: -1.6 } },
    { id: 'felines',    label: 'Playful felines',   zone: { x: 855,   y: 475,  rot: 2.4 } },
    { id: 'characters', label: 'Little characters', zone: { x: -855,  y: 475,  rot: -2.2 } }
  ];

  // Whispered margin hints shown on desktop around outer halo items
  const HINTS = [
    {
      text: 'click any sticker to customize',
      x: -545, y: -214, rot: -5,
      arrow: '<svg class="hint-arrow" width="38" height="24" viewBox="0 0 38 24" fill="none"><path d="M5 4c8 1 18 6 24 15m0 0-7-2m7 2-1-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
      text: 'drag the sheet to explore',
      x: 536, y: -236, rot: 4.5,
      arrow: '<svg class="hint-arrow" width="44" height="18" viewBox="0 0 44 18" fill="none"><path d="M4 11c11-4 22-4 34-1m0 0-6-4m6 4-6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
      text: 'try the colors below',
      x: -365, y: 298, rot: 3.5,
      arrow: '<svg class="hint-arrow" width="34" height="24" viewBox="0 0 34 24" fill="none"><path d="M8 3c3 8 9 13 18 16m0 0-6 2m6-2-3-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
      text: 'psst... playful cats this way',
      x: 492, y: 304, rot: -3.5,
      arrow: '<svg class="hint-arrow" width="34" height="24" viewBox="0 0 34 24" fill="none"><path d="M5 4c8 4 16 10 23 16m0 0-7-1m7 1-2-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    }
  ];

  // Helper to wrap inner paths into consistent 120x120 wax-crayon SVG
  function mkSvg(inner) {
    return `<svg class="sticker-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#crayon-wobble)">${inner}</g></svg>`;
  }

  // Helper for cute minimal face (eyes + rosy cheeks)
  function face(x1, x2, y, cheekOff = 10) {
    return `
      <ellipse class="c-cheek" cx="${x1 - cheekOff}" cy="${y + 5}" rx="6.2" ry="3.8" fill="#ffaba0" opacity="0.88"/>
      <ellipse class="c-cheek" cx="${x2 + cheekOff}" cy="${y + 5}" rx="6.2" ry="3.8" fill="#ffaba0" opacity="0.88"/>
      <ellipse class="c-eye" cx="${x1}" cy="${y}" rx="2.9" ry="3.7" fill="#3a2a24"/>
      <ellipse class="c-eye" cx="${x2}" cy="${y}" rx="2.9" ry="3.7" fill="#3a2a24"/>
    `;
  }

  const STICKERS = [
    /* ======================================================================
       1. MARINE LIFE (16) — Center Halo
       8 raster illustrations from art/s01..s08.png + 8 crayon vector companions
       ====================================================================== */
    {
      id: 'clownfish', name: 'Striped clownfish', category: 'marine',
      img: 'art/s01.png', x: -415, y: -148, size: 102, rot: -8,
      svgInner: `
        <path class="c-fill" d="M48 34c8-11 24-11 32 1 3 5 3 11 0 15" fill="#ff9452" stroke="#cc4e1c" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill" d="M84 56c12-12 24-10 24 3 0 6-4 9-7 11 4 3 6 8 3 13-5 8-15 6-22-4" fill="#ff9452" stroke="#cc4e1c" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill" d="M18 65c2-21 20-34 42-31 15 2 24 12 28 24 3 9-1 22-14 27-16 6-38 5-49-5-5-4-8-9-7-15z" fill="#ff9452" stroke="#cc4e1c" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill-alt-nostroke" d="M48 35c5 15 6 33 2 51l11-1c4-17 3-34-2-49z" fill="#fff4e0"/>
        <path class="c-fill-alt-nostroke" d="M68 41c4 12 4 26 1 40l8-3c3-11 3-23-1-33z" fill="#fff4e0"/>
        <ellipse class="c-fill" cx="56" cy="83" rx="11" ry="9" transform="rotate(-14 56 83)" fill="#ff9452" stroke="#cc4e1c" stroke-width="6"/>
        <ellipse class="c-hi" cx="31" cy="49" rx="6" ry="3" transform="rotate(-32 31 49)" fill="#ffffff" opacity="0.72"/>
        ${face(30, 41, 63, 7)}
      `
    },
    {
      id: 'baby-whale', name: 'Baby whale', category: 'marine',
      img: 'art/s02.png', x: 428, y: -152, size: 112, rot: 6,
      svgInner: `
        <path class="c-fill" d="M22 65c0-22 17-37 39-37 16 0 25 8 31 17 5-10 13-16 20-12 5 3 5 11-1 17 7 1 11 7 8 13-4 7-13 8-22 4-4 13-17 22-37 22-24 0-38-10-38-24z" fill="#add2ff" stroke="#5b7fb8" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill-alt-nostroke" d="M26 70c8-5 24-4 35 6 4 4 6 8 6 11-20 1-36-5-41-17z" fill="#f3f7fc"/>
        <path class="c-stroke" d="M36 70c1 6 3 11 7 15M48 73c1 5 3 10 6 13" stroke="#b9cce6" stroke-width="3.5" stroke-linecap="round"/>
        <path class="c-fill" d="M58 70c4 10 12 16 17 12 4-3 1-12-6-17" fill="#add2ff" stroke="#5b7fb8" stroke-width="6" stroke-linecap="round"/>
        <ellipse class="c-hi" cx="40" cy="41" rx="9" ry="4" transform="rotate(-22 40 41)" fill="#ffffff" opacity="0.78"/>
        ${face(35, 48, 57, 8)}
      `
    },
    {
      id: 'pink-coral', name: 'Pink coral', category: 'marine',
      img: 'art/s03.png', x: -468, y: 74, size: 98, rot: -5,
      svgInner: `
        <path class="c-fill" d="M48 98c-1-12 1-20-6-26-8-5-18-3-22-11-3-6 2-12 8-12-8-6-10-15-4-20 6-5 15-1 18 8 4 10 5 15 11 16 1-11-2-23-1-32 1-9 10-12 15-7 4 4 3 11 2 16 6-7 14-10 19-5 5 5 2 14-5 19-6 4-10 9-10 15 8-5 15-15 23-12 7 3 8 11 3 17 7 1 11 7 8 13-3 7-12 8-19 4-8 4-12 10-12 18z" fill="#ffa394" stroke="#d95e4c" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="59" cy="24" rx="4.5" ry="2.6" transform="rotate(-25 59 24)" fill="#ffffff" opacity="0.72"/>
        <ellipse class="c-hi" cx="89" cy="54" rx="4.5" ry="2.6" transform="rotate(-25 89 54)" fill="#ffffff" opacity="0.72"/>
        <ellipse class="c-hi" cx="27" cy="56" rx="4.5" ry="2.6" transform="rotate(-25 27 56)" fill="#ffffff" opacity="0.72"/>
      `
    },
    {
      id: 'sea-urchin', name: 'Sea urchin', category: 'marine',
      img: 'art/s04.png', x: 458, y: 78, size: 92, rot: 9,
      svgInner: `
        <path class="c-fill" d="M60 18c5 0 7 9 8 13 5-5 13-9 17-5 4 4 1 12-3 17 6-2 15-1 16 5 2 5-5 11-11 13 6 2 13 7 10 13-2 5-11 5-16 3 4 5 7 13 2 17-4 4-12 0-16-5-1 6-3 14-8 14s-8-8-8-14c-5 5-13 9-17 5-4-4-1-12 3-17-6 2-15 1-16-5-1-5 5-11 11-13-6-2-13-7-10-13 2-5 11-5 16-3-4-5-7-13-2-17 4-4 12 0 16 5 1-6 3-13 8-13z" fill="#dfb8ed" stroke="#9961ad" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="48" cy="45" rx="7" ry="3.6" transform="rotate(-28 48 45)" fill="#ffffff" opacity="0.76"/>
        ${face(52, 68, 60, 8)}
      `
    },
    {
      id: 'nautical-anchor', name: 'Nautical anchor', category: 'marine',
      img: 'art/s05.png', x: -332, y: 215, size: 92, rot: -10,
      svgInner: `
        <circle class="c-fill" cx="60" cy="28" r="14" fill="#c2d1e8" stroke="#6f82a3" stroke-width="6.5"/>
        <circle class="c-fill-alt-nostroke" cx="60" cy="28" r="5" fill="#fdfdfc"/>
        <path class="c-fill" d="M52 41h16v9h14a6 6 0 0 1 0 12H68v24c9-1 16-7 19-15l-5-3 13-8 6 15-5-2c-5 15-18 25-36 25S29 88 24 73l-5 2 6-15 13 8-5 3c3 8 10 14 19 15V62H38a6 6 0 0 1 0-12h14v-9z" fill="#c2d1e8" stroke="#6f82a3" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="53" cy="22" rx="4.5" ry="2.4" transform="rotate(-30 53 22)" fill="#ffffff" opacity="0.8"/>
        ${face(54, 66, 67, 7)}
      `
    },
    {
      id: 'coastal-seagull', name: 'Coastal seagull', category: 'marine',
      img: 'art/s06.png', x: -206, y: -286, size: 92, rot: 5,
      svgInner: `
        <path class="c-fill" d="M46 86l-5 12c-4 1-6 4-4 6 3 2 8-1 11 1 3 1 6-2 4-5l1-13M66 86l1 13c-3 2-3 6 1 6 4 0 8-1 11 1 3 1 6-2 3-5l-6-14" fill="#ffd952" stroke="#b38840" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill-alt" d="M35 45c0-15 11-25 25-25 14 0 24 10 24 25 12 2 20 11 17 22-3 11-16 20-35 20-21 0-35-10-35-25 0-7 2-12 4-17z" fill="#fff7e6" stroke="#8f787a" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill" d="M58 55c7-9 21-8 31 0 7 6 6 16-2 20-9 4-21 3-28-4-4-5-4-11-1-16z" fill="#d3c9d1" stroke="#8f787a" stroke-width="6" stroke-linejoin="round"/>
        <path class="c-fill" d="M36 45c-8-1-17 3-18 9-1 5 7 8 17 6" fill="#ffd952" stroke="#b38840" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <ellipse class="c-cheek" cx="53" cy="48" rx="5.5" ry="3.5" fill="#ffaba0"/>
        <circle class="c-eye" cx="43" cy="39" r="2.8" fill="#3a2a24"/>
        <circle class="c-eye" cx="52" cy="41" r="2.8" fill="#3a2a24"/>
        <ellipse class="c-hi" cx="62" cy="30" rx="5.5" ry="2.8" transform="rotate(28 62 30)" fill="#ffffff" opacity="0.82"/>
      `
    },
    {
      id: 'lighthouse', name: 'Striped lighthouse', category: 'marine',
      img: 'art/s07.png', x: 218, y: -290, size: 96, rot: -4,
      svgInner: `
        <path class="c-fill-alt" d="M44 48h32l12 48H32l12-48z" fill="#fff6e0" stroke="#cc5847" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill-nostroke" d="M40 62h40l4 15H36l4-15z" fill="#fa8778"/>
        <path class="c-fill" d="M29 94c0-5 5-8 12-8h38c7 0 12 3 12 8 0 6-6 9-16 9H45c-10 0-16-3-16-9z" fill="#fa8778" stroke="#cc5847" stroke-width="6.5"/>
        <rect class="c-fill" x="45" y="31" width="30" height="16" rx="3" fill="#ffd86e" stroke="#cc5847" stroke-width="6"/>
        <path class="c-fill" d="M42 32c3-10 10-15 18-15s15 5 18 15H42z" fill="#fa8778" stroke="#cc5847" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill" cx="60" cy="14" r="5" fill="#fa8778" stroke="#cc5847" stroke-width="5"/>
        <rect class="c-fill" x="39" y="44" width="42" height="9" rx="4.5" fill="#fa8778" stroke="#cc5847" stroke-width="5.5"/>
        <path class="c-stroke-fill" d="M52 101V84a8 8 0 0 1 16 0v17z" fill="#8f5343"/>
        <circle class="c-hi" cx="60" cy="39" r="4" fill="#fffbe8"/>
      `
    },
    {
      id: 'little-sailboat', name: 'Little sailboat', category: 'marine',
      img: 'art/s08.png', x: 334, y: 212, size: 96, rot: 7,
      svgInner: `
        <path class="c-fill" d="M60 16c8 2 14 5 20 3 4 5 2 11-5 12-5 1-10-1-15-2V16z" fill="#fa9689" stroke="#cc6456" stroke-width="5.5" stroke-linejoin="round"/>
        <path class="c-fill-alt" d="M58 29L27 67h31V29zm6 0v38h29L64 29z" fill="#fff4d4" stroke="#b88454" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M60 16v56" stroke="#b37544" stroke-width="7" stroke-linecap="round"/>
        <path class="c-fill" d="M22 72c12 4 64 4 76 0 4 17-12 30-38 30S18 89 22 72z" fill="#9ccaff" stroke="#5b7bb8" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="31" cy="83" rx="3.2" ry="6.5" transform="rotate(-18 31 83)" fill="#ffffff" opacity="0.72"/>
        ${face(53, 67, 86, 8)}
      `
    },
    {
      id: 'baby-squid', name: 'Baby squid', category: 'marine',
      x: -575, y: -44, size: 80, rot: -12,
      svgInner: `
        <path class="c-fill" d="M37 46c-9-4-14 2-10 10 3 6 9 6 12 5M83 46c9-4 14 2 10 10-3 6-9 6-12 5" fill="#ffb8d0" stroke="#cc6086" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill" d="M40 74c-4 12-10 17-8 22 2 5 8 4 11-2 1 8 4 12 9 12s8-5 8-12c0 7 3 12 8 12s8-4 9-12c3 6 9 7 11 2 2-5-4-10-8-22" fill="#ffb8d0" stroke="#cc6086" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill" d="M35 55c0-20 11-36 25-36s25 16 25 36c0 14-8 23-25 23S35 69 35 55z" fill="#ffb8d0" stroke="#cc6086" stroke-width="6.5"/>
        <ellipse class="c-hi" cx="48" cy="34" rx="5.5" ry="3" transform="rotate(-38 48 34)" fill="#ffffff" opacity="0.78"/>
        ${face(52, 68, 58, 7)}
      `
    },
    {
      id: 'conch-shell', name: 'Conch shell', category: 'marine',
      x: 572, y: -42, size: 80, rot: 11,
      svgInner: `
        <path class="c-fill" d="M60 18c8 0 13 9 17 18 7 1 13 7 13 15 6 4 8 13 4 21-4 10-16 22-34 25-18-3-30-15-34-25-4-8-2-17 4-21 0-8 6-14 13-15 4-9 9-18 17-18z" fill="#ffe1bd" stroke="#cc8247" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M41 44c12 5 26 5 38 0M34 61c16 6 36 6 52 0M42 78c12 4 24 4 36 0" stroke="#cc8247" stroke-width="5" stroke-linecap="round"/>
        <ellipse class="c-hi" cx="50" cy="34" rx="5" ry="2.6" transform="rotate(-24 50 34)" fill="#ffffff" opacity="0.76"/>
      `
    },
    {
      id: 'seahorse', name: 'Seahorse', category: 'marine',
      x: -350, y: -292, size: 80, rot: 8,
      svgInner: `
        <path class="c-fill-alt" d="M72 48c11-2 16 5 14 12-2 6-9 8-14 6" fill="#fff0b3" stroke="#d18b26" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-fill" d="M44 37c-10 0-15-3-15-7s6-6 14-5c3-9 12-13 21-11 11 2 16 11 14 21-2 8-7 13-5 20 2 8 7 17 4 27-3 11-12 18-22 17-9-1-14-8-12-15 2-5 8-7 12-3 3 3 1 8-2 8 6 2 11-3 12-9 1-7-4-12-8-17-6-7-7-17-3-24-4 0-7-2-10-2z" fill="#ffd275" stroke="#d18b26" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-cheek" cx="55" cy="37" rx="4.5" ry="3" fill="#ff9e8e"/>
        <circle class="c-eye" cx="51" cy="31" r="2.8" fill="#3a2a24"/>
        <ellipse class="c-hi" cx="63" cy="24" rx="4.5" ry="2.2" transform="rotate(20 63 24)" fill="#ffffff" opacity="0.75"/>
      `
    },
    {
      id: 'sea-turtle', name: 'Sea turtle', category: 'marine',
      x: 382, y: -278, size: 86, rot: -7,
      svgInner: `
        <ellipse class="c-fill-alt" cx="35" cy="40" rx="11" ry="7" transform="rotate(-35 35 40)" fill="#b8ebd0" stroke="#368c64" stroke-width="6"/>
        <ellipse class="c-fill-alt" cx="85" cy="40" rx="11" ry="7" transform="rotate(35 85 40)" fill="#b8ebd0" stroke="#368c64" stroke-width="6"/>
        <ellipse class="c-fill-alt" cx="38" cy="84" rx="9" ry="6" transform="rotate(30 38 84)" fill="#b8ebd0" stroke="#368c64" stroke-width="6"/>
        <ellipse class="c-fill-alt" cx="82" cy="84" rx="9" ry="6" transform="rotate(-30 82 84)" fill="#b8ebd0" stroke="#368c64" stroke-width="6"/>
        <circle class="c-fill-alt" cx="60" cy="24" r="13" fill="#b8ebd0" stroke="#368c64" stroke-width="6"/>
        <ellipse class="c-fill" cx="60" cy="64" rx="25" ry="29" fill="#85d4ab" stroke="#368c64" stroke-width="6.5"/>
        <path class="c-stroke" d="M60 44l12 10-4 17H52l-4-17 12-10z" stroke="#368c64" stroke-width="4.5" stroke-linejoin="round"/>
        <circle class="c-eye" cx="55" cy="22" r="2.4" fill="#2c2420"/>
        <circle class="c-eye" cx="65" cy="22" r="2.4" fill="#2c2420"/>
        <ellipse class="c-hi" cx="49" cy="52" rx="4.5" ry="2.4" transform="rotate(-32 49 52)" fill="#ffffff" opacity="0.72"/>
      `
    },
    {
      id: 'starfish', name: 'Happy starfish', category: 'marine',
      x: -512, y: 215, size: 80, rot: 14,
      svgInner: `
        <path class="c-fill" d="M60 17c4 0 9 19 13 23 4 4 24 3 26 8 2 4-14 16-16 21-2 5 6 24 2 27-4 3-20-9-25-9s-21 12-25 9c-4-3 4-22 2-27-2-5-18-17-16-21 2-5 22-4 26-8 4-4 9-23 13-23z" fill="#ffd970" stroke="#cf8a1d" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="58" cy="31" rx="3" ry="5" fill="#ffffff" opacity="0.74"/>
        ${face(53, 67, 61, 7)}
      `
    },
    {
      id: 'octopus', name: 'Flapjack octopus', category: 'marine',
      x: 518, y: 205, size: 86, rot: -9,
      svgInner: `
        <path class="c-fill" d="M35 37c-9-7-17-2-15 6 2 7 9 9 13 8M85 37c9-7 17-2 15 6-2 7-9 9-13 8" fill="#ffad8a" stroke="#cf603c" stroke-width="6.5" stroke-linecap="round"/>
        <path class="c-fill" d="M27 65c0-21 14-36 33-36s33 15 33 36c0 6 8 10 8 16 0 7-8 10-15 7-3 7-11 10-17 5-4 6-14 6-18 0-6 5-14 2-17-5-7 3-15 0-15-7 0-6 8-10 8-16z" fill="#ffad8a" stroke="#cf603c" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="46" cy="43" rx="7" ry="3.5" transform="rotate(-25 46 43)" fill="#ffffff" opacity="0.76"/>
        ${face(51, 69, 63, 8)}
      `
    },
    {
      id: 'jellyfish', name: 'Glowing jellyfish', category: 'marine',
      x: 6, y: -322, size: 78, rot: 4,
      svgInner: `
        <path class="c-stroke" d="M40 66c-3 12 4 19-1 30M54 68c2 11-4 20 1 32M67 68c-2 12 4 19 0 31M80 66c3 11-3 18 2 28" stroke="#6294cc" stroke-width="5.5" stroke-linecap="round"/>
        <path class="c-fill" d="M26 57c0-21 15-35 34-35s34 14 34 35c0 9-9 13-17 10-5 5-12 5-17 0-5 5-12 5-17 0-8 3-17-1-17-10z" fill="#bfe2ff" stroke="#5b8cc4" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="46" cy="36" rx="7" ry="3.5" transform="rotate(-26 46 36)" fill="#ffffff" opacity="0.82"/>
        ${face(52, 68, 52, 8)}
      `
    },
    {
      id: 'pearl-clam', name: 'Pearl clam', category: 'marine',
      x: -165, y: 256, size: 78, rot: -6,
      svgInner: `
        <path class="c-fill" d="M22 60c0-22 17-36 38-36s38 14 38 36c0 11-10 17-38 17S22 71 22 60z" fill="#f7c8e0" stroke="#bf6797" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M60 25v24M41 31l8 20M79 31l-8 20" stroke="#bf6797" stroke-width="4.5" stroke-linecap="round"/>
        <path class="c-fill" d="M22 67c10-6 66-6 76 0 2 15-15 26-38 26S20 82 22 67z" fill="#f7c8e0" stroke="#bf6797" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill-alt" cx="60" cy="64" r="13" fill="#fffdf5" stroke="#bf6797" stroke-width="5.5"/>
        <ellipse class="c-hi" cx="55" cy="59" rx="4" ry="2.2" transform="rotate(-30 55 59)" fill="#ffffff"/>
      `
    },

    /* ======================================================================
       2. ARROWS & FLOW (10) — West Neighborhood (around x: -1020, y: 0)
       ====================================================================== */
    {
      id: 'curved-arrow', name: 'Curved arrow', category: 'arrows',
      x: -1195, y: -125, size: 86, rot: -6,
      svgInner: `
        <path class="c-stroke" d="M20 82c10-36 39-52 74-44" stroke="#e05a3a" stroke-width="8" stroke-linecap="round"/>
        <path class="c-stroke" d="M76 23l20 15-21 15" stroke="#e05a3a" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'loop-arrow', name: 'Loop-de-loop', category: 'arrows',
      x: -1035, y: -140, size: 90, rot: 4,
      svgInner: `
        <path class="c-stroke" d="M18 82c26 4 46-12 46-32 0-12-9-19-17-16-9 4-11 18-1 26 12 10 34 7 52-10" stroke="#2d7dd2" stroke-width="7.5" stroke-linecap="round"/>
        <path class="c-stroke" d="M82 47l18 2-4 18" stroke="#2d7dd2" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'spiral-swirl', name: 'Spiral swirl', category: 'arrows',
      x: -865, y: -118, size: 84, rot: -8,
      svgInner: `
        <path class="c-stroke" d="M62 60c0-6-7-9-12-5-7 6-5 18 5 22 14 5 28-6 29-21 1-19-16-34-36-32-23 3-36 25-31 48 4 19 20 31 39 32" stroke="#8c54c7" stroke-width="7.5" stroke-linecap="round"/>
      `
    },
    {
      id: 'wavy-ribbon', name: 'Wavy ribbon', category: 'arrows',
      x: -1235, y: 12, size: 90, rot: 5,
      svgInner: `
        <path class="c-fill" d="M16 74c15-26 30-26 44 0s29 26 44 0l-6-16c-12 20-24 20-38-4S34 30 22 50l-6 24z" fill="#ffd470" stroke="#cc8318" stroke-width="6.5" stroke-linejoin="round"/>
      `
    },
    {
      id: 'zigzag-flow', name: 'Zigzag trail', category: 'arrows',
      x: -1065, y: 16, size: 86, rot: -4,
      svgInner: `
        <path class="c-stroke" d="M18 84l22-36 20 26 24-38 14 14" stroke="#239664" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-stroke" d="M84 36h17v17" stroke="#239664" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'double-arrow', name: 'Two-way arrow', category: 'arrows',
      x: -885, y: 26, size: 86, rot: 7,
      svgInner: `
        <path class="c-stroke" d="M24 60c22-8 50-8 72 0" stroke="#e04379" stroke-width="8" stroke-linecap="round"/>
        <path class="c-stroke" d="M36 46L20 60l17 13M84 46l16 14-17 13" stroke="#e04379" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'u-turn-arrow', name: 'Swooping return', category: 'arrows',
      x: -1190, y: 155, size: 84, rot: -5,
      svgInner: `
        <path class="c-stroke" d="M26 38h48c16 0 26 10 26 24s-10 24-26 24H30" stroke="#f07824" stroke-width="8" stroke-linecap="round"/>
        <path class="c-stroke" d="M44 72L26 86l18 14" stroke="#f07824" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'dotted-arrow', name: 'Dotted trail', category: 'arrows',
      x: -1025, y: 164, size: 86, rot: 6,
      svgInner: `
        <path class="c-stroke" d="M20 82c16-24 44-38 72-38" stroke="#0c8bc7" stroke-width="7.5" stroke-linecap="round" stroke-dasharray="1 14"/>
        <path class="c-stroke" d="M76 30l20 14-18 16" stroke="#0c8bc7" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'corner-turn', name: 'Corner turn', category: 'arrows',
      x: -865, y: 160, size: 82, rot: -7,
      svgInner: `
        <path class="c-stroke" d="M30 24v40c0 14 10 22 24 22h38" stroke="#475569" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="c-stroke" d="M77 71l18 15-18 14" stroke="#475569" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },
    {
      id: 'paper-plane', name: 'Paper plane', category: 'arrows',
      x: -1110, y: 282, size: 88, rot: -9,
      svgInner: `
        <path class="c-fill" d="M18 58l82-32-28 68-17-22-17 12 4-22-24-4z" fill="#d4ebff" stroke="#3b78b8" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M100 26L46 62" stroke="#3b78b8" stroke-width="5.5" stroke-linecap="round"/>
      `
    },

    /* ======================================================================
       3. WEATHER & NATURE (10) — North Neighborhood (around x: 0, y: -760)
       ====================================================================== */
    {
      id: 'fluffy-cloud', name: 'Fluffy cloud', category: 'nature',
      x: -290, y: -820, size: 96, rot: -5,
      svgInner: `
        <path class="c-fill-alt" d="M34 82h54c12 0 20-8 20-18 0-9-7-16-16-17-2-13-13-22-27-22-12 0-22 7-26 18-11 1-20 9-20 20 0 11 7 19 15 19z" fill="#eaf6ff" stroke="#6c99c7" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="56" cy="39" rx="8" ry="3.5" transform="rotate(-14 56 39)" fill="#ffffff"/>
        ${face(52, 68, 61, 8)}
      `
    },
    {
      id: 'radiant-sun', name: 'Radiant sun', category: 'nature',
      x: -110, y: -845, size: 94, rot: 7,
      svgInner: `
        <path class="c-stroke" d="M60 12v11M60 97v11M12 60h11M97 60h11M26 26l8 8M86 86l8 8M94 26l-8 8M34 86l-8 8" stroke="#e09112" stroke-width="7" stroke-linecap="round"/>
        <circle class="c-fill" cx="60" cy="60" r="26" fill="#ffe169" stroke="#e09112" stroke-width="6.5"/>
        <ellipse class="c-hi" cx="50" cy="46" rx="6" ry="3" transform="rotate(-30 50 46)" fill="#ffffff" opacity="0.78"/>
        ${face(53, 67, 61, 7)}
      `
    },
    {
      id: 'little-daisy', name: 'Little daisy', category: 'nature',
      x: 95, y: -840, size: 88, rot: -6,
      svgInner: `
        <circle class="c-fill-alt" cx="60" cy="30" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill-alt" cx="85" cy="45" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill-alt" cx="85" cy="75" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill-alt" cx="60" cy="90" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill-alt" cx="35" cy="75" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill-alt" cx="35" cy="45" r="14" fill="#fffdf7" stroke="#998f82" stroke-width="5.5"/>
        <circle class="c-fill" cx="60" cy="60" r="18" fill="#ffd952" stroke="#cc8e14" stroke-width="6"/>
        ${face(54, 66, 59, 6)}
      `
    },
    {
      id: 'ocean-wave', name: 'Ocean wave', category: 'nature',
      x: 285, y: -815, size: 92, rot: 4,
      svgInner: `
        <path class="c-fill" d="M16 86c10-32 34-54 60-52 14 1 24 10 23 22-1 9-10 14-18 10-7-3-7-13 0-15-9-4-20 3-20 15 0 11 11 19 25 19 8 0 14-2 19-5v14H16v-8z" fill="#9bd8ff" stroke="#367fc2" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-hi" d="M36 62c8-12 18-18 29-19" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round" opacity="0.8"/>
      `
    },
    {
      id: 'water-splash', name: 'Water splash', category: 'nature',
      x: -345, y: -670, size: 84, rot: 8,
      svgInner: `
        <path class="c-fill" d="M60 20c8 17 22 30 22 46 0 13-10 23-22 23s-22-10-22-23c0-16 14-29 22-46z" fill="#b3e5ff" stroke="#3b88c9" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M26 42l8 6M94 42l-8 6M22 64h9M89 64h9" stroke="#3b88c9" stroke-width="6" stroke-linecap="round"/>
        <ellipse class="c-hi" cx="52" cy="58" rx="4" ry="8" transform="rotate(-14 52 58)" fill="#ffffff" opacity="0.78"/>
      `
    },
    {
      id: 'grass-tuft', name: 'Grass tuft', category: 'nature',
      x: -165, y: -658, size: 86, rot: -5,
      svgInner: `
        <path class="c-fill" d="M30 92c-8-18-12-34-8-46 8 10 15 20 18 32 1-22 8-42 18-56 5 18 6 34 4 50 9-14 20-26 32-32-4 18-10 34-18 52H30z" fill="#99e2a8" stroke="#2f8a57" stroke-width="6.5" stroke-linejoin="round"/>
      `
    },
    {
      id: 'tiny-globe', name: 'Tiny globe', category: 'nature',
      x: 20, y: -655, size: 90, rot: 6,
      svgInner: `
        <circle class="c-fill" cx="60" cy="60" r="36" fill="#a8dcff" stroke="#3c7bb8" stroke-width="6.5"/>
        <path class="c-fill-alt" d="M34 44c10-6 21-3 22 6 1 8-8 11-6 19 2 7 10 9 7 18-13-4-23-16-24-31 0-4 0-8 1-12zM72 34c9 5 15 15 16 26-7 2-14-1-17-7-3-7 2-12 1-19z" fill="#98e0a4" stroke="#388557" stroke-width="5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="47" cy="39" rx="7" ry="3.5" transform="rotate(-28 47 39)" fill="#ffffff" opacity="0.76"/>
      `
    },
    {
      id: 'crescent-moon', name: 'Sleepy moon', category: 'nature',
      x: 205, y: -662, size: 86, rot: -8,
      svgInner: `
        <path class="c-fill" d="M74 22c-26 3-44 25-40 50 3 23 24 38 47 35 7-1 13-3 18-7-16 1-30-10-33-26-3-18 8-35 24-41-5-7-10-12-16-11z" fill="#ffeb85" stroke="#cf961d" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="46" cy="54" rx="4" ry="8" transform="rotate(-12 46 54)" fill="#ffffff" opacity="0.75"/>
      `
    },
    {
      id: 'raindrops', name: 'Raindrop trio', category: 'nature',
      x: 375, y: -676, size: 82, rot: 5,
      svgInner: `
        <path class="c-fill" d="M38 28c6 12 13 21 13 30a13 13 0 1 1-26 0c0-9 7-18 13-30z" fill="#b8e6ff" stroke="#3e89c9" stroke-width="6"/>
        <path class="c-fill" d="M78 24c5 11 12 19 12 27a12 12 0 1 1-24 0c0-8 7-16 12-27z" fill="#b8e6ff" stroke="#3e89c9" stroke-width="6"/>
        <path class="c-fill" d="M60 54c6 12 13 21 13 29a13 13 0 1 1-26 0c0-8 7-17 13-29z" fill="#b8e6ff" stroke="#3e89c9" stroke-width="6"/>
      `
    },
    {
      id: 'soft-rainbow', name: 'Soft rainbow', category: 'nature',
      x: 0, y: -1065, size: 96, rot: -3,
      svgInner: `
        <path class="c-stroke" d="M18 82c0-28 19-48 42-48s42 20 42 48" stroke="#f26b6b" stroke-width="11" stroke-linecap="round"/>
        <path class="c-stroke" d="M31 82c0-20 13-35 29-35s29 15 29 35" stroke="#ffd152" stroke-width="10" stroke-linecap="round"/>
        <path class="c-stroke" d="M44 82c0-13 7-22 16-22s16 9 16 22" stroke="#6cc2ff" stroke-width="9.5" stroke-linecap="round"/>
      `
    },

    /* ======================================================================
       4. HEARTS & CELEBRATORY SPARKS (12) — East Neighborhood (x: +1025, y: 0)
       ====================================================================== */
    {
      id: 'plump-heart', name: 'Plump heart', category: 'sparks',
      x: 860, y: -140, size: 88, rot: -7,
      svgInner: `
        <path class="c-fill" d="M60 96C34 78 20 62 20 45c0-14 11-23 23-23 9 0 15 5 17 12 2-7 8-12 17-12 12 0 23 9 23 23 0 17-14 33-40 51z" fill="#ff96b0" stroke="#cf3a62" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="38" cy="40" rx="6" ry="3.2" transform="rotate(-34 38 40)" fill="#ffffff" opacity="0.78"/>
      `
    },
    {
      id: 'heart-burst', name: 'Heart burst', category: 'sparks',
      x: 1025, y: -145, size: 90, rot: 5,
      svgInner: `
        <path class="c-stroke" d="M60 12v10M24 26l7 7M96 26l-7 7M14 58h10M96 58h10" stroke="#e04870" stroke-width="6" stroke-linecap="round"/>
        <path class="c-fill" d="M60 92C40 78 30 66 30 53c0-10 8-17 17-17 7 0 11 4 13 9 2-5 6-9 13-9 9 0 17 7 17 17 0 13-10 25-30 39z" fill="#ffa3ba" stroke="#d13b64" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="44" cy="49" rx="4.5" ry="2.5" transform="rotate(-30 44 49)" fill="#ffffff" opacity="0.8"/>
      `
    },
    {
      id: 'four-sparkle', name: 'Four-point sparkle', category: 'sparks',
      x: 1190, y: -130, size: 86, rot: -5,
      svgInner: `
        <path class="c-fill" d="M60 16c4 24 14 38 42 44-28 6-38 20-42 44-4-24-14-38-42-44 28-6 38-20 42-44z" fill="#ffe473" stroke="#d49217" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-hi" cx="55" cy="52" r="4" fill="#ffffff" opacity="0.8"/>
      `
    },
    {
      id: 'twinkle-cluster', name: 'Twinkle cluster', category: 'sparks',
      x: 845, y: 12, size: 86, rot: 8,
      svgInner: `
        <path class="c-fill" d="M46 22c3 15 9 23 26 27-17 4-23 12-26 27-3-15-9-23-26-27 17-4 23-12 26-27z" fill="#ffe680" stroke="#d49315" stroke-width="6" stroke-linejoin="round"/>
        <path class="c-fill" d="M84 56c2 10 6 15 17 18-11 3-15 8-17 18-2-10-6-15-17-18 11-3 15-8 17-18z" fill="#ffc4dc" stroke="#cf5384" stroke-width="5.5" stroke-linejoin="round"/>
        <circle class="c-fill" cx="84" cy="30" r="6" fill="#bae4ff" stroke="#4289c7" stroke-width="4.5"/>
      `
    },
    {
      id: 'five-star', name: 'Sunny star', category: 'sparks',
      x: 1018, y: 18, size: 90, rot: -6,
      svgInner: `
        <path class="c-fill" d="M60 17l13 27 29 4-21 20 5 29-26-14-26 14 5-29-21-20 29-4 13-27z" fill="#ffe066" stroke="#d48b13" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(54, 66, 61, 7)}
      `
    },
    {
      id: 'little-crown', name: 'Little crown', category: 'sparks',
      x: 1192, y: 20, size: 88, rot: 7,
      svgInner: `
        <path class="c-fill" d="M22 86l-5-42 24 18 19-28 19 28 24-18-5 42H22z" fill="#ffd95e" stroke="#cf8a15" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill-alt" cx="60" cy="28" r="6" fill="#ff9eb8" stroke="#cf4c72" stroke-width="4.5"/>
        <circle class="c-fill-alt" cx="18" cy="38" r="5" fill="#9ed8ff" stroke="#3c7fc2" stroke-width="4.5"/>
        <circle class="c-fill-alt" cx="102" cy="38" r="5" fill="#9ed8ff" stroke="#3c7fc2" stroke-width="4.5"/>
      `
    },
    {
      id: 'party-swirl', name: 'Party swirl', category: 'sparks',
      x: 862, y: 162, size: 84, rot: -9,
      svgInner: `
        <path class="c-stroke" d="M24 88c14-24 28-40 48-56" stroke="#e05692" stroke-width="7" stroke-linecap="round"/>
        <path class="c-stroke" d="M36 96c22-18 42-26 62-28" stroke="#f59e0b" stroke-width="7" stroke-linecap="round"/>
        <path class="c-stroke" d="M20 54c12-12 24-22 40-30" stroke="#0ea5e9" stroke-width="7" stroke-linecap="round"/>
        <circle class="c-fill" cx="84" cy="34" r="6.5" fill="#ffe066" stroke="#d48b13" stroke-width="4.5"/>
        <circle class="c-fill" cx="92" cy="86" r="5.5" fill="#a8e6b8" stroke="#2f8a57" stroke-width="4.5"/>
      `
    },
    {
      id: 'lightning-bolt', name: 'Lightning bolt', category: 'sparks',
      x: 1028, y: 166, size: 86, rot: 8,
      svgInner: `
        <path class="c-fill" d="M68 16L30 64h26l-8 40 42-50H63l5-38z" fill="#ffe15c" stroke="#cf8b11" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="55" cy="44" rx="3.5" ry="7" transform="rotate(24 55 44)" fill="#ffffff" opacity="0.76"/>
      `
    },
    {
      id: 'shooting-star', name: 'Shooting star', category: 'sparks',
      x: 1195, y: 162, size: 90, rot: -5,
      svgInner: `
        <path class="c-stroke" d="M18 86c14-14 28-23 44-28M28 96c12-10 24-17 38-20M18 68c12-10 22-17 34-20" stroke="#7eb8f7" stroke-width="6" stroke-linecap="round"/>
        <path class="c-fill" d="M78 24l8 16 18 3-13 12 3 18-16-9-16 9 3-18-13-12 18-3 8-16z" fill="#ffe169" stroke="#d48b13" stroke-width="6" stroke-linejoin="round"/>
      `
    },
    {
      id: 'confetti-pop', name: 'Confetti pop', category: 'sparks',
      x: 938, y: 292, size: 86, rot: -6,
      svgInner: `
        <path class="c-fill" d="M24 94l18-52 34 34-52 18z" fill="#ffb899" stroke="#cf6038" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M37 56l26 26" stroke="#cf6038" stroke-width="5"/>
        <path class="c-stroke" d="M60 32c6-8 14-12 22-12M78 46c10-4 18-2 24 4M72 64c10 2 18 8 22 14" stroke="#e0487a" stroke-width="6" stroke-linecap="round"/>
        <circle class="c-fill" cx="94" cy="24" r="5" fill="#ffe066" stroke="#d48b13" stroke-width="4"/>
      `
    },
    {
      id: 'ribbon-bow', name: 'Ribbon bow', category: 'sparks',
      x: 1112, y: 295, size: 86, rot: 6,
      svgInner: `
        <path class="c-fill" d="M52 60c-16-22-34-22-34-4 0 18 18 18 34 4zm16 0c16-22 34-22 34-4 0 18-18 18-34 4z" fill="#ffbad2" stroke="#cc4b7a" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M54 66l-16 28M66 66l16 28" stroke="#cc4b7a" stroke-width="7.5" stroke-linecap="round"/>
        <circle class="c-fill" cx="60" cy="58" r="10" fill="#ff94b8" stroke="#cc4b7a" stroke-width="6"/>
      `
    },
    {
      id: 'peace-bloom', name: 'Cheerful bloom', category: 'sparks',
      x: 1320, y: -55, size: 84, rot: -8,
      svgInner: `
        <path class="c-fill" d="M60 20c10 0 14 11 11 19 8-4 19 0 21 9 2 9-7 15-15 16 7 5 9 16 2 22-7 6-17 2-19-6-2 8-12 12-19 6-7-6-5-17 2-22-8-1-17-7-15-16 2-9 13-13 21-9-3-8 1-19 11-19z" fill="#ffc4d6" stroke="#cf537c" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill-alt" cx="60" cy="60" r="14" fill="#ffe373" stroke="#cf8e17" stroke-width="5.5"/>
      `
    },

    /* ======================================================================
       5. EDITORIAL SYMBOLS & MARKS (10) — South Neighborhood (x: 0, y: +740)
       ====================================================================== */
    {
      id: 'question-mark', name: 'Question mark', category: 'editorial',
      x: -290, y: 655, size: 84, rot: -8,
      svgInner: `
        <path class="c-stroke" d="M40 42c0-13 10-22 22-22 13 0 22 8 22 20 0 11-8 16-16 21-6 4-8 8-8 15" stroke="#5368d4" stroke-width="9" stroke-linecap="round"/>
        <circle class="c-fill" cx="60" cy="94" r="7" fill="#c7d2ff" stroke="#5368d4" stroke-width="6"/>
      `
    },
    {
      id: 'exclamation-mark', name: 'Exclamation mark', category: 'editorial',
      x: -115, y: 660, size: 84, rot: 6,
      svgInner: `
        <path class="c-fill" d="M51 22c0-5 4-8 9-8s9 3 9 8l-3 50c0 4-3 6-6 6s-6-2-6-6l-3-50z" fill="#ff9e8e" stroke="#cf4532" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill" cx="60" cy="95" r="8" fill="#ff9e8e" stroke="#cf4532" stroke-width="6"/>
      `
    },
    {
      id: 'emphasis-pop', name: 'Emphasis pop', category: 'editorial',
      x: 75, y: 658, size: 84, rot: -5,
      svgInner: `
        <path class="c-stroke" d="M24 72L52 24M52 88l24-56M74 96l28-30" stroke="#e86f2c" stroke-width="8.5" stroke-linecap="round"/>
      `
    },
    {
      id: 'hand-ring', name: 'Hand-drawn circle', category: 'editorial',
      x: 268, y: 662, size: 88, rot: 4,
      svgInner: `
        <path class="c-stroke" d="M36 32c24-12 58-6 64 20 6 24-14 48-42 46-26-2-42-22-36-46 4-14 16-24 30-26" stroke="#2c9164" stroke-width="7.5" stroke-linecap="round"/>
      `
    },
    {
      id: 'playful-hash', name: 'Playful hashtag', category: 'editorial',
      x: -325, y: 815, size: 84, rot: 7,
      svgInner: `
        <path class="c-stroke" d="M46 22L36 98M84 22L74 98M24 46h72M20 74h72" stroke="#8557c7" stroke-width="8" stroke-linecap="round"/>
      `
    },
    {
      id: 'soft-triangle', name: 'Soft triangle', category: 'editorial',
      x: -145, y: 822, size: 84, rot: -7,
      svgInner: `
        <path class="c-fill" d="M60 22L98 90H22L60 22z" fill="#a8e6cf" stroke="#2e8c66" stroke-width="7" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="54" cy="52" rx="4" ry="8" transform="rotate(24 54 52)" fill="#ffffff" opacity="0.72"/>
      `
    },
    {
      id: 'gem-diamond', name: 'Gem diamond', category: 'editorial',
      x: 45, y: 822, size: 86, rot: 5,
      svgInner: `
        <path class="c-fill" d="M36 28h48l18 24-42 46-42-46 18-24z" fill="#b8e4ff" stroke="#387ec4" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-stroke" d="M18 52h84M44 28l-6 24 22 46M76 28l6 24-22 46" stroke="#387ec4" stroke-width="4.5" stroke-linejoin="round"/>
      `
    },
    {
      id: 'diagonal-hatch', name: 'Diagonal hatching', category: 'editorial',
      x: 235, y: 822, size: 84, rot: -4,
      svgInner: `
        <path class="c-stroke" d="M22 48L48 22M20 76L76 20M28 96L96 28M56 98L98 56" stroke="#c96b47" stroke-width="7.5" stroke-linecap="round"/>
      `
    },
    {
      id: 'speech-bubble', name: 'Speech bubble', category: 'editorial',
      x: -55, y: 970, size: 90, rot: -4,
      svgInner: `
        <path class="c-fill-alt" d="M24 56c0-18 16-32 37-32s37 14 37 32-16 32-37 32c-5 0-11-1-16-3l-17 9 5-16c-6-6-9-13-9-22z" fill="#fff7d6" stroke="#cc8f1d" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-stroke-fill" cx="46" cy="56" r="4" fill="#cc8f1d"/>
        <circle class="c-stroke-fill" cx="61" cy="56" r="4" fill="#cc8f1d"/>
        <circle class="c-stroke-fill" cx="76" cy="56" r="4" fill="#cc8f1d"/>
      `
    },
    {
      id: 'check-flourish', name: 'Checkmark flourish', category: 'editorial',
      x: 138, y: 972, size: 84, rot: 6,
      svgInner: `
        <circle class="c-fill" cx="60" cy="60" r="37" fill="#c2f2d6" stroke="#248a59" stroke-width="6.5"/>
        <path class="c-stroke" d="M41 61l13 13 27-29" stroke="#248a59" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      `
    },

    /* ======================================================================
       6. PLAYFUL FELINES (8) — Southeast Neighborhood (x: +855, y: +685)
       ====================================================================== */
    {
      id: 'sleepy-tabby', name: 'Sleepy tabby', category: 'felines',
      x: 695, y: 605, size: 94, rot: -6,
      svgInner: `
        <path class="c-fill" d="M26 76c0-20 15-34 36-34 19 0 34 12 34 32 0 11-7 17-19 17H43c-11 0-17-6-17-15z" fill="#ffca8a" stroke="#bf7430" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill" d="M36 46l-4-16 15 9M74 44l6-14-16 8" fill="#ffca8a" stroke="#bf7430" stroke-width="6" stroke-linejoin="round"/>
        <path class="c-stroke" d="M88 86c11-2 17-10 14-18" stroke="#bf7430" stroke-width="6.5" stroke-linecap="round"/>
        <path class="c-eye-stroke" d="M45 64c3 3 7 3 10 0M65 64c3 3 7 3 10 0" stroke="#3a2a24" stroke-width="3.6" stroke-linecap="round"/>
        <ellipse class="c-cheek" cx="42" cy="70" rx="5.5" ry="3.2" fill="#ff9e94"/>
        <ellipse class="c-cheek" cx="78" cy="70" rx="5.5" ry="3.2" fill="#ff9e94"/>
      `
    },
    {
      id: 'heart-cat', name: 'Heart-hug cat', category: 'felines',
      x: 865, y: 598, size: 94, rot: 5,
      svgInner: `
        <path class="c-fill-alt" d="M32 45l-3-21 19 11h24l19-11-3 21c6 7 8 15 7 25-2 15-15 24-35 24S27 85 25 70c-1-10 1-18 7-25z" fill="#fff5e6" stroke="#8f7264" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(51, 69, 55, 8)}
        <path class="c-fill" d="M60 92c-10-7-16-13-16-20 0-5 4-9 9-9 3 0 6 2 7 5 1-3 4-5 7-5 5 0 9 4 9 9 0 7-6 13-16 20z" fill="#ff96b0" stroke="#cc3f66" stroke-width="5" stroke-linejoin="round"/>
      `
    },
    {
      id: 'stretch-kitty', name: 'Stretching kitty', category: 'felines',
      x: 1038, y: 612, size: 96, rot: -4,
      svgInner: `
        <path class="c-stroke" d="M90 54c11-8 14-20 7-26" stroke="#636b78" stroke-width="6.5" stroke-linecap="round"/>
        <path class="c-fill" d="M22 84l16-12c4-14 14-22 28-22 16 0 26 10 26 24v12H78V74H48l-14 14-12-4z" fill="#cfd6e3" stroke="#636b78" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-fill" cx="38" cy="56" r="16" fill="#cfd6e3" stroke="#636b78" stroke-width="6.5"/>
        <path class="c-fill" d="M27 45l-2-12 10 6M48 44l4-11-11 5" fill="#cfd6e3" stroke="#636b78" stroke-width="5.5" stroke-linejoin="round"/>
        ${face(33, 44, 56, 6)}
      `
    },
    {
      id: 'box-cat', name: 'Cat in a box', category: 'felines',
      x: 705, y: 765, size: 94, rot: 6,
      svgInner: `
        <path class="c-fill-alt" d="M38 56V39l-2-14 14 9h20l14-9-2 14v17" fill="#ffe8cc" stroke="#996d49" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(52, 68, 45, 7)}
        <rect class="c-fill" x="24" y="56" width="72" height="40" rx="8" fill="#e6be8a" stroke="#996d49" stroke-width="6.5"/>
        <path class="c-stroke" d="M44 56c0 8 4 12 8 12M76 56c0 8-4 12-8 12" stroke="#996d49" stroke-width="5.5" stroke-linecap="round"/>
      `
    },
    {
      id: 'crown-cat', name: 'Royal kitty', category: 'felines',
      x: 878, y: 762, size: 94, rot: -5,
      svgInner: `
        <path class="c-fill" d="M46 28l-3-13 10 7 7-9 7 9 10-7-3 13H46z" fill="#ffe066" stroke="#cc8a14" stroke-width="5" stroke-linejoin="round"/>
        <path class="c-fill-alt" d="M32 50l-2-19 18 10h24l18-10-2 19c7 7 8 17 5 27-4 13-16 20-33 20s-29-7-33-20c-3-10-2-20 5-27z" fill="#f7d6e6" stroke="#a65b82" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(51, 69, 64, 8)}
        <path class="c-eye-stroke" d="M56 71c2 3 6 3 8 0" stroke="#3a2a24" stroke-width="3.2" stroke-linecap="round"/>
      `
    },
    {
      id: 'yarn-cat', name: 'Yarn-ball kitty', category: 'felines',
      x: 1045, y: 765, size: 92, rot: 7,
      svgInner: `
        <circle class="c-fill" cx="76" cy="76" r="20" fill="#ffb0c8" stroke="#c74e78" stroke-width="6"/>
        <path class="c-stroke" d="M62 66c10 4 20 12 24 22M66 88c8-10 16-18 26-20" stroke="#c74e78" stroke-width="4.5" stroke-linecap="round"/>
        <circle class="c-fill-alt" cx="46" cy="54" r="22" fill="#ffe0a8" stroke="#b87832" stroke-width="6.5"/>
        <path class="c-fill-alt" d="M30 40l-3-14 14 7M62 40l3-14-14 7" fill="#ffe0a8" stroke="#b87832" stroke-width="6" stroke-linejoin="round"/>
        ${face(40, 52, 54, 6)}
      `
    },
    {
      id: 'waving-calico', name: 'Waving calico', category: 'felines',
      x: 785, y: 920, size: 92, rot: -7,
      svgInner: `
        <path class="c-fill-alt" d="M34 45l-3-19 18 10h22l18-10-3 19c6 8 9 18 8 30-1 14-14 21-34 21S27 89 26 75c-1-12 2-22 8-30z" fill="#fffaf0" stroke="#7d6456" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill-nostroke" d="M32 34c9 2 15 8 15 16-8 1-14-1-17-6z" fill="#ffb570"/>
        <path class="c-fill-nostroke" d="M74 68c8-2 15 2 18 10-4 9-12 13-21 14-3-9-2-18 3-24z" fill="#827873" opacity="0.55"/>
        <path class="c-fill-alt" d="M84 58c8-10 16-10 18-3 2 7-5 14-14 17" fill="#fffaf0" stroke="#7d6456" stroke-width="6" stroke-linecap="round"/>
        ${face(51, 69, 58, 8)}
      `
    },
    {
      id: 'loaf-cat', name: 'Cozy loaf cat', category: 'felines',
      x: 965, y: 918, size: 94, rot: 4,
      svgInner: `
        <path class="c-fill" d="M22 76c0-20 14-34 38-34s38 14 38 34c0 12-9 18-24 18H46c-15 0-24-6-24-18z" fill="#ffd9a8" stroke="#ba7636" stroke-width="6.5"/>
        <path class="c-fill" d="M35 46l-4-16 16 10M85 46l4-16-16 10" fill="#ffd9a8" stroke="#ba7636" stroke-width="6" stroke-linejoin="round"/>
        ${face(52, 68, 66, 8)}
        <path class="c-stroke" d="M46 92c0-6 5-8 10-6M74 92c0-6-5-8-10-6" stroke="#ba7636" stroke-width="5" stroke-linecap="round"/>
      `
    },

    /* ======================================================================
       7. CHARACTER FIGURES (5) — Southwest Neighborhood (x: -855, y: +685)
       ====================================================================== */
    {
      id: 'cozy-ghost', name: 'Cozy ghost', category: 'characters',
      x: -1010, y: 615, size: 92, rot: -7,
      svgInner: `
        <path class="c-fill-alt" d="M30 58c0-22 13-36 30-36s30 14 30 36v30c-5 6-11 6-15 0-5 6-11 6-15 0-4 6-10 6-15 0-4 6-10 6-15 0V58z" fill="#f7f9ff" stroke="#7c87a6" stroke-width="6.5" stroke-linejoin="round"/>
        <ellipse class="c-hi" cx="46" cy="39" rx="5.5" ry="3" transform="rotate(-30 46 39)" fill="#ffffff"/>
        ${face(51, 69, 55, 8)}
      `
    },
    {
      id: 'mini-robot', name: 'Mini robot', category: 'characters',
      x: -840, y: 610, size: 94, rot: 5,
      svgInner: `
        <path class="c-stroke" d="M60 22v12" stroke="#5c7699" stroke-width="6" stroke-linecap="round"/>
        <circle class="c-fill" cx="60" cy="18" r="6" fill="#ff9e8e" stroke="#cf5142" stroke-width="5"/>
        <rect class="c-fill" x="28" y="34" width="64" height="48" rx="14" fill="#c7e0f7" stroke="#5c7699" stroke-width="6.5"/>
        <rect class="c-fill-alt" x="40" y="47" width="40" height="22" rx="8" fill="#ffffff" stroke="#5c7699" stroke-width="5"/>
        ${face(52, 68, 58, 7)}
        <path class="c-stroke" d="M46 84v12M74 84v12" stroke="#5c7699" stroke-width="7" stroke-linecap="round"/>
      `
    },
    {
      id: 'mushroom-sprite', name: 'Mushroom sprite', category: 'characters',
      x: -675, y: 625, size: 92, rot: -5,
      svgInner: `
        <path class="c-fill-alt" d="M43 60h34v22c0 8-7 13-17 13s-17-5-17-13V60z" fill="#fff2d9" stroke="#9e7b56" stroke-width="6.5" stroke-linejoin="round"/>
        <path class="c-fill" d="M22 60c2-24 17-38 38-38s36 14 38 38H22z" fill="#fa8778" stroke="#c74b3e" stroke-width="6.5" stroke-linejoin="round"/>
        <circle class="c-hi" cx="44" cy="41" r="6" fill="#fff7e8"/>
        <circle class="c-hi" cx="74" cy="39" r="5" fill="#fff7e8"/>
        <circle class="c-hi" cx="61" cy="51" r="4" fill="#fff7e8"/>
        ${face(53, 67, 75, 7)}
      `
    },
    {
      id: 'cloud-buddy', name: 'Cloud buddy', category: 'characters',
      x: -930, y: 785, size: 94, rot: 6,
      svgInner: `
        <path class="c-stroke" d="M48 82v14M72 82v14" stroke="#628cb8" stroke-width="6.5" stroke-linecap="round"/>
        <path class="c-fill" d="M32 80h56c12 0 20-8 20-18 0-9-7-16-16-17-3-14-14-23-28-23-12 0-23 7-27 18-11 1-19 10-19 20 0 11 6 20 14 20z" fill="#d9f0ff" stroke="#628cb8" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(52, 68, 59, 8)}
        <path class="c-eye-stroke" d="M56 65c2 3 6 3 8 0" stroke="#3a2a24" stroke-width="3.2" stroke-linecap="round"/>
      `
    },
    {
      id: 'star-mascot', name: 'Star mascot', category: 'characters',
      x: -745, y: 790, size: 94, rot: -6,
      svgInner: `
        <path class="c-stroke" d="M47 86l-5 14M73 86l5 14M26 56l-10-4M94 56l10-4" stroke="#cc8a14" stroke-width="6.5" stroke-linecap="round"/>
        <path class="c-fill" d="M60 18l12 24 27 4-19 19 4 27-24-13-24 13 4-27-19-19 27-4 12-24z" fill="#ffe370" stroke="#cc8a14" stroke-width="6.5" stroke-linejoin="round"/>
        ${face(53, 67, 58, 7)}
        <path class="c-eye-stroke" d="M57 64c2 2.5 4 2.5 6 0" stroke="#3a2a24" stroke-width="3" stroke-linecap="round"/>
      `
    }
  ];

  // Attach full SVG markup string to every sticker
  STICKERS.forEach((s) => {
    s.svg = mkSvg(s.svgInner);
  });

  return { PALETTES, CATEGORIES, HINTS, STICKERS };
})();
