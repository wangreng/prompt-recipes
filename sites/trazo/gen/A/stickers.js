/* ==========================================================================
   Trazo — 71 Hand-Drawn Wax-Crayon SVG Sticker Illustrations
   Seven spatial neighborhoods centered around (0, 0)
   ========================================================================== */

(function () {
  'use strict';

  window.TRAZO_CATEGORIES = [
    { id: 'all', label: 'All (71)' },
    { id: 'marine', label: 'Marine life' },
    { id: 'arrows', label: 'Arrows & flow' },
    { id: 'nature', label: 'Weather & nature' },
    { id: 'sparks', label: 'Hearts & sparks' },
    { id: 'editorial', label: 'Editorial marks' },
    { id: 'felines', label: 'Playful felines' },
    { id: 'characters', label: 'Characters' }
  ];

  window.TRAZO_PALETTES = [
    { id: 'original', name: 'Original' },
    { id: 'ink', name: 'Ink' },
    { id: 'red', name: 'Red' },
    { id: 'orange', name: 'Orange' },
    { id: 'yellow', name: 'Yellow' },
    { id: 'green', name: 'Green' },
    { id: 'sky', name: 'Sky' },
    { id: 'cobalt', name: 'Cobalt' },
    { id: 'pink', name: 'Pink' }
  ];

  // Shared helper for crisp stroke attributes
  const R = 'stroke-linecap="round" stroke-linejoin="round"';

  window.TRAZO_STICKERS = [
    /* ======================================================================
       1. CENTER HALO — MARINE LIFE (16 stickers)
       Organic airy ring surrounding the origin hero
       ====================================================================== */
    {
      id: 'baby-squid',
      name: 'Baby squid',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -372, y: -242, rot: -10, size: 96,
      tags: ['sea', 'ocean', 'squid', 'cute', 'animal'],
      colors: { fill: '#ff9eb5', fill2: '#ffd1dc', shade: '#e85d82', stroke: '#6b2238', cheek: '#ff6b8b' },
      svg: `
        <path class="c-fill" d="M60 18 C82 22 90 48 86 68 C82 78 38 78 34 68 C30 48 38 22 60 18 Z"/>
        <path class="c-fill-2" d="M36 45 C24 36 22 25 32 28 C37 30 41 37 42 44 Z M84 45 C96 36 98 25 88 28 C83 30 79 37 78 44 Z"/>
        <path class="c-shade" opacity="0.34" d="M68 24 C83 34 86 56 80 71 C74 75 64 75 62 72 C73 61 75 39 68 24 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M60 18 C81 21 89 47 85 68 C81 76 39 76 35 68 C31 47 39 21 60 18 Z"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M36 45 C24 36 23 25 33 28 M84 45 C96 36 97 25 87 28"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M43 74 C38 87 31 94 37 101 M54 75 C53 89 48 97 54 103 M66 75 C67 89 72 97 67 103 M77 74 C82 87 89 94 83 101"/>
        <circle class="c-eye" cx="50" cy="54" r="3.1"/>
        <circle class="c-eye" cx="70" cy="54" r="3.1"/>
        <circle class="c-hi" cx="49" cy="52.8" r="1.1"/>
        <circle class="c-hi" cx="69" cy="52.8" r="1.1"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M56 61 Q60 65 64 61"/>
        <ellipse class="c-cheek" opacity="0.6" cx="43" cy="60" rx="4.2" ry="2.6"/>
        <ellipse class="c-cheek" opacity="0.6" cx="77" cy="60" rx="4.2" ry="2.6"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.75" ${R} d="M48 31 C45 36 44 41 44 44"/>
      `
    },
    {
      id: 'conch-shell',
      name: 'Conch shell',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -178, y: -290, rot: 8, size: 92,
      tags: ['sea', 'shell', 'beach', 'ocean', 'spiral'],
      colors: { fill: '#ffc09f', fill2: '#ffe5d4', shade: '#e07a5f', stroke: '#6d3626', cheek: '#ff9b85' },
      svg: `
        <path class="c-fill" d="M26 78 C22 56 38 30 62 24 C83 19 98 34 94 55 C90 77 65 94 42 92 C31 91 27 85 26 78 Z"/>
        <path class="c-fill-2" d="M44 82 C36 67 45 45 64 40 C79 36 86 48 80 62 C74 75 56 85 44 82 Z"/>
        <path class="c-shade" opacity="0.32" d="M62 24 C82 22 96 36 92 56 C88 73 70 88 53 90 C69 78 82 60 80 44 C78 33 70 26 62 24 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M24 81 C21 57 38 30 62 24 C82 19 98 33 94 55 C90 78 65 94 40 92 C29 91 25 87 24 81 Z"/>
        <path class="c-stroke" stroke-width="3.2" ${R} d="M34 86 C35 66 50 44 68 41 C80 39 85 49 80 59 C75 68 62 72 56 64 C52 59 56 51 64 52"/>
        <path class="c-stroke" stroke-width="2.8" ${R} d="M47 32 L54 43 M66 25 L68 38 M82 32 L78 42"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.75" ${R} d="M36 53 C41 44 47 38 53 35"/>
      `
    },
    {
      id: 'flapjack-octopus',
      name: 'Flapjack octopus',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 14, y: -302, rot: -5, size: 98,
      tags: ['sea', 'octopus', 'dumbo', 'cute', 'orange'],
      colors: { fill: '#ff9f68', fill2: '#ffd4b2', shade: '#e85d2a', stroke: '#6e2b12', cheek: '#ff6b6b' },
      svg: `
        <path class="c-fill-2" d="M34 48 C18 42 15 30 26 28 C34 27 40 36 42 44 Z M86 48 C102 42 105 30 94 28 C86 27 80 36 78 44 Z"/>
        <path class="c-fill" d="M22 78 C24 52 38 30 60 30 C82 30 96 52 98 78 C99 88 90 92 82 86 C76 92 66 93 60 87 C54 93 44 92 38 86 C30 92 21 88 22 78 Z"/>
        <path class="c-shade" opacity="0.3" d="M68 33 C85 39 94 59 95 79 C91 88 81 86 78 82 C83 66 80 45 68 33 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M35 46 C19 42 16 29 26 28 C34 27 39 34 42 40 M85 46 C101 42 104 29 94 28 C86 27 81 34 78 40"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M22 78 C24 52 37 30 60 30 C83 30 96 52 98 78 C99 88 89 92 82 85 C76 92 66 93 60 86 C54 93 44 92 38 85 C31 92 21 88 22 78 Z"/>
        <circle class="c-eye" cx="48" cy="60" r="3.4"/>
        <circle class="c-eye" cx="72" cy="60" r="3.4"/>
        <circle class="c-hi" cx="46.8" cy="58.7" r="1.2"/>
        <circle class="c-hi" cx="70.8" cy="58.7" r="1.2"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M56 66 Q60 70 64 66"/>
        <ellipse class="c-cheek" opacity="0.58" cx="40" cy="66" rx="4.5" ry="2.7"/>
        <ellipse class="c-cheek" opacity="0.58" cx="80" cy="66" rx="4.5" ry="2.7"/>
        <path class="c-hi-stroke" stroke-width="3" opacity="0.72" ${R} d="M47 41 C52 38 58 37 63 38"/>
      `
    },
    {
      id: 'seahorse',
      name: 'Seahorse',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 204, y: -288, rot: 11, size: 96,
      tags: ['sea', 'seahorse', 'ocean', 'yellow', 'cute'],
      colors: { fill: '#ffd166', fill2: '#fff0b8', shade: '#e09f1f', stroke: '#694608', cheek: '#ff8a80' },
      svg: `
        <path class="c-fill-2" d="M68 48 C81 44 88 53 84 62 C80 68 71 67 66 64 Z"/>
        <path class="c-fill" d="M56 20 C70 20 77 32 72 44 C68 53 76 66 70 80 C65 92 50 100 44 94 C39 89 45 81 51 83 C55 84 55 90 50 90 C57 86 58 75 51 67 C44 59 44 49 48 42 L34 40 C30 39 31 33 36 33 L48 33 C48 25 51 20 56 20 Z"/>
        <path class="c-shade" opacity="0.3" d="M55 46 C62 56 64 71 57 84 C65 79 70 67 66 55 C64 49 60 46 55 46 Z"/>
        <path class="c-stroke" stroke-width="3.5" ${R} d="M69 48 C81 45 87 53 83 61 C79 67 71 66 68 63"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M56 20 C70 20 77 32 71 45 C67 54 75 67 69 81 C63 94 49 101 42 94 C37 89 43 80 50 82 C55 83 55 89 51 90"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M56 20 C50 20 47 26 48 33 L35 33 C30 33 30 40 35 40 L48 42 C43 50 44 60 51 68 C57 74 58 80 54 85"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M52 54 H61 M53 62 H63 M55 70 H64"/>
        <circle class="c-eye" cx="56" cy="33" r="2.9"/>
        <circle class="c-hi" cx="55" cy="32" r="1"/>
        <ellipse class="c-cheek" opacity="0.58" cx="61" cy="39" rx="3.4" ry="2.2"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M59 19 L62 14 M66 23 L71 19"/>
      `
    },
    {
      id: 'sea-turtle',
      name: 'Sea turtle',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 392, y: -228, rot: -8, size: 102,
      tags: ['sea', 'turtle', 'green', 'ocean', 'shell'],
      colors: { fill: '#69db7c', fill2: '#b2f2bb', shade: '#2f9e44', stroke: '#1b5426', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill-2" d="M80 48 C92 42 103 47 102 58 C101 67 89 69 79 65 Z"/>
        <path class="c-fill-2" d="M62 34 C65 20 77 18 79 27 C80 33 74 39 69 40 Z M60 79 C63 94 75 97 78 88 C79 82 73 76 67 74 Z M32 45 C22 39 17 46 22 53 C26 57 32 56 35 54 Z M33 70 C23 76 19 84 26 86 C32 87 37 81 38 76 Z"/>
        <ellipse class="c-fill" cx="55" cy="58" rx="28" ry="23"/>
        <path class="c-shade" opacity="0.32" d="M35 66 C45 77 67 78 78 65 C70 74 47 74 35 66 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M80 48 C92 42 103 48 101 58 C100 66 89 69 80 65"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M61 36 C64 20 77 18 79 28 C80 34 74 39 70 40 M60 79 C63 95 76 97 78 87 C79 81 73 76 68 74 M32 46 C22 40 17 47 23 53 M33 71 C23 76 20 84 27 86"/>
        <ellipse class="c-stroke" stroke-width="3.7" cx="55" cy="58" rx="28" ry="23"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M46 48 L58 45 L67 54 L63 66 L50 68 L42 58 Z M58 45 L62 36 M46 48 L40 40 M42 58 L29 58 M67 54 L81 55 M50 68 L46 78 M63 66 L69 75"/>
        <circle class="c-eye" cx="92" cy="54" r="2.7"/>
        <circle class="c-hi" cx="91.2" cy="53" r="0.9"/>
        <path class="c-stroke" stroke-width="2.3" ${R} d="M90 61 Q94 63 97 60"/>
        <ellipse class="c-cheek" opacity="0.55" cx="87" cy="60" rx="3" ry="2"/>
      `
    },
    {
      id: 'shrimp',
      name: 'Shrimp',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 505, y: -96, rot: 12, size: 90,
      tags: ['sea', 'shrimp', 'prawn', 'coral', 'ocean'],
      colors: { fill: '#ff8787', fill2: '#ffc9c9', shade: '#e03131', stroke: '#6e1919', cheek: '#ff6b6b' },
      svg: `
        <path class="c-fill" d="M36 42 C48 24 78 24 89 44 C98 60 88 86 67 90 C55 92 46 86 48 77 C50 70 60 72 64 67 C71 58 66 44 53 45 C44 46 39 51 35 49 C32 47 33 45 36 42 Z"/>
        <path class="c-fill-2" d="M47 78 L34 88 L43 95 L53 84 Z"/>
        <path class="c-shade" opacity="0.28" d="M62 28 C82 32 94 51 86 73 C80 83 68 88 60 87 C74 78 82 58 76 43 C73 35 67 30 62 28 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M36 43 C48 24 78 24 89 44 C98 61 88 86 67 90 C55 92 47 86 48 78 C50 71 60 72 64 66 C71 57 65 44 53 45 C44 46 38 51 34 48 C31 46 33 45 36 43 Z"/>
        <path class="c-stroke" stroke-width="3.2" ${R} d="M47 80 L34 88 L43 96 L52 86"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M58 29 L62 45 M76 34 L68 50 M89 54 L70 59 M85 73 L66 68"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M35 44 C22 39 17 31 20 23 M36 48 C24 50 18 57 21 63"/>
        <circle class="c-eye" cx="46" cy="39" r="2.8"/>
        <circle class="c-hi" cx="45" cy="38" r="0.9"/>
      `
    },
    {
      id: 'starfish',
      name: 'Starfish',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 404, y: 20, rot: -14, size: 92,
      tags: ['sea', 'star', 'starfish', 'beach', 'coral'],
      colors: { fill: '#ffa94d', fill2: '#ffe8cc', shade: '#e8590c', stroke: '#6e2a06', cheek: '#ff6b6b' },
      svg: `
        <path class="c-fill" d="M60 16 C65 16 70 36 74 42 C80 45 101 44 103 49 C105 55 88 67 86 73 C86 80 94 98 89 102 C83 105 68 92 60 92 C52 92 37 105 31 102 C26 98 34 80 34 73 C32 67 15 55 17 49 C19 44 40 45 46 42 C50 36 55 16 60 16 Z"/>
        <path class="c-shade" opacity="0.28" d="M60 92 C68 92 83 104 88 100 C92 96 86 80 86 73 C88 68 101 57 102 51 C91 63 75 79 60 92 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M60 16 C65 16 70 36 74 42 C80 45 101 44 103 49 C105 55 88 67 86 73 C86 80 94 98 89 102 C83 105 68 92 60 92 C52 92 37 105 31 102 C26 98 34 80 34 73 C32 67 15 55 17 49 C19 44 40 45 46 42 C50 36 55 16 60 16 Z"/>
        <circle class="c-eye" cx="51" cy="59" r="3"/>
        <circle class="c-eye" cx="69" cy="59" r="3"/>
        <circle class="c-hi" cx="50" cy="58" r="1"/>
        <circle class="c-hi" cx="68" cy="58" r="1"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M56 66 Q60 70 64 66"/>
        <ellipse class="c-cheek" opacity="0.58" cx="44" cy="65" rx="3.8" ry="2.3"/>
        <ellipse class="c-cheek" opacity="0.58" cx="76" cy="65" rx="3.8" ry="2.3"/>
        <circle class="c-fill-2" cx="60" cy="31" r="2.4"/>
        <circle class="c-fill-2" cx="87" cy="54" r="2.4"/>
        <circle class="c-fill-2" cx="33" cy="54" r="2.4"/>
        <circle class="c-fill-2" cx="42" cy="86" r="2.4"/>
        <circle class="c-fill-2" cx="78" cy="86" r="2.4"/>
      `
    },
    {
      id: 'octopus',
      name: 'Octopus',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 545, y: 124, rot: 7, size: 100,
      tags: ['sea', 'octopus', 'purple', 'cute', 'tentacles'],
      colors: { fill: '#b197fc', fill2: '#e5dbff', shade: '#7950f2', stroke: '#3c217d', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M60 20 C82 20 92 38 89 58 C87 69 78 73 60 73 C42 73 33 69 31 58 C28 38 38 20 60 20 Z"/>
        <path class="c-shade" opacity="0.3" d="M70 24 C85 31 90 48 86 64 C80 71 70 72 64 72 C75 62 79 41 70 24 Z"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M36 69 C24 76 18 89 26 95 C32 99 39 92 36 86"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M47 73 C44 87 38 98 46 102 C52 104 55 96 52 91"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M73 73 C76 87 82 98 74 102 C68 104 65 96 68 91"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M84 69 C96 76 102 89 94 95 C88 99 81 92 84 86"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M60 20 C82 20 92 38 89 58 C87 69 78 73 60 73 C42 73 33 69 31 58 C28 38 38 20 60 20 Z"/>
        <circle class="c-eye" cx="49" cy="50" r="3.3"/>
        <circle class="c-eye" cx="71" cy="50" r="3.3"/>
        <circle class="c-hi" cx="47.8" cy="48.8" r="1.1"/>
        <circle class="c-hi" cx="69.8" cy="48.8" r="1.1"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M56 57 Q60 61 64 57"/>
        <ellipse class="c-cheek" opacity="0.58" cx="41" cy="56" rx="4.2" ry="2.5"/>
        <ellipse class="c-cheek" opacity="0.58" cx="79" cy="56" rx="4.2" ry="2.5"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.72" ${R} d="M45 31 C49 27 55 26 60 26"/>
      `
    },
    {
      id: 'crab',
      name: 'Crab',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 382, y: 238, rot: -6, size: 96,
      tags: ['sea', 'crab', 'red', 'beach', 'cute'],
      colors: { fill: '#ff6b6b', fill2: '#ffc9c9', shade: '#e03131', stroke: '#6b1414', cheek: '#ff9eb5' },
      svg: `
        <path class="c-fill" d="M24 38 C16 28 24 18 33 24 C36 26 35 32 32 34 C38 30 43 37 38 44 C34 49 27 44 24 38 Z M96 38 C104 28 96 18 87 24 C84 26 85 32 88 34 C82 30 77 37 82 44 C86 49 93 44 96 38 Z"/>
        <ellipse class="c-fill" cx="60" cy="68" rx="31" ry="22"/>
        <path class="c-shade" opacity="0.3" d="M35 78 C47 90 74 90 86 76 C75 84 46 84 35 78 Z"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M35 55 L29 45 M85 55 L91 45"/>
        <path class="c-stroke" stroke-width="3.5" ${R} d="M24 38 C16 28 24 18 33 24 C36 26 34 32 31 33 C38 30 43 37 38 44 C34 49 27 44 24 38 Z"/>
        <path class="c-stroke" stroke-width="3.5" ${R} d="M96 38 C104 28 96 18 87 24 C84 26 86 32 89 33 C82 30 77 37 82 44 C86 49 93 44 96 38 Z"/>
        <path class="c-stroke" stroke-width="3.3" ${R} d="M31 74 L18 80 M35 82 L24 91 M89 74 L102 80 M85 82 L96 91"/>
        <ellipse class="c-stroke" stroke-width="3.7" cx="60" cy="68" rx="31" ry="22"/>
        <path class="c-stroke" stroke-width="3" ${R} d="M49 48 L47 39 M71 48 L73 39"/>
        <circle class="c-eye" cx="47" cy="37" r="3.4"/>
        <circle class="c-eye" cx="73" cy="37" r="3.4"/>
        <circle class="c-hi" cx="46" cy="36" r="1.1"/>
        <circle class="c-hi" cx="72" cy="36" r="1.1"/>
        <path class="c-stroke" stroke-width="2.7" ${R} d="M53 69 Q60 75 67 69"/>
        <ellipse class="c-cheek" opacity="0.6" cx="42" cy="69" rx="4.2" ry="2.5"/>
        <ellipse class="c-cheek" opacity="0.6" cx="78" cy="69" rx="4.2" ry="2.5"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.72" ${R} d="M48 54 C54 52 62 52 68 54"/>
      `
    },
    {
      id: 'small-fish',
      name: 'Small fish',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: 196, y: 282, rot: 9, size: 90,
      tags: ['sea', 'fish', 'blue', 'ocean', 'cute'],
      colors: { fill: '#74c0fc', fill2: '#d0ebff', shade: '#228be6', stroke: '#144475', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill-2" d="M78 58 L101 40 C104 49 104 69 101 78 L78 62 Z"/>
        <path class="c-fill-2" d="M46 40 C52 27 65 27 68 39 Z"/>
        <path class="c-fill" d="M20 60 C24 41 44 34 62 39 C75 43 84 52 84 60 C84 68 75 77 62 81 C44 86 24 79 20 60 Z"/>
        <path class="c-shade" opacity="0.28" d="M28 71 C43 82 69 80 82 64 C70 74 44 76 28 71 Z"/>
        <path class="c-stroke" stroke-width="3.5" ${R} d="M79 58 L101 41 C104 51 104 69 101 78 L79 62"/>
        <path class="c-stroke" stroke-width="3.3" ${R} d="M47 39 C52 27 65 28 67 39"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M20 60 C24 40 44 34 62 39 C75 43 83 52 83 60 C83 68 75 77 62 81 C44 86 24 80 20 60 Z"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M56 54 C62 56 62 65 55 67"/>
        <circle class="c-eye" cx="37" cy="56" r="3.2"/>
        <circle class="c-hi" cx="36" cy="54.8" r="1.1"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M23 64 Q28 66 32 63"/>
        <ellipse class="c-cheek" opacity="0.58" cx="43" cy="64" rx="3.8" ry="2.4"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.72" ${R} d="M42 45 C49 43 56 43 62 45"/>
      `
    },
    {
      id: 'water-bubble',
      name: 'Water bubble',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -12, y: 286, rot: -8, size: 84,
      tags: ['sea', 'water', 'bubble', 'ocean', 'drop'],
      colors: { fill: '#a5d8ff', fill2: '#e7f5ff', shade: '#339af0', stroke: '#195285', cheek: '#74c0fc' },
      svg: `
        <circle class="c-fill-2" cx="56" cy="64" r="30"/>
        <path class="c-fill" opacity="0.55" d="M35 80 C47 93 74 91 83 71 C77 83 51 89 35 80 Z"/>
        <circle class="c-stroke" stroke-width="3.6" cx="56" cy="64" r="30"/>
        <path class="c-hi-stroke" stroke-width="4" opacity="0.9" ${R} d="M40 49 C44 43 51 40 58 41"/>
        <circle class="c-hi" cx="37" cy="58" r="2.8"/>
        <circle class="c-fill-2" cx="89" cy="36" r="11"/>
        <circle class="c-stroke" stroke-width="3.2" cx="89" cy="36" r="11"/>
        <path class="c-hi-stroke" stroke-width="2.5" ${R} d="M84 32 C86 30 89 29 91 30"/>
        <circle class="c-fill-2" cx="73" cy="22" r="5.5"/>
        <circle class="c-stroke" stroke-width="2.8" cx="73" cy="22" r="5.5"/>
      `
    },
    {
      id: 'jellyfish',
      name: 'Jellyfish',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -206, y: 278, rot: 10, size: 96,
      tags: ['sea', 'jellyfish', 'pink', 'ocean', 'cute'],
      colors: { fill: '#eebefa', fill2: '#f8f0fc', shade: '#be4bdb', stroke: '#5d1d70', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M26 58 C26 32 41 20 60 20 C79 20 94 32 94 58 C94 64 85 66 78 61 C72 67 65 67 60 61 C55 67 48 67 42 61 C35 66 26 64 26 58 Z"/>
        <path class="c-shade" opacity="0.28" d="M68 23 C83 28 92 41 92 58 C86 63 79 61 77 59 C81 45 78 32 68 23 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M26 58 C26 32 41 20 60 20 C79 20 94 32 94 58 C94 64 85 66 78 61 C72 67 65 67 60 61 C55 67 48 67 42 61 C35 66 26 64 26 58 Z"/>
        <path class="c-stroke" stroke-width="3.3" ${R} d="M38 66 C34 78 42 87 37 99 M52 67 C56 79 49 89 54 102 M68 67 C64 79 71 89 66 102 M82 66 C86 78 78 87 83 99"/>
        <circle class="c-eye" cx="49" cy="45" r="3"/>
        <circle class="c-eye" cx="71" cy="45" r="3"/>
        <circle class="c-hi" cx="48" cy="44" r="1"/>
        <circle class="c-hi" cx="70" cy="44" r="1"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M56 51 Q60 55 64 51"/>
        <ellipse class="c-cheek" opacity="0.58" cx="41" cy="51" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="79" cy="51" rx="3.8" ry="2.2"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.78" ${R} d="M41 34 C46 28 53 26 60 26"/>
      `
    },
    {
      id: 'dolphin',
      name: 'Dolphin',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -396, y: 230, rot: -9, size: 102,
      tags: ['sea', 'dolphin', 'blue', 'ocean', 'jump'],
      colors: { fill: '#74c0fc', fill2: '#e7f5ff', shade: '#1c7ed6', stroke: '#143f6b', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M22 65 C19 62 23 56 32 54 C36 37 54 27 72 32 C76 23 84 22 83 34 C93 42 98 58 93 74 C98 78 104 83 98 88 C92 91 86 85 83 80 C77 86 69 89 67 82 C75 76 80 65 76 56 C70 46 54 47 45 58 C38 66 28 69 22 65 Z"/>
        <path class="c-fill-2" d="M36 62 C44 55 62 50 74 58 C65 65 48 67 36 62 Z"/>
        <path class="c-shade" opacity="0.26" d="M50 32 C66 28 84 37 91 55 C85 45 69 36 50 32 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M22 65 C19 62 23 56 32 54 C36 37 54 27 72 32 C76 23 84 22 83 34 C93 42 98 58 93 74 C99 78 104 83 98 88 C92 91 86 85 83 80 C77 86 69 89 67 82 C75 76 80 65 76 56 C70 46 54 47 45 58 C38 66 28 69 22 65 Z"/>
        <path class="c-stroke" stroke-width="3.2" ${R} d="M56 59 C54 67 48 72 44 69"/>
        <circle class="c-eye" cx="43" cy="48" r="2.8"/>
        <circle class="c-hi" cx="42" cy="47" r="1"/>
        <ellipse class="c-cheek" opacity="0.55" cx="47" cy="54" rx="3.4" ry="2.1"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.72" ${R} d="M50 37 C57 35 64 35 70 37"/>
      `
    },
    {
      id: 'pearl-clam',
      name: 'Pearl clam',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -544, y: 110, rot: 6, size: 94,
      tags: ['sea', 'clam', 'pearl', 'shell', 'ocean'],
      colors: { fill: '#f3d9fa', fill2: '#fff4e6', shade: '#ae3ec9', stroke: '#551d66', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M24 62 C20 38 38 22 60 22 C82 22 100 38 96 62 C88 68 32 68 24 62 Z"/>
        <path class="c-fill" d="M22 68 C32 63 88 63 98 68 C94 87 79 97 60 97 C41 97 26 87 22 68 Z"/>
        <path class="c-shade" opacity="0.3" d="M28 69 C41 64 79 64 92 69 C84 78 36 78 28 69 Z"/>
        <circle class="c-fill-2" cx="60" cy="61" r="13"/>
        <circle class="c-stroke" stroke-width="3.4" cx="60" cy="61" r="13"/>
        <path class="c-hi-stroke" stroke-width="2.8" ${R} d="M54 55 C56 53 60 52 63 53"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M24 62 C20 38 38 22 60 22 C82 22 100 38 96 62"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M22 68 C30 64 42 63 47 64 M73 64 C78 63 90 64 98 68 C94 87 79 97 60 97 C41 97 26 87 22 68 Z"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M40 28 L46 47 M60 24 L60 45 M80 28 L74 47 M42 90 L48 77 M60 94 L60 78 M78 90 L72 77"/>
      `
    },
    {
      id: 'scallop-shell',
      name: 'Scallop shell',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -404, y: -4, rot: 13, size: 88,
      tags: ['sea', 'scallop', 'shell', 'beach', 'pastel'],
      colors: { fill: '#ffe066', fill2: '#fff3bf', shade: '#f08c00', stroke: '#6e4204', cheek: '#ff922b' },
      svg: `
        <path class="c-fill" d="M22 62 C18 40 36 22 60 22 C84 22 102 40 98 62 C95 74 82 82 74 86 L78 96 L42 96 L46 86 C38 82 25 74 22 62 Z"/>
        <path class="c-shade" opacity="0.28" d="M60 22 C82 22 99 39 96 61 C93 73 81 80 74 85 L60 85 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M22 62 C18 40 36 22 60 22 C84 22 102 40 98 62 C95 74 82 82 74 86 L78 96 L42 96 L46 86 C38 82 25 74 22 62 Z"/>
        <path class="c-stroke" stroke-width="2.8" ${R} d="M60 25 L60 85 M40 29 L52 84 M80 29 L68 84 M27 46 L46 82 M93 46 L74 82"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.75" ${R} d="M35 37 C40 32 47 29 53 28"/>
      `
    },
    {
      id: 'striped-fish',
      name: 'Striped fish',
      category: 'marine',
      categoryLabel: 'Marine life',
      x: -518, y: -124, rot: -11, size: 94,
      tags: ['sea', 'fish', 'clownfish', 'stripes', 'orange'],
      colors: { fill: '#ff922b', fill2: '#fff4e6', shade: '#d9480f', stroke: '#692507', cheek: '#ff6b6b' },
      svg: `
        <path class="c-fill" d="M80 56 L102 38 C105 49 105 71 102 82 L80 64 Z"/>
        <path class="c-fill" d="M18 60 C24 38 46 31 66 37 C79 41 86 52 86 60 C86 68 79 79 66 83 C46 89 24 82 18 60 Z"/>
        <path class="c-fill-2" d="M46 36 C51 47 51 73 46 84 L57 84 C61 73 61 47 57 36 Z M69 40 C73 50 73 70 69 80 L76 77 C79 68 79 52 76 43 Z"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M80 56 L102 39 C105 50 105 70 102 81 L80 64"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M18 60 C24 38 46 31 66 37 C79 41 86 52 86 60 C86 68 79 79 66 83 C46 89 24 82 18 60 Z"/>
        <path class="c-stroke" stroke-width="2.8" ${R} d="M47 36 C51 49 51 71 47 84 M57 36 C61 49 61 71 57 84 M70 40 C73 51 73 69 70 79"/>
        <circle class="c-eye" cx="34" cy="56" r="3.1"/>
        <circle class="c-hi" cx="33" cy="54.8" r="1"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M22 65 Q27 67 31 64"/>
      `
    },

    /* ======================================================================
       2. WEST — DIRECTIONAL ARROWS & FLOW (10 stickers)
       ====================================================================== */
    {
      id: 'loopy-arrow',
      name: 'Loopy arrow',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1320, y: -185, rot: -6, size: 96,
      tags: ['arrow', 'loop', 'flow', 'pointer', 'curvy'],
      colors: { fill: '#228be6', fill2: '#74c0fc', shade: '#1864ab', stroke: '#153b61', cheek: '#74c0fc' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7" opacity="0.35" ${R} d="M22 86 C36 84 62 72 64 52 C65 36 48 34 45 47 C42 62 66 72 95 40"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M20 84 C36 82 61 70 63 50 C64 34 47 33 44 46 C41 61 65 71 94 38"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M77 36 L96 36 L93 55"/>
      `
    },
    {
      id: 'curved-arrow',
      name: 'Curved arrow',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1135, y: -200, rot: 7, size: 90,
      tags: ['arrow', 'curve', 'point', 'swoop'],
      colors: { fill: '#f76b15', fill2: '#ffc078', shade: '#d9480f', stroke: '#6b2507', cheek: '#ffa94d' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.35" ${R} d="M25 84 C28 48 56 32 94 42"/>
        <path class="c-stroke" stroke-width="4.4" ${R} d="M24 82 C27 46 55 30 93 40"/>
        <path class="c-stroke" stroke-width="4.4" ${R} d="M78 26 L96 41 L76 53"/>
      `
    },
    {
      id: 'double-swoop',
      name: 'Double swoop',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -945, y: -185, rot: -8, size: 94,
      tags: ['arrow', 'swap', 'sync', 'cycle', 'flow'],
      colors: { fill: '#2f9e44', fill2: '#8ce99a', shade: '#2b8a3e', stroke: '#164d21', cheek: '#69db7c' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7" opacity="0.35" ${R} d="M26 48 C44 26 76 26 94 46 M94 74 C76 94 44 94 26 74"/>
        <path class="c-stroke" stroke-width="4.1" ${R} d="M26 46 C44 25 76 25 94 45 M80 44 L96 46 L93 30"/>
        <path class="c-stroke" stroke-width="4.1" ${R} d="M94 74 C76 95 44 95 26 75 M40 76 L24 74 L27 90"/>
      `
    },
    {
      id: 'spiral-curl',
      name: 'Spiral curl',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -785, y: -95, rot: 11, size: 88,
      tags: ['spiral', 'swirl', 'doodle', 'curl', 'flow'],
      colors: { fill: '#be4bdb', fill2: '#eebefa', shade: '#9c36b5', stroke: '#4d195c', cheek: '#da77f2' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.32" ${R} d="M62 60 C62 54 54 54 53 60 C52 69 66 72 71 62 C77 48 56 38 45 48 C32 60 41 83 60 85 C82 87 95 65 88 43 C81 24 55 18 37 29"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M61 59 C61 53 53 53 52 59 C51 68 65 71 70 61 C76 47 55 37 44 47 C31 59 40 82 59 84 C81 86 94 64 87 42 C80 23 54 17 36 28"/>
      `
    },
    {
      id: 'wavy-ribbon',
      name: 'Wavy ribbon',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1245, y: 5, rot: 5, size: 96,
      tags: ['wave', 'ribbon', 'flow', 'line', 'squiggle'],
      colors: { fill: '#e64980', fill2: '#fcc2d7', shade: '#c2255c', stroke: '#6b1232', cheek: '#faa2c1' },
      svg: `
        <path class="c-fill" opacity="0.7" d="M18 68 C32 42 48 42 60 60 C72 78 88 78 102 52 L102 68 C88 94 72 94 60 76 C48 58 32 58 18 84 Z"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M18 66 C32 40 48 40 60 58 C72 76 88 76 102 50"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M18 82 C32 56 48 56 60 74 C72 92 88 92 102 66"/>
        <path class="c-hi-stroke" stroke-width="2.4" opacity="0.75" ${R} d="M27 65 C35 55 43 54 50 61"/>
      `
    },
    {
      id: 'zigzag-bolt',
      name: 'Zigzag flow',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1035, y: 12, rot: -9, size: 92,
      tags: ['zigzag', 'flow', 'arrow', 'energy', 'line'],
      colors: { fill: '#fab005', fill2: '#fff3bf', shade: '#e67700', stroke: '#693c00', cheek: '#ffd43b' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.36" ${R} d="M20 76 L42 42 L58 72 L78 38 L98 54"/>
        <path class="c-stroke" stroke-width="4.4" ${R} d="M20 74 L42 40 L58 70 L78 36 L97 52"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M84 54 L99 54 L96 39"/>
      `
    },
    {
      id: 'return-loop',
      name: 'Return loop',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -845, y: 85, rot: 6, size: 90,
      tags: ['arrow', 'return', 'undo', 'back', 'flow'],
      colors: { fill: '#15aabf', fill2: '#99e9f2', shade: '#0b7285', stroke: '#0c434f', cheek: '#66d9e8' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7.5" opacity="0.34" ${R} d="M34 44 H74 C92 44 96 82 72 82 H32"/>
        <path class="c-stroke" stroke-width="4.3" ${R} d="M32 42 H74 C92 42 95 80 72 80 H30"/>
        <path class="c-stroke" stroke-width="4.3" ${R} d="M46 28 L30 42 L46 56"/>
      `
    },
    {
      id: 'dotted-trail',
      name: 'Dotted trail',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1305, y: 182, rot: -5, size: 92,
      tags: ['dots', 'arrow', 'trail', 'path', 'dashed'],
      colors: { fill: '#e5484d', fill2: '#ffc9c9', shade: '#c92a2a', stroke: '#691418', cheek: '#ff8787' },
      svg: `
        <path class="c-accent-stroke" stroke-width="4.4" stroke-dasharray="2 12" ${R} d="M20 82 C36 42 66 36 88 52"/>
        <path class="c-stroke" stroke-width="4.2" stroke-dasharray="1 13" ${R} d="M22 80 C38 40 68 34 90 50"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M80 35 L96 52 L75 59"/>
      `
    },
    {
      id: 'squiggle-arrow',
      name: 'Squiggle arrow',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -1100, y: 192, rot: 9, size: 94,
      tags: ['arrow', 'squiggle', 'wiggle', 'hand-drawn'],
      colors: { fill: '#7950f2', fill2: '#d0bfff', shade: '#5f3dc4', stroke: '#351c75', cheek: '#b197fc' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7.5" opacity="0.34" ${R} d="M20 62 Q30 42 40 62 T60 62 T80 62 L96 62"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M20 60 Q30 40 40 60 T60 60 T80 60 L96 60"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M83 47 L98 60 L83 73"/>
      `
    },
    {
      id: 'swirl-pointer',
      name: 'Swirl pointer',
      category: 'arrows',
      categoryLabel: 'Arrows & flow',
      x: -915, y: 215, rot: -10, size: 90,
      tags: ['arrow', 'pointer', 'down', 'swirl'],
      colors: { fill: '#40c057', fill2: '#b2f2bb', shade: '#2f9e44', stroke: '#175222', cheek: '#69db7c' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7.5" opacity="0.34" ${R} d="M40 22 C66 24 80 42 64 56 C51 67 36 53 48 44 C61 36 74 60 66 94"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M39 20 C65 22 79 40 63 54 C50 65 35 51 47 42 C60 34 73 58 65 92"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M52 80 L65 95 L79 82"/>
      `
    },

    /* ======================================================================
       3. NORTH — WEATHER & NATURE (10 stickers)
       ====================================================================== */
    {
      id: 'puffy-cloud',
      name: 'Puffy cloud',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: -365, y: -815, rot: -6, size: 100,
      tags: ['cloud', 'weather', 'sky', 'cute', 'nature'],
      colors: { fill: '#d0ebff', fill2: '#ffffff', shade: '#74c0fc', stroke: '#1d4c75', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M32 80 C20 80 16 66 24 58 C23 44 37 36 48 42 C53 28 74 28 79 43 C92 41 102 52 99 65 C103 73 96 81 86 80 Z"/>
        <path class="c-shade" opacity="0.28" d="M27 78 H90 C96 78 99 71 96 67 C85 74 42 74 27 78 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M32 80 C20 80 16 66 24 58 C23 44 37 36 48 42 C53 28 74 28 79 43 C92 41 102 52 99 65 C103 73 96 81 86 80 Z"/>
        <circle class="c-eye" cx="50" cy="60" r="2.9"/>
        <circle class="c-eye" cx="70" cy="60" r="2.9"/>
        <circle class="c-hi" cx="49" cy="59" r="1"/>
        <circle class="c-hi" cx="69" cy="59" r="1"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M56 66 Q60 70 64 66"/>
        <ellipse class="c-cheek" opacity="0.58" cx="42" cy="66" rx="4" ry="2.3"/>
        <ellipse class="c-cheek" opacity="0.58" cx="78" cy="66" rx="4" ry="2.3"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.85" ${R} d="M55 38 C61 35 68 36 72 40"/>
      `
    },
    {
      id: 'sunburst-rays',
      name: 'Sun rays',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: -175, y: -840, rot: 8, size: 98,
      tags: ['sun', 'weather', 'warm', 'yellow', 'rays'],
      colors: { fill: '#ffd43b', fill2: '#fff3bf', shade: '#f08c00', stroke: '#734500', cheek: '#ff8787' },
      svg: `
        <circle class="c-fill" cx="60" cy="60" r="25"/>
        <path class="c-shade" opacity="0.28" d="M44 77 C56 87 78 82 83 64 C75 76 56 80 44 77 Z"/>
        <circle class="c-stroke" stroke-width="3.6" cx="60" cy="60" r="25"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M60 17 V27 M60 93 V103 M17 60 H27 M93 60 H103 M30 30 L37 37 M83 83 L90 90 M90 30 L83 37 M37 83 L30 90"/>
        <circle class="c-eye" cx="52" cy="57" r="2.9"/>
        <circle class="c-eye" cx="68" cy="57" r="2.9"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M55 65 Q60 69 65 65"/>
        <ellipse class="c-cheek" opacity="0.55" cx="45" cy="63" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.55" cx="75" cy="63" rx="3.8" ry="2.2"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.78" ${R} d="M47 45 C52 41 58 40 63 41"/>
      `
    },
    {
      id: 'smiling-daisy',
      name: 'Smiling daisy',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 20, y: -825, rot: -5, size: 96,
      tags: ['flower', 'daisy', 'nature', 'spring', 'cute'],
      colors: { fill: '#ffffff', fill2: '#ffd43b', shade: '#f59f00', stroke: '#4d3a10', cheek: '#ff8fa3' },
      svg: `
        <g class="c-stroke-fill" stroke-width="3.4">
          <ellipse cx="60" cy="29" rx="11" ry="15"/>
          <ellipse cx="60" cy="91" rx="11" ry="15"/>
          <ellipse cx="29" cy="60" rx="15" ry="11"/>
          <ellipse cx="91" cy="60" rx="15" ry="11"/>
          <ellipse cx="38" cy="38" rx="11" ry="14" transform="rotate(-45 38 38)"/>
          <ellipse cx="82" cy="38" rx="11" ry="14" transform="rotate(45 82 38)"/>
          <ellipse cx="38" cy="82" rx="11" ry="14" transform="rotate(45 38 82)"/>
          <ellipse cx="82" cy="82" rx="11" ry="14" transform="rotate(-45 82 82)"/>
        </g>
        <circle class="c-fill-2" cx="60" cy="60" r="19"/>
        <circle class="c-stroke" stroke-width="3.5" cx="60" cy="60" r="19"/>
        <circle class="c-eye" cx="53" cy="58" r="2.7"/>
        <circle class="c-eye" cx="67" cy="58" r="2.7"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M56 65 Q60 69 64 65"/>
        <ellipse class="c-cheek" opacity="0.58" cx="48" cy="63" rx="3.2" ry="2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="72" cy="63" rx="3.2" ry="2"/>
      `
    },
    {
      id: 'twin-daisies',
      name: 'Twin daisies',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 215, y: -840, rot: 9, size: 94,
      tags: ['flowers', 'daisy', 'bloom', 'pink', 'nature'],
      colors: { fill: '#ffc9de', fill2: '#ffe066', shade: '#e64980', stroke: '#691b3a', cheek: '#ff8fa3' },
      svg: `
        <path class="c-stroke" stroke-width="3.4" ${R} d="M44 62 C44 79 49 92 54 102 M78 52 C74 71 66 86 60 101 M50 86 C39 81 36 88 45 92 M69 83 C80 78 84 85 73 90"/>
        <g class="c-stroke-fill" stroke-width="3">
          <circle cx="43" cy="36" r="8"/><circle cx="56" cy="44" r="8"/><circle cx="51" cy="58" r="8"/><circle cx="35" cy="58" r="8"/><circle cx="30" cy="44" r="8"/>
        </g>
        <circle class="c-stroke-fill2" stroke-width="3" cx="43" cy="48" r="8.5"/>
        <g class="c-stroke-fill" stroke-width="3">
          <circle cx="80" cy="24" r="7.5"/><circle cx="92" cy="33" r="7.5"/><circle cx="88" cy="46" r="7.5"/><circle cx="72" cy="46" r="7.5"/><circle cx="68" cy="33" r="7.5"/>
        </g>
        <circle class="c-stroke-fill2" stroke-width="3" cx="80" cy="36" r="7.5"/>
      `
    },
    {
      id: 'ocean-wave',
      name: 'Ocean wave',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 400, y: -800, rot: -7, size: 96,
      tags: ['wave', 'water', 'ocean', 'sea', 'nature'],
      colors: { fill: '#4dabf7', fill2: '#d0ebff', shade: '#1971c2', stroke: '#133e6e', cheek: '#74c0fc' },
      svg: `
        <path class="c-fill" d="M18 82 C26 52 46 30 70 30 C86 30 94 42 86 52 C81 58 72 56 71 49 C78 49 79 41 72 40 C58 39 51 55 60 66 C68 75 88 74 102 68 L100 86 C76 92 42 92 18 82 Z"/>
        <path class="c-shade" opacity="0.3" d="M24 83 C46 90 76 90 98 84 L99 75 C78 82 48 82 24 83 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M18 82 C26 52 46 30 70 30 C86 30 94 42 86 52 C81 58 72 56 71 49 C78 49 79 41 72 40 C58 39 51 55 60 66 C68 75 88 74 102 68"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M22 86 C48 92 78 92 100 85"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.82" ${R} d="M36 58 C42 46 53 38 64 36"/>
      `
    },
    {
      id: 'water-splash',
      name: 'Water splash',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: -380, y: -620, rot: 7, size: 90,
      tags: ['water', 'splash', 'drops', 'nature', 'fresh'],
      colors: { fill: '#66d9e8', fill2: '#c5f6fa', shade: '#15aabf', stroke: '#0c4e59', cheek: '#99e9f2' },
      svg: `
        <path class="c-stroke-fill" stroke-width="3.5" ${R} d="M60 20 C68 38 72 48 60 54 C48 48 52 38 60 20 Z"/>
        <path class="c-stroke-fill" stroke-width="3.5" ${R} d="M28 40 C42 48 48 56 41 66 C30 65 26 55 28 40 Z"/>
        <path class="c-stroke-fill" stroke-width="3.5" ${R} d="M92 40 C94 55 90 65 79 66 C72 56 78 48 92 40 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.5" ${R} d="M24 86 C36 74 52 72 60 76 C68 72 84 74 96 86 C82 94 38 94 24 86 Z"/>
        <path class="c-hi-stroke" stroke-width="2.4" ${R} d="M58 34 L57 42"/>
      `
    },
    {
      id: 'grass-tuft',
      name: 'Grass tuft',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: -185, y: -600, rot: -5, size: 92,
      tags: ['grass', 'leaf', 'plant', 'green', 'nature'],
      colors: { fill: '#69db7c', fill2: '#b2f2bb', shade: '#2f9e44', stroke: '#194d23', cheek: '#8ce99a' },
      svg: `
        <path class="c-fill" d="M24 90 C22 72 28 52 38 42 C38 60 44 74 48 82 C46 60 52 34 62 22 C66 44 68 68 68 82 C74 66 82 48 94 40 C92 60 86 78 84 90 Z"/>
        <path class="c-shade" opacity="0.28" d="M62 24 C66 46 68 68 68 88 H84 C87 74 91 57 93 42 C82 50 75 66 68 82 C68 64 66 42 62 24 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M24 90 C22 72 28 52 38 42 C38 60 44 74 48 82 C46 60 52 34 62 22 C66 44 68 68 68 82 C74 66 82 48 94 40 C92 60 86 78 84 90"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M18 91 C42 87 78 87 102 91"/>
      `
    },
    {
      id: 'little-globe',
      name: 'Little globe',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 15, y: -605, rot: 6, size: 94,
      tags: ['earth', 'globe', 'world', 'planet', 'nature'],
      colors: { fill: '#74c0fc', fill2: '#69db7c', shade: '#1c7ed6', stroke: '#163f66', cheek: '#ff8fa3' },
      svg: `
        <circle class="c-fill" cx="60" cy="60" r="37"/>
        <path class="c-fill-2" d="M32 45 C42 36 56 38 59 48 C61 55 51 60 52 69 C53 78 44 84 37 78 C29 70 25 54 32 45 Z"/>
        <path class="c-fill-2" d="M72 34 C84 39 93 52 91 66 C83 68 74 62 72 52 C70 44 68 38 72 34 Z"/>
        <path class="c-shade" opacity="0.22" d="M62 24 C83 25 97 43 96 64 C94 82 78 96 58 96 C75 88 87 72 86 52 C85 38 75 28 62 24 Z"/>
        <circle class="c-stroke" stroke-width="3.7" cx="60" cy="60" r="37"/>
        <path class="c-stroke" stroke-width="3" ${R} d="M32 45 C42 36 56 38 59 48 C61 55 51 60 52 69 C53 78 44 84 37 78 M72 34 C68 41 70 48 72 53 C74 62 83 67 91 65"/>
        <path class="c-hi-stroke" stroke-width="3" opacity="0.75" ${R} d="M40 36 C46 31 54 29 61 29"/>
      `
    },
    {
      id: 'rainy-cloud',
      name: 'Rainy cloud',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 205, y: -615, rot: -7, size: 94,
      tags: ['rain', 'cloud', 'weather', 'drops', 'sky'],
      colors: { fill: '#bac8ff', fill2: '#74c0fc', shade: '#5c7cfa', stroke: '#25356b', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M32 66 C20 66 17 53 25 46 C25 33 38 26 49 32 C55 20 75 21 80 35 C92 34 101 44 98 56 C100 63 93 67 84 66 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M32 66 C20 66 17 53 25 46 C25 33 38 26 49 32 C55 20 75 21 80 35 C92 34 101 44 98 56 C100 63 93 67 84 66 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.1" ${R} d="M40 76 C44 84 44 92 38 92 C32 92 34 84 40 76 Z M60 79 C64 87 64 95 58 95 C52 95 54 87 60 79 Z M80 76 C84 84 84 92 78 92 C72 92 74 84 80 76 Z"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.78" ${R} d="M55 29 C61 27 67 28 71 31"/>
      `
    },
    {
      id: 'crescent-moon',
      name: 'Crescent moon',
      category: 'nature',
      categoryLabel: 'Weather & nature',
      x: 390, y: -610, rot: 10, size: 90,
      tags: ['moon', 'night', 'sleep', 'sky', 'yellow'],
      colors: { fill: '#ffe066', fill2: '#fff9db', shade: '#f08c00', stroke: '#694106', cheek: '#ffa8a8' },
      svg: `
        <path class="c-fill" d="M76 24 C47 22 25 44 27 72 C29 94 52 104 75 96 C83 93 90 88 94 82 C75 88 57 76 55 58 C53 42 62 30 76 24 Z"/>
        <path class="c-shade" opacity="0.28" d="M34 80 C47 97 73 101 91 84 C73 94 49 91 34 80 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M76 24 C47 22 25 44 27 72 C29 94 52 104 75 96 C83 93 90 88 94 82 C75 88 57 76 55 58 C53 42 62 30 76 24 Z"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M40 62 Q44 65 48 62"/>
        <ellipse class="c-cheek" opacity="0.55" cx="44" cy="70" rx="3.6" ry="2.1"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M84 36 V44 M80 40 H88"/>
      `
    },

    /* ======================================================================
       4. EAST — HEARTS & CELEBRATORY SPARKS (12 stickers)
       ====================================================================== */
    {
      id: 'heart-burst',
      name: 'Heart burst',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 825, y: -215, rot: -8, size: 96,
      tags: ['heart', 'love', 'burst', 'celebrate', 'pink'],
      colors: { fill: '#ff6b8b', fill2: '#ffd6e0', shade: '#e0315a', stroke: '#6e142c', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M60 88 C36 72 26 57 29 44 C32 32 46 30 56 40 L60 45 L64 40 C74 30 88 32 91 44 C94 57 84 72 60 88 Z"/>
        <path class="c-shade" opacity="0.3" d="M60 88 C82 72 93 57 90 45 C87 36 78 33 71 36 C82 44 80 65 60 88 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M60 88 C36 72 26 57 29 44 C32 32 46 30 56 40 L60 45 L64 40 C74 30 88 32 91 44 C94 57 84 72 60 88 Z"/>
        <path class="c-stroke" stroke-width="3.1" ${R} d="M60 16 V25 M24 24 L30 30 M96 24 L90 30 M14 55 H22 M98 55 H106"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.82" ${R} d="M39 45 C40 40 45 38 49 40"/>
      `
    },
    {
      id: 'sketchy-heart',
      name: 'Sketchy heart',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1015, y: -220, rot: 7, size: 90,
      tags: ['heart', 'love', 'red', 'crayon'],
      colors: { fill: '#ff8787', fill2: '#ffe3e3', shade: '#e5484d', stroke: '#73161a', cheek: '#ffa8a8' },
      svg: `
        <path class="c-fill" d="M61 93 C35 76 22 57 25 40 C28 24 46 21 58 35 C70 21 89 24 92 40 C95 57 82 76 61 93 Z"/>
        <path class="c-shade-stroke" stroke-width="3.2" opacity="0.48" ${R} d="M34 49 L52 33 M33 61 L64 34 M42 72 L83 37 M52 82 L86 52"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M60 93 C34 76 21 57 24 40 C27 24 45 21 58 35 C71 21 89 24 92 40 C95 57 82 76 60 93 Z"/>
        <path class="c-hi-stroke" stroke-width="3" opacity="0.82" ${R} d="M34 42 C36 35 42 32 47 34"/>
      `
    },
    {
      id: 'double-hearts',
      name: 'Double hearts',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1205, y: -205, rot: -6, size: 94,
      tags: ['hearts', 'love', 'pair', 'pink'],
      colors: { fill: '#f783ac', fill2: '#ffdeeb', shade: '#d6336c', stroke: '#691534', cheek: '#faa2c1' },
      svg: `
        <path class="c-stroke-fill2" stroke-width="3.4" ${R} d="M84 62 C70 52 64 42 66 34 C68 27 77 26 83 33 C89 26 98 27 100 34 C102 42 96 52 84 62 Z"/>
        <path class="c-fill" d="M49 94 C28 80 18 64 21 50 C24 38 38 36 48 47 C58 36 72 38 75 50 C78 64 68 80 49 94 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M49 94 C28 80 18 64 21 50 C24 38 38 36 48 47 C58 36 72 38 75 50 C78 64 68 80 49 94 Z"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.8" ${R} d="M30 53 C32 48 36 46 40 47"/>
      `
    },
    {
      id: 'four-point-sparkle',
      name: 'Four-point sparkle',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1365, y: -95, rot: 10, size: 90,
      tags: ['sparkle', 'magic', 'star', 'shine', 'yellow'],
      colors: { fill: '#ffe066', fill2: '#fff9db', shade: '#f08c00', stroke: '#6e4004', cheek: '#ffd43b' },
      svg: `
        <path class="c-fill" d="M60 15 C64 42 78 56 105 60 C78 64 64 78 60 105 C56 78 42 64 15 60 C42 56 56 42 60 15 Z"/>
        <path class="c-shade" opacity="0.3" d="M60 17 C64 42 78 56 103 60 C78 64 64 78 60 103 L60 17 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M60 15 C64 42 78 56 105 60 C78 64 64 78 60 105 C56 78 42 64 15 60 C42 56 56 42 60 15 Z"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.85" ${R} d="M51 51 L41 56"/>
      `
    },
    {
      id: 'sparkle-cluster',
      name: 'Sparkle cluster',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 825, y: -10, rot: 6, size: 92,
      tags: ['sparkles', 'twinkle', 'stars', 'magic'],
      colors: { fill: '#74c0fc', fill2: '#ffd43b', shade: '#228be6', stroke: '#17406b', cheek: '#a5d8ff' },
      svg: `
        <path class="c-stroke-fill" stroke-width="3.4" ${R} d="M48 24 C51 43 61 52 79 55 C61 58 51 67 48 86 C45 67 35 58 17 55 C35 52 45 43 48 24 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.1" ${R} d="M88 22 C90 31 95 36 104 38 C95 40 90 45 88 54 C86 45 81 40 72 38 C81 36 86 31 88 22 Z"/>
        <path class="c-stroke-fill2" stroke-width="3" ${R} d="M82 72 C84 79 88 83 95 85 C88 87 84 91 82 98 C80 91 76 87 69 85 C76 83 80 79 82 72 Z"/>
      `
    },
    {
      id: 'chubby-star',
      name: 'Chubby star',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1015, y: -8, rot: -10, size: 94,
      tags: ['star', 'cute', 'yellow', 'gold', 'spark'],
      colors: { fill: '#ffd43b', fill2: '#fff3bf', shade: '#e8590c', stroke: '#6e3d05', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M60 18 C66 18 71 38 75 43 C81 46 101 46 103 52 C105 58 88 69 86 75 C85 81 93 99 87 102 C81 106 67 93 60 93 C53 93 39 106 33 102 C27 99 35 81 34 75 C32 69 15 58 17 52 C19 46 39 46 45 43 C49 38 54 18 60 18 Z"/>
        <path class="c-shade" opacity="0.26" d="M60 93 C67 93 81 105 87 101 C92 98 85 81 86 75 C88 70 101 59 102 53 C90 66 75 81 60 93 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M60 18 C66 18 71 38 75 43 C81 46 101 46 103 52 C105 58 88 69 86 75 C85 81 93 99 87 102 C81 106 67 93 60 93 C53 93 39 106 33 102 C27 99 35 81 34 75 C32 69 15 58 17 52 C19 46 39 46 45 43 C49 38 54 18 60 18 Z"/>
        <circle class="c-eye" cx="51" cy="60" r="3"/>
        <circle class="c-eye" cx="69" cy="60" r="3"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M56 67 Q60 71 64 67"/>
        <ellipse class="c-cheek" opacity="0.58" cx="44" cy="66" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="76" cy="66" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'shooting-star',
      name: 'Shooting star',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1210, y: 12, rot: 7, size: 96,
      tags: ['star', 'comet', 'shooting', 'magic', 'wish'],
      colors: { fill: '#ffe066', fill2: '#a5d8ff', shade: '#f08c00', stroke: '#613c08', cheek: '#ffd43b' },
      svg: `
        <path class="c-accent2-stroke" stroke-width="5.5" opacity="0.65" ${R} d="M18 88 C32 76 46 66 64 56 M24 98 C40 86 54 78 70 70 M16 74 C28 64 40 56 54 48"/>
        <path class="c-stroke" stroke-width="3.1" ${R} d="M19 87 C32 75 46 66 62 56 M27 96 C41 86 54 78 68 70"/>
        <path class="c-stroke-fill" stroke-width="3.5" ${R} d="M77 20 L83 37 L101 38 L87 49 L92 66 L77 56 L62 66 L67 49 L53 38 L71 37 Z"/>
      `
    },
    {
      id: 'party-crown',
      name: 'Party crown',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1365, y: 112, rot: -7, size: 92,
      tags: ['crown', 'king', 'queen', 'royal', 'gold'],
      colors: { fill: '#ffd43b', fill2: '#ff8787', shade: '#e67700', stroke: '#693c06', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M22 84 L18 42 L43 58 L60 32 L77 58 L102 42 L98 84 C74 89 46 89 22 84 Z"/>
        <path class="c-shade" opacity="0.28" d="M23 76 C47 81 73 81 97 76 L98 84 C74 89 46 89 22 84 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M22 84 L18 42 L43 58 L60 32 L77 58 L102 42 L98 84 C74 89 46 89 22 84 Z"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="18" cy="36" r="5"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="60" cy="26" r="5.5"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="102" cy="36" r="5"/>
        <circle class="c-fill-2" cx="60" cy="68" r="5"/>
        <circle class="c-stroke" stroke-width="2.4" cx="60" cy="68" r="5"/>
      `
    },
    {
      id: 'loopy-flourish',
      name: 'Loopy flourish',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 840, y: 192, rot: -6, size: 92,
      tags: ['flourish', 'loop', 'celebrate', 'ribbon', 'spark'],
      colors: { fill: '#cc5de8', fill2: '#f3d9fa', shade: '#9c36b5', stroke: '#4c185c', cheek: '#eebefa' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.32" ${R} d="M18 72 C32 32 54 32 48 56 C43 76 68 78 72 52 C76 28 96 34 102 68"/>
        <path class="c-stroke" stroke-width="4.2" ${R} d="M18 70 C32 30 54 30 48 54 C43 74 68 76 72 50 C76 26 96 32 102 66"/>
        <circle class="c-fill" cx="30" cy="32" r="4"/>
        <circle class="c-fill" cx="92" cy="80" r="4.5"/>
      `
    },
    {
      id: 'crayon-lightning',
      name: 'Crayon lightning',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1025, y: 196, rot: 9, size: 92,
      tags: ['lightning', 'bolt', 'fast', 'power', 'spark'],
      colors: { fill: '#ffe066', fill2: '#fff3bf', shade: '#f08c00', stroke: '#693d04', cheek: '#ffd43b' },
      svg: `
        <path class="c-fill" d="M68 16 L32 62 L56 62 L46 104 L88 54 L63 54 Z"/>
        <path class="c-shade" opacity="0.3" d="M68 16 L63 54 L88 54 L46 104 L68 58 L54 58 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M68 16 L32 62 L56 62 L46 104 L88 54 L63 54 Z"/>
        <path class="c-hi-stroke" stroke-width="2.6" opacity="0.82" ${R} d="M58 34 L44 53"/>
      `
    },
    {
      id: 'confetti-pop',
      name: 'Confetti pop',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1215, y: 204, rot: -8, size: 94,
      tags: ['confetti', 'party', 'celebrate', 'pop', 'fun'],
      colors: { fill: '#ff8787', fill2: '#ffd43b', shade: '#e03131', stroke: '#661a1a', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M24 96 L42 46 L74 78 Z"/>
        <path class="c-fill-2" d="M36 62 L58 84 L48 88 L32 72 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M24 96 L42 46 L74 78 Z"/>
        <path class="c-stroke" stroke-width="3.3" ${R} d="M56 38 C64 28 73 24 82 22 M68 48 C78 44 88 42 98 44 M78 62 C86 64 93 68 98 74"/>
        <circle class="c-fill-2" cx="68" cy="24" r="4.5"/><circle class="c-stroke" stroke-width="2.4" cx="68" cy="24" r="4.5"/>
        <circle class="c-fill" cx="94" cy="30" r="4"/><circle class="c-stroke" stroke-width="2.4" cx="94" cy="30" r="4"/>
        <rect class="c-stroke-fill2" stroke-width="2.4" x="84" y="50" width="8" height="8" rx="1.5" transform="rotate(24 88 54)"/>
      `
    },
    {
      id: 'ribbon-bow',
      name: 'Ribbon bow',
      category: 'sparks',
      categoryLabel: 'Hearts & sparks',
      x: 1370, y: 270, rot: 7, size: 92,
      tags: ['bow', 'ribbon', 'gift', 'cute', 'pink'],
      colors: { fill: '#faa2c1', fill2: '#ffdeeb', shade: '#e64980', stroke: '#6b1436', cheek: '#ff8fa3' },
      svg: `
        <path class="c-stroke-fill" stroke-width="3.5" ${R} d="M55 56 C38 34 18 38 20 56 C22 72 40 72 55 60 Z M65 56 C82 34 102 38 100 56 C98 72 80 72 65 60 Z"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M55 63 C46 76 38 88 30 94 M65 63 C74 76 82 88 90 94"/>
        <circle class="c-stroke-fill2" stroke-width="3.5" cx="60" cy="58" r="9"/>
      `
    },

    /* ======================================================================
       5. SOUTH — EDITORIAL SYMBOLS & MARKS (10 stickers)
       ====================================================================== */
    {
      id: 'question-mark',
      name: 'Question mark',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: -360, y: 655, rot: -7, size: 88,
      tags: ['question', 'punctuation', 'help', 'mark', 'editorial'],
      colors: { fill: '#4dabf7', fill2: '#d0ebff', shade: '#1971c2', stroke: '#153e6b', cheek: '#74c0fc' },
      svg: `
        <path class="c-accent-stroke" stroke-width="11" opacity="0.34" ${R} d="M40 42 C40 24 78 22 78 43 C78 58 58 60 58 74"/>
        <path class="c-stroke" stroke-width="5.2" ${R} d="M39 40 C39 22 77 20 77 41 C77 56 57 58 57 72"/>
        <circle class="c-stroke-fill" stroke-width="3.6" cx="58" cy="92" r="6.5"/>
      `
    },
    {
      id: 'exclamation-mark',
      name: 'Exclamation mark',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: -175, y: 645, rot: 8, size: 88,
      tags: ['exclamation', 'bang', 'alert', 'punctuation', 'editorial'],
      colors: { fill: '#ff6b6b', fill2: '#ffe3e3', shade: '#e03131', stroke: '#691414', cheek: '#ff8787' },
      svg: `
        <path class="c-fill" d="M52 22 C54 18 66 18 68 22 L64 70 C63 74 57 74 56 70 Z"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M52 22 C54 18 66 18 68 22 L64 70 C63 74 57 74 56 70 Z"/>
        <circle class="c-stroke-fill" stroke-width="3.8" cx="60" cy="92" r="7"/>
        <path class="c-hi-stroke" stroke-width="2.5" opacity="0.8" ${R} d="M58 29 L58 52"/>
      `
    },
    {
      id: 'emphasis-pop',
      name: 'Emphasis pop',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 15, y: 655, rot: -5, size: 88,
      tags: ['emphasis', 'pop', 'lines', 'accent', 'editorial'],
      colors: { fill: '#fab005', fill2: '#fff3bf', shade: '#e67700', stroke: '#663c00', cheek: '#ffd43b' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.35" ${R} d="M34 84 L26 42 M60 76 L60 24 M86 84 L96 42"/>
        <path class="c-stroke" stroke-width="4.5" ${R} d="M34 82 L26 40 M60 74 L60 22 M86 82 L96 40"/>
        <circle class="c-fill" cx="24" cy="28" r="4"/>
        <circle class="c-fill" cx="98" cy="28" r="4"/>
      `
    },
    {
      id: 'sketch-ring',
      name: 'Sketch ring',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 205, y: 645, rot: 7, size: 90,
      tags: ['circle', 'ring', 'highlight', 'editorial', 'doodle'],
      colors: { fill: '#e64980', fill2: '#fcc2d7', shade: '#c2255c', stroke: '#691232', cheek: '#faa2c1' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.3" ${R} d="M66 24 C32 22 18 48 24 74 C30 98 84 102 96 72 C106 46 84 18 52 26"/>
        <path class="c-stroke" stroke-width="4.1" ${R} d="M68 23 C33 21 18 47 24 73 C30 97 84 101 96 71 C106 45 83 18 50 27"/>
      `
    },
    {
      id: 'hand-drawn-hashtag',
      name: 'Hand-drawn hashtag',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 385, y: 660, rot: -8, size: 88,
      tags: ['hashtag', 'number', 'pound', 'grid', 'editorial'],
      colors: { fill: '#2f9e44', fill2: '#b2f2bb', shade: '#2b8a3e', stroke: '#154d20', cheek: '#69db7c' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.32" ${R} d="M47 22 L38 98 M82 22 L73 98 M24 46 L98 44 M20 76 L94 74"/>
        <path class="c-stroke" stroke-width="4.4" ${R} d="M46 21 L37 97 M81 21 L72 97 M23 45 L97 43 M19 75 L93 73"/>
      `
    },
    {
      id: 'playful-triangle',
      name: 'Playful triangle',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: -355, y: 845, rot: 9, size: 88,
      tags: ['triangle', 'shape', 'geometry', 'editorial'],
      colors: { fill: '#ffa94d', fill2: '#ffe8cc', shade: '#e8590c', stroke: '#6b2a06', cheek: '#ffc078' },
      svg: `
        <path class="c-fill" d="M60 22 L98 92 L22 92 Z"/>
        <path class="c-shade" opacity="0.28" d="M60 22 L98 92 L62 92 Z"/>
        <path class="c-stroke" stroke-width="3.8" ${R} d="M60 22 L98 92 L22 92 Z"/>
        <path class="c-hi-stroke" stroke-width="2.8" opacity="0.8" ${R} d="M55 40 L40 72"/>
      `
    },
    {
      id: 'crayon-diamond',
      name: 'Crayon diamond',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: -170, y: 850, rot: -6, size: 88,
      tags: ['diamond', 'gem', 'rhombus', 'shape', 'editorial'],
      colors: { fill: '#74c0fc', fill2: '#e7f5ff', shade: '#1c7ed6', stroke: '#133e6b', cheek: '#a5d8ff' },
      svg: `
        <path class="c-fill" d="M60 16 L96 60 L60 104 L24 60 Z"/>
        <path class="c-fill-2" d="M60 16 L40 60 L60 104 L24 60 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M60 16 L96 60 L60 104 L24 60 Z"/>
        <path class="c-stroke" stroke-width="2.4" opacity="0.65" ${R} d="M60 22 L60 98 M30 60 L90 60"/>
      `
    },
    {
      id: 'diagonal-hatching',
      name: 'Diagonal hatching',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 20, y: 845, rot: 5, size: 90,
      tags: ['hatching', 'scribble', 'texture', 'lines', 'editorial'],
      colors: { fill: '#b197fc', fill2: '#e5dbff', shade: '#7950f2', stroke: '#3b1f7d', cheek: '#d0bfff' },
      svg: `
        <path class="c-accent-stroke" stroke-width="8" opacity="0.34" ${R} d="M26 48 L48 26 M24 72 L72 24 M28 94 L94 28 M50 96 L96 50 M74 94 L94 74"/>
        <path class="c-stroke" stroke-width="4" ${R} d="M25 47 L47 25 M23 71 L71 23 M27 93 L93 27 M49 95 L95 49 M73 93 L93 73"/>
      `
    },
    {
      id: 'bracket-pair',
      name: 'Bracket pair',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 208, y: 850, rot: -7, size: 88,
      tags: ['brackets', 'code', 'curly', 'editorial', 'syntax'],
      colors: { fill: '#15aabf', fill2: '#c5f6fa', shade: '#0b7285', stroke: '#0c434f', cheek: '#66d9e8' },
      svg: `
        <path class="c-accent-stroke" stroke-width="7.5" opacity="0.32" ${R} d="M44 26 C32 26 34 48 22 60 C34 72 32 94 44 94 M76 26 C88 26 86 48 98 60 C86 72 88 94 76 94"/>
        <path class="c-stroke" stroke-width="4.3" ${R} d="M44 25 C32 25 34 47 22 59 C34 71 32 93 44 93 M76 25 C88 25 86 47 98 59 C86 71 88 93 76 93"/>
      `
    },
    {
      id: 'underline-swoosh',
      name: 'Underline swoosh',
      category: 'editorial',
      categoryLabel: 'Editorial marks',
      x: 392, y: 842, rot: 4, size: 92,
      tags: ['underline', 'swoosh', 'accent', 'editorial', 'line'],
      colors: { fill: '#ff922b', fill2: '#ffe8cc', shade: '#e8590c', stroke: '#6b2906', cheek: '#ffc078' },
      svg: `
        <path class="c-accent-stroke" stroke-width="9" opacity="0.38" ${R} d="M16 62 C44 48 76 48 104 56 M26 78 C52 68 78 68 96 73"/>
        <path class="c-stroke" stroke-width="4.3" ${R} d="M16 60 C44 46 76 46 104 54 M26 76 C52 66 78 66 96 71"/>
      `
    },

    /* ======================================================================
       6. SOUTHEAST — PLAYFUL FELINES (8 stickers)
       ====================================================================== */
    {
      id: 'cozy-ginger-cat',
      name: 'Cozy ginger cat',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 725, y: 620, rot: -7, size: 100,
      tags: ['cat', 'kitten', 'feline', 'orange', 'cute'],
      colors: { fill: '#ffa94d', fill2: '#fff4e6', shade: '#e8590c', stroke: '#662b08', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M32 46 L29 22 L49 34 C56 32 64 32 71 34 L91 22 L88 46 C94 56 93 76 82 86 C71 95 49 95 38 86 C27 76 26 56 32 46 Z"/>
        <ellipse class="c-fill-2" cx="60" cy="76" rx="18" ry="12"/>
        <path class="c-shade" opacity="0.3" d="M55 34 L55 44 M60 33 L60 45 M65 34 L65 44"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M32 46 L29 22 L49 34 C56 32 64 32 71 34 L91 22 L88 46 C94 56 93 76 82 86 C71 95 49 95 38 86 C27 76 26 56 32 46 Z"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M54 35 V42 M60 34 V44 M66 35 V42"/>
        <circle class="c-eye" cx="48" cy="59" r="3.2"/>
        <circle class="c-eye" cx="72" cy="59" r="3.2"/>
        <circle class="c-hi" cx="47" cy="57.8" r="1"/>
        <circle class="c-hi" cx="71" cy="57.8" r="1"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M55 66 Q58 69 60 66 Q62 69 65 66"/>
        <path class="c-stroke" stroke-width="2.3" ${R} d="M21 61 L32 62 M22 69 L33 67 M99 61 L88 62 M98 69 L87 67"/>
        <ellipse class="c-cheek" opacity="0.58" cx="41" cy="65" rx="4.2" ry="2.5"/>
        <ellipse class="c-cheek" opacity="0.58" cx="79" cy="65" rx="4.2" ry="2.5"/>
      `
    },
    {
      id: 'heart-hug-kitty',
      name: 'Heart-hug kitty',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 915, y: 615, rot: 6, size: 100,
      tags: ['cat', 'kitty', 'heart', 'love', 'feline'],
      colors: { fill: '#fff4e6', fill2: '#ff6b8b', shade: '#e8d5c0', stroke: '#4d3b2c', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M35 44 L34 22 L51 33 C57 31 63 31 69 33 L86 22 L85 44 C91 54 90 82 78 92 C68 97 52 97 42 92 C30 82 29 54 35 44 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M35 44 L34 22 L51 33 C57 31 63 31 69 33 L86 22 L85 44 C91 54 90 82 78 92 C68 97 52 97 42 92 C30 82 29 54 35 44 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.1" ${R} d="M60 90 C49 82 44 74 46 68 C48 63 55 63 60 68 C65 63 72 63 74 68 C76 74 71 82 60 90 Z"/>
        <circle class="c-eye" cx="49" cy="51" r="3"/>
        <circle class="c-eye" cx="71" cy="51" r="3"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M56 57 Q60 60 64 57"/>
        <ellipse class="c-cheek" opacity="0.6" cx="42" cy="56" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.6" cx="78" cy="56" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'sleepy-loaf-cat',
      name: 'Sleepy loaf cat',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 1105, y: 625, rot: -5, size: 100,
      tags: ['cat', 'loaf', 'sleepy', 'nap', 'feline'],
      colors: { fill: '#ced4da', fill2: '#f1f3f5', shade: '#868e96', stroke: '#343a40', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M24 78 C20 58 32 42 54 42 C66 42 75 45 81 36 L87 26 L92 40 C99 48 100 68 94 79 C88 89 30 90 24 78 Z"/>
        <path class="c-shade" opacity="0.28" d="M40 45 V56 M50 43 V55 M60 44 V54"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M24 78 C20 58 32 42 54 42 C66 42 75 45 81 36 L87 26 L92 40 C99 48 100 68 94 79 C88 89 30 90 24 78 Z"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M23 76 C14 73 14 62 22 60"/>
        <path class="c-stroke" stroke-width="2.5" ${R} d="M72 60 Q76 63 80 60 M84 60 Q88 63 91 60 M79 67 Q82 70 85 67"/>
        <ellipse class="c-cheek" opacity="0.58" cx="69" cy="65" rx="3.4" ry="2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="92" cy="65" rx="3.2" ry="2"/>
        <path class="c-stroke" stroke-width="2.2" ${R} d="M36 28 H44 L36 36 H44 M49 20 H55 L49 26 H55"/>
      `
    },
    {
      id: 'bowtie-tabby',
      name: 'Bowtie tabby',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 1250, y: 660, rot: 8, size: 98,
      tags: ['cat', 'tabby', 'bowtie', 'fancy', 'feline'],
      colors: { fill: '#ffe08a', fill2: '#ff6b6b', shade: '#e09f1f', stroke: '#5e3d0a', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M34 45 L32 22 L50 33 C56 31 64 31 70 33 L88 22 L86 45 C92 55 90 74 79 82 C69 89 51 89 41 82 C30 74 28 55 34 45 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M34 45 L32 22 L50 33 C56 31 64 31 70 33 L88 22 L86 45 C92 55 90 74 79 82 C69 89 51 89 41 82 C30 74 28 55 34 45 Z"/>
        <path class="c-stroke-fill2" stroke-width="3" ${R} d="M60 88 L46 80 L46 96 Z M60 88 L74 80 L74 96 Z"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="60" cy="88" r="4"/>
        <circle class="c-eye" cx="49" cy="56" r="3"/>
        <circle class="c-eye" cx="71" cy="56" r="3"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M55 63 Q58 66 60 63 Q62 66 65 63"/>
        <ellipse class="c-cheek" opacity="0.58" cx="42" cy="62" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="78" cy="62" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'peekaboo-kitten',
      name: 'Peekaboo kitten',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 745, y: 765, rot: 7, size: 96,
      tags: ['cat', 'peek', 'kitten', 'cute', 'feline'],
      colors: { fill: '#f3d9fa', fill2: '#ffffff', shade: '#ae3ec9', stroke: '#4d195c', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M32 60 L30 30 L50 42 C56 40 64 40 70 42 L90 30 L88 60 C92 68 92 78 88 84 L32 84 C28 78 28 68 32 60 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M32 60 L30 30 L50 42 C56 40 64 40 70 42 L90 30 L88 60 C91 68 91 77 88 83"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M20 84 H100"/>
        <ellipse class="c-stroke-fill2" stroke-width="3.2" cx="42" cy="82" rx="9" ry="7"/>
        <ellipse class="c-stroke-fill2" stroke-width="3.2" cx="78" cy="82" rx="9" ry="7"/>
        <circle class="c-eye" cx="49" cy="62" r="3.1"/>
        <circle class="c-eye" cx="71" cy="62" r="3.1"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M56 68 Q60 72 64 68"/>
        <ellipse class="c-cheek" opacity="0.58" cx="41" cy="68" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="79" cy="68" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'scarf-cat',
      name: 'Scarf cat',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 935, y: 760, rot: -6, size: 98,
      tags: ['cat', 'cozy', 'scarf', 'winter', 'feline'],
      colors: { fill: '#e9d8a6', fill2: '#4dabf7', shade: '#ca6702', stroke: '#52340b', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M35 45 L33 22 L51 33 C57 31 63 31 69 33 L87 22 L85 45 C90 54 88 72 78 79 C68 85 52 85 42 79 C32 72 30 54 35 45 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M35 45 L33 22 L51 33 C57 31 63 31 69 33 L87 22 L85 45 C90 54 88 72 78 79 C68 85 52 85 42 79 C32 72 30 54 35 45 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.3" ${R} d="M35 76 C50 82 70 82 85 76 C87 82 85 88 80 89 C66 93 54 93 40 89 C35 88 33 82 35 76 Z"/>
        <path class="c-stroke-fill2" stroke-width="3.2" ${R} d="M68 87 L74 102 L84 99 L79 85 Z"/>
        <circle class="c-eye" cx="49" cy="56" r="3"/>
        <circle class="c-eye" cx="71" cy="56" r="3"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M56 63 Q60 66 64 63"/>
        <ellipse class="c-cheek" opacity="0.58" cx="42" cy="61" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.58" cx="78" cy="61" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'crowned-kitty',
      name: 'Crowned kitty',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 1125, y: 785, rot: 9, size: 98,
      tags: ['cat', 'crown', 'royal', 'princess', 'feline'],
      colors: { fill: '#ffc9de', fill2: '#ffd43b', shade: '#e64980', stroke: '#631936', cheek: '#ff8fa3' },
      svg: `
        <path class="c-stroke-fill2" stroke-width="3.1" ${R} d="M47 36 L44 20 L54 27 L60 17 L66 27 L76 20 L73 36 Z"/>
        <path class="c-fill" d="M34 52 L32 32 L49 41 C56 39 64 39 71 41 L88 32 L86 52 C92 62 90 80 79 89 C69 96 51 96 41 89 C30 80 28 62 34 52 Z"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M34 52 L32 32 L49 41 C56 39 64 39 71 41 L88 32 L86 52 C92 62 90 80 79 89 C69 96 51 96 41 89 C30 80 28 62 34 52 Z"/>
        <circle class="c-eye" cx="49" cy="64" r="3"/>
        <circle class="c-eye" cx="71" cy="64" r="3"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M55 71 Q58 74 60 71 Q62 74 65 71"/>
        <ellipse class="c-cheek" opacity="0.6" cx="42" cy="70" rx="3.8" ry="2.2"/>
        <ellipse class="c-cheek" opacity="0.6" cx="78" cy="70" rx="3.8" ry="2.2"/>
      `
    },
    {
      id: 'yarn-ball-cat',
      name: 'Yarn-ball cat',
      category: 'felines',
      categoryLabel: 'Playful felines',
      x: 1290, y: 840, rot: -8, size: 96,
      tags: ['cat', 'yarn', 'playful', 'toy', 'feline'],
      colors: { fill: '#a5d8ff', fill2: '#ff8787', shade: '#339af0', stroke: '#19436b', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M26 52 L25 32 L41 42 C46 40 53 40 58 42 L74 32 L73 52 C78 60 76 76 66 83 C56 89 42 89 32 83 C22 76 21 60 26 52 Z"/>
        <path class="c-stroke" stroke-width="3.5" ${R} d="M26 52 L25 32 L41 42 C46 40 53 40 58 42 L74 32 L73 52 C78 60 76 76 66 83 C56 89 42 89 32 83 C22 76 21 60 26 52 Z"/>
        <circle class="c-stroke-fill2" stroke-width="3.4" cx="84" cy="78" r="17"/>
        <path class="c-stroke" stroke-width="2.3" ${R} d="M72 70 C81 71 90 77 96 86 M70 82 C80 79 88 73 94 66 M78 93 C84 86 88 77 88 64 M98 86 C105 90 107 97 101 100"/>
        <circle class="c-eye" cx="40" cy="61" r="2.8"/>
        <circle class="c-eye" cx="58" cy="61" r="2.8"/>
        <path class="c-stroke" stroke-width="2.3" ${R} d="M46 67 Q49 70 52 67"/>
      `
    },

    /* ======================================================================
       7. SOUTHWEST — CHARACTER FIGURES (5 stickers)
       ====================================================================== */
    {
      id: 'pixel-buddy',
      name: 'Pixel buddy',
      category: 'characters',
      categoryLabel: 'Characters',
      x: -1150, y: 635, rot: -7, size: 96,
      tags: ['character', 'retro', 'game', 'buddy', 'cute'],
      colors: { fill: '#69db7c', fill2: '#ffe066', shade: '#2f9e44', stroke: '#174f22', cheek: '#ff8fa3' },
      svg: `
        <rect class="c-fill" x="26" y="30" width="68" height="58" rx="16"/>
        <path class="c-shade" opacity="0.28" d="M74 32 C85 32 94 40 94 50 V72 C94 81 86 88 76 88 H44 C64 82 78 64 74 32 Z"/>
        <rect class="c-stroke" stroke-width="3.7" x="26" y="30" width="68" height="58" rx="16"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M46 30 L40 18 M74 30 L80 18 M42 88 V99 M78 88 V99"/>
        <circle class="c-stroke-fill2" stroke-width="3" cx="40" cy="17" r="4.5"/>
        <circle class="c-stroke-fill2" stroke-width="3" cx="80" cy="17" r="4.5"/>
        <rect class="c-eye" x="43" y="50" width="8" height="10" rx="3"/>
        <rect class="c-eye" x="69" y="50" width="8" height="10" rx="3"/>
        <circle class="c-hi" cx="45.5" cy="53" r="1.5"/>
        <circle class="c-hi" cx="71.5" cy="53" r="1.5"/>
        <path class="c-stroke" stroke-width="2.8" ${R} d="M54 70 Q60 75 66 70"/>
      `
    },
    {
      id: 'little-astronaut',
      name: 'Little astronaut',
      category: 'characters',
      categoryLabel: 'Characters',
      x: -945, y: 625, rot: 8, size: 100,
      tags: ['character', 'space', 'astronaut', 'helmet', 'cute'],
      colors: { fill: '#f1f3f5', fill2: '#74c0fc', shade: '#adb5bd', stroke: '#2b3036', cheek: '#ff8fa3' },
      svg: `
        <circle class="c-fill" cx="60" cy="50" r="30"/>
        <rect class="c-fill-2" x="38" y="35" width="44" height="30" rx="14"/>
        <path class="c-fill" d="M39 78 C43 74 77 74 81 78 L84 96 C70 100 50 100 36 96 Z"/>
        <circle class="c-stroke" stroke-width="3.6" cx="60" cy="50" r="30"/>
        <rect class="c-stroke" stroke-width="3.2" x="38" y="35" width="44" height="30" rx="14"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M39 78 L36 96 C50 100 70 100 84 96 L81 78 M38 82 L25 76 M82 82 L95 74"/>
        <path class="c-hi-stroke" stroke-width="3" opacity="0.85" ${R} d="M46 42 C51 39 58 39 63 40"/>
        <circle class="c-eye" cx="52" cy="51" r="2.7"/>
        <circle class="c-eye" cx="68" cy="51" r="2.7"/>
        <path class="c-stroke" stroke-width="2.3" ${R} d="M57 56 Q60 59 63 56"/>
      `
    },
    {
      id: 'cozy-ghost',
      name: 'Cozy ghost',
      category: 'characters',
      categoryLabel: 'Characters',
      x: -745, y: 640, rot: -6, size: 96,
      tags: ['character', 'ghost', 'spooky', 'cute', 'boo'],
      colors: { fill: '#f8f9fa', fill2: '#d0bfff', shade: '#ced4da', stroke: '#343a40', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill" d="M30 88 V52 C30 30 44 20 60 20 C76 20 90 30 90 52 V88 C86 94 78 93 74 87 C69 94 63 94 60 87 C57 94 51 94 46 87 C42 93 34 94 30 88 Z"/>
        <path class="c-shade" opacity="0.32" d="M72 24 C83 30 88 41 88 56 V88 C84 92 78 91 75 87 C80 73 82 44 72 24 Z"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M30 88 V52 C30 30 44 20 60 20 C76 20 90 30 90 52 V88 C86 94 78 93 74 87 C69 94 63 94 60 87 C57 94 51 94 46 87 C42 93 34 94 30 88 Z"/>
        <circle class="c-eye" cx="49" cy="52" r="3.4"/>
        <circle class="c-eye" cx="71" cy="52" r="3.4"/>
        <circle class="c-hi" cx="47.8" cy="50.8" r="1.1"/>
        <circle class="c-hi" cx="69.8" cy="50.8" r="1.1"/>
        <ellipse class="c-cheek" opacity="0.6" cx="40" cy="59" rx="4.2" ry="2.4"/>
        <ellipse class="c-cheek" opacity="0.6" cx="80" cy="59" rx="4.2" ry="2.4"/>
        <ellipse class="c-stroke" stroke-width="2.6" cx="60" cy="61" rx="3.5" ry="4.5"/>
      `
    },
    {
      id: 'mushroom-sprout',
      name: 'Mushroom pal',
      category: 'characters',
      categoryLabel: 'Characters',
      x: -1045, y: 765, rot: 7, size: 96,
      tags: ['character', 'mushroom', 'toad', 'forest', 'cute'],
      colors: { fill: '#ff6b6b', fill2: '#fff4e6', shade: '#e03131', stroke: '#691818', cheek: '#ff8fa3' },
      svg: `
        <path class="c-fill-2" d="M41 64 H79 C81 78 78 96 60 96 C42 96 39 78 41 64 Z"/>
        <path class="c-fill" d="M20 62 C20 34 38 20 60 20 C82 20 100 34 100 62 C88 68 32 68 20 62 Z"/>
        <circle class="c-fill-2" cx="42" cy="40" r="7"/>
        <circle class="c-fill-2" cx="64" cy="31" r="6"/>
        <circle class="c-fill-2" cx="81" cy="46" r="6.5"/>
        <path class="c-stroke" stroke-width="3.6" ${R} d="M41 66 C40 80 43 96 60 96 C77 96 80 80 79 66"/>
        <path class="c-stroke" stroke-width="3.7" ${R} d="M20 62 C20 34 38 20 60 20 C82 20 100 34 100 62 C88 68 32 68 20 62 Z"/>
        <circle class="c-eye" cx="52" cy="77" r="2.9"/>
        <circle class="c-eye" cx="68" cy="77" r="2.9"/>
        <path class="c-stroke" stroke-width="2.4" ${R} d="M56 83 Q60 86 64 83"/>
        <ellipse class="c-cheek" opacity="0.58" cx="46" cy="82" rx="3.5" ry="2.1"/>
        <ellipse class="c-cheek" opacity="0.58" cx="74" cy="82" rx="3.5" ry="2.1"/>
      `
    },
    {
      id: 'pocket-robot',
      name: 'Pocket robot',
      category: 'characters',
      categoryLabel: 'Characters',
      x: -835, y: 775, rot: -9, size: 96,
      tags: ['character', 'robot', 'bot', 'cute', 'tech'],
      colors: { fill: '#a5d8ff', fill2: '#ffd43b', shade: '#339af0', stroke: '#193d63', cheek: '#ff8fa3' },
      svg: `
        <path class="c-stroke" stroke-width="3.4" ${R} d="M60 32 V19"/>
        <circle class="c-stroke-fill2" stroke-width="3.2" cx="60" cy="17" r="5"/>
        <rect class="c-fill" x="28" y="32" width="64" height="52" rx="14"/>
        <path class="c-shade" opacity="0.25" d="M74 34 C84 34 92 41 92 50 V70 C92 78 85 84 76 84 H48 C65 78 76 62 74 34 Z"/>
        <rect class="c-stroke" stroke-width="3.7" x="28" y="32" width="64" height="52" rx="14"/>
        <path class="c-stroke" stroke-width="3.4" ${R} d="M28 54 H19 M92 54 H101 M44 84 V96 M76 84 V96"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="47" cy="56" r="6"/>
        <circle class="c-stroke-fill2" stroke-width="2.8" cx="73" cy="56" r="6"/>
        <circle class="c-eye" cx="47" cy="56" r="2.4"/>
        <circle class="c-eye" cx="73" cy="56" r="2.4"/>
        <path class="c-stroke" stroke-width="2.6" ${R} d="M49 71 H71"/>
      `
    }
  ];
})();
